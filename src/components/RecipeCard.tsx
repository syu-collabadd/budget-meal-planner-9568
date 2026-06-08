import { Clock, Users, DollarSign, Plus } from 'lucide-react'
import type { Recipe } from '../types'

const categoryColors: Record<string, string> = {
  breakfast: 'bg-amber-100 text-amber-700',
  lunch: 'bg-blue-100 text-blue-700',
  dinner: 'bg-violet-100 text-violet-700',
  snack: 'bg-green-100 text-green-700',
}

interface RecipeCardProps {
  recipe: Recipe
  onAdd?: (recipe: Recipe) => void
  compact?: boolean
}

export default function RecipeCard({ recipe, onAdd, compact = false }: RecipeCardProps) {
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes

  return (
    <div className="card flex flex-col h-full group hover:shadow-md transition-shadow">
      {/* Color header */}
      <div
        className={`h-2 rounded-t-2xl ${
          recipe.category === 'breakfast' ? 'bg-amber-400' :
          recipe.category === 'lunch' ? 'bg-blue-400' :
          recipe.category === 'dinner' ? 'bg-violet-400' :
          'bg-green-400'
        }`}
      />

      <div className={`flex flex-col flex-1 ${compact ? 'p-3' : 'p-4'}`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`font-semibold text-gray-900 leading-snug ${compact ? 'text-sm' : 'text-base'}`}>
            {recipe.name}
          </h3>
          <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[recipe.category]}`}>
            {recipe.category}
          </span>
        </div>

        {/* Description */}
        {!compact && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{recipe.description}</p>
        )}

        {/* Tags */}
        {!compact && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {recipe.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Stats */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {totalTime}m
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {recipe.servings}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 text-amber-600 font-semibold text-sm">
              <DollarSign size={13} />
              {recipe.cost_per_serving.toFixed(2)}
              <span className="text-xs font-normal text-gray-400">/srv</span>
            </span>
          </div>
        </div>

        {/* Add button */}
        {onAdd && (
          <button
            onClick={() => onAdd(recipe)}
            className="mt-3 w-full flex items-center justify-center gap-1.5 btn-primary py-2"
          >
            <Plus size={14} />
            Add to Plan
          </button>
        )}
      </div>
    </div>
  )
}
