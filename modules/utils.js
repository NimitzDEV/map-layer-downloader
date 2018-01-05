const fs = require('fs');
const path = require('path');

const canBeResume = mapdir => fs.existsSync(path.resolve(mapdir));

const checkResumePosition = mapdir => {
  let scan = path.resolve(mapdir);
  // [z, x, y]
  let position = [0, 0, 0];
  let stop = false;
  for (let i = 0; i < position.length; i++) {
    if (stop) continue;
    let files = fs.readdirSync(scan);
    if (!files.length) {
      stop = true;
      continue;
    }

    let max = Math.max.apply(null, files.map(file => parseInt(file)));
    position[i] = max;
    scan = path.join(scan, max.toString());
  }

  return { x: position[1], y: position[2], z: position[0] };
};

module.exports = { canBeResume, checkResumePosition };
