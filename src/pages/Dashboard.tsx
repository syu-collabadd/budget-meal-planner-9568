import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ShoppingCart, TrendingUp, ArrowRight, Utensils } from 'lucide-react'
import { format, startOfWeek, addDays } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { useMealPlan, getWeekStart, getWeekDays } from '../hooks/useMealPlan'
import BudgetBar from '../components/BudgetBar'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'] as const

export default function Dashboard() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const today = useMemo(() => new Date(), [])
  const weekStart = useMemo(() => getWeekStart(today), [today])
  const { meals, totalWeeklyCost } = useMealPlan(weekStart)
  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart])

  const budget = profile?.weekly_budget ?? 150
  const displayName = profile?.display_name ?? user?.email?.split('@')[0] ?? 'there'

  const mealsPlanned = meals.length
  const totalSlots = 7 * 3
  const mealsByDay = useMemo(() => {
    const map = new Map<string, typeof meals>()
    meals.forEach(m => {
      const key = m.planned_date
      map.set(key, [...(map.get(key) ?? []), m])
    })
    return map
  }, [meals])

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const todaysMeals = mealsByDay.get(todayKey) ?? []

  const categorySpend = useMemo(() => {
    const map: Record<string, number> = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 }
    meals.forEach(m => { map[m.meal_type] = (map[m.meal_type] ?? 0) + m.estimated_cost })
    return map
  }, [meals])

  return (
    <div className="px-4 py-6 lg:px-8 max-w-4xl mx-auto">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Good {getTimeOfDay()}, {displayName} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {format(today, 'EEEE, MMMM d')} · Week of {format(weekStart, 'MMM d')}
        </p>
      </div>

      {/* Budget card */}
      <div className="card p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Weekly budget</p>
            <p className="text-3xl font-bold text-gray-900 mt-0.5">
              ${totalWeeklyCost.toFixed(2)}
              <span className="text-base font-normal text-gray-400"> / ${budget.toFixed(2)}</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
            <TrendingUp size={22} className="text-green-600" />
          </div>
        </div>
        <BudgetBar spent={totalWeeklyCost} budget={budget} showNumbers={false} />

        {/* Breakdown */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {(['breakfast', 'lunch', 'dinner'] as const).map(type => (
            <div key={type} className="text-center">
              <p className="text-xs text-gray-500 capitalize">{type}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">${categorySpend[type].toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{mealsPlanned}</p>
          <p className="text-xs text-gray-500 mt-0.5">Meals planned</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{totalSlots - mealsPlanned}</p>
          <p className="text-xs text-gray-500 mt-0.5">Slots open</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-amber-500">
            ${mealsPlanned > 0 ? (totalWeeklyCost / mealsPlanned).toFixed(2) : '0.00'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Avg/meal</p>
        </div>
      </div>

      {/* Today's meals */}
      <div className="card p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Today's meals</h2>
          <Link to="/planner" className="text-xs text-green-600 font-medium hover:underline flex items-center gap-1">
            Edit <ArrowRight size={12} />
          </Link>
        </div>
        {todaysMeals.length === 0 ? (
          <div className="text-center py-6">
            <Utensils size={28} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No meals planned for today</p>
            <Link to="/planner" className="text-sm text-green-600 font-medium hover:underline mt-1 inline-block">
              Plan today's meals →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {todaysMeals.map(meal => (
              <div key={meal.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    meal.meal_type === 'breakfast' ? 'bg-amber-400' :
                    meal.meal_type === 'lunch' ? 'bg-blue-400' :
                    'bg-violet-400'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{meal.recipe?.name ?? meal.custom_meal_name}</p>
                    <p className="text-xs text-gray-400 capitalize">{meal.meal_type} · {meal.servings} serving{meal.servings !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-amber-600">${meal.estimated_cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* This week overview */}
      <div className="card p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">This week</h2>
          <Link to="/planner" className="text-xs text-green-600 font-medium hover:underline flex items-center gap-1">
            Full planner <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => {
            const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
            const dayMeals = mealsByDay.get(key) ?? []
            const isToday = key === todayKey
            return (
              <div key={key} className="text-center">
                <p className={`text-xs font-medium mb-1 ${isToday ? 'text-green-600' : 'text-gray-400'}`}>
                  {format(day, 'EEE')[0]}
                </p>
                <div className={`relative aspect-square rounded-lg flex items-center justify-center text-xs font-semibold ${
                  isToday ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {format(day, 'd')}
                  {dayMeals.length > 0 && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                      {dayMeals.length}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/planner" className="card p-4 hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <CalendarDays size={18} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Plan meals</p>
            <p className="text-xs text-gray-400">Weekly planner</p>
          </div>
        </Link>
        <Link to="/shopping" className="card p-4 hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <ShoppingCart size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Shopping list</p>
            <p className="text-xs text-gray-400">Auto-generated</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
