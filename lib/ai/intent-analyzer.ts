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

**CRITICAL INSTRUCTIONS**:
1. **Language Support**: The player may write in **Marathi**, **Hindi**, or **English**. You must support all three.
2. **Semantic Matching**: Do NOT look for exact keywords. Look for the **Core Intent**.
   - Example: If the player says "I will bring back the fort at any cost!", and the path is "Attack/Accept Mission", MATCH IT.
   - Example: "I am not ready" matches "Refuse/Wait".
3. **Dramatic Text**: Players often roleplay with long, dramatic sentences. Ignore the fluff and find the action verb.
4. **Cultural Nuance**: phrases like "Jeev gela tari chalel" (even if I die) or "Raiba" indicate determination/Acceptance.

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
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } })
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

        // Match the path
        const matchedPath =
            (analysis.matched_path_index !== null && analysis.matched_path_index !== undefined)
                ? validPaths[analysis.matched_path_index]
                : null

        // ... (message generation)

        return {
            detected_intent: analysis.detected_intent || userInput,
            matched_path: matchedPath,
            confidence: analysis.confidence || 0,
            reasoning: analysis.reasoning || '',
            message: matchedPath ? (matchedPath.success_message || matchedPath.failure_message || 'You proceed...') : (analysis.message || 'Invalid choice'),
        }

    } catch (error) {
        console.error('AI analysis error:', error)

        // JOINED LOGIC FOR FALLBACK
        // Improve fallback to check for any token match
        const lowerInput = userInput.toLowerCase()
        const inputTokens = lowerInput.split(/[\s,!.?]+/)

        let bestMatch: ValidPath | null = null
        let bestScore = 0

        for (const path of validPaths) {
            // Check occurrences of keywords in input
            let currentScore = 0
            for (const keyword of path.intent_keywords) {
                const lowerKeyword = keyword.toLowerCase()
                // 1. Direct substring match (good for short keywords)
                if (lowerInput.includes(lowerKeyword)) currentScore += 2

                // 2. Token match (good for robustness)
                if (inputTokens.includes(lowerKeyword)) currentScore += 1
            }

            if (currentScore > bestScore) {
                bestScore = currentScore
                bestMatch = path
            }
        }

        return {
            detected_intent: userInput,
            matched_path: bestScore > 0 ? bestMatch : null,
            confidence: bestScore > 0 ? 0.6 : 0,
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
