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
  const menuLinks = (await getMenuLinks()).map((ml) => ({
    ...ml,
    ...maybeSlugify(ml),
    children: ml.children?.map(maybeSlugify).map(({ slug, title }) => ({
      title,
      url: (ml.parentSlug ?? "") + slug,
    })),
  }));

  const contentful = {
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
 * These pages do not have a file already in the code base and will be generated using a template.
 *
 * @param {{title: string, slug?: string}} menuLink
 */
function maybeSlugify(menuLink) {
  return {
    title: menuLink.title,
    slug: !(menuLink.parentSlug || menuLink.slug)
      ? `/${slugify(menuLink.title)}`
      : menuLink.slug,
  };
}

/**
 *
 * @returns {Promise<{title: string, slug?: string, parentSlug?: string, children: [{title: string, slug?: string}]}[]>}
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
