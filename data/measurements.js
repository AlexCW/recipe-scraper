const measurements = [
	{ pattern: 'pint', name: 'pint'},
	{ pattern: 'handful', name: 'handful'},
	{ pattern: 'batch', name: 'batch'},
	{ pattern: 'bundle', name: 'bundle'},
	{ pattern: 'pound', name: 'pound'},
	{ pattern: 'oz', name: 'oz'},
	{ pattern: /cup(s?)/, name: 'cup'},
	{ pattern: 'dash', name: 'dash'},
	{ pattern: /pinch/gi, name: 'pinch'},
	{ pattern: /tsp(s?)/gi, name: 'tsp'},
	{ pattern: /tbsp(s?)/gi, name: 'tbsp'},
	{ pattern: /ml(s?)/gi, name: 'ml'},
	{ pattern: /g/, name: 'g' },
	{ pattern: 'clove', name: 'clove'},
	{ pattern: 'total', name: 'total'}
];

module.exports = measurements;