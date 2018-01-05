const cmd = require('inquirer');
const prompt = cmd.createPromptModule();

const downloader = require('./modules/downloader');
const logger = require('./modules/logger');
const utils = require('./modules/utils');
const fs = require('fs');
const path = require('path');

const downloadOptions = fs
  .readdirSync(path.resolve('./downloads'))
  .filter(file => /\.json$/.test(file))
  .map(file => file.replace(/\.json$/, ''));
(async () => {
  let config = await prompt([
    {
      type: 'list',
      name: 'DOWNLOAD',
      message: 'Which map you want to download',
      default: downloadOptions[0] || false,
      choices: downloadOptions,
    },
    {
      type: 'input',
      name: 'REQUESTS',
      message: 'Download concurrency',
      default: 32,
    },
  ]);

  let maps = require(path.resolve('./downloads', config.DOWNLOAD));

  // detect download dir is exist,
  // if dir existed, ask user if they want to resume previous download
  let canBeResume = utils.canBeResume(maps.dir);

  let resumePosition = { x: 0, y: 0, z: 0 };

  if (canBeResume) {
    let resumeAnswer = await prompt([
      {
        type: 'list',
        name: 'RESUME',
        message: 'Resume previous download position?',
        default: 'YES',
        choices: ['YES', 'NO'],
      },
    ]);

    // get resume position
    if (resumeAnswer.RESUME === 'YES') {
      resumePosition = utils.checkResumePosition(maps.dir);
    }
  }

  logger.info('Download：%s Concurrency：%d', config.DOWNLOAD, config.REQUESTS);

  // init downloader
  const dwn = new downloader({
    config: maps,
    resumePosition,
    filename: config.DOWNLOAD,
  });

  dwn.start(config.REQUESTS).then(info => {
    console.log('---------Download finish---------');
    info.forEach((c, i) =>
      console.log('Worker', i, 'downloaded total', c, 'task(s)')
    );
  });
})();
