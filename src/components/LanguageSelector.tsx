import React from 'react'
import { ChevronDown } from 'lucide-react'
import { SUPPORTED_LANGUAGES } from '@/utils/constants'

interface LanguageSelectorProps {
    selectedLanguage: string
    onLanguageChange: (language: string) => void
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    selectedLanguage,
    onLanguageChange,
}) => {

    return (
        <div className="relative">
            <select
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="appearance-none bg-white/95 border border-gray-300 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 pr-8 sm:pr-10 text-xs sm:text-sm font-medium text-gray-700 hover:border-gray-400 focus-ring cursor-pointer min-w-[120px] sm:min-w-[140px]"
                aria-label="Select language"
            >
                {SUPPORTED_LANGUAGES.map((language) => (
                    <option key={language.code} value={language.code}>
                        {language.flag} {language.name}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
        </div>
    )
}
