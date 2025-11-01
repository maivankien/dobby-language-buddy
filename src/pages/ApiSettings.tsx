import React, { useState, useEffect } from 'react'
import { Save, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { saveFireworksApiKey, getFireworksApiKey, deleteFireworksApiKey } from '@/utils/localStorage'

export const ApiSettings: React.FC = () => {
    const [apiKey, setApiKey] = useState('')
    const [showApiKey, setShowApiKey] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const storedKey = getFireworksApiKey()
        if (storedKey) {
            setApiKey(storedKey)
        }
    }, [])

    const handleSave = () => {
        const trimmedKey = apiKey.trim()

        if (!trimmedKey) {
            deleteFireworksApiKey()
            setSaveStatus('success')
            setMessage('API key has been deleted successfully')
            setApiKey('')
            setTimeout(() => {
                setMessage('')
                setSaveStatus('idle')
            }, 3000)
            return
        }

        saveFireworksApiKey(trimmedKey)
        setSaveStatus('success')
        setMessage('API key has been saved successfully!')
        setTimeout(() => {
            setMessage('')
            setSaveStatus('idle')
        }, 3000)
    }

    const toggleShowApiKey = () => {
        setShowApiKey(!showApiKey)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            <div className="animate-fadeIn">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    ⚙️ API Key Settings
                </h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Configure your Fireworks API key
                </p>
            </div>

            <div className="glass rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 animate-fadeIn">
                <div className="space-y-4 sm:space-y-6">
                    {/* Info Alert */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                        <div className="flex items-start space-x-2 sm:space-x-3">
                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs sm:text-sm text-yellow-800">
                                <p className="font-medium mb-1">Information:</p>
                                <ul className="list-disc list-inside space-y-1 text-yellow-700">
                                    <li>Your API key will be saved to your browser's localStorage</li>
                                    <li>API key is stored locally and will not be shared with anyone</li>
                                    <li>You must configure an API key to use Dobby Chat features</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="apiKey" className="block text-sm sm:text-base font-medium text-gray-700">
                            Fireworks API Key
                        </label>
                        <div className="relative">
                            <input
                                id="apiKey"
                                type={showApiKey ? 'text' : 'password'}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your API key..."
                                className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 bg-white/90 border border-white/30 rounded-lg sm:rounded-xl focus-ring-white text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                                aria-label="Fireworks API Key input"
                            />
                            <button
                                type="button"
                                onClick={toggleShowApiKey}
                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none p-4 cursor-pointer"
                                aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                            >
                                {showApiKey ? (
                                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                ) : (
                                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`flex items-center space-x-2 p-3 rounded-lg ${saveStatus === 'success'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {saveStatus === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            )}
                            <p className="text-xs sm:text-sm">{message}</p>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center space-x-2 btn-hover-lift text-sm sm:text-base focus-ring-white cursor-pointer"
                            aria-label="Save API key"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="glass rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 animate-fadeIn">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                    📖 How to Get Your API Key
                </h3>
                <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Visit the Fireworks AI website</li>
                        <li>Sign in or create a new account</li>
                        <li>Navigate to Settings or API Keys section</li>
                        <li>Copy your API key</li>
                        <li>Paste it into the input field above and click Save</li>
                    </ol>
                </div>
            </div>
        </div>
    )
}

