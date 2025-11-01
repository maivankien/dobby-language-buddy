import React from 'react'
import { X, Volume2, Trash2 } from 'lucide-react'
import type { IVocabItem } from '@/types'

interface WordDetailModalProps {
    isOpen: boolean
    word: IVocabItem | null
    wordIndex: number
    vocabSetId: string
    onClose: () => void
    onDeleteWord: (setId: string, wordIndex: number) => void
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
    isOpen,
    word,
    wordIndex,
    vocabSetId,
    onClose,
    onDeleteWord,
}) => {
    if (!isOpen || !word) return null

    const handleDelete = () => {
        onDeleteWord(vocabSetId, wordIndex)
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            onClose()
        }
    }

    return (
        <div 
            className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div className="glass rounded-xl sm:rounded-2xl shadow-2xl max-w-lg w-full animate-scaleIn">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20">
                    <h3 id="word-detail-title" className="text-lg sm:text-xl font-semibold text-gray-800">
                        📖 Word Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            {word.word_target}
                        </div>
                        <div className="text-lg sm:text-xl text-gray-700 font-medium">
                            {word.word_english}
                        </div>
                    </div>

                    <div className="glass rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/30">
                        <div className="flex items-center space-x-2 mb-3">
                            <Volume2 className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                            <span className="font-semibold text-gray-800">Pronunciation</span>
                        </div>
                        <p className="text-base sm:text-lg italic text-gray-700 pl-7">
                            /{word.phonetic}/
                        </p>
                    </div>

                    <div className="glass rounded-lg sm:rounded-xl p-4 sm:p-5 border border-white/30 bg-yellow-50/30">
                        <div className="flex items-center space-x-2 mb-3">
                            <span className="text-xl">💬</span>
                            <span className="font-semibold text-gray-800">Example Sentence</span>
                        </div>
                        <p className="text-gray-700 italic text-sm sm:text-base leading-relaxed pl-7">
                            "{word.example_sentence}"
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-white/20 bg-white/10">
                    <button
                        onClick={handleDelete}
                        className="flex items-center justify-center space-x-2 px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200 cursor-pointer font-medium text-sm sm:text-base order-1 sm:order-1"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Word</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all duration-200 cursor-pointer font-medium text-sm sm:text-base order-2 sm:order-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
