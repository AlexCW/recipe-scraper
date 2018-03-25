let axios = require('axios');
let cheerio = require('cheerio');
let moment = require('moment');
let fs = require('fs');

let entryPoint = 'https://minimalistbaker.com/recipe-index';

var minimalistBaker = {
	recipesCollection : [],
	extractTitle ($) {
		let title = $('.entry-title', '.entry-header').text();
		return title;
	},
	extractIngredients ($) {
		let ingredient_container = $('.entry-content').find('.ERSIngredients');
		let ingredients = [];
		$(ingredient_container).each(function(i, container) {
			$(container).find('.ingredient').each(function(i, ingredient) {
				ingredients.push($(ingredient).html());
			});
		});
		return ingredients;
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
		let prepTime = $('.ERSTimeItem', '.ERSTimes').find(`[itemprop='prepTime']`).text();
		return this.extractMinutesFromText(prepTime);
	},
	extractCookingTime (prepTime, $) {
		let totalTime = $('.ERSTimeItem', '.ERSTimes').find(`[itemprop='totalTime']`).text();
		totalTime = this.extractMinutesFromText(totalTime);
		return totalTime - prepTime;
	},
	extractTags ($) {
		let tagsContainer = $('.divERSHeadItems');
		let typeTags = tagsContainer.find('.ERSCategory').find(`[itemprop='recipeCategory']`).text();
		let cuisineTags = tagsContainer.find('.ERSCuisine').find(`[itemprop='recipeCuisine']`).text();
		return Array.prototype.concat(typeTags.split(","), cuisineTags.split(","));
	},
	extractServings ($) {
		let tagsContainer = $('.divERSHeadItems');
		let servings = tagsContainer.find('.ERSServes').find(`[itemprop='recipeYield']`).text();
		return Number(servings.replace(/\D/g,''));
	},
	async resolveRecipe (url) {

		const timeout = ms => new Promise(res => setTimeout(res, ms));

		// await timeout(5000);

		try {
			const response = await axios.get(url);

			const html = cheerio.load(response.data); 

			var recipe = {
				url: url
			};

			recipe.title = this.extractTitle(html);

			recipe.ingredients = this.extractIngredients(html);
			
			recipe.prepTime = this.extractPrepTime(html);

			recipe.cookingTime = this.extractCookingTime(recipe.prepTime, html);

			recipe.tags = this.extractTags(html);

			recipe.servings = this.extractServings(html);

			recipe.difficulty = 'easy';

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
	async selectCategory (html) {
        const $ = cheerio.load(html); 
        var that = this;

        await that.asyncForEach($('.featured-recipes'), async (elem) => {
        	let recipes = $(elem).find('article');
        	let count = 0;
        	await that.asyncForEach(recipes, async (elem) => {
        		if(count < 1) {
				  	let url = $(elem).find('a').attr('href');
		    		await that.resolveRecipe(url);
		    	}
	        	count++;
			});
        });
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
