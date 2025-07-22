

const SUPABASE_URL = 'https://ybccohjmdcewecgzkhxm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliY2NvaGptZGNld2VjZ3praHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwOTAzMzgsImV4cCI6MjA2ODY2NjMzOH0.uI1rTqrMkySyFNXxFLNEzsqcHRsy2ms4Ju073wTRDCs'


export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


export const auth = {

  async signUp(userData) {
    const { data, error } = await supabase.auth.signUp(userData)
    
    // Si l'inscription réussit, créer le profil utilisateur
    if (!error && data.user) {
      try {
        await supabase
          .from('user_profiles')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            prenom: userData.options?.data?.prenom || '',
            nom: userData.options?.data?.nom || '',
            full_name: userData.options?.data?.full_name || data.user.email
          }])
      } catch (profileError) {
        console.log('Erreur lors de la création du profil:', profileError)
        // On ne fait pas échouer l'inscription pour autant
      }
    }
    
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

// === GESTION DU STORAGE ===
export const storage = {
  // Upload d'une image d'événement
  async uploadEventImage(file, eventId) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `event_${eventId}_${Date.now()}.${fileExt}`
      const filePath = `events/${fileName}`

      const { data, error } = await supabase.storage
        .from('event-images')
        .upload(filePath, file)

      if (error) return { data: null, error }

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath)

      return { data: { path: filePath, url: publicUrl }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Supprimer une image d'événement
  async deleteEventImage(imagePath) {
    const { data, error } = await supabase.storage
      .from('event-images')
      .remove([imagePath])
    return { data, error }
  },

  // Obtenir l'URL publique d'une image
  getPublicUrl(imagePath) {
    const { data } = supabase.storage
      .from('event-images')
      .getPublicUrl(imagePath)
    return data.publicUrl
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
    try {
      // Récupérer d'abord les membres
      const { data: members, error: membersError } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId)
      
      if (membersError) return { data: null, error: membersError }
      
      if (!members || members.length === 0) {
        return { data: [], error: null }
      }
      
      // Récupérer les profils des utilisateurs
      const userIds = members.map(member => member.user_id)
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', userIds)
      
      if (profilesError) return { data: null, error: profilesError }
      
      // Combiner les données
      const membersWithProfiles = members.map(member => {
        const profile = profiles?.find(p => p.id === member.user_id)
        return {
          ...member,
          user_profiles: profile || {
            id: member.user_id,
            email: 'Email non disponible',
            prenom: '',
            nom: '',
            full_name: 'Utilisateur'
          }
        }
      })
      
      return { data: membersWithProfiles, error: null }
      
    } catch (error) {
      return { data: null, error }
    }
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
          image_url,
          referent_id
        )
      `)
      .eq('user_id', userId)
    return { data, error }
  },

  // === DASHBOARD RÉFÉRENT ===

  // Statistiques d'une communauté
  async getCommunityStats(communityId) {
    try {
      // Nombre de membres
      const { count: membersCount, error: membersError } = await supabase
        .from('community_members')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', communityId)

      // Nombre d'événements
      const { count: eventsCount, error: eventsError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('community_id', communityId)

      return {
        data: {
          members_count: membersCount || 0,
          events_count: eventsCount || 0
        },
        error: membersError || eventsError
      }
    } catch (error) {
      return {
        data: { members_count: 0, events_count: 0 },
        error: error
      }
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
  },

  // === GESTION DES ÉVÉNEMENTS ===

  // Créer un événement
  async createEvent(eventData) {
    // Préparer les données de base
    const baseData = {
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      location: eventData.location,
      community_id: eventData.community_id
    };
    
    // Ajouter image_url seulement si elle existe
    if (eventData.image_url !== undefined) {
      baseData.image_url = eventData.image_url;
    }
    
    const { data, error } = await supabase
      .from('events')
      .insert([baseData])
      .select()
    return { data, error }
  },

  // Modifier un événement
  async updateEvent(eventId, updates) {
    // Préparer les données de mise à jour
    const baseUpdates = {};
    
    // Copier tous les champs sauf image_url si elle est undefined
    Object.keys(updates).forEach(key => {
      if (key !== 'image_url' || updates[key] !== undefined) {
        baseUpdates[key] = updates[key];
      }
    });
    
    const { data, error } = await supabase
      .from('events')
      .update(baseUpdates)
      .eq('id', eventId)
      .select()
    return { data, error }
  },

  // Supprimer un événement
  async deleteEvent(eventId) {
    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)
    return { data, error }
  },

  // === GESTION DES INSCRIPTIONS ===

  // S'inscrire à un événement
  async registerToEvent(userId, eventId) {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .insert([{
          user_id: userId,
          event_id: eventId,
          status: 'confirmed',
          registered_at: new Date().toISOString()
        }])
        .select()
      return { data, error }
    } catch (error) {
      return { data: null, error: { message: 'Table event_registrations non disponible. Veuillez exécuter le SQL d\'initialisation.' } }
    }
  },

  // Se désinscrire d'un événement
  async unregisterFromEvent(userId, eventId) {
    const { data, error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('user_id', userId)
      .eq('event_id', eventId)
    return { data, error }
  },

  // Vérifier si un utilisateur est inscrit à un événement
  async isRegisteredToEvent(userId, eventId) {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .limit(1)
      
      if (error) {
        // Si la table n'existe pas, retourner false
        return { data: false, error: null }
      }
      
      return { data: data && data.length > 0, error }
    } catch (error) {
      return { data: false, error: null }
    }
  },

  // Récupérer les participants d'un événement
  async getEventParticipants(eventId) {
    try {
      // Récupérer d'abord les inscriptions
      const { data: registrations, error: regError } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .eq('status', 'confirmed')
      
      if (regError) {
        // Si la table n'existe pas encore, retourner une liste vide
        return { data: [], error: null }
      }
      
      if (!registrations || registrations.length === 0) {
        return { data: [], error: null }
      }
      
      // Récupérer les profils des participants
      const userIds = registrations.map(reg => reg.user_id)
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', userIds)
      
      if (profilesError) return { data: null, error: profilesError }
      
      // Combiner les données
      const participantsWithProfiles = registrations.map(registration => {
        const profile = profiles?.find(p => p.id === registration.user_id)
        return {
          ...registration,
          user_profiles: profile || {
            id: registration.user_id,
            email: 'Email non disponible',
            prenom: '',
            nom: '',
            full_name: 'Utilisateur'
          }
        }
      })
      
      return { data: participantsWithProfiles, error: null }
      
    } catch (error) {
      return { data: null, error }
    }
  },

  // Récupérer les événements auxquels un utilisateur est inscrit
  async getUserEvents(userId) {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events:event_id (
          id,
          title,
          description,
          date,
          time,
          location,
          is_public,
          max_participants,
          price,
          status
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'confirmed')
    return { data, error }
  }
}

// === FONCTIONS ADMINISTRATEUR ===
export const admin = {
  // Vérifier si l'utilisateur actuel est admin
  async isAdmin() {
    try {
      const { data: { user } } = await auth.getCurrentUser();
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      return data?.is_admin || false;
    } catch (error) {
      return false;
    }
  },

  // Obtenir les statistiques générales
  async getStats() {
    try {
      // Utiliser la vue admin_stats si elle existe, sinon calculer manuellement
      const { data: viewStats, error: viewError } = await supabase
        .from('admin_stats')
        .select('*')
        .single();

      if (!viewError && viewStats) {
        return { data: viewStats, error: null };
      }

      // Si la vue n'existe pas, calculer manuellement
      const results = await Promise.all([
        supabase.from('communities').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        // Gérer event_registrations qui peut ne pas exister
        supabase.from('event_registrations').select('*', { count: 'exact', head: true })
          .then(result => result)
          .catch(() => ({ count: 0, error: null }))
      ]);

      const [
        { count: totalCommunities },
        { count: totalEvents },
        { count: totalUsers },
        { count: totalRegistrations }
      ] = results;

      const stats = {
        total_communities: totalCommunities || 0,
        total_events: totalEvents || 0,
        total_users: totalUsers || 0,
        total_registrations: totalRegistrations || 0
      };

      return { data: stats, error: null };
    } catch (error) {
      // Fallback en cas d'erreur - retourner des stats vides
      const stats = {
        total_communities: 0,
        total_events: 0,
        total_users: 0,
        total_registrations: 0
      };
      return { data: stats, error: null };
    }
  },

  // === GESTION DES UTILISATEURS ===
  // Obtenir tous les utilisateurs
  async getAllUsers() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Mettre à jour un utilisateur
  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select();
    return { data, error };
  },

  // Supprimer un utilisateur (supprimer complètement)
  async deleteUser(userId) {
    try {
      // D'abord supprimer les données liées pour éviter les erreurs de contrainte
      await Promise.all([
        // Supprimer les inscriptions aux événements
        supabase.from('event_registrations').delete().eq('user_id', userId).then(() => {}),
        // Supprimer les appartenances aux communautés
        supabase.from('community_members').delete().eq('user_id', userId).then(() => {}),
        // Supprimer les communautés dont l'utilisateur est référent
        supabase.from('communities').delete().eq('referent_id', userId).then(() => {})
      ]);

      // Ensuite supprimer le profil utilisateur
      const { data, error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Promouvoir/rétrograder admin
  async toggleAdminStatus(userId, isAdmin) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ is_admin: isAdmin })
      .eq('id', userId)
      .select();
    return { data, error };
  },

  // === GESTION DES COMMUNAUTÉS ===
  // Obtenir toutes les communautés avec détails
  async getAllCommunities() {
    try {
      // Récupérer d'abord les communautés
      const { data: communities, error: communitiesError } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (communitiesError) return { data: null, error: communitiesError };
      
      if (!communities || communities.length === 0) {
        return { data: [], error: null };
      }
      
      // Récupérer les profils des référents
      const referentIds = communities.map(c => c.referent_id).filter(Boolean);
      
      if (referentIds.length === 0) {
        return { data: communities.map(c => ({ ...c, user_profiles: null })), error: null };
      }
      
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', referentIds);
      
      if (profilesError) return { data: null, error: profilesError };
      
      // Combiner les données
      const communitiesWithProfiles = communities.map(community => {
        const profile = profiles?.find(p => p.id === community.referent_id);
        return {
          ...community,
          user_profiles: profile || null
        };
      });
      
      return { data: communitiesWithProfiles, error: null };
      
    } catch (error) {
      return { data: null, error };
    }
  },

  // Valider une communauté
  async validateCommunity(communityId, isValidated) {
    const { data, error } = await supabase
      .from('communities')
      .update({ 
        is_validated: isValidated,
        validated_at: isValidated ? new Date().toISOString() : null
      })
      .eq('id', communityId)
      .select();
    return { data, error };
  },

  // Supprimer une communauté
  async deleteCommunityAdmin(communityId) {
    const { data, error } = await supabase
      .from('communities')
      .delete()
      .eq('id', communityId);
    return { data, error };
  },

  // Obtenir les membres d'une communauté
  async getCommunityMembersAdmin(communityId) {
    const { data, error } = await supabase
      .from('community_members')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('community_id', communityId);
    return { data, error };
  },

  // === GESTION DES ÉVÉNEMENTS ===
  // Obtenir tous les événements
  async getAllEvents() {
    try {
      // Récupérer d'abord les événements avec leurs communautés
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          communities (*)
        `)
        .order('created_at', { ascending: false });
      
      if (eventsError) return { data: null, error: eventsError };
      
      if (!events || events.length === 0) {
        return { data: [], error: null };
      }
      
      // Récupérer les profils des référents des communautés
      const referentIds = events
        .map(e => e.communities?.referent_id)
        .filter(Boolean);
      
      if (referentIds.length === 0) {
        return { data: events, error: null };
      }
      
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', referentIds);
      
      if (profilesError) return { data: null, error: profilesError };
      
      // Combiner les données
      const eventsWithProfiles = events.map(event => {
        if (event.communities && event.communities.referent_id) {
          const profile = profiles?.find(p => p.id === event.communities.referent_id);
          return {
            ...event,
            communities: {
              ...event.communities,
              user_profiles: profile || null
            }
          };
        }
        return event;
      });
      
      return { data: eventsWithProfiles, error: null };
      
    } catch (error) {
      return { data: null, error };
    }
  },

  // Supprimer un événement
  async deleteEventAdmin(eventId) {
    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    return { data, error };
  },

  // Obtenir les participants d'un événement
  async getEventParticipantsAdmin(eventId) {
    try {
      // Récupérer d'abord les inscriptions
      const { data: registrations, error: regError } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId);
      
      if (regError) {
        return { data: [], error: regError };
      }
      
      if (!registrations || registrations.length === 0) {
        return { data: [], error: null };
      }
      
      // Récupérer les profils des participants
      const userIds = registrations.map(reg => reg.user_id).filter(Boolean);
      
      if (userIds.length === 0) {
        return { data: [], error: null };
      }
      
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', userIds);
      
      if (profilesError) {
        return { data: [], error: profilesError };
      }
      
      // Récupérer les informations de l'événement
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      // Combiner les données
      const participantsWithProfiles = registrations.map(registration => {
        const profile = profiles?.find(p => p.id === registration.user_id);
        return {
          ...registration,
          user_profiles: profile || {
            id: registration.user_id,
            email: 'Email non disponible',
            full_name: 'Utilisateur inconnu'
          },
          events: event || null
        };
      });
      
      return { data: participantsWithProfiles, error: null };
      
    } catch (error) {
      return { data: [], error };
    }
  },

  // Supprimer un participant d'un événement
  async removeEventParticipant(eventId, userId) {
    const { data, error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);
    return { data, error };
  },

  // === RECHERCHE ET FILTRES ===
  // Rechercher des utilisateurs
  async searchUsers(query) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .or(`email.ilike.%${query}%,full_name.ilike.%${query}%,prenom.ilike.%${query}%,nom.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Rechercher des communautés
  async searchCommunities(query) {
    try {
      // Récupérer d'abord les communautés correspondantes
      const { data: communities, error: communitiesError } = await supabase
        .from('communities')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,location.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (communitiesError) return { data: null, error: communitiesError };
      
      if (!communities || communities.length === 0) {
        return { data: [], error: null };
      }
      
      // Récupérer les profils des référents
      const referentIds = communities.map(c => c.referent_id).filter(Boolean);
      
      if (referentIds.length === 0) {
        return { data: communities.map(c => ({ ...c, user_profiles: null })), error: null };
      }
      
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', referentIds);
      
      if (profilesError) return { data: null, error: profilesError };
      
      // Combiner les données
      const communitiesWithProfiles = communities.map(community => {
        const profile = profiles?.find(p => p.id === community.referent_id);
        return {
          ...community,
          user_profiles: profile || null
        };
      });
      
      return { data: communitiesWithProfiles, error: null };
      
    } catch (error) {
      return { data: null, error };
    }
  },

  // Rechercher des événements
  async searchEvents(query) {
    try {
      // Récupérer d'abord les événements avec leurs communautés
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          communities (*)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (eventsError) return { data: null, error: eventsError };
      
      if (!events || events.length === 0) {
        return { data: [], error: null };
      }
      
      // Récupérer les profils des référents des communautés
      const referentIds = events
        .map(e => e.communities?.referent_id)
        .filter(Boolean);
      
      if (referentIds.length === 0) {
        return { data: events, error: null };
      }
      
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', referentIds);
      
      if (profilesError) return { data: null, error: profilesError };
      
      // Combiner les données
      const eventsWithProfiles = events.map(event => {
        if (event.communities && event.communities.referent_id) {
          const profile = profiles?.find(p => p.id === event.communities.referent_id);
          return {
            ...event,
            communities: {
              ...event.communities,
              user_profiles: profile || null
            }
          };
        }
        return event;
      });
      
      return { data: eventsWithProfiles, error: null };
      
    } catch (error) {
      return { data: null, error };
    }
  }
} 