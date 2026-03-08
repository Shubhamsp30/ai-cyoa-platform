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

    const systemPrompt = `You are a Precise Intent Analyzer for a Choose Your Own Adventure game about Indian History (Tanaji Malusare & Baji Prabhu).

Scene Context: ${sceneContext}

Player Input: "${userInput}"

Valid Paths for this Scene:
${validPaths.map((path, idx) => `
Index ${idx}:
- Required Action/Intent: ${path.intent_keywords.join(', ')}
- Description/Outcome: ${path.success_message || path.failure_message || 'Proceed'}
`).join('\n')}

**DETERMINISTIC RULES**:
1. **Action vs Outcome**: Focus ONLY on the player's *action* or *intent*. Do NOT match a path just because the player describes what they want to happen next; they must perform the action required to get there.
2. **Language Handling**: Support English, Hindi, Marathi, Hinglish, and Marathlish. 
   - Example: "चला" (Marathi) or "chalo" (Hinglish) should match "continue/next" paths.
3. **Strictness**: If the player's input is completely unrelated to the mission (e.g., asking for a joke, saying hello), return matched_path_index: null.
4. **Keyword Weight**: If the player uses specific keywords from a path (like "volunteer" or "vow"), that path is likely the winner.
5. **Roleplay**: If the player roleplays ("I draw my sword and charging forward!"), match it to the "attack/charge" path.

Output valid JSON:
{
  "detected_intent": "Brief description of what the player is trying to do",
  "matched_path_index": number | null,
  "confidence": number (0.0 to 1.0),
  "reasoning": "Brief explanation of the choice"
}`

    try {
        let analysis: any = {}
        const openai = new OpenAI({ apiKey })

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'You are a precise JSON classifier. Match player intent to the most logical path index. Be accurate, not just generous.',
                },
                { role: 'user', content: systemPrompt },
            ],
            temperature: 0.1, // Lower temperature for more consistent results
            response_format: { type: 'json_object' },
        })
        analysis = JSON.parse(response.choices[0].message.content || '{}')

        // Match the path with extra safety for index types
        const rawIndex = analysis.matched_path_index ?? analysis.matched_index
        const index = typeof rawIndex === 'string' ? parseInt(rawIndex) : rawIndex

        const matchedPath =
            (index !== null && index !== undefined && !isNaN(index) && index >= 0 && index < validPaths.length)
                ? validPaths[index]
                : null

        return {
            detected_intent: analysis.detected_intent || userInput,
            matched_path: matchedPath,
            confidence: analysis.confidence || 0,
            reasoning: analysis.reasoning || '',
            message: matchedPath
                ? (matchedPath.success_message || 'Mission Objective Updated.')
                : (analysis.message || 'Strategic Misalignment. Your command does not fit the current situation.'),
        }

    } catch (error) {
        console.error('AI analysis error:', error)

        // FALLBACK: Strengthened Keyword matching
        const lowerInput = userInput.toLowerCase()
        const inputTokens = lowerInput.split(/[\s,!.?]+/).filter(t => t.length > 2)

        let bestMatch: ValidPath | null = null
        let bestScore = 0

        for (const path of validPaths) {
            let currentScore = 0
            const keywords = path.intent_keywords || []

            for (const keyword of keywords) {
                const lowerKeyword = keyword.toLowerCase()

                // Exact phrase match (Highest priority)
                if (lowerInput === lowerKeyword) {
                    currentScore += 10
                }
                // Substring match
                else if (lowerInput.includes(lowerKeyword)) {
                    currentScore += 5
                }

                // Token overlap
                if (inputTokens.some(token => lowerKeyword.includes(token))) {
                    currentScore += 2
                }
            }

            if (currentScore > bestScore) {
                bestScore = currentScore
                bestMatch = path
            }
        }

        return {
            detected_intent: userInput,
            matched_path: bestScore >= 5 ? bestMatch : null,
            confidence: bestScore >= 5 ? 0.4 : 0,
            reasoning: 'Fallback heuristic matching.',
            message: (bestMatch && bestScore >= 5)
                ? bestMatch.success_message || 'Command accepted.'
                : 'Command not recognized. Please try to align with the mission objectives.',
        }
    }
}
