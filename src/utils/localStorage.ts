import type { IVocabSet, IQuizResult } from '../types'
import { v4 as uuidv4 } from 'uuid'

const VOCAB_SETS_KEY = 'dobby_vocab_sets'

export const saveVocabSet = (vocabSet: IVocabSet): void => {
    const existingSets = getVocabSets()
    const updatedSets = [...existingSets, vocabSet]
    localStorage.setItem(VOCAB_SETS_KEY, JSON.stringify(updatedSets))
}

export const getVocabSets = (): IVocabSet[] => {
    try {
        const data = localStorage.getItem(VOCAB_SETS_KEY)
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error('Error reading vocab sets from localStorage:', error)
        return []
    }
}

export const deleteVocabSet = (id: string): void => {
    const existingSets = getVocabSets()
    const updatedSets = existingSets.filter(set => set.id !== id)
    localStorage.setItem(VOCAB_SETS_KEY, JSON.stringify(updatedSets))
}

export const deleteWordFromSet = (setId: string, wordIndex: number): void => {
    const existingSets = getVocabSets()
    const updatedSets = existingSets.map(set => {
        if (set.id === setId) {
            const updatedVocabList = set.vocab_list.filter((_, index) => index !== wordIndex)
            return { ...set, vocab_list: updatedVocabList }
        }
        return set
    })
    localStorage.setItem(VOCAB_SETS_KEY, JSON.stringify(updatedSets))
}

export const updateVocabSet = (updatedSet: IVocabSet): void => {
    const existingSets = getVocabSets()
    const updatedSets = existingSets.map(set => 
        set.id === updatedSet.id ? updatedSet : set
    )
    localStorage.setItem(VOCAB_SETS_KEY, JSON.stringify(updatedSets))
}

const FIREWORKS_API_KEY_KEY = 'dobby_fireworks_api_key'

export const saveFireworksApiKey = (apiKey: string): void => {
    localStorage.setItem(FIREWORKS_API_KEY_KEY, apiKey)
}

export const getFireworksApiKey = (): string | null => {
    try {
        return localStorage.getItem(FIREWORKS_API_KEY_KEY)
    } catch (error) {
        console.error('Error reading API key from localStorage:', error)
        return null
    }
}

export const deleteFireworksApiKey = (): void => {
    localStorage.removeItem(FIREWORKS_API_KEY_KEY)
}

const QUIZ_RESULTS_KEY = 'dobby_quiz_results'

export const saveQuizResult = (result: Omit<IQuizResult, 'id'>): IQuizResult => {
    const quizResult: IQuizResult = {
        ...result,
        id: uuidv4(),
    }
    const existingResults = getQuizResults()
    const updatedResults = [quizResult, ...existingResults]
    localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(updatedResults))
    return quizResult
}

export const getQuizResults = (): IQuizResult[] => {
    try {
        const data = localStorage.getItem(QUIZ_RESULTS_KEY)
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error('Error reading quiz results from localStorage:', error)
        return []
    }
}
