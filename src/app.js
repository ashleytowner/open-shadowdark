const core = require("./data/core.json");
const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  const body = `
		<a href="/monsters">Monsters</a>
		<a href="/spells">Spells</a>
		<a href="/items">Magic Items</a>
	`;
  res.render("index", {
    title: "Open ShadowDark",
    body: "",
    dangerousBody: body,
		license: core.license
  });
});

app.get("/monsters", (req, res) => {
  let monsters = core.monsters;
  if (req.query.search) {
    monsters = monsters.filter((monster) => {
      return (
        monster.name.toLowerCase().indexOf(req.query.search.toLowerCase()) !==
        -1
      );
    });
  }
  res.render("list", {
    title: "Monsters",
    route: "monster",
    items: monsters,
    search: req.query.search || "",
  });
});

app.get("/monster/:slug", (req, res) => {
  const slug = req.params.slug;
  const monster = core.monsters.find((monster) => monster.slug === slug);
	if (req.accepts('text/html')) {
		res.render('monster', monster);
	} else if (req.accepts('application/json')) {
		res.json(monster);
	} else if (req.accepts('text/markdown')) {
		res.set('Content-Type', 'text/markdown');
		res.render('monster-md', monster);
	}
});

app.get("/spells", (req, res) => {
  let spells = core.spells;
  if (req.query.search) {
    spells = spells.filter((spell) => {
      return (
        spell.name.toLowerCase().indexOf(req.query.search.toLowerCase()) !== -1
      );
    });
  }
  res.render("list", {
    title: "Spells",
    route: "spell",
    items: spells,
    search: req.query.search || "",
  });
});

app.get("/spell/:slug", (req, res) => {
  const slug = req.params.slug;
  const spell = core.spells.find((spell) => spell.slug === slug);
	if (req.accepts('text/html')) {
		res.render('spell', spell);
	} else if (req.accepts('application/json')) {
		res.json(spell);
	} else if (req.accepts('text/markdown')) {
		res.set('Content-Type', 'text/markdown');
		res.render('spell-md', spell);
	}
});

app.get("/items", (req, res) => {
  let items = core.items;
  if (req.query.search) {
    items = items.filter((item) => {
      return (
        item.name.toLowerCase().indexOf(req.query.search.toLowerCase()) !== -1
      );
    });
  }
  res.render("list", {
    title: "Magic Items",
    route: "item",
    items: items,
    search: req.query.search || "",
  });
});

app.get("/item/:slug", (req, res) => {
  const slug = req.params.slug;
  const item = core.items.find((item) => item.slug === slug);
	if (req.accepts('text/html')) {
		res.render('item', item);
	} else if (req.accepts('application/json')) {
		res.json(item);
	} else if (req.accepts('text/markdown')) {
		res.set('Content-Type', 'text/markdown');
		res.render('item-md', item);
	}
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
