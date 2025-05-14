const express = require("express");
const app = express();
const path = require("path");
const loadData = require("./manage_data.js");

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));

(async () => {
  const { getManifest, getDataItem, getDataList, sources } = await loadData(
    path.join(__dirname, "../data"),
  );

  app.get("/", (req, res) => {
    res.render("list", {
      title: "Sources",
      route: "",
      items: sources,
      search: "",
    });
  });

  app.get("/:source", async (req, res) => {
    const manifest = getManifest(req.params.source);
    res.render("list", {
      title: manifest.source,
      route: req.params.source,
      items: Object.keys(manifest.data).map((key) => ({
        name: key,
        slug: key,
      })),
      manifest,
      search: "",
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
      searchEnabled: true,
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
    } else if (req.accepts("text/markdown")) {
      res.set("Content-Type", "text/markdown");
      res.render(`${req.params.type}-md`, monster);
    }
  });

  app.listen(3000, async () => {
    console.log("listening on port 3000");
  });
})();
