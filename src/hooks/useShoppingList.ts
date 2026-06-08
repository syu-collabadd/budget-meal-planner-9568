import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { ShoppingListItem, MealPlan } from '../types'
import { SHOPPING_CATEGORIES } from '../lib/seedData'

function localDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function useShoppingList(weekStart: Date) {
  const { user } = useAuth()
  const [items, setItems] = useState<ShoppingListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  const weekStartStr = localDateKey(weekStart)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('shopping_list_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start_date', weekStartStr)
      .order('category')
      .order('name')
    setItems((data as ShoppingListItem[]) ?? [])
    setLoading(false)
  }, [user, weekStartStr])

  useEffect(() => {
    load()
  }, [load])

  async function toggleItem(id: string) {
    const item = items.find(i => i.id === id)
    if (!item) return
    const checked = !item.is_checked
    await supabase.from('shopping_list_items').update({ is_checked: checked }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_checked: checked } : i))
  }

  async function addItem(name: string, category: string, quantity: string, estimated_cost: number) {
    if (!user) return
    const newItem = {
      user_id: user.id,
      name,
      category,
      quantity,
      estimated_cost,
      is_checked: false,
      week_start_date: weekStartStr,
    }
    const { data } = await supabase
      .from('shopping_list_items')
      .insert(newItem)
      .select()
      .single()
    if (data) setItems(prev => [...prev, data as ShoppingListItem])
  }

  async function removeItem(id: string) {
    await supabase.from('shopping_list_items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  async function clearChecked() {
    const ids = items.filter(i => i.is_checked).map(i => i.id)
    if (ids.length === 0) return
    await supabase.from('shopping_list_items').delete().in('id', ids)
    setItems(prev => prev.filter(i => !i.is_checked))
  }

  async function generateFromMealPlan(meals: MealPlan[]) {
    if (!user) return
    setGenerating(true)

    // Aggregate ingredients across all planned meals
    const ingredientMap = new Map<string, { name: string; category: string; quantity: string; estimated_cost: number }>()

    for (const meal of meals) {
      if (!meal.recipe?.ingredients) continue
      for (const ing of meal.recipe.ingredients) {
        const key = ing.name.toLowerCase()
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!
          ingredientMap.set(key, {
            ...existing,
            estimated_cost: existing.estimated_cost + ing.estimated_cost * meal.servings,
          })
        } else {
          ingredientMap.set(key, {
            name: ing.name,
            category: SHOPPING_CATEGORIES.includes(ing.category) ? ing.category : 'Other',
            quantity: ing.quantity,
            estimated_cost: ing.estimated_cost * meal.servings,
          })
        }
      }
    }

    // Clear existing list for this week
    await supabase
      .from('shopping_list_items')
      .delete()
      .eq('user_id', user.id)
      .eq('week_start_date', weekStartStr)

    const newItems = Array.from(ingredientMap.values()).map(ing => ({
      user_id: user.id,
      name: ing.name,
      category: ing.category,
      quantity: ing.quantity,
      estimated_cost: Math.round(ing.estimated_cost * 100) / 100,
      is_checked: false,
      week_start_date: weekStartStr,
    }))

    if (newItems.length > 0) {
      const { data } = await supabase
        .from('shopping_list_items')
        .insert(newItems)
        .select()
      if (data) setItems(data as ShoppingListItem[])
    } else {
      setItems([])
    }

    setGenerating(false)
  }

  const itemsByCategory = SHOPPING_CATEGORIES.reduce((acc, cat) => {
    const catItems = items.filter(i => i.category === cat)
    if (catItems.length > 0) acc[cat] = catItems
    return acc
  }, {} as Record<string, ShoppingListItem[]>)

  const uncategorized = items.filter(i => !SHOPPING_CATEGORIES.includes(i.category))
  if (uncategorized.length > 0) itemsByCategory['Other'] = uncategorized

  const totalCost = items.reduce((sum, i) => sum + (i.estimated_cost ?? 0), 0)
  const checkedCost = items.filter(i => i.is_checked).reduce((sum, i) => sum + (i.estimated_cost ?? 0), 0)
  const checkedCount = items.filter(i => i.is_checked).length

  return {
    items,
    itemsByCategory,
    loading,
    generating,
    totalCost,
    checkedCost,
    checkedCount,
    toggleItem,
    addItem,
    removeItem,
    clearChecked,
    generateFromMealPlan,
    reload: load,
  }
}
