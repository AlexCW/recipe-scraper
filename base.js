let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');
let stringSimilarity = require('string-similarity');

let base = {
	ingredients: [],
	recipes: [],
	missingIngredients: [],
	async getEntryPageHtml(url) {
		let response = await axios.get(url)
        if(response.status === 200) {
        	return response.data;
    	}
		throw "Unable to retrieve the HTML for the entry page."
	},
	async resolveRecipe (url, extract, ingredients) {

		// const timeout = ms => new Promise(res => setTimeout(res, ms));

		// await timeout(5000);

		try {
			const response = await axios.get(url)

			const html = cheerio.load(response.data)

			let recipe = base.buildRecipe(extract, url, html, ingredients)

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
	matchIngredient (ingredientsCollection, recipeIngredient) {
		let bestMatch = stringSimilarity.findBestMatch(recipeIngredient, ingredientsCollection).bestMatch;

		if (bestMatch.rating < 0.5) {
			return false
		}

		return stringSimilarity.findBestMatch(recipeIngredient, ingredientsCollection).bestMatch.target	
	},
	removeDuplicates (data) {
		return [...new Set(data)]
	},
	writeToFiles () {
		return new Promise((resolve, reject) => {
        	 fs.writeFile('./recipes.json', 
		        JSON.stringify(this.recipes, null, 4), (err)=>{
		        if (err) reject('There was an error writing the recipes to file.'); return;
		     })
		     fs.writeFile('./missing-ingredients.json', 
		        JSON.stringify(this.removeDuplicates(this.missingIngredients), null, 4), (err)=>{
		        if (err) reject('There was an error writing the missing ingredients to file.'); return;
		     })
    	});
	}
}

module.exports = base;