let axios = require('axios');
let cheerio = require('cheerio');

let base = {
	ingredients: [],
	recipes: [],
	missingIngredients: [],
	async resolveRecipe (url, extract) {

		// const timeout = ms => new Promise(res => setTimeout(res, ms));

		// await timeout(5000);

		try {
			const response = await axios.get(url)

			const html = cheerio.load(response.data)

			let recipe = base.buildRecipe(extract, url, html, base.ingredients)

			if (recipe.missingIngredients.length <= 0) {
				base.recipes.push(recipe)
			} else {
				base.missingIngredients = base.missingIngredients.concat(recipe.missingIngredients)
			}

		} catch (err) {
			console.log(err)
		}
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
	async fetchIngredients () {
		let response = await axios.get('http://api.eataway.co.uk/ingredients');
		this.ingredients = response.data.data.map((ingredient) => {
			return ingredient.attributes.name
		})
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