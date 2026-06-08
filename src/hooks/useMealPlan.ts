import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { MealPlan, MealType, Recipe } from '../types'

function localDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const dow = d.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })
}

export function useMealPlan(weekStart: Date) {
  const { user } = useAuth()
  const [meals, setMeals] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(false)

  const weekStartStr = localDateKey(weekStart)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const weekEndStr = localDateKey(weekEnd)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('meal_plans')
      .select('*, recipe:recipes(*)')
      .eq('user_id', user.id)
      .gte('planned_date', weekStartStr)
      .lte('planned_date', weekEndStr)
      .order('planned_date')
    setMeals((data as MealPlan[]) ?? [])
    setLoading(false)
  }, [user, weekStartStr, weekEndStr])

  useEffect(() => {
    load()
  }, [load])

  async function addMeal(recipe: Recipe, date: Date, meal_type: MealType, servings = 1) {
    if (!user) return
    const entry = {
      user_id: user.id,
      recipe_id: recipe.id,
      planned_date: localDateKey(date),
      meal_type,
      servings,
      estimated_cost: recipe.cost_per_serving * servings,
    }
    const { data } = await supabase
      .from('meal_plans')
      .insert({ ...entry, recipe: undefined })
      .select('*, recipe:recipes(*)')
      .single()
    if (data) setMeals(prev => [...prev, data as MealPlan])
  }

  async function removeMeal(id: string) {
    await supabase.from('meal_plans').delete().eq('id', id)
    setMeals(prev => prev.filter(m => m.id !== id))
  }

  function getMealsForSlot(date: Date, meal_type: MealType): MealPlan[] {
    const dateStr = localDateKey(date)
    return meals.filter(m => m.planned_date === dateStr && m.meal_type === meal_type)
  }

  const totalWeeklyCost = meals.reduce((sum, m) => sum + (m.estimated_cost ?? 0), 0)

  return { meals, loading, addMeal, removeMeal, getMealsForSlot, totalWeeklyCost, reload: load }
}
