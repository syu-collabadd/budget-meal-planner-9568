import { useState, useMemo } from 'react'
import { ShoppingCart, RefreshCw, Plus, Trash2, Check, Loader2, ChevronDown, ChevronRight, X } from 'lucide-react'
import { format } from 'date-fns'
import { useShoppingList } from '../hooks/useShoppingList'
import { useMealPlan, getWeekStart } from '../hooks/useMealPlan'
import { SHOPPING_CATEGORIES } from '../lib/seedData'

const categoryIcons: Record<string, string> = {
  'Produce': '🥦',
  'Dairy & Eggs': '🥛',
  'Proteins': '🥩',
  'Pantry': '🫙',
  'Bread & Bakery': '🍞',
  'Frozen': '🧊',
  'Other': '📦',
}

export default function ShoppingList() {
  const today = useMemo(() => new Date(), [])
  const weekStart = useMemo(() => getWeekStart(today), [today])
  const { meals } = useMealPlan(weekStart)
  const {
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
  } = useShoppingList(weekStart)

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState('Produce')
  const [newQty, setNewQty] = useState('')
  const [newCost, setNewCost] = useState('')
  const [adding, setAdding] = useState(false)

  function toggleCollapse(cat: string) {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  async function handleGenerate() {
    if (items.length > 0) {
      if (!confirm('This will replace your current shopping list with items from this week\'s meal plan. Continue?')) return
    }
    await generateFromMealPlan(meals)
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    await addItem(newName.trim(), newCategory, newQty || '—', Number(newCost) || 0)
    setNewName('')
    setNewQty('')
    setNewCost('')
    setAdding(false)
  }

  const remaining = totalCost - checkedCost
  const categories = Object.keys(itemsByCategory)

  return (
    <div className="px-4 py-6 lg:px-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping List</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Week of {format(weekStart, 'MMM d')} · {items.length} item{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating || meals.length === 0}
          className="btn-primary flex items-center gap-2"
          title={meals.length === 0 ? 'Plan some meals first' : 'Generate from this week\'s meal plan'}
        >
          {generating ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
          <span className="hidden sm:inline">Generate from plan</span>
          <span className="sm:hidden">Generate</span>
        </button>
      </div>

      {/* Cost summary */}
      {items.length > 0 && (
        <div className="card p-4 mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Estimated total</p>
            <p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{checkedCount}/{items.length} checked</p>
            <p className="text-lg font-semibold text-amber-600">${remaining.toFixed(2)} left</p>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {items.length > 0 && (
        <div className="mb-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-300"
            style={{ width: `${(checkedCount / items.length) * 100}%` }}
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-green-600" />
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="text-center py-16 card p-8 mb-4">
          <ShoppingCart size={44} className="text-gray-200 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 mb-1">Your list is empty</h3>
          <p className="text-sm text-gray-400 mb-4">
            {meals.length > 0
              ? 'Click "Generate from plan" to auto-build your list from this week\'s meals.'
              : 'Plan some meals first, then generate your shopping list automatically.'}
          </p>
          {meals.length === 0 && (
            <a href="/planner" className="text-sm text-green-600 font-medium hover:underline">
              Go to Meal Planner →
            </a>
          )}
        </div>
      )}

      {/* Categorized items */}
      {!loading && categories.length > 0 && (
        <div className="space-y-3 mb-4">
          {categories.map(cat => {
            const catItems = itemsByCategory[cat]
            const isCollapsed = collapsed[cat]
            const allChecked = catItems.every(i => i.is_checked)
            const checkedInCat = catItems.filter(i => i.is_checked).length

            return (
              <div key={cat} className="card overflow-hidden">
                {/* Category header */}
                <button
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleCollapse(cat)}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{categoryIcons[cat] ?? '📦'}</span>
                    <span className="font-semibold text-gray-800 text-sm">{cat}</span>
                    <span className="text-xs text-gray-400">{checkedInCat}/{catItems.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-amber-600">
                      ${catItems.reduce((sum, i) => sum + i.estimated_cost, 0).toFixed(2)}
                    </span>
                    {isCollapsed ? <ChevronRight size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>

                {/* Items */}
                {!isCollapsed && (
                  <div className="divide-y divide-gray-50">
                    {catItems.map(item => (
                      <div
                        key={item.id}
                        className={`flex items-center gap-3 px-4 py-3 group transition-colors ${item.is_checked ? 'bg-gray-50' : ''}`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleItem(item.id)}
                          className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            item.is_checked
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {item.is_checked && <Check size={11} className="text-white" strokeWidth={3} />}
                        </button>

                        {/* Name + qty */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${item.is_checked ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                            {item.name}
                          </p>
                          {item.quantity && item.quantity !== '—' && (
                            <p className="text-xs text-gray-400">{item.quantity}</p>
                          )}
                        </div>

                        {/* Cost */}
                        {item.estimated_cost > 0 && (
                          <span className={`text-sm font-semibold shrink-0 ${item.is_checked ? 'text-gray-400' : 'text-amber-600'}`}>
                            ~${item.estimated_cost.toFixed(2)}
                          </span>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Actions row */}
      {items.length > 0 && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowAdd(s => !s)}
            className="btn-secondary flex items-center gap-2 flex-1"
          >
            <Plus size={15} /> Add item
          </button>
          {checkedCount > 0 && (
            <button
              onClick={clearChecked}
              className="btn-secondary flex items-center gap-2 text-red-500 border-red-200 hover:bg-red-50"
            >
              <Trash2 size={15} /> Clear checked ({checkedCount})
            </button>
          )}
        </div>
      )}

      {/* Add item form */}
      {(showAdd || items.length === 0) && (
        <form onSubmit={handleAddItem} className="card p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-800">Add item manually</p>
          <input
            className="input"
            placeholder="Item name (e.g. Whole milk)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Quantity</label>
              <input
                className="input"
                placeholder="e.g. 1 gallon"
                value={newQty}
                onChange={e => setNewQty(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Est. cost ($)</label>
              <input
                className="input"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={newCost}
                onChange={e => setNewCost(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Category</label>
            <select className="input" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
              {SHOPPING_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={adding} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add to list
            </button>
            {items.length > 0 && (
              <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
