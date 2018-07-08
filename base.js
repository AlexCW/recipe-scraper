let axios = require('axios');

let base = {
	async getIngredients() {
		let response = await axios.get('http://api.eataway.co.uk/ingredients');
		return response.data.data.map((ingredient) => {
			return ingredient.attributes.name
		})
	}
}

module.exports = base;