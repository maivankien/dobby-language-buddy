# Dobby Language Buddy

A modern, interactive language learning web application that helps users learn vocabulary through AI-powered conversations, vocabulary management, and interactive quizzes.

## Overview

Dobby Language Buddy is a React-based single-page application that combines AI-powered vocabulary generation with an intuitive learning interface. Users can chat with Dobby (an AI assistant) to generate vocabulary lists, save and manage their vocabulary sets, and test their knowledge through interactive quizzes.

## Features

### 1. AI-Powered Vocabulary Chat
- Interactive conversation interface with Dobby, a multilingual AI assistant
- Generate vocabulary lists based on any topic in multiple languages
- Support for 8 languages: French, Chinese, Spanish, Hindi, Russian, German, Portuguese, and Italian
- Real-time vocabulary generation with phonetic transcriptions and example sentences
- Save generated vocabulary directly to personal collection

### 2. Vocabulary Management
- View all saved vocabulary sets organized by topic and language
- Add vocabulary manually or through AI generation
- Merge duplicate topics intelligently (adds only new words to existing sets)
- Delete vocabulary sets or individual words
- View detailed word information including translations, phonetics, and examples
- Responsive card-based UI for easy browsing

### 3. Interactive Quiz System
- Two question types: meaning recognition and spelling practice
- Select specific vocabulary sets or test across all sets
- Configurable question count (5, 10, or 20 questions)
- Real-time progress tracking
- Detailed results review with correct/incorrect answers
- Personalized feedback based on performance
- Quiz history saved for progress tracking

### 4. Settings & Configuration
- Secure API key management for Fireworks AI integration
- Local storage-based settings persistence
- User-friendly configuration interface

## Technology Stack

- **Frontend Framework:** React 19.1 with TypeScript
- **Routing:** React Router DOM 7.9
- **Styling:** Tailwind CSS 4.1 with custom animations
- **Build Tool:** Vite 7.1
- **State Management:** React Context API
- **Icons:** Lucide React
- **HTTP Client:** Native Fetch API
- **Storage:** Browser LocalStorage
- **AI Integration:** Fireworks AI API (dobby-unhinged-llama-3-3-70b-new model)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main application layout with navigation
│   ├── VocabularyDisplay.tsx
│   ├── VocabSetCard.tsx
│   ├── AddVocabModal.tsx
│   ├── WordDetailModal.tsx
│   ├── LanguageSelector.tsx
│   └── ConfirmDialog.tsx
├── pages/              # Main page components
│   ├── DobbyChat.tsx   # AI chat interface
│   ├── MyVocabulary.tsx # Vocabulary management
│   ├── Quiz.tsx        # Quiz interface
│   └── ApiSettings.tsx # API configuration
├── context/            # React Context providers
│   └── AppContext.tsx  # Global state management
├── services/           # External API integrations
│   └── fireworksAPI.ts # Fireworks AI API wrapper
├── utils/              # Utility functions
│   ├── localStorage.ts # LocalStorage operations
│   ├── quiz.ts         # Quiz generation logic
│   └── constants.ts    # Application constants
└── types/              # TypeScript type definitions
    └── index.ts        # All interface definitions
