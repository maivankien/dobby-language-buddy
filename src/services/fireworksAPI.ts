import type { IVocabResponse, IVocabItem } from '@/types'
import { getFireworksApiKey } from '@/utils/localStorage'

export const callFireworksAPI = async (requestData: {
    selected_language: string
    chat_message: string
}): Promise<IVocabResponse> => {
    const apiKey = getFireworksApiKey()
    const endpoint = 'https://api.fireworks.ai/inference/v1/chat/completions'
    const model = 'accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new'

    if (!apiKey) {
        throw new Error('Missing Fireworks API key. Please configure it in Settings.')
    }

    const systemPrompt = `
        You are Dobby, a multilingual AI vocabulary assistant.
        
        Your task:
        Generate a clean, well-structured vocabulary list based on the user’s topic and target language.
        
        Return ONLY a valid JSON object with this structure:
        {
        "topic": "<topic in English>",
        "target_language": "<target language>",
        "word_count": <number>,
        "words": [
            {
            "english": "<English word>",
            "target": "<translation in target language>",
            "phonetic": "<phonetic transcription if available>",
            "example": "<short example sentence in English>"
            }
        ]
        }
        
        Rules:
        - Use simple, practical words suitable for CEFR A2–B1 level learners.
        - Keep examples short (max 10 words).
        - Never include grammar explanations — only vocabulary.
        - If the user doesn’t specify the number, default to 10 words.
        - Return pure JSON (no markdown, no text, no bullet points).
        - Ensure translations are accurate in the requested target language.
    `;
    

    const userContent = `
    Target language: ${requestData.selected_language}
    Instruction: ${requestData.chat_message}
    `;

    const body = {
        model: model,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
        ],
        temperature: 0.6,
    }

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            throw new Error(`Fireworks API error ${res.status}`)
        }

        const data = await res.json()
        const content: string = data?.choices?.[0]?.message?.content ?? ''

        const parsed = parseJsonFromText(content)
        const mapped = mapDobbyJsonToVocabResponse(parsed)
        return mapped
    } catch (err) {
        console.error('Fireworks API call failed:', err)
        throw new Error('Failed to generate vocabulary. Please try again.')
    }
}

function parseJsonFromText(text: string): any {
    const trimmed = text.trim()

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
            return JSON.parse(trimmed)
        } catch { }
    }

    const fenceMatch = new RegExp(/\{[\s\S]*\}/).exec(trimmed)

    if (fenceMatch) {
        try {
            return JSON.parse(fenceMatch[0])
        } catch { }
    }

    throw new Error('Model did not return parseable JSON')
}

function mapDobbyJsonToVocabResponse(json: any): IVocabResponse {
    const topic: string = json?.topic || 'Vocabulary'
    const targetLanguage: string = json?.target_language || 'Unknown'
    const words: any[] = Array.isArray(json?.words) ? json.words : []

    const vocabList: IVocabItem[] = words.map(w => ({
        word_target: String(w?.target ?? ''),
        word_english: String(w?.english ?? ''),
        phonetic: String(w?.phonetic ?? ''),
        example_sentence: String(w?.example ?? ''),
    })).filter(item => item.word_target || item.word_english)

    const messageFromDobby = `Here are ${vocabList.length || json?.word_count || 10} words about ${topic}`

    return {
        topic: topic,
        target_language: targetLanguage,
        vocab_list: vocabList,
        message_from_dobby: messageFromDobby,
    }
}
