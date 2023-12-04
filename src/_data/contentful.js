const { AssetCache } = require("@11ty/eleventy-fetch");
const slugify = require("@sindresorhus/slugify");
const contentful = require("contentful");
const client = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN,
});

/**
 * @typedef {{title: string, slug: string, date: Date, [x:string]:any}} Page
 */

module.exports = async function () {
  const asset = new AssetCache("contentful");

  if (asset.isCacheValid("1d")) {
    return asset.getCachedValue();
  }

  const pages = await getPages();
  const menuLinks = [{ title: "Home", slug: "/" }].concat(
    (await getMenuLinks()).map((link) => ({
      title: link,
      slug: slugify(link),
    }))
  );

  const menuSlugs = menuLinks.map((_) => _.slug);
  const menuTitles = menuLinks.map((_) => _.title);

  const contentful = {
    extraPages: Object.values(pages).filter(
      ({ slug, title }) =>
        !menuTitles.includes(title) && !menuSlugs.includes(slugify(slug))
    ),
    menuLinks,
    pages,
  };

  await asset.save(contentful, "json");
  return contentful;
};

/**
 *
 * @returns {Promise<{[x: string]: Page>}}
 */
async function getPages() {
  try {
    const response = await client.getEntries({
      content_type: "page",
      order: "sys.createdAt",
    });
    const pages = response.items.reduce(function (acc, page) {
      acc[slugify(page.fields.slug)] = {
        ...page.fields,
        date: new Date(page.sys.updatedAt),
      };
      return acc;
    }, {});

    return pages;
  } catch (e) {
    console.error("Error trying to retrieve contentful pages", e);
  }
}

/**
 *
 * @returns {Promise<string[]>}
 */
async function getMenuLinks() {
  try {
    const response = await client.getEntries({
      content_type: "menu",
    });
    const menulinks = response.items.find(
      (menu) => menu.fields.title === "Navigation"
    ).fields.links;

    return menulinks;
  } catch (e) {
    console.error("Error trying to retrieve contentful menuLinks", e);
  }
}
