const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const pkg = require('../../package.json');

module.exports = class {
  async data() {
    const cssDir = path.join(__dirname, '..', '_includes', 'css');
    const rawFilepath = path.join(cssDir, '_page.css');

    return {
      eleventyExcludeFromCollections: true,
      permalink: `css/page_${pkg.version}.css`,
      rawFilepath,
      rawCss: fs.readFileSync(rawFilepath),
    };
  }

  async render({ rawCss, rawFilepath }) {
    return await postcss([
      require('postcss-import'),
      require('autoprefixer'),
      require('tailwindcss'),
      require('cssnano')
    ])
      .process(rawCss, { from: rawFilepath })
      .then((result) => result.css);
  }
};