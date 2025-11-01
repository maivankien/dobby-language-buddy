import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Play, RotateCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import type { IQuizQuestion, IQuizAnswer, IQuizResult } from '@/types'
import { generateQuizQuestions, getDobbyFeedback } from '@/utils/quiz'
import { saveQuizResult } from '@/utils/localStorage'

type QuizScreen = 'selection' | 'question' | 'result'

export const Quiz: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { vocabSets } = useApp()

    const [screen, setScreen] = useState<QuizScreen>('selection')
    const [selectedSetId, setSelectedSetId] = useState<string | null>(null)
    const [questionCount, setQuestionCount] = useState<number>(10)
    const [questions, setQuestions] = useState<IQuizQuestion[]>([])
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string>('')
    const [answers, setAnswers] = useState<IQuizAnswer[]>([])
    const [result, setResult] = useState<IQuizResult | null>(null)
    const [vocabSetTitle, setVocabSetTitle] = useState<string>('')

    useEffect(() => {
        const setIdFromUrl = searchParams.get('setId')
        if (setIdFromUrl && vocabSets.some(set => set.id === setIdFromUrl)) {
            setSelectedSetId(setIdFromUrl)
        }
    }, [searchParams, vocabSets])

    const handleStartQuiz = () => {
        if (vocabSets.length === 0) {
            return
        }

        const { questions: generatedQuestions, vocabSetTitle: title } = generateQuizQuestions(
            vocabSets,
            selectedSetId,
            questionCount
        )

        if (generatedQuestions.length === 0) {
            return
        }

        setQuestions(generatedQuestions)
        setVocabSetTitle(title || '')
        setCurrentIndex(0)
        setSelectedAnswer('')
        setAnswers([])
        setScreen('question')
    }

    const handleSubmitAnswer = () => {
        if (!selectedAnswer) {
            return
        }

        const currentQuestion = questions[currentIndex]
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer

        const newAnswer: IQuizAnswer = {
            questionId: currentQuestion.id,
            selectedAnswer,
            isCorrect,
        }

        const updatedAnswers = [...answers, newAnswer]

        if (currentIndex < questions.length - 1) {
            setAnswers(updatedAnswers)
            setCurrentIndex(currentIndex + 1)
            setSelectedAnswer('')
        } else {
            setAnswers(updatedAnswers)
            handleFinishQuiz(updatedAnswers)
        }
    }

    const handleFinishQuiz = (finalAnswers: IQuizAnswer[]) => {
        const score = finalAnswers.filter(a => a.isCorrect).length
        const total = questions.length

        const vocabSetId = selectedSetId && selectedSetId !== 'all' ? selectedSetId : undefined
        const selectedSet = vocabSets.find(set => set.id === vocabSetId)

        const quizResult = saveQuizResult({
            vocabSetId,
            vocabSetTitle: vocabSetTitle || selectedSet?.topic,
            score,
            total,
            answers: finalAnswers,
            completedAt: new Date().toISOString(),
        })

        setResult(quizResult)
        setScreen('result')
    }

    const handleTryAgain = () => {
        const { questions: generatedQuestions, vocabSetTitle: title } = generateQuizQuestions(
            vocabSets,
            selectedSetId,
            questionCount
        )

        setQuestions(generatedQuestions)
        setVocabSetTitle(title || '')
        setCurrentIndex(0)
        setSelectedAnswer('')
        setAnswers([])
        setResult(null)
        setScreen('question')
    }

    const handleNextQuiz = () => {
        setSelectedSetId(null)
        setQuestionCount(10)
        setQuestions([])
        setCurrentIndex(0)
        setSelectedAnswer('')
        setAnswers([])
        setResult(null)
        setVocabSetTitle('')
        setScreen('selection')
    }

    const currentQuestion = questions[currentIndex]
    const allWords = vocabSets.flatMap(set => set.vocab_list)
    const totalWords = selectedSetId && selectedSetId !== 'all'
        ? vocabSets.find(set => set.id === selectedSetId)?.vocab_list.length || 0
        : allWords.length

    if (screen === 'selection') {
        const maxQuestions = Math.min(questionCount, totalWords)

        return (
            <div className="max-w-4xl mx-auto">
                <div className="animate-fadeIn">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                        🧠 Quiz
                    </h2>

                    {vocabSets.length === 0 ? (
                        <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
                            <p className="text-gray-600 mb-4">
                                No vocabulary sets available. Add some words first!
                            </p>
                            <button
                                onClick={() => navigate('/vocabulary')}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Go to Vocabulary
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                                    Select Vocabulary Set
                                </label>
                                <select
                                    value={selectedSetId || 'all'}
                                    onChange={(e) => setSelectedSetId(e.target.value === 'all' ? null : e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white/90 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Sets (Random)</option>
                                    {vocabSets.map((set) => (
                                        <option key={set.id} value={set.id}>
                                            {set.topic} ({set.vocab_list.length} words)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
                                <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                                    Number of Questions
                                </label>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    {[5, 10, 20].map((count) => (
                                        <button
                                            key={count}
                                            onClick={() => setQuestionCount(count)}
                                            disabled={count > totalWords}
                                            className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all ${
                                                questionCount === count
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'bg-white/90 text-gray-700 hover:bg-white'
                                            } ${
                                                count > totalWords
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'cursor-pointer'
                                            }`}
                                        >
                                            {count}
                                        </button>
                                    ))}
                                </div>
                                {maxQuestions < questionCount && (
                                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                        Only {totalWords} words available, using {maxQuestions} questions
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleStartQuiz}
                                disabled={maxQuestions === 0}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl transition-all duration-200 font-medium text-sm sm:text-base btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Start Quiz</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    if (screen === 'question' && currentQuestion) {
        const progress = ((currentIndex + 1) / questions.length) * 100

        return (
            <div className="max-w-4xl mx-auto">
                <div className="animate-fadeIn">
                    <div className="mb-4 sm:mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm sm:text-base text-gray-600">
                                Question {currentIndex + 1} of {questions.length}
                            </span>
                            <span className="text-sm sm:text-base text-gray-600">
                                {vocabSetTitle}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                            <div
                                className="bg-blue-600 h-2 sm:h-3 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
                            {currentQuestion.question}
                        </h3>

                        {currentQuestion.type === 'meaning' && (
                            <div className="text-center mb-4 sm:mb-6">
                                <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                                    {currentQuestion.word.word_target}
                                </span>
                                {currentQuestion.word.phonetic && (
                                    <p className="text-sm sm:text-base text-gray-500 italic mt-2">
                                        {currentQuestion.word.phonetic}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="space-y-2 sm:space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedAnswer(option)}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                                        selectedAnswer === option
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-white/90 text-gray-800 hover:bg-blue-200'
                                    }`}
                                >
                                    <span className="font-medium text-sm sm:text-base">
                                        {String.fromCodePoint(65 + index)}. {option}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmitAnswer}
                        disabled={!selectedAnswer}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg sm:rounded-xl transition-all duration-200 font-medium text-sm sm:text-base btn-hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>
        )
    }

    if (screen === 'result' && result) {
        const percentage = (result.score / result.total) * 100
        const feedback = getDobbyFeedback(result.score, result.total)

        return (
            <div className="max-w-4xl mx-auto">
                <div className="animate-fadeIn">
                    <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">
                            Quiz Complete!
                        </h2>
                        <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2 sm:mb-4">
                            {result.score} / {result.total}
                        </div>
                        <div className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6">
                            {percentage.toFixed(0)}%
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                            <p className="text-base sm:text-lg text-gray-800 italic">
                                "{feedback}"
                            </p>
                        </div>
                    </div>

                    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                            Answers Review
                        </h3>
                        <div className="space-y-3 sm:space-y-4">
                            {questions.map((question, index) => {
                                const answer = result.answers.find(a => a.questionId === question.id)
                                const isCorrect = answer?.isCorrect || false
                                const userAnswer = answer?.selectedAnswer || ''

                                return (
                                    <div
                                        key={question.id}
                                        className={`p-3 sm:p-4 rounded-lg ${
                                            isCorrect ? 'bg-green-50' : 'bg-red-50'
                                        }`}
                                    >
                                        <div className="flex items-start space-x-2 sm:space-x-3">
                                            {isCorrect ? (
                                                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-800 text-sm sm:text-base mb-1">
                                                    Question {index + 1}: {question.question}
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-600 mb-1">
                                                    {question.type === 'meaning' ? (
                                                        <span className="font-semibold">{question.word.word_target}</span>
                                                    ) : (
                                                        <span className="font-semibold">{question.word.word_english}</span>
                                                    )}
                                                </div>
                                                {!isCorrect && (
                                                    <div className="text-xs sm:text-sm text-red-600 mb-1">
                                                        Your answer: <span className="font-medium">{userAnswer}</span>
                                                    </div>
                                                )}
                                                <div className={`text-xs sm:text-sm ${isCorrect ? 'text-green-600' : 'text-green-700'}`}>
                                                    Correct answer: <span className="font-medium">{question.correctAnswer}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            onClick={handleTryAgain}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl transition-all duration-200 font-medium text-sm sm:text-base btn-hover-lift"
                        >
                            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Try Again</span>
                        </button>
                        <button
                            onClick={handleNextQuiz}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg sm:rounded-xl transition-all duration-200 font-medium text-sm sm:text-base btn-hover-lift"
                        >
                            <span>Next Quiz</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return null
}
