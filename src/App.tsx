import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { Layout } from '@/components/Layout'
import { DobbyChat } from '@/pages/DobbyChat'
import { MyVocabulary } from '@/pages/MyVocabulary'
import { ApiSettings } from '@/pages/ApiSettings'
import { Quiz } from '@/pages/Quiz'

function App() {
    return (
        <AppProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<DobbyChat />} />
                        <Route path="/vocabulary" element={<MyVocabulary />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/settings" element={<ApiSettings />} />
                    </Routes>
                </Layout>
            </Router>
        </AppProvider>
    )
}

export default App
