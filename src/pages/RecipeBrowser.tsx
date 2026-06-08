import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react'
import { SEED_RECIPES } from '../lib/seedData'
import { supabase } from '../lib/supabase'
import RecipeCard from '../components/RecipeCard'
import AddMealModal from '../components/AddMealModal'
import type { Recipe, MealType } from '../types'

type SortOption = 'cost-asc' | 'cost-desc' | 'time-asc' | 'name'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
]

const TAGS = ['vegan', 'vegetarian', 'quick', 'meal-prep', 'high-protein', 'gluten-free', 'freezer-friendly']

interface AddState {
  recipe: Recipe
}

export default function RecipeBrowser() {
  const [recipes, setRecipes] = useState<Recipe[]>(SEED_RECIPES)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState<SortOption>('cost-asc')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [maxCost, setMaxCost] = useState(10)
  const [addState, setAddState] = useState<AddState | null>(null)
  const [addMealType, setAddMealType] = useState<MealType>('dinner')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    supabase
      .from('recipes')
      .select('*')
      .then(({ data }) => {
        if (data && data.length > 0) setRecipes(data as Recipe[])
      })
  }, [])

  const filtered = useMemo(() => {
    let result = recipes.filter(r => {
      const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'all' || r.category === category
      const matchCost = r.cost_per_serving <= maxCost
      const matchTags = activeTags.length === 0 || activeTags.every(t => r.tags.includes(t))
      return matchSearch && matchCat && matchCost && matchTags
    })

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'cost-asc': return a.cost_per_serving - b.cost_per_serving
        case 'cost-desc': return b.cost_per_serving - a.cost_per_serving
        case 'time-asc': return (a.prep_time_minutes + a.cook_time_minutes) - (b.prep_time_minutes + b.cook_time_minutes)
        case 'name': return a.name.localeCompare(b.name)
        default: return 0
      }
    })

    return result
  }, [recipes, search, category, sort, maxCost, activeTags])

  function toggleTag(tag: string) {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  function handleAddToMealPlan(recipe: Recipe) {
    setAddState({ recipe })
    setShowAddModal(true)
  }

  const today = useMemo(() => new Date(), [])

  return (
    <div className="px-4 py-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} budget-friendly recipe{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(s => !s)}
          className={`btn-secondary flex items-center gap-2 ${showFilters ? 'border-green-500 text-green-700 bg-green-50' : ''}`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeTags.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
              {activeTags.length}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input pl-10"
          placeholder="Search recipes by name or description…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === c.value
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="card p-4 mb-4 space-y-4">
          {/* Sort */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Sort by</label>
            <div className="flex gap-2 flex-wrap">
              {([
                ['cost-asc', 'Cheapest first'],
                ['cost-desc', 'Priciest first'],
                ['time-asc', 'Quickest first'],
                ['name', 'A → Z'],
              ] as [SortOption, string][]).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setSort(value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    sort === value ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Max cost */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
              Max cost per serving: ${maxCost.toFixed(2)}
            </label>
            <input
              type="range"
              min={1}
              max={10}
              step={0.5}
              value={maxCost}
              onChange={e => setMaxCost(Number(e.target.value))}
              className="w-full accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$1.00</span>
              <span>$10.00</span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Dietary & style</label>
            <div className="flex gap-2 flex-wrap">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                    activeTags.includes(tag)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recipe grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No recipes match your filters</p>
          <button
            onClick={() => { setSearch(''); setCategory('all'); setActiveTags([]); setMaxCost(10) }}
            className="text-sm text-green-600 hover:underline mt-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onAdd={handleAddToMealPlan} />
          ))}
        </div>
      )}

      {/* Add to plan modal — we re-use AddMealModal but let user pick date/type */}
      {showAddModal && addState && (
        <AddMealModal
          date={today}
          mealType={addState.recipe.category === 'snack' ? 'snack' : addState.recipe.category as MealType}
          onAdd={async (recipe, servings) => {
            // Modal already called onAdd which triggers close — no-op here
          }}
          onClose={() => { setShowAddModal(false); setAddState(null) }}
        />
      )}
    </div>
  )
}
