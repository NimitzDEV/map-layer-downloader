let tasks = [];
let retry = [];
let total = 0;

const axios = require('axios');
const fs = require('fs');
const logger = require('./logger');
const path = require('path');

class MapDownloader {
  constructor({ config, resumePosition, filename }) {
    this.config = Object.assign({}, config);
    this.resume = resumePosition;
    this.gInstant = null;
    this.tasks = [];
    this.retry = [];
    this.info = {
      total: 0,
      filename,
    };
    this._init();
  }

  start(worker) {
    let exec = [];
    for (let i = 0; i < worker; i++) exec.push(this._downloader(i));
    return Promise.all(exec);
  }

  // calcaulates total download count
  _init() {
    this.info.total = Array(
      this.config.downloadEnd - this.config.downloadStart + 1
    )
      .fill(0)
      .reduce((sum, v, index) => sum + Math.pow(4, index), 0);

    this.gInstant = this._taskGenerator(this.resume);
  }

  // replace url to download path
  _urlReplacer({ pos, url }) {
    return Object.keys(pos).reduce(
      (str, k) => str.replace(`{${k}}`, pos[k]),
      url
    );
  }

  // get a download url randomly from the list
  _getNode() {
    if (this.config.url.length === 1) return this.config.url;
    return this.config.url[Math.floor(Math.random() * this.config.url.length)];
  }

  // xyz generator
  *_taskGenerator(resumePosition) {
    let p = 0;
    for (
      let z = resumePosition.z || this.config.downloadStart;
      z <= this.config.downloadEnd;
      z++
    ) {
      if (!z) {
        yield { pos: { z: 0, y: 0, x: 0 }, count: ++p };
        continue;
      }
      let count = Math.pow(2, z);
      for (let x = resumePosition.x || 0; x < count; x++) {
        resumePosition.x = 0;
        for (let y = resumePosition.y || 0; y < count; y++) {
          resumePosition.y = 0;
          // retry task first
          while (retry.length) {
            yield retry.pop();
          }
          yield {
            pos: { z, x, y },
            count: ++p,
          };
        }
      }
    }
  }

  // downloader
  _downloader(wkid) {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      for (let task of this.gInstant) {
        // retry count
        (task.retry > -1 && ++task.retry) || ++count;

        let url = this._urlReplacer({ pos: task.pos, url: this._getNode() });

        // log info
        logger.info(
          '[%s]\t %d/%d/%d \t DOWNLOAD \t %s',
          this.info.filename,
          task.pos.z,
          task.pos.x,
          task.pos.y,
          url
        );

        // download picture
        let stream = await axios({
          url,
          method: 'get',
          params: this.config.query || {},
          responseType: 'stream',
          timeout: this.config.timeout || 50000,
          proxy: this.config.proxy || false,
        })
          .then(res => {
            res.data &&
              res.data.pipe(
                fs.createWriteStream(
                  this._dirMaker({
                    pos: task.pos,
                    ext: res.headers['content-type'].split('/')[1],
                  })
                )
              );
          })
          .catch(e => {
            logger.error('Download Error: %s URL %s', e.message, url);
            // put the failed one into retry list
            if (!task.retry) task.retry = -1;
            if (task.retry <= this.config.retry || 10) retry.push(task);
          });
      }
      resolve(count);
    });
  }

  _dirMaker({ pos, ext }) {
    let sep = path.sep;
    let base = path.resolve(this.config.dir).split(sep);
    base.push(pos.z, pos.x);
    return (
      base.reduce((result, seg) => {
        result += seg + sep;
        fs.existsSync(result) || fs.mkdirSync(result);
        return result;
      }, '') + `${pos.y}.${ext}`
    );
  }
}

module.exports = MapDownloader;
