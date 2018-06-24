let axios = require('axios');
let cheerio = require('cheerio');
let moment = require('moment');
let fs = require('fs');

let entryPoint = 'https://minimalistbaker.com/recipes';

const ingredientsCollection = require('./data/ingredients');
const measurements = require('./data/measurements');

var minimalistBaker = {
	recipesCollection : [],
	extractTitle ($) {
		let title = $('.entry-title', '.entry-header').text();
		return title;
	},
	extractIngredients ($) {
		let ingredient_container = $('.entry-content').find('.wprm-recipe-ingredient-group');
		let ingredients = [];
		$(ingredient_container).each(function(i, container) {
			$(container).find('span.wprm-recipe-ingredient-name').each(function(i, ingredient) {
				var recipe_ingredient = $(ingredient).text().trim().replace(/\-/g, " ").toLowerCase();

				let ingredientMeasurement = 'total';

				let ingredientAmount = 1;

				measurements.forEach(function(measurement) {
					let match = recipe_ingredient.match(measurement.pattern);
					if(match) {
						ingredientMeasurement = measurement.name;
						
						matchedIngredient = match.join("").match(/\d+/);

						if(matchedIngredient) {
							ingredientAmount = matchedIngredient[0];
						}

						return;
					}
				});

				ingredientsCollection.forEach(function(ingredient) {
					if(recipe_ingredient.indexOf(ingredient.toLowerCase()) > -1) {
						recipe_ingredient = ingredient;
					}
				});

				let ingredientExists = ingredients.find(ingredient => ingredient.ingredient === recipe_ingredient);

				if(typeof ingredientExists === 'object') {
					let index = ingredients.indexOf(ingredientExists); 
					ingredients[index].amount = Number(ingredients[index].amount) + Number(ingredientAmount);
				} else {
					ingredients.push({
						ingredient: recipe_ingredient,
						priority: i,
						amount: ingredientAmount,
						measurement: ingredientMeasurement
					});
				}
			});
		});
		return ingredients;
	},
	extractImage($) {
		let ingredient_image = $('.entry-content').find('img');

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

			var recipe = {
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
        var that = this;

    	let recipes = $('.content').find('article');

    	await this.asyncForEach(recipes, async (elem) => {
			let url = $(elem).find('a').attr('href');
	    	await that.resolveRecipe(url);
		});

        if(page < 2) {
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
	init () {
		var that = this;
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
	}
}

minimalistBaker.init();
