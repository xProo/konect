

const SUPABASE_URL = 'https://ybccohjmdcewecgzkhxm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliY2NvaGptZGNld2VjZ3praHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTAzMzgsImV4cCI6MjA2ODY2NjMzOH0.uI1rTqrMkySyFNXxFLNEzsqcHRsy2ms4Ju073wTRDCs'


export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


export const auth = {

  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    return { data, error }
  },

  
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    return { data, error }
  },


  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },


  getCurrentUser() {
    return supabase.auth.getUser()
  },


  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Fonctions pour les données
export const database = {
  // Récupérer les événements
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
    return { data, error }
  },

  // Récupérer les communautés
  async getCommunities() {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
    return { data, error }
  },

  // Rechercher des événements
  async searchEvents(query) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .ilike('title', `%${query}%`)
    return { data, error }
  },

  // Rechercher des communautés
  async searchCommunities(query) {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .ilike('name', `%${query}%`)
    return { data, error }
  }
} 