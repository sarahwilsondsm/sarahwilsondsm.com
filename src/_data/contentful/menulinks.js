const { AssetCache } = require("@11ty/eleventy-fetch");
const contentful = require("contentful");
const client = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN,
});

module.exports = async function () {
  try {
    const asset = new AssetCache("contentful_menulinks");

    if (asset.isCacheValid("1d")) {
      return asset.getCachedValue();
    }

    const response = await client.getEntries({
      content_type: "menu",
    });
    const menulinks = response.items.find(
      (menu) => menu.fields.title === "Navigation"
    ).fields.links;

    await asset.save(menulinks, "json");

    return menulinks;
  } catch (e) {
    console.error("Error trying to retrieve contentful menulinks", e);
  }
};
