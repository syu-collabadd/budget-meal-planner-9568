import { useState, useEffect, useMemo } from 'react'
import { Save, Loader2, DollarSign, TrendingUp, Info } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../contexts/AuthContext'
import { getWeekStart } from '../hooks/useMealPlan'
import { useMealPlan } from '../hooks/useMealPlan'
import BudgetBar from '../components/BudgetBar'
import { format, subWeeks } from 'date-fns'

const PRESET_BUDGETS = [75, 100, 125, 150, 200, 250]

function PastWeekRow({ weekStart }: { weekStart: Date }) {
  const { totalWeeklyCost, meals } = useMealPlan(weekStart)
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
      <span className="text-gray-600">{format(weekStart, 'MMM d')} – {format(new Date(weekStart.getTime() + 6 * 86400000), 'MMM d')}</span>
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-xs">{meals.length} meals</span>
        <span className="font-semibold text-amber-600">${totalWeeklyCost.toFixed(2)}</span>
      </div>
    </div>
  )
}

export default function BudgetSettings() {
  const { profile, loading, updateBudget, updateDisplayName } = useProfile()
  const { user } = useAuth()
  const [budgetInput, setBudgetInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)

  const today = useMemo(() => new Date(), [])
  const currentWeekStart = useMemo(() => getWeekStart(today), [today])
  const { totalWeeklyCost: thisWeekSpend } = useMealPlan(currentWeekStart)

  const pastWeeks = useMemo(() => [1, 2, 3, 4].map(w => subWeeks(currentWeekStart, w)), [currentWeekStart])

  useEffect(() => {
    if (profile) {
      setBudgetInput(profile.weekly_budget.toString())
      setNameInput(profile.display_name ?? '')
    }
  }, [profile])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const budget = parseFloat(budgetInput)
    if (isNaN(budget) || budget <= 0) return
    setSaving(true)
    await Promise.all([
      updateBudget(budget),
      nameInput !== profile?.display_name ? updateDisplayName(nameInput) : Promise.resolve(),
    ])
    setSaving(false)
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2500)
  }

  const budget = profile?.weekly_budget ?? 150
  const monthlyEstimate = budget * 4.33

  return (
    <div className="px-4 py-6 lg:px-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Budget Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Set your grocery budget and track spending</p>
      </div>

      {/* Current week */}
      <div className="card p-5 mb-4">
        <h2 className="font-semibold text-gray-900 mb-4">This week</h2>
        <BudgetBar
          spent={thisWeekSpend}
          budget={budget}
          label="Planned spending vs budget"
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-0.5">Weekly budget</p>
            <p className="text-xl font-bold text-gray-900">${budget.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-0.5">Monthly estimate</p>
            <p className="text-xl font-bold text-gray-600">${monthlyEstimate.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Budget form */}
      <div className="card p-5 mb-4">
        <h2 className="font-semibold text-gray-900 mb-4">Edit budget</h2>
        <form onSubmit={handleSave} className="space-y-4">
          {/* Display name */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Your name</label>
            <input
              className="input"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="What should we call you?"
            />
          </div>

          {/* Weekly budget */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Weekly grocery budget</label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input pl-9"
                type="number"
                step="0.01"
                min="1"
                max="9999"
                value={budgetInput}
                onChange={e => setBudgetInput(e.target.value)}
                placeholder="150.00"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
              <Info size={11} />
              Monthly estimate: ~${(parseFloat(budgetInput || '0') * 4.33).toFixed(2)}
            </p>
          </div>

          {/* Quick presets */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Quick presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESET_BUDGETS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setBudgetInput(p.toString())}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                    parseFloat(budgetInput) === p
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {savedMsg ? '✓ Saved!' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* Spending history */}
      <div className="card p-5 mb-4">
        <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <TrendingUp size={18} className="text-green-600" />
          Spending history
        </h2>
        <p className="text-xs text-gray-400 mb-4">Based on your meal plan estimates</p>
        <div>
          {pastWeeks.map(week => (
            <PastWeekRow key={week.toISOString()} weekStart={week} />
          ))}
        </div>
      </div>

      {/* Account info */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-3">Account</h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
            {user?.email?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{profile?.display_name || 'No name set'}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
