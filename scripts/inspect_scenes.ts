
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://khxtdcyrvamyfkfgyjov.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoeHRkY3lydmFteWZrZmd5am92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NjAyODgsImV4cCI6MjA4NjIzNjI4OH0.aZTh0rYrwLzdDS2mHQD0RVZps_GNlkaD1Ss_GaAIfLo'

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
    console.log('Searching for Bajiprabhu story...')
    const { data: stories, error: storyError } = await supabase
        .from('stories')
        .select('*')
        .ilike('title', '%Baji%')

    if (storyError || !stories?.length) {
        console.error('Story not found:', storyError)
        return
    }

    const story = stories[0]
    console.log(`Found story: ${story.title} (${story.id})`)

    console.log('Fetching scenes...')
    const { data: scenes, error: sceneError } = await supabase
        .from('scenes')
        .select('id, scene_number, title, overview') // Minimal fields
        .eq('story_id', story.id)
        .order('scene_number', { ascending: true })

    if (sceneError) {
        console.error('Error fetching scenes:', sceneError)
        return
    }

    const fs = require('fs')
    let output = ''
    scenes.forEach(s => {
        output += `Scene ${s.scene_number}: ${s.title}\n`
        output += `Overview: ${s.overview}\n`
        output += '----------------\n'
    })
    fs.writeFileSync('temp_scenes.txt', output)
    console.log('Written to temp_scenes.txt')
}

main()
