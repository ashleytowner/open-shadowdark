const core = require("./data/core.json");
const express = require("express");
const app = express();
const path = require("path");
const loadData = require("./manage_data.js");

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));

(async () => {
  const { getDataItem, getDataList } = await loadData(
    path.join(__dirname, "../data"),
  );

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
      license: core.license,
    });
  });

  app.get("/:source/:type", async (req, res) => {
    let { items, manifest } = await getDataList(
      req.params.source,
      req.params.type,
    );
    if (req.query.search) {
      items = items.filter((monster) => {
        return (
          monster.name.toLowerCase().indexOf(req.query.search.toLowerCase()) !==
          -1
        );
      });
    }
    res.render("list", {
      title: `${manifest.source}: ${req.params.type}s`,
      route: req.params.type,
      items: items,
      manifest,
      search: req.query.search || "",
    });
  });

  app.get("/:source/:type/:slug", async (req, res) => {
    const monster = await getDataItem(
      req.params.source,
      req.params.type,
      req.params.slug,
    );
    if (req.accepts("text/html")) {
      res.render(req.params.type, monster);
    } else if (req.accepts("application/json")) {
      res.json(monster);
    } else if (req.accepts("text/markdown")) {
      res.set("Content-Type", "text/markdown");
      res.render(`${req.params.type}-md`, monster);
    }
  });

  app.listen(3000, async () => {
    console.log("listening on port 3000");
  });
})();
