let axios = require('axios');

let base = {
	async getIngredients () {
		let response = await axios.get('http://api.eataway.co.uk/ingredients');
		return response.data.data.map((ingredient) => {
			return ingredient.attributes.name
		})
	},
	buildRecipe (extractor, url, html, ingredientsCollection) {
		let recipe = {
			external_url: url,
			name: extractor.extractTitle(html),
			image: extractor.extractImage(html),
			ingredients: extractor.extractIngredients(html, ingredientsCollection),
			prep_time: extractor.extractPrepTime(html),
			tags: extractor.extractTags(html),
			servings: extractor.extractServings(html),
			difficulty: extractor.extractDifficulty(),
			author: extractor.extractAuthor()
		};
			
		recipe.cooking_time = extractor.extractCookingTime(recipe.prepTime, html);

		return recipe;
	}
}

module.exports = base;