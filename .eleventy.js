require("dotenv").config();
const { BLOCKS } = require("@contentful/rich-text-types");
const { documentToHtmlString } = require("@contentful/rich-text-html-renderer");

const fs = require("fs");
const htmlmin = require("html-minifier");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItEmoji = require("markdown-it-emoji");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const { EleventyRenderPlugin } = require("@11ty/eleventy");

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

function imageProcessing(photo) {
  return `<img
          srcset="https:${photo.fields.file.url}?w=480&fm=webp&q=80&fit=fill&f=faces 480w,
          https:${photo.fields.file.url}?w=800&fm=webp&q=80&fit=fill&f=faces 800w" sizes="(max-width: 600px) 480px,800px"
          src="https:${photo.fields.file.url}?w=480&fit=fill&f=faces"
          alt="${photo.fields.title}" loading="lazy">`;
}

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

  const contentfulOptions = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node, next) =>
        `<p class="mb-6">${next(node.content)}</p>`,
    },
  };

  eleventyConfig.addShortcode("imageProcessing", imageProcessing);
  eleventyConfig.addShortcode("documentToHtmlString", (doc) =>
    documentToHtmlString(doc, contentfulOptions)
  );

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
