import { useState, useEffect, useMemo } from 'react'
import { X, Search, ChevronDown } from 'lucide-react'
import type { Recipe, MealType } from '../types'
import { SEED_RECIPES } from '../lib/seedData'
import { supabase } from '../lib/supabase'
import RecipeCard from './RecipeCard'
import { format } from 'date-fns'

interface Props {
  date: Date
  mealType: MealType
  onAdd: (recipe: Recipe, servings: number) => void
  onClose: () => void
}

const mealTypeCategories: Record<MealType, string[]> = {
  breakfast: ['breakfast'],
  lunch: ['lunch', 'snack'],
  dinner: ['dinner'],
  snack: ['snack', 'breakfast', 'lunch'],
}

export default function AddMealModal({ date, mealType, onAdd, onClose }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>(SEED_RECIPES)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [servings, setServings] = useState(1)

  useEffect(() => {
    supabase
      .from('recipes')
      .select('*')
      .then(({ data }) => {
        if (data && data.length > 0) setRecipes(data as Recipe[])
      })
  }, [])

  const filtered = useMemo(() => {
    const suggested = mealTypeCategories[mealType]
    return recipes.filter(r => {
      const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'all' ? true :
        category === 'suggested' ? suggested.includes(r.category) :
        r.category === category
      return matchSearch && matchCat
    })
  }, [recipes, search, category, mealType])

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'suggested', label: 'Suggested' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">Add {mealType}</h2>
            <p className="text-sm text-gray-500">{format(date, 'EEEE, MMM d')}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search + filters */}
        <div className="px-5 py-3 border-b border-gray-100 shrink-0 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9"
              placeholder="Search recipes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(c => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === c.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Servings */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Servings:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setServings(s => Math.max(1, s - 1))}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-semibold">{servings}</span>
              <button
                onClick={() => setServings(s => s + 1)}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Recipe list */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No recipes found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map(recipe => (
                <div
                  key={recipe.id}
                  className="cursor-pointer"
                  onClick={() => {
                    onAdd(recipe, servings)
                    onClose()
                  }}
                >
                  <RecipeCard recipe={recipe} compact />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
