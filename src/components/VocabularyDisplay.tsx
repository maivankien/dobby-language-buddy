import React from 'react'
import { Save, Volume2 } from 'lucide-react'
import type { IVocabItem } from '@/types'

interface VocabularyDisplayProps {
    topic: string
    targetLanguage: string
    vocabList: IVocabItem[]
    messageFromDobby: string
    onSaveWords: () => void
    isLoading?: boolean
}

export const VocabularyDisplay: React.FC<VocabularyDisplayProps> = ({
    topic,
    targetLanguage,
    vocabList,
    messageFromDobby,
    onSaveWords,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-6 animate-fadeIn">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border rounded-lg p-4">
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="glass rounded-xl sm:rounded-2xl shadow-xl">
            <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-white/20">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    📚 {topic} - {targetLanguage}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {messageFromDobby}
                </p>
            </div>

            <div className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-3 sm:space-y-4">
                    {vocabList.map((vocab, index) => (
                        <div 
                            key={index} 
                            className="bg-white/90 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-fadeIn"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                        <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0">
                                            {index + 1}
                                        </span>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                            <span className="text-base sm:text-lg font-semibold text-gray-900">
                                                {vocab.word_target}
                                            </span>
                                            <span className="text-gray-400 hidden sm:inline">—</span>
                                            <span className="text-base sm:text-lg font-medium text-gray-700">
                                                {vocab.word_english}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-2 bg-blue-50 rounded-lg p-2">
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                                            <span className="font-medium text-blue-700">Pronunciation:</span>
                                        </div>
                                        <span className="italic text-blue-600 break-all">{vocab.phonetic}</span>
                                    </div>
                                    
                                    <div className="text-xs sm:text-sm text-gray-700 bg-green-50 rounded-lg p-2 sm:p-3">
                                        <span className="font-medium text-green-700">💬 </span>
                                        <span className="italic text-green-600 break-words">{vocab.example_sentence}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/20">
                    <button
                        onClick={onSaveWords}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center space-x-2 btn-hover-lift text-sm sm:text-base cursor-pointer"
                    >
                        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>SAVE WORDS</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