```

## Core Architecture

### State Management

The application uses React Context API for global state management. The `AppContext` provides:

- **Selected Language:** Currently chosen target language for learning
- **Vocabulary Sets:** Collection of all saved vocabulary sets
- **Add Vocab Set:** Function to save new vocabulary with intelligent merging
- **Remove Vocab Set:** Function to delete vocabulary sets
- **Remove Word:** Function to remove individual words from sets

### Data Models

**IVocabSet:**
```typescript
{
    id: string
    topic: string
    language: string
    vocab_list: IVocabItem[]
    saved_at: string
}
```

**IVocabItem:**
```typescript
{
    word_target: string      // Word in target language
    word_english: string     // English translation
    phonetic: string         // Phonetic transcription
    example_sentence: string // Example usage
}
```

**IQuizQuestion:**
```typescript
{
    id: string
    type: 'meaning' | 'spelling'
    word: IVocabItem
    question: string
    options: string[]
    correctAnswer: string
}
```

## Key Features Implementation

### AI Vocabulary Generation

The chat interface integrates with Fireworks AI to generate vocabulary lists:

1. **User Input Processing:** User sends a message requesting vocabulary on a topic
2. **API Call:** System sends request to Fireworks AI with:
   - Target language selection
   - User's topic/instruction
   - Structured system prompt for JSON response
3. **Response Parsing:** Extracts JSON from AI response, handling markdown formatting
4. **Data Transformation:** Maps API response to internal vocabulary structure
5. **Display & Save:** Shows vocabulary in UI and allows saving to collection

The AI prompt is carefully crafted to ensure:
- Structured JSON responses
- Appropriate vocabulary level (CEFR A2-B1)
- Short, practical example sentences
- Accurate translations

### Vocabulary Merging Logic

When saving vocabulary, the system intelligently handles duplicates:

1. **Topic Matching:** Checks if a vocabulary set with the same topic and language exists
2. **Word Deduplication:** Compares new words against existing words (case-insensitive)
3. **Smart Merge:** Adds only new words to existing set, preserving old words
4. **Feedback:** Provides user feedback on merge results (new words added, existing count, etc.)

### Quiz Generation Algorithm

The quiz system generates questions dynamically:

**Meaning Questions:**
- Presents word in target language
- Generates 4 multiple-choice options (1 correct + 3 distractors)
- Distractors selected from other vocabulary words
- Ensures no duplicate options

**Spelling Questions:**
- Presents English translation
- Generates 4 multiple-choice options with:
  - Correct spelling in target language
  - Typo variations (character swaps, deletions, additions)
  - Alternative words from vocabulary as distractors
- Uses intelligent typo generation for more realistic wrong answers

**Question Selection:**
- Alternates between meaning and spelling questions
- Randomizes word selection from chosen vocabulary set(s)
- Shuffles question order for variety

### Data Persistence

All data is stored in browser LocalStorage with separate keys:

- **Vocabulary Sets:** `dobby_vocab_sets` - Array of IVocabSet
- **API Key:** `dobby_fireworks_api_key` - Encrypted API key
- **Quiz Results:** `dobby_quiz_results` - Array of quiz completion records

All storage operations include error handling and fallback values.

## User Interface

### Design Principles

- **Glassmorphism:** Modern glass-effect UI with backdrop blur
- **Responsive Design:** Mobile-first approach with breakpoints for tablet/desktop
- **Smooth Animations:** Fade-in animations and hover effects
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation support
- **Visual Feedback:** Color-coded states (loading, success, error)

### Navigation

The application uses a fixed header with navigation links:
- **Dobby Chat:** Main AI conversation interface
- **My Vocabulary:** Vocabulary collection management
- **Quiz:** Interactive testing interface
- **Settings:** API key configuration

All navigation is handled by React Router with active state indicators.

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- Fireworks AI API key

### Installation Steps

1. **Clone the repository:**
```bash
git clone https://github.com/maivankien/dobby-language-buddy.git
cd dobby-language-buddy
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure API Key:**
   - Start the development server: `npm run dev`
   - Navigate to Settings page
   - Enter your Fireworks AI API key
   - Click Save

4. **Start development server:**
```bash
npm run dev
```

5. **Build for production:**
```bash
npm run build
```

### Environment Requirements

- Modern browser with LocalStorage support
- JavaScript enabled
- Internet connection for AI API calls

## Usage Guide

### Getting Started

1. **Configure API Key:**
   - Go to Settings page
   - Enter your Fireworks AI API key
   - Save the configuration

2. **Generate Vocabulary:**
   - Navigate to Dobby Chat
   - Select your target language
   - Type a message like "Give me 10 words about cooking"
   - Wait for Dobby's response
   - Review the generated vocabulary
   - Click "SAVE WORDS" to add to your collection

3. **Manage Vocabulary:**
   - Go to My Vocabulary page
   - View all your saved sets
   - Click on words to see details
   - Delete sets or individual words as needed
   - Add new vocabulary manually using "Add Vocabulary" button

4. **Take Quizzes:**
   - Navigate to Quiz page
   - Select a vocabulary set (or "All Sets")
   - Choose number of questions (5, 10, or 20)
   - Click "Start Quiz"
   - Answer questions and review results

## API Integration

### Fireworks AI Configuration

The application uses Fireworks AI's inference API with the following model:
- **Model:** `accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new`
- **Endpoint:** `https://api.fireworks.ai/inference/v1/chat/completions`
- **Authentication:** Bearer token (API key stored in LocalStorage)

### API Request Format

The system sends structured prompts to ensure JSON responses:
- System prompt defines output format
- User prompt includes target language and topic
- Temperature set to 0.6 for balanced creativity/consistency

### Error Handling

- Validates API key presence before requests
- Handles network errors gracefully
- Provides user-friendly error messages
- Falls back to error states when API calls fail

## Performance Considerations

- **Lazy Loading:** Components load on-demand through React Router
- **LocalStorage Optimization:** Efficient read/write operations
- **State Memoization:** Context values memoized to prevent unnecessary re-renders
- **Animation Optimization:** CSS-based animations for smooth performance
- **Responsive Images:** Optimized image loading for logo and assets

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential improvements for future versions:
- User accounts and cloud sync
- Advanced quiz modes (timed quizzes, flash cards)
- Pronunciation audio playback
- Progress analytics and statistics
- Export/import vocabulary sets
- Multiple API provider support
- Offline mode support
