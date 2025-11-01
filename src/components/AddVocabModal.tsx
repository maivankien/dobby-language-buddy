import { v4 as uuidv4 } from 'uuid'
import React, { useState, useEffect, useRef } from 'react'
import { X, Plus, Trash2, ChevronDown } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/utils/constants'
import type { IVocabSet, IAddVocabSetResult } from '@/types'

interface AddVocabModalProps {
    isOpen: boolean
    vocabSets: IVocabSet[]
    onClose: () => void
    onSuccess: (result: IAddVocabSetResult) => void
}

interface IWordForm {
    id: string
    word_target: string
    word_english: string
    phonetic: string
    example_sentence: string
}

type AddMode = 'create' | 'existing'

export const AddVocabModal: React.FC<AddVocabModalProps> = ({
    isOpen,
    vocabSets,
    onClose,
    onSuccess,
}) => {
    const { addVocabSet } = useApp()
    const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE)
    const [topic, setTopic] = useState<string>('')
    const [addMode, setAddMode] = useState<AddMode>('create')
    const [selectedTopicId, setSelectedTopicId] = useState<string>('')
    const [words, setWords] = useState<IWordForm[]>([
        { id: uuidv4(), word_target: '', word_english: '', phonetic: '', example_sentence: '' }
    ])
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const wordFormRefs = useRef<Record<string, HTMLDivElement | null>>({})
    const containerRef = useRef<HTMLDivElement | null>(null)
    const lastAddedWordIdRef = useRef<string | null>(null)

    useEffect(() => {
        if (!isOpen) {
            resetForm()
        }
    }, [isOpen])

    useEffect(() => {
        if (lastAddedWordIdRef.current) {
            const wordId = lastAddedWordIdRef.current
            lastAddedWordIdRef.current = null
            
            setTimeout(() => {
                const wordFormElement = wordFormRefs.current[wordId]
                if (wordFormElement) {
                    wordFormElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                    const firstInput = wordFormElement.querySelector('input[type="text"]') as HTMLInputElement
                    if (firstInput) {
                        firstInput.focus()
                    }
                }
            }, 100)
        }
    }, [words.length])

    const resetForm = () => {
        setLanguage(DEFAULT_LANGUAGE)
        setTopic('')
        setAddMode('create')
        setSelectedTopicId('')
        setWords([{ id: uuidv4(), word_target: '', word_english: '', phonetic: '', example_sentence: '' }])
        setErrors({})
        setIsSubmitting(false)
        wordFormRefs.current = {}
        lastAddedWordIdRef.current = null
    }

    const selectedLanguageObj = SUPPORTED_LANGUAGES.find(lang => lang.code === language)
    const languageName = selectedLanguageObj?.name || language
    
    const availableTopics = vocabSets.filter(set => {
        const setLanguageLower = set.language.toLowerCase().trim()
        const languageCodeLower = language.toLowerCase().trim()
        const languageNameLower = languageName.toLowerCase().trim()
        return setLanguageLower === languageCodeLower || setLanguageLower === languageNameLower
    })

    const handleAddWord = () => {
        const newWordId = uuidv4()
        const newWord: IWordForm = {
            id: newWordId,
            word_target: '',
            word_english: '',
            phonetic: '',
            example_sentence: '',
        }
        // Thêm từ mới ở đầu danh sách
        setWords([newWord, ...words])
        // Lưu wordId để scroll và focus sau khi DOM render
        lastAddedWordIdRef.current = newWordId
    }

    const handleRemoveWord = (wordId: string) => {
        if (words.length > 1) {
            setWords(words.filter(w => w.id !== wordId))
        }
    }

    const handleWordChange = (wordId: string, field: keyof Omit<IWordForm, 'id'>, value: string) => {
        const newWords = words.map(word => 
            word.id === wordId ? { ...word, [field]: value } : word
        )
        setWords(newWords)
        if (errors[`word_${wordId}_${field}`]) {
            const newErrors = { ...errors }
            delete newErrors[`word_${wordId}_${field}`]
            setErrors(newErrors)
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (addMode === 'create') {
            if (!topic.trim()) {
                newErrors.topic = 'Topic is required'
            }
        } else {
            if (!selectedTopicId) {
                newErrors.selectedTopicId = 'Please select a topic'
            }
        }

        if (words.length === 0) {
            newErrors.words = 'At least one word is required'
        }

        for (const word of words) {
            if (!word.word_target.trim()) {
                newErrors[`word_${word.id}_word_target`] = 'Word is required'
            }
            if (!word.word_english.trim()) {
                newErrors[`word_${word.id}_word_english`] = 'English translation is required'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            let finalTopic = topic.trim()
            let finalVocabList = words.map(w => ({
                word_target: w.word_target.trim(),
                word_english: w.word_english.trim(),
                phonetic: w.phonetic.trim(),
                example_sentence: w.example_sentence.trim(),
            })).filter(w => w.word_target && w.word_english)

            if (addMode === 'existing') {
                const selectedSet = vocabSets.find(set => set.id === selectedTopicId)
                if (selectedSet) {
                    finalTopic = selectedSet.topic
                    finalVocabList = [...selectedSet.vocab_list, ...finalVocabList]
                }
            }

            const result = addVocabSet({
                topic: finalTopic,
                language: languageName,
                vocab_list: finalVocabList,
            })

            onSuccess(result)
            resetForm()
            onClose()
        } catch (error) {
            console.error('Error adding vocabulary:', error)
            setErrors({ submit: 'Failed to save vocabulary. Please try again.' })
        } finally {
            setIsSubmitting(false)
        }
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

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-white/20 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div className="glass rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full my-8 animate-scaleIn max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-sm z-10 border-b border-white/20">
                    <div className="flex items-center justify-between p-4 sm:p-5">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                            ➕ Add New Vocabulary
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language *
                        </label>
                        <div className="relative">
                            <select
                                value={language}
                                onChange={(e) => {
                                    setLanguage(e.target.value)
                                    setSelectedTopicId('')
                                    setAddMode('create')
                                }}
                                className="appearance-none bg-white/95 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-10 text-sm sm:text-base font-medium text-gray-700 hover:border-gray-400 focus-ring cursor-pointer w-full"
                                aria-label="Select language"
                            >
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.flag} {lang.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Add to *
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="addMode"
                                    value="create"
                                    checked={addMode === 'create'}
                                    onChange={(e) => {
                                        setAddMode('create')
                                        setSelectedTopicId('')
                                    }}
                                    className="w-4 h-4 text-blue-600 focus-ring cursor-pointer"
                                />
                                <span className="text-sm text-gray-700">Create new topic</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="addMode"
                                    value="existing"
                                    checked={addMode === 'existing'}
                                    onChange={(e) => {
                                        setAddMode('existing')
                                        setTopic('')
                                    }}
                                    disabled={availableTopics.length === 0}
                                    className="w-4 h-4 text-blue-600 focus-ring cursor-pointer disabled:opacity-50"
                                />
                                <span className={`text-sm ${availableTopics.length === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                                    Add to existing topic {availableTopics.length === 0 && '(none available)'}
                                </span>
                            </label>
                        </div>
                    </div>

                    {addMode === 'create' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Topic *
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => {
                                    setTopic(e.target.value)
                                    if (errors.topic) {
                                        const newErrors = { ...errors }
                                        delete newErrors.topic
                                        setErrors(newErrors)
                                    }
                                }}
                                placeholder="Enter topic name"
                                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/95 border rounded-lg sm:rounded-xl focus-ring text-gray-900 placeholder-gray-500 text-sm sm:text-base ${
                                    errors.topic ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.topic && (
                                <p className="mt-1 text-sm text-red-600">{errors.topic}</p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Topic *
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedTopicId}
                                    onChange={(e) => {
                                        setSelectedTopicId(e.target.value)
                                        if (errors.selectedTopicId) {
                                            const newErrors = { ...errors }
                                            delete newErrors.selectedTopicId
                                            setErrors(newErrors)
                                        }
                                    }}
                                    className={`appearance-none bg-white/95 border rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-10 text-sm sm:text-base font-medium text-gray-700 hover:border-gray-400 focus-ring cursor-pointer w-full ${
                                        errors.selectedTopicId ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">-- Select a topic --</option>
                                    {availableTopics.map((set) => (
                                        <option key={set.id} value={set.id}>
                                            {set.topic} ({set.vocab_list.length} words)
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.selectedTopicId && (
                                <p className="mt-1 text-sm text-red-600">{errors.selectedTopicId}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Words *
                            </label>
                            <button
                                type="button"
                                onClick={handleAddWord}
                                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Word</span>
                            </button>
                        </div>

                        {errors.words && (
                            <p className="mb-2 text-sm text-red-600">{errors.words}</p>
                        )}

                        <div className="space-y-3 sm:space-y-4" ref={containerRef}>
                            {words.map((word, index) => (
                                <div
                                    key={word.id}
                                    ref={(el) => { wordFormRefs.current[word.id] = el }}
                                    className="p-3 sm:p-4 bg-white/90 rounded-lg sm:rounded-xl border border-white/30 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">
                                            Word {index + 1}
                                        </span>
                                        {words.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveWord(word.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                                aria-label="Remove word"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                            Word (Target Language) *
                                        </label>
                                        <input
                                            type="text"
                                            value={word.word_target}
                                            onChange={(e) => handleWordChange(word.id, 'word_target', e.target.value)}
                                            placeholder="Enter word"
                                            className={`w-full px-3 py-2 bg-white border rounded-lg focus-ring text-gray-900 placeholder-gray-400 text-sm ${
                                                errors[`word_${word.id}_word_target`] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors[`word_${word.id}_word_target`] && (
                                            <p className="mt-1 text-xs text-red-600">{errors[`word_${word.id}_word_target`]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                            English Translation *
                                        </label>
                                        <input
                                            type="text"
                                            value={word.word_english}
                                            onChange={(e) => handleWordChange(word.id, 'word_english', e.target.value)}
                                            placeholder="Enter English translation"
                                            className={`w-full px-3 py-2 bg-white border rounded-lg focus-ring text-gray-900 placeholder-gray-400 text-sm ${
                                                errors[`word_${word.id}_word_english`] ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors[`word_${word.id}_word_english`] && (
                                            <p className="mt-1 text-xs text-red-600">{errors[`word_${word.id}_word_english`]}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                            Phonetic (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={word.phonetic}
                                            onChange={(e) => handleWordChange(word.id, 'phonetic', e.target.value)}
                                            placeholder="Enter pronunciation"
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus-ring text-gray-900 placeholder-gray-400 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">
                                            Example Sentence (Optional)
                                        </label>
                                        <textarea
                                            value={word.example_sentence}
                                            onChange={(e) => handleWordChange(word.id, 'example_sentence', e.target.value)}
                                            placeholder="Enter example sentence"
                                            rows={2}
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus-ring text-gray-900 placeholder-gray-400 text-sm resize-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-gradient-to-t from-white/95 to-white/80 backdrop-blur-sm border-t border-white/20">
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2.5 text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all duration-200 cursor-pointer font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 cursor-pointer font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>Save Vocabulary</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

