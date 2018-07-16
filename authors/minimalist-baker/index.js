let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');

let entryPoint = 'https://minimalistbaker.com/recipes';
const base = require('../../base');
const extract = require('./extract');

let minimalistBaker = {
	async asyncForEach(array, callback) {
	  for (let index = 0; index < array.length; index++) {
	    await callback(array[index], index, array)
	  }
	},
	async selectCategory (html, page = 1) {
        const $ = cheerio.load(html); 
        let that = this;

    	let recipes = $('.content').find('article');

    	await this.asyncForEach(recipes, async (elem) => {
			let url = $(elem).find('a').attr('href');
	    	await base.resolveRecipe(url, extract);
		});

        if(page < 3) {
	        await axios.get(entryPoint + '/page/' + page)
			    .then(async (response) => {
			        if(response.status === 200) {
			        	const html = response.data;
			        	if(html) {
							await that.selectCategory(html, page + 1);
						}
				    }
			    }, (error) => console.log(err) );
        }
	},
	async init () {
		let that = this;
		await base.fetchIngredients();
		
		axios.get(entryPoint)
		    .then((response) => {
		        if(response.status === 200) {
		        	const html = response.data;
			        this.selectCategory(html).then(function(){
					     return new Promise(function(resolve, reject) {
				        	 fs.writeFile('./recipes.json', 
						        JSON.stringify(base.recipes, null, 4), (err)=>{
						        if (err) reject(err);
						     })
						     fs.writeFile('./missing-ingredients.json', 
						        JSON.stringify(base.removeDuplicates(base.missingIngredients), null, 4), (err)=>{
						        if (err) reject(err);
						     })
					     	 resolve()
			        	});
					})
		    	}
		    }, (error) => console.log(err) );
	}
}

minimalistBaker.init();
