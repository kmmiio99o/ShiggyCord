// @ts-nocheck
/* eslint-disable no-restricted-syntax */
import { readFile } from "fs/promises";
import { execSync } from "child_process";
import crypto from "crypto";
import { build } from "esbuild";
import globalPlugin from "esbuild-plugin-globals";
import path from "path";
import { fileURLToPath } from "url";
import yargs from "yargs-parser";

import { printBuildSuccess } from "./util.mjs";

// Prefer the native @swc/core for speed; fall back to @swc/wasm on
// platforms without a native binding (e.g. Termux / android-arm64).
let swcCore = null;
try {
  swcCore = (await import("@swc/core")).default;
} catch {
  swcCore = null;
}
const swcWasm = swcCore ? null : (await import("@swc/wasm")).default;

const depsModulePath = path.resolve("./shims/depsModule.ts");

/** @type string[] */
const metroDeps = await (async () => {
  const ast = swcCore
    ? await swcCore.parseFile(depsModulePath)
    : swcWasm.parseSync(await readFile(depsModulePath, "utf8"), {
        syntax: "typescript",
      });
  return ast.body.at(-1).expression.right.properties.map((p) => p.key.value);
})();

/**
 * Transform a file with SWC, using native bindings when available
 * and WASM otherwise. Keeps parser selection identical for both.
 */
async function transformWithSwc(filePath) {
  const isTs = /\.[cm]?tsx?$/.test(filePath);
  const isTsx = filePath.endsWith(".tsx");
  const isJsx = /\.[cm]?jsx$/.test(filePath);
  const options = {
    filename: filePath,
    jsc: {
      parser: isTs
        ? { syntax: "typescript", tsx: isTsx }
        : { syntax: "ecmascript", jsx: isJsx || filePath.endsWith(".js") },
      externalHelpers: true,
      transform: {
        constModules: {
          globals: {
            "bunny-build-info": {
              version: `"1.4.1.8"`,
            },
          },
        },
        react: {
          runtime: "automatic",
        },
      },
    },
    // https://github.com/facebook/hermes/blob/3815fec63d1a6667ca3195160d6e12fee6a0d8d5/doc/Features.md
    // https://github.com/facebook/hermes/issues/696#issuecomment-1396235791
    env: {
      targets: "fully supports es6",
      include: [
        "transform-block-scoping",
        "transform-classes",
        "transform-async-to-generator",
        "transform-async-generator-functions",
      ],
      exclude: [
        "transform-parameters",
        "transform-template-literals",
        "transform-exponentiation-operator",
        "transform-named-capturing-groups-regex",
        "transform-nullish-coalescing-operator",
        "transform-object-rest-spread",
        "transform-optional-chaining",
        "transform-logical-assignment-operators",
      ],
    },
  };

  if (swcCore) return swcCore.transformFile(filePath, options);
  return swcWasm.transformSync(await readFile(filePath, "utf8"), options);
}

const args = yargs(process.argv.slice(2));
const {
  "release-branch": releaseBranch,
  "build-minify": buildMinify,
  dev: dev,
} = args;

let context = null;

/** @type {import("esbuild").BuildOptions} */
const config = {
  entryPoints: ["src/entry.ts"],
  bundle: true,
  outfile: "dist/shiggycord.js",
  format: "iife",
  splitting: false,
  // Enable minification by default for release builds (when a release-branch is provided).
  // This keeps development builds unminified for easier debugging.
  minify: true,
  external: [],
  supported: {
    // Hermes does not actually support const and let, even though it syntactically
    // accepts it, but it's treated just like 'var' and causes issues
    "const-and-let": false,
  },
  loader: {
    ".png": "dataurl",
    ".html": "text",
  },
  define: {
    window: "globalThis",
    __DEV__: JSON.stringify(releaseBranch !== "main"),
  },
  inject: ["./shims/asyncIteratorSymbol.js", "./shims/promiseAllSettled.js", "./shims/weakref.js"],
  legalComments: "none",
  alias: {
    "!ShiggyCord-deps-shim!": "./shims/depsModule.ts",
    spitroast: "./node_modules/spitroast",
    "react/jsx-runtime": "./shims/jsxRuntime",
    "@gullerya/object-observer":
      path.resolve("./node_modules/@gullerya/object-observer/dist/object-observer.min.js"),
  },
  plugins: [
    globalPlugin({
      ...metroDeps.reduce((obj, key) => {
        obj[key] = `require("!ShiggyCord-deps-shim!")[${JSON.stringify(key)}]`;
        return obj;
      }, {}),
    }),
    {
      name: "swc",
      setup(build) {
        build.onLoad({ filter: /\.[cm]?[jt]sx?$/ }, async (args) => {
          const result = await transformWithSwc(args.path);

          return { contents: result.code };
        });
      },
    },
  ],
};

export async function buildBundle(overrideConfig = {}) {
  context = {
    hash: releaseBranch
      ? execSync("git rev-parse --short HEAD").toString().trim()
      : crypto.randomBytes(8).toString("hex").slice(0, 7),
  };

  const initialStartTime = performance.now();
  await build({ ...config, ...overrideConfig });

  return {
    config,
    context,
    timeTook: performance.now() - initialStartTime,
  };
}

const pathToThisFile = path.resolve(fileURLToPath(import.meta.url));
const pathPassedToNode = path.resolve(process.argv[1]);
const isThisFileBeingRunViaCLI = pathToThisFile.includes(pathPassedToNode);

if (isThisFileBeingRunViaCLI) {
  const { timeTook } = await buildBundle();

  printBuildSuccess(context.hash, releaseBranch, timeTook);

  const { timeTook: minifiedTimeTook } = await buildBundle({
    minify: true,
    outfile: config.outfile.replace(/\.js$/, ".min.js"),
  });

  printBuildSuccess(context.hash, releaseBranch, minifiedTimeTook, true);
}
