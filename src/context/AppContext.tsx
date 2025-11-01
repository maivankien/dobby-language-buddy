import { v4 as uuidv4 } from 'uuid'
import { DEFAULT_LANGUAGE } from '@/utils/constants'
import type { IAppContext, IVocabSet } from '@/types'
import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react'
import { getVocabSets, saveVocabSet, deleteVocabSet, deleteWordFromSet, updateVocabSet } from '@/utils/localStorage'

const AppContext = createContext<IAppContext | undefined>(undefined)

interface AppProviderProps {
    children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>(DEFAULT_LANGUAGE)
    const [vocabSets, setVocabSets] = useState<IVocabSet[]>([])

    useEffect(() => {
        const savedSets = getVocabSets()
        setVocabSets(savedSets)
    }, [])

    const addVocabSet = (vocabSetData: Omit<IVocabSet, 'id' | 'saved_at'>) => {
        const existingSet = vocabSets.find(
            set => set.topic.toLowerCase() === vocabSetData.topic.toLowerCase()
                && set.language === vocabSetData.language
        )

        if (existingSet) {
            const existingWords = new Set(existingSet.vocab_list.map(word => word.word_target.toLowerCase()))
            const newWords = vocabSetData.vocab_list.filter(
                word => !existingWords.has(word.word_target.toLowerCase())
            )

            if (newWords.length > 0) {
                const mergedVocabSet: IVocabSet = {
                    ...existingSet,
                    vocab_list: [...existingSet.vocab_list, ...newWords],
                    saved_at: new Date().toISOString(),
                }

                setVocabSets(prev => prev.map(set =>
                    set.id === existingSet.id ? mergedVocabSet : set
                ))
                updateVocabSet(mergedVocabSet)
                return { merged: true, newWordsCount: newWords.length, existingWordsCount: existingSet.vocab_list.length }
            } else {
                return { merged: true, newWordsCount: 0, existingWordsCount: existingSet.vocab_list.length }
            }
        } else {
            const newVocabSet: IVocabSet = {
                ...vocabSetData,
                id: uuidv4(),
                saved_at: new Date().toISOString(),
            }

            setVocabSets(prev => [...prev, newVocabSet])
            saveVocabSet(newVocabSet)
            return { merged: false, newWordsCount: vocabSetData.vocab_list.length }
        }
    }

    const removeVocabSet = (id: string) => {
        setVocabSets(prev => prev.filter(set => set.id !== id))
        deleteVocabSet(id)
    }
    const removeWordFromSet = (setId: string, wordIndex: number) => {
        setVocabSets(prev => {
            const index = prev.findIndex(set => set.id === setId);
            if (index === -1) return prev

            const newSets = [...prev]
            const setToUpdate = newSets[index]

            const newVocabList = [
                ...setToUpdate.vocab_list.slice(0, wordIndex),
                ...setToUpdate.vocab_list.slice(wordIndex + 1),
            ]

            newSets[index] = {
                ...setToUpdate,
                vocab_list: newVocabList,
            }

            return newSets
        })

        deleteWordFromSet(setId, wordIndex)
    }



    const value: IAppContext = useMemo(() => ({
        selectedLanguage,
        setSelectedLanguage,
        vocabSets,
        addVocabSet,
        removeVocabSet,
        removeWordFromSet,
    }), [selectedLanguage, vocabSets])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = (): IAppContext => {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
