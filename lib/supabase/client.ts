import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Story {
    id: string
    title: string
    description: string
    thumbnail_url: string | null
    character_name: string
    total_scenes: number
    starting_scene_id: string
    is_published: boolean
    created_at: string
    translations?: Record<string, any> // jsonb default {}
    available_characters?: string[]
}

export interface Scene {
    id: string
    story_id: string
    scene_number: number
    title: string
    overview: string
    content: string
    image_url: string | null
    valid_paths: ValidPath[]
    is_ending: boolean
    created_at: string
    translations?: Record<string, any> // jsonb default {}
}

export interface ValidPath {
    intent_keywords: string[]
    next_scene_id: string
    success_message?: string
    failure_message?: string
    outcome_type: 'success' | 'consequence' | 'redirect'
}

// Helper functions
export async function getAllStories(): Promise<Story[]> {
    const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching stories:', error)
        return []
    }

    return data || []
}

export async function getStoryById(id: string): Promise<Story | null> {
    const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single()

    if (error) {
        console.error('Error fetching story:', error)
        return null
    }

    return data
}

export async function getSceneById(id: string): Promise<Scene | null> {
    const { data, error } = await supabase
        .from('scenes')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching scene:', error)
        return null
    }

    return data
}

export async function getScenesByStory(storyId: string): Promise<Scene[]> {
    const { data, error } = await supabase
        .from('scenes')
        .select('*')
        .eq('story_id', storyId)
        .order('scene_number', { ascending: true })

    if (error) {
        console.error('Error fetching scenes:', error)
        return []
    }

    return data || []
}

// Get public URL for images (supports both story covers and scene images)
export function getImageUrl(path: string | null, bucket: string = 'scene-images'): string | null {
    if (!path) return null

    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

    return data.publicUrl
}

