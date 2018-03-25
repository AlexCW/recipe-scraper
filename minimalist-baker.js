let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');
let entryPoint = 'https://minimalistbaker.com/recipe-index';

var minimalistBaker = {

	extractIngredients (html) {
		const $ = html;

		let ingredient_container = $('.entry-content').find('.ERSIngredients');

		let ingredients = [];

		$(ingredient_container).each(function(i, container) {
			ingredients.push($(container).find('.ingredient').html());
		})

		return ingredients;
	},
	async resolveRecipe (url) {
		const timeout = ms => new Promise(res => setTimeout(res, ms));

		await timeout(5000);

		try {
			const response = await axios.get(url);

			const html = cheerio.load(response.data); 

			var recipe = {
				url: url
			};

			recipe.ingredients = this.extractIngredients(html);

		} catch (err) {
			console.log(err)
		}
	},
	selectCategory (html) {
        const $ = cheerio.load(html); 
        var that = this;
        $('.featured-recipes').each(function(i, elem) {
        	let recipes = $(elem).find('article');

        	let count = 0;

        	recipes.each(function(i, elem) {
        		if(count < 1) {
        			let url = $(elem).find('a').attr('href');
        			that.resolveRecipe(url);
        		}
        		count++;
        	});
        });
	},
	init () {
		axios.get(entryPoint)
		    .then((response) => {
		        if(response.status === 200) {
		        	const html = response.data;
			        this.selectCategory(html)
		    	}
		    }, (error) => console.log(err) );
	}
}

minimalistBaker.init();
