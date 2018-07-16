let axios = require('axios');

let api = {
	async fetchIngredients () {
		let response = await axios.get('http://api.eataway.co.uk/ingredients');
		if(response.status === 200) {
			return response.data.data.map((ingredient) => {
				return ingredient.attributes.name
			})
		}
		throw "Unable to retrieve recipes from the API."
	},
}

module.exports = api;