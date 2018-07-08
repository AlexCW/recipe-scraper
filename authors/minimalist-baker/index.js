let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');

let entryPoint = 'https://minimalistbaker.com/recipes';
const base = require('../../base');
const extract = require('./extract')

let minimalistBaker = {
	ingredientsCollection: [],
	recipesCollection : [],
	async resolveRecipe (url) {

		const timeout = ms => new Promise(res => setTimeout(res, ms));

		// await timeout(5000);

		try {
			const response = await axios.get(url);

			const html = cheerio.load(response.data); 

			let recipe = {
				external_url: url
			};

			recipe.name = extract.extractTitle(html);

			recipe.image = extract.extractImage(html);

			recipe.ingredients = extract.extractIngredients(html, this.ingredientsCollection);
			
			recipe.prep_time = extract.extractPrepTime(html);

			recipe.cooking_time = extract.extractCookingTime(recipe.prepTime, html);

			recipe.tags = extract.extractTags(html);

			recipe.servings = extract.extractServings(html);

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
				        	 fs.writeFile('../../data/minimalist-baker.json', 
						        JSON.stringify(that.recipesCollection, null, 4), (err)=>{
						     })
				        });
			    	}
			    }, (error) => console.log(err) );
		});
	}
}

minimalistBaker.init();
