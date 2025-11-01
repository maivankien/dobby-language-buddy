import { v4 as uuidv4 } from 'uuid'
import { Send, Loader2 } from 'lucide-react'
import { DOBBY_MESSAGES } from '@/utils/constants'
import { useApp } from '@/context/AppContext'
import type { IChatMessage, IVocabResponse } from '@/types'
import { callFireworksAPI } from '@/services/fireworksAPI'
import React, { useState, useRef, useEffect } from 'react'
import { LanguageSelector } from '@/components/LanguageSelector'
import { VocabularyDisplay } from '@/components/VocabularyDisplay'


export const DobbyChat: React.FC = () => {
    const { selectedLanguage, setSelectedLanguage, addVocabSet } = useApp()
    const [messages, setMessages] = useState<IChatMessage[]>([
        {
            id: uuidv4(),
            sender: 'dobby',
            content: DOBBY_MESSAGES.WELCOME,
            timestamp: new Date().toISOString(),
        }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [currentVocabData, setCurrentVocabData] = useState<IVocabResponse | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return

        const userMessage: IChatMessage = {
            id: uuidv4(),
            sender: 'user',
            content: inputMessage.trim(),
            timestamp: new Date().toISOString(),
        }

        setMessages(prev => [...prev, userMessage])
        setInputMessage('')
        setIsLoading(true)

        const loadingMessage: IChatMessage = {
            id: uuidv4(),
            sender: 'dobby',
            content: DOBBY_MESSAGES.LOADING,
            timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, loadingMessage])

        try {
            const response = await callFireworksAPI({
                selected_language: selectedLanguage,
                chat_message: inputMessage.trim(),
            })

            setMessages(prev => prev.slice(0, -1))
            
            const dobbyMessage: IChatMessage = {
                id: uuidv4(),
                sender: 'dobby',
                content: response.message_from_dobby,
                timestamp: new Date().toISOString(),
                vocabData: response,
            }

            setMessages(prev => [...prev, dobbyMessage])
            setCurrentVocabData(response)
        } catch (error) {
            console.error('Error calling Fireworks API:', error)
            
            setMessages(prev => prev.slice(0, -1))
            
            const errorMessage: IChatMessage = {
                id: uuidv4(),
                sender: 'dobby',
                content: DOBBY_MESSAGES.ERROR,
                timestamp: new Date().toISOString(),
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveWords = () => {
        if (!currentVocabData) return

        const result = addVocabSet({
            topic: currentVocabData.topic,
            language: currentVocabData.target_language,
            vocab_list: currentVocabData.vocab_list,
        })

        let confirmMessageContent: string
        if (result.merged) {
            if (result.newWordsCount > 0) {
                confirmMessageContent = `Great! I've merged ${result.newWordsCount} new word${result.newWordsCount > 1 ? 's' : ''} into your existing topic "${currentVocabData.topic}". You now have ${(result.existingWordsCount || 0) + result.newWordsCount} words in total! 📚`
            } else {
                confirmMessageContent = `All words from "${currentVocabData.topic}" already exist in your vocabulary! No new words were added. 📚`
            }
        } else {
            confirmMessageContent = `Great! I've saved ${result.newWordsCount} words about "${currentVocabData.topic}" to your vocabulary! 📚`
        }

        const confirmMessage: IChatMessage = {
            id: uuidv4(),
            sender: 'dobby',
            content: confirmMessageContent,
            timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, confirmMessage])
        setCurrentVocabData(null)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <div className="glass rounded-xl sm:rounded-2xl shadow-xl">
                <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-white/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                            💬 Chat with Dobby
                        </h2>
                        <LanguageSelector
                            selectedLanguage={selectedLanguage}
                            onLanguageChange={setSelectedLanguage}
                        />
                    </div>
                </div>

                <div className="h-80 sm:h-96 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div
                                className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl ${
                                    message.sender === 'user'
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-white/90 text-gray-900'
                                }`}
                            >
                                <p className="text-xs sm:text-sm break-words">{message.content}</p>
                                <p className={`text-xs mt-1 ${
                                    message.sender === 'user' ? 'text-yellow-100' : 'text-gray-500'
                                }`}>
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-white/20">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Dobby for vocabulary about any topic..."
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white/90 border border-white/30 rounded-lg sm:rounded-xl focus-ring-white text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                            disabled={isLoading}
                            aria-label="Message input"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center space-x-2 btn-hover-lift text-sm sm:text-base focus-ring-white cursor-pointer disabled:cursor-not-allowed"
                            aria-label="Send message"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">Send</span>
                        </button>
                    </div>
                </div>
            </div>

            {currentVocabData && (
                <div className="animate-fadeIn">
                    <VocabularyDisplay
                        topic={currentVocabData.topic}
                        targetLanguage={currentVocabData.target_language}
                        vocabList={currentVocabData.vocab_list}
                        messageFromDobby={currentVocabData.message_from_dobby}
                        onSaveWords={handleSaveWords}
                    />
                </div>
            )}
        </div>
    )
}
