#!/usr/bin/env node

/*
Metalsmith build file
Build site with `node ./build.js` or `npm start`
Build production site with `npm run production`
*/

'use strict';

var
// defaults
  consoleLog = false, // set true for metalsmith file and meta content logging
  devBuild = ((process.env.NODE_ENV || '').trim().toLowerCase() !== 'production'),
  pkg = require('./package.json'),

  // main directories
  dir = {
    base: __dirname + '/',
    lib: __dirname + '/lib/',
    source: './src/',
    dest: './build/'
  },

  // modules
  metalsmith = require('metalsmith'),
  markdown = require('metalsmith-markdown'),
  excerpts = require('metalsmith-excerpts'),
  publish = require('metalsmith-publish'),
  wordcount = require("metalsmith-word-count"),
  collections = require('metalsmith-collections'),
  branch = require('metalsmith-branch'),
  paths = require('metalsmith-paths'),
  permalinks = require('metalsmith-permalinks'),
  layouts = require('metalsmith-layouts'),
  moment = require('moment'),
  sitemap = require('metalsmith-mapsite'),
  rssfeed = require('metalsmith-feed'),
  assets = require('metalsmith-assets'),
  htmlmin = devBuild ? null : require('metalsmith-html-minifier'),
  browsersync = devBuild ? require('metalsmith-browser-sync') : null,

  meta = {
    env: {
      devBuild: devBuild,
      version: pkg.version
    },
    site: {
      title: 'bGraphic.no',
      domain: devBuild ? 'http://127.0.0.1' : 'https://bgraphic.netlify.com', // set domain
      description: "Benedicte Raae's dev blog.",
      social: [
        { label: 'GitHub', url: 'https://github.com/raae' },
        { label: 'Twitter', url: 'https://twitter.com/raae' },
        { label: 'LinkedIn', url: 'https://no.linkedin.com/in/benedicteraae' },
        { label: 'Instagram', url: 'https://instagram.com/benedicteraae' },
      ]
    },
  }

console.log((devBuild ? 'Development' : 'Production'), 'build, version', pkg.version);

var ms = metalsmith(dir.base)
  .clean(true) // clean folder before a production build
  .source(dir.source + 'html/') // source folder (src/html/)
  .destination(dir.dest) // build folder (build/)
  .metadata(meta) // add meta data to every page
  .use(paths({
    property: "paths"
  }))
  .use((files, metalsmith, done) => {
    Object.keys(files).forEach(file => {
      files[file].basename = files[file].paths.name;
    });
    done();
  })
  .use(publish({
    draft: devBuild,
    private: devBuild
  })) // draft, private, future-dated
  .use((files, metalsmith, done) => {
    // hack to make sure collections are not doubled when using browsersync
    metalsmith._metadata.articles = [];
    metalsmith._metadata.projects = [];
    done();
  })
  .use(markdown()) // convert markdown
  .use(excerpts())
  .use(wordcount({
    raw: true
  })) // word count
  .use(collections({
    articles: {
      pattern: 'articles/**.html',
      sortBy: 'date',
      reverse: true
    },
    projects: {
      pattern: 'projects/**.html',
      sortBy: 'year',
      reverse: true
    }
  }))
  .use(permalinks({
    linksets: [
      {
        match: { collection: 'articles' },
        pattern: 'blog/:basename'
      },
      {
        match: { collection: 'projects' },
      }
    ]
  }))
  .use(layouts({
    engine: 'pug',
    moment: moment,
    directory: 'src/layouts',
    pretty: true,
    default: 'article.pug'
  })) // layout templating

if (htmlmin) ms.use(htmlmin()); // minify production HTML

if (browsersync) ms.use(browsersync({ // start test server
  server: dir.dest,
  files: [dir.source + '**/*']
}));

ms
  .use(sitemap({ // generate sitemap.xml
    hostname: meta.site.domain + (meta.site.rootpath || ''),
    omitIndex: true
  }))
  .use(rssfeed({ // generate RSS feed for articles
    collection: 'articles',
    site_url: meta.site.domain,
    title: meta.site.title,
    description: meta.site.description
  }))
  .use(assets({ // copy assets: CSS, images etc.
    source: dir.source + 'assets/',
    destination: './'
  }))
  .build(function(err) { // build
    if (err) throw err;
  });