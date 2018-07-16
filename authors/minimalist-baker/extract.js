const measurements = require('../../data/measurements')
const moment = require('moment')

let extract = {
	extractTitle ($) {
		let title = $('.entry-title', '.entry-header').text()
		return title
	},
	extractIngredients ($, ingredientsCollection, matcher) {
		let ingredient_container = $('.entry-content').find('.wprm-recipe-ingredient-group')
		let ingredients = []
		let missingIngredients = [];
		let priority = $('span.wprm-recipe-ingredient-name').length - 1

		$('.wprm-recipe-ingredient').each((i, ingredient) => {
			let recipe_ingredient = $(ingredient).find('.wprm-recipe-ingredient-name').text().trim().replace('*', '').replace(/\-/g, " ").toLowerCase()
			let ingredientMeasurement = this.extractMeasurement($, ingredient)

			match = matcher(ingredientsCollection, recipe_ingredient)

			if (!match) {
				missingIngredients.push(recipe_ingredient)
				return
			}

			let ingredientExists = ingredients.find(ingredient => ingredient.ingredient === match)
			let amount = $(ingredient).find('.wprm-recipe-ingredient-amount').text()

			// if the ingredient is in the recipe twice
			if(typeof ingredientExists !== 'undefined') {
				let index = ingredients.indexOf(ingredientExists)
				ingredients[index].amount = Number(ingredients[index].amount) + Number(amount)
			} else {
				if(amount.indexOf("/") > -1) {
					let fraction = amount.split('/')
					amount = parseInt(fraction[0], 10) / parseInt(fraction[1], 10)
				}
				ingredients.push({
					ingredient: match,
					priority: priority,
					amount: !isNaN(amount) ? parseFloat(amount) : 1,
					measurement: ingredientMeasurement
				});
			}

			priority--
		})

		return { 'matched': ingredients, 'missing': missingIngredients }
	},
	extractMeasurement($, ingredient) {
		let ingredientMeasurement = 'total'

		measurements.forEach((measurement) => {
			let match = $(ingredient).find('.wprm-recipe-ingredient-unit').text().toLowerCase().match(measurement.pattern)
			if(match) {
				ingredientMeasurement = measurement.name
				return
			}
		});

		return ingredientMeasurement
	},
	extractImage($) {
		return $('.wprm-recipe-image').find('img').attr('data-lazy-src')
	},
	extractMinutesFromText(text) {
		let mappedTime = text.split(" ").map(function(e, a) {
			if(a == 0 || a % 2 == 0) {
				return Number(e)
			}
			e = e.replace("mins", "minutes")
			e = e.replace("hour", "hours")
			return e
		});
		return Number(moment.duration(...mappedTime).asMinutes())
	},
	extractPrepTime ($) {
		let prepTime = $('.wprm-recipe-prep_time').text() + ' ' + $('.wprm-recipe-prep_time-unit').text()
		return this.extractMinutesFromText(prepTime)
	},
	extractCookingTime (prepTime, $) {
		let cookingTime = $('.wprm-recipe-cook_time').text() + ' ' + $('.wprm-recipe-cook_time-unit').text()
		return this.extractMinutesFromText(cookingTime)
	},
	extractTags ($) {
		let tagsContainer = $('.entry-footer')
		let tags = tagsContainer.find('.entry-categories').find('a').map(function(){ 
		    return $(this).text()
		}).get();
		return tags
	},
	extractServings ($) {
		let servingsContainer = $('.wprm-recipe-details-container');
		let servings = servingsContainer.find('.wprm-recipe-servings').text()
		return Number(servings.replace(/\D/g,''))
	},
	extractDifficulty () {
		return 'easy'
	},
	extractAuthor () {
		return 'Minimalist Baker'
	}
}

module.exports = extract