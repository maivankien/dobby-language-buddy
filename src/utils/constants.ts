import type { ILanguage } from '@/types'

export const SUPPORTED_LANGUAGES: ILanguage[] = [
    { code: 'french', name: 'French', flag: '🇫🇷' },
    { code: 'chinese', name: 'Chinese', flag: '🇨🇳' },
    { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
    { code: 'hindi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'russian', name: 'Russian', flag: '🇷🇺' },
    { code: 'german', name: 'German', flag: '🇩🇪' },
    { code: 'portuguese', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'italian', name: 'Italian', flag: '🇮🇹' },
]

export const DEFAULT_LANGUAGE = 'french'

export const APP_NAME = 'Dobby Language Buddy'

export const DOBBY_MESSAGES = {
    WELCOME: "Hello! I'm Dobby, your language learning buddy! What would you like to learn today?",
    LOADING: "Dobby is thinking...",
    ERROR: "Oops! Something went wrong. Please try again!",
    NO_VOCAB: "No vocabulary sets found. Start chatting with Dobby to learn new words!",
    EMPTY_CHAT: "Start a conversation with Dobby to learn new vocabulary!",
}
