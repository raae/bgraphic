#!/usr/bin/env node

/*
Metalsmith build file
Build site with `node ./build.js` or `npm start`
Build production site with `npm run production`
*/

'use strict';

require('dotenv').config();

const
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
  fileMetadata = require('metalsmith-filemetadata'),
  remote = require('metalsmith-remote-json-to-files'),
  collections = require('metalsmith-collections'),
  // branch = require('metalsmith-branch'),
  paths = require('metalsmith-paths'),
  permalinks = require('metalsmith-permalinks'),
  layouts = require('metalsmith-layouts'),
  moment = require('moment'),
  sitemap = require('metalsmith-mapsite'),
  rssfeed = require('metalsmith-feed'),
  assets = require('metalsmith-assets'),
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

const ms = metalsmith(dir.base)
  .clean(true) // clean folder before a production build
    .use((files, metalsmith, done) => {
    // hack to make sure collections are not doubled when using browsersync
    metalsmith._metadata.articles = [];
    metalsmith._metadata.projects = [];
    metalsmith._metadata.feed = [];
    done();
  })
  .source(dir.source + 'html/') // source folder (src/html/)
  .destination(dir.dest) // build folder (build/)
  .metadata(meta) // add meta data to every page
  .use(remote({
    url: 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + process.env.IG_ACCESS_TOKEN,
    "transformOpts": function(json) {
      return json.data.reduce((prev, item) => {
        const include = item.tags.filter(item => { return 'devblog' === item.toLowerCase() }).length > 0;
        if(!include) return prev;

        const filename = `feed/ig-${ item.id }.md`;
        const caption = item.caption.text.replace('#devblog', '');
        const date = new Date(parseInt(item.created_time) * 1000).toISOString();
        return Object.assign(prev, {
          [filename]: {
            title: caption,
            publish: date,
            feed_type:  'instagram',
            images: item.images,
            contents: ''
          }
        })
    }, {})
    }
  }))
  .use(publish({
    draft: devBuild,
    private: devBuild
  }))
  .use(paths({
    property: "paths"
  }))
  .use((files, metalsmith, done) => {
    Object.keys(files).forEach(file => {
      files[file].basename = files[file].paths.name;
    });
    done();
  })
  .use(markdown()) // convert markdown
  .use(excerpts())
  .use(wordcount({
    raw: true
  })) // word count
  .use(collections({
    articles: {
      pattern: 'articles/*',
      sortBy: 'publish',
      reverse: true
    },
    projects: {
      pattern: 'projects/*',
      sortBy: 'year',
      reverse: true
    },
    feed: {
      pattern: 'feed/*',
      sortBy: 'publish',
      reverse: true
    }
  })) // create collections
  .use(permalinks({
    linksets: [
      {
        match: { collection: 'articles' },
        pattern: 'blog/:basename'
      },
      {
        match: { collection: 'projects' },
        pattern: 'project/:basename'
      }
    ]
  }))
  .use(fileMetadata([
    { 
      pattern: "projects/*", 
      metadata: {
        "layout": "project.pug"
      }
    }
  ]))
  .use(layouts({
    engine: 'pug',
    moment: moment,
    directory: 'src/layouts',
    pretty: true,
    default: 'article.pug'
  }))
  .use(sitemap({ 
    hostname: meta.site.domain + (meta.site.rootpath || ''),
    omitIndex: true
  }))
  .use(rssfeed({ 
    collection: 'articles',
    site_url: meta.site.domain,
    title: meta.site.title,
    description: meta.site.description
  }))
  .use(assets({ 
    source: dir.source + 'assets/',
    destination: './assets/'
  }))
  .use(assets({ 
    source: dir.source + 'redirects/',
    destination: './'
  }));

  if (browsersync) {
    ms.use(browsersync({
      server: dir.dest,
      files: [dir.source + '**/*']
    }));
  }

  ms.build(function(err) { // build
    if (err) throw err;
  });