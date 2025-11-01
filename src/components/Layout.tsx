import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MessageCircle, BookOpen, Settings, Brain } from 'lucide-react'
import { APP_NAME } from '@/utils/constants'

interface LayoutProps {
    children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation()

    const isActive = (path: string) => {
        return location.pathname === path
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-indigo-300 flex flex-col">
            <header className="glass-strong border-b border-white/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <img 
                                src="/images/logo-dobby.png" 
                                alt="Dobby Logo" 
                                className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 flex-shrink-0"
                            />
                            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
                                {APP_NAME}
                            </h1>
                        </div>
                        
                        <nav className="flex space-x-1 sm:space-x-2 lg:space-x-4">
                            <Link
                                to="/"
                                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 btn-hover-lift cursor-pointer ${
                                    isActive('/') 
                                        ? 'bg-white/30 text-gray-800 shadow-lg' 
                                        : 'text-gray-700 hover:text-gray-800 hover:bg-white/20'
                                }`}
                            >
                                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="hidden xs:inline sm:hidden lg:inline">Dobby Chat</span>
                                <span className="xs:hidden sm:inline lg:hidden">Chat</span>
                            </Link>
                            
                            <Link
                                to="/vocabulary"
                                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 btn-hover-lift cursor-pointer ${
                                    isActive('/vocabulary') 
                                        ? 'bg-white/30 text-gray-800 shadow-lg' 
                                        : 'text-gray-700 hover:text-gray-800 hover:bg-white/20'
                                }`}
                            >
                                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="hidden xs:inline sm:hidden lg:inline">My Vocabulary</span>
                                <span className="xs:hidden sm:inline lg:hidden">Vocab</span>
                            </Link>

                            <Link
                                to="/quiz"
                                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 btn-hover-lift cursor-pointer ${
                                    isActive('/quiz') 
                                        ? 'bg-white/30 text-gray-800 shadow-lg' 
                                        : 'text-gray-700 hover:text-gray-800 hover:bg-white/20'
                                }`}
                            >
                                <Brain className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="hidden xs:inline sm:hidden lg:inline">Quiz</span>
                                <span className="xs:hidden sm:inline lg:hidden">Quiz</span>
                            </Link>

                            <Link
                                to="/settings"
                                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 btn-hover-lift cursor-pointer ${
                                    isActive('/settings') 
                                        ? 'bg-white/30 text-gray-800 shadow-lg' 
                                        : 'text-gray-700 hover:text-gray-800 hover:bg-white/20'
                                }`}
                            >
                                <Settings className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="hidden xs:inline sm:hidden lg:inline">Settings</span>
                                <span className="xs:hidden sm:inline lg:hidden">Settings</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="animate-fadeIn">
                    {children}
                </div>
            </main>

            <footer className="glass border-t border-white/10 mt-auto">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
                    <p className="text-center text-xs sm:text-sm text-gray-600">
                        Made with ❤️ by Dobby Language Buddy
                    </p>
                </div>
            </footer>
        </div>
    )
}
