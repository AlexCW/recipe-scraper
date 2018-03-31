const measurements = [
	{ pattern: 'pint', name: 'pint'},
	{ pattern: 'handful', name: 'handful'},
	{ pattern: 'batch', name: 'batch'},
	{ pattern: 'pound', name: 'pound'},
	{ pattern: 'oz', name: 'oz'},
	{ pattern: /\d+(\s?)cup(s?)/, name: 'cups'},
	{ pattern: 'dash', name: 'dash'},
	{ pattern: 'pinch', name: 'pinch'},
	{ pattern: /\d+(\s?)tsp(s?)/gi, name: 'tsp'},
	{ pattern: /\d+(\s?)tbsp(s?)/gi, name: 'tbsp'},
	{ pattern: /\d+(\s?)ml(s?)/gi, name: 'ml'},
	{ pattern: /\d+(\s?)g/, name: 'g' },
	{ pattern: 'clove', name: 'clove'},
	{ pattern: 'total', name: 'total'}
];

module.exports = measurements;