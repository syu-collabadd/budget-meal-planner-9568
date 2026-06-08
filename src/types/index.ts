export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type RecipeCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface Ingredient {
  name: string
  quantity: string
  estimated_cost: number
  category: string
}

export interface Recipe {
  id: string
  name: string
  description: string
  category: RecipeCategory
  prep_time_minutes: number
  cook_time_minutes: number
  servings: number
  cost_per_serving: number
  total_cost: number
  ingredients: Ingredient[]
  instructions: string
  tags: string[]
  image_url?: string
}

export interface MealPlan {
  id: string
  user_id: string
  recipe_id: string | null
  custom_meal_name: string | null
  planned_date: string
  meal_type: MealType
  servings: number
  estimated_cost: number
  recipe?: Recipe
}

export interface ShoppingListItem {
  id: string
  user_id: string
  name: string
  category: string
  quantity: string
  estimated_cost: number
  is_checked: boolean
  week_start_date: string
}

export interface UserProfile {
  id: string
  display_name: string | null
  weekly_budget: number
}
