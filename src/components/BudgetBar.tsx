interface BudgetBarProps {
  spent: number
  budget: number
  label?: string
  showNumbers?: boolean
}

export default function BudgetBar({ spent, budget, label, showNumbers = true }: BudgetBarProps) {
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const over = spent > budget

  const barColor =
    pct < 70 ? 'bg-green-500' :
    pct < 90 ? 'bg-amber-500' :
    'bg-red-500'

  const textColor =
    pct < 70 ? 'text-green-700' :
    pct < 90 ? 'text-amber-700' :
    'text-red-600'

  return (
    <div className="w-full">
      {(label || showNumbers) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showNumbers && (
            <span className={`text-sm font-semibold ${textColor}`}>
              ${spent.toFixed(2)} <span className="font-normal text-gray-400">/ ${budget.toFixed(2)}</span>
            </span>
          )}
        </div>
      )}
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {over && (
        <p className="text-xs text-red-500 mt-1">
          ${(spent - budget).toFixed(2)} over budget
        </p>
      )}
      {!over && budget > 0 && (
        <p className="text-xs text-gray-400 mt-1">
          ${(budget - spent).toFixed(2)} remaining
        </p>
      )}
    </div>
  )
}
