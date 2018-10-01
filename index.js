#!/usr/bin/env node
const program = require('commander');
const axios = require('axios');
const opn = require('opn');
require('colors');

const BASE_URL = process.env.SHORTEN_BASE_URL || 'https://short.msroed.app';

program
  .version('1.0.0')
  .command('open <slug>')
  .description('Open slug')
  .usage('open foo-bar')
  .action(slug => {
    if (slug) {
      opn(`${BASE_URL}/v1/${slug}`);
      // Without this the shell just hangs.
      // Have tried waiting for the promise, but it never resolves.
      process.exit(1);
    } else {
      console.log(
        'You need to pass in a slug. Example: $ shorten open foo-bar'.yellow
      );
    }
  });

program
  .command('create <url>')
  .description('Create a short url.')
  .option('-s, --slug <slug>', 'Add a slug')
  .action(async (url, options) => {
    const { slug } = options;
    return axios
      .post(`${BASE_URL}/v1/shorten`, {
        url,
        slug,
      })
      .then(result => {
        if (result.status === 200) {
          console.log();
          console.log('Shortened url');
          console.log('================');
          console.log(`${result.data.shortenedUrl}`.green.bold);
        } else {
          console.error(response.data);
        }
      })
      .catch(err => {
        if ((err.response.status / 100) >> 0 === 4) {
          console.log(err.response.data.message.red.bold);
        } else {
          console.error(err);
        }
      });
  });

program.parse(process.argv);
