import type { IVocabSet, IVocabItem, IQuizQuestion } from '@/types'

const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

const generateTypos = (word: string): string[] => {
    const typos: string[] = []
    if (word.length === 0) return typos

    // Swap adjacent characters
    for (let i = 0; i < word.length - 1; i++) {
        const chars = word.split('')
        ;[chars[i], chars[i + 1]] = [chars[i + 1], chars[i]]
        typos.push(chars.join(''))
    }

    // Change one character
    for (let i = 0; i < Math.min(3, word.length); i++) {
        const chars = word.split('')
        const codePoint = chars[i].codePointAt(0) || 0
        if (codePoint >= 97 && codePoint <= 122) {
            const newChar = String.fromCodePoint(((codePoint - 97 + 1) % 26) + 97)
            chars[i] = newChar
            typos.push(chars.join(''))
        }
    }

    // Remove one character
    if (word.length > 1) {
        for (let i = 0; i < Math.min(2, word.length); i++) {
            typos.push(word.slice(0, i) + word.slice(i + 1))
        }
    }

    // Add one character
    if (word.length < 20) {
        for (let i = 0; i < Math.min(2, word.length + 1); i++) {
            typos.push(word.slice(0, i) + 'a' + word.slice(i))
        }
    }

    return [...new Set(typos)].filter(typo => typo !== word).slice(0, 3)
}

const generateDistractors = (
    correctAnswer: string,
    allVocabItems: IVocabItem[],
    getAnswer: (item: IVocabItem) => string
): string[] => {
    const allAnswers = allVocabItems.map(getAnswer).filter(ans => ans !== correctAnswer && ans.trim() !== '')
    const uniqueAnswers = [...new Set(allAnswers)]
    const shuffled = shuffleArray(uniqueAnswers)
    return shuffled.slice(0, 3)
}

export const generateMeaningQuestion = (
    word: IVocabItem,
    allVocabItems: IVocabItem[]
): IQuizQuestion => {
    const correctAnswer = word.word_english.trim()
    
    // Get all unique answers from vocab, excluding correct answer
    const allAnswers = allVocabItems
        .map(item => item.word_english.trim())
        .filter(ans => ans !== '' && ans.toLowerCase() !== correctAnswer.toLowerCase())
    const uniqueAnswers = [...new Set(allAnswers.map(a => a.toLowerCase()))]
        .map(lower => allAnswers.find(a => a.toLowerCase() === lower)!)
    
    // Get initial distractors
    let distractors = generateDistractors(correctAnswer, allVocabItems, item => item.word_english)
        .map(d => d.trim())
        .filter(d => d !== '' && d.toLowerCase() !== correctAnswer.toLowerCase())
    
    // Ensure we have exactly 3 unique distractors
    const usedDistractors = new Set<string>()
    for (const distractor of distractors) {
        usedDistractors.add(distractor.toLowerCase())
    }
    
    // Fill up to 3 distractors
    for (const answer of uniqueAnswers) {
        if (distractors.length >= 3) break
        if (!usedDistractors.has(answer.toLowerCase())) {
            distractors.push(answer)
            usedDistractors.add(answer.toLowerCase())
        }
    }
    
    // Shuffle and take first 3
    distractors = shuffleArray(distractors).slice(0, 3)
    
    // Combine correct answer with distractors and ensure uniqueness
    const uniqueOptionsMap = new Map<string, string>()
    
    // Add correct answer first
    uniqueOptionsMap.set(correctAnswer.toLowerCase(), correctAnswer)
    
    // Add distractors (skip if duplicate)
    for (const distractor of distractors) {
        if (!uniqueOptionsMap.has(distractor.toLowerCase())) {
            uniqueOptionsMap.set(distractor.toLowerCase(), distractor)
        }
        if (uniqueOptionsMap.size >= 4) break
    }
    
    // If we still don't have 4 options, fill with available answers
    if (uniqueOptionsMap.size < 4) {
        for (const answer of uniqueAnswers) {
            if (uniqueOptionsMap.size >= 4) break
            if (!uniqueOptionsMap.has(answer.toLowerCase())) {
                uniqueOptionsMap.set(answer.toLowerCase(), answer)
            }
        }
    }
    
    // Convert to array and ensure correctAnswer is included
    const options = Array.from(uniqueOptionsMap.values())
    if (!options.some(opt => opt.toLowerCase() === correctAnswer.toLowerCase())) {
        options[0] = correctAnswer
    }
    
    return {
        id: `meaning-${Date.now()}-${Math.random()}`,
        type: 'meaning',
        word,
        question: `What does "${word.word_target}" mean?`,
        options: shuffleArray([...new Set(options)]), // Shuffle and remove any duplicates
        correctAnswer,
    }
}

