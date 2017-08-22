import * as path from "path";
import { Plugin } from "webpack";

// disable tslint rule, because we don't have types for these files
/* tslint:disable:no-require-imports */
const ConcatSource = require("webpack-sources").ConcatSource;

// Tiny tiny helper plugin that prepends "module.exports = " to all `.map` assets
export class ScreepsSourceMapToJson implements Plugin {
  // constructor(_options: any) {
  //   // we don't use options
  // }

  public apply(compiler: any) {
    compiler.plugin("emit", (compilation: any, cb: any) => {
      for (const filename in compilation.assets) {
        // matches any files ending in ".map" or ".map.js"
        if (path.basename(filename, ".js").match(/\.map/)) {
          compilation.assets[filename] = new ConcatSource("module.exports = ", compilation.assets[filename]);
        }
      }
      cb();
    });
  }
}
