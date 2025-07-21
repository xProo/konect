-- Ajouter le champ is_admin à la table user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Créer un index pour optimiser les requêtes admin
CREATE INDEX IF NOT EXISTS idx_user_profiles_admin ON user_profiles(is_admin) WHERE is_admin = true;

-- Politique RLS pour permettre aux admins de voir tous les profils
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM user_profiles WHERE is_admin = true
        )
    );

-- Politique RLS pour permettre aux admins de modifier les profils
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
CREATE POLICY "Admins can update all profiles" ON user_profiles
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM user_profiles WHERE is_admin = true
        )
    );

-- Politique RLS pour permettre aux admins de voir toutes les communautés
DROP POLICY IF EXISTS "Admins can view all communities" ON communities;
CREATE POLICY "Admins can view all communities" ON communities
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM user_profiles WHERE is_admin = true
        )
    );

-- Politique RLS pour permettre aux admins de modifier toutes les communautés
DROP POLICY IF EXISTS "Admins can update all communities" ON communities;
CREATE POLICY "Admins can update all communities" ON communities
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM user_profiles WHERE is_admin = true
        )
    );

-- Politique RLS pour permettre aux admins de supprimer des communautés
DROP POLICY IF EXISTS "Admins can delete communities" ON communities;
CREATE POLICY "Admins can delete communities" ON communities
    FOR DELETE USING (
        auth.uid() IN (
            SELECT id FROM user_profiles WHERE is_admin = true
        )
    );

-- Politique RLS pour permettre aux admins de voir tous les événements
DROP POLICY IF EXISTS "Admins can view all events" ON events;
CREATE POLICY "Admins can view all events" ON events
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM user_profiles WHERE is_admin = true
        )
    );

-- Politique RLS pour permettre aux admins de modifier tous les événements
DROP POLICY IF EXISTS "Admins can update all events" ON events;
CREATE POLICY "Admins can update all events" ON events
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM user_profiles WHERE is_admin = true
        )
    );

-- Politique RLS pour permettre aux admins de supprimer des événements
DROP POLICY IF EXISTS "Admins can delete all events" ON events;
CREATE POLICY "Admins can delete all events" ON events
    FOR DELETE USING (
        auth.uid() IN (
            SELECT id FROM user_profiles WHERE is_admin = true
        )
    );

-- Politique RLS pour permettre aux admins de voir tous les membres des communautés
DROP POLICY IF EXISTS "Admins can view all community members" ON community_members;
CREATE POLICY "Admins can view all community members" ON community_members
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM user_profiles WHERE is_admin = true
        )
    );

-- Politique RLS pour permettre aux admins de voir toutes les inscriptions aux événements
DROP POLICY IF EXISTS "Admins can view all event registrations" ON event_registrations;
CREATE POLICY "Admins can view all event registrations" ON event_registrations
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM user_profiles WHERE is_admin = true
        )
    );

-- Fonction pour créer le premier administrateur (à exécuter manuellement avec l'email souhaité)
-- UPDATE user_profiles SET is_admin = true WHERE email = 'admin@example.com';

-- Vues pour les statistiques admin
CREATE OR REPLACE VIEW admin_stats AS
SELECT 
    (SELECT COUNT(*) FROM communities) as total_communities,
    (SELECT COUNT(*) FROM communities WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as communities_last_30_days,
    (SELECT COUNT(*) FROM events) as total_events,
    (SELECT COUNT(*) FROM events WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as events_last_30_days,
    (SELECT COUNT(*) FROM user_profiles) as total_users,
    (SELECT COUNT(*) FROM user_profiles WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as users_last_30_days,
    (SELECT COUNT(*) FROM event_registrations) as total_registrations;

-- Permettre aux admins de voir les statistiques
DROP POLICY IF EXISTS "Admins can view stats" ON admin_stats;
-- Note: Les vues héritent des politiques des tables sous-jacentes 