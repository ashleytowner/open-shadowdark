const path = require("path");
const fs = require("fs").promises;

/**
 * Find all manifest files in the directory & sub directories
 * @param {string} dir the top directory to start at
 * @returns {Promise<Manifest[]>}
 */
async function findManifestFiles(dir) {
  const manifests = [];

  async function walk(currentDir) {
    try {
      const files = await fs.readdir(currentDir);

      for (const file of files) {
        const fullPath = path.join(currentDir, file);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          await walk(fullPath);
        } else if (file === "manifest.json") {
          const content = await fs.readFile(fullPath, { encoding: "utf8" });
          const data = JSON.parse(content);
          for (const dataPath in data.data) {
            data.data[dataPath] = path.join(
              fullPath,
              `../${data.data[dataPath]}`,
            );
          }
          manifests.push(data);
        }
      }
    } catch (e) {
      console.error(`Error reading directory: ${currentDir}`, e);
    }
  }

  await walk(dir);
  return manifests;
}

/**
 * @param {string} dir the top level data directory
 */
async function loadData(dir) {
  const manifests = await findManifestFiles(dir);
	const sources = manifests.map(manifest => ({ name: manifest.source, slug: manifest.slug }));
  /**
   * Get a manifest file from the source slug
   * @param {string} source the source slug
   */
  const getManifest = (source) => {
    const matchingManifest = manifests.find(
      (manifest) => manifest.slug === source,
    );
    if (!matchingManifest) {
      console.error(`There was no source matching ${source}`);
      return undefined;
    }
    return matchingManifest;
  };
  /**
   * Get a list of a certain type from a certain source
   * @param {string} source the source it comes from
   * @param {string} type the type of object it is
   */
  const getDataList = async (source, type) => {
    const matchingManifest = getManifest(source);
    const filePath = matchingManifest.data[type];
    if (!filePath) {
      console.error(`There was no type matching ${type}`);
      return undefined;
    }
    const contents = await fs.readFile(filePath, { encoding: "utf8" });
    const items = JSON.parse(contents);
    return { items, manifest: matchingManifest };
  };
  /**
   * Get data from its slug
   * @param {string} source the source it comes from
   * @param {string} type the type of object it is
   * @param {string} slug the slug for the object
   */
  const getDataItem = async (source, type, slug) => {
    const { items, manifest } = await getDataList(source, type);
    const item = items.find((item) => item.slug === slug);
    if (!item) {
      console.error(`There was no item matching ${slug}`);
      return undefined;
    }
    return { ...item, manifest };
  };
  return { getManifest, getDataList, getDataItem, sources };
}

module.exports = loadData;
