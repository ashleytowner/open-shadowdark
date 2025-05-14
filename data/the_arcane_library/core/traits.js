const monsters = require('./monsters.json');

const traits = [];

monsters.forEach(monster => {
	traits.push(...monster.traits);
});

traits.sort((a,b) => a.name.localeCompare(b.name));

const filtered = traits.filter((item, index, arr) => {
	const ind = arr.findIndex(x => x.name === item.name && x.description === item.description);
	return index === ind;
})

console.log(JSON.stringify(filtered.map((trait, index) => ({...trait, slug: `${trait.name.toLowerCase().replace(/ /g, '_')}-${index}`}))));
