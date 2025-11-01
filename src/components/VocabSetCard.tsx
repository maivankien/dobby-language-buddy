import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Eye, ChevronDown, ChevronRight, Calendar, Globe, Brain } from 'lucide-react'
import type { IVocabSet } from '@/types'

interface VocabSetCardProps {
    vocabSet: IVocabSet
    onDelete: (id: string) => void
    onViewWord: (vocabSet: IVocabSet, wordIndex: number) => void
    onDeleteWord: (setId: string, wordIndex: number) => void
}

export const VocabSetCard: React.FC<VocabSetCardProps> = ({
    vocabSet,
    onDelete,
    onViewWord,
    onDeleteWord,
}) => {
    const navigate = useNavigate()
    const [isExpanded, setIsExpanded] = useState(false)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="glass rounded-xl sm:rounded-2xl shadow-xl">
            <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 sm:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                            ) : (
                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                            )}
                        </button>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                                📚 {vocabSet.topic}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-1">
                                <div className="flex items-center space-x-1">
                                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-gray-500" />
                                    <span className="truncate">{vocabSet.language}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-gray-500" />
                                    <span className="truncate">{formatDate(vocabSet.saved_at)}</span>
                                </div>
                                <span className="font-medium">
                                    {vocabSet.vocab_list.length} words
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                        <button
                            onClick={() => navigate(`/quiz?setId=${vocabSet.id}`)}
                            className="p-1 sm:p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors cursor-pointer"
                            title="Start Quiz"
                        >
                            <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(vocabSet.id)}
                            className="p-1 sm:p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
                            title="Delete topic"
                        >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 animate-fadeIn">
                    <div className="space-y-2 sm:space-y-3">
                        {vocabSet.vocab_list.map((word, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 sm:p-3 bg-white/90 rounded-lg sm:rounded-xl animate-fadeIn"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                        <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0">
                                            {index + 1}
                                        </span>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
                                            <span className="font-semibold text-gray-900 truncate">
                                                {word.word_target}
                                            </span>
                                            <span className="text-gray-400 hidden sm:inline">—</span>
                                            <span className="font-medium text-gray-700 truncate">
                                                {word.word_english}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 mt-1 bg-yellow-50 rounded-lg p-2">
                                        <span className="font-medium text-yellow-700">Pronunciation:</span>
                                        <span className="italic text-yellow-600 ml-1 break-all">{word.phonetic}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0 ml-2">
                                    <button
                                        onClick={() => onViewWord(vocabSet, index)}
                                        className="p-2 sm:p-3 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors cursor-pointer"
                                        title="View details"
                                    >
                                        <Eye className="w-4 h-4 sm:w-4 sm:h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteWord(vocabSet.id, index)}
                                        className="p-2 sm:p-3 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                        title="Delete word"
                                    >
                                        <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
