import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Loader2 } from 'lucide-react'
import { format, addWeeks, subWeeks } from 'date-fns'
import { useMealPlan, getWeekStart, getWeekDays } from '../hooks/useMealPlan'
import { useProfile } from '../hooks/useProfile'
import AddMealModal from '../components/AddMealModal'
import BudgetBar from '../components/BudgetBar'
import type { MealType, Recipe, MealPlan } from '../types'

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner']

const mealColors: Record<MealType, string> = {
  breakfast: 'bg-amber-50 border-amber-200 text-amber-800',
  lunch: 'bg-blue-50 border-blue-200 text-blue-800',
  dinner: 'bg-violet-50 border-violet-200 text-violet-800',
  snack: 'bg-green-50 border-green-200 text-green-800',
}

const mealDotColors: Record<MealType, string> = {
  breakfast: 'bg-amber-400',
  lunch: 'bg-blue-400',
  dinner: 'bg-violet-500',
  snack: 'bg-green-400',
}

interface AddModalState {
  date: Date
  mealType: MealType
}

export default function MealPlanner() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()))
  const [addModal, setAddModal] = useState<AddModalState | null>(null)
  const { meals, loading, addMeal, removeMeal, getMealsForSlot, totalWeeklyCost } = useMealPlan(currentWeekStart)
  const { profile } = useProfile()
  const weekDays = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart])
  const budget = profile?.weekly_budget ?? 150

  const today = useMemo(() => new Date(), [])
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  function isToday(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` === todayKey
  }

  async function handleAddMeal(recipe: Recipe, servings: number) {
    if (!addModal) return
    await addMeal(recipe, addModal.date, addModal.mealType, servings)
  }

  return (
    <div className="px-4 py-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meal Planner</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {format(currentWeekStart, 'MMM d')} – {format(weekDays[6], 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentWeekStart(w => subWeeks(w, 1))}
            className="btn-secondary p-2"
            title="Previous week"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentWeekStart(getWeekStart(new Date()))}
            className="btn-secondary text-sm px-3 py-2"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentWeekStart(w => addWeeks(w, 1))}
            className="btn-secondary p-2"
            title="Next week"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Budget bar */}
      <div className="card p-4 mb-5">
        <BudgetBar spent={totalWeeklyCost} budget={budget} label="Week's estimated cost" />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} className="animate-spin text-green-600" />
        </div>
      )}

      {/* Desktop grid */}
      {!loading && (
        <div className="hidden md:block">
          <div className="card overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-100">
              <div className="p-3" /> {/* meal type label column */}
              {weekDays.map(day => (
                <div
                  key={day.toISOString()}
                  className={`p-3 text-center border-l border-gray-100 ${isToday(day) ? 'bg-green-50' : ''}`}
                >
                  <p className={`text-xs font-medium ${isToday(day) ? 'text-green-600' : 'text-gray-500'}`}>
                    {format(day, 'EEE')}
                  </p>
                  <p className={`text-lg font-bold mt-0.5 ${isToday(day) ? 'text-green-600' : 'text-gray-800'}`}>
                    {format(day, 'd')}
                  </p>
                </div>
              ))}
            </div>

            {/* Meal rows */}
            {MEAL_TYPES.map(mealType => (
              <div key={mealType} className="grid grid-cols-8 border-b border-gray-100 last:border-0">
                {/* Meal type label */}
                <div className={`p-3 flex items-center border-r border-gray-100 ${
                  mealType === 'breakfast' ? 'bg-amber-50/50' :
                  mealType === 'lunch' ? 'bg-blue-50/50' :
                  'bg-violet-50/50'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${mealDotColors[mealType]}`} />
                    <span className="text-xs font-semibold text-gray-600 capitalize">{mealType}</span>
                  </div>
                </div>

                {/* Slots */}
                {weekDays.map(day => {
                  const slotMeals = getMealsForSlot(day, mealType)
                  return (
                    <div
                      key={day.toISOString()}
                      className={`p-2 border-l border-gray-100 min-h-[80px] flex flex-col gap-1.5 ${isToday(day) ? 'bg-green-50/30' : ''}`}
                    >
                      {slotMeals.map(meal => (
                        <MealChip key={meal.id} meal={meal} onRemove={() => removeMeal(meal.id)} />
                      ))}
                      <button
                        onClick={() => setAddModal({ date: day, mealType })}
                        className="flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg py-1 border border-dashed border-gray-200 hover:border-green-300 transition-colors mt-auto"
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile: stacked daily cards */}
      {!loading && (
        <div className="md:hidden space-y-4">
          {weekDays.map(day => (
            <div key={day.toISOString()} className={`card overflow-hidden ${isToday(day) ? 'ring-2 ring-green-500' : ''}`}>
              <div className={`px-4 py-3 border-b border-gray-100 ${isToday(day) ? 'bg-green-50' : 'bg-gray-50'}`}>
                <p className={`text-sm font-semibold ${isToday(day) ? 'text-green-700' : 'text-gray-700'}`}>
                  {isToday(day) ? 'Today · ' : ''}{format(day, 'EEEE, MMM d')}
                </p>
              </div>
              <div className="divide-y divide-gray-50">
                {MEAL_TYPES.map(mealType => {
                  const slotMeals = getMealsForSlot(day, mealType)
                  return (
                    <div key={mealType} className="px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-semibold capitalize flex items-center gap-1.5 ${
                          mealType === 'breakfast' ? 'text-amber-600' :
                          mealType === 'lunch' ? 'text-blue-600' :
                          'text-violet-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${mealDotColors[mealType]}`} />
                          {mealType}
                        </span>
                        <button
                          onClick={() => setAddModal({ date: day, mealType })}
                          className="flex items-center gap-1 text-xs text-green-600 font-medium hover:underline"
                        >
                          <Plus size={12} /> Add
                        </button>
                      </div>
                      {slotMeals.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">Nothing planned</p>
                      ) : (
                        <div className="space-y-1.5">
                          {slotMeals.map(meal => (
                            <MealChip key={meal.id} meal={meal} onRemove={() => removeMeal(meal.id)} />
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add meal modal */}
      {addModal && (
        <AddMealModal
          date={addModal.date}
          mealType={addModal.mealType}
          onAdd={handleAddMeal}
          onClose={() => setAddModal(null)}
        />
      )}
    </div>
  )
}

function MealChip({ meal, onRemove }: { meal: MealPlan; onRemove: () => void }) {
  const name = meal.recipe?.name ?? meal.custom_meal_name ?? 'Custom meal'
  return (
    <div className={`flex items-start justify-between gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs ${mealColors[meal.meal_type]}`}>
      <span className="font-medium leading-snug line-clamp-2">{name}</span>
      <div className="flex items-center gap-1 shrink-0">
        <span className="font-semibold">${meal.estimated_cost.toFixed(2)}</span>
        <button
          onClick={onRemove}
          className="opacity-50 hover:opacity-100 transition-opacity ml-0.5"
          title="Remove meal"
        >
          <X size={11} />
        </button>
      </div>
    </div>
  )
}
