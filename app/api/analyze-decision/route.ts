import { NextRequest, NextResponse } from 'next/server'
import { analyzePlayerDecision } from '@/lib/ai/intent-analyzer'

export async function POST(request: NextRequest) {
    try {
        const { userInput, validPaths, sceneContext } = await request.json()

        if (!userInput || !validPaths || !sceneContext) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const analysis = await analyzePlayerDecision(
            userInput,
            validPaths,
            sceneContext
        )

        console.log(`[DECISION ANALYZER] Input: "${userInput}" -> Intent: ${analysis.detected_intent} (Confidence: ${analysis.confidence})`)
        if (analysis.matched_path) {
            console.log(`[DECISION ANALYZER] MATCH SUCCESS: Found path with next_scene_id: ${analysis.matched_path.next_scene_id}`)
        } else {
            console.log(`[DECISION ANALYZER] MATCH FAILURE: No path found. Reasoning: ${analysis.reasoning}`)
        }

        return NextResponse.json(analysis)
    } catch (error) {
        console.error('Decision analysis error:', error)
        return NextResponse.json(
            { error: 'Failed to analyze decision' },
            { status: 500 }
        )
    }
}
