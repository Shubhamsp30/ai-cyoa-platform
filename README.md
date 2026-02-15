# Tanaji - AI-Powered Interactive Story

Experience the legendary conquest of Sinhagad fort through AI-powered storytelling. Play as Tanaji Malusare in this epic tale of courage, sacrifice, and Maratha pride.

## Features

- 🦁 **Play as Tanaji Malusare**: Experience the story from the legendary warrior's perspective
- 🤖 **AI-Powered Decisions**: Natural language input analyzed by OpenAI GPT-4
- 📖 **10 Epic Scenes**: Complete historical narrative from the Treaty of Purandar to the conquest
- 💾 **Auto-Save Progress**: Your progress is automatically saved in your browser
- 🎨 **Premium UI**: Modern design with smooth animations and engaging feedback
- 📱 **Responsive**: Works beautifully on desktop, tablet, and mobile
- ✨ **No Login Required**: Jump straight into the adventure

## Tech Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Styling**: Vanilla CSS with modern design system
- **AI**: OpenAI GPT-4 for intent analysis
- **State Management**: Browser localStorage (no database needed)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([get one here](https://platform.openai.com))

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   
   Copy `.env.local.example` to `.env.local`:
   ```bash
   copy .env.local.example .env.local
   ```

   Fill in your OpenAI API key:
   ```env
   OPENAI_API_KEY=your-openai-api-key
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Play

1. **Start**: Click "Begin the Legend" on the landing page
2. **Read Scenes**: Experience each scene's overview and full narrative
3. **Make Decisions**: Type what you would do in natural language
4. **AI Analysis**: The AI understands your intent and progresses the story
5. **Complete Journey**: Play through all 10 scenes to the epic conclusion
6. **Auto-Save**: Your progress is automatically saved - refresh anytime to resume!

## Project Structure

```
├── app/
│   ├── api/analyze-decision/    # AI decision analysis endpoint
│   ├── game/play/               # Main gameplay page (all scenes embedded)
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Landing page
├── components/
│   └── ui/                      # Reusable UI components
├── lib/
│   └── ai/                      # AI intent analyzer
└── package.json
```

## Key Features

### 🎮 Single-Player Experience
- Play as Tanaji Malusare throughout the entire story
- No login or registration required
- Progress automatically saved to browser localStorage

### 🤖 Smart AI Feedback
- **Correct Decisions**: Engaging success messages with emojis
- **Wrong Decisions**: Polite, helpful guidance to try again
- **Variety**: Multiple feedback messages for better experience

### 💾 Auto-Save System
- Progress saved after each scene
- Resume anytime by refreshing the page
- Restart option available at any time

## AI Decision System

The AI analyzes player input against predefined valid paths for each scene:

1. Player types decision in natural language
2. OpenAI GPT-4 analyzes intent
3. System matches intent to valid story paths
4. Appropriate scene progression or feedback is provided
5. Fallback keyword matching if AI fails

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Contributing

This is a demonstration project. Feel free to fork and customize with your own stories!

## License

MIT License - feel free to use this project as a template for your own AI-powered adventures.

## Credits

Story based on the historical conquest of Sinhagad fort by Tanaji Malusare in 1670.
