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

        return NextResponse.json(analysis)
    } catch (error) {
        console.error('Decision analysis error:', error)
        return NextResponse.json(
            { error: 'Failed to analyze decision' },
            { status: 500 }
        )
    }
}
