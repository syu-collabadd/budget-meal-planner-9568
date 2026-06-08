-- StretchBites — Seed Data (20 budget-friendly recipes)
-- Run this AFTER schema.sql in your Supabase SQL Editor

insert into recipes (name, description, category, prep_time_minutes, cook_time_minutes, servings, cost_per_serving, total_cost, ingredients, instructions, tags)
values
(
  'Overnight Oats',
  'Prep-ahead creamy oats with banana and honey — zero morning effort.',
  'breakfast', 5, 0, 2, 0.75, 1.50,
  '[{"name":"Rolled Oats","quantity":"1 cup","estimated_cost":0.40,"category":"Pantry"},{"name":"Milk","quantity":"1 cup","estimated_cost":0.30,"category":"Dairy & Eggs"},{"name":"Chia Seeds","quantity":"1 tbsp","estimated_cost":0.20,"category":"Pantry"},{"name":"Banana","quantity":"1 medium","estimated_cost":0.30,"category":"Produce"},{"name":"Honey","quantity":"1 tsp","estimated_cost":0.10,"category":"Pantry"}]',
  'Combine oats, milk, and chia seeds in a jar. Stir well. Refrigerate overnight. In the morning, top with sliced banana and drizzle with honey.',
  array['vegetarian','meal-prep','no-cook']
),
(
  'Scrambled Eggs & Toast',
  'Classic fluffy scrambled eggs with buttered toast. Quick and satisfying.',
  'breakfast', 3, 7, 2, 1.20, 2.40,
  '[{"name":"Eggs","quantity":"4 large","estimated_cost":1.20,"category":"Dairy & Eggs"},{"name":"Bread","quantity":"4 slices","estimated_cost":0.60,"category":"Bread & Bakery"},{"name":"Butter","quantity":"1 tbsp","estimated_cost":0.15,"category":"Dairy & Eggs"},{"name":"Salt","quantity":"pinch","estimated_cost":0.01,"category":"Pantry"},{"name":"Black Pepper","quantity":"pinch","estimated_cost":0.02,"category":"Pantry"}]',
  'Whisk eggs with a pinch of salt and pepper. Melt butter in a pan over medium-low heat. Add eggs and gently fold with a spatula until just set. Serve on toast.',
  array['vegetarian','quick','protein']
),
(
  'Banana Pancakes',
  'Fluffy golden pancakes with ripe banana folded right in.',
  'breakfast', 10, 15, 4, 0.90, 3.60,
  '[{"name":"All-Purpose Flour","quantity":"1 cup","estimated_cost":0.20,"category":"Pantry"},{"name":"Eggs","quantity":"2 large","estimated_cost":0.60,"category":"Dairy & Eggs"},{"name":"Milk","quantity":"3/4 cup","estimated_cost":0.25,"category":"Dairy & Eggs"},{"name":"Bananas","quantity":"2 ripe","estimated_cost":0.40,"category":"Produce"},{"name":"Baking Powder","quantity":"1 tsp","estimated_cost":0.05,"category":"Pantry"},{"name":"Butter","quantity":"2 tbsp","estimated_cost":0.20,"category":"Dairy & Eggs"},{"name":"Maple Syrup","quantity":"1/4 cup","estimated_cost":1.90,"category":"Pantry"}]',
  'Mash bananas and mix with egg and milk. Fold in flour, baking powder, and a pinch of salt. Cook in a buttered pan over medium heat until bubbles form, then flip.',
  array['vegetarian','family-friendly']
),
(
  'Greek Yogurt Parfait',
  'Layers of creamy yogurt, crunchy granola, and fresh berries.',
  'breakfast', 5, 0, 1, 1.50, 1.50,
  '[{"name":"Greek Yogurt","quantity":"3/4 cup","estimated_cost":0.70,"category":"Dairy & Eggs"},{"name":"Granola","quantity":"1/4 cup","estimated_cost":0.40,"category":"Pantry"},{"name":"Mixed Berries","quantity":"1/2 cup","estimated_cost":1.00,"category":"Produce"},{"name":"Honey","quantity":"1 tsp","estimated_cost":0.10,"category":"Pantry"}]',
  'Layer Greek yogurt, granola, and mixed berries in a bowl or glass. Drizzle with honey.',
  array['vegetarian','no-cook','protein','quick']
),
(
  'Baked Oatmeal',
  'Make-ahead baked oatmeal with cinnamon and banana. Serves the whole week.',
  'breakfast', 10, 35, 6, 1.00, 6.00,
  '[{"name":"Rolled Oats","quantity":"3 cups","estimated_cost":1.20,"category":"Pantry"},{"name":"Milk","quantity":"2.5 cups","estimated_cost":0.75,"category":"Dairy & Eggs"},{"name":"Eggs","quantity":"2 large","estimated_cost":0.60,"category":"Dairy & Eggs"},{"name":"Bananas","quantity":"2 ripe","estimated_cost":0.40,"category":"Produce"},{"name":"Honey","quantity":"3 tbsp","estimated_cost":0.45,"category":"Pantry"},{"name":"Ground Cinnamon","quantity":"1 tsp","estimated_cost":0.10,"category":"Pantry"},{"name":"Butter","quantity":"1 tbsp","estimated_cost":0.10,"category":"Dairy & Eggs"}]',
  'Mix oats, milk, eggs, mashed bananas, honey, and cinnamon. Pour into greased baking dish. Bake at 375°F for 35 minutes until set. Slice and reheat throughout the week.',
  array['vegetarian','meal-prep','kid-friendly']
),
(
  'Red Lentil Soup',
  'Hearty, warming red lentil soup with cumin and lemon. Freezes beautifully.',
  'lunch', 10, 30, 6, 1.20, 7.20,
  '[{"name":"Red Lentils","quantity":"1.5 cups","estimated_cost":1.20,"category":"Pantry"},{"name":"Onion","quantity":"1 large","estimated_cost":0.40,"category":"Produce"},{"name":"Garlic","quantity":"3 cloves","estimated_cost":0.20,"category":"Produce"},{"name":"Carrots","quantity":"2 medium","estimated_cost":0.40,"category":"Produce"},{"name":"Vegetable Broth","quantity":"6 cups","estimated_cost":1.50,"category":"Pantry"},{"name":"Ground Cumin","quantity":"1 tsp","estimated_cost":0.15,"category":"Pantry"},{"name":"Olive Oil","quantity":"2 tbsp","estimated_cost":0.30,"category":"Pantry"},{"name":"Lemon","quantity":"1","estimated_cost":0.50,"category":"Produce"}]',
  'Sauté onion and garlic in olive oil. Add cumin, then lentils, carrots, and broth. Simmer 25 minutes until lentils dissolve. Finish with lemon juice and salt.',
  array['vegan','meal-prep','high-protein','freezer-friendly']
),
(
  'Black Bean Tacos',
  'Speedy weeknight tacos with seasoned black beans and fresh toppings.',
  'lunch', 10, 10, 4, 1.40, 5.60,
  '[{"name":"Black Beans (canned)","quantity":"2 cans (15oz)","estimated_cost":1.60,"category":"Pantry"},{"name":"Small Flour Tortillas","quantity":"8","estimated_cost":1.50,"category":"Bread & Bakery"},{"name":"Shredded Cheese","quantity":"1 cup","estimated_cost":1.50,"category":"Dairy & Eggs"},{"name":"Salsa","quantity":"1/2 cup","estimated_cost":0.80,"category":"Pantry"},{"name":"Lime","quantity":"1","estimated_cost":0.40,"category":"Produce"},{"name":"Ground Cumin","quantity":"1 tsp","estimated_cost":0.10,"category":"Pantry"},{"name":"Garlic Powder","quantity":"1/2 tsp","estimated_cost":0.05,"category":"Pantry"}]',
  'Season drained black beans with cumin and garlic powder, warm in a pan. Warm tortillas. Assemble with beans, salsa, shredded cheese, and a squeeze of lime.',
  array['vegetarian','quick','family-friendly']
),
(
  'Veggie Fried Rice',
  'Better-than-takeout fried rice using leftover rice and pantry staples.',
  'lunch', 10, 15, 4, 1.30, 5.20,
  '[{"name":"Cooked Rice","quantity":"3 cups cold","estimated_cost":0.60,"category":"Pantry"},{"name":"Eggs","quantity":"3 large","estimated_cost":0.90,"category":"Dairy & Eggs"},{"name":"Frozen Mixed Vegetables","quantity":"2 cups","estimated_cost":1.50,"category":"Frozen"},{"name":"Soy Sauce","quantity":"3 tbsp","estimated_cost":0.30,"category":"Pantry"},{"name":"Sesame Oil","quantity":"1 tsp","estimated_cost":0.20,"category":"Pantry"},{"name":"Garlic","quantity":"2 cloves","estimated_cost":0.15,"category":"Produce"},{"name":"Ginger","quantity":"1 tsp","estimated_cost":0.15,"category":"Produce"},{"name":"Vegetable Oil","quantity":"2 tbsp","estimated_cost":0.20,"category":"Pantry"}]',
  'Heat oil in a wok or large skillet. Add garlic and ginger, then vegetables. Push to the side, scramble eggs. Add cold rice and soy sauce, stir-fry until heated through.',
  array['vegetarian','quick','meal-prep','leftover-friendly']
),
(
  'Tuna Salad Sandwich',
  'Classic tuna salad with celery and pickle on hearty bread.',
  'lunch', 10, 0, 2, 1.80, 3.60,
  '[{"name":"Canned Tuna","quantity":"2 cans (5oz)","estimated_cost":2.40,"category":"Pantry"},{"name":"Mayonnaise","quantity":"3 tbsp","estimated_cost":0.30,"category":"Pantry"},{"name":"Celery","quantity":"2 stalks","estimated_cost":0.30,"category":"Produce"},{"name":"Pickle Relish","quantity":"1 tbsp","estimated_cost":0.15,"category":"Pantry"},{"name":"Whole Wheat Bread","quantity":"4 slices","estimated_cost":0.70,"category":"Bread & Bakery"},{"name":"Lettuce","quantity":"4 leaves","estimated_cost":0.30,"category":"Produce"}]',
  'Drain tuna and mix with mayo, chopped celery, and pickle relish. Season with salt and pepper. Serve on bread with lettuce.',
  array['no-cook','quick','high-protein']
),
(
  'Spaghetti Bolognese',
  'Slow-simmered tomato meat sauce over al dente spaghetti. A family classic.',
  'dinner', 15, 40, 4, 2.50, 10.00,
  '[{"name":"Ground Beef (80/20)","quantity":"1 lb","estimated_cost":4.50,"category":"Proteins"},{"name":"Spaghetti","quantity":"12 oz","estimated_cost":1.20,"category":"Pantry"},{"name":"Crushed Tomatoes (canned)","quantity":"28 oz","estimated_cost":1.50,"category":"Pantry"},{"name":"Tomato Paste","quantity":"2 tbsp","estimated_cost":0.30,"category":"Pantry"},{"name":"Onion","quantity":"1 medium","estimated_cost":0.30,"category":"Produce"},{"name":"Garlic","quantity":"3 cloves","estimated_cost":0.20,"category":"Produce"},{"name":"Olive Oil","quantity":"2 tbsp","estimated_cost":0.25,"category":"Pantry"},{"name":"Dried Italian Herbs","quantity":"1 tsp","estimated_cost":0.15,"category":"Pantry"},{"name":"Parmesan Cheese","quantity":"1/4 cup","estimated_cost":1.00,"category":"Dairy & Eggs"}]',
  'Brown ground beef with onion and garlic. Add crushed tomatoes, tomato paste, herbs, and simmer 30 minutes. Cook spaghetti. Serve with parmesan.',
  array['family-friendly','freezer-friendly','meal-prep']
),
(
  'Chicken Stir Fry',
  'Quick high-heat stir fry with tender chicken and crisp vegetables over rice.',
  'dinner', 15, 15, 4, 3.20, 12.80,
  '[{"name":"Chicken Breast","quantity":"1.5 lb","estimated_cost":6.00,"category":"Proteins"},{"name":"Broccoli","quantity":"1 head","estimated_cost":1.50,"category":"Produce"},{"name":"Bell Pepper","quantity":"2","estimated_cost":1.50,"category":"Produce"},{"name":"Soy Sauce","quantity":"1/4 cup","estimated_cost":0.40,"category":"Pantry"},{"name":"Garlic","quantity":"3 cloves","estimated_cost":0.20,"category":"Produce"},{"name":"Fresh Ginger","quantity":"1 tbsp","estimated_cost":0.25,"category":"Produce"},{"name":"Sesame Oil","quantity":"1 tbsp","estimated_cost":0.30,"category":"Pantry"},{"name":"White Rice","quantity":"1.5 cups dry","estimated_cost":0.60,"category":"Pantry"}]',
  'Slice chicken and marinate briefly in soy sauce. Stir fry in batches over high heat. Cook vegetables separately, combine with sauce. Serve over rice.',
  array['high-protein','quick','healthy']
),
(
  'Bean & Rice Bowl',
  'Satisfying burrito bowl with seasoned beans, rice, corn, and avocado.',
  'dinner', 10, 20, 4, 1.50, 6.00,
  '[{"name":"White Rice","quantity":"1.5 cups dry","estimated_cost":0.60,"category":"Pantry"},{"name":"Black Beans (canned)","quantity":"2 cans","estimated_cost":1.60,"category":"Pantry"},{"name":"Corn (canned)","quantity":"1 cup","estimated_cost":0.60,"category":"Pantry"},{"name":"Avocado","quantity":"2","estimated_cost":2.00,"category":"Produce"},{"name":"Salsa","quantity":"1/2 cup","estimated_cost":0.70,"category":"Pantry"},{"name":"Lime","quantity":"1","estimated_cost":0.40,"category":"Produce"},{"name":"Ground Cumin","quantity":"1 tsp","estimated_cost":0.10,"category":"Pantry"}]',
  'Cook rice. Season black beans with cumin and garlic. Assemble bowls with rice, beans, corn, salsa, and sliced avocado. Squeeze lime over top.',
  array['vegan','meal-prep','budget-champion']
),
(
  'Chickpea Curry',
  'Creamy, fragrant chickpea curry with coconut milk. Ready in 30 minutes.',
  'dinner', 10, 25, 4, 2.00, 8.00,
  '[{"name":"Chickpeas (canned)","quantity":"2 cans (15oz)","estimated_cost":1.80,"category":"Pantry"},{"name":"Diced Tomatoes (canned)","quantity":"14 oz","estimated_cost":0.90,"category":"Pantry"},{"name":"Coconut Milk (canned)","quantity":"14 oz","estimated_cost":1.50,"category":"Pantry"},{"name":"Onion","quantity":"1 large","estimated_cost":0.40,"category":"Produce"},{"name":"Garlic","quantity":"3 cloves","estimated_cost":0.20,"category":"Produce"},{"name":"Curry Powder","quantity":"2 tsp","estimated_cost":0.25,"category":"Pantry"},{"name":"Basmati Rice","quantity":"1.5 cups dry","estimated_cost":0.80,"category":"Pantry"},{"name":"Fresh Cilantro","quantity":"1/4 cup","estimated_cost":0.50,"category":"Produce"}]',
  'Sauté onion and garlic, add curry powder, then diced tomatoes, chickpeas, and coconut milk. Simmer 20 minutes. Serve over basmati rice with fresh cilantro.',
  array['vegan','gluten-free','meal-prep','freezer-friendly']
),
(
  'Potato Leek Soup',
  'Silky blended soup with russet potatoes and sweet leeks. Elegant and cheap.',
  'dinner', 15, 30, 6, 1.80, 10.80,
  '[{"name":"Russet Potatoes","quantity":"2 lbs","estimated_cost":2.00,"category":"Produce"},{"name":"Leeks","quantity":"3 large","estimated_cost":3.00,"category":"Produce"},{"name":"Vegetable Broth","quantity":"4 cups","estimated_cost":1.20,"category":"Pantry"},{"name":"Butter","quantity":"2 tbsp","estimated_cost":0.25,"category":"Dairy & Eggs"},{"name":"Heavy Cream","quantity":"1/2 cup","estimated_cost":0.80,"category":"Dairy & Eggs"},{"name":"Garlic","quantity":"2 cloves","estimated_cost":0.15,"category":"Produce"},{"name":"Fresh Thyme","quantity":"2 sprigs","estimated_cost":0.50,"category":"Produce"}]',
  'Sweat leeks in butter. Add potatoes and broth, simmer until tender, about 20 minutes. Blend until smooth. Stir in cream, season with salt and thyme.',
  array['vegetarian','meal-prep','freezer-friendly','comfort-food']
),
(
  'Veggie Pasta Primavera',
  'Seasonal vegetables tossed with pasta, garlic, olive oil, and parmesan.',
  'dinner', 10, 20, 4, 2.20, 8.80,
  '[{"name":"Penne Pasta","quantity":"12 oz","estimated_cost":1.20,"category":"Pantry"},{"name":"Zucchini","quantity":"2 medium","estimated_cost":1.50,"category":"Produce"},{"name":"Cherry Tomatoes","quantity":"1 cup","estimated_cost":1.80,"category":"Produce"},{"name":"Garlic","quantity":"4 cloves","estimated_cost":0.25,"category":"Produce"},{"name":"Olive Oil","quantity":"3 tbsp","estimated_cost":0.40,"category":"Pantry"},{"name":"Parmesan Cheese","quantity":"1/2 cup","estimated_cost":2.00,"category":"Dairy & Eggs"},{"name":"Fresh Basil","quantity":"1/4 cup","estimated_cost":0.80,"category":"Produce"}]',
  'Cook pasta. Sauté zucchini and cherry tomatoes in olive oil with garlic. Toss with drained pasta, fresh basil, and parmesan. Season with salt and pepper.',
  array['vegetarian','quick','family-friendly']
),
(
  'Red Lentil Dahl',
  'Aromatic Indian-inspired dahl with red lentils and warming spices.',
  'dinner', 10, 30, 4, 1.60, 6.40,
  '[{"name":"Red Lentils","quantity":"1.5 cups","estimated_cost":1.20,"category":"Pantry"},{"name":"Diced Tomatoes (canned)","quantity":"14 oz","estimated_cost":0.90,"category":"Pantry"},{"name":"Coconut Milk (canned)","quantity":"14 oz","estimated_cost":1.50,"category":"Pantry"},{"name":"Onion","quantity":"1 large","estimated_cost":0.40,"category":"Produce"},{"name":"Garlic","quantity":"3 cloves","estimated_cost":0.20,"category":"Produce"},{"name":"Ground Turmeric","quantity":"1 tsp","estimated_cost":0.10,"category":"Pantry"},{"name":"Ground Cumin","quantity":"1 tsp","estimated_cost":0.10,"category":"Pantry"},{"name":"Ground Coriander","quantity":"1 tsp","estimated_cost":0.10,"category":"Pantry"},{"name":"Basmati Rice","quantity":"1.5 cups dry","estimated_cost":0.80,"category":"Pantry"}]',
  'Sauté onion, garlic, and ginger. Add spices, then lentils, diced tomatoes, and coconut milk. Simmer 25 minutes until thick. Serve over rice.',
  array['vegan','gluten-free','meal-prep','high-protein']
),
(
  'Sheet Pan Chicken & Veggies',
  'One-pan roasted chicken thighs with sweet potato and broccoli.',
  'dinner', 15, 35, 4, 3.50, 14.00,
  '[{"name":"Chicken Thighs (bone-in)","quantity":"4 pieces (2 lbs)","estimated_cost":7.00,"category":"Proteins"},{"name":"Sweet Potatoes","quantity":"2 medium","estimated_cost":2.00,"category":"Produce"},{"name":"Broccoli","quantity":"1 head","estimated_cost":1.50,"category":"Produce"},{"name":"Olive Oil","quantity":"3 tbsp","estimated_cost":0.40,"category":"Pantry"},{"name":"Garlic","quantity":"3 cloves","estimated_cost":0.20,"category":"Produce"},{"name":"Smoked Paprika","quantity":"1 tsp","estimated_cost":0.15,"category":"Pantry"},{"name":"Dried Rosemary","quantity":"1 tsp","estimated_cost":0.10,"category":"Pantry"}]',
  'Toss chicken thighs and vegetables with olive oil, garlic, and paprika. Spread on a sheet pan and roast at 425°F for 35 minutes, turning halfway.',
  array['gluten-free','high-protein','meal-prep']
),
(
  'Turkey Meatball Soup',
  'Comforting broth soup with turkey meatballs, pasta, and vegetables.',
  'dinner', 20, 30, 6, 2.80, 16.80,
  '[{"name":"Ground Turkey","quantity":"1 lb","estimated_cost":5.00,"category":"Proteins"},{"name":"Chicken Broth","quantity":"8 cups","estimated_cost":2.50,"category":"Pantry"},{"name":"Egg","quantity":"1","estimated_cost":0.30,"category":"Dairy & Eggs"},{"name":"Breadcrumbs","quantity":"1/4 cup","estimated_cost":0.25,"category":"Pantry"},{"name":"Carrots","quantity":"2 medium","estimated_cost":0.40,"category":"Produce"},{"name":"Celery","quantity":"3 stalks","estimated_cost":0.45,"category":"Produce"},{"name":"Small Pasta","quantity":"1 cup dry","estimated_cost":0.50,"category":"Pantry"},{"name":"Dried Parsley","quantity":"1 tsp","estimated_cost":0.10,"category":"Pantry"}]',
  'Mix turkey, egg, breadcrumbs, and herbs. Form into small balls and bake 15 minutes. Simmer broth with carrots and celery, add meatballs and pasta, cook until tender.',
  array['high-protein','meal-prep','freezer-friendly','comfort-food']
),
(
  'Peanut Butter Banana Wrap',
  'Simple, filling wrap with peanut butter and banana. Great for on the go.',
  'snack', 5, 0, 1, 0.90, 0.90,
  '[{"name":"Large Flour Tortilla","quantity":"1","estimated_cost":0.30,"category":"Bread & Bakery"},{"name":"Peanut Butter","quantity":"2 tbsp","estimated_cost":0.30,"category":"Pantry"},{"name":"Banana","quantity":"1 medium","estimated_cost":0.25,"category":"Produce"},{"name":"Honey","quantity":"1 tsp","estimated_cost":0.05,"category":"Pantry"}]',
  'Spread peanut butter on tortilla. Place banana at one edge and roll up tightly. Drizzle with honey if desired.',
  array['vegan','no-cook','quick','kid-friendly']
),
(
  'Hummus & Veggie Plate',
  'Creamy hummus with crisp fresh vegetables for dipping. Great snack or side.',
  'snack', 5, 0, 4, 0.80, 3.20,
  '[{"name":"Hummus","quantity":"1 cup","estimated_cost":1.80,"category":"Pantry"},{"name":"Carrots","quantity":"2 medium","estimated_cost":0.40,"category":"Produce"},{"name":"Celery","quantity":"2 stalks","estimated_cost":0.30,"category":"Produce"},{"name":"Cucumber","quantity":"1 small","estimated_cost":0.50,"category":"Produce"},{"name":"Bell Pepper","quantity":"1","estimated_cost":0.75,"category":"Produce"}]',
  'Arrange hummus in a bowl. Slice carrots, celery, cucumber, and bell pepper into sticks. Serve alongside.',
  array['vegan','no-cook','healthy','quick']
);