export const generateSpellingQuestion = (
    word: IVocabItem,
    allVocabItems: IVocabItem[]
): IQuizQuestion => {
    const correctAnswer = word.word_target.trim()
    const typos = generateTypos(correctAnswer)
    let distractors = generateDistractors(correctAnswer, allVocabItems, item => item.word_target.trim())
    
    // Remove any distractors that match the correct answer
    distractors = distractors.filter(d => d.trim().toLowerCase() !== correctAnswer.toLowerCase())
    const filteredTypos = typos.filter(t => t.trim().toLowerCase() !== correctAnswer.toLowerCase())
    
    // Combine typos and distractors, ensuring uniqueness
    const combinedDistractors = [...filteredTypos, ...distractors]
    const uniqueDistractors = Array.from(new Set(combinedDistractors.map(d => d.toLowerCase())))
        .map(lower => combinedDistractors.find(d => d.toLowerCase() === lower)!)
        .filter(d => d && d.trim().toLowerCase() !== correctAnswer.toLowerCase())
    
    let finalDistractors = uniqueDistractors.slice(0, 3)
    
    // If we still don't have enough, generate more typos
    if (finalDistractors.length < 3) {
        const usedDistractors = new Set(finalDistractors.map(d => d.toLowerCase()))
        let attempts = 0
        while (finalDistractors.length < 3 && attempts < 10) {
            const moreTypos = generateTypos(correctAnswer)
            const newTypos = moreTypos.filter(t => 
                t.trim().toLowerCase() !== correctAnswer.toLowerCase() && 
                !usedDistractors.has(t.toLowerCase())
            )
            if (newTypos.length > 0) {
                finalDistractors.push(...newTypos.slice(0, 3 - finalDistractors.length))
                for (const t of newTypos) {
                    usedDistractors.add(t.toLowerCase())
                }
            }
            attempts++
        }
        
        // If still not enough, get from other vocab words
        if (finalDistractors.length < 3) {
            const allTargetWords = allVocabItems
                .map(item => item.word_target.trim())
                .filter(w => w !== '' && w.toLowerCase() !== correctAnswer.toLowerCase())
            const uniqueTargetWords = [...new Set(allTargetWords.map(w => w.toLowerCase()))]
                .map(lower => allTargetWords.find(w => w.toLowerCase() === lower)!)
            
            const usedOptions = new Set(finalDistractors.map(d => d.toLowerCase()))
            const availableWords = uniqueTargetWords.filter(w => !usedOptions.has(w.toLowerCase()))
            
            finalDistractors.push(...availableWords.slice(0, 3 - finalDistractors.length))
        }
    }
    
    // Ensure correctAnswer is in the options
    const uniqueOptionsMap = new Map<string, string>()
    uniqueOptionsMap.set(correctAnswer.toLowerCase(), correctAnswer)
    
    for (const distractor of finalDistractors) {
        if (!uniqueOptionsMap.has(distractor.toLowerCase())) {
            uniqueOptionsMap.set(distractor.toLowerCase(), distractor)
        }
        if (uniqueOptionsMap.size >= 4) break
    }
    
    const options = Array.from(uniqueOptionsMap.values())
    if (!options.some(opt => opt.toLowerCase() === correctAnswer.toLowerCase())) {
        options[0] = correctAnswer
    }

    return {
        id: `spelling-${Date.now()}-${Math.random()}`,
        type: 'spelling',
        word,
        question: `How do you spell "${word.word_english}"?`,
        options: shuffleArray([...new Set(options)]), // Shuffle and remove any duplicates
        correctAnswer,
    }
}

