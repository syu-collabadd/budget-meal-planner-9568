import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { UserProfile } from '../types'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)

  const loadProfile = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (data) setProfile(data as UserProfile)
    else {
      // Auto-create profile if missing
      const newProfile = {
        id: user.id,
        display_name: user.user_metadata?.display_name ?? null,
        weekly_budget: 150,
      }
      await supabase.from('profiles').insert(newProfile)
      setProfile(newProfile)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  async function updateBudget(weekly_budget: number) {
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .upsert({ id: user.id, weekly_budget, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (data) setProfile(data as UserProfile)
    else if (profile) setProfile({ ...profile, weekly_budget })
  }

  async function updateDisplayName(display_name: string) {
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .upsert({ id: user.id, display_name, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (data) setProfile(data as UserProfile)
    else if (profile) setProfile({ ...profile, display_name })
  }

  return { profile, loading, updateBudget, updateDisplayName, reload: loadProfile }
}
