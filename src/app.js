const express = require("express");
const app = express();
const path = require("path");
const loadData = require("./manage_data.js");

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "../public")));

/**
	* Convert string to title case
	* @param {string} str
	* @returns {string}
	*/
function titleCase(str) {
	const words = str.split(' ');
	return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

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
		if (!manifest) {
			return res.sendStatus(404);
		}
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
		const dataList = await getDataList(req.params.source, req.params.type);
		if (!dataList) {
			return res.sendStatus(404);
		}
		let { items, manifest } = dataList;
		if (!manifest) {
			return res.sendStatus(404);
		}
		if (req.query.search) {
			items = items.filter((item) => {
				return (
					item.name.toLowerCase().indexOf(req.query.search.toLowerCase()) !== -1
				);
			});
		}
		res.render("list", {
			title: `${titleCase(req.params.type)}s - ${manifest.source}`,
			route: req.params.type,
			items: items,
			manifest,
			search: req.query.search || "",
			searchEnabled: true,
		});
	});

	app.get("/:source/:type/:slug", async (req, res) => {
		const dataItem = await getDataItem(
			req.params.source,
			req.params.type,
			req.params.slug,
		);
		if (!dataItem) {
			return res.sendStatus(404);
		}
		const { item, manifest } = dataItem;
		if (!manifest) {
			return res.sendStatus(404);
		}
		if (req.accepts("text/html")) {
			res.render(req.params.type, { title: item.name, ...item, manifest });
		} else if (req.accepts("text/markdown")) {
			res.set("Content-Type", "text/markdown");
			res.render(`${req.params.type}-md`, { ...item, manifest });
		}
	});

	app.listen(3000, async () => {
		console.log("listening on port 3000");
	});
})();
