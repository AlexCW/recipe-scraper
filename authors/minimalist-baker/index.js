let axios = require('axios');
let cheerio = require('cheerio');

let entryPoint = 'https://minimalistbaker.com/recipes';

const api = require('../../api');
const base = require('../../base');
const extract = require('./extract');

let minimalistBaker = {
	async asyncForEach(array, callback) {
	  for (let index = 0; index < array.length; index++) {
	    await callback(array[index], index, array)
	  }
	},
	async loadRecipePage (html, page = 1, ingredients) {
        const $ = cheerio.load(html); 
        let that = this;

    	let recipes = $('.content').find('article');

    	await this.asyncForEach(recipes, async (elem) => {
			let url = $(elem).find('a').attr('href');
	    	await base.resolveRecipe(url, extract, ingredients);
		});

        if(page < 3) {
	        await axios.get(entryPoint + '/page/' + page)
			    .then(async (response) => {
			        if(response.status === 200) {
			        	const html = response.data;
			        	if(html) {
							await that.loadRecipePage(html, page + 1, ingredients);
						}
				    }
			    }, (error) => console.log(err) );
        }
	},
	async init () {
		let that = this
		let ingredients = []
		let html = ''

		try {
			ingredients = await api.fetchIngredients()
		} catch(error) {
			console.error(error)
			return
		}

		try {
			html = await base.getEntryPageHtml(entryPoint)
		} catch(error) {
			console.error(error)
			return
		}

		await this.loadRecipePage(html, 1, ingredients)
		
		base.writeToFiles().catch((error) => {
			console.error(error);
		})
	}
}

minimalistBaker.init();
