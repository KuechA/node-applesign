'use strict';

const tools = require('./tools');
const ApplesignSession = require('./session');


function getResignedFilename (path) {
  if (!path) return null;
  const newPath = path.replace('.ipa', '-resigned.ipa');
  const pos = newPath.lastIndexOf('/');
  if (pos !== -1) return newPath.substring(pos + 1);
  return newPath;
}

module.exports = class Applesign {
  constructor (options) {
    this.config = this.withConfig(options);
  }

  withConfig (opt) {
    if (typeof opt !== 'object') {
      opt = {};
    }
    return {
      file: undefined, // opt.file || undefined,
      outdir: undefined, // opt.file ? (opt.outdir || opt.file + '.d') : undefined,
      outfile: undefined, // opt.file ? (opt.outfile || getResignedFilename(opt.file || undefined)) : undefined,
      entitlement: opt.entitlement || undefined,
      bundleid: opt.bundleid || undefined,
      identity: opt.identity || undefined,
      replaceipa: opt.replaceipa || false,
      mobileprovision: opt.mobileprovision || undefined
    };
  }

  signIPA (file, cb) {
    const s = new ApplesignSession(this.config);
    if (typeof cb === 'function') {
      s.setFile(file);
    } else {
      cb = file;
    }
    return s.signIPA(cb);
  }

  signXCarchive (file, cb) {
    const self = this;
    const ipaFile = file + '.ipa';
    tools.xcaToIpa(file, (error) => {
      if (error) {
        return self.emit('error', error);
      }
      self.signIPA(ipaFile, cb);
    });
  }

  getIdentities (cb) {
    tools.getIdentities(cb);
  }
};
