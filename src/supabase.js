import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kzjwyzzlkcezdhavfexm.supabase.co"

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6and5enpsa2NlemRoYXZmZXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODEwMjQsImV4cCI6MjA4OTY1NzAyNH0.UKGLCDkC3cSiCyhvIVTmJlSpC5PEt7WG0raYU3jZtrE"





export const supabase = createClient(supabaseUrl, supabaseKey)