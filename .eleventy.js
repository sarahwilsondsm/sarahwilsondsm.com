require("dotenv").config();
const marked = require("marked");
const contentful = require("contentful");
const { documentToHtmlString } = require("@contentful/rich-text-html-renderer");

const fs = require("fs");
const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItEmoji = require("markdown-it-emoji");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const { EleventyRenderPlugin } = require("@11ty/eleventy");

const client = contentful.createClient({
  space: process.env.CTFL_SPACE,
  accessToken: process.env.CTFL_ACCESSTOKEN,
});

const removeTrailingSlash = (url) => {
  if (typeof url !== "string") {
    throw new Error(
      `${
        removeTrailingSlash.name
      }: expected argument of type string but instead got ${url} (${typeof url})`
    );
  }
  return url.replace(/\/$/, "");
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.addFilter("removeTrailingSlash", removeTrailingSlash);

  eleventyConfig.addWatchTarget("./src/_includes/css/");

  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
      breaks: true,
      linkify: true,
    })
      .use(markdownItAttrs)
      .use(markdownItEmoji)
  );

  eleventyConfig.addPassthroughCopy({ "./src/static/": "/" });
  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/cdn.min.js": "/js/alpine.js",
  });

  eleventyConfig.setBrowserSyncConfig({
    middleware: [
      function (req, res, next) {
        if (/^[^.]+$/.test(req.url)) {
          res.setHeader("Content-Type", "text/html; charset=utf-8");
        }
        next();
      },
    ],
    callbacks: {
      ready: function (_, bs) {
        bs.addMiddleware("*", (_, res) => {
          const content_404 = fs.readFileSync("public/404/index.html");
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }
    return content;
  });

  return {
    dir: {
      input: "src",
      output: "public",
      data: "./_data",
      includes: "./_includes",
      layouts: "./_layouts",
    },
    templateFormats: ["md", "njk", "11ty.js"],
    htmlTemplateEngine: "njk",
  };
};
