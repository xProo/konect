

const SUPABASE_URL = 'https://ybccohjmdcewecgzkhxm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliY2NvaGptZGNld2VjZ3praHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTAzMzgsImV4cCI6MjA2ODY2NjMzOH0.uI1rTqrMkySyFNXxFLNEzsqcHRsy2ms4Ju073wTRDCs'


export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


export const auth = {

  async signUp(userData) {
    const { data, error } = await supabase.auth.signUp(userData)
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
  },

  // === GESTION DES COMMUNAUTÉS ===
  
  // Créer une communauté
  async createCommunity(communityData) {
    const { data, error } = await supabase
      .from('communities')
      .insert([{
        name: communityData.name,
        description: communityData.description,
        category: communityData.category,
        location: communityData.location,
        image_url: communityData.image_url,
        referent_id: communityData.referent_id,
        created_at: new Date().toISOString()
      }])
      .select()
    return { data, error }
  },

  // Modifier une communauté
  async updateCommunity(communityId, updates) {
    const { data, error } = await supabase
      .from('communities')
      .update(updates)
      .eq('id', communityId)
      .select()
    return { data, error }
  },

  // Supprimer une communauté
  async deleteCommunity(communityId) {
    const { data, error } = await supabase
      .from('communities')
      .delete()
      .eq('id', communityId)
    return { data, error }
  },

  // Récupérer les communautés d'un utilisateur (en tant que référent)
  async getUserCommunities(userId) {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('referent_id', userId)
    return { data, error }
  },

  // === GESTION DES INSCRIPTIONS ===

  // Rejoindre une communauté
  async joinCommunity(userId, communityId) {
    const { data, error } = await supabase
      .from('community_members')
      .insert([{
        user_id: userId,
        community_id: communityId,
        joined_at: new Date().toISOString()
      }])
      .select()
    return { data, error }
  },

  // Quitter une communauté
  async leaveCommunity(userId, communityId) {
    const { data, error } = await supabase
      .from('community_members')
      .delete()
      .eq('user_id', userId)
      .eq('community_id', communityId)
    return { data, error }
  },

  // Vérifier si un utilisateur est membre d'une communauté
  async isMemberOfCommunity(userId, communityId) {
    const { data, error } = await supabase
      .from('community_members')
      .select('*')
      .eq('user_id', userId)
      .eq('community_id', communityId)
      .limit(1)
    return { data: data && data.length > 0, error }
  },

  // Récupérer les membres d'une communauté
  async getCommunityMembers(communityId) {
    const { data, error } = await supabase
      .from('community_members')
      .select(`
        *,
        user_profiles:user_id (
          id,
          email,
          prenom,
          nom,
          full_name
        )
      `)
      .eq('community_id', communityId)
    return { data, error }
  },

  // Récupérer les communautés auxquelles un utilisateur appartient
  async getUserMemberships(userId) {
    const { data, error } = await supabase
      .from('community_members')
      .select(`
        *,
        communities:community_id (
          id,
          name,
          description,
          category,
          location,
          image_url
        )
      `)
      .eq('user_id', userId)
    return { data, error }
  },

  // === DASHBOARD RÉFÉRENT ===

  // Statistiques d'une communauté
  async getCommunityStats(communityId) {
    // Nombre de membres
    const { data: membersCount, error: membersError } = await supabase
      .from('community_members')
      .select('*', { count: 'exact', head: true })
      .eq('community_id', communityId)

    // Nombre d'événements
    const { data: eventsCount, error: eventsError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('community_id', communityId)

    return {
      data: {
        members_count: membersCount?.length || 0,
        events_count: eventsCount?.length || 0
      },
      error: membersError || eventsError
    }
  },

  // Récupérer les événements d'une communauté
  async getCommunityEvents(communityId) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('community_id', communityId)
      .order('created_at', { ascending: false })
    return { data, error }
  }
} 