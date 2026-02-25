import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface ValidPath {
    intent_keywords: string[]
    next_scene_id: string
    success_message?: string
    failure_message?: string
    outcome_type: 'success' | 'consequence' | 'redirect'
}

interface AnalysisResult {
    detected_intent: string
    matched_path: ValidPath | null
    confidence: number
    reasoning: string
    message: string
}

export async function analyzePlayerDecision(
    userInput: string,
    validPaths: ValidPath[],
    sceneContext: string
): Promise<AnalysisResult> {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new Error('No API Key found')

    const systemPrompt = `You are an AI game master for a Choose Your Own Adventure game about Tanaji Malusare's conquest of Sinhagad.

Scene Context: ${sceneContext}

The player has entered: "${userInput}"

Valid decision paths for this scene:
${validPaths.map((path, idx) => `
- Index ${idx} (${path.outcome_type}):
  - Keywords: ${path.intent_keywords.join(', ')}
  - Intent: ${path.success_message || path.failure_message || 'Proceed to next phase'}
`).join('\n')}

**CRITICAL INSTRUCTIONS**:
1. **Language Intelligence**: The player may enter commands in **Marathi**, **Hindi**, or **English**. You must analyze the meaning, not just words.
2. **Extreme Generosity**: If the player's intent matches the *general idea* of a path, MATCH IT. Roleplaying, dramatic flair, and long sentences should be analyzed for the core action.
3. **Indexing Precision**: Use the **0-based Index** provided above. If you match "Index 0", the "matched_path_index" MUST be 0.
4. **Cultural Context**: Tanaji Malusare is a legendary hero. Phrases indicating bravery, sacrifice, or storming the fort should be matched to aggressive/success paths.

Analyze the player's input and determine:
1. What is the core action/intent?
2. Which Index (0, 1, etc.) matches best?
3. Confidence (0.0 to 1.0).

Respond in JSON format:
{
  "detected_intent": "brief summary",
  "matched_path_index": number or null, 
  "confidence": number,
  "reasoning": "why this index?"
}`

    try {
        let analysis: any = {}
        // ... (API calling logic remains same, just ensuring prompt is used)
        if (apiKey.startsWith('sk-')) {
            const openai = new OpenAI({ apiKey })
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert at understanding player intent in narrative games. Be generous in matching player intent to valid paths. Output valid JSON.',
                    },
                    { role: 'user', content: systemPrompt },
                ],
                temperature: 0.3,
                response_format: { type: 'json_object' },
            })
            analysis = JSON.parse(response.choices[0].message.content || '{}')
        } else if (apiKey.startsWith('AIza')) {
            const genAI = new GoogleGenerativeAI(apiKey)
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest", generationConfig: { responseMimeType: "application/json" } })
            const result = await model.generateContent(systemPrompt)
            const text = result.response.text()
            analysis = JSON.parse(text)
        } else {
            const openai = new OpenAI({ apiKey })
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: systemPrompt }],
                response_format: { type: 'json_object' }
            })
            analysis = JSON.parse(response.choices[0].message.content || '{}')
        }

        // ...

        // Match the path with extra safety for index types
        const rawIndex = analysis.matched_path_index ?? analysis.matched_index
        const index = typeof rawIndex === 'string' ? parseInt(rawIndex) : rawIndex

        const matchedPath =
            (index !== null && index !== undefined && !isNaN(index) && index >= 0 && index < validPaths.length)
                ? validPaths[index]
                : null

        // ... (message generation)

        return {
            detected_intent: analysis.detected_intent || userInput,
            matched_path: matchedPath,
            confidence: analysis.confidence || 0,
            reasoning: analysis.reasoning || '',
            message: matchedPath
                ? (matchedPath.success_message || analysis.message || 'Mission Objective Updated.')
                : (analysis.message || 'Tactical Alignment Failed. Try a different command.'),
        }

    } catch (error) {
        console.error('AI analysis error:', error)

        // FALLBACK: Robust Keyword & Phrase Matching
        const lowerInput = userInput.toLowerCase()
        const inputTokens = lowerInput.split(/[\s,!.?]+/).filter(t => t.length > 2)

        let bestMatch: ValidPath | null = null
        let bestScore = 0

        for (const path of validPaths) {
            let currentScore = 0
            const keywords = path.intent_keywords || []

            for (const keyword of keywords) {
                const lowerKeyword = keyword.toLowerCase()

                // 1. Phrasal match (Strong)
                if (lowerInput.includes(lowerKeyword)) currentScore += 3

                // 2. Token overlap (Good)
                if (inputTokens.some(token => lowerKeyword.includes(token) || token.includes(lowerKeyword))) {
                    currentScore += 1
                }
            }

            if (currentScore > bestScore) {
                bestScore = currentScore
                bestMatch = path
            }
        }

        return {
            detected_intent: userInput,
            matched_path: bestScore >= 2 ? bestMatch : null,
            confidence: bestScore >= 2 ? 0.5 : 0,
            reasoning: 'Fallback heuristic matching enabled.',
            message: (bestMatch && bestScore >= 2)
                ? bestMatch.success_message || 'Command accepted via fallback.'
                : 'Invalid command. Ensure your intent aligns with the mission objectives.',
        }
    }
}
