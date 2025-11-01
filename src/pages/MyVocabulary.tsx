import React, { useState } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { VocabSetCard } from '@/components/VocabSetCard'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { WordDetailModal } from '@/components/WordDetailModal'
import { AddVocabModal } from '@/components/AddVocabModal'
import { useApp } from '@/context/AppContext'
import type { IVocabSet, IAddVocabSetResult } from '@/types'
import { DOBBY_MESSAGES } from '@/utils/constants'

export const MyVocabulary: React.FC = () => {
    const { vocabSets, removeVocabSet, removeWordFromSet } = useApp()
    const [isAddVocabModalOpen, setIsAddVocabModalOpen] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean
        vocabSetId: string
        vocabSetTitle: string
    }>({
        isOpen: false,
        vocabSetId: '',
        vocabSetTitle: '',
    })
    const [wordDetail, setWordDetail] = useState<{
        isOpen: boolean
        vocabSet: IVocabSet | null
        wordIndex: number
    }>({
        isOpen: false,
        vocabSet: null,
        wordIndex: -1,
    })
    const [deleteWordConfirm, setDeleteWordConfirm] = useState<{
        isOpen: boolean
        vocabSetId: string
        wordIndex: number
        wordText: string
    }>({
        isOpen: false,
        vocabSetId: '',
        wordIndex: -1,
        wordText: '',
    })

    const handleDeleteVocabSet = (id: string) => {
        const vocabSet = vocabSets.find(set => set.id === id)
        if (vocabSet) {
            setDeleteConfirm({
                isOpen: true,
                vocabSetId: id,
                vocabSetTitle: vocabSet.topic,
            })
        }
    }

    const confirmDeleteVocabSet = () => {
        removeVocabSet(deleteConfirm.vocabSetId)
        setDeleteConfirm({
            isOpen: false,
            vocabSetId: '',
            vocabSetTitle: '',
        })
    }

    const handleViewWord = (vocabSet: IVocabSet, wordIndex: number) => {
        setWordDetail({
            isOpen: true,
            vocabSet,
            wordIndex,
        })
    }

    const handleDeleteWord = (setId: string, wordIndex: number) => {
        const vocabSet = vocabSets.find(set => set.id === setId)
        const word = vocabSet?.vocab_list[wordIndex]
        if (word) {
            setDeleteWordConfirm({
                isOpen: true,
                vocabSetId: setId,
                wordIndex,
                wordText: word.word_target,
            })
        }
    }

    const confirmDeleteWord = () => {
        removeWordFromSet(deleteWordConfirm.vocabSetId, deleteWordConfirm.wordIndex)
        setDeleteWordConfirm({
            isOpen: false,
            vocabSetId: '',
            wordIndex: -1,
            wordText: '',
        })
        
        if (wordDetail.isOpen && wordDetail.vocabSet?.id === deleteWordConfirm.vocabSetId && wordDetail.wordIndex === deleteWordConfirm.wordIndex) {
            setWordDetail({
                isOpen: false,
                vocabSet: null,
                wordIndex: -1,
            })
        }
    }

    const handleAddVocabSuccess = (_: IAddVocabSetResult) => {
    }

    const groupedVocabSets = vocabSets.reduce((groups, vocabSet) => {
        const key = `${vocabSet.language}-${vocabSet.topic}`
        if (!groups[key]) {
            groups[key] = []
        }
        groups[key].push(vocabSet)
        return groups
    }, {} as Record<string, IVocabSet[]>)

    if (vocabSets.length === 0) {
        return (
            <>
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-8 sm:py-12 animate-fadeIn">
                        <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                            📚 My Vocabulary
                        </h2>
                        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-4">
                            {DOBBY_MESSAGES.NO_VOCAB}
                        </p>
                        <div className="glass rounded-lg sm:rounded-xl p-4 sm:p-6 max-w-md mx-auto mb-4">
                            <p className="text-gray-700 text-xs sm:text-sm mb-4">
                                💡 <strong>Tip:</strong> Start chatting with Dobby to learn new vocabulary words, or add them manually!
                            </p>
                            <button
                                onClick={() => setIsAddVocabModalOpen(true)}
                                className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer font-medium text-sm sm:text-base btn-hover-lift w-full"
                            >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Add Vocabulary</span>
                            </button>
                        </div>
                    </div>
                </div>

                <AddVocabModal
                    isOpen={isAddVocabModalOpen}
                    vocabSets={vocabSets}
                    onClose={() => setIsAddVocabModalOpen(false)}
                    onSuccess={handleAddVocabSuccess}
                />
            </>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <div className="animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                            📚 My Vocabulary
                        </h2>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">
                            {vocabSets.length} vocabulary set{vocabSets.length === 1 ? '' : 's'} saved
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAddVocabModalOpen(true)}
                        className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer font-medium text-sm sm:text-base btn-hover-lift"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Add Vocabulary</span>
                    </button>
                </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
                {Object.entries(groupedVocabSets).map(([key, sets], groupIndex) => (
                    <div key={key} className="animate-fadeIn" style={{ animationDelay: `${groupIndex * 100}ms` }}>
                        {sets.map((vocabSet, setIndex) => (
                            <div key={vocabSet.id} className="animate-fadeIn" style={{ animationDelay: `${(groupIndex * 100) + (setIndex * 50)}ms` }}>
                                <VocabSetCard
                                    vocabSet={vocabSet}
                                    onDelete={handleDeleteVocabSet}
                                    onViewWord={handleViewWord}
                                    onDeleteWord={handleDeleteWord}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Delete Vocabulary Set"
                message={`Are you sure you want to delete "${deleteConfirm.vocabSetTitle}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDeleteVocabSet}
                onCancel={() => setDeleteConfirm({
                    isOpen: false,
                    vocabSetId: '',
                    vocabSetTitle: '',
                })}
                type="danger"
            />

            <ConfirmDialog
                isOpen={deleteWordConfirm.isOpen}
                title="Delete Word"
                message={`Are you sure you want to delete "${deleteWordConfirm.wordText}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDeleteWord}
                onCancel={() => setDeleteWordConfirm({
                    isOpen: false,
                    vocabSetId: '',
                    wordIndex: -1,
                    wordText: '',
                })}
                type="danger"
            />

            <WordDetailModal
                isOpen={wordDetail.isOpen}
                word={wordDetail.vocabSet?.vocab_list[wordDetail.wordIndex] || null}
                wordIndex={wordDetail.wordIndex}
                vocabSetId={wordDetail.vocabSet?.id || ''}
                onClose={() => setWordDetail({
                    isOpen: false,
                    vocabSet: null,
                    wordIndex: -1,
                })}
                onDeleteWord={handleDeleteWord}
            />

            <AddVocabModal
                isOpen={isAddVocabModalOpen}
                vocabSets={vocabSets}
                onClose={() => setIsAddVocabModalOpen(false)}
                onSuccess={handleAddVocabSuccess}
            />
        </div>
    )
}
