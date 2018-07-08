let axios = require('axios');
let cheerio = require('cheerio');
let moment = require('moment');
let fs = require('fs');

let entryPoint = 'https://minimalistbaker.com/recipes';
const base = require('./base');
const measurements = require('./data/measurements');

let minimalistBaker = {
	ingredientsCollection: [],
	recipesCollection : [],
	extractTitle ($) {
		let title = $('.entry-title', '.entry-header').text();
		return title;
	},
	extractIngredients ($) {
		let ingredient_container = $('.entry-content').find('.wprm-recipe-ingredient-group');
		let ingredients = [];
		let priority = $('span.wprm-recipe-ingredient-name').length - 1;
		let self = this;
		$('.wprm-recipe-ingredient').each(function(i, ingredient) {
			let recipe_ingredient = $(ingredient).find('.wprm-recipe-ingredient-name').text().trim().replace(/\-/g, " ").toLowerCase();
			let ingredientMeasurement = 'total';

			measurements.forEach(function(measurement) {
				let match = $(ingredient).find('.wprm-recipe-ingredient-unit').text().toLowerCase().match(measurement.pattern);
				if(match) {
					ingredientMeasurement = measurement.name;
					return;
				}
			});

			self.ingredientsCollection.forEach(function(ingredient) {
				if(recipe_ingredient.indexOf(ingredient.toLowerCase()) > -1) {
					recipe_ingredient = ingredient;
				}
			});

			let ingredientExists = ingredients.find(ingredient => ingredient.ingredient === recipe_ingredient);

			let amount = $(ingredient).find('.wprm-recipe-ingredient-amount').text();

			if(typeof ingredientExists === 'object') {
				let index = ingredients.indexOf(ingredientExists); 
				ingredients[index].amount = Number(ingredients[index].amount) + Number(amount);
			} else {
				if(amount.indexOf("/") > -1) {
					let fraction = amount.split('/');
					amount = parseInt(fraction[0], 10) / parseInt(fraction[1], 10);
				}
				ingredients.push({
					ingredient: recipe_ingredient,
					priority: priority,
					amount: !isNaN(amount) ? parseFloat(amount) : 1,
					measurement: ingredientMeasurement
				});
			}

			priority--;
		});
		return ingredients;
	},
	extractImage($) {
		let ingredient_image = $('.wprm-recipe-image').find('img');
		return ingredient_image.attr('data-lazy-src');
	},
	extractMinutesFromText(text) {
		let mappedTime = text.split(" ").map(function(e, a) {
			if(a == 0 || a % 2 == 0) {
				return Number(e);
			}
			e = e.replace("mins", "minutes");
			e = e.replace("hour", "hours");
			return e;
		});
		return Number(moment.duration(...mappedTime).asMinutes());
	},
	extractPrepTime ($) {
		let prepTime = $('.wprm-recipe-prep_time').text() + ' ' + $('.wprm-recipe-prep_time-unit').text();
		return this.extractMinutesFromText(prepTime);
	},
	extractCookingTime (prepTime, $) {
		let cookingTime = $('.wprm-recipe-cook_time').text() + ' ' + $('.wprm-recipe-cook_time-unit').text();
		return this.extractMinutesFromText(cookingTime);
	},
	extractTags ($) {
		let tagsContainer = $('.entry-footer');
		let tags = tagsContainer.find('.entry-categories').find('a').map(function(){ 
		    return $(this).text(); 
		}).get();
		return tags;
	},
	extractServings ($) {
		let servingsContainer = $('.wprm-recipe-details-container');
		let servings = servingsContainer.find('.wprm-recipe-servings').text();
		return Number(servings.replace(/\D/g,''));
	},
	async resolveRecipe (url) {

		const timeout = ms => new Promise(res => setTimeout(res, ms));

		// await timeout(5000);

		try {
			const response = await axios.get(url);

			const html = cheerio.load(response.data); 

			let recipe = {
				external_url: url
			};

			recipe.name = this.extractTitle(html);

			recipe.image = this.extractImage(html);

			recipe.ingredients = this.extractIngredients(html);
			
			recipe.prep_time = this.extractPrepTime(html);

			recipe.cooking_time = this.extractCookingTime(recipe.prepTime, html);

			recipe.tags = this.extractTags(html);

			recipe.servings = this.extractServings(html);

			recipe.difficulty = 'easy';

			recipe.author = 'Minimalist Baker';

			this.recipesCollection.push(recipe);

		} catch (err) {
			console.log(err)
		}
	},
	async asyncForEach(array, callback) {
	  for (let index = 0; index < array.length; index++) {
	    await callback(array[index], index, array)
	  }
	},
	async selectCategory (html, page = 2) {
        const $ = cheerio.load(html); 
        let that = this;

    	let recipes = $('.content').find('article');

    	await this.asyncForEach(recipes, async (elem) => {
			let url = $(elem).find('a').attr('href');
	    	await that.resolveRecipe(url);
		});

        if(page < 5) {
	        await axios.get(entryPoint + '/page/' + page)
			    .then((response) => {
			        if(response.status === 200) {
			        	const html = response.data;
			        	if(html) {
							that.selectCategory(html, page + 1);
						}
				    }
			    }, (error) => console.log(err) );
        }
	},
	async init () {
		let that = this;
		base.getIngredients().then((ingredients) => {
			this.ingredientsCollection = ingredients;
			axios.get(entryPoint)
			    .then((response) => {
			        if(response.status === 200) {
			        	const html = response.data;
				        this.selectCategory(html).then(function(){
				        	 fs.writeFile('data/minimalist-baker.json', 
						        JSON.stringify(that.recipesCollection, null, 4), (err)=>{
						     })
				        });
			    	}
			    }, (error) => console.log(err) );
		});
	}
}

minimalistBaker.init();
