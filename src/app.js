const core = require('./data/core.json');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.send('Hello world');
});

app.get('/monsters', (req, res) => {
	let monsters = core.monsters;
	if (req.query.search) {
		monsters = monsters.filter(monster => {
			return monster.name.toLowerCase().indexOf(req.query.search.toLowerCase()) !== -1
		})
	}
	const slugs = monsters.map(monster => {
		return `<li><a href="/monster/${monster.slug}">${monster.name}</a></li>`
	});
	res.send(`<ul>${slugs.join('')}</ul>`);
});

app.get('/monster/:slug', (req, res) => {
	const slug = req.params.slug;
	const monster = core.monsters.find(monster => monster.slug === slug);
	res.json(monster);
});

app.listen(3000, () => {
	console.log('listening on port 3000');
});
