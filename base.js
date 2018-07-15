let axios = require('axios');

let base = {
	async getIngredients () {
		let response = await axios.get('http://api.eataway.co.uk/ingredients');
		return response.data.data.map((ingredient) => {
			return ingredient.attributes.name
		})
	},
	buildRecipe (extractor, url, html, ingredientsCollection) {
		let ingredients = extractor.extractIngredients(html, ingredientsCollection, this.matchIngredient);

		let recipe = {
			external_url: url,
			name: extractor.extractTitle(html),
			image: extractor.extractImage(html),
			ingredients: ingredients.matched,
			missingIngredients: ingredients.missing,
			prep_time: extractor.extractPrepTime(html),
			tags: extractor.extractTags(html),
			servings: extractor.extractServings(html),
			difficulty: extractor.extractDifficulty(),
			author: extractor.extractAuthor()
		};
			
		recipe.cooking_time = extractor.extractCookingTime(recipe.prepTime, html);

		return recipe;
	},
	matchIngredient (ingredientsCollection, recipeIngredient) {
		return ingredientsCollection.find((ingredient) => {
			if(recipeIngredient.indexOf(ingredient.toLowerCase()) > -1) {
				return ingredient
			}

			return false;
		})
	},
	removeDuplicates (data) {
		return [...new Set(data)]
	}
}

module.exports = base;