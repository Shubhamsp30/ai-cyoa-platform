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
Path ${idx + 1} (${path.outcome_type}):
- Intent keywords: ${path.intent_keywords.join(', ')}
- Message: ${path.success_message || path.failure_message || 'Continue'}
`).join('\n')}

Analyze the player's input and determine:
1. What is the player's intent?
2. Which path (if any) does it match best?
3. How confident are you in this match (0-1)?
4. Why did you make this decision?

Respond in JSON format:
{
  "detected_intent": "brief description of what the player wants to do",
  "matched_path_index": number or null, // 0-based index of the matched path, or null if no match
  "confidence": number between 0 and 1,
  "reasoning": "explanation of your decision"
}`

    try {
        let analysis: any = {}

        if (apiKey.startsWith('sk-')) {
            // OpenAI Path
            const openai = new OpenAI({ apiKey })
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert at understanding player intent in narrative games. Be generous in matching player intent to valid paths, but also recognize when a player is trying something completely different. Output valid JSON.',
                    },
                    { role: 'user', content: systemPrompt },
                ],
                temperature: 0.3,
                response_format: { type: 'json_object' },
            })
            analysis = JSON.parse(response.choices[0].message.content || '{}')

        } else if (apiKey.startsWith('AIza')) {
            // Google Gemini Path
            const genAI = new GoogleGenerativeAI(apiKey)
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } })

            const result = await model.generateContent(systemPrompt)
            const text = result.response.text()
            analysis = JSON.parse(text)
        } else {
            console.warn("Unknown API Key format, attempting OpenAI default...")
            const openai = new OpenAI({ apiKey })
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: systemPrompt }],
                response_format: { type: 'json_object' }
            })
            analysis = JSON.parse(response.choices[0].message.content || '{}')
        }

        // Match the path
        const matchedPath =
            (analysis.matched_path_index !== null && analysis.matched_path_index !== undefined)
                ? validPaths[analysis.matched_path_index]
                : null

        // Generate appropriate message
        let message = ''
        if (matchedPath) {
            message =
                matchedPath.success_message ||
                matchedPath.failure_message ||
                'You proceed with your decision...'
        } else {
            message = `Your decision to "${analysis.detected_intent || userInput}" is not aligned with the available paths in this scene. ${analysis.reasoning || ''} Please try a different approach.`
        }

        return {
            detected_intent: analysis.detected_intent || userInput,
            matched_path: matchedPath,
            confidence: analysis.confidence || 0,
            reasoning: analysis.reasoning || '',
            message,
        }

    } catch (error) {
        console.error('AI analysis error:', error)

        // Fallback: simple keyword matching
        const lowerInput = userInput.toLowerCase()
        let bestMatch: ValidPath | null = null
        let bestScore = 0

        for (const path of validPaths) {
            const matchCount = path.intent_keywords.filter((keyword) =>
                lowerInput.includes(keyword.toLowerCase())
            ).length

            if (matchCount > bestScore) {
                bestScore = matchCount
                bestMatch = path
            }
        }

        return {
            detected_intent: userInput,
            matched_path: bestScore > 0 ? bestMatch : null,
            confidence: bestScore > 0 ? 0.7 : 0,
            reasoning: 'Fallback keyword matching used due to AI error',
            message:
                bestMatch && bestScore > 0
                    ? bestMatch.success_message ||
                    bestMatch.failure_message ||
                    'You proceed...'
                    : 'Your decision does not match any available paths. Please try again.',
        }
    }
}
