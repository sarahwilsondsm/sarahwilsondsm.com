const { AssetCache } = require("@11ty/eleventy-fetch");
const contentful = require("contentful");
const client = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN,
});

module.exports = async function () {
  try {
    const asset = new AssetCache("contentful_pages");

    // if (asset.isCacheValid("1d")) {
    //   return asset.getCachedValue();
    // }

    const response = await client.getEntries({
      content_type: "page",
      order: "sys.createdAt",
    });
    const pages = response.items.map(function (page) {
      page.fields.date = new Date(page.sys.updatedAt);
      return page.fields;
    });
    await asset.save(pages, "json");

    return pages;
  } catch (e) {
    console.error("Error trying to retrieve contentful pages", e);
  }
};
