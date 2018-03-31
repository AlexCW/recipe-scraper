const ingredientsCollection = [
	'Garlic',
	'Salt',
	'Black Pepper',
	'Basil',
	'Pine Nuts',
	'Parmesan Cheese',
	'Extra Virgin Olive Oil',
	'Lemon Juice',
	'Chickpeas',
	'Tahini',
	'Sea Salt',
	'Paprika',
	'Coriander Leaves',
	'Parsley',
	'Oregano',
	'Red Wine Vinegar',
	'Red Pepper Flakes',
	'Kosher Salt',
	'Marinated Artichoke',
	'Lemon Zest',
	'Flat Leaf Parsley',
	'Onion',
	'Celery',
	'Ground Cumin',
	'Vegetable Stock',
	'Plum Tomato',
	'Broad Beans',
	'Flatbread',
	'Cumin Seeds',
	'Chilli Flakes',
	'Olive Oil',
	'Carrot',
	'Split Red Lentils',
	'Milk',
	'Yoghurt',
	'Naan Bread',
	'Leek',
	'Green Beans',
	'Courgette',
	'Vine Ripened Tomato',
	'Cannellini Beans',
	'Rice Noodle',
	'Pistachios',
	'Sweetcorn Cobs',
	'Butter',
	'Caster Sugar',
	'Coriander Seeds',
	'Birds Eye Chilli',
	'Turmeric',
	'Thyme',
	'Cayenne Pepper',
	'Lentils',
	'Tomato',
	'Sunflower Oil',
	'Ginger',
	'Ground Cinnamon',
	'Ground Coriander',
	'Garam Masala',
	'Chopped Tomatoes',
	'Coconut Cream',
	'Chives',
	'Crusty Bread',
	'Butternut Squash',
	'Vegetable Oil',
	'Thai Red Curry Paste',
	'Coconut Milk',
	'Single Cream',
	'Quinoa',
	'Shallot',
	'Tarragon',
	'Puy Lentils',
	'Green Lentils',
	'Cucumber',
	'Feta',
	'Spring Onion',
	'Orange Juice',
	'Orange Zest',
	'White Wine Vinegar',
	'Orzo Pasta',
	'Yellow Cherry Tomato',
	'Red Cherry Tomato',
	'Black Olive',
	'Red Onion',
	'Lemon',
	'Mint',
	'Roasted Pepper',
	'Sugar',
	'Halloumi',
	'Sesame Seed',
	'Poppy Seed',
	'New Potatoes',
	'Egg Yolk',
	'Mustard',
	'Beetroot',
	'Pear',
	'Lemon Oil',
	'Sunflower Seed',
	'Red Chilli',
	'Cous Cous',
	'Smoked Paprika',
	'Tomato Puree',
	'Sweetcorn',
	'Soy Sauce',
	'Rosemary',
	'Basil Pesto',
	'Mango',
	'Lime',
	'Red Bell Pepper',
	'Cilantro',
	'Panko Breadcrumb',
	'Asparagus',
	'Egg',
	'All Purpose Flour',
	'Sweet Potato',
	'Garlic Powder',
	'Green Peas',
	'Piquillo Pepper',
	'Charlotte Potato',
	'Asafoetida',
	'Black Mustard Seed',
	'Dried Red Chilli',
	'Green Chilli',
	'Sweetheart Cabbage',
	'Desiccated Coconut',
	'Shaved Coconut',
	'Red Chilli Powder',
	'Mango Powder',
	'Fenugreek Leaves',
	'Cinnamon',
	'Baguette',
	'Split Yellow Lentils',
	'Maris Piper Potato',
	'Curry Leaves',
	'Black Lentils',
	'Paneer',
	'Korma Paste',
	'Madras Paste',
	'Spinach',
	'Chickpea Flour',
	'Red Kidney Beans',
	'Flat Rice Noodle',
	'Tamarind Paste',
	'Sweet Chilli Sauce',
	'Tofu',
	'Beansprouts',
	'Peanuts',
	'Fish Sauce',
	'Galangal',
	'Ground Nutmeg',
	'Bay Leaf',
	'Cashews',
	'Lemongrass',
	'Chestnut Mushroom',
	'Kaffir Leaves',
	'Sesame Oil',
	'Jalapeno Pepper',
	'Brown Sugar',
	'White Rice',
	'Scallions',
	'Black Bean Sauce',
	'Soba Noodles',
	'Savoy Cabbage',
	'Egg Noodle',
	'Mangetout',
	'Hazelnut',
	'Yellow Bean Sauce',
	'Vermicelli Noodles',
	'Rice Paper',
	'Vegetarian Mince',
	'Water Chestnuts',
	'Iceburg Lettuce',
	'Mushroom',
	'Orange',
	'Rice Vinegar',
	'Chicken Breasts',
	'Vegetarian Chicken',
	'Baby Corn',
	'Honey',
	'Sugar Snaps',
	'Aubergine',
	'Passata',
	'Lasagne Sheets',
	'Ricotta',
	'Soft Cheese',
	'Fusilli',
	'Gnocchi',
	'Cauliflower',
	'Cornflour',
	'Yeast',
	'Sundried Tomato',
	'Walnut',
	'Mozarella ',
	'Blue Cheese',
	'Rocket',
	'Coconut Oil',
	'Hemp Seed',
	'Himalayan Sea Salt',
	'Fennel',
	'Pumpkin Seed',
	'Balsamic Vinegar',
	'Pizza Dough',
	'Arborio Rice',
	'Chicken Stock',
	'Fontina Cheese',
	'Breadcrumbs',
	'Creme Fraiche',
	'Brown Rice Flour',
	'Capers',
	'Canola Oil',
	'Mature Cheddar',
	'Semi Skimmed Milk',
	'Harissa Paste',
	'Allspice',
	'Mixed Beans',
	'Plain Flour',
	'Green Bell Pepper',
	'Yellow Bell Pepper',
	'Orange Bell Pepper',
	'Wholewheat Tortilla',
	'Pickled Red Cabbage',
	'Chilli Sauce',
	'Pinto Beans',
	'Flour Tortilla',
	'Gruyere Cheese',
	'Tomato Salsa',
	'Soured Cream',
	'Enchillada Sauce',
	'Black Beans',
	'Cheddar Cheese',
	'Avocado',
	'Roma Tomato',
	'Hot Sauce',
	'Tomato Paste',
	'Goats Cheese',
	'Salad Leaves',
	'Long Grain Rice',
	'Brown Rice',
	'Ancho Chilli',
	'Corn Tortilla',
	'Romaine Lettuce',
	'Brown Basmati Rice',
	'Brown Lentils',
	'Greek Yoghurt',
	'Curly Parsley',
	'Pitta Bread',
	'Stale Bread',
	'Burger Buns',
	'Kale',
	'Ground Flax',
	'Oats',
	'Rapeseed Oil',
	'Lettuce',
	'Tomato Ketchup',
	'Marmite',
	'Apple',
	'Red Cabbage',
	'Baby Spinach',
	'Cress',
	'Gherkin',
	'Mustard Seeds',
	'Basmati Rice',
	'Jasmine Rice',
	'Water',
	'Saffron',
	'Strong Bread Flour',
	'Puff Pastry',
	'Wholemeal Flour',
	'Sweet Onions',
	'Sage',
	'Yellow Onion',
	'White Onion',
	'Portobello Mushrooom',
	'Dried Porcini Mushrooms',
	'Camembert',
	'Dark Soy Sauce',
	'Almonds',
	'Pecan',
	'Brie',
	'Raspberry',
	'Buttermilk',
	'Gorgonzola',
	'Green Onions',
	'Pecorino Romano',
	'Red Potato',
	'Mayonaise',
	'Semolina',
	'Conchiglie',
	'Grana Padano',
	'Pancakes',
	'Cointreau',
	'Grand Marnier',
	'Vanilla Extract',
	'Granulated Sugar',
	'Cooking Apple',
	'Nutella',
	'Frangelico',
	'Double Cream',
	'Banana',
	'Chocolate Chips',
	'Icing Sugar',
	'Smooth Peanut Butter',
	'Crunchy Peanut Butter',
	'Blueberry',
	'Baking Powder',
	'Golden Syrup',
	'Maple Syrup',
	'Dark Chocolate',
	'Amaretto',
	'Sesame Snaps',
	'Sour Cherry',
	'Ground Almond',
	'Full Cream Milk',
	'Vanilla Pod',
	'Mascarpone',
	'Shortcrust Pastry',
	'Apricot Jam',
	'Baby Courgette',
	'Ground Ginger',
	'Goji Berries',
	'Cacao Nibs',
	'Dried Cranberries',
	'Date Syrup',
	'Ground Cardamon',
	'Rice Flour',
	'Broccoli',
	'Bread',
	'Cracked Black Pepper',
	'Coconut Sugar',
	'Salted Caramel',
	'Pomegranate Seeds',
	'Gelatin',
	'Almond Milk',
	'Buckwheat Flour',
	'Monterey Jack Cheese',
	'Ground Cloves',
	'Lime Juice',
	'Radish',
	'White Wine',
	'Fajita Seasoning',
	'Gem Lettuce',
	'Jacket Potatoes',
	'Butter Beans',
	'Cocoa Powder',
	'Horseradish',
	'Dil',
	'Tortellini',
	'Potato',
	'Apple Puree',
	'Brazil Nuts',
	'Wild Rice',
	'Raisins',
	'Tamari',
	'Groundnut Oil',
	'Hoisin Sauce',
	'Rice Wine Vinegar',
	'Shitake Mushroom',
	'Pineapple',
	'Tinned Pineapple Rings',
	'Chana dal',
	'Chapati',
	'Apricot',
	'Worcester Sauce',
	'Dried Thyme',
	'Chapati Flour',
	'Nigella Seeds',
	'Mustard Oil',
	'Baby Leeks',
	'Grapefruit',
	'Granola',
	'Strawberry',
	'Burrata',
	'Cornstarch',
	'Almond Flour',
	'Gluten Free Flour',
	'Pomegranate Molasses',
	'Bourbon Whiskey',
	'Bitters',
	'Tapioca Starch',
	'Medjool Dates',
	'Zucchini',
	'Curry Powder',
	'Kimchi',
	'Coconut Cream',
	'Coconut Yoghurt',
	'Habanero Peppers'
];

module.exports = ingredientsCollection;