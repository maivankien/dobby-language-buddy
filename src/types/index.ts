export interface IVocabItem {
    word_target: string
    word_english: string
    phonetic: string
    example_sentence: string
}

export interface IVocabSet {
    id: string
    topic: string
    language: string
    vocab_list: IVocabItem[]
    saved_at: string
}

export interface IChatMessage {
    id: string
    sender: 'user' | 'dobby'
    content: string
    timestamp: string
    vocabData?: IVocabResponse
}

export interface IVocabResponse {
    topic: string
    target_language: string
    vocab_list: IVocabItem[]
    message_from_dobby: string
}

export interface ILanguage {
    code: string
    name: string
    flag: string
}

export interface IAddVocabSetResult {
    merged: boolean
    newWordsCount: number
    existingWordsCount?: number
}

export interface IAppContext {
    selectedLanguage: string
    setSelectedLanguage: (language: string) => void
    vocabSets: IVocabSet[]
    addVocabSet: (vocabSet: Omit<IVocabSet, 'id' | 'saved_at'>) => IAddVocabSetResult
    removeVocabSet: (id: string) => void
    removeWordFromSet: (setId: string, wordIndex: number) => void
}

export interface IQuizQuestion {
    id: string
    type: 'meaning' | 'spelling'
    word: IVocabItem
    question: string
    options: string[]
    correctAnswer: string
}

export interface IQuizAnswer {
    questionId: string
    selectedAnswer: string
    isCorrect: boolean
}

export interface IQuizResult {
    id: string
    vocabSetId?: string
    vocabSetTitle?: string
    score: number
    total: number
    answers: IQuizAnswer[]
    completedAt: string
}

export interface IQuizSession {
    questions: IQuizQuestion[]
    currentIndex: number
    answers: IQuizAnswer[]
    vocabSetId?: string
    vocabSetTitle?: string
}