export const generateQuizQuestions = (
    vocabSets: IVocabSet[],
    selectedSetId: string | null,
    questionCount: number
): { questions: IQuizQuestion[], vocabSetTitle?: string } => {
    let availableWords: IVocabItem[] = []
    let vocabSetTitle: string | undefined

    if (selectedSetId && selectedSetId !== 'all') {
        const selectedSet = vocabSets.find(set => set.id === selectedSetId)
        if (selectedSet) {
            availableWords = selectedSet.vocab_list
            vocabSetTitle = selectedSet.topic
        }
    } else {
        availableWords = vocabSets.flatMap(set => set.vocab_list)
        vocabSetTitle = 'All Sets'
    }

    if (availableWords.length === 0) {
        return { questions: [], vocabSetTitle }
    }

    const shuffledWords = shuffleArray(availableWords).slice(0, questionCount)
    const allWords = vocabSets.flatMap(set => set.vocab_list)

    const questions: IQuizQuestion[] = []
    const questionTypes: ('meaning' | 'spelling')[] = []

    for (let i = 0; i < shuffledWords.length; i++) {
        questionTypes.push(i % 2 === 0 ? 'meaning' : 'spelling')
    }

    const shuffledTypes = shuffleArray(questionTypes)

    for (const [index, word] of shuffledWords.entries()) {
        const questionType = shuffledTypes[index] || (Math.random() > 0.5 ? 'meaning' : 'spelling')
        
        if (questionType === 'meaning') {
            questions.push(generateMeaningQuestion(word, allWords))
        } else {
            questions.push(generateSpellingQuestion(word, allWords))
        }
    }

    return { questions: shuffleArray(questions), vocabSetTitle }
}

export const getDobbyFeedback = (score: number, total: number): string => {
    const percentage = (score / total) * 100
    const feedbacks: Record<string, string[]> = {
        '100': [
            "Brilliant! You nailed every single one!",
            "Flawless victory — Dobby is impressed!",
            "Outstanding! You're unstoppable!",
            "Perfect memory! You're a true word wizard",
            "Dobby bows — you have mastered today's quiz"
        ],
        '80-99': [
            "Keep shining! Just a few words left to perfect",
            "Strong work — your vocabulary is leveling up fast!",
            "Almost flawless! Keep polishing those edges",
            "Fantastic job — consistency is your magic!",
            "Dobby says: wisdom grows word by word."
        ],
        '60-79': [
            "Good effort! You're on the right path.",
            "Solid progress — review those tricky ones tomorrow!",
            "Step by step, you're growing stronger",
            "Not bad at all! Dobby is proud of your focus.",
            "You're improving — keep the habit alive!"
        ],
        '40-59': [
            "Hmm... not your best day, but Dobby believes in you!",
            "Let's review these words again — tomorrow will be better.",
            "Every mistake is a seed of improvement!",
            "You remembered some — now let's fill the gaps!",
            "A little revision and you'll shine again!"
        ],
        '0-39': [
            "That was tough! Let's try again after a quick break",
            "Even wizards have off days — rest and retry!",
            "Don't give up — Dobby never does!",
            "Every master starts with mistakes. You're learning!",
            "Wipe the dust off your vocabulary and give it another go!"
        ]
    }

    let category: string
    if (percentage === 100) {
        category = '100'
    } else if (percentage >= 80) {
        category = '80-99'
    } else if (percentage >= 60) {
        category = '60-79'
    } else if (percentage >= 40) {
        category = '40-59'
    } else {
        category = '0-39'
    }

    const messages = feedbacks[category]
    return messages[Math.floor(Math.random() * messages.length)]
}
