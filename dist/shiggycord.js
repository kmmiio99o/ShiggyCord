"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };
  var __export = (target, all2) => {
    for (var name in all2)
      __defProp(target, name, { get: all2[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function")
      for (var keys = __getOwnPropNames(from), i2 = 0, n = keys.length, key2; i2 < n; i2++) {
        key2 = keys[i2];
        if (!__hasOwnProp.call(to, key2) && key2 !== except)
          __defProp(to, key2, { get: ((k2) => from[k2]).bind(null, key2), enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
      }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // shims/asyncIteratorSymbol.js
  var init_asyncIteratorSymbol = __esm({
    "shims/asyncIteratorSymbol.js"() {
      "use strict";
    }
  });

  // shims/promiseAllSettled.js
  var allSettledFulfill, allSettledReject, mapAllSettled, allSettled;
  var init_promiseAllSettled = __esm({
    "shims/promiseAllSettled.js"() {
      "use strict";
      allSettledFulfill = (value) => ({
        status: "fulfilled",
        value
      });
      allSettledReject = (reason) => ({
        status: "rejected",
        reason
      });
      mapAllSettled = (item) => Promise.resolve(item).then(allSettledFulfill, allSettledReject);
      allSettled = Promise.allSettled ??= (iterator) => {
        return Promise.all(Array.from(iterator).map(mapAllSettled));
      };
    }
  });

  // node_modules/@swc/helpers/esm/_class_call_check.js
  function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
  }
  var init_class_call_check = __esm({
    "node_modules/@swc/helpers/esm/_class_call_check.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_create_class.js
  function _defineProperties(target, props) {
    for (var i2 = 0; i2 < props.length; i2++) {
      var descriptor = props[i2];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  var init_create_class = __esm({
    "node_modules/@swc/helpers/esm/_create_class.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // shims/weakref.js
  function _warnOnce(msg) {
    if (!_shimWarned) {
      try {
        if (typeof console !== "undefined" && typeof console.warn === "function") {
          console.warn(`[weakref-shim] ${msg}`);
        }
      } catch (_2) {
      }
      _shimWarned = true;
    }
  }
  var _shimWarned, WeakRefFallback, FinalizationRegistryFallback, NativeWeakRef, NativeFinalizationRegistry, WeakRefImpl, FinalizationRegistryImpl;
  var init_weakref = __esm({
    "shims/weakref.js"() {
      "use strict";
      init_class_call_check();
      init_create_class();
      _shimWarned = false;
      WeakRefFallback = /* @__PURE__ */ (function() {
        "use strict";
        function WeakRefFallback2(value) {
          _class_call_check(this, WeakRefFallback2);
          this.__value = value;
          _warnOnce("WeakRef is not available in this runtime. Using a strong-reference fallback \u2014 memory usage/semantics may differ.");
        }
        _create_class(WeakRefFallback2, [
          {
            key: "deref",
            value: function deref() {
              return this.__value;
            }
          }
        ]);
        return WeakRefFallback2;
      })();
      FinalizationRegistryFallback = /* @__PURE__ */ (function() {
        "use strict";
        function FinalizationRegistryFallback2(cleanupCallback) {
          _class_call_check(this, FinalizationRegistryFallback2);
          this.__cleanupCallback = typeof cleanupCallback === "function" ? cleanupCallback : null;
          _warnOnce("FinalizationRegistry is not available in this runtime. Using a no-op fallback \u2014 finalizers will not run based on GC.");
        }
        _create_class(FinalizationRegistryFallback2, [
          {
            /**
            * register(target, heldValue, unregisterToken?)
            * - No-op in fallback. We keep no strong references here on purpose (can't emulate GC).
            */
            key: "register",
            value: function register(_target) {
            }
          },
          {
            /**
            * unregister(unregisterToken)
            * - No-op in fallback.
            */
            key: "unregister",
            value: function unregister(_unregisterToken) {
            }
          },
          {
            /**
            * cleanupSome(callback?)
            * - If provided a callback or a stored cleanup callback exists, call it immediately.
            * - This is NOT equivalent to real FinalizationRegistry cleanup; it's only a manual helper.
            */
            key: "cleanupSome",
            value: function cleanupSome(callback) {
              var cb = typeof callback === "function" ? callback : this.__cleanupCallback;
              if (typeof cb === "function") {
                try {
                  cb();
                } catch (e) {
                  try {
                    if (typeof console !== "undefined" && typeof console.error === "function") {
                      console.error("[weakref-shim] error running cleanupSome callback:", e);
                    }
                  } catch (_2) {
                  }
                }
              }
            }
          }
        ]);
        return FinalizationRegistryFallback2;
      })();
      NativeWeakRef = typeof globalThis !== "undefined" && typeof globalThis.WeakRef === "function" ? globalThis.WeakRef : void 0;
      NativeFinalizationRegistry = typeof globalThis !== "undefined" && typeof globalThis.FinalizationRegistry === "function" ? globalThis.FinalizationRegistry : void 0;
      WeakRefImpl = NativeWeakRef ?? WeakRefFallback;
      FinalizationRegistryImpl = NativeFinalizationRegistry ?? FinalizationRegistryFallback;
      try {
        if (typeof globalThis !== "undefined") {
          if (typeof globalThis.WeakRef === "undefined") {
            globalThis.WeakRef = WeakRefImpl;
          }
          if (typeof globalThis.FinalizationRegistry === "undefined") {
            globalThis.FinalizationRegistry = FinalizationRegistryImpl;
          }
        }
      } catch (e) {
        _warnOnce("Unable to assign WeakRef/FinalizationRegistry to globalThis: " + (e && e.message));
      }
    }
  });

  // node_modules/@swc/helpers/esm/_async_to_generator.js
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key2, arg) {
    try {
      var info = gen[key2](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) resolve(value);
    else Promise.resolve(value).then(_next, _throw);
  }
  function _async_to_generator(fn) {
    return function() {
      var self = this, args = arguments;
      return new Promise(function(resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(void 0);
      });
    };
  }
  var init_async_to_generator = __esm({
    "node_modules/@swc/helpers/esm/_async_to_generator.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/spitroast/dist/index.js
  var require_dist = __commonJS({
    "node_modules/spitroast/dist/index.js"(exports, module) {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export2 = (target, all2) => {
        for (var name in all2) __defProp2(target, name, {
          get: all2[name],
          enumerable: true
        });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          var _loop2 = function(key3) {
            if (!__hasOwnProp2.call(to, key3) && key3 !== except) __defProp2(to, key3, {
              get: () => from[key3],
              enumerable: !(desc = __getOwnPropDesc2(from, key3)) || desc.enumerable
            });
          };
          for (var key2 of __getOwnPropNames2(from)) _loop2(key2);
        }
        return to;
      };
      var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", {
        value: true
      }), mod);
      var src_exports = {};
      __export2(src_exports, {
        after: () => after2,
        before: () => before3,
        instead: () => instead4,
        unpatchAll: () => resetPatches
      });
      module.exports = __toCommonJS2(src_exports);
      var patchTypes = [
        "a",
        "b",
        "i"
      ];
      var patchedFunctions;
      var resetPatches = () => patchedFunctions = /* @__PURE__ */ new WeakMap();
      resetPatches();
      function hook_default(patchedFunc, origFunc, funcArgs, ctxt) {
        var patch = patchedFunctions.get(patchedFunc);
        if (!patch) return origFunc(...funcArgs);
        for (var hook of patch.b.values()) {
          var maybefuncArgs = hook.call(ctxt, funcArgs);
          if (Array.isArray(maybefuncArgs)) funcArgs = maybefuncArgs;
        }
        var workingRetVal = [
          ...patch.i.values()
        ].reduce((prev, current) => (...args) => current.call(ctxt, args, prev), origFunc)(...funcArgs);
        for (var hook1 of patch.a.values()) workingRetVal = hook1.call(ctxt, funcArgs, workingRetVal) ?? workingRetVal;
        for (var cleanup2 of patch.c) cleanup2();
        patch.c = [];
        return workingRetVal;
      }
      function unpatch2(patchRef, hookId, type) {
        var patch = patchRef.deref();
        if (!patch || !patch[type].delete(hookId)) return false;
        var funcParent = patch.p.deref();
        if (funcParent && patchTypes.every((t) => patch[t].size === 0)) {
          var funcName = patch.n;
          patchedFunctions.delete(funcParent[funcName]);
          if (!Reflect.defineProperty(funcParent, funcName, {
            value: patch.o,
            writable: true,
            configurable: true
          })) funcParent[funcName] = patch.o;
        }
        return true;
      }
      var getPatchFunc_default = (patchType) => (funcName, funcParent, callback, oneTime = false) => {
        var origFunc = funcParent[funcName];
        if (typeof origFunc !== "function") throw new Error(`${String(funcName)} is not a function in ${funcParent.constructor.name}`);
        var funcPatch = patchedFunctions.get(origFunc);
        if (!funcPatch) {
          funcPatch = {
            n: funcName,
            o: origFunc,
            p: new WeakRefImpl(funcParent),
            c: [],
            b: /* @__PURE__ */ new Map(),
            i: /* @__PURE__ */ new Map(),
            a: /* @__PURE__ */ new Map()
          };
          var replaceProxy = new Proxy(origFunc, {
            apply: (_2, ctxt, args) => runHook(ctxt, args, false),
            construct: (_2, args) => runHook(origFunc, args, true),
            // @ts-expect-error this is manual minification. if you don't like it, kick rocks.
            get: (target, prop2, receiver, resolvedProp) => (resolvedProp = Reflect.get(target, prop2, receiver), resolvedProp == unpatch2.toString ? resolvedProp.bind(origFunc) : resolvedProp)
          });
          var runHook = (ctxt, args, construct) => hook_default(replaceProxy, (...args2) => construct ? Reflect.construct(origFunc, args2, ctxt) : origFunc.apply(ctxt, args2), args, ctxt);
          patchedFunctions.set(replaceProxy, funcPatch);
          if (!Reflect.defineProperty(funcParent, funcName, {
            value: replaceProxy,
            configurable: true,
            writable: true
          })) funcParent[funcName] = replaceProxy;
        }
        var hookId = /* @__PURE__ */ Symbol();
        var funcPatchRef = new WeakRefImpl(funcPatch);
        var unpatchThisPatch = () => unpatch2(funcPatchRef, hookId, patchType);
        if (oneTime) funcPatch.c.push(unpatchThisPatch);
        funcPatch[patchType].set(hookId, callback);
        return unpatchThisPatch;
      };
      var before3 = getPatchFunc_default("b");
      var instead4 = getPatchFunc_default("i");
      var after2 = getPatchFunc_default("a");
    }
  });

  // src/lib/api/native/modules/index.ts
  var modules_exports = {};
  __export(modules_exports, {
    BundleUpdaterManager: () => BundleUpdaterManager,
    ImageLoader: () => ImageLoader,
    NativeCacheModule: () => NativeCacheModule,
    NativeClientInfoModule: () => NativeClientInfoModule,
    NativeDeviceModule: () => NativeDeviceModule,
    NativeFileModule: () => NativeFileModule,
    NativeThemeModule: () => NativeThemeModule
  });
  function getNativeModule(...names) {
    for (var name of names) {
      if (globalThis.__turboModuleProxy) {
        var module = globalThis.__turboModuleProxy(name);
        if (module) return module;
      }
      if (nmp[name]) return nmp[name];
    }
    return void 0;
  }
  var nmp, NativeCacheModule, NativeFileModule, NativeClientInfoModule, NativeDeviceModule, NativeThemeModule, BundleUpdaterManager, ImageLoader;
  var init_modules = __esm({
    "src/lib/api/native/modules/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      nmp = globalThis.nativeModuleProxy;
      NativeCacheModule = getNativeModule("NativeCacheModule", "MMKVManager");
      NativeFileModule = getNativeModule("NativeFileModule", "RTNFileManager", "DCDFileManager");
      NativeClientInfoModule = getNativeModule("NativeClientInfoModule", "RTNClientInfoManager", "InfoDictionaryManager");
      NativeDeviceModule = getNativeModule("NativeDeviceModule", "RTNDeviceManager", "DCDDeviceManager");
      NativeThemeModule = getNativeModule("NativeThemeModule", "RTNThemeManager", "DCDTheme");
      BundleUpdaterManager = getNativeModule("BundleUpdaterManager");
      ImageLoader = getNativeModule("ImageLoader");
    }
  });

  // src/lib/api/native/fs.ts
  var fs_exports = {};
  __export(fs_exports, {
    clearFolder: () => clearFolder,
    downloadFile: () => downloadFile,
    fileExists: () => fileExists,
    readFile: () => readFile,
    removeCacheFile: () => removeCacheFile,
    removeFile: () => removeFile,
    writeFile: () => writeFile
  });
  function clearFolder(_0) {
    return _async_to_generator(function* (path, { prefix = "pyoncord/" } = {}) {
      if (typeof NativeFileModule.clearFolder !== "function") throw new Error("'fs.clearFolder' is not supported");
      return void (yield NativeFileModule.clearFolder("documents", `${prefix}${path}`));
    }).apply(this, arguments);
  }
  function removeFile(_0) {
    return _async_to_generator(function* (path, { prefix = "pyoncord/" } = {}) {
      if (typeof NativeFileModule.removeFile !== "function") throw new Error("'fs.removeFile' is not supported");
      return void (yield NativeFileModule.removeFile("documents", `${prefix}${path}`));
    }).apply(this, arguments);
  }
  function removeCacheFile(path, prefix = "pyoncord/") {
    return _async_to_generator(function* () {
      if (typeof NativeFileModule.removeFile !== "function") throw new Error("'fs.removeFile' is not supported");
      return void (yield NativeFileModule.removeFile("cache", `${prefix}${path}`));
    })();
  }
  function fileExists(_0) {
    return _async_to_generator(function* (path, { prefix = "pyoncord/" } = {}) {
      return yield NativeFileModule.fileExists(`${NativeFileModule.getConstants().DocumentsDirPath}/${prefix}${path}`);
    }).apply(this, arguments);
  }
  function writeFile(_0, _1) {
    return _async_to_generator(function* (path, data, { prefix = "pyoncord/" } = {}) {
      if (typeof data !== "string") throw new Error("Argument 'data' must be a string");
      return void (yield NativeFileModule.writeFile("documents", `${prefix}${path}`, data, "utf8"));
    }).apply(this, arguments);
  }
  function readFile(_0) {
    return _async_to_generator(function* (path, { prefix = "pyoncord/" } = {}) {
      try {
        return yield NativeFileModule.readFile(`${NativeFileModule.getConstants().DocumentsDirPath}/${prefix}${path}`, "utf8");
      } catch (err) {
        throw new Error(`An error occured while writing to '${path}'`, {
          cause: err
        });
      }
    }).apply(this, arguments);
  }
  function downloadFile(_0, _1) {
    return _async_to_generator(function* (url2, path, { prefix = "pyoncord/" } = {}) {
      var response = yield fetch(url2);
      if (!response.ok) {
        throw new Error(`Failed to download file from ${url2}: ${response.status}`);
      }
      var arrayBuffer = yield response.arrayBuffer();
      var data = Buffer.from(arrayBuffer).toString("base64");
      yield NativeFileModule.writeFile("documents", `${prefix}${path}`, data, "base64");
    }).apply(this, arguments);
  }
  var init_fs = __esm({
    "src/lib/api/native/fs.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_modules();
    }
  });

  // node_modules/@swc/helpers/esm/_class_apply_descriptor_get.js
  function _class_apply_descriptor_get(receiver, descriptor) {
    if (descriptor.get) return descriptor.get.call(receiver);
    return descriptor.value;
  }
  var init_class_apply_descriptor_get = __esm({
    "node_modules/@swc/helpers/esm/_class_apply_descriptor_get.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_class_extract_field_descriptor.js
  function _class_extract_field_descriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) throw new TypeError("attempted to " + action + " private field on non-instance");
    return privateMap.get(receiver);
  }
  var init_class_extract_field_descriptor = __esm({
    "node_modules/@swc/helpers/esm/_class_extract_field_descriptor.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_class_private_field_get.js
  function _class_private_field_get(receiver, privateMap) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "get");
    return _class_apply_descriptor_get(receiver, descriptor);
  }
  var init_class_private_field_get = __esm({
    "node_modules/@swc/helpers/esm/_class_private_field_get.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_class_apply_descriptor_get();
      init_class_extract_field_descriptor();
    }
  });

  // node_modules/@swc/helpers/esm/_check_private_redeclaration.js
  function _check_private_redeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
      throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
  }
  var init_check_private_redeclaration = __esm({
    "node_modules/@swc/helpers/esm/_check_private_redeclaration.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_class_private_field_init.js
  function _class_private_field_init(obj, privateMap, value) {
    _check_private_redeclaration(obj, privateMap);
    privateMap.set(obj, value);
  }
  var init_class_private_field_init = __esm({
    "node_modules/@swc/helpers/esm/_class_private_field_init.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_check_private_redeclaration();
    }
  });

  // node_modules/@swc/helpers/esm/_class_apply_descriptor_set.js
  function _class_apply_descriptor_set(receiver, descriptor, value) {
    if (descriptor.set) descriptor.set.call(receiver, value);
    else {
      if (!descriptor.writable) {
        throw new TypeError("attempted to set read only private field");
      }
      descriptor.value = value;
    }
  }
  var init_class_apply_descriptor_set = __esm({
    "node_modules/@swc/helpers/esm/_class_apply_descriptor_set.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_class_private_field_set.js
  function _class_private_field_set(receiver, privateMap, value) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "set");
    _class_apply_descriptor_set(receiver, descriptor, value);
    return value;
  }
  var init_class_private_field_set = __esm({
    "node_modules/@swc/helpers/esm/_class_private_field_set.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_class_apply_descriptor_set();
      init_class_extract_field_descriptor();
    }
  });

  // node_modules/@swc/helpers/esm/_define_property.js
  function _define_property(obj, key2, value) {
    if (key2 in obj) {
      Object.defineProperty(obj, key2, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else obj[key2] = value;
    return obj;
  }
  var init_define_property = __esm({
    "node_modules/@swc/helpers/esm/_define_property.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_get_prototype_of.js
  function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _get_prototype_of(o);
  }
  var init_get_prototype_of = __esm({
    "node_modules/@swc/helpers/esm/_get_prototype_of.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_is_native_reflect_construct.js
  function _is_native_reflect_construct() {
    try {
      var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (_2) {
    }
    return (_is_native_reflect_construct = function _is_native_reflect_construct2() {
      return !!result;
    })();
  }
  var init_is_native_reflect_construct = __esm({
    "node_modules/@swc/helpers/esm/_is_native_reflect_construct.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_assert_this_initialized.js
  function _assert_this_initialized(self) {
    if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
  }
  var init_assert_this_initialized = __esm({
    "node_modules/@swc/helpers/esm/_assert_this_initialized.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_type_of.js
  function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  var init_type_of = __esm({
    "node_modules/@swc/helpers/esm/_type_of.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_possible_constructor_return.js
  function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) return call;
    return _assert_this_initialized(self);
  }
  var init_possible_constructor_return = __esm({
    "node_modules/@swc/helpers/esm/_possible_constructor_return.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_assert_this_initialized();
      init_type_of();
    }
  });

  // node_modules/@swc/helpers/esm/_call_super.js
  function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
  }
  var init_call_super = __esm({
    "node_modules/@swc/helpers/esm/_call_super.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_get_prototype_of();
      init_is_native_reflect_construct();
      init_possible_constructor_return();
    }
  });

  // node_modules/@swc/helpers/esm/_set_prototype_of.js
  function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _set_prototype_of(o, p);
  }
  var init_set_prototype_of = __esm({
    "node_modules/@swc/helpers/esm/_set_prototype_of.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_inherits.js
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
  }
  var init_inherits = __esm({
    "node_modules/@swc/helpers/esm/_inherits.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_set_prototype_of();
    }
  });

  // node_modules/@swc/helpers/esm/_construct.js
  function _construct(Parent, args, Class) {
    if (_is_native_reflect_construct()) _construct = Reflect.construct;
    else {
      _construct = function construct(Parent2, args2, Class2) {
        var a2 = [
          null
        ];
        a2.push.apply(a2, args2);
        var Constructor = Function.bind.apply(Parent2, a2);
        var instance = new Constructor();
        if (Class2) _set_prototype_of(instance, Class2.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  var init_construct = __esm({
    "node_modules/@swc/helpers/esm/_construct.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_is_native_reflect_construct();
      init_set_prototype_of();
    }
  });

  // node_modules/@swc/helpers/esm/_is_native_function.js
  function _is_native_function(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  var init_is_native_function = __esm({
    "node_modules/@swc/helpers/esm/_is_native_function.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_wrap_native_super.js
  function _wrap_native_super(Class) {
    var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
    _wrap_native_super = function _wrap_native_super2(Class2) {
      if (Class2 === null || !_is_native_function(Class2)) return Class2;
      if (typeof Class2 !== "function") throw new TypeError("Super expression must either be null or a function");
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class2)) return _cache.get(Class2);
        _cache.set(Class2, Wrapper);
      }
      function Wrapper() {
        return _construct(Class2, arguments, _get_prototype_of(this).constructor);
      }
      Wrapper.prototype = Object.create(Class2.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _set_prototype_of(Wrapper, Class2);
    };
    return _wrap_native_super(Class);
  }
  var init_wrap_native_super = __esm({
    "node_modules/@swc/helpers/esm/_wrap_native_super.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_construct();
      init_get_prototype_of();
      init_is_native_function();
      init_set_prototype_of();
    }
  });

  // node_modules/es-toolkit/dist/function/debounce.mjs
  function debounce(func, debounceMs, { signal, edges } = {}) {
    var pendingThis = void 0;
    var pendingArgs = null;
    var leading = edges != null && edges.includes("leading");
    var trailing = edges == null || edges.includes("trailing");
    var invoke = () => {
      if (pendingArgs !== null) {
        func.apply(pendingThis, pendingArgs);
        pendingThis = void 0;
        pendingArgs = null;
      }
    };
    var onTimerEnd = () => {
      if (trailing) invoke();
      cancel();
    };
    var timeoutId = null;
    var schedule = () => {
      if (timeoutId != null) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        timeoutId = null;
        onTimerEnd();
      }, debounceMs);
    };
    var cancelTimer = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
    var cancel = () => {
      cancelTimer();
      pendingThis = void 0;
      pendingArgs = null;
    };
    var flush = () => {
      invoke();
    };
    var debounced = function debounced2(...args) {
      if (signal === null || signal === void 0 ? void 0 : signal.aborted) return;
      pendingThis = this;
      pendingArgs = args;
      var isFirstCall = timeoutId == null;
      schedule();
      if (leading && isFirstCall) invoke();
    };
    debounced.schedule = schedule;
    debounced.cancel = cancel;
    debounced.flush = flush;
    signal === null || signal === void 0 || signal.addEventListener("abort", cancel, {
      once: true
    });
    return debounced;
  }
  var init_debounce = __esm({
    "node_modules/es-toolkit/dist/function/debounce.mjs"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/es-toolkit/dist/object/omit.mjs
  function omit(obj, keys) {
    var result = {
      ...obj
    };
    for (var i2 = 0; i2 < keys.length; i2++) {
      var key2 = keys[i2];
      delete result[key2];
    }
    return result;
  }
  var init_omit = __esm({
    "node_modules/es-toolkit/dist/object/omit.mjs"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/es-toolkit/dist/predicate/isNotNil.mjs
  function isNotNil(x2) {
    return x2 != null;
  }
  var init_isNotNil = __esm({
    "node_modules/es-toolkit/dist/predicate/isNotNil.mjs"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/es-toolkit/dist/index.mjs
  var init_dist = __esm({
    "node_modules/es-toolkit/dist/index.mjs"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_debounce();
      init_omit();
      init_isNotNil();
    }
  });

  // src/metro/internals/enums.ts
  var ModuleFlags, ModulesMapInternal;
  var init_enums = __esm({
    "src/metro/internals/enums.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      ModuleFlags = /* @__PURE__ */ (function(ModuleFlags2) {
        ModuleFlags2[ModuleFlags2["EXISTS"] = 1] = "EXISTS";
        ModuleFlags2[ModuleFlags2["BLACKLISTED"] = 2] = "BLACKLISTED";
        ModuleFlags2[ModuleFlags2["ASSET"] = 4] = "ASSET";
        return ModuleFlags2;
      })({});
      ModulesMapInternal = /* @__PURE__ */ (function(ModulesMapInternal2) {
        ModulesMapInternal2[ModulesMapInternal2["FULL_LOOKUP"] = 0] = "FULL_LOOKUP";
        ModulesMapInternal2[ModulesMapInternal2["NOT_FOUND"] = 1] = "NOT_FOUND";
        return ModulesMapInternal2;
      })({});
    }
  });

  // src/lib/api/patcher.ts
  var patcher_exports = {};
  __export(patcher_exports, {
    _patcherDelaySymbol: () => _patcherDelaySymbol,
    after: () => after,
    before: () => before,
    default: () => patcher_default,
    instead: () => instead
  });
  function create(fn) {
    function patchFn(...args) {
      if (typeof args[1][_patcherDelaySymbol] === "function") {
        var delayCallback = args[1][_patcherDelaySymbol];
        var cancel = false;
        var unpatch2 = () => cancel = true;
        delayCallback((target) => {
          if (cancel) return;
          args[1] = target;
          unpatch2 = fn.apply(this, args);
        });
        return () => unpatch2();
      }
      return fn.apply(this, args);
    }
    function promisePatchFn(...args) {
      var thenable = args[1];
      if (!thenable || !("then" in thenable)) throw new Error("target is not a then-able object");
      var cancel = false;
      var unpatch2 = () => cancel = true;
      thenable.then((target) => {
        if (cancel) return;
        args[1] = target;
        unpatch2 = patchFn.apply(this, args);
      });
      return () => unpatch2();
    }
    return Object.assign(patchFn, {
      await: promisePatchFn
    });
  }
  var _after, _before, _instead, _patcherDelaySymbol, after, before, instead, patcher_default;
  var init_patcher = __esm({
    "src/lib/api/patcher.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      ({ after: _after, before: _before, instead: _instead } = require_dist());
      _patcherDelaySymbol = /* @__PURE__ */ Symbol.for("bunny.api.patcher.delay");
      after = create(_after);
      before = create(_before);
      instead = create(_instead);
      patcher_default = {
        after,
        before,
        instead
      };
    }
  });

  // src/lib/api/assets/patches.ts
  var patches_exports = {};
  __export(patches_exports, {
    assetsModule: () => assetsModule,
    patchAssets: () => patchAssets
  });
  function patchAssets(module) {
    if (assetsModule) return;
    assetsModule = module;
    var unpatch2 = after("registerAsset", assetsModule, () => {
      var moduleId = getImportingModuleId();
      if (moduleId !== -1) indexAssetModuleFlag(moduleId);
    });
    return unpatch2;
  }
  var assetsModule;
  var init_patches = __esm({
    "src/lib/api/assets/patches.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_patcher();
      init_caches();
      init_modules2();
    }
  });

  // src/core/vendetta/Emitter.ts
  var Events, Emitter;
  var init_Emitter = __esm({
    "src/core/vendetta/Emitter.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_class_call_check();
      init_create_class();
      init_define_property();
      Events = /* @__PURE__ */ (function(Events2) {
        Events2["GET"] = "GET";
        Events2["SET"] = "SET";
        Events2["DEL"] = "DEL";
        return Events2;
      })({});
      Emitter = /* @__PURE__ */ (function() {
        "use strict";
        function Emitter2() {
          _class_call_check(this, Emitter2);
          _define_property(this, "listeners", Object.values(Events).reduce((acc, val) => (acc[val] = /* @__PURE__ */ new Set(), acc), {}));
        }
        _create_class(Emitter2, [
          {
            key: "on",
            value: function on(event, listener) {
              if (!this.listeners[event].has(listener)) this.listeners[event].add(listener);
            }
          },
          {
            key: "off",
            value: function off(event, listener) {
              this.listeners[event].delete(listener);
            }
          },
          {
            key: "once",
            value: function once(event, listener) {
              var once2 = (event2, data) => {
                this.off(event2, once2);
                listener(event2, data);
              };
              this.on(event, once2);
            }
          },
          {
            key: "emit",
            value: function emit(event, data) {
              for (var listener of this.listeners[event]) listener(event, data);
            }
          }
        ]);
        return Emitter2;
      })();
    }
  });

  // src/metro/factories.ts
  var factories_exports = {};
  __export(factories_exports, {
    createFilterDefinition: () => createFilterDefinition,
    createSimpleFilter: () => createSimpleFilter
  });
  function createFilterDefinition(fn, uniqMaker) {
    function createHolder(func, args, raw) {
      return Object.assign(func, {
        filter: fn,
        raw,
        uniq: [
          raw && "raw::",
          uniqMaker(args)
        ].filter(Boolean).join("")
      });
    }
    var curry = (raw) => (...args) => {
      return createHolder((m, id2, defaultCheck) => {
        return fn(args, m, id2, defaultCheck);
      }, args, raw);
    };
    return Object.assign(curry(false), {
      byRaw: curry(true),
      uniqMaker
    });
  }
  function createSimpleFilter(filter, uniq) {
    return createFilterDefinition((_2, m) => filter(m), () => `dynamic::${uniq}`)();
  }
  var init_factories = __esm({
    "src/metro/factories.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // src/metro/filters.ts
  var filters_exports = {};
  __export(filters_exports, {
    byDisplayName: () => byDisplayName,
    byFilePath: () => byFilePath,
    byMutableProp: () => byMutableProp,
    byName: () => byName,
    byProps: () => byProps,
    byStoreName: () => byStoreName,
    byTypeName: () => byTypeName
  });
  var byProps, byName, byDisplayName, byTypeName, byStoreName, byFilePath, byMutableProp;
  var init_filters = __esm({
    "src/metro/filters.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_factories();
      init_modules2();
      byProps = createFilterDefinition((props, m) => props.length === 0 ? m[props[0]] : props.every((p) => m[p]), (props) => `bunny.metro.byProps(${props.join(",")})`);
      byName = createFilterDefinition(([name], m) => m.name === name, (name) => `bunny.metro.byName(${name})`);
      byDisplayName = createFilterDefinition(([displayName], m) => m.displayName === displayName, (name) => `bunny.metro.byDisplayName(${name})`);
      byTypeName = createFilterDefinition(([typeName], m) => m.type?.name === typeName, (name) => `bunny.metro.byTypeName(${name})`);
      byStoreName = createFilterDefinition(([name], m) => m.getName?.length === 0 && m.getName() === name, (name) => `bunny.metro.byStoreName(${name})`);
      byFilePath = createFilterDefinition(
        // module return depends on defaultCheck. if true, it'll return module.default, otherwise the whole module
        // unlike filters like byName, defaultCheck doesn't affect the return since we don't rely on exports, but only its ID
        // one could say that this is technically a hack, since defaultCheck is meant for filtering exports
        ([path, exportDefault], _2, id2, defaultCheck) => exportDefault === defaultCheck && metroModules[id2]?.__filePath === path,
        ([path, exportDefault]) => `bunny.metro.byFilePath(${path},${exportDefault})`
      );
      byMutableProp = createFilterDefinition(([prop2], m) => m?.[prop2] && !Object.getOwnPropertyDescriptor(m, prop2)?.get, (prop2) => `bunny.metro.byMutableProp(${prop2})`);
    }
  });

  // src/metro/finders.ts
  function filterExports(moduleExports2, moduleId, filter) {
    if (moduleExports2.default && moduleExports2.__esModule && filter(moduleExports2.default, moduleId, true)) {
      return {
        exports: filter.raw ? moduleExports2 : moduleExports2.default,
        defaultExport: !filter.raw
      };
    }
    if (!filter.raw && filter(moduleExports2, moduleId, false)) {
      return {
        exports: moduleExports2,
        defaultExport: false
      };
    }
    return {};
  }
  function findModule(filter) {
    var { cacheId, finish } = getCacherForUniq(filter.uniq, false);
    for (var [id2, moduleExports2] of getModules(filter.uniq, false)) {
      var { exports: testedExports, defaultExport } = filterExports(moduleExports2, id2, filter);
      if (testedExports !== void 0) {
        cacheId(id2, testedExports);
        return {
          id: id2,
          defaultExport
        };
      }
    }
    finish(true);
    return {};
  }
  function findModuleId(filter) {
    return findModule(filter)?.id;
  }
  function findExports(filter) {
    var { id: id2, defaultExport } = findModule(filter);
    if (id2 == null) return;
    return defaultExport ? requireModule(id2).default : requireModule(id2);
  }
  function findAllModule(filter) {
    var { cacheId, finish } = getCacherForUniq(filter.uniq, true);
    var foundExports = [];
    for (var [id2, moduleExports2] of getModules(filter.uniq, true)) {
      var { exports: testedExports, defaultExport } = filterExports(moduleExports2, id2, filter);
      if (testedExports !== void 0 && typeof defaultExport === "boolean") {
        foundExports.push({
          id: id2,
          defaultExport
        });
        cacheId(id2, testedExports);
      }
    }
    finish(foundExports.length === 0);
    return foundExports;
  }
  function findAllModuleId(filter) {
    return findAllModule(filter).map((e) => e.id);
  }
  function findAllExports(filter) {
    return findAllModule(filter).map((ret) => {
      if (!ret.id) return;
      var { id: id2, defaultExport } = ret;
      return defaultExport ? requireModule(id2).default : requireModule(id2);
    });
  }
  var init_finders = __esm({
    "src/metro/finders.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_caches();
      init_modules2();
    }
  });

  // src/lib/utils/lazy.ts
  var lazy_exports = {};
  __export(lazy_exports, {
    getProxyFactory: () => getProxyFactory,
    lazyDestructure: () => lazyDestructure,
    proxyLazy: () => proxyLazy
  });
  function proxyLazy(factory, opts = {}) {
    var cache;
    var dummy = opts.hint !== "object" ? function() {
    } : {};
    var proxyFactory = () => cache ??= factory();
    var proxy = new Proxy(dummy, lazyHandler);
    factories.set(proxy, proxyFactory);
    proxyContextHolder.set(dummy, {
      factory: proxyFactory,
      options: opts
    });
    return proxy;
  }
  function lazyDestructure(factory, opts = {}) {
    var proxiedObject = proxyLazy(factory);
    return new Proxy({}, {
      get(_2, property) {
        if (property === Symbol.iterator) {
          return function* () {
            yield proxiedObject;
            yield new Proxy({}, {
              get: (_3, p) => proxyLazy(() => proxiedObject[p], opts)
            });
            throw new Error("This is not a real iterator, this is likely used incorrectly");
          };
        }
        return proxyLazy(() => proxiedObject[property], opts);
      }
    });
  }
  function getProxyFactory(obj) {
    return factories.get(obj);
  }
  var unconfigurable, isUnconfigurable, factories, proxyContextHolder, lazyHandler;
  var init_lazy = __esm({
    "src/lib/utils/lazy.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      unconfigurable = /* @__PURE__ */ new Set([
        "arguments",
        "caller",
        "prototype"
      ]);
      isUnconfigurable = (key2) => typeof key2 === "string" && unconfigurable.has(key2);
      factories = /* @__PURE__ */ new WeakMap();
      proxyContextHolder = /* @__PURE__ */ new WeakMap();
      lazyHandler = {
        ...Object.fromEntries(Object.getOwnPropertyNames(Reflect).map((fnName) => {
          return [
            fnName,
            (target, ...args) => {
              var contextHolder = proxyContextHolder.get(target);
              var resolved = contextHolder?.factory();
              if (!resolved) throw new Error(`Trying to Reflect.${fnName} of ${typeof resolved}`);
              return Reflect[fnName](resolved, ...args);
            }
          ];
        })),
        has(target, p) {
          var contextHolder = proxyContextHolder.get(target);
          if (contextHolder?.options) {
            var { exemptedEntries: isolatedEntries } = contextHolder.options;
            if (isolatedEntries && p in isolatedEntries) return true;
          }
          var resolved = contextHolder?.factory();
          if (!resolved) throw new Error(`Trying to Reflect.has of ${typeof resolved}`);
          return Reflect.has(resolved, p);
        },
        get(target, p, receiver) {
          if (p === "__IS_BUNNY_LAZY_PROXY__") return true;
          var contextHolder = proxyContextHolder.get(target);
          if (contextHolder?.options) {
            var { exemptedEntries: isolatedEntries } = contextHolder.options;
            if (isolatedEntries?.[p]) return isolatedEntries[p];
          }
          var resolved = contextHolder?.factory();
          if (!resolved) throw new Error(`Trying to Reflect.get of ${typeof resolved}`);
          return Reflect.get(resolved, p, receiver);
        },
        ownKeys: (target) => {
          var contextHolder = proxyContextHolder.get(target);
          var resolved = contextHolder?.factory();
          if (!resolved) throw new Error(`Trying to Reflect.ownKeys of ${typeof resolved}`);
          var cacheKeys = Reflect.ownKeys(resolved);
          unconfigurable.forEach((key2) => !cacheKeys.includes(key2) && cacheKeys.push(key2));
          return cacheKeys;
        },
        getOwnPropertyDescriptor: (target, p) => {
          if (isUnconfigurable(p)) return Reflect.getOwnPropertyDescriptor(target, p);
          var contextHolder = proxyContextHolder.get(target);
          var resolved = contextHolder?.factory();
          if (!resolved) throw new Error(`Trying to getOwnPropertyDescriptor of ${typeof resolved}`);
          var descriptor = Reflect.getOwnPropertyDescriptor(resolved, p);
          if (descriptor) Object.defineProperty(target, p, descriptor);
          return descriptor;
        }
      };
    }
  });

  // src/metro/lazy.ts
  var lazy_exports2 = {};
  __export(lazy_exports2, {
    _lazyContextSymbol: () => _lazyContextSymbol,
    createLazyModule: () => createLazyModule,
    getLazyContext: () => getLazyContext
  });
  function getIndexedFind(filter) {
    var modulesMap = getMetroCache().findIndex[filter.uniq];
    if (!modulesMap) return void 0;
    for (var k2 in modulesMap) if (k2[0] !== "_") return Number(k2);
  }
  function subscribeLazyModule(proxy, callback) {
    var info = getLazyContext(proxy);
    if (!info) throw new Error("Subscribing a module for non-proxy-find");
    if (!info.indexed) throw new Error("Attempting to subscribe to a non-indexed find");
    return subscribeModule(info.moduleId, () => {
      callback(findExports(info.filter));
    });
  }
  function getLazyContext(proxy) {
    return _lazyContexts.get(proxy);
  }
  function createLazyModule(filter) {
    var cache = void 0;
    var moduleId = getIndexedFind(filter);
    var context = {
      filter,
      indexed: !!moduleId,
      moduleId,
      getExports(cb) {
        if (!moduleId || metroModules[moduleId]?.isInitialized) {
          cb(this.forceLoad());
          return () => void 0;
        }
        return this.subscribe(cb);
      },
      subscribe(cb) {
        return subscribeLazyModule(proxy, cb);
      },
      get cache() {
        return cache;
      },
      forceLoad() {
        cache ??= findExports(filter);
        if (!cache) throw new Error(`${filter.uniq} is ${typeof cache}! (id ${context.moduleId ?? "unknown"})`);
        return cache;
      }
    };
    var proxy = proxyLazy(() => context.forceLoad(), {
      exemptedEntries: {
        [_lazyContextSymbol]: context,
        [_patcherDelaySymbol]: (cb) => context.getExports(cb)
      }
    });
    _lazyContexts.set(proxy, context);
    return proxy;
  }
  var _lazyContextSymbol, _lazyContexts;
  var init_lazy2 = __esm({
    "src/metro/lazy.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_patcher();
      init_lazy();
      init_finders();
      init_caches();
      init_modules2();
      _lazyContextSymbol = /* @__PURE__ */ Symbol.for("bunny.metro.lazyContext");
      _lazyContexts = /* @__PURE__ */ new WeakMap();
    }
  });

  // src/metro/wrappers.ts
  var findByProps, findByPropsLazy, findByPropsAll, findByName, findByNameLazy, findByNameAll, findByDisplayName, findByDisplayNameLazy, findByDisplayNameAll, findByTypeName, findByTypeNameLazy, findByTypeNameAll, findByStoreName, findByStoreNameLazy, findByFilePath, findByFilePathLazy;
  var init_wrappers = __esm({
    "src/metro/wrappers.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_filters();
      init_finders();
      init_lazy2();
      findByProps = (...props) => findExports(byProps(...props));
      findByPropsLazy = (...props) => createLazyModule(byProps(...props));
      findByPropsAll = (...props) => findAllExports(byProps(...props));
      findByName = (name, expDefault = true) => findExports(expDefault ? byName(name) : byName.byRaw(name));
      findByNameLazy = (name, expDefault = true) => createLazyModule(expDefault ? byName(name) : byName.byRaw(name));
      findByNameAll = (name, expDefault = true) => findAllExports(expDefault ? byName(name) : byName.byRaw(name));
      findByDisplayName = (name, expDefault = true) => findExports(expDefault ? byDisplayName(name) : byDisplayName.byRaw(name));
      findByDisplayNameLazy = (name, expDefault = true) => createLazyModule(expDefault ? byDisplayName(name) : byDisplayName.byRaw(name));
      findByDisplayNameAll = (name, expDefault = true) => findAllExports(expDefault ? byDisplayName(name) : byDisplayName.byRaw(name));
      findByTypeName = (name, expDefault = true) => findExports(expDefault ? byTypeName(name) : byTypeName.byRaw(name));
      findByTypeNameLazy = (name, expDefault = true) => createLazyModule(expDefault ? byTypeName(name) : byTypeName.byRaw(name));
      findByTypeNameAll = (name, expDefault = true) => findAllExports(expDefault ? byTypeName(name) : byTypeName.byRaw(name));
      findByStoreName = (name) => findExports(byStoreName(name));
      findByStoreNameLazy = (name) => createLazyModule(byStoreName(name));
      findByFilePath = (path, expDefault = false) => findExports(byFilePath(path, expDefault));
      findByFilePathLazy = (path, expDefault = false) => createLazyModule(byFilePath(path, expDefault));
    }
  });

  // shims/depsModule.ts
  var require_depsModule = __commonJS({
    "shims/depsModule.ts"(exports, module) {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_wrappers();
      module.exports = {
        "react": findByPropsLazy("createElement"),
        "react-native": findByPropsLazy("AppRegistry"),
        "util": findByPropsLazy("inspect", "isNullOrUndefined"),
        "moment": findByPropsLazy("isMoment"),
        "chroma-js": findByPropsLazy("brewer"),
        "lodash": findByPropsLazy("forEachRight"),
        "react-native-webview": findByPropsLazy("WebView")
      };
    }
  });

  // globals:react-native
  var require_react_native = __commonJS({
    "globals:react-native"(exports, module) {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      module.exports = require_depsModule()["react-native"];
    }
  });

  // src/core/vendetta/storage.ts
  function createProxy(target = {}) {
    var emitter = new Emitter();
    var childrens = /* @__PURE__ */ new WeakMap();
    var proxiedChildrenSet = /* @__PURE__ */ new WeakSet();
    function createProxy1(target2, path) {
      return new Proxy(target2, {
        get(target3, prop2) {
          if (prop2 === emitterSymbol) return emitter;
          var newPath = [
            ...path,
            prop2
          ];
          var value = target3[prop2];
          if (value !== void 0 && value !== null) {
            emitter.emit("GET", {
              path: newPath,
              value
            });
            if (typeof value === "object") {
              if (proxiedChildrenSet.has(value)) return value;
              if (childrens.has(value)) return childrens.get(value);
              var childrenProxy = createProxy1(value, newPath);
              childrens.set(value, childrenProxy);
              return childrenProxy;
            }
            return value;
          }
          return value;
        },
        set(target3, prop2, value) {
          if (typeof value === "object") {
            if (childrens.has(value)) {
              target3[prop2] = childrens.get(value);
            } else {
              var childrenProxy = createProxy1(value, [
                ...path,
                prop2
              ]);
              childrens.set(value, childrenProxy);
              proxiedChildrenSet.add(value);
              target3[prop2] = childrenProxy;
            }
          } else {
            target3[prop2] = value;
          }
          emitter.emit("SET", {
            path: [
              ...path,
              prop2
            ],
            value: target3[prop2]
          });
          return true;
        },
        deleteProperty(target3, prop2) {
          var value = typeof target3[prop2] === "object" ? childrens.get(target3[prop2]) : target3[prop2];
          var success = delete target3[prop2];
          if (success) emitter.emit("DEL", {
            value,
            path: [
              ...path,
              prop2
            ]
          });
          return success;
        }
      });
    }
    return {
      proxy: createProxy1(target, []),
      emitter
    };
  }
  function useProxy(storage) {
    var emitter = storage?.[emitterSymbol];
    if (!emitter) throw new Error("storage?.[emitterSymbol] is undefined");
    var [, forceUpdate] = React.useReducer((n) => ~n, 0);
    React.useEffect(() => {
      var listener = (event, data) => {
        if (event === "DEL" && data.value === storage) return;
        forceUpdate();
      };
      emitter.on("SET", listener);
      emitter.on("DEL", listener);
      return () => {
        emitter.off("SET", listener);
        emitter.off("DEL", listener);
      };
    }, []);
    return storage;
  }
  function createStorage(backend) {
    return _async_to_generator(function* () {
      var data = yield backend.get();
      var { proxy, emitter } = createProxy(data);
      var handler = () => backend.set(proxy);
      emitter.on("SET", handler);
      emitter.on("DEL", handler);
      return proxy;
    })();
  }
  function wrapSync(store) {
    var awaited = void 0;
    var awaitQueue = [];
    var awaitInit = (cb) => awaited ? cb() : awaitQueue.push(cb);
    store.then((v2) => {
      awaited = v2;
      awaitQueue.forEach((cb) => cb());
    });
    return new Proxy({}, {
      ...Object.fromEntries(Object.getOwnPropertyNames(Reflect).map((k2) => [
        k2,
        (t, ...a2) => Reflect[k2](awaited ?? t, ...a2)
      ])),
      get(target, prop2, recv) {
        if (prop2 === syncAwaitSymbol) return awaitInit;
        return Reflect.get(awaited ?? target, prop2, recv);
      }
    });
  }
  function awaitStorage(...stores) {
    return Promise.all(stores.map((store) => new Promise((res) => store[syncAwaitSymbol](res))));
  }
  var import_react_native, emitterSymbol, syncAwaitSymbol, ILLEGAL_CHARS_REGEX, _writeDebouncers, filePathFixer, getMMKVPath, purgeStorage, createMMKVBackend, createMemoryBackend, createFileBackend;
  var init_storage = __esm({
    "src/core/vendetta/storage.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_Emitter();
      init_modules();
      import_react_native = __toESM(require_react_native());
      emitterSymbol = /* @__PURE__ */ Symbol.for("vendetta.storage.emitter");
      syncAwaitSymbol = /* @__PURE__ */ Symbol.for("vendetta.storage.accessor");
      ILLEGAL_CHARS_REGEX = /[<>:"/\\|?*]/g;
      _writeDebouncers = /* @__PURE__ */ new Map();
      filePathFixer = (file) => import_react_native.Platform.select({
        default: file,
        ios: NativeFileModule.saveFileToGallery ? file : `Documents/${file}`
      });
      getMMKVPath = (name) => {
        if (ILLEGAL_CHARS_REGEX.test(name)) {
          name = name.replace(ILLEGAL_CHARS_REGEX, "-").replace(/-+/g, "-");
        }
        return `vd_mmkv/${name}`;
      };
      purgeStorage = (store) => _async_to_generator(function* () {
        if (yield NativeCacheModule.getItem(store)) {
          NativeCacheModule.removeItem(store);
        }
        var mmkvPath = getMMKVPath(store);
        if (yield NativeFileModule.fileExists(`${NativeFileModule.getConstants().DocumentsDirPath}/${mmkvPath}`)) {
          yield NativeFileModule.removeFile?.("documents", mmkvPath);
        }
      })();
      createMMKVBackend = (store, defaultData = {}) => {
        var mmkvPath = getMMKVPath(store);
        var defaultStr = JSON.stringify(defaultData);
        return createFileBackend(mmkvPath, defaultData, (() => _async_to_generator(function* () {
          var path = `${NativeFileModule.getConstants().DocumentsDirPath}/${mmkvPath}`;
          if (yield NativeFileModule.fileExists(path)) return;
          var oldData = (yield NativeCacheModule.getItem(store)) ?? defaultStr;
          if (oldData === "!!LARGE_VALUE!!") {
            var cachePath = `${NativeFileModule.getConstants().CacheDirPath}/mmkv/${store}`;
            if (yield NativeFileModule.fileExists(cachePath)) {
              oldData = yield NativeFileModule.readFile(cachePath, "utf8");
            } else {
              console.log(`${store}: Experienced data loss :(`);
              oldData = defaultStr;
            }
          }
          try {
            JSON.parse(oldData);
          } catch (unused) {
            console.error(`${store} had an unparseable data while migrating`);
            oldData = defaultStr;
          }
          yield NativeFileModule.writeFile("documents", filePathFixer(mmkvPath), oldData, "utf8");
          if ((yield NativeCacheModule.getItem(store)) !== null) {
            NativeCacheModule.removeItem(store);
            console.log(`Successfully migrated ${store} store from MMKV storage to fs`);
          }
        })())());
      };
      createMemoryBackend = (store, defaultData = {}) => {
        var mmkvPath = getMMKVPath(store);
        var defaultStr = JSON.stringify(defaultData);
        var memory = {
          ...defaultData
        };
        (() => _async_to_generator(function* () {
          try {
            var cached = yield NativeCacheModule.getItem(store);
            if (cached) {
              var parsed = JSON.parse(cached);
              Object.assign(memory, parsed);
            }
          } catch (unused) {
          }
          try {
            var path = `${NativeFileModule.getConstants().DocumentsDirPath}/${mmkvPath}`;
            if (yield NativeFileModule.fileExists(path)) {
              var content = yield NativeFileModule.readFile(path, "utf8");
              var data = JSON.parse(content);
              Object.assign(memory, data);
            }
          } catch (unused) {
          }
        })())();
        var fixPath = (file) => import_react_native.Platform.select({
          default: file,
          ios: NativeFileModule.saveFileToGallery ? file : `Documents/${file}`
        });
        return {
          get: () => _async_to_generator(function* () {
            return memory;
          })(),
          set: (data) => _async_to_generator(function* () {
            Object.assign(memory, data);
            try {
              var existing = _writeDebouncers.get(store);
              if (existing) clearTimeout(existing);
              var timeout = setTimeout(() => _async_to_generator(function* () {
                try {
                  yield NativeFileModule.writeFile("documents", fixPath(mmkvPath), JSON.stringify(memory), "utf8");
                } catch (unused) {
                }
              })(), 120);
              _writeDebouncers.set(store, timeout);
            } catch (unused) {
            }
          })()
        };
      };
      createFileBackend = (file, defaultData = {}, migratePromise) => {
        return {
          get: () => _async_to_generator(function* () {
            yield migratePromise;
            var path = `${NativeFileModule.getConstants().DocumentsDirPath}/${file}`;
            if (yield NativeFileModule.fileExists(path)) {
              var content = yield NativeFileModule.readFile(path, "utf8");
              try {
                return JSON.parse(content);
              } catch (unused) {
              }
            }
            yield NativeFileModule.writeFile("documents", filePathFixer(file), JSON.stringify(defaultData), "utf8");
            return JSON.parse(yield NativeFileModule.readFile(path, "utf8"));
          })(),
          set: (data) => _async_to_generator(function* () {
            yield migratePromise;
            yield NativeFileModule.writeFile("documents", filePathFixer(file), JSON.stringify(data), "utf8");
          })()
        };
      };
    }
  });

  // node_modules/@swc/helpers/esm/_class_private_method_get.js
  function _class_private_method_get(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
    return fn;
  }
  var init_class_private_method_get = __esm({
    "node_modules/@swc/helpers/esm/_class_private_method_get.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_class_private_method_init.js
  function _class_private_method_init(obj, privateSet) {
    _check_private_redeclaration(obj, privateSet);
    privateSet.add(obj);
  }
  var init_class_private_method_init = __esm({
    "node_modules/@swc/helpers/esm/_class_private_method_init.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_check_private_redeclaration();
    }
  });

  // node_modules/@swc/helpers/esm/_class_check_private_static_access.js
  function _class_check_private_static_access(receiver, classConstructor) {
    if (receiver !== classConstructor) throw new TypeError("Private static access of wrong provenance");
  }
  var init_class_check_private_static_access = __esm({
    "node_modules/@swc/helpers/esm/_class_check_private_static_access.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_class_check_private_static_field_descriptor.js
  function _class_check_private_static_field_descriptor(descriptor, action) {
    if (descriptor === void 0) {
      throw new TypeError("attempted to " + action + " private static field before its declaration");
    }
  }
  var init_class_check_private_static_field_descriptor = __esm({
    "node_modules/@swc/helpers/esm/_class_check_private_static_field_descriptor.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/@swc/helpers/esm/_class_static_private_field_spec_get.js
  function _class_static_private_field_spec_get(receiver, classConstructor, descriptor) {
    _class_check_private_static_access(receiver, classConstructor);
    _class_check_private_static_field_descriptor(descriptor, "get");
    return _class_apply_descriptor_get(receiver, descriptor);
  }
  var init_class_static_private_field_spec_get = __esm({
    "node_modules/@swc/helpers/esm/_class_static_private_field_spec_get.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_class_apply_descriptor_get();
      init_class_check_private_static_access();
      init_class_check_private_static_field_descriptor();
    }
  });

  // node_modules/@gullerya/object-observer/dist/object-observer.min.js
  var object_observer_min_exports = {};
  __export(object_observer_min_exports, {
    Filter: () => k,
    ObjectObserver: () => H,
    Observable: () => A,
    Validator: () => M
  });
  function W(r, e) {
    var t = r[e], o = [
      new c(x, [
        e
      ], void 0, t, this.proxy)
    ];
    d(this, o), delete r[e];
    var n = g(t), i2 = [
      new c(x, [
        e
      ], void 0, n, this.proxy)
    ];
    return u(this, i2), true;
  }
  function $(r, e, t) {
    var o = r[e];
    if (t !== o) {
      var n = o === void 0 ? [
        new c(v, [
          e
        ], t, void 0, this.proxy)
      ] : [
        new c(w, [
          e
        ], t, o, this.proxy)
      ];
      d(this, n);
      var i2 = y(t, e, this);
      r[e] = i2;
      var s = g(o), p = s === void 0 ? [
        new c(v, [
          e
        ], i2, void 0, this.proxy)
      ] : [
        new c(w, [
          e
        ], i2, s, this.proxy)
      ];
      u(this, p);
    }
    return true;
  }
  function S(r, e, t) {
    var o = this[f], n = o.target, i2 = n.length;
    r = r < 0 ? Math.max(i2 + r, 0) : r, e = e === void 0 ? 0 : e < 0 ? Math.max(i2 + e, 0) : Math.min(e, i2), t = t === void 0 ? i2 : t < 0 ? Math.max(i2 + t, 0) : Math.min(t, i2);
    var s = Math.min(t - e, i2 - r);
    if (r < i2 && r !== e && s > 0) {
      var p = n.slice(0), a2 = [];
      n.copyWithin(r, e, t);
      for (var l = r; l < r + s; l++) {
        var b = n[l];
        b && typeof b == "object" && (b = y(b, l, o), n[l] = b);
        var h = g(p[l]);
        typeof b != "object" && b === h || a2.push(new c(w, [
          l
        ], b, h, this));
      }
      u(o, a2);
    }
    return this;
  }
  function C(r, e, t) {
    var o = this[f], n = o.target, i2 = [], s = n.length, p = n.slice(0);
    if (e = e === void 0 ? 0 : e < 0 ? Math.max(s + e, 0) : Math.min(e, s), t = t === void 0 ? s : t < 0 ? Math.max(s + t, 0) : Math.min(t, s), e < s && t > e) {
      n.fill(r, e, t);
      for (var a2 = e; a2 < t; a2++) if (n[a2] = y(n[a2], a2, o), a2 in p) {
        var l = g(p[a2]);
        i2.push(new c(w, [
          a2
        ], n[a2], l, this));
      } else i2.push(new c(v, [
        a2
      ], n[a2], void 0, this));
      u(o, i2);
    }
    return this;
  }
  function L() {
    var r = this[f], e = r.target, t = e.length - 1, o = e[t], n = [
      new c(x, [
        t
      ], void 0, o, this)
    ];
    d(r, n);
    var i2 = g(e.pop()), s = [
      new c(x, [
        t
      ], void 0, i2, this)
    ];
    return u(r, s), i2;
  }
  function B(...r) {
    var e = this[f], t = e.target, o = r.length, n = t.length, i2 = new Array(o);
    for (var l = 0; l < o; l++) i2[l] = new c(v, [
      n + l
    ], r[l], void 0, this);
    d(e, i2);
    var s = new Array(o);
    for (var l1 = 0; l1 < o; l1++) s[l1] = y(r[l1], n + l1, e);
    var p = Reflect.apply(t.push, t, s), a2 = new Array(o);
    for (var l2 = 0; l2 < o; l2++) a2[l2] = new c(v, [
      n + l2
    ], t[n + l2], void 0, this);
    return u(e, a2), p;
  }
  function F() {
    var r = this[f], e = r.target, t = [
      new c(T, [], void 0, void 0, this)
    ];
    return d(r, t), e.reverse(), O(e), u(r, t), this;
  }
  function U() {
    var r = this[f], e = r.target, t = e[0], o = [
      new c(x, [
        0
      ], void 0, t, this)
    ];
    d(r, o);
    var n = g(e.shift());
    O(e);
    var i2 = [
      new c(x, [
        0
      ], void 0, n, this)
    ];
    return u(r, i2), n;
  }
  function V(r) {
    var e = this[f], t = e.target, o = [
      new c(R, [], void 0, void 0, this)
    ];
    return d(e, o), t.sort(r), O(t), u(e, o), this;
  }
  function D(...r) {
    var e = this[f], t = e.target, o = r.length, n = new Array(o), i2 = t.length;
    for (var m = 0; m < o; m++) n[m] = y(r[m], m, e);
    var s = o === 0 ? 0 : n[0] < 0 ? i2 + n[0] : n[0], p = o < 2 ? i2 - s : n[1], a2 = Math.max(o - 2, 0), l = Reflect.apply(t.splice, t, n);
    O(t);
    for (var m1 = 0, Y = l.length; m1 < Y; m1++) l[m1] = g(l[m1]);
    var b = [], h;
    for (h = 0; h < p; h++) h < a2 ? b.push(new c(w, [
      s + h
    ], t[s + h], l[h], this)) : b.push(new c(x, [
      s + h
    ], void 0, l[h], this));
    for (; h < a2; h++) b.push(new c(v, [
      s + h
    ], t[s + h], void 0, this));
    return u(e, b), l;
  }
  function I(...r) {
    var e = this[f], t = e.target, o = r.length, n = new Array(o);
    for (var a2 = 0; a2 < o; a2++) n[a2] = new c(v, [
      a2
    ], r[a2], void 0, this);
    d(e, n);
    var i2 = new Array(o);
    for (var a1 = 0; a1 < o; a1++) i2[a1] = y(r[a1], a1, e);
    var s = Reflect.apply(t.unshift, t, i2);
    O(t);
    var p = new Array(o);
    for (var a22 = 0; a22 < o; a22++) p[a22] = new c(v, [
      a22
    ], t[a22], void 0, this);
    return u(e, p), s;
  }
  function N(r, e) {
    var t = this[f], o = t.target, n = r.length;
    if (e = e || 0, n > 0) {
      var i2 = o.slice(e, e + n), s = new Array(n);
      for (var a2 = 0; a2 < n; a2++) s[a2] = new c(w, [
        e + a2
      ], r[a2], i2[a2], this);
      d(t, s), o.set(r, e);
      var p = new Array(n);
      for (var a1 = 0; a1 < n; a1++) p[a1] = new c(w, [
        e + a1
      ], o[e + a1], i2[a1], this);
      u(t, p);
    }
  }
  function y(r, e, t, o) {
    return o !== void 0 && o.has(r) ? null : typeof r != "object" || r === null ? r : Array.isArray(r) ? new j({
      target: r,
      ownKey: e,
      parent: t,
      visited: o
    }).proxy : ArrayBuffer.isView(r) ? new P({
      target: r,
      ownKey: e,
      parent: t
    }).proxy : r instanceof Date ? r : new K({
      target: r,
      ownKey: e,
      parent: t,
      visited: o
    }).proxy;
  }
  function q(r, e = void 0) {
    if (!r || typeof r != "object") throw new Error("observable MAY ONLY be created from a non-null object");
    if (r[f]) return r;
    if (Array.isArray(r)) return new j({
      target: r,
      ownKey: null,
      parent: null,
      options: e
    }).proxy;
    if (ArrayBuffer.isView(r)) return new P({
      target: r,
      ownKey: null,
      parent: null,
      options: e
    }).proxy;
    if (r instanceof Date) throw new Error(`${r} found to be one of a non-observable types`);
    return new K({
      target: r,
      ownKey: null,
      parent: null,
      options: e
    }).proxy;
  }
  function O(r, e = 0) {
    for (var t = e, o = r.length; t < o; t++) {
      var n = r[t];
      if (n && typeof n == "object") {
        var i2 = n[f];
        i2 && (i2.ownKey = t);
      }
    }
  }
  function g(r) {
    if (r && typeof r == "object") {
      var e = r[f];
      if (e) return e.detach();
    }
    return r;
  }
  function d(r, e) {
    var t = [], o = r;
    for (; o.parent; ) t.unshift(o.ownKey), o = o.parent;
    var n = o.validators;
    if (n.length === 0) return;
    var i2 = t.length === 0 ? e : e.map((s2) => new c(s2.type, [
      ...t,
      ...s2.path
    ], s2.value, s2.oldValue, s2.object));
    for (var s = 0, p = n.length; s < p; s++) n[s].validate(i2);
  }
  function u(r, e) {
    var t = r, o, n, i2, s, p, a2, l = e.length;
    do {
      for (o = t.async, n = t.observers, a2 = n.length; a2--; ) if ([i2, s] = n[a2], p = X(s, e), p.length) if (o) {
        t.batches.size === 0 && queueMicrotask(Z.bind(t));
        var h = t.batches.get(i2);
        h || (h = [], t.batches.set(i2, h)), h.push(...p);
      } else G(i2, p);
      var b = t.parent;
      if (b) {
        for (var h1 = 0; h1 < l; h1++) {
          var m = e[h1];
          e[h1] = new c(m.type, [
            t.ownKey,
            ...m.path
          ], m.value, m.oldValue, m.object);
        }
        t = b;
      } else break;
    } while (t);
  }
  function X(r, e) {
    if (r === null || !r.filters) return e;
    var t = e, o = r.filters;
    for (var n = 0, i2 = o.length; n < i2 && t.length; n++) t = o[n](t);
    return t;
  }
  function G(r, e) {
    try {
      r(e);
    } catch (t) {
      console.error(`failed to notify listener ${r} with ${e}`, t);
    }
  }
  function Z() {
    var r = this.batches;
    this.batches = /* @__PURE__ */ new Map();
    for (var [e, t] of r) G(e, t);
  }
  function a(e) {
    if (!e) return;
    if (typeof e != "object") throw new Error(`Observable options if/when provided, MAY only be an object, got '${e}'`);
    var t = Object.keys(e).filter((o2) => !(o2 in z));
    if (t.length) throw new Error(`'${t.join(", ")}' is/are not a valid Observable option/s`);
    if (_class_private_field_set(this, _n1, !!e.async), e.validators !== void 0) {
      if (!Array.isArray(e.validators) || e.validators.length === 0) throw new Error('"validators" option, if/when provided, MUST be a non-empty array of Validator instances');
      for (var o of e.validators) if (!(o instanceof M)) throw new Error('"validators" option, if/when provided, MUST be a non-empty array of Validator instances');
      _class_private_field_get(this, _r2).push(...e.validators);
    }
  }
  var _e, _t, _o, _i, _n, _r, _t1, _r1, _e1, _e2, _t2, _o1, _i1, _n1, _r2, _s, _a, _class, _t3, _r3, _e3, _e4, _t4, f, v, w, x, T, R, c, M, z, E, J, j, K, Q, P, k, _, A, H;
  var init_object_observer_min = __esm({
    "node_modules/@gullerya/object-observer/dist/object-observer.min.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_call_super();
      init_class_call_check();
      init_class_private_field_get();
      init_class_private_field_init();
      init_class_private_field_set();
      init_class_private_method_get();
      init_class_private_method_init();
      init_class_static_private_field_spec_get();
      init_create_class();
      init_define_property();
      init_inherits();
      f = /* @__PURE__ */ Symbol.for("object-observer-meta-key-0");
      v = "insert";
      w = "update";
      x = "delete";
      T = "reverse";
      R = "shuffle";
      c = (_e = /* @__PURE__ */ new WeakMap(), _t = /* @__PURE__ */ new WeakMap(), _o = /* @__PURE__ */ new WeakMap(), _i = /* @__PURE__ */ new WeakMap(), _n = /* @__PURE__ */ new WeakMap(), _r = /* @__PURE__ */ new WeakMap(), /* @__PURE__ */ (function() {
        "use strict";
        function _class2(e, t, o, n, i2) {
          _class_call_check(this, _class2);
          _class_private_field_init(this, _e, {
            writable: true,
            value: void 0
          });
          _class_private_field_init(this, _t, {
            writable: true,
            value: void 0
          });
          _class_private_field_init(this, _o, {
            writable: true,
            value: void 0
          });
          _class_private_field_init(this, _i, {
            writable: true,
            value: void 0
          });
          _class_private_field_init(this, _n, {
            writable: true,
            value: void 0
          });
          _class_private_field_init(this, _r, {
            writable: true,
            value: void 0
          });
          _class_private_field_set(this, _e, e), _class_private_field_set(this, _t, t), _class_private_field_set(this, _o, o), _class_private_field_set(this, _i, n), _class_private_field_set(this, _n, i2);
        }
        _create_class(_class2, [
          {
            key: "type",
            get: function get() {
              return _class_private_field_get(this, _e);
            }
          },
          {
            key: "path",
            get: function get() {
              return _class_private_field_get(this, _t);
            }
          },
          {
            key: "value",
            get: function get() {
              return _class_private_field_get(this, _o);
            }
          },
          {
            key: "oldValue",
            get: function get() {
              return _class_private_field_get(this, _i);
            }
          },
          {
            key: "object",
            get: function get() {
              return _class_private_field_get(this, _n);
            }
          },
          {
            key: "pathAsString",
            get: function get() {
              return _class_private_field_get(this, _r) === void 0 && _class_private_field_set(this, _r, _class_private_field_get(this, _t).join(".")), _class_private_field_get(this, _r);
            }
          }
        ]);
        return _class2;
      })());
      M = (_t1 = /* @__PURE__ */ new WeakMap(), _r1 = /* @__PURE__ */ (function() {
        "use strict";
        function r(e, t) {
          _class_call_check(this, r);
          _class_private_field_init(this, _t1, {
            writable: true,
            value: void 0
          });
          if (e !== _class_static_private_field_spec_get(r, _r1, _e1)) throw new Error("Validator class cannot be instantiated directly; use provided factory methods");
          _class_private_field_set(this, _t1, t);
        }
        _create_class(r, [
          {
            key: "validate",
            get: function get() {
              return _class_private_field_get(this, _t1);
            }
          }
        ], [
          {
            key: "custom",
            value: function custom(e) {
              if (typeof e != "function") throw new Error("custom Validator requires a function as argument");
              return new r(_class_static_private_field_spec_get(r, _r1, _e1), e);
            }
          }
        ]);
        return r;
      })(), _e1 = {
        writable: true,
        value: /* @__PURE__ */ Symbol("ValidatorPrivateConstructorKey")
      }, _r1);
      z = {
        async: 1,
        validators: 1
      };
      E = (_e2 = /* @__PURE__ */ new WeakMap(), _t2 = /* @__PURE__ */ new WeakMap(), _o1 = /* @__PURE__ */ new WeakMap(), _i1 = /* @__PURE__ */ new WeakMap(), _n1 = /* @__PURE__ */ new WeakMap(), _r2 = /* @__PURE__ */ new WeakMap(), _s = /* @__PURE__ */ new WeakMap(), _a = /* @__PURE__ */ new WeakSet(), _class = /* @__PURE__ */ (function() {
        "use strict";
        function _class2(e) {
          _class_call_check(this, _class2);
          _class_private_method_init(this, _a);
          _class_private_field_init(this, _e2, {
            writable: true,
            value: void 0
          });
          _define_property(this, "ownKey", void 0);
          _class_private_field_init(this, _t2, {
            writable: true,
            value: void 0
          });
          _class_private_field_init(this, _o1, {
            writable: true,
            value: void 0
          });
          _class_private_field_init(this, _i1, {
            writable: true,
            value: void 0
          });
          _class_private_field_init(this, _n1, {
            writable: true,
            value: false
          });
          _define_property(this, "batches", /* @__PURE__ */ new Map());
          _define_property(this, "set", void 0);
          _define_property(this, "deleteProperty", void 0);
          _class_private_field_init(this, _r2, {
            writable: true,
            value: []
          });
          _class_private_field_init(this, _s, {
            writable: true,
            value: []
          });
          this.set = $, this.deleteProperty = W;
          var { target: t, parent: o, ownKey: n, options: i2, visited: s = /* @__PURE__ */ new Set() } = e;
          o && n !== void 0 ? (_class_private_field_set(this, _e2, o), this.ownKey = n) : (_class_private_field_set(this, _e2, null), this.ownKey = null), s.add(t), _class_private_field_set(this, _t2, this.observedGraphProcessor(t, this, s)), s.delete(t);
          var p = Proxy.revocable(_class_private_field_get(this, _t2), this);
          _class_private_field_set(this, _o1, p.proxy), _class_private_field_set(this, _i1, p.revoke), _class_private_method_get(this, _a, a).call(this, i2);
        }
        _create_class(_class2, [
          {
            key: "detach",
            value: function detach() {
              return _class_private_field_set(this, _e2, null), _class_private_field_get(this, _t2);
            }
          },
          {
            key: "parent",
            get: function get() {
              return _class_private_field_get(this, _e2);
            }
          },
          {
            key: "target",
            get: function get() {
              return _class_private_field_get(this, _t2);
            }
          },
          {
            key: "proxy",
            get: function get() {
              return _class_private_field_get(this, _o1);
            }
          },
          {
            key: "async",
            get: function get() {
              return _class_private_field_get(this, _n1);
            }
          },
          {
            key: "validators",
            get: function get() {
              return _class_private_field_get(this, _r2);
            }
          },
          {
            key: "observers",
            get: function get() {
              return _class_private_field_get(this, _s);
            }
          }
        ]);
        return _class2;
      })(), _class);
      J = {
        copyWithin: S,
        fill: C,
        pop: L,
        push: B,
        reverse: F,
        shift: U,
        sort: V,
        splice: D,
        unshift: I
      };
      j = /* @__PURE__ */ (function(E2) {
        "use strict";
        _inherits(j2, E2);
        function j2() {
          _class_call_check(this, j2);
          return _call_super(this, j2, arguments);
        }
        _create_class(j2, [
          {
            key: "get",
            value: function get(e, t) {
              return J[t] || e[t];
            }
          },
          {
            key: "observedGraphProcessor",
            value: function observedGraphProcessor(e, t, o) {
              var n = e.length, i2 = new Array(n);
              for (var s = 0; s < n; s++) i2[s] = y(e[s], s, t, o);
              return i2[f] = t, i2;
            }
          }
        ]);
        return j2;
      })(E);
      K = /* @__PURE__ */ (function(E2) {
        "use strict";
        _inherits(K2, E2);
        function K2() {
          _class_call_check(this, K2);
          return _call_super(this, K2, arguments);
        }
        _create_class(K2, [
          {
            key: "observedGraphProcessor",
            value: function observedGraphProcessor(e, t, o) {
              var n = {};
              n[f] = t;
              for (var i2 in e) n[i2] = y(e[i2], i2, t, o);
              return n;
            }
          }
        ]);
        return K2;
      })(E);
      Q = {
        copyWithin: S,
        fill: C,
        reverse: F,
        sort: V,
        set: N
      };
      P = /* @__PURE__ */ (function(E2) {
        "use strict";
        _inherits(P2, E2);
        function P2() {
          _class_call_check(this, P2);
          return _call_super(this, P2, arguments);
        }
        _create_class(P2, [
          {
            key: "get",
            value: function get(e, t) {
              return Q[t] || e[t];
            }
          },
          {
            key: "observedGraphProcessor",
            value: function observedGraphProcessor(e, t) {
              return e[f] = t, e;
            }
          }
        ]);
        return P2;
      })(E);
      k = (_t3 = /* @__PURE__ */ new WeakMap(), _r3 = /* @__PURE__ */ (function() {
        "use strict";
        function r(e, t) {
          _class_call_check(this, r);
          _class_private_field_init(this, _t3, {
            writable: true,
            value: void 0
          });
          if (e !== _class_static_private_field_spec_get(r, _r3, _e3)) throw new Error("Filter class cannot be instantiated directly; use provided factory methods");
          _class_private_field_set(this, _t3, t);
        }
        _create_class(r, [
          {
            key: "fn",
            get: function get() {
              return _class_private_field_get(this, _t3);
            }
          }
        ], [
          {
            key: "custom",
            value: function custom(e) {
              if (typeof e != "function") throw new Error("custom Filter requires a function as argument");
              return new r(_class_static_private_field_spec_get(r, _r3, _e3), e);
            }
          },
          {
            key: "exactPaths",
            value: function exactPaths(e) {
              if (!Array.isArray(e) || e.length === 0) throw new Error("exactPaths Filter requires a non-empty array as argument");
              var t = new Set(e);
              return new r(_class_static_private_field_spec_get(r, _r3, _e3), (o) => o.filter((n) => t.has(n.pathAsString)));
            }
          },
          {
            key: "pathsStartWith",
            value: function pathsStartWith(e) {
              if (typeof e != "string" || e === "") throw new Error("pathsStartWith Filter requires a non-empty string as argument");
              return new r(_class_static_private_field_spec_get(r, _r3, _e3), (t) => t.filter((o) => o.pathAsString.startsWith(e)));
            }
          },
          {
            key: "directChildrenOf",
            value: function directChildrenOf(e) {
              if (typeof e != "string") throw new Error("directChildrenOf Filter requires a string as argument (MAY be empty)");
              var t = e.split(".").filter(Boolean), o = t.length, n = t.join(".");
              return new r(_class_static_private_field_spec_get(r, _r3, _e3), (i2) => i2.filter((s) => {
                var p = s.path, a2 = p.length;
                if (a2 === o + 1) {
                  for (var l = 0; l < o; l++) if (p[l] !== t[l]) return false;
                  return true;
                }
                return a2 === o && (s.type === T || s.type === R) ? s.pathAsString === n : false;
              }));
            }
          }
        ]);
        return r;
      })(), _e3 = {
        writable: true,
        value: /* @__PURE__ */ Symbol("FilterPrivateConstructorKey")
      }, _r3);
      _ = (r) => {
        if (!r || typeof r != "object") return null;
        var e = {}, t = [];
        for (var [o, n] of Object.entries(r)) if (o === "filters") {
          if (!Array.isArray(n) || n.length === 0) throw new Error('"filters" option, if/when provided, MUST be a non-empty array of Filter instances');
          var i2 = new Array(n.length);
          for (var s = 0; s < n.length; s++) {
            var p = n[s];
            if (!(p instanceof k)) throw new Error('"filters" option, if/when provided, MUST be a non-empty array of Filter instances');
            i2[s] = p.fn;
          }
          e.filters = i2;
        } else t.push(o);
        if (t.length) throw new Error(`'${t.join(", ")}' is/are not a valid observer option/s`);
        return Object.keys(e).length === 0 ? null : e;
      };
      A = Object.freeze({
        from: q,
        isObservable: (r) => !!(r && r[f]),
        observe: (r, e, t) => {
          if (!A.isObservable(r)) throw new Error("invalid observable parameter");
          if (typeof e != "function") throw new Error(`observer MUST be a function, got '${e}'`);
          var o = r[f].observers;
          o.some((n) => n[0] === e) ? console.warn("observer may be bound to an observable only once; will NOT rebind") : o.push([
            e,
            _(t)
          ]);
        },
        unobserve: (r, ...e) => {
          if (!A.isObservable(r)) throw new Error("invalid observable parameter");
          var t = r[f].observers, o = t.length;
          if (o) {
            if (!e.length) {
              t.splice(0);
              return;
            }
            for (; o; ) e.indexOf(t[--o][0]) >= 0 && t.splice(o, 1);
          }
        }
      });
      H = (_e4 = /* @__PURE__ */ new WeakMap(), _t4 = /* @__PURE__ */ new WeakMap(), /* @__PURE__ */ (function() {
        "use strict";
        function _class2(e) {
          _class_call_check(this, _class2);
          _class_private_field_init(this, _e4, {
            writable: true,
            value: void 0
          });
          _class_private_field_init(this, _t4, {
            writable: true,
            value: void 0
          });
          _class_private_field_set(this, _e4, e), _class_private_field_set(this, _t4, /* @__PURE__ */ new Set()), Object.freeze(this);
        }
        _create_class(_class2, [
          {
            key: "observe",
            value: function observe(e, t) {
              var o = A.from(e);
              return A.observe(o, _class_private_field_get(this, _e4), t), _class_private_field_get(this, _t4).add(o), o;
            }
          },
          {
            key: "unobserve",
            value: function unobserve(e) {
              A.unobserve(e, _class_private_field_get(this, _e4)), _class_private_field_get(this, _t4).delete(e);
            }
          },
          {
            key: "disconnect",
            value: function disconnect() {
              for (var e of _class_private_field_get(this, _t4)) A.unobserve(e, _class_private_field_get(this, _e4));
              _class_private_field_get(this, _t4).clear();
            }
          }
        ]);
        return _class2;
      })());
    }
  });

  // src/lib/api/storage/index.ts
  var storage_exports = {};
  __export(storage_exports, {
    awaitStorage: () => awaitStorage2,
    createStorage: () => createStorage2,
    createStorageAndCallback: () => createStorageAndCallback,
    createStorageAsync: () => createStorageAsync,
    getPreloadedStorage: () => getPreloadedStorage,
    preloadStorageIfExists: () => preloadStorageIfExists,
    purgeStorage: () => purgeStorage2,
    updateStorage: () => updateStorage,
    useObservable: () => useObservable
  });
  function getObservableRuntime() {
    if (_ObservableRuntime) return _ObservableRuntime;
    var mod = (init_object_observer_min(), __toCommonJS(object_observer_min_exports));
    _ObservableRuntime = mod.Observable ?? mod;
    return _ObservableRuntime;
  }
  function createFileBackend2(filePath) {
    var write = debounce((data) => {
      writeFile(filePath, JSON.stringify(data));
    }, 500);
    return {
      get: () => _async_to_generator(function* () {
        try {
          return JSON.parse(yield readFile(filePath));
        } catch (e) {
          throw new Error(`Failed to parse storage from '${filePath}'`, {
            cause: e
          });
        }
      })(),
      set: (data) => _async_to_generator(function* () {
        if (!data || typeof data !== "object") {
          throw new Error("data needs to be an object");
        }
        write(data);
      })(),
      exists: () => _async_to_generator(function* () {
        return yield fileExists(filePath);
      })()
    };
  }
  function useObservable(observables, opts) {
    if (observables.some((o) => o?.[storageInitErrorSymbol])) throw new Error("An error occured while initializing the storage");
    if (observables.some((o) => !getObservableRuntime().isObservable(o))) {
      throw new Error("Argument passed isn't an Observable");
    }
    var [, forceUpdate] = React.useReducer((n) => ~n, 0);
    React.useEffect(() => {
      var listener = () => forceUpdate();
      observables.forEach((o) => getObservableRuntime().observe(o, listener, opts));
      return () => {
        observables.forEach((o) => getObservableRuntime().unobserve(o, listener));
      };
    }, []);
  }
  function updateStorage(path, value) {
    return _async_to_generator(function* () {
      _loadedStorage[path] = value;
      createFileBackend2(path).set(value);
    })();
  }
  function createStorageAndCallback(path, cb, { dflt = {}, nullIfEmpty = false } = {}) {
    var emitter;
    var callback = (data) => {
      var proxy = new Proxy(getObservableRuntime().from(data), {
        get(target, prop2, receiver) {
          if (prop2 === /* @__PURE__ */ Symbol.for("vendetta.storage.emitter")) {
            if (emitter) return emitter;
            emitter = new Emitter();
            getObservableRuntime().observe(target, (changes2) => {
              for (var change of changes2) {
                emitter.emit(change.type !== "delete" ? "SET" : "DEL", {
                  path: change.path,
                  value: change.value
                });
              }
            });
            return emitter;
          }
          return Reflect.get(target, prop2, receiver);
        }
      });
      var handler = () => backend.set(proxy);
      getObservableRuntime().observe(proxy, handler);
      cb(proxy);
    };
    var backend = createFileBackend2(path);
    if (_loadedStorage[path]) {
      callback(_loadedStorage[path]);
    } else {
      backend.exists().then((exists) => _async_to_generator(function* () {
        if (!exists) {
          if (nullIfEmpty) {
            callback(_loadedStorage[path] = null);
          } else {
            _loadedStorage[path] = dflt;
            yield backend.set(dflt);
            callback(dflt);
          }
        } else {
          callback(_loadedStorage[path] = yield backend.get());
        }
      })());
    }
  }
  function createStorageAsync(_0) {
    return _async_to_generator(function* (path, opts = {}) {
      return new Promise((r) => createStorageAndCallback(path, r, opts));
    }).apply(this, arguments);
  }
  function preloadStorageIfExists(path) {
    return _async_to_generator(function* () {
      if (_loadedStorage[path]) return true;
      var backend = createFileBackend2(path);
      if (yield backend.exists()) {
        _loadedStorage[path] = yield backend.get();
        return true;
      }
      return false;
    })();
  }
  function purgeStorage2(path) {
    return _async_to_generator(function* () {
      yield removeFile(path);
      delete _loadedStorage[path];
    })();
  }
  function awaitStorage2(...proxies) {
    return Promise.all(proxies.map((proxy) => proxy[storagePromiseSymbol]));
  }
  function getPreloadedStorage(path) {
    return _loadedStorage[path];
  }
  var _ObservableRuntime, storageInitErrorSymbol, storagePromiseSymbol, _loadedStorage, createStorage2;
  var init_storage2 = __esm({
    "src/lib/api/storage/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_Emitter();
      init_fs();
      init_dist();
      _ObservableRuntime = null;
      storageInitErrorSymbol = /* @__PURE__ */ Symbol.for("bunny.storage.initError");
      storagePromiseSymbol = /* @__PURE__ */ Symbol.for("bunny.storage.promise");
      _loadedStorage = {};
      createStorage2 = (path, opts = {}) => {
        var promise = new Promise((r) => resolvePromise = r);
        var awaited, resolved, error, resolvePromise;
        createStorageAndCallback(path, (proxy) => {
          awaited = proxy;
          resolved = true;
          resolvePromise();
        }, opts);
        var check = () => {
          if (resolved) return true;
          throw new Error(`Attempted to access storage without initializing: ${path}`);
        };
        return new Proxy({}, {
          ...Object.fromEntries(Object.getOwnPropertyNames(Reflect).map((k2) => [
            k2,
            (t, ...a2) => {
              return check() && Reflect[k2](awaited, ...a2);
            }
          ])),
          get(target, prop2, recv) {
            if (prop2 === storageInitErrorSymbol) return error;
            if (prop2 === storagePromiseSymbol) return promise;
            return check() && Reflect.get(awaited ?? target, prop2, recv);
          }
        });
      };
    }
  });

  // src/lib/utils/constants.ts
  var constants_exports = {};
  __export(constants_exports, {
    DISCORD_SERVER: () => DISCORD_SERVER,
    GITHUB: () => GITHUB,
    HTTP_REGEX: () => HTTP_REGEX,
    HTTP_REGEX_MULTI: () => HTTP_REGEX_MULTI,
    KETTU_DISCORD_SERVER_ID: () => KETTU_DISCORD_SERVER_ID,
    KETTU_PLUGINS_CHANNEL_ID: () => KETTU_PLUGINS_CHANNEL_ID,
    KETTU_THEMES_CHANNEL_ID: () => KETTU_THEMES_CHANNEL_ID,
    NEXPID_PLUGINS_REPO_URL: () => NEXPID_PLUGINS_REPO_URL,
    OFFICIAL_PLUGINS_REPO_URL: () => OFFICIAL_PLUGINS_REPO_URL,
    VD_DISCORD_SERVER_ID: () => VD_DISCORD_SERVER_ID,
    VD_PLUGINS_CHANNEL_ID: () => VD_PLUGINS_CHANNEL_ID,
    VD_PROXY_PREFIX: () => VD_PROXY_PREFIX,
    VD_THEMES_CHANNEL_ID: () => VD_THEMES_CHANNEL_ID
  });
  var DISCORD_SERVER, GITHUB, HTTP_REGEX, HTTP_REGEX_MULTI, NEXPID_PLUGINS_REPO_URL, OFFICIAL_PLUGINS_REPO_URL, VD_PROXY_PREFIX, VD_DISCORD_SERVER_ID, VD_PLUGINS_CHANNEL_ID, VD_THEMES_CHANNEL_ID, KETTU_DISCORD_SERVER_ID, KETTU_PLUGINS_CHANNEL_ID, KETTU_THEMES_CHANNEL_ID;
  var init_constants = __esm({
    "src/lib/utils/constants.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      DISCORD_SERVER = "https://discord.gg/nQykFF9Ud6";
      GITHUB = "https://github.com/kmmiio99o/ShiggyCord";
      HTTP_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
      HTTP_REGEX_MULTI = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&\/=]*)/g;
      NEXPID_PLUGINS_REPO_URL = "https://revenge.nexpid.xyz";
      OFFICIAL_PLUGINS_REPO_URL = "https://raw.githubusercontent.com/Purple-EyeZ/Plugins-List/refs/heads/main/src/plugins-data.json";
      VD_PROXY_PREFIX = "https://vd-plugins.github.io/proxy";
      VD_DISCORD_SERVER_ID = "1427396621905432699";
      VD_PLUGINS_CHANNEL_ID = "1432796541210333284";
      VD_THEMES_CHANNEL_ID = "1408405946434195540";
      KETTU_DISCORD_SERVER_ID = "1368145952266911755";
      KETTU_PLUGINS_CHANNEL_ID = "1432796541210333284";
      KETTU_THEMES_CHANNEL_ID = "1408405946434195540";
    }
  });

  // src/lib/utils/cyrb64.ts
  function cyrb64(str, seed = 0) {
    var h1 = 3735928559 ^ seed, h2 = 1103547991 ^ seed;
    for (var i2 = 0, ch; i2 < str.length; i2++) {
      ch = str.charCodeAt(i2);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507);
    h1 ^= Math.imul(h2 ^ h2 >>> 13, 3266489909);
    h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507);
    h2 ^= Math.imul(h1 ^ h1 >>> 13, 3266489909);
    return [
      h2 >>> 0,
      h1 >>> 0
    ];
  }
  function cyrb64Hash(str, seed = 0) {
    var [h2, h1] = cyrb64(str, seed);
    return h2.toString(36).padStart(7, "0") + h1.toString(36).padStart(7, "0");
  }
  var init_cyrb64 = __esm({
    "src/lib/utils/cyrb64.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // src/lib/utils/findInReactTree.ts
  function findInReactTree(tree, filter) {
    return findInTree(tree, filter, {
      walkable: [
        "props",
        "children",
        "child",
        "sibling"
      ]
    });
  }
  var init_findInReactTree = __esm({
    "src/lib/utils/findInReactTree.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_utils();
    }
  });

  // src/lib/utils/findInTree.ts
  function treeSearch(tree, filter, walkable, ignore, maxDepth, depth) {
    if (depth > maxDepth) return;
    if (!tree) return;
    try {
      if (filter(tree)) return tree;
    } catch (unused) {
    }
    if (Array.isArray(tree)) {
      for (var item of tree) {
        if (typeof item !== "object" || item === null) continue;
        try {
          var found = treeSearch(item, filter, walkable, ignore, maxDepth, depth + 1);
          if (found) return found;
        } catch (unused) {
        }
      }
    } else if (typeof tree === "object") {
      for (var key2 in tree) {
        if (Object.prototype.hasOwnProperty.call(tree, key2) === false) continue;
        if (typeof tree[key2] !== "object" || tree[key2] === null) continue;
        if (walkable.size && !walkable.has(key2)) continue;
        if (ignore.size && ignore.has(key2)) continue;
        try {
          var found1 = treeSearch(tree[key2], filter, walkable, ignore, maxDepth, depth + 1);
          if (found1) return found1;
        } catch (unused) {
        }
      }
    }
  }
  function findInTree(tree, filter, { walkable = [], ignore = [], maxDepth = 100 } = {}) {
    return treeSearch(tree, filter, new Set(walkable), new Set(ignore), maxDepth, 0);
  }
  var init_findInTree = __esm({
    "src/lib/utils/findInTree.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // src/lib/utils/hookDefineProperty.ts
  function hookDefineProperty(target, property, cb) {
    var targetAsAny = target;
    if (property in target) {
      return void cb(targetAsAny[property]);
    }
    var value;
    Object.defineProperty(targetAsAny, property, {
      get: () => value,
      set(v2) {
        value = cb(v2) ?? v2;
      },
      configurable: true,
      enumerable: false
    });
    return () => {
      delete targetAsAny[property];
      targetAsAny[property] = value;
    };
  }
  var init_hookDefineProperty = __esm({
    "src/lib/utils/hookDefineProperty.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // src/lib/utils/invariant.ts
  function invariant(condition, message) {
    if (condition) return;
    var resolvedMessage = typeof message === "function" ? message() : message;
    var prefix = "[Invariant Violation]";
    var value = resolvedMessage ? `${prefix}: ${resolvedMessage}` : prefix;
    throw new Error(value);
  }
  var init_invariant = __esm({
    "src/lib/utils/invariant.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // src/lib/utils/logger.ts
  var logger_exports = {};
  __export(logger_exports, {
    LoggerClass: () => LoggerClass,
    connectToDebugger: () => connectToDebugger,
    disconnectFromDebugger: () => disconnectFromDebugger,
    isConnectedToDebugger: () => isConnectedToDebugger,
    logger: () => logger
  });
  function serializeMessage(msg) {
    return JSON.stringify(msg);
  }
  function sendLog(level, ...args) {
    if (socket?.readyState === WebSocket.OPEN) {
      var message = {
        type: "log",
        data: {
          level,
          message: args
        }
      };
      socket.send(serializeMessage(message));
    }
  }
  function patchConsoleAndLogger() {
    originalConsoleLog = console.log;
    console.log = function(...args) {
      originalConsoleLog.apply(console, args);
      sendLog("default", ...args);
    };
    originalConsoleError = console.error;
    console.error = function(...args) {
      originalConsoleError.apply(console, args);
      sendLog("error", ...args);
    };
    originalConsoleWarn = console.warn;
    console.warn = function(...args) {
      originalConsoleWarn.apply(console, args);
      sendLog("warn", ...args);
    };
    if (logger) {
      originalLoggerLog = logger.log;
      logger.log = function(...args) {
        originalLoggerLog.apply(logger, args);
        sendLog("default", ...args);
      };
      originalLoggerError = logger.error;
      logger.error = function(...args) {
        originalLoggerError.apply(logger, args);
        sendLog("error", ...args);
      };
      originalLoggerWarn = logger.warn;
      logger.warn = function(...args) {
        originalLoggerWarn.apply(logger, args);
        sendLog("warn", ...args);
      };
    }
  }
  function unpatchConsoleAndLogger() {
    if (originalConsoleLog) {
      console.log = originalConsoleLog;
      originalConsoleLog = void 0;
    }
    if (originalConsoleError) {
      console.error = originalConsoleError;
      originalConsoleError = void 0;
    }
    if (originalConsoleWarn) {
      console.warn = originalConsoleWarn;
      originalConsoleWarn = void 0;
    }
    if (logger) {
      if (originalLoggerLog) {
        logger.log = originalLoggerLog;
        originalLoggerLog = void 0;
      }
      if (originalLoggerError) {
        logger.error = originalLoggerError;
        originalLoggerError = void 0;
      }
      if (originalLoggerWarn) {
        logger.warn = originalLoggerWarn;
        originalLoggerWarn = void 0;
      }
    }
  }
  function connectToDebugger(url2) {
    if (socket !== void 0 && socket.readyState !== WebSocket.CLOSED) {
      unpatchConsoleAndLogger();
      socket.close();
    }
    if (!url2) {
      console.error("Invalid debugger URL!");
      return;
    }
    try {
      socket = new WebSocket(`ws://${url2}`);
      socket.addEventListener("open", () => {
        console.log("Connected to debugger.");
        var hello = {
          type: "hello",
          data: {
            version: VERSION
          }
        };
        socket?.send(serializeMessage(hello));
        patchConsoleAndLogger();
      });
      socket.addEventListener("message", (message) => {
        try {
          var data = JSON.parse(message.data);
          if (data.type === "run" && data.data?.code) {
            try {
              (0, eval)(data.data.code);
            } catch (e) {
              console.error("Error executing remote code:", e);
            }
          }
        } catch (e) {
          console.error("Error processing message:", e);
        }
      });
      socket.addEventListener("close", () => {
        console.log("Disconnected from debugger.");
        unpatchConsoleAndLogger();
      });
      socket.addEventListener("error", (err) => {
        console.error(`Debugger error: ${err.message}`);
        unpatchConsoleAndLogger();
      });
    } catch (e) {
      console.error("Failed to connect to debugger:", e);
    }
  }
  function disconnectFromDebugger() {
    if (socket) {
      unpatchConsoleAndLogger();
      socket.close();
      socket = void 0;
    }
  }
  function isConnectedToDebugger() {
    return socket?.readyState === WebSocket.OPEN;
  }
  var LoggerClass, logger, socket, originalConsoleLog, originalConsoleError, originalConsoleWarn, originalLoggerLog, originalLoggerError, originalLoggerWarn, VERSION;
  var init_logger = __esm({
    "src/lib/utils/logger.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_wrappers();
      LoggerClass = findByNameLazy("Logger");
      logger = new LoggerClass("ShiggyCord");
      VERSION = 1;
    }
  });

  // src/lib/utils/safeFetch.ts
  function safeFetch(input, options, timeout = 1e4) {
    return _async_to_generator(function* () {
      var req = yield fetch(input, {
        signal: timeoutSignal(timeout),
        ...options
      });
      if (!req.ok) throw new Error(`Request returned non-ok: ${req.status} ${req.statusText}`);
      return req;
    })();
  }
  function timeoutSignal(ms) {
    var controller = new AbortController();
    setTimeout(() => controller.abort(`Timed out after ${ms}ms`), ms);
    return controller.signal;
  }
  var init_safeFetch = __esm({
    "src/lib/utils/safeFetch.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
    }
  });

  // src/lib/utils/index.ts
  var utils_exports = {};
  __export(utils_exports, {
    constants: () => constants_exports,
    cyrb64: () => cyrb64,
    findInReactTree: () => findInReactTree,
    findInTree: () => findInTree,
    hookDefineProperty: () => hookDefineProperty,
    invariant: () => invariant,
    lazy: () => lazy_exports,
    logger: () => logger_exports,
    safeFetch: () => safeFetch
  });
  var init_utils = __esm({
    "src/lib/utils/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_constants();
      init_cyrb64();
      init_findInReactTree();
      init_findInTree();
      init_hookDefineProperty();
      init_invariant();
      init_lazy();
      init_logger();
      init_safeFetch();
    }
  });

  // shims/jsxRuntime.ts
  var jsxRuntime_exports = {};
  __export(jsxRuntime_exports, {
    Fragment: () => Fragment,
    jsx: () => jsx,
    jsxs: () => jsxs
  });
  function unproxyFirstArg(args) {
    if (!args[0]) {
      throw new Error("The first argument (Component) is falsy. Ensure that you are passing a valid component.");
    }
    var factory = getProxyFactory(args[0]);
    if (factory) args[0] = factory();
    return args;
  }
  var jsxRuntime, Fragment, jsx, jsxs;
  var init_jsxRuntime = __esm({
    "shims/jsxRuntime.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_lazy();
      init_wrappers();
      jsxRuntime = findByPropsLazy("jsx", "jsxs", "Fragment");
      Fragment = /* @__PURE__ */ Symbol.for("react.fragment");
      jsx = (...args) => jsxRuntime.jsx(...unproxyFirstArg(args));
      jsxs = (...args) => jsxRuntime.jsxs(...unproxyFirstArg(args));
    }
  });

  // src/lib/addons/themes/colors/preferences.ts
  var colorsPref;
  var init_preferences = __esm({
    "src/lib/addons/themes/colors/preferences.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_storage2();
      colorsPref = createStorage2("themes/colors/preferences.json", {
        dflt: {
          selected: null,
          customBackground: null
        }
      });
    }
  });

  // src/metro/common/components.ts
  var components_exports = {};
  __export(components_exports, {
    ActionSheet: () => ActionSheet,
    ActionSheetRow: () => ActionSheetRow,
    AlertActionButton: () => AlertActionButton,
    AlertActions: () => AlertActions,
    AlertModal: () => AlertModal,
    Avatar: () => Avatar,
    AvatarPile: () => AvatarPile,
    BottomSheetTitleHeader: () => BottomSheetTitleHeader,
    Button: () => Button,
    Card: () => Card,
    CompatButton: () => CompatButton,
    CompatSegmentedControl: () => CompatSegmentedControl,
    ContextMenu: () => ContextMenu,
    FlashList: () => FlashList,
    FloatingActionButton: () => FloatingActionButton,
    FormCheckbox: () => FormCheckbox,
    FormRadio: () => FormRadio,
    FormSwitch: () => FormSwitch,
    Forms: () => Forms,
    HelpMessage: () => HelpMessage,
    IconButton: () => IconButton,
    LegacyAlert: () => LegacyAlert,
    LegacyForm: () => LegacyForm,
    LegacyFormArrow: () => LegacyFormArrow,
    LegacyFormCTA: () => LegacyFormCTA,
    LegacyFormCTAButton: () => LegacyFormCTAButton,
    LegacyFormCardSection: () => LegacyFormCardSection,
    LegacyFormCheckbox: () => LegacyFormCheckbox,
    LegacyFormCheckboxRow: () => LegacyFormCheckboxRow,
    LegacyFormCheckmark: () => LegacyFormCheckmark,
    LegacyFormDivider: () => LegacyFormDivider,
    LegacyFormHint: () => LegacyFormHint,
    LegacyFormIcon: () => LegacyFormIcon,
    LegacyFormInput: () => LegacyFormInput,
    LegacyFormLabel: () => LegacyFormLabel,
    LegacyFormRadio: () => LegacyFormRadio,
    LegacyFormRadioGroup: () => LegacyFormRadioGroup,
    LegacyFormRadioRow: () => LegacyFormRadioRow,
    LegacyFormRow: () => LegacyFormRow,
    LegacyFormSection: () => LegacyFormSection,
    LegacyFormSelect: () => LegacyFormSelect,
    LegacyFormSliderRow: () => LegacyFormSliderRow,
    LegacyFormSubLabel: () => LegacyFormSubLabel,
    LegacyFormSwitch: () => LegacyFormSwitch,
    LegacyFormSwitchRow: () => LegacyFormSwitchRow,
    LegacyFormTernaryCheckBox: () => LegacyFormTernaryCheckBox,
    LegacyFormText: () => LegacyFormText,
    LegacyFormTitle: () => LegacyFormTitle,
    PressableScale: () => PressableScale,
    RedesignCompat: () => RedesignCompat,
    RowButton: () => RowButton,
    SafeAreaProvider: () => SafeAreaProvider,
    SafeAreaView: () => SafeAreaView,
    SegmentedControl: () => SegmentedControl,
    SegmentedControlPages: () => SegmentedControlPages,
    Stack: () => Stack,
    TableCheckbox: () => TableCheckbox,
    TableCheckboxRow: () => TableCheckboxRow,
    TableRadio: () => TableRadio,
    TableRadioGroup: () => TableRadioGroup,
    TableRadioRow: () => TableRadioRow,
    TableRow: () => TableRow,
    TableRowGroup: () => TableRowGroup,
    TableRowIcon: () => TableRowIcon,
    TableRowTrailingText: () => TableRowTrailingText,
    TableSwitch: () => TableSwitch,
    TableSwitchRow: () => TableSwitchRow,
    Text: () => Text,
    TextArea: () => TextArea,
    TextInput: () => TextInput,
    TwinButtons: () => TwinButtons,
    useSafeAreaInsets: () => useSafeAreaInsets,
    useSegmentedControlState: () => useSegmentedControlState
  });
  var bySingularProp, findSingular, findProp, LegacyAlert, CompatButton, HelpMessage, SafeAreaView, SafeAreaProvider, useSafeAreaInsets, ActionSheetRow, Button, TwinButtons, IconButton, RowButton, PressableScale, TableRow, TableRowIcon, TableRowTrailingText, TableRowGroup, TableRadioGroup, TableRadioRow, TableSwitchRow, TableCheckboxRow, TableSwitch, TableRadio, TableCheckbox, FormSwitch, FormRadio, FormCheckbox, Card, RedesignCompat, AlertModal, AlertActionButton, AlertActions, AvatarPile, ContextMenu, Stack, Avatar, TextInput, TextArea, SegmentedControl, SegmentedControlPages, useSegmentedControlState, CompatSegmentedControl, FloatingActionButton, ActionSheet, BottomSheetTitleHeader, textsModule, Text, Forms, LegacyForm, LegacyFormArrow, LegacyFormCTA, LegacyFormCTAButton, LegacyFormCardSection, LegacyFormCheckbox, LegacyFormCheckboxRow, LegacyFormCheckmark, LegacyFormDivider, LegacyFormHint, LegacyFormIcon, LegacyFormInput, LegacyFormLabel, LegacyFormRadio, LegacyFormRadioGroup, LegacyFormRadioRow, LegacyFormRow, LegacyFormSection, LegacyFormSelect, LegacyFormSliderRow, LegacyFormSubLabel, LegacyFormSwitch, LegacyFormSwitchRow, LegacyFormTernaryCheckBox, LegacyFormText, LegacyFormTitle, FlashList;
  var init_components = __esm({
    "src/metro/common/components.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_lazy();
      init_factories();
      init_finders();
      init_wrappers();
      bySingularProp = createFilterDefinition(([prop2], m) => m[prop2] && Object.keys(m).length === 1, (prop2) => `bunny.metro.common.components.bySingularProp(${prop2})`);
      findSingular = (prop2) => proxyLazy(() => findExports(bySingularProp(prop2))?.[prop2]);
      findProp = (...props) => proxyLazy(() => findByProps(...props)[props[0]]);
      LegacyAlert = findByDisplayNameLazy("FluxContainer(Alert)");
      CompatButton = findByPropsLazy("Looks", "Colors", "Sizes");
      HelpMessage = findByNameLazy("HelpMessage");
      ({ SafeAreaView, SafeAreaProvider, useSafeAreaInsets } = lazyDestructure(() => findByProps("useSafeAreaInsets")));
      ActionSheetRow = findProp("ActionSheetRow");
      Button = findSingular("Button");
      TwinButtons = findProp("TwinButtons");
      IconButton = findSingular("IconButton");
      RowButton = findProp("RowButton");
      PressableScale = findProp("PressableScale");
      TableRow = findProp("TableRow");
      TableRowIcon = findProp("TableRowIcon");
      TableRowTrailingText = findProp("TableRowTrailingText");
      TableRowGroup = findProp("TableRowGroup");
      TableRadioGroup = findProp("TableRadioGroup");
      TableRadioRow = findProp("TableRadioRow");
      TableSwitchRow = findProp("TableSwitchRow");
      TableCheckboxRow = findProp("TableCheckboxRow");
      TableSwitch = findSingular("FormSwitch");
      TableRadio = findSingular("FormRadio");
      TableCheckbox = findSingular("FormCheckbox");
      FormSwitch = findSingular("FormSwitch");
      FormRadio = findSingular("FormRadio");
      FormCheckbox = findSingular("FormCheckbox");
      Card = findProp("Card");
      RedesignCompat = proxyLazy(() => findByProps("RedesignCompat").RedesignCompat);
      AlertModal = findProp("AlertModal");
      AlertActionButton = findProp("AlertActionButton");
      AlertActions = findProp("AlertActions");
      AvatarPile = findSingular("AvatarPile");
      ContextMenu = findProp("ContextMenu");
      Stack = findProp("Stack");
      Avatar = findProp("default", "AvatarSizes", "getStatusSize");
      TextInput = findSingular("TextInput");
      TextArea = findSingular("TextArea");
      SegmentedControl = findProp("SegmentedControl");
      SegmentedControlPages = findProp("SegmentedControlPages");
      useSegmentedControlState = findSingular("useSegmentedControlState");
      CompatSegmentedControl = findProp("CompatSegmentedControl");
      FloatingActionButton = findProp("FloatingActionButton");
      ActionSheet = findProp("ActionSheet");
      BottomSheetTitleHeader = findProp("BottomSheetTitleHeader");
      textsModule = findByPropsLazy("Text", "LegacyText");
      Text = proxyLazy(() => textsModule.Text);
      Forms = findByPropsLazy("Form", "FormSection");
      ({ Form: LegacyForm, FormArrow: LegacyFormArrow, FormCTA: LegacyFormCTA, FormCTAButton: LegacyFormCTAButton, FormCardSection: LegacyFormCardSection, FormCheckbox: LegacyFormCheckbox, FormCheckboxRow: LegacyFormCheckboxRow, FormCheckmark: LegacyFormCheckmark, FormDivider: LegacyFormDivider, FormHint: LegacyFormHint, FormIcon: LegacyFormIcon, FormInput: LegacyFormInput, FormLabel: LegacyFormLabel, FormRadio: LegacyFormRadio, FormRadioGroup: LegacyFormRadioGroup, FormRadioRow: LegacyFormRadioRow, FormRow: LegacyFormRow, FormSection: LegacyFormSection, FormSelect: LegacyFormSelect, FormSliderRow: LegacyFormSliderRow, FormSubLabel: LegacyFormSubLabel, FormSwitch: LegacyFormSwitch, FormSwitchRow: LegacyFormSwitchRow, FormTernaryCheckBox: LegacyFormTernaryCheckBox, FormText: LegacyFormText, FormTitle: LegacyFormTitle } = lazyDestructure(() => Forms));
      FlashList = findProp("FlashList");
    }
  });

  // src/metro/common/index.ts
  var common_exports = {};
  __export(common_exports, {
    Flux: () => Flux,
    FluxDispatcher: () => FluxDispatcher,
    FluxUtils: () => FluxUtils,
    NavigationNative: () => NavigationNative,
    React: () => React2,
    ReactNative: () => ReactNative,
    assets: () => assets,
    channels: () => channels,
    clipboard: () => clipboard,
    commands: () => commands,
    components: () => components_exports,
    constants: () => constants,
    i18n: () => i18n,
    invites: () => invites,
    messageUtil: () => messageUtil,
    navigation: () => navigation,
    navigationStack: () => navigationStack,
    semver: () => semver,
    toasts: () => toasts,
    tokens: () => tokens,
    url: () => url,
    useToken: () => useToken
  });
  var import_react_native2, constants, channels, i18n, clipboard, assets, invites, commands, navigation, toasts, messageUtil, navigationStack, NavigationNative, semver, tokens, useToken, openURL, url, Flux, FluxDispatcher, FluxUtils, React2, ReactNative;
  var init_common = __esm({
    "src/metro/common/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_lazy();
      init_wrappers();
      import_react_native2 = __toESM(require_react_native());
      init_components();
      constants = findByPropsLazy("Fonts", "Permissions");
      channels = findByPropsLazy("getVoiceChannelId");
      i18n = findByPropsLazy("Messages");
      clipboard = findByPropsLazy("setString", "getString", "hasString");
      assets = findByPropsLazy("registerAsset");
      invites = findByPropsLazy("acceptInviteAndTransitionToInviteChannel");
      commands = findByPropsLazy("getBuiltInCommands");
      navigation = findByPropsLazy("pushLazy");
      toasts = findByPropsLazy("open");
      messageUtil = findByPropsLazy("sendBotMessage");
      navigationStack = findByPropsLazy("createStackNavigator");
      NavigationNative = findByPropsLazy("NavigationContainer");
      semver = findByPropsLazy("parse", "clean");
      tokens = findByPropsLazy("unsafe_rawColors", "colors");
      ({ useToken } = lazyDestructure(() => findByProps("useToken")));
      openURL = (url2) => import_react_native2.Linking.openURL(url2);
      url = nativeModuleProxy.NativeLinkingModule || nativeModuleProxy.DCDLinkingManager ? {
        openURL,
        openDeeplink: openURL,
        handleSupportedURL: openURL,
        isDiscordConnectOauth2Deeplink: () => {
          console.warn("url.isDiscordConnectOauth2Deeplink is not implemented and will always return false");
          return false;
        },
        showLongPressUrlActionSheet: () => console.warn("url.showLongPressUrlActionSheet is not implemented"),
        handleMessageLinking: findByFilePathLazy("modules/links/native/handleContentLinking.tsx", true)
      } : findByPropsLazy("openURL", "openDeeplink");
      Flux = findByPropsLazy("connectStores");
      FluxDispatcher = findByProps("_interceptors");
      FluxUtils = findByProps("useStateFromStores");
      React2 = globalThis.React = findByPropsLazy("createElement");
      ReactNative = globalThis.ReactNative = findByPropsLazy("AppRegistry");
    }
  });

  // src/metro/index.ts
  var metro_exports = {};
  __export(metro_exports, {
    common: () => common_exports,
    factories: () => factories_exports,
    filters: () => filters_exports,
    findAllExports: () => findAllExports,
    findAllModule: () => findAllModule,
    findAllModuleId: () => findAllModuleId,
    findByDisplayName: () => findByDisplayName,
    findByDisplayNameAll: () => findByDisplayNameAll,
    findByDisplayNameLazy: () => findByDisplayNameLazy,
    findByFilePath: () => findByFilePath,
    findByFilePathLazy: () => findByFilePathLazy,
    findByName: () => findByName,
    findByNameAll: () => findByNameAll,
    findByNameLazy: () => findByNameLazy,
    findByProps: () => findByProps,
    findByPropsAll: () => findByPropsAll,
    findByPropsLazy: () => findByPropsLazy,
    findByStoreName: () => findByStoreName,
    findByStoreNameLazy: () => findByStoreNameLazy,
    findByTypeName: () => findByTypeName,
    findByTypeNameAll: () => findByTypeNameAll,
    findByTypeNameLazy: () => findByTypeNameLazy,
    findExports: () => findExports,
    findModule: () => findModule,
    findModuleId: () => findModuleId,
    lazy: () => lazy_exports2
  });
  var init_metro = __esm({
    "src/metro/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_common();
      init_factories();
      init_filters();
      init_finders();
      init_lazy2();
      init_wrappers();
    }
  });

  // globals:chroma-js
  var require_chroma_js = __commonJS({
    "globals:chroma-js"(exports, module) {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      module.exports = require_depsModule()["chroma-js"];
    }
  });

  // src/lib/addons/themes/colors/parser.ts
  function parseColorManifest(manifest) {
    var resolveType = (type2 = "dark") => (colorsPref.type ?? type2) === "dark" ? "darker" : "light";
    if (manifest.spec === 3) {
      var semanticColorDefinitions = {};
      for (var [semanticColorKey, semanticColorValue] of Object.entries(manifest.main.semantic ?? {})) {
        if (typeof semanticColorValue === "object") {
          var { type, value, opacity: semanticColorOpacity } = semanticColorValue;
          if (type === "raw") {
            semanticColorDefinitions[semanticColorKey] = {
              value,
              opacity: semanticColorOpacity ?? 1
            };
          } else {
            var rawColorValue = tokenRef.RawColor[value];
            semanticColorDefinitions[semanticColorKey] = {
              value: rawColorValue,
              opacity: semanticColorOpacity ?? 1
            };
          }
        } else if (typeof semanticColorValue === "string") {
          if (semanticColorValue.startsWith("#")) {
            semanticColorDefinitions[semanticColorKey] = {
              value: getChroma()(semanticColorValue).hex(),
              opacity: 1
            };
          } else {
            semanticColorDefinitions[semanticColorKey] = {
              value: tokenRef.RawColor[semanticColorValue],
              opacity: 1
            };
          }
        } else {
          throw new Error(`Invalid semantic definitions: ${semanticColorValue}`);
        }
      }
      if (import_react_native3.Platform.OS === "android") applyAndroidAlphaKeys(manifest.main.raw);
      return {
        spec: 3,
        reference: resolveType(manifest.type),
        semantic: semanticColorDefinitions,
        raw: manifest.main.raw ?? {},
        background: manifest.main.background
      };
    }
    if (manifest.spec === 2) {
      var semanticDefinitions = {};
      var background = manifest.background ? {
        ...omit(manifest.background, [
          "alpha"
        ]),
        opacity: manifest.background.alpha
      } : void 0;
      if (manifest.semanticColors) {
        for (var key2 in manifest.semanticColors) {
          var values = manifest.semanticColors[key2].map((c2) => c2 || void 0).slice(0, 2);
          if (!values[0]) continue;
          semanticDefinitions[key2] = {
            value: normalizeToHex(values[resolveType() === "light" ? 1 : 0]),
            opacity: 1
          };
        }
      }
      if (manifest.rawColors) {
        var draft = {};
        for (var key1 in manifest.rawColors) {
          var value1 = manifest.rawColors[key1];
          if (!value1) continue;
          draft[key1] = normalizeToHex(value1);
        }
        if (import_react_native3.Platform.OS === "android") applyAndroidAlphaKeys(draft);
        manifest.rawColors = draft;
      }
      return {
        spec: 2,
        reference: resolveType(),
        semantic: semanticDefinitions,
        raw: manifest.rawColors ?? {},
        background
      };
    }
    if (manifest.spec === 1 || manifest.theme_color_map && !manifest.spec) {
      var semanticDefinitions1 = {};
      var rawDefinitions = {};
      var themeIndex = resolveType() === "light" ? 1 : 0;
      if (manifest.theme_color_map) {
        for (var [key22, colorArray] of Object.entries(manifest.theme_color_map)) {
          if (!Array.isArray(colorArray) || colorArray.length < 2) {
            console.warn(`[Parser] Invalid color array for ${key22}:`, colorArray);
            continue;
          }
          var colorValue = colorArray[themeIndex];
          if (!colorValue) {
            console.warn(`[Parser] Missing color value for ${key22} at index ${themeIndex}`);
            continue;
          }
          var normalized = normalizeToHex(colorValue);
          if (normalized) {
            semanticDefinitions1[key22] = {
              value: normalized,
              opacity: 1
            };
          }
        }
      }
      var rawColors2 = manifest.colours || manifest.colors;
      if (rawColors2) {
        for (var [key3, colorValue1] of Object.entries(rawColors2)) {
          if (typeof colorValue1 !== "string") continue;
          var normalized1 = normalizeToHex(colorValue1);
          if (normalized1) {
            var discordKey = convertEnmityToDiscordRawKey(key3);
            rawDefinitions[discordKey] = normalized1;
            if (discordKey !== key3) {
              rawDefinitions[key3] = normalized1;
            }
          }
        }
      }
      if (manifest.unsafe_colors) {
        for (var [key4, colorValue2] of Object.entries(manifest.unsafe_colors)) {
          if (typeof colorValue2 !== "string") continue;
          var normalized2 = normalizeToHex(colorValue2);
          if (normalized2) {
            rawDefinitions[key4] = normalized2;
          }
        }
      }
      if (import_react_native3.Platform.OS === "android") applyAndroidAlphaKeys(rawDefinitions);
      return {
        spec: 2,
        reference: resolveType(),
        semantic: semanticDefinitions1,
        raw: rawDefinitions,
        background: manifest.background
      };
    }
    throw new Error("Invalid theme spec");
  }
  function convertEnmityToDiscordRawKey(enmityKey) {
    var conversions = {
      "PRIMARY_DARK": "PRIMARY_100",
      "PRIMARY_DARK_100": "PRIMARY_100",
      "PRIMARY_DARK_200": "PRIMARY_200",
      "PRIMARY_DARK_300": "PRIMARY_300",
      "PRIMARY_DARK_360": "PRIMARY_360",
      "PRIMARY_DARK_400": "PRIMARY_400",
      "PRIMARY_DARK_500": "PRIMARY_500",
      "PRIMARY_DARK_600": "PRIMARY_600",
      "PRIMARY_DARK_630": "PRIMARY_630",
      "PRIMARY_DARK_700": "PRIMARY_700",
      "PRIMARY_DARK_800": "PRIMARY_800",
      "PRIMARY_DARK_900": "PRIMARY_900"
    };
    return conversions[enmityKey] || enmityKey;
  }
  function applyAndroidAlphaKeys(rawColors2) {
    if (!rawColors2) return;
    var alphaMap = {
      "BLACK_ALPHA_60": [
        "BLACK",
        0.6
      ],
      "BRAND_NEW_360_ALPHA_20": [
        "BRAND_360",
        0.2
      ],
      "BRAND_NEW_360_ALPHA_25": [
        "BRAND_360",
        0.25
      ],
      "BRAND_NEW_500_ALPHA_20": [
        "BRAND_500",
        0.2
      ],
      "PRIMARY_DARK_500_ALPHA_20": [
        "PRIMARY_500",
        0.2
      ],
      "PRIMARY_DARK_700_ALPHA_60": [
        "PRIMARY_700",
        0.6
      ],
      "STATUS_GREEN_500_ALPHA_20": [
        "GREEN_500",
        0.2
      ],
      "STATUS_RED_500_ALPHA_20": [
        "RED_500",
        0.2
      ]
    };
    for (var key2 in alphaMap) {
      var [colorKey, alpha] = alphaMap[key2];
      if (!rawColors2[colorKey]) continue;
      rawColors2[key2] = getChroma()(rawColors2[colorKey]).alpha(alpha).hex();
    }
    return rawColors2;
  }
  function normalizeToHex(colorString) {
    if (colorString === void 0) return void 0;
    if (colorString.toLowerCase() === "transparent") {
      return "#00000000";
    }
    if (getChroma().valid(colorString)) return getChroma()(colorString).hex();
    var color2 = Number((0, import_react_native3.processColor)(colorString));
    return getChroma().rgb(
      color2 >> 16 & 255,
      color2 >> 8 & 255,
      color2 & 255,
      color2 >> 24 & 255
      // alpha
    ).hex();
  }
  var import_react_native3, getChroma, tokenRef;
  var init_parser = __esm({
    "src/lib/addons/themes/colors/parser.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_metro();
      init_dist();
      import_react_native3 = __toESM(require_react_native());
      init_preferences();
      getChroma = () => require_chroma_js();
      tokenRef = findByProps("SemanticColor");
    }
  });

  // src/lib/addons/themes/colors/updater.ts
  function updateBunnyColor(colorManifest, { update = true }) {
    if (settings.safeMode?.enabled) return;
    var internalDef = colorManifest ? parseColorManifest(colorManifest) : null;
    var ref = Object.assign(_colorRef, {
      current: internalDef,
      key: `bn-theme-${++_inc}`,
      lastSetDiscordTheme: !ThemeStore.theme.startsWith("bn-theme-") ? ThemeStore.theme : _colorRef.lastSetDiscordTheme
    });
    if (internalDef != null) {
      tokenRef2.Theme[ref.key.toUpperCase()] = ref.key;
      FormDivider.DIVIDER_COLORS[ref.key] = FormDivider.DIVIDER_COLORS[ref.current.reference];
      Object.keys(tokenRef2.Shadow).forEach((k2) => tokenRef2.Shadow[k2][ref.key] = tokenRef2.Shadow[k2][ref.current.reference]);
      Object.keys(tokenRef2.SemanticColor).forEach((k2) => {
        tokenRef2.SemanticColor[k2][ref.key] = {
          ...tokenRef2.SemanticColor[k2][ref.current.reference]
        };
      });
    }
    if (update) {
      AppearanceManager.setShouldSyncAppearanceSettings(false);
      AppearanceManager.updateTheme(internalDef != null ? ref.key : ref.lastSetDiscordTheme);
    }
  }
  var tokenRef2, origRawColor, AppearanceManager, ThemeStore, FormDivider, _inc, _colorRef;
  var init_updater = __esm({
    "src/lib/addons/themes/colors/updater.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_settings();
      init_metro();
      init_parser();
      tokenRef2 = findByProps("SemanticColor");
      origRawColor = {
        ...tokenRef2.RawColor
      };
      AppearanceManager = findByPropsLazy("updateTheme");
      ThemeStore = findByStoreNameLazy("ThemeStore");
      FormDivider = findByPropsLazy("DIVIDER_COLORS");
      _inc = 1;
      _colorRef = {
        current: null,
        key: `bn-theme-${_inc}`,
        origRaw: origRawColor,
        lastSetDiscordTheme: "darker"
      };
    }
  });

  // src/lib/addons/themes/colors/patches/background.tsx
  function ThemeBackground({ children }) {
    useObservable([
      colorsPref
    ]);
    if (!_colorRef.current || colorsPref.customBackground === "hidden" || !_colorRef.current.background?.url || _colorRef.current.background?.blur && typeof _colorRef.current.background?.blur !== "number") {
      return children;
    }
    return /* @__PURE__ */ jsx(import_react_native4.ImageBackground, {
      style: {
        flex: 1,
        height: "100%"
      },
      source: {
        uri: _colorRef.current.background?.url
      },
      blurRadius: _colorRef.current.background?.blur,
      children
    });
  }
  function patchChatBackground() {
    try {
      var patch = (_2, ret) => {
        if (!_colorRef.current || !_colorRef.current.background?.url) return;
        var messagesComponent = findInReactTree(ret, (x2) => x2 && "HACK_fixModalInteraction" in x2.props && x2?.props?.style);
        if (messagesComponent) {
          var flattened = import_react_native4.StyleSheet.flatten(messagesComponent.props.style);
          var backgroundColor = (0, import_chroma_js.default)(flattened.backgroundColor || "black").alpha(1 - (_colorRef.current.background?.opacity ?? 1)).hex();
          messagesComponent.props.style = import_react_native4.StyleSheet.flatten([
            messagesComponent.props.style,
            {
              backgroundColor
            }
          ]);
        }
        return /* @__PURE__ */ jsx(ThemeBackground, {
          children: ret
        });
      };
      var patches3 = [
        typeof MessagesModule.default === "function" ? after("default", MessagesModule, patch) : after("render", MessagesModule.default, patch)
      ];
      return () => patches3.forEach((x2) => x2());
    } catch (e) {
      logger.error("Failed to patch chat background.", e);
      return () => {
      };
    }
  }
  var import_chroma_js, import_react_native4, MessagesModule;
  var init_background = __esm({
    "src/lib/addons/themes/colors/patches/background.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_preferences();
      init_updater();
      init_patcher();
      init_storage2();
      init_utils();
      init_metro();
      import_chroma_js = __toESM(require_chroma_js());
      import_react_native4 = __toESM(require_react_native());
      init_logger();
      MessagesModule = findByDisplayNameLazy("MessagesConnected", false);
    }
  });

  // src/lib/addons/themes/colors/patches/resolver.ts
  function patchDefinitionAndResolver() {
    var callback = ([theme]) => theme === _colorRef.key ? [
      _colorRef.current.reference
    ] : void 0;
    Object.defineProperty(themeTypes, "DARKER", {
      configurable: true,
      enumerable: true,
      get: () => _colorRef.current?.reference === "darker" ? _colorRef.key : origDarker
    });
    Object.defineProperty(themeTypes, "LIGHT", {
      configurable: true,
      enumerable: true,
      get: () => _colorRef.current?.reference === "light" ? _colorRef.key : origLight
    });
    Object.keys(tokenReference.RawColor).forEach((key2) => {
      Object.defineProperty(tokenReference.RawColor, key2, {
        configurable: true,
        enumerable: true,
        get: () => {
          var ret = _colorRef.current?.raw[key2];
          if (ret) return ret;
          return origRawColor2[key2];
        }
      });
    });
    var unpatches2 = [
      before("updateTheme", NativeThemeModule, callback),
      instead("resolveSemanticColor", tokenReference.default.meta ?? tokenReference.default.internal, (args, orig) => {
        if (!_colorRef.current) return orig(...args);
        if (args[0] !== _colorRef.key) return orig(...args);
        args[0] = _colorRef.current.reference;
        var [name, colorDef] = extractInfo(_colorRef.current.reference, args[1]);
        var semanticDef = _colorRef.current.semantic[name];
        if (!semanticDef && _colorRef.current.spec === 2 && name in SEMANTIC_FALLBACK_MAP) {
          semanticDef = _colorRef.current.semantic[SEMANTIC_FALLBACK_MAP[name]];
        }
        if (semanticDef?.value) {
          return semanticDef.opacity === 1 ? semanticDef.value : (0, import_chroma_js2.default)(semanticDef.value).alpha(semanticDef.opacity).hex();
        }
        var rawValue = _colorRef.current.raw[colorDef.raw];
        if (rawValue) {
          return colorDef.opacity === 1 ? rawValue : (0, import_chroma_js2.default)(rawValue).alpha(colorDef.opacity).hex();
        }
        return orig(...args);
      }),
      () => {
        Object.defineProperty(themeTypes, "DARKER", {
          configurable: true,
          writable: true,
          value: origDarker
        });
        Object.defineProperty(themeTypes, "LIGHT", {
          configurable: true,
          writable: true,
          value: origLight
        });
        Object.defineProperty(tokenReference, "RawColor", {
          configurable: true,
          writable: true,
          value: origRawColor2
        });
      }
    ];
    return () => unpatches2.forEach((p) => p());
  }
  function extractInfo(themeName, colorObj) {
    var propName = colorObj[extractInfo._sym ??= Object.getOwnPropertySymbols(colorObj)[0]];
    var colorDef = tokenReference.SemanticColor[propName];
    return [
      propName,
      colorDef[themeName]
    ];
  }
  var import_chroma_js2, tokenReference, themeTypes, origRawColor2, origDarker, origLight, SEMANTIC_FALLBACK_MAP;
  var init_resolver = __esm({
    "src/lib/addons/themes/colors/patches/resolver.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_updater();
      init_modules();
      init_patcher();
      init_metro();
      import_chroma_js2 = __toESM(require_chroma_js());
      tokenReference = findByProps("SemanticColor");
      themeTypes = findByProps("ThemeTypes")?.ThemeTypes;
      origRawColor2 = {
        ...tokenReference.RawColor
      };
      origDarker = themeTypes.DARKER;
      origLight = themeTypes.LIGHT;
      SEMANTIC_FALLBACK_MAP = {
        "BG_BACKDROP": "BACKGROUND_FLOATING",
        "BG_BASE_PRIMARY": "BACKGROUND_PRIMARY",
        "BG_BASE_SECONDARY": "BACKGROUND_SECONDARY",
        "BG_BASE_TERTIARY": "BACKGROUND_SECONDARY_ALT",
        "BG_MOD_FAINT": "BACKGROUND_MODIFIER_ACCENT",
        "BG_MOD_STRONG": "BACKGROUND_MODIFIER_ACCENT",
        "BG_MOD_SUBTLE": "BACKGROUND_MODIFIER_ACCENT",
        "BG_SURFACE_OVERLAY": "BACKGROUND_FLOATING",
        "BG_SURFACE_OVERLAY_TMP": "BACKGROUND_FLOATING",
        "BG_SURFACE_RAISED": "BACKGROUND_MOBILE_PRIMARY"
      };
    }
  });

  // src/lib/addons/themes/colors/patches/storage.ts
  function patchStorage() {
    var patchedKeys = /* @__PURE__ */ new Set([
      "ThemeStore",
      "SelectivelySyncedUserSettingsStore"
    ]);
    var patches3 = [
      after("get", mmkvStorage, ([key2], ret) => {
        if (!_colorRef.current || !patchedKeys.has(key2)) return;
        var state = findInTree(ret._state, (s) => typeof s.theme === "string");
        if (state) state.theme = _colorRef.key;
      }),
      before("set", mmkvStorage, ([key2, value]) => {
        if (!patchedKeys.has(key2)) return;
        var json = JSON.stringify(value);
        var lastSetDiscordTheme = _colorRef.lastSetDiscordTheme ?? "darker";
        var replaced = json.replace(/"theme":"bn-theme-\d+"/, `"theme":${JSON.stringify(lastSetDiscordTheme)}`);
        return [
          key2,
          JSON.parse(replaced)
        ];
      })
    ];
    return () => patches3.forEach((p) => p());
  }
  var mmkvStorage;
  var init_storage3 = __esm({
    "src/lib/addons/themes/colors/patches/storage.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_updater();
      init_patcher();
      init_utils();
      init_lazy();
      init_metro();
      mmkvStorage = proxyLazy(() => {
        var newModule = findByProps("impl");
        if (typeof newModule?.impl === "object") return newModule.impl;
        return findByProps("storage");
      });
    }
  });

  // src/lib/addons/themes/colors/statusbar.ts
  function getBarStyle() {
    var custom = _colorRef.current;
    if (custom?.reference) {
      return custom.reference === "light" ? "dark-content" : "light-content";
    }
    var theme = ThemeStore2?.theme;
    if (typeof theme === "string") {
      var lowerTheme = theme.toLowerCase();
      return lowerTheme.includes("dark") || lowerTheme.includes("midnight") ? "light-content" : "dark-content";
    }
    return "light-content";
  }
  function fixStatusBar() {
    function applyStatusBar() {
      var style = getBarStyle();
      import_react_native5.StatusBar.setBarStyle(style, true);
      if (import_react_native5.Platform.OS === "android") {
        import_react_native5.StatusBar.setTranslucent?.(true);
        import_react_native5.StatusBar.setBackgroundColor?.("#00000000", true);
      }
    }
    if (import_react_native5.Platform.OS === "android") {
      var origSetBarStyle = import_react_native5.StatusBar.setBarStyle;
      import_react_native5.StatusBar.setBarStyle = function(_style, ...args) {
        return origSetBarStyle.call(this, getBarStyle(), ...args);
      };
    }
    var unsubscribe = ThemeStore2?.addChangeListener?.(applyStatusBar);
    applyStatusBar();
    var delay = 200;
    for (var i2 = 0; i2 < 5; i2++, delay *= 2) {
      setTimeout(applyStatusBar, delay);
    }
    return unsubscribe;
  }
  var import_react_native5, ThemeStore2;
  var init_statusbar = __esm({
    "src/lib/addons/themes/colors/statusbar.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      import_react_native5 = __toESM(require_react_native());
      init_wrappers();
      init_updater();
      ThemeStore2 = findByStoreNameLazy("ThemeStore");
    }
  });

  // src/lib/addons/themes/colors/index.ts
  function initColors(manifest) {
    if (manifest) updateBunnyColor(manifest, {
      update: false
    });
    var patches3 = [
      patchStorage(),
      patchDefinitionAndResolver(),
      patchChatBackground(),
      fixStatusBar()
    ];
    return () => patches3.forEach((p) => p && (typeof p === "function" ? p() : null));
  }
  var init_colors = __esm({
    "src/lib/addons/themes/colors/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_background();
      init_resolver();
      init_storage3();
      init_updater();
      init_statusbar();
    }
  });

  // src/lib/addons/themes/index.ts
  var themes_exports = {};
  __export(themes_exports, {
    fetchTheme: () => fetchTheme,
    getCurrentTheme: () => getCurrentTheme,
    getThemeFromLoader: () => getThemeFromLoader,
    initThemes: () => initThemes,
    installTheme: () => installTheme,
    removeTheme: () => removeTheme,
    selectTheme: () => selectTheme,
    themes: () => themes,
    updateThemes: () => updateThemes,
    writeThemeToNative: () => writeThemeToNative
  });
  function writeThemeToNative(theme) {
    return _async_to_generator(function* () {
      if (typeof theme !== "object") throw new Error("Theme must be an object");
      yield createFileBackend(getThemeFilePath() || "theme.json").set(theme);
    })();
  }
  function processData(data) {
    if (data.semanticColors) {
      var { semanticColors: semanticColors2 } = data;
      for (var key2 in semanticColors2) {
        for (var index in semanticColors2[key2]) {
          semanticColors2[key2][index] &&= normalizeToHex(semanticColors2[key2][index]) || false;
        }
      }
    }
    if (data.rawColors) {
      var { rawColors: rawColors2 } = data;
      for (var key1 in rawColors2) {
        var normalized = normalizeToHex(rawColors2[key1]);
        if (normalized) data.rawColors[key1] = normalized;
      }
      if (import_react_native6.Platform.OS === "android") applyAndroidAlphaKeys(rawColors2);
    }
    if (data.spec === void 0) {
      if (!("theme_color_map" in data)) {
        data.spec = 2;
      }
    }
    return data;
  }
  function validateTheme(themeJSON) {
    if (typeof themeJSON !== "object" || themeJSON === null) return false;
    if (themeJSON.spec === 3 && !themeJSON.main) return false;
    if (themeJSON.spec === 2) return true;
    if (themeJSON.theme_color_map) return true;
    return themeJSON.spec === 2 || themeJSON.spec === 3;
  }
  function fetchTheme(url2, selected = false) {
    return _async_to_generator(function* () {
      var themeJSON;
      try {
        themeJSON = yield (yield safeFetch(url2, {
          cache: "no-store"
        })).json();
      } catch (unused) {
        throw new Error(`Failed to fetch theme at ${url2}`);
      }
      if (!validateTheme(themeJSON)) throw new Error(`Invalid theme at ${url2}`);
      themes[url2] = {
        id: url2,
        selected,
        data: processData(themeJSON)
      };
      if (selected) {
        writeThemeToNative(themes[url2]);
        updateBunnyColor(themes[url2].data, {
          update: true
        });
      }
    })();
  }
  function installTheme(url2) {
    return _async_to_generator(function* () {
      if (typeof url2 !== "string" || url2 in themes) throw new Error("Theme already installed");
      yield fetchTheme(url2);
    })();
  }
  function selectTheme(theme, write = true) {
    if (theme) theme.selected = true;
    Object.keys(themes).forEach((k2) => themes[k2].selected = themes[k2].id === theme?.id);
    if (theme == null && write) {
      updateBunnyColor(null, {
        update: true
      });
      return writeThemeToNative({});
    } else if (theme) {
      updateBunnyColor(theme.data, {
        update: true
      });
      return writeThemeToNative(theme);
    }
  }
  function removeTheme(id2) {
    return _async_to_generator(function* () {
      var theme = themes[id2];
      if (theme.selected) yield selectTheme(null);
      delete themes[id2];
      return theme.selected;
    })();
  }
  function updateThemes() {
    return _async_to_generator(function* () {
      yield awaitStorage(themes);
      var currentTheme = getThemeFromLoader();
      yield allSettled(Object.keys(themes).map((id2) => fetchTheme(id2, currentTheme?.id === id2)));
    })();
  }
  function getCurrentTheme() {
    return Object.values(themes).find((t) => t.selected) ?? null;
  }
  function getThemeFromLoader() {
    return getStoredTheme() ?? getCurrentTheme();
  }
  function initThemes() {
    return _async_to_generator(function* () {
      if (!isThemeSupported()) return;
      if (settings.safeMode?.enabled) return;
      try {
        if (isPyonLoader()) {
          writeFile("../vendetta_theme.json", "null");
        }
        yield awaitStorage2(colorsPref);
        yield awaitStorage(themes);
        var currentTheme = getThemeFromLoader();
        initColors(currentTheme?.data ?? null);
        updateThemes().catch((e) => console.error("Failed to update themes", e));
      } catch (e) {
        console.error("Failed to initialize themes", e);
      }
    })();
  }
  var import_react_native6, themes;
  var init_themes = __esm({
    "src/lib/addons/themes/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_storage();
      init_fs();
      init_loader();
      init_storage2();
      init_utils();
      import_react_native6 = __toESM(require_react_native());
      init_settings();
      init_colors();
      init_parser();
      init_preferences();
      init_updater();
      themes = wrapSync(createStorage(createMMKVBackend("VENDETTA_THEMES")));
    }
  });

  // src/lib/api/native/loader.ts
  function isVendettaLoader() {
    return vendettaLoaderIdentity != null;
  }
  function isPyonLoader() {
    return pyonLoaderIdentity != null;
  }
  function isRa1nLoader() {
    return rainLoaderIdentity != null;
  }
  function isShiggyLoader() {
    return shiggyLoaderIdentity != null;
  }
  function polyfillVendettaLoaderIdentity() {
    if (!isPyonLoader() || isVendettaLoader() || !isRa1nLoader()) return null;
    var loader;
    if (isRa1nLoader() == true) {
      loader = {
        name: rainLoaderIdentity.loaderName,
        features: {}
      };
    } else {
      loader = {
        name: pyonLoaderIdentity.loaderName,
        features: {}
      };
    }
    if (isLoaderConfigSupported()) loader.features.loaderConfig = true;
    if (isSysColorsSupported()) {
      loader.features.syscolors = {
        prop: "__vendetta_syscolors"
      };
      Object.defineProperty(globalThis, "__vendetta_syscolors", {
        get: () => getSysColors(),
        configurable: true
      });
    }
    if (isThemeSupported()) {
      loader.features.themes = {
        prop: "__vendetta_theme"
      };
      Object.defineProperty(globalThis, "__vendetta_theme", {
        // get: () => getStoredTheme(),
        get: () => {
          var id2 = getStoredTheme()?.id;
          if (!id2) return null;
          var { themes: themes2 } = (init_themes(), __toCommonJS(themes_exports));
          return themes2[id2] ?? getStoredTheme() ?? null;
        },
        configurable: true
      });
    }
    Object.defineProperty(globalThis, "__vendetta_loader", {
      get: () => loader,
      configurable: true
    });
    return loader;
  }
  function getVendettaLoaderIdentity() {
    if (globalThis.__vendetta_loader) return globalThis.__vendetta_loader;
    return polyfillVendettaLoaderIdentity();
  }
  function getLoaderName() {
    if (isPyonLoader()) return pyonLoaderIdentity.loaderName;
    else if (isRa1nLoader()) return rainLoaderIdentity.loadername;
    else if (isVendettaLoader()) return vendettaLoaderIdentity.name;
    else if (isShiggyLoader()) return shiggyLoaderIdentity.loaderName;
    return "Unknown";
  }
  function getLoaderVersion() {
    if (isPyonLoader()) return pyonLoaderIdentity.loaderVersion;
    else if (isRa1nLoader()) return rainLoaderIdentity.loaderVersion;
    else if (isShiggyLoader()) return shiggyLoaderIdentity.loaderVersion;
    return null;
  }
  function isLoaderConfigSupported() {
    if (isPyonLoader()) {
      return true;
    } else if (isVendettaLoader()) {
      return vendettaLoaderIdentity.features.loaderConfig;
    } else if (isRa1nLoader()) {
      return true;
    }
    return false;
  }
  function isThemeSupported() {
    if (isPyonLoader()) {
      return pyonLoaderIdentity.hasThemeSupport;
    } else if (isVendettaLoader()) {
      return vendettaLoaderIdentity.features.themes != null;
    } else if (isRa1nLoader()) {
      return false;
    } else if (isShiggyLoader()) {
      return shiggyLoaderIdentity.hasThemeSupport;
    }
    return false;
  }
  function getStoredTheme() {
    if (isPyonLoader()) {
      return pyonLoaderIdentity.storedTheme;
    } else if (isVendettaLoader()) {
      var themeProp = vendettaLoaderIdentity.features.themes?.prop;
      if (!themeProp) return null;
      return globalThis[themeProp] || null;
    } else if (isShiggyLoader()) {
      return shiggyLoaderIdentity.storedTheme || null;
    }
    return null;
  }
  function getThemeFilePath() {
    if (isPyonLoader()) {
      return "pyoncord/current-theme.json";
    } else if (isVendettaLoader()) {
      return "vendetta_theme.json";
    } else if (isShiggyLoader()) {
      return "ShiggyCord/current-theme.json";
    }
    return null;
  }
  function isReactDevToolsPreloaded() {
    if (isPyonLoader()) {
      return Boolean(globalThis.__REACT_DEVTOOLS__);
    }
    if (isVendettaLoader()) {
      return vendettaLoaderIdentity.features.devtools != null;
    }
    return false;
  }
  function getReactDevToolsProp() {
    if (!isReactDevToolsPreloaded()) return null;
    if (isPyonLoader()) {
      globalThis.__pyoncord_rdt = globalThis.__REACT_DEVTOOLS__.exports;
      return "__pyoncord_rdt";
    }
    if (isVendettaLoader()) {
      return vendettaLoaderIdentity.features.devtools.prop;
    }
    return null;
  }
  function getReactDevToolsVersion() {
    if (!isReactDevToolsPreloaded()) return null;
    if (isPyonLoader()) {
      return globalThis.__REACT_DEVTOOLS__.version || null;
    }
    if (isVendettaLoader()) {
      return vendettaLoaderIdentity.features.devtools.version;
    }
    return null;
  }
  function isSysColorsSupported() {
    return true;
  }
  function getSysColors() {
    if (!isSysColorsSupported()) return null;
    if (isPyonLoader()) {
      return pyonLoaderIdentity.sysColors;
    } else if (isVendettaLoader()) {
      return vendettaLoaderIdentity.features.syscolors.prop;
    }
    return null;
  }
  function getLoaderConfigPath() {
    if (isPyonLoader()) {
      return "pyoncord/loader.json";
    } else if (isVendettaLoader()) {
      return "vendetta_loader.json";
    } else if (isRa1nLoader()) {
      return "rain/loader.json";
    }
    return "loader.json";
  }
  function isFontSupported() {
    if (isPyonLoader()) return pyonLoaderIdentity.fontPatch === 2;
    else if (isShiggyLoader()) return shiggyLoaderIdentity.fontPatch === 2;
    return false;
  }
  var pyonLoaderIdentity, rainLoaderIdentity, vendettaLoaderIdentity, shiggyLoaderIdentity;
  var init_loader = __esm({
    "src/lib/api/native/loader.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_fs();
      pyonLoaderIdentity = globalThis.__PYON_LOADER__;
      rainLoaderIdentity = globalThis.__RAIN_LOADER__;
      vendettaLoaderIdentity = globalThis.__vendetta_loader;
      shiggyLoaderIdentity = globalThis.__SHIGGY_LOADER__;
      getVendettaLoaderIdentity();
    }
  });

  // src/lib/api/settings.ts
  var settings_exports = {};
  __export(settings_exports, {
    loaderConfig: () => loaderConfig,
    settings: () => settings,
    updaterSettings: () => updaterSettings
  });
  var settings, loaderConfig, updaterSettings;
  var init_settings = __esm({
    "src/lib/api/settings.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_storage();
      init_loader();
      settings = wrapSync(createStorage(createMMKVBackend("VENDETTA_SETTINGS")));
      loaderConfig = wrapSync(createStorage(createFileBackend(getLoaderConfigPath(), {
        customLoadUrl: {
          enabled: false,
          url: "http://localhost:4040/kettu.js"
        }
      })));
      updaterSettings = wrapSync(createStorage(createMMKVBackend("VENDETTA_UPDATER_SETTINGS")));
    }
  });

  // src/metro/polyfills/redesign.ts
  var redesign_exports = {};
  __export(redesign_exports, {
    default: () => redesign_default
  });
  var redesignProps, _module, _source, cacher, actualExports, exportsKeysLength, prop, id, moduleExports, redesign_default;
  var init_redesign = __esm({
    "src/metro/polyfills/redesign.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_caches();
      redesignProps = /* @__PURE__ */ new Set([
        "AlertActionButton",
        "AlertModal",
        "AlertModalContainer",
        "AvatarDuoPile",
        "AvatarPile",
        "BACKDROP_OPAQUE_MAX_OPACITY",
        "Backdrop",
        "Button",
        "Card",
        "ContextMenu",
        "ContextMenuContainer",
        "FauxHeader",
        "FloatingActionButton",
        "GhostInput",
        "GuildIconPile",
        "HeaderActionButton",
        "HeaderButton",
        "HeaderSubmittingIndicator",
        "IconButton",
        "Input",
        "InputButton",
        "InputContainer",
        "LayerContext",
        "LayerScope",
        "Modal",
        "ModalActionButton",
        "ModalContent",
        "ModalDisclaimer",
        "ModalFloatingAction",
        "ModalFloatingActionSpacer",
        "ModalFooter",
        "ModalScreen",
        "ModalStepIndicator",
        "NAV_BAR_HEIGHT",
        "NAV_BAR_HEIGHT_MULTILINE",
        "Navigator",
        "NavigatorHeader",
        "NavigatorScreen",
        "Pile",
        "PileOverflow",
        "RedesignCompat",
        "RedesignCompatContext",
        "RowButton",
        "STATUS_BAR_HEIGHT",
        "SceneLoadingIndicator",
        "SearchField",
        "SegmentedControl",
        "SegmentedControlPages",
        "Slider",
        "Stack",
        "StepModal",
        "StickyContext",
        "StickyHeader",
        "StickyWrapper",
        "TABLE_ROW_CONTENT_HEIGHT",
        "TABLE_ROW_HEIGHT",
        "TableCheckboxRow",
        "TableRadioGroup",
        "TableRadioRow",
        "TableRow",
        "TableRowGroup",
        "TableRowGroupTitle",
        "TableRowIcon",
        "TableSwitchRow",
        "Tabs",
        "TextArea",
        "TextField",
        "TextInput",
        "Toast",
        "dismissAlerts",
        "getHeaderBackButton",
        "getHeaderCloseButton",
        "getHeaderConditionalBackButton",
        "getHeaderNoTitle",
        "getHeaderTextButton",
        "hideContextMenu",
        "navigatorShouldCrossfade",
        "openAlert",
        "useAccessibilityNativeStackOptions",
        "useAndroidNavScrim",
        "useCoachmark",
        "useFloatingActionButtonScroll",
        "useFloatingActionButtonState",
        "useNativeStackNavigation",
        "useNavigation",
        "useNavigationTheme",
        "useNavigatorBackPressHandler",
        "useNavigatorScreens",
        "useNavigatorShouldCrossfade",
        "useSegmentedControlState",
        "useStackNavigation",
        "useTabNavigation",
        "useTooltip"
      ]);
      _module = {};
      _source = {};
      cacher = getPolyfillModuleCacher("redesign_module");
      for ([id, moduleExports] of cacher.getModules()) {
        for (prop of redesignProps) {
          actualExports = void 0;
          if (moduleExports[prop]) {
            actualExports = moduleExports;
          } else if (moduleExports.default?.[prop]) {
            actualExports = moduleExports.default;
          } else {
            continue;
          }
          exportsKeysLength = Reflect.ownKeys(actualExports).length;
          if (_source[prop] && exportsKeysLength <= _source[prop]) {
            continue;
          }
          _module[prop] = actualExports[prop];
          _source[prop] = Reflect.ownKeys(actualExports).length;
          cacher.cacheId(id);
        }
      }
      cacher.finish();
      redesign_default = _module;
    }
  });

  // src/metro/internals/modules.ts
  var modules_exports2 = {};
  __export(modules_exports2, {
    getCachedPolyfillModules: () => getCachedPolyfillModules,
    getImportingModuleId: () => getImportingModuleId,
    getModules: () => getModules,
    metroModules: () => metroModules,
    requireModule: () => requireModule,
    subscribeModule: () => subscribeModule
  });
  function blacklistModule(id2) {
    Object.defineProperty(metroModules, id2, {
      enumerable: false
    });
    blacklistedIds.add(id2);
    indexBlacklistFlag(Number(id2));
  }
  function isBadExports(exports) {
    return !exports || exports === globalThis || exports["<!@ pylix was here :fuyusquish: \n Hi pylix! -cocobo1!@>"] === null || exports.__proto__ === Object.prototype && Reflect.ownKeys(exports).length === 0 || exports.default?.[Symbol.toStringTag] === "IntlMessagesProxy";
  }
  function onModuleRequire(moduleExports2, id2) {
    indexExportsFlags(id2, moduleExports2);
    moduleExports2.initSentry &&= () => void 0;
    if (moduleExports2.default?.track && moduleExports2.default.trackMaker) moduleExports2.default.track = () => Promise.resolve();
    if (moduleExports2.registerAsset) {
      (init_patches(), __toCommonJS(patches_exports)).patchAssets(moduleExports2);
    }
    if (!patchedNativeComponentRegistry && [
      "customBubblingEventTypes",
      "customDirectEventTypes",
      "register",
      "get"
    ].every((x2) => moduleExports2[x2])) {
      instead2("register", moduleExports2, ([name, cb], origFunc) => {
        try {
          return origFunc(name, cb);
        } catch (unused) {
          return name;
        }
      });
      patchedNativeComponentRegistry = true;
    }
    if (moduleExports2?.default?.constructor?.displayName === "DeveloperExperimentStore") {
      moduleExports2.default = new Proxy(moduleExports2.default, {
        get(target, property, receiver) {
          if (property === "isDeveloper") {
            var { settings: settings2 } = (init_settings(), __toCommonJS(settings_exports));
            return settings2.enableDiscordDeveloperSettings ?? false;
          }
          return Reflect.get(target, property, receiver);
        }
      });
    }
    if (!patchedImportTracker && moduleExports2.fileFinishedImporting) {
      before2("fileFinishedImporting", moduleExports2, ([filePath]) => {
        if (_importingModuleId === -1 || !filePath) return;
        metroModules[_importingModuleId].__filePath = filePath;
      });
      patchedImportTracker = true;
    }
    if (!patchedInspectSource && globalThis["__core-js_shared__"]) {
      var inspect = (f2) => typeof f2 === "function" && functionToString.apply(f2, []);
      globalThis["__core-js_shared__"].inspectSource = inspect;
      patchedInspectSource = true;
    }
    if (moduleExports2.findHostInstance_DEPRECATED) {
      var prevExports = metroModules[id2 - 1]?.publicModule.exports;
      var inc = prevExports.default?.reactProfilingEnabled ? 1 : -1;
      if (!metroModules[id2 + inc]?.isInitialized) {
        blacklistModule(id2 + inc);
      }
    }
    if (moduleExports2.isMoment) {
      instead2("defineLocale", moduleExports2, (args, orig) => {
        var origLocale = moduleExports2.locale();
        orig(...args);
        moduleExports2.locale(origLocale);
      });
    }
    var subs = moduleSubscriptions.get(Number(id2));
    if (subs) {
      subs.forEach((s) => s());
      moduleSubscriptions.delete(Number(id2));
    }
  }
  function getImportingModuleId() {
    return _importingModuleId;
  }
  function subscribeModule(id2, cb) {
    var subs = moduleSubscriptions.get(id2) ?? /* @__PURE__ */ new Set();
    subs.add(cb);
    moduleSubscriptions.set(id2, subs);
    return () => subs.delete(cb);
  }
  function requireModule(id2) {
    if (!metroModules[0]?.isInitialized) metroRequire(0);
    if (blacklistedIds.has(id2)) return void 0;
    if (Number(id2) === -1) return init_redesign(), __toCommonJS(redesign_exports);
    if (metroModules[id2]?.isInitialized && !metroModules[id2]?.hasError) {
      return metroRequire(id2);
    }
    var originalHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler(noopHandler);
    var moduleExports2;
    try {
      moduleExports2 = metroRequire(id2);
    } catch (unused) {
      blacklistModule(id2);
      moduleExports2 = void 0;
    }
    ErrorUtils.setGlobalHandler(originalHandler);
    return moduleExports2;
  }
  function* getModules(uniq, all2 = false) {
    yield [
      -1,
      (init_redesign(), __toCommonJS(redesign_exports))
    ];
    var cache = getMetroCache().findIndex[uniq];
    if (all2 && !cache?.[`_${ModulesMapInternal.FULL_LOOKUP}`]) cache = void 0;
    if (cache?.[`_${ModulesMapInternal.NOT_FOUND}`]) return;
    for (var id2 in cache) {
      if (id2[0] === "_") continue;
      var exports = requireModule(Number(id2));
      if (isBadExports(exports)) continue;
      yield [
        id2,
        exports
      ];
    }
    for (var id1 in metroModules) {
      var exports1 = requireModule(Number(id1));
      if (isBadExports(exports1)) continue;
      yield [
        id1,
        exports1
      ];
    }
  }
  function* getCachedPolyfillModules(name) {
    var cache = getMetroCache().polyfillIndex[name];
    for (var id2 in cache) {
      var exports = requireModule(Number(id2));
      if (isBadExports(exports)) continue;
      yield [
        id2,
        exports
      ];
    }
    if (!cache[`_${ModulesMapInternal.FULL_LOOKUP}`]) {
      for (var id1 in metroModules) {
        var exports1 = requireModule(Number(id1));
        if (isBadExports(exports1)) continue;
        yield [
          id1,
          exports1
        ];
      }
    }
  }
  var _loop, before2, instead2, metroModules, metroRequire, moduleSubscriptions, blacklistedIds, noopHandler, functionToString, patchedInspectSource, patchedImportTracker, patchedNativeComponentRegistry, _importingModuleId, key;
  var init_modules2 = __esm({
    "src/metro/internals/modules.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_caches();
      init_enums();
      _loop = function(key2) {
        var id2 = Number(key2);
        var metroModule = metroModules[id2];
        var cache = getMetroCache().flagsIndex[id2];
        if (cache & ModuleFlags.BLACKLISTED) {
          blacklistModule(id2);
          return "continue";
        }
        if (metroModule.factory) {
          instead2("factory", metroModule, (args, origFunc) => {
            var originalImportingId = _importingModuleId;
            _importingModuleId = id2;
            var { 1: metroRequire2, 4: moduleObject } = args;
            args[
              2
              /* metroImportDefault */
            ] = (id3) => {
              var exps = metroRequire2(id3);
              return exps && exps.__esModule ? exps.default : exps;
            };
            args[
              3
              /* metroImportAll */
            ] = (id3) => {
              var exps = metroRequire2(id3);
              if (exps && exps.__esModule) return exps;
              var importAll = {};
              if (exps) Object.assign(importAll, exps);
              importAll.default = exps;
              return importAll;
            };
            origFunc(...args);
            if (!isBadExports(moduleObject.exports)) {
              onModuleRequire(moduleObject.exports, id2);
            } else {
              blacklistModule(id2);
            }
            _importingModuleId = originalImportingId;
          });
        }
      };
      ({ before: before2, instead: instead2 } = require_dist());
      metroModules = globalThis.modules;
      metroRequire = (id2) => globalThis.__r(+id2);
      moduleSubscriptions = /* @__PURE__ */ new Map();
      blacklistedIds = /* @__PURE__ */ new Set();
      noopHandler = () => void 0;
      functionToString = Function.prototype.toString;
      patchedInspectSource = false;
      patchedImportTracker = false;
      patchedNativeComponentRegistry = false;
      _importingModuleId = -1;
      for (key in metroModules) _loop(key);
    }
  });

  // src/metro/internals/caches.ts
  var caches_exports = {};
  __export(caches_exports, {
    getCacherForUniq: () => getCacherForUniq,
    getMetroCache: () => getMetroCache,
    getPolyfillModuleCacher: () => getPolyfillModuleCacher,
    indexAssetModuleFlag: () => indexAssetModuleFlag,
    indexBlacklistFlag: () => indexBlacklistFlag,
    indexExportsFlags: () => indexExportsFlags,
    initMetroCache: () => initMetroCache
  });
  function buildInitCache() {
    var modulesCount = Object.keys(globalThis.modules).length;
    var cache = {
      _v: CACHE_VERSION,
      _buildNumber: NativeClientInfoModule.getConstants().Build,
      _modulesCount: modulesCount,
      flagsIndex: {},
      findIndex: {},
      polyfillIndex: {}
    };
    _metroCache = cache;
    return cache;
  }
  function initMetroCache() {
    return _async_to_generator(function* () {
      if (!(yield fileExists(BUNNY_METRO_CACHE_PATH))) return void buildInitCache();
      var rawCache = yield readFile(BUNNY_METRO_CACHE_PATH);
      try {
        _metroCache = JSON.parse(rawCache);
        if (_metroCache._v !== CACHE_VERSION) {
          _metroCache = null;
          throw "cache invalidated; cache version outdated";
        }
        if (_metroCache._buildNumber !== NativeClientInfoModule.getConstants().Build) {
          _metroCache = null;
          throw "cache invalidated; version mismatch";
        }
        var currentCount = Object.keys(globalThis.modules).length;
        if (_metroCache._modulesCount !== currentCount) {
          _metroCache = null;
          throw "cache invalidated; modules count mismatch";
        }
      } catch (unused) {
        buildInitCache();
      }
    })();
  }
  function extractExportsFlags(moduleExports2) {
    if (!moduleExports2) return void 0;
    var bit = ModuleFlags.EXISTS;
    return bit;
  }
  function indexExportsFlags(moduleId, moduleExports2) {
    var flags = extractExportsFlags(moduleExports2);
    if (flags && flags !== ModuleFlags.EXISTS) {
      _metroCache.flagsIndex[moduleId] = flags;
    }
  }
  function indexBlacklistFlag(id2) {
    _metroCache.flagsIndex[id2] |= ModuleFlags.BLACKLISTED;
  }
  function indexAssetModuleFlag(id2) {
    _metroCache.flagsIndex[id2] |= ModuleFlags.ASSET;
  }
  function getCacherForUniq(uniq, allFind) {
    var indexObject = _metroCache.findIndex[uniq] ??= {};
    return {
      cacheId(moduleId, exports) {
        indexObject[moduleId] ??= extractExportsFlags(exports);
        saveCache();
      },
      // Finish may not be called by single find
      finish(notFound) {
        if (allFind) indexObject[`_${ModulesMapInternal.FULL_LOOKUP}`] = 1;
        if (notFound) indexObject[`_${ModulesMapInternal.NOT_FOUND}`] = 1;
        saveCache();
      }
    };
  }
  function getPolyfillModuleCacher(name) {
    var indexObject = _metroCache.polyfillIndex[name] ??= {};
    return {
      getModules() {
        return (init_modules2(), __toCommonJS(modules_exports2)).getCachedPolyfillModules(name);
      },
      cacheId(moduleId) {
        indexObject[moduleId] = 1;
        saveCache();
      },
      finish() {
        indexObject[`_${ModulesMapInternal.FULL_LOOKUP}`] = 1;
        saveCache();
      }
    };
  }
  var CACHE_VERSION, BUNNY_METRO_CACHE_PATH, _metroCache, getMetroCache, saveCache;
  var init_caches = __esm({
    "src/metro/internals/caches.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_fs();
      init_modules();
      init_dist();
      init_enums();
      CACHE_VERSION = 102;
      BUNNY_METRO_CACHE_PATH = "caches/metro_modules.json";
      _metroCache = null;
      getMetroCache = () => _metroCache;
      saveCache = debounce(() => {
        writeFile(BUNNY_METRO_CACHE_PATH, JSON.stringify(_metroCache));
      }, 1e3);
    }
  });

  // globals:react
  var require_react = __commonJS({
    "globals:react"(exports, module) {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      module.exports = require_depsModule()["react"];
    }
  });

  // src/core/ui/reporter/utils/isStack.tsx
  function isComponentStack(error) {
    return "componentStack" in error && typeof error.componentStack === "string";
  }
  function hasStack(error) {
    return !!error.stack;
  }
  var init_isStack = __esm({
    "src/core/ui/reporter/utils/isStack.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // src/lib/api/assets/index.ts
  var assets_exports = {};
  __export(assets_exports, {
    filterAssets: () => filterAssets,
    findAsset: () => findAsset,
    findAssetId: () => findAssetId,
    invalidateAssetCache: () => invalidateAssetCache,
    iterateAssets: () => iterateAssets
  });
  function invalidateAssetCache() {
    _cachedAssetList = null;
    _cachedAssetListTs = 0;
    for (var k2 in _nameToAssetCache) delete _nameToAssetCache[k2];
  }
  function* iterateAssets() {
    var now2 = Date.now();
    if (_cachedAssetList && now2 - _cachedAssetListTs < ASSET_CACHE_TTL) {
      for (var asset of _cachedAssetList) yield asset;
      return;
    }
    var { flagsIndex } = getMetroCache();
    var yielded = /* @__PURE__ */ new Set();
    var list = [];
    for (var id2 in flagsIndex) {
      if (flagsIndex[id2] & ModuleFlags.ASSET) {
        var assetId = requireModule(Number(id2));
        if (typeof assetId !== "number" || yielded.has(assetId)) continue;
        var asset1 = getAssetById(assetId);
        if (!asset1) continue;
        list.push(asset1);
        yielded.add(assetId);
        yield asset1;
      }
    }
    _cachedAssetList = list;
    _cachedAssetListTs = now2;
  }
  function getAssetById(id2) {
    var asset = assetsModule.getAssetByID(id2);
    if (!asset) return asset;
    return Object.assign(asset, {
      id: id2
    });
  }
  function findAsset(param) {
    if (typeof param === "number") return getAssetById(param);
    if (typeof param === "string" && _nameToAssetCache[param]) {
      return _nameToAssetCache[param];
    }
    for (var asset of iterateAssets()) {
      if (typeof param === "string" && asset.name === param) {
        _nameToAssetCache[param] = asset;
        return asset;
      } else if (typeof param === "function" && param(asset)) {
        return asset;
      }
    }
  }
  function filterAssets(param) {
    var filteredAssets = [];
    for (var asset of iterateAssets()) {
      if (typeof param === "string" ? asset.name === param : param(asset)) {
        filteredAssets.push(asset);
      }
    }
    return filteredAssets;
  }
  function findAssetId(name) {
    return findAsset(name)?.id;
  }
  var _nameToAssetCache, _cachedAssetList, _cachedAssetListTs, ASSET_CACHE_TTL;
  var init_assets = __esm({
    "src/lib/api/assets/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_caches();
      init_enums();
      init_modules2();
      init_patches();
      _nameToAssetCache = {};
      _cachedAssetList = null;
      _cachedAssetListTs = 0;
      ASSET_CACHE_TTL = 2500;
    }
  });

  // src/core/i18n/default.json
  var default_default;
  var init_default = __esm({
    "src/core/i18n/default.json"() {
      default_default = {
        ABOUT: "About",
        ACTIONS: "Actions",
        ARE_YOU_SURE_TO_CLEAR_DATA: "Are you sure you wish to clear the data of {name}?",
        ARE_YOU_SURE_TO_DELETE_PLUGIN: "Are you sure you wish to delete {name}? This will clear all of the plugin's data.",
        ARE_YOU_SURE_TO_DELETE_THEME: "Are you sure you wish to delete {name}?",
        AUTO_DEBUGGER: "Automatically connect to Debugger",
        AUTO_DEVTOOLS: "Automatically connect to Devtools",
        ASSET_BROWSER: "Asset Browser",
        ASSET_TYPES: "Asset Types",
        IMAGE_FILES: "Image Files",
        TEXT_FILES: "Text Files",
        BRAND: "Brand",
        SHIGGYCORD: "ShiggyCord",
        SHIGGYCORD_URL: "ShiggyCord URL",
        BROWSER: "Browser",
        BYTECODE: "Bytecode",
        CANCEL: "Cancel",
        CLEAR: "Clear",
        CLEAR_BUNDLE: "Clear JS Bundle",
        CLEAR_BUNDLE_DESC: "Clear the cached bundle. This will force a re-download of the bundle next app launch.",
        CLEAR_DATA: "Clear data",
        CLEAR_DATA_FAILED: "Failed to clear data for {name}",
        CLEAR_DATA_SUCCESSFUL: "Cleared data for {name}",
        CODEBERG: "Codeberg",
        CODENAME: "Codename",
        COMMAND_DEBUG_DESC: "Send ShiggyCord debug info.",
        COMMAND_DEBUG_OPT_EPHEMERALLY: "Send debug info ephemerally.",
        COMMAND_EVAL_DESC: "Evaluate JavaScript code.",
        COMMAND_EVAL_OPT_ASYNC: "Whether to support 'await' in code. Must explicitly return for result (default: false)",
        COMMAND_EVAL_OPT_CODE: "The code to evaluate.",
        COMMAND_PLUGINS_DESC: "Send list of installed plugins.",
        COMMAND_PLUGINS_OPT_EPHEMERALLY: "Send plugins list ephemerally.",
        COMMAND_RELOAD_DESC: "Reload Discord.",
        COMPONENT: "Component",
        CONFIRMATION_LINK_IS_A_TYPE: "This link is a **{urlType, select, plugin {Plugin} theme {Theme} other {Add-on}}**, would you like to install it?",
        CONNECT_TO_DEBUG_WEBSOCKET: "Connect to debug WebSocket",
        CONNECT_TO_REACT_DEVTOOLS: "Connect to React DevTools",
        CONTINUE: "Continue",
        COPIED_TO_CLIPBOARD: "Copied to clipboard",
        COPY_URL: "Copy URL",
        DEBUG: "Debug",
        DEBUGGER_URL: "Debugger URL",
        DELETE: "Delete",
        DEVTOOLS_URL: "DevTools URL",
        DESC_EXTRACT_FONTS_FROM_THEME: 'Looks out for "fonts" field in your currently applied theme and install it.',
        DEVELOPER: "Developer",
        DEVELOPER_SETTINGS: "Developer Settings",
        DISABLE_THEME: "Disable Theme",
        DISABLE_UPDATES: "Disable Updates",
        DISCORD_SERVER: "Discord Server",
        DONE: "Done",
        ENABLE_EVAL_COMMAND: "Enable /eval command",
        ENABLE_EVAL_COMMAND_DESC: "Evaluate JavaScript directly from a command. Be cautious when using this command as it may pose a security risk. Make sure to know what you are doing.",
        ENABLE_UPDATES: "Enable Updates",
        ERROR_BOUNDARY_TOOLS_LABEL: "ErrorBoundary Tools",
        EXTRACT: "Extract",
        FONT_NAME: "Font Name",
        FONTS: "Fonts",
        GENERAL: "General",
        GITHUB: "GitHub",
        HOLD_UP: "Hold Up",
        INFO: "Info",
        INSTALL: "Install",
        INSTALL_ADDON: "Install an add-on",
        INSTALL_FONT: "Install a font",
        INSTALL_PLUGIN: "Install a plugin",
        INSTALL_REACT_DEVTOOLS: "Install React DevTools",
        INSTALL_THEME: "Install a theme",
        LABEL_EXTRACT_FONTS_FROM_THEME: "Extract font from theme",
        LINKS: "Links",
        LOAD_FROM_CUSTOM_URL: "Load from custom URL",
        LOAD_FROM_CUSTOM_URL_DEC: "Load ShiggyCord from a custom endpoint.",
        LOAD_REACT_DEVTOOLS: "Load React DevTools",
        SHIGGY_URL: "ShiggyCord URL",
        LOADER: "Loader",
        MACHINE_ID: "Machine ID",
        MANUFACTURER: "Manufacturer",
        MESSAGE: "Message",
        MISCELLANEOUS: "Miscellaneous",
        MODAL_RELOAD_REQUIRED: "Reload app?",
        MODAL_RELOAD_REQUIRED_DESC: "A reload is required to see the changes. Do you want to reload now?",
        MODAL_THEME_REFETCHED: "Theme refetched",
        MODAL_THEME_REFETCHED_DESC: "A reload is required to see the changes. Do you want to reload now?",
        MODAL_UNPROXIED_PLUGIN_DESC: "The plugin you are trying to install has not been proxied/verified by staff. Are you sure you want to continue?",
        MODAL_UNPROXIED_PLUGIN_HEADER: "Unproxied Plugin",
        MODEL: "Model",
        OPEN_IN_BROWSER: "Open in Browser",
        OPERATING_SYSTEM: "Operating System",
        OVERFLOW_PLUGIN_SETTINGS: "Plugin Settings",
        PLATFORM: "Platform",
        PLUGIN_REFETCH_FAILED: "Failed to refetch plugin",
        PLUGIN_REFETCH_SUCCESSFUL: "Successfully refetched plugin",
        PLUGINS: "Plugins",
        REFETCH: "Refetch",
        RELOAD: "Reload",
        RELOAD_DISCORD: "Reshiggy your Discord",
        RELOAD_IN_NORMAL_MODE: "Reload in Normal Mode",
        RELOAD_IN_NORMAL_MODE_DESC: "Safe mode currently enabled, tap to reload in normal mode",
        RELOAD_IN_SAFE_MODE: "Reload in Safe Mode",
        RELOAD_IN_SAFE_MODE_DESC: "Tap to reload Discord without loading addons",
        REMOVE: "Remove",
        RESTART_REQUIRED_TO_TAKE_EFFECT: "Restart is required to take effect",
        RETRY: "Retry",
        RETRY_RENDER: "Retry Render",
        SAFE_MODE: "Safe Mode",
        SAFE_MODE_NOTICE_FONTS: "You are in safe mode, meaning fonts have been temporarily disabled. {enabled, select, true {If a font appears to be causing the issue, you can press below to disable it persistently.} other {}}",
        SAFE_MODE_NOTICE_PLUGINS: "You are in safe mode, so plugins cannot be loaded. Disable any misbehaving plugins, then return to Normal Mode from the General settings page.",
        SAFE_MODE_NOTICE_THEMES: "You are in safe mode, meaning themes have been temporarily disabled. {enabled, select, true {If a theme appears to be causing the issue, you can press below to disable it persistently.} other {}}",
        SEARCH: "Search",
        SEPARATOR: ", ",
        SETTINGS_ACTIVATE_DISCORD_EXPERIMENTS: "Activate Discord Experiments",
        SETTINGS_ACTIVATE_DISCORD_EXPERIMENTS_DESC: "Warning: Messing with this feature may lead to account termination. I heavily discourage using this and am not responsible for anything that happens if you use it",
        STACK_TRACE: "Stack Trace",
        SUCCESSFULLY_INSTALLED: "Successfully installed",
        THEME_EXTRACTOR_DESC: "This pack overrides the following: {fonts}",
        THEME_REFETCH_FAILED: "Failed to refetch theme",
        THEME_REFETCH_SUCCESSFUL: "Successfully refetched theme",
        THEMES: "Themes",
        THEMES_RELOAD_FOR_CHANGES: "Reload the app to fully apply changes",
        TOASTS_INSTALLED_PLUGIN: "Installed plugin",
        TOASTS_PLUGIN_UPDATE: "{update, select, true {Enabled} other {Disabled}} updates for {name}",
        UH_OH: "Uh Oh",
        UNINSTALL: "Uninstall",
        UNINSTALL_TITLE: "Uninstall {title}",
        URL_PLACEHOLDER: "https://github.com/kmmiio99o/ShiggyCord",
        VERSION: "Version",
        VERSIONS: "Versions"
      };
    }
  });

  // src/core/i18n/index.ts
  function fetchLocale(locale) {
    var resolvedLocale = _lastSetLocale = languageMap[locale] ?? locale;
    logger.log("[i18n] fetchLocale called:", locale, "->", resolvedLocale);
    if (!_loadedLocale.has(resolvedLocale)) {
      _loadedLocale.add(resolvedLocale);
      if (resolvedLocale.toLowerCase().startsWith("en")) {
        logger.log("[i18n] Using local default.json for English locale");
        _loadedStrings[resolvedLocale] = default_default;
        _currentLocale = resolvedLocale;
      } else {
        fetch(`https://codeberg.org/cocobo1/kettu-i18n/raw/branch/main/base/${resolvedLocale}.json`).then((r) => r.json()).then((strings) => {
          logger.log("[i18n] Loaded strings for:", resolvedLocale);
          _loadedStrings[resolvedLocale] = strings;
          _currentLocale = resolvedLocale;
        }).catch((e) => logger.error(`[i18n] Error fetching strings for ${resolvedLocale}: ${e}`));
      }
    } else {
      _currentLocale = resolvedLocale;
    }
  }
  function initFetchI18nStrings() {
    var attempts = 0;
    var checkAndFetch = () => {
      attempts++;
      try {
        var LocaleStore = findByStoreName("LocaleStore");
        logger.log("[i18n] Attempt", attempts, "- LocaleStore:", !!LocaleStore);
        if (!LocaleStore) {
          logger.log("[i18n] LocaleStore not found yet");
          return false;
        }
        if (LocaleStore?._isInitialized !== true) {
          logger.log("[i18n] LocaleStore not initialized yet");
          return false;
        }
        var locale = LocaleStore.locale;
        if (locale) {
          logger.log("[i18n] Using LocaleStore:", locale);
          fetchLocale(locale);
          return true;
        }
      } catch (e) {
        logger.log("[i18n] Error:", e);
      }
      return false;
    };
    var tryTimes = () => {
      if (checkAndFetch()) return;
      if (attempts < 15) {
        setTimeout(tryTimes, 500);
      }
    };
    tryTimes();
    var cb = (e) => {
      if (e?.settings?.changes?.loading) {
        logger.log("[i18n] Settings loading, skipping...");
        return;
      }
      var locale = e?.settings?.changes?.protoToSave?.localization?.locale?.value;
      logger.log("[i18n] Locale changed:", locale);
      if (locale) {
        logger.log("[i18n] Found locale in event:", locale);
        fetchLocale(locale);
      }
    };
    FluxDispatcher.subscribe("USER_SETTINGS_PROTO_UPDATE_EDIT_INFO", cb);
    return () => {
      FluxDispatcher.unsubscribe("USER_SETTINGS_PROTO_UPDATE_EDIT_INFO", cb);
    };
  }
  function formatString(key2, val) {
    var str = Strings[key2];
    if (!str) return str;
    try {
      return new IntlMessageFormat(str).format(val);
    } catch (e) {
      if (e?.name === "SyntaxError") {
        logger.warn(`[i18n] Failed to parse message for key "${String(key2)}":`, e.message);
        return str;
      }
      logger.warn(`[i18n] Failed to format message for key "${String(key2)}":`, e?.message ?? e);
      return str;
    }
  }
  var IntlMessageFormat, _currentLocale, _lastSetLocale, _loadedLocale, _loadedStrings, Strings, languageMap;
  var init_i18n = __esm({
    "src/core/i18n/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_logger();
      init_common();
      init_wrappers();
      init_default();
      IntlMessageFormat = findByNameLazy("MessageFormat");
      _currentLocale = null;
      _lastSetLocale = null;
      _loadedLocale = /* @__PURE__ */ new Set();
      _loadedStrings = {};
      Strings = new Proxy({}, {
        get: (_t5, prop2) => {
          if (_currentLocale && _loadedStrings[_currentLocale]?.[prop2]) {
            return _loadedStrings[_currentLocale]?.[prop2];
          }
          return default_default[prop2];
        }
      });
      languageMap = {
        "ar-SA": "ar",
        "bn-BD": "bn",
        "ca-ES": "ca",
        "de-DE": "de",
        "es-ES": "es",
        "es-419": "es",
        "fa-IR": "fa",
        "fi-FI": "fi",
        "fr-FR": "fr",
        "hi-IN": "hi",
        "hr-HR": "hr",
        "hu-HU": "hu",
        "id-ID": "id",
        "it-IT": "it",
        "ja-JP": "ja",
        "pl-PL": "pl",
        "pt-BR": "pt_BR",
        "ru-RU": "ru",
        "sk-SK": "sk",
        "sv-SE": "sv",
        "tr-TR": "tr",
        "vi-VN": "vi"
      };
    }
  });

  // src/lib/ui/toasts.ts
  var toasts_exports = {};
  __export(toasts_exports, {
    showToast: () => showToast
  });
  function safeUuid4() {
    try {
      var fn = uuid4();
      return typeof fn === "string" ? fn : "vd-toast-fallback-" + Math.random().toString(36).slice(2, 8);
    } catch (_2) {
      return "vd-toast-fallback-" + Math.random().toString(36).slice(2, 8);
    }
  }
  var uuid4, showToast;
  var init_toasts = __esm({
    "src/lib/ui/toasts.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_i18n();
      init_assets();
      init_lazy();
      init_common();
      init_wrappers();
      ({ uuid4 } = lazyDestructure(() => findByProps("uuid4")));
      showToast = (content, asset) => {
        try {
          var toastModule = toasts;
          if (!toastModule || typeof toastModule.open !== "function") {
            console.warn("[Shiggy] Toast module not resolved; skipping toast:", content);
            return;
          }
          toastModule.open({
            key: `vd-toast-${safeUuid4()}`,
            content,
            source: asset,
            icon: asset
          });
        } catch (e) {
          console.warn("[Shiggy] Toast failed:", content, e);
        }
      };
      showToast.showCopyToClipboard = (message = Strings.COPIED_TO_CLIPBOARD) => {
        try {
          showToast(message, findAssetId("toast_copy_link"));
        } catch (e) {
          console.warn("[Shiggy] Toast (clipboard) failed:", message, e);
        }
      };
    }
  });

  // src/lib/api/debug.ts
  var debug_exports = {};
  __export(debug_exports, {
    connectRdt: () => connectRdt,
    connectToDebugger: () => connectToDebugger2,
    disconnectFromDebugger: () => disconnectFromDebugger2,
    disconnectRdt: () => disconnectRdt,
    getDebugInfo: () => getDebugInfo,
    initDebugger: () => initDebugger,
    isConnectedToDebugger: () => isConnectedToDebugger2,
    patchLogHook: () => patchLogHook,
    rdtClient: () => rdtClient,
    rdtConnected: () => rdtConnected,
    toggleSafeMode: () => toggleSafeMode,
    useIsRdtConnected: () => useIsRdtConnected,
    versionHash: () => versionHash
  });
  function toggleSafeMode() {
    return _async_to_generator(function* () {
      settings.safeMode = {
        ...settings.safeMode,
        enabled: !settings.safeMode?.enabled
      };
      if (isThemeSupported()) {
        if (getThemeFromLoader()?.id) settings.safeMode.currentThemeId = getThemeFromLoader().id;
        if (settings.safeMode?.enabled) {
          yield selectTheme(null);
        } else if (settings.safeMode?.currentThemeId) {
          yield selectTheme(themes[settings.safeMode?.currentThemeId]);
        }
      }
      setTimeout(BundleUpdaterManager.reload, 400);
    })();
  }
  function serializeMessage2(msg) {
    return JSON.stringify(msg);
  }
  function sendLog2(level, ...args) {
    if (socket2?.readyState === WebSocket.OPEN) {
      var message = {
        type: "log",
        data: {
          level,
          message: args
        }
      };
      socket2.send(serializeMessage2(message));
    }
  }
  function patchConsoleAndLogger2() {
    originalConsoleLog2 = console.log;
    console.log = function(...args) {
      originalConsoleLog2.apply(console, args);
      sendLog2("default", ...args);
    };
    originalConsoleError2 = console.error;
    console.error = function(...args) {
      originalConsoleError2.apply(console, args);
      sendLog2("error", ...args);
    };
    originalConsoleWarn2 = console.warn;
    console.warn = function(...args) {
      originalConsoleWarn2.apply(console, args);
      sendLog2("warn", ...args);
    };
    if (logger) {
      originalLoggerLog2 = logger.log;
      logger.log = function(...args) {
        originalLoggerLog2.apply(logger, args);
        sendLog2("default", ...args);
      };
      originalLoggerError2 = logger.error;
      logger.error = function(...args) {
        originalLoggerError2.apply(logger, args);
        sendLog2("error", ...args);
      };
      originalLoggerWarn2 = logger.warn;
      logger.warn = function(...args) {
        originalLoggerWarn2.apply(logger, args);
        sendLog2("warn", ...args);
      };
    }
  }
  function unpatchConsoleAndLogger2() {
    if (originalConsoleLog2) {
      console.log = originalConsoleLog2;
      originalConsoleLog2 = void 0;
    }
    if (originalConsoleError2) {
      console.error = originalConsoleError2;
      originalConsoleError2 = void 0;
    }
    if (originalConsoleWarn2) {
      console.warn = originalConsoleWarn2;
      originalConsoleWarn2 = void 0;
    }
    if (logger) {
      if (originalLoggerLog2) {
        logger.log = originalLoggerLog2;
        originalLoggerLog2 = void 0;
      }
      if (originalLoggerError2) {
        logger.error = originalLoggerError2;
        originalLoggerError2 = void 0;
      }
      if (originalLoggerWarn2) {
        logger.warn = originalLoggerWarn2;
        originalLoggerWarn2 = void 0;
      }
    }
  }
  function connectToDebugger2(url2) {
    if (socket2 !== void 0 && socket2.readyState !== WebSocket.CLOSED) {
      unpatchConsoleAndLogger2();
      socket2.close();
    }
    if (!url2) {
      showToast("Invalid debugger URL!", findAssetId("Small"));
      return;
    }
    try {
      socket2 = new WebSocket(`ws://${url2}`);
      socket2.addEventListener("open", () => {
        showToast("Connected to debugger.", findAssetId("Check"));
        var hello = {
          type: "hello",
          data: {
            version: VERSION2
          }
        };
        socket2?.send(serializeMessage2(hello));
        patchConsoleAndLogger2();
      });
      socket2.addEventListener("message", (message) => {
        try {
          var data = JSON.parse(message.data);
          if (data.type === "run" && data.data?.code) {
            try {
              (0, eval)(data.data.code);
            } catch (e) {
              console.error("Error executing remote code:", e);
            }
          }
        } catch (e) {
          try {
            (0, eval)(message.data);
          } catch (err) {
            console.error(err);
          }
        }
      });
      socket2.addEventListener("close", (e) => {
        logger.error(`Debugger disconnected. (${e?.code}, ${e?.reason || "no reason specified"})`);
        unpatchConsoleAndLogger2();
      });
      socket2.addEventListener("error", (e) => {
        var err = e?.message || e?.error?.message || "WebSocket Connection Errored";
        logger.error("Debugger error:", err);
        showToast("An error occurred with the debugger connection!", findAssetId("Small"));
        unpatchConsoleAndLogger2();
      });
    } catch (e) {
      logger.error("Failed to connect to debugger:", e);
      showToast("Failed to connect to debugger!", findAssetId("Small"));
    }
  }
  function disconnectFromDebugger2() {
    if (socket2) {
      unpatchConsoleAndLogger2();
      socket2.close();
      socket2 = void 0;
      showToast("Disconnected from debugger.", findAssetId("Check"));
    }
  }
  function isConnectedToDebugger2() {
    return socket2?.readyState === WebSocket.OPEN;
  }
  function bump() {
    for (var x2 of changeHooks) x2(rdtConnected);
  }
  function cleanupRdt() {
    rdtClient = null;
    rdtConnected = false;
    bump();
  }
  function connectRdt(url2, quiet) {
    if (!isReactDevToolsPreloaded() || rdtClient) return;
    var base = url2.split(":").slice(0, -1).join(":");
    var ws = rdtClient = new WebSocket(`ws://${base}:${rdtPort}`);
    ws.addEventListener("open", () => {
      if (!quiet) showToast("Connected to React DevTools", findAssetId("CheckmarkSmallIcon"));
      rdtConnected = true;
      bump();
    });
    ws.addEventListener("close", (e) => {
      logger.error(`React DevTools disconnected. (${e?.code}, ${e?.reason || "no reason specified"})`);
      cleanupRdt();
    });
    ws.addEventListener("error", (e) => {
      cleanupRdt();
      var err = e?.message || e?.error?.message || "WebSocket Connection Errored";
      logger.error("React DevTools error:", err);
      if (!quiet) showToast(err, findAssetId("CircleXIcon-primary"));
    });
    var devTools = globalThis[getReactDevToolsProp() || "__vendetta_rdc"];
    if (devTools?.connectToDevTools) {
      devTools.connectToDevTools({
        websocket: ws,
        resolveRNStyle: import_react_native7.StyleSheet.flatten
      });
    }
  }
  function disconnectRdt() {
    rdtClient?.close();
  }
  function useIsRdtConnected() {
    var [connected, update] = React.useState(rdtConnected);
    React.useEffect(() => {
      changeHooks.add(update);
      return () => void changeHooks.delete(update);
    }, []);
    return connected;
  }
  function patchLogHook() {
    var unpatch2 = after("nativeLoggingHook", globalThis, (args) => {
      if (socket2?.readyState === WebSocket.OPEN) {
        sendLog2(args[1] === "error" ? "error" : args[1] === "warn" ? "warn" : "default", args[0]);
      }
      logger.log(args[0]);
    });
    return () => {
      socket2 && socket2.close();
      unpatch2();
    };
  }
  function getDebugInfo() {
    var hermesProps = globalThis.HermesInternal.getRuntimeProperties();
    var hermesVer = hermesProps["OSS Release Version"];
    var padding = "for RN ";
    var PlatformConstants = import_react_native7.Platform.constants;
    var rnVer = PlatformConstants.reactNativeVersion;
    return {
      vendetta: {
        version: versionHash.split("-")[0],
        loader: getLoaderName()
      },
      bunny: {
        version: versionHash,
        loader: {
          name: getLoaderName(),
          version: getLoaderVersion()
        }
      },
      discord: {
        version: NativeClientInfoModule.getConstants().Version,
        build: NativeClientInfoModule.getConstants().Build
      },
      react: {
        version: React.version,
        nativeVersion: hermesVer.startsWith(padding) ? hermesVer.substring(padding.length) : `${rnVer.major}.${rnVer.minor}.${rnVer.patch}`
      },
      hermes: {
        version: hermesVer,
        buildType: hermesProps.Build,
        bytecodeVersion: hermesProps["Bytecode Version"]
      },
      ...import_react_native7.Platform.select({
        android: {
          os: {
            name: "Android",
            version: PlatformConstants.Release,
            sdk: PlatformConstants.Version
          }
        },
        ios: {
          os: {
            name: PlatformConstants.systemName,
            version: PlatformConstants.osVersion
          }
        }
      }),
      ...import_react_native7.Platform.select({
        android: {
          device: {
            manufacturer: PlatformConstants.Manufacturer,
            brand: PlatformConstants.Brand,
            model: PlatformConstants.Model,
            codename: NativeDeviceModule.device
          }
        },
        ios: {
          device: {
            manufacturer: NativeDeviceModule.deviceManufacturer,
            brand: NativeDeviceModule.deviceBrand,
            model: NativeDeviceModule.deviceModel,
            codename: NativeDeviceModule.device
          }
        }
      })
    };
  }
  function initDebugger() {
    if (settings.autoDebugger) {
      try {
        connectToDebugger2(settings.debuggerUrl);
      } catch (e) {
        logger.error("Failed to connect to Debugger during startup:", e);
      }
    }
    if (settings.autoDevTools) {
      try {
        if (settings.devToolsUrl) {
          connectRdt(settings.devToolsUrl, true);
        }
      } catch (e) {
        logger.error("Failed to connect to ReactDevTools during startup:", e);
      }
    }
  }
  var import_react_native7, socket2, originalConsoleLog2, originalConsoleError2, originalConsoleWarn2, originalLoggerLog2, originalLoggerError2, originalLoggerWarn2, VERSION2, rdtPort, rdtClient, rdtConnected, changeHooks, versionHash;
  var init_debug = __esm({
    "src/lib/api/debug.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_themes();
      init_assets();
      init_loader();
      init_modules();
      init_patcher();
      init_settings();
      init_logger();
      init_toasts();
      import_react_native7 = __toESM(require_react_native());
      VERSION2 = 1;
      rdtPort = 8097;
      rdtClient = null;
      rdtConnected = false;
      changeHooks = /* @__PURE__ */ new Set();
      versionHash = "1.4.1.11";
    }
  });

  // src/lib/ui/color.ts
  function isSemanticColor(sym) {
    return colorResolver.isSemanticColor(sym);
  }
  function resolveSemanticColor(sym, theme = ThemeStore3.theme) {
    return colorResolver.resolveSemanticColor(theme, sym);
  }
  var color, semanticColors, rawColors, ThemeStore3, colorResolver;
  var init_color = __esm({
    "src/lib/ui/color.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_common();
      init_wrappers();
      color = findByProps("SemanticColor");
      semanticColors = color?.default?.colors ?? constants?.ThemeColorMap;
      rawColors = color?.default?.unsafe_rawColors ?? constants?.Colors;
      ThemeStore3 = findByStoreNameLazy("ThemeStore");
      colorResolver = color.default.meta ??= color.default.internal;
    }
  });

  // src/lib/ui/styles.ts
  var styles_exports = {};
  __export(styles_exports, {
    TextStyleSheet: () => TextStyleSheet,
    ThemeContext: () => ThemeContext,
    createLegacyClassComponentStyles: () => createLegacyClassComponentStyles,
    createStyles: () => createStyles,
    createThemedStyleSheet: () => createThemedStyleSheet
  });
  function createStyles(sheet) {
    return proxyLazy(() => Styles.createStyles(sheet));
  }
  function createLegacyClassComponentStyles(sheet) {
    return proxyLazy(() => Styles.createLegacyClassComponentStyles(sheet));
  }
  function createThemedStyleSheet(sheet) {
    for (var key2 in sheet) {
      sheet[key2] = new Proxy(import_react_native8.StyleSheet.flatten(sheet[key2]), {
        get(target, prop2, receiver) {
          var res = Reflect.get(target, prop2, receiver);
          return isSemanticColor(res) ? resolveSemanticColor(res) : res;
        }
      });
    }
    return sheet;
  }
  var import_react_native8, Styles, ThemeContext, TextStyleSheet;
  var init_styles = __esm({
    "src/lib/ui/styles.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_lazy();
      init_wrappers();
      init_color();
      import_react_native8 = __toESM(require_react_native());
      Styles = findByPropsLazy("createStyles");
      ({ ThemeContext } = lazyDestructure(() => findByProps("ThemeContext"), {
        hint: "object"
      }));
      ({ TextStyleSheet } = lazyDestructure(() => findByProps("TextStyleSheet")));
    }
  });

  // src/core/ui/reporter/utils/parseComponentStack.tsx
  function parseComponentStack(componentStack) {
    return componentStack.split(/[\s|\n]+?in /).filter(Boolean);
  }
  var init_parseComponentStack = __esm({
    "src/core/ui/reporter/utils/parseComponentStack.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // src/core/ui/reporter/components/ErrorComponentStackCard.tsx
  function ErrorComponentStackCard(props) {
    var [collapsed, setCollapsed] = (0, import_react.useState)(true);
    var stack;
    try {
      stack = parseComponentStack(props.componentStack);
      stack = collapsed ? stack.slice(0, 4) : stack;
    } catch (unused) {
      return;
    }
    return /* @__PURE__ */ jsx(Card, {
      children: /* @__PURE__ */ jsxs(import_react_native9.View, {
        style: {
          gap: 8
        },
        children: [
          /* @__PURE__ */ jsx(Text, {
            variant: "heading-lg/bold",
            children: "Component Stack"
          }),
          /* @__PURE__ */ jsx(import_react_native9.View, {
            style: {
              gap: 4
            },
            children: stack.map((component) => /* @__PURE__ */ jsxs(import_react_native9.View, {
              style: {
                flexDirection: "row"
              },
              children: [
                /* @__PURE__ */ jsx(Text, {
                  variant: "text-md/bold",
                  color: "text-muted",
                  children: "<"
                }),
                /* @__PURE__ */ jsx(Text, {
                  variant: "text-md/bold",
                  children: component
                }),
                /* @__PURE__ */ jsx(Text, {
                  variant: "text-md/bold",
                  color: "text-muted",
                  children: "/>"
                })
              ]
            }))
          }),
          collapsed && /* @__PURE__ */ jsx(Text, {
            children: "..."
          }),
          /* @__PURE__ */ jsxs(import_react_native9.View, {
            style: {
              gap: 8,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsx(Button, {
                variant: "secondary",
                text: `Show ${collapsed ? "more" : "less"}`,
                icon: collapsed ? findAssetId("down_arrow") : /* @__PURE__ */ jsx(import_react_native9.Image, {
                  style: {
                    transform: [
                      {
                        rotate: `${collapsed ? 0 : 180}deg`
                      }
                    ]
                  },
                  source: findAssetId("down_arrow")
                }),
                onPress: () => setCollapsed((v2) => !v2)
              }),
              /* @__PURE__ */ jsx(Button, {
                variant: "secondary",
                text: "Copy",
                icon: findAssetId("CopyIcon"),
                onPress: () => clipboard.setString(props.componentStack)
              })
            ]
          })
        ]
      })
    });
  }
  var import_react, import_react_native9;
  var init_ErrorComponentStackCard = __esm({
    "src/core/ui/reporter/components/ErrorComponentStackCard.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_parseComponentStack();
      init_assets();
      init_common();
      init_components();
      import_react = __toESM(require_react());
      import_react_native9 = __toESM(require_react_native());
    }
  });

  // src/core/ui/reporter/utils/parseErrorStack.ts
  function isInternalBytecodeSourceUrl(sourceUrl) {
    return sourceUrl === "InternalBytecode.js";
  }
  function parseLine(line) {
    var asFrame = line.match(RE_FRAME);
    if (asFrame) {
      return {
        type: "FRAME",
        functionName: asFrame[1],
        location: asFrame[2] === "native" ? {
          type: "NATIVE"
        } : asFrame[3] === "address at " ? isInternalBytecodeSourceUrl(asFrame[4]) ? {
          type: "INTERNAL_BYTECODE",
          sourceUrl: asFrame[4],
          line1Based: Number.parseInt(asFrame[5], 10),
          virtualOffset0Based: Number.parseInt(asFrame[6], 10)
        } : {
          type: "BYTECODE",
          sourceUrl: asFrame[4],
          line1Based: Number.parseInt(asFrame[5], 10),
          virtualOffset0Based: Number.parseInt(asFrame[6], 10)
        } : {
          type: "SOURCE",
          sourceUrl: asFrame[4],
          line1Based: Number.parseInt(asFrame[5], 10),
          column1Based: Number.parseInt(asFrame[6], 10)
        }
      };
    }
    var asSkipped = line.match(RE_SKIPPED);
    if (asSkipped) {
      return {
        type: "SKIPPED",
        count: Number.parseInt(asSkipped[1], 10)
      };
    }
  }
  function parseHermesStack(stack) {
    var lines = stack.split(/\n/);
    var entries = [];
    var lastMessageLine = -1;
    for (var i2 = 0; i2 < lines.length; ++i2) {
      var line = lines[i2];
      if (!line) {
        continue;
      }
      var entry = parseLine(line);
      if (entry) {
        entries.push(entry);
        continue;
      }
      if (RE_COMPONENT_NO_STACK.test(line)) {
        continue;
      }
      lastMessageLine = i2;
      entries = [];
    }
    var message = lines.slice(0, lastMessageLine + 1).join("\n");
    return {
      message,
      entries
    };
  }
  function convertHermesStack(stack) {
    var frames = [];
    for (var entry of stack.entries) {
      if (entry.type !== "FRAME") {
        continue;
      }
      var { location, functionName } = entry;
      if (location.type === "NATIVE" || location.type === "INTERNAL_BYTECODE") {
        continue;
      }
      frames.push({
        methodName: functionName,
        file: location.sourceUrl,
        lineNumber: location.line1Based,
        column: location.type === "SOURCE" ? location.column1Based - 1 : location.virtualOffset0Based
      });
    }
    return frames;
  }
  function parseErrorStack(errorStack) {
    if (errorStack == null) {
      return [];
    }
    var parsedStack = Array.isArray(errorStack) ? errorStack : convertHermesStack(parseHermesStack(errorStack));
    return parsedStack;
  }
  var RE_FRAME, RE_SKIPPED, RE_COMPONENT_NO_STACK;
  var init_parseErrorStack = __esm({
    "src/core/ui/reporter/utils/parseErrorStack.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      RE_FRAME = /^ {4}at (.+?)(?: \((native)\)?| \((address at )?(.*?):(\d+):(\d+)\))$/;
      RE_SKIPPED = /^ {4}... skipping (\d+) frames$/;
      RE_COMPONENT_NO_STACK = /^ {4}at .*$/;
    }
  });

  // src/lib/ui/sheets.ts
  var sheets_exports = {};
  __export(sheets_exports, {
    hideSheet: () => hideSheet,
    showSheet: () => showSheet
  });
  function showSheet(key2, lazyImport, props) {
    if (!("then" in lazyImport)) lazyImport = Promise.resolve({
      default: lazyImport
    });
    actionSheet.openLazy(lazyImport, key2, props ?? {});
  }
  function hideSheet(key2) {
    actionSheet.hideActionSheet(key2);
  }
  var actionSheet;
  var init_sheets = __esm({
    "src/lib/ui/sheets.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_wrappers();
      actionSheet = findByPropsLazy("openLazy", "hideActionSheet");
    }
  });

  // src/lib/ui/components/wrappers/AlertModal.tsx
  function AlertModal2(props) {
    var forwardFailedModal = findByFilePath("modules/forwarding/native/ForwardFailedAlertModal.tsx");
    if (!forwardFailedModal && "extraContent" in props) {
      props.content = /* @__PURE__ */ jsxs(import_react_native10.View, {
        style: {
          gap: 16
        },
        children: [
          /* @__PURE__ */ jsx(Text, {
            variant: "text-md/medium",
            color: "text-muted",
            children: props.content
          }),
          /* @__PURE__ */ jsx(import_react_native10.View, {
            children: props.extraContent
          })
        ]
      });
      delete props.extraContent;
    }
    return /* @__PURE__ */ jsx(_AlertModal, {
      ...props
    });
  }
  var import_react_native10, _AlertModal, _AlertActionButton, AlertActionButton2;
  var init_AlertModal = __esm({
    "src/lib/ui/components/wrappers/AlertModal.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_lazy();
      init_metro();
      init_components();
      import_react_native10 = __toESM(require_react_native());
      ({ AlertModal: _AlertModal, AlertActionButton: _AlertActionButton } = lazyDestructure(() => findByProps("AlertModal", "AlertActions")));
      AlertActionButton2 = _AlertActionButton;
    }
  });

  // src/lib/ui/components/wrappers/index.ts
  var wrappers_exports = {};
  __export(wrappers_exports, {
    AlertActionButton: () => AlertActionButton2,
    AlertModal: () => AlertModal2
  });
  var init_wrappers2 = __esm({
    "src/lib/ui/components/wrappers/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_AlertModal();
    }
  });

  // src/lib/ui/components/Codeblock.tsx
  function Codeblock({ selectable, style, children }) {
    if (!selectable) return /* @__PURE__ */ jsx(TextBasedCodeblock, {
      style,
      children
    });
    return import_react_native11.Platform.select({
      ios: /* @__PURE__ */ jsx(InputBasedCodeblock, {
        style,
        children
      }),
      default: /* @__PURE__ */ jsx(TextBasedCodeblock, {
        style,
        children,
        selectable: true
      })
    });
  }
  var import_react_native11, useStyles, InputBasedCodeblock, TextBasedCodeblock;
  var init_Codeblock = __esm({
    "src/lib/ui/components/Codeblock.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_common();
      init_color();
      init_styles();
      import_react_native11 = __toESM(require_react_native());
      useStyles = createStyles({
        codeBlock: {
          fontFamily: constants.Fonts.CODE_NORMAL,
          fontSize: 12,
          textAlignVertical: "center",
          backgroundColor: semanticColors.CARD_BACKGROUND_DEFAULT,
          color: semanticColors.TEXT_DEFAULT,
          borderWidth: 1,
          borderRadius: 12,
          borderColor: semanticColors.BORDER_SUBTLE,
          padding: 10
        }
      });
      InputBasedCodeblock = ({ style, children }) => /* @__PURE__ */ jsx(import_react_native11.TextInput, {
        editable: false,
        multiline: true,
        style: [
          useStyles().codeBlock,
          style && style
        ],
        value: children
      });
      TextBasedCodeblock = ({ selectable, style, children }) => /* @__PURE__ */ jsx(import_react_native11.Text, {
        selectable,
        style: [
          useStyles().codeBlock,
          style && style
        ],
        children
      });
    }
  });

  // src/lib/ui/components/ErrorBoundary.tsx
  var _React_Component, ErrorBoundary;
  var init_ErrorBoundary = __esm({
    "src/lib/ui/components/ErrorBoundary.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_call_super();
      init_class_call_check();
      init_create_class();
      init_define_property();
      init_inherits();
      init_jsxRuntime();
      init_ErrorCard();
      init_common();
      init_styles();
      ErrorBoundary = /* @__PURE__ */ (function(_superClass) {
        "use strict";
        _inherits(ErrorBoundary2, _superClass);
        function ErrorBoundary2(props) {
          _class_call_check(this, ErrorBoundary2);
          var _this;
          _this = _call_super(this, ErrorBoundary2, [
            props
          ]);
          _this.state = {
            hasErr: false
          };
          return _this;
        }
        _create_class(ErrorBoundary2, [
          {
            key: "render",
            value: function render() {
              if (!this.state.hasErr) return this.props.children;
              return /* @__PURE__ */ jsx(ErrorCard, {
                error: this.state.error,
                onRetryRender: () => this.setState({
                  hasErr: false
                })
              });
            }
          }
        ]);
        return ErrorBoundary2;
      })(_React_Component = React2.Component);
      _define_property(ErrorBoundary, "contextType", ThemeContext);
      _define_property(ErrorBoundary, "getDerivedStateFromError", (error) => ({
        hasErr: true,
        error
      }));
    }
  });

  // src/lib/ui/components/Search.tsx
  function SearchIcon() {
    return /* @__PURE__ */ jsx(import_react_native12.Image, {
      style: {
        width: 16,
        height: 16
      },
      source: findAssetId("icon-search")
    });
  }
  var import_react_native12, Search_default;
  var init_Search = __esm({
    "src/lib/ui/components/Search.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_common();
      init_i18n();
      init_assets();
      init_components();
      init_ErrorBoundary();
      import_react_native12 = __toESM(require_react_native());
      Search_default = (({ onChangeText, placeholder, style, isRound }) => {
        var [query, setQuery] = React2.useState("");
        var onChange = (value) => {
          setQuery(value);
          onChangeText?.(value);
        };
        var inputStyle = isRound ? {
          borderRadius: 9999,
          overflow: "hidden"
        } : void 0;
        return /* @__PURE__ */ jsx(ErrorBoundary, {
          children: /* @__PURE__ */ jsx(import_react_native12.View, {
            style,
            children: /* @__PURE__ */ jsx(TextInput, {
              grow: true,
              isClearable: true,
              leadingIcon: SearchIcon,
              placeholder: placeholder ?? Strings.SEARCH,
              onChange,
              returnKeyType: "search",
              size: "md",
              autoCapitalize: "none",
              autoCorrect: false,
              isRound,
              style: inputStyle,
              value: query
            })
          })
        });
      });
    }
  });

  // src/lib/ui/components/Summary.tsx
  function Summary({ label, icon, noPadding = false, noAnimation = false, children }) {
    var [hidden, setHidden] = React.useState(true);
    return /* @__PURE__ */ jsxs(Fragment, {
      children: [
        /* @__PURE__ */ jsx(TableRow, {
          label,
          icon: icon && /* @__PURE__ */ jsx(TableRow.Icon, {
            source: findAssetId(icon)
          }),
          trailing: /* @__PURE__ */ jsx(LegacyFormRow.Arrow, {
            style: {
              transform: [
                {
                  rotate: `${hidden ? 180 : 90}deg`
                }
              ]
            }
          }),
          onPress: () => {
            setHidden(!hidden);
            if (!noAnimation) import_react_native13.LayoutAnimation.configureNext(import_react_native13.LayoutAnimation.Presets.easeInEaseOut);
          }
        }),
        !hidden && /* @__PURE__ */ jsx(Fragment, {
          children: /* @__PURE__ */ jsx(import_react_native13.View, {
            style: !noPadding && {
              paddingHorizontal: 15
            },
            children
          })
        })
      ]
    });
  }
  var import_react_native13;
  var init_Summary = __esm({
    "src/lib/ui/components/Summary.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_assets();
      init_components();
      import_react_native13 = __toESM(require_react_native());
    }
  });

  // src/lib/ui/components/index.ts
  var components_exports2 = {};
  __export(components_exports2, {
    Codeblock: () => Codeblock,
    ErrorBoundary: () => ErrorBoundary,
    Search: () => Search_default,
    Summary: () => Summary,
    wrappers: () => wrappers_exports
  });
  var init_components2 = __esm({
    "src/lib/ui/components/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_wrappers2();
      init_Codeblock();
      init_ErrorBoundary();
      init_Search();
      init_Summary();
    }
  });

  // src/core/ui/reporter/components/ErrorDetailsActionSheet.tsx
  function ErrorDetailsActionSheet(props) {
    return /* @__PURE__ */ jsx(ActionSheet, {
      children: /* @__PURE__ */ jsxs(import_react_native14.View, {
        style: {
          gap: 12,
          paddingVertical: 12
        },
        children: [
          /* @__PURE__ */ jsx(Text, {
            variant: "heading-lg/extrabold",
            children: "Error"
          }),
          /* @__PURE__ */ jsx(Codeblock, {
            selectable: true,
            children: props.error.message
          }),
          hasStack(props.error) && /* @__PURE__ */ jsx(ErrorStackCard, {
            error: props.error
          }),
          isComponentStack(props.error) ? /* @__PURE__ */ jsx(ErrorComponentStackCard, {
            componentStack: props.error.componentStack
          }) : null
        ]
      })
    });
  }
  var import_react_native14;
  var init_ErrorDetailsActionSheet = __esm({
    "src/core/ui/reporter/components/ErrorDetailsActionSheet.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_isStack();
      init_components2();
      init_components();
      import_react_native14 = __toESM(require_react_native());
      init_ErrorComponentStackCard();
      init_ErrorStackCard();
    }
  });

  // src/core/ui/reporter/components/ErrorCard.tsx
  function ErrorCard(props) {
    return /* @__PURE__ */ jsx(Card, {
      children: /* @__PURE__ */ jsxs(Stack, {
        children: [
          props.header && typeof props.header !== "string" ? props.header : /* @__PURE__ */ jsx(Text, {
            variant: "heading-lg/bold",
            children: props.header ?? Strings.UH_OH
          }),
          /* @__PURE__ */ jsx(import_react_native15.View, {
            style: {
              backgroundColor: semanticColors.BACKGROUND_SECONDARY,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: semanticColors.BACKGROUND_TERTIARY,
              padding: 12
            },
            children: /* @__PURE__ */ jsx(Text, {
              style: {
                color: semanticColors.TEXT_MUTED
              },
              children: String(props.error)
            })
          }),
          /* @__PURE__ */ jsxs(TwinButtons, {
            children: [
              props.onRetryRender && /* @__PURE__ */ jsx(Button, {
                variant: "destructive",
                // icon={findAssetId("RetryIcon")}
                text: Strings.RETRY_RENDER,
                onPress: props.onRetryRender
              }),
              props.error instanceof Error ? /* @__PURE__ */ jsx(Button, {
                text: "Details",
                // icon={findAssetId("CircleInformationIcon-primary")}
                onPress: () => showSheet("BunnyErrorDetailsActionSheet", ErrorDetailsActionSheet, {
                  error: props.error
                })
              }) : null
            ]
          })
        ]
      })
    });
  }
  var import_react_native15, INDEX_BUNDLE_FILE;
  var init_ErrorCard = __esm({
    "src/core/ui/reporter/components/ErrorCard.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_i18n();
      init_sheets();
      init_components();
      init_color();
      import_react_native15 = __toESM(require_react_native());
      init_ErrorDetailsActionSheet();
      INDEX_BUNDLE_FILE = globalThis.HermesInternal.getFunctionLocation(globalThis.__r).fileName;
    }
  });

  // src/core/ui/reporter/components/ErrorStackCard.tsx
  function ErrorStackCard(props) {
    var [collapsed, setCollapsed] = (0, import_react2.useState)(true);
    var stack;
    try {
      var parsedErrorStack = parseErrorStack(props.error.stack);
      stack = collapsed ? parsedErrorStack.slice(0, 4) : parsedErrorStack;
    } catch (unused) {
      return null;
    }
    return /* @__PURE__ */ jsx(Card, {
      children: /* @__PURE__ */ jsxs(import_react_native16.View, {
        style: {
          gap: 12
        },
        children: [
          /* @__PURE__ */ jsx(Text, {
            variant: "heading-lg/bold",
            children: "Call Stack"
          }),
          /* @__PURE__ */ jsx(import_react_native16.View, {
            style: {
              gap: 4
            },
            children: stack.map((f2, id2) => /* @__PURE__ */ jsx(Line, {
              id: id2,
              frame: f2
            }))
          }),
          collapsed && /* @__PURE__ */ jsx(Text, {
            children: "..."
          }),
          /* @__PURE__ */ jsxs(import_react_native16.View, {
            style: {
              gap: 8,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsx(Button, {
                variant: "secondary",
                text: `Show ${collapsed ? "more" : "less"}`,
                icon: collapsed ? findAssetId("down_arrow") : /* @__PURE__ */ jsx(import_react_native16.Image, {
                  style: {
                    transform: [
                      {
                        rotate: `${collapsed ? 0 : 180}deg`
                      }
                    ]
                  },
                  source: findAssetId("down_arrow")
                }),
                onPress: () => setCollapsed((v2) => !v2)
              }),
              /* @__PURE__ */ jsx(Button, {
                variant: "secondary",
                text: "Copy",
                icon: findAssetId("CopyIcon"),
                onPress: () => clipboard.setString(props.error.stack)
              })
            ]
          })
        ]
      })
    });
  }
  function Line(props) {
    var [collapsed, setCollapsed] = (0, import_react2.useState)(true);
    return /* @__PURE__ */ jsxs(import_react_native16.Pressable, {
      onPress: () => setCollapsed((v2) => !v2),
      children: [
        /* @__PURE__ */ jsx(Text, {
          style: {
            fontFamily: constants.Fonts.CODE_BOLD
          },
          children: props.frame.methodName
        }),
        /* @__PURE__ */ jsx(Text, {
          style: {
            fontFamily: constants.Fonts.CODE_NORMAL
          },
          ellipsizeMode: "middle",
          numberOfLines: collapsed ? 1 : void 0,
          children: /* @__PURE__ */ jsxs(Text, {
            color: "text-muted",
            children: [
              props.frame.file === INDEX_BUNDLE_FILE ? "jsbundle" : props.frame.file,
              ":",
              props.frame.lineNumber,
              ":",
              props.frame.column
            ]
          })
        })
      ]
    }, props.id);
  }
  var import_react2, import_react_native16;
  var init_ErrorStackCard = __esm({
    "src/core/ui/reporter/components/ErrorStackCard.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_parseErrorStack();
      init_assets();
      init_common();
      init_components();
      import_react2 = __toESM(require_react());
      import_react_native16 = __toESM(require_react_native());
      init_ErrorCard();
    }
  });

  // src/core/ui/reporter/components/ErrorBoundaryScreen.tsx
  function ErrorBoundaryScreen(props) {
    var styles = useStyles2();
    var debugInfo = getDebugInfo();
    var navigation2 = NavigationNative.useNavigation();
    var [bisectBatches, setBisectBatches] = import_react3.default.useState(null);
    var [bisectIndex, setBisectIndex] = import_react3.default.useState(0);
    var [showBisectUI, setShowBisectUI] = import_react3.default.useState(false);
    var batches = bisectBatches ?? [];
    var currentBatch = batches[bisectIndex] ?? [];
    return /* @__PURE__ */ jsx(SafeAreaProvider, {
      children: /* @__PURE__ */ jsxs(SafeAreaView, {
        style: styles.container,
        children: [
          /* @__PURE__ */ jsxs(import_react_native17.View, {
            style: {
              gap: 4
            },
            children: [
              /* @__PURE__ */ jsx(Text, {
                variant: "display-lg",
                children: "Uh oh."
              }),
              /* @__PURE__ */ jsx(Text, {
                variant: "text-md/normal",
                children: "A crash occurred while rendering a component. This could be caused by a plugin, ShiggyCord, or Discord itself."
              }),
              /* @__PURE__ */ jsxs(Text, {
                variant: "text-sm/normal",
                color: "text-muted",
                children: [
                  debugInfo.os.name,
                  "; ",
                  debugInfo.discord.build,
                  " (",
                  debugInfo.discord.version,
                  "); ",
                  debugInfo.bunny.version
                ]
              })
            ]
          }),
          /* @__PURE__ */ jsxs(import_react_native17.ScrollView, {
            fadingEdgeLength: 64,
            contentContainerStyle: {
              gap: 12
            },
            children: [
              /* @__PURE__ */ jsx(Text, {
                variant: "heading-md/extrabold",
                color: "text-default",
                style: {
                  marginBottom: 8,
                  textAlign: "center"
                },
                selectable: true,
                children: props.error.message || "Unknown error occurred"
              }),
              hasStack(props.error) && /* @__PURE__ */ jsx(ErrorStackCard, {
                error: props.error
              }),
              isComponentStack(props.error) ? /* @__PURE__ */ jsx(ErrorComponentStackCard, {
                componentStack: props.error.componentStack
              }) : null
            ]
          }),
          /* @__PURE__ */ jsxs(Card, {
            style: {
              gap: 12,
              paddingVertical: 16,
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxs(Stack, {
                direction: "horizontal",
                spacing: 12,
                style: {
                  justifyContent: "center",
                  width: "100%"
                },
                children: [
                  /* @__PURE__ */ jsx(Button, {
                    text: "Reload Discord",
                    onPress: () => BundleUpdaterManager.reload(),
                    style: {
                      flex: 1
                    }
                  }),
                  !settings.safeMode?.enabled && /* @__PURE__ */ jsx(Button, {
                    text: "Safe Mode",
                    onPress: () => toggleSafeMode(),
                    style: {
                      flex: 1
                    }
                  })
                ]
              }),
              /* @__PURE__ */ jsx(Button, {
                variant: "destructive",
                text: "Retry Render",
                onPress: () => {
                  try {
                    console.log("[ShiggyCord][ErrorBoundaryScreen] Retry Render clicked");
                  } catch (unused) {
                  }
                  props.rerender();
                },
                style: {
                  width: "100%"
                }
              })
            ]
          })
        ]
      })
    });
  }
  var import_react3, import_react_native17, useStyles2;
  var init_ErrorBoundaryScreen = __esm({
    "src/core/ui/reporter/components/ErrorBoundaryScreen.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      import_react3 = __toESM(require_react());
      init_isStack();
      init_debug();
      init_modules();
      init_settings();
      init_styles();
      init_common();
      init_components();
      import_react_native17 = __toESM(require_react_native());
      init_ErrorComponentStackCard();
      init_ErrorStackCard();
      init_common();
      useStyles2 = createStyles({
        container: {
          flex: 1,
          backgroundColor: tokens.colors.BG_BASE_SECONDARY,
          paddingHorizontal: 16,
          height: "100%",
          gap: 12
        }
      });
    }
  });

  // src/core/debug/patches/patchErrorBoundary.tsx
  function getErrorBoundaryContext() {
    try {
      var ctxt = findByNameLazy("ErrorBoundary")[_lazyContextSymbol];
      if (ctxt) {
        return new Promise((resolve) => ctxt.getExports((exp) => resolve(exp.prototype)));
      }
    } catch (e) {
    }
    return Promise.reject(new Error("ErrorBoundary context not found"));
  }
  function patchErrorBoundary() {
    try {
      console.log("[ShiggyCord] patchErrorBoundary: registering");
    } catch (unused) {
    }
    var ctxPromise = getErrorBoundaryContext().catch((err) => {
      try {
        console.warn("[ShiggyCord] patchErrorBoundary: context lookup failed", err);
      } catch (unused) {
      }
      return null;
    });
    var unpatch2 = after.await("render", ctxPromise, function() {
      try {
        if (!this || !this.state || !this.state.error) return;
        try {
          console.log("[ShiggyCord] patchErrorBoundary: rendering custom error screen", this.state.error);
        } catch (unused) {
        }
        return /* @__PURE__ */ import_react4.default.createElement(ErrorBoundaryMount, {
          error: this.state.error,
          rerender: () => {
            try {
              try {
                this.setState?.({
                  info: null,
                  error: null,
                  hasErr: false
                });
              } catch (unused) {
                try {
                  this.setState?.({
                    error: null
                  });
                } catch (unused2) {
                }
              }
            } catch (unused) {
            }
          }
        });
      } catch (e) {
        try {
          console.error("[ShiggyCord] patchErrorBoundary: error while rendering custom screen", e);
        } catch (unused) {
        }
        return;
      }
    });
    try {
      var g2 = global;
      if (g2) {
        try {
          var ErrorUtils2 = g2.ErrorUtils;
          if (ErrorUtils2 && typeof ErrorUtils2.setGlobalHandler === "function") {
            var prev = ErrorUtils2.getGlobalHandler?.() ?? ErrorUtils2._globalHandler ?? null;
            ErrorUtils2.setGlobalHandler((err, isFatal) => {
              try {
                console.error("[ShiggyCord] global uncaught error:", err, {
                  isFatal
                });
                globalThis.__SHIGGY_LAST_UNCAUGHT_ERROR = err;
              } catch (unused) {
              }
              try {
                if (typeof prev === "function") prev(err, isFatal);
              } catch (unused) {
              }
            });
          }
        } catch (unused) {
        }
        try {
          if (typeof g2.addEventListener === "function") {
            g2.addEventListener("unhandledrejection", (ev) => {
              try {
                console.error("[ShiggyCord] unhandledrejection:", ev?.reason ?? ev);
                globalThis.__SHIGGY_LAST_UNCAUGHT_ERROR = ev?.reason ?? ev;
              } catch (unused) {
              }
            });
          }
        } catch (unused) {
        }
      }
    } catch (unused) {
    }
    return unpatch2;
  }
  var import_react4, ErrorBoundaryMount;
  var init_patchErrorBoundary = __esm({
    "src/core/debug/patches/patchErrorBoundary.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      import_react4 = __toESM(require_react());
      init_ErrorBoundaryScreen();
      init_patcher();
      init_lazy2();
      init_wrappers();
      ErrorBoundaryMount = ({ error, rerender }) => {
        return /* @__PURE__ */ import_react4.default.createElement(ErrorBoundaryScreen, {
          error,
          rerender
        });
      };
    }
  });

  // globals:moment
  var require_moment = __commonJS({
    "globals:moment"(exports, module) {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      module.exports = require_depsModule()["moment"];
    }
  });

  // src/core/fixes.ts
  function onDispatch({ locale }) {
    try {
      var moment = require_moment();
      moment.locale(locale.toLowerCase());
    } catch (e) {
      logger.error("Failed to fix timestamps (lazy moment)...", e);
    }
    FluxDispatcher.unsubscribe("I18N_LOAD_SUCCESS", onDispatch);
  }
  var fixes_default;
  var init_fixes = __esm({
    "src/core/fixes.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_logger();
      init_common();
      fixes_default = (() => {
        FluxDispatcher.subscribe("I18N_LOAD_SUCCESS", onDispatch);
      });
    }
  });

  // src/assets/icons/shiggy.png
  var shiggy_default;
  var init_shiggy = __esm({
    "src/assets/icons/shiggy.png"() {
      shiggy_default = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEABAMAAACuXLVVAAAAMFBMVEUAAAA9HyX/y4KwiX3ecnT57tB6J034opf638HNP1ROW0+Znlz/rmZQXFCeKlmcJ1dT810dAAAAAXRSTlMAQObYZgAAAAFvck5UAc+id5oAAAQ/SURBVHja7dyNkaMwDAXgbYEWaIEWaIEWaIEWaCEtpIW0sC2khbSQi/atTgLzF0KCzT7N3GUOO9bHjM42kOTri8GYjOwRW/UiIEVAluWPmBt8WS8CUgUUxfzg6EXAXweU5VsIBEQBkKGnBpc+BBwVkGXVI+YBS3oRkD5gbHD0IYAAAo4J0KF18LIMh7c+byAQEAWgKHSzMTy49ZnfuBCQKsBPRf0yRAmiDwHHBGBoA/SHN+L8okVAegC/FBlAytCHpSfgqABbiMIQjAKmlywCUgUURZaNp1eELkUGGNq8EpAmAI+i5sK2pOPbllUgAiIA9MttCQc9lYAFq64JSBEQFuAQYAzlAfL3BudPwO6A4VR+szpEQAFuUoQEfBiwrATzvK7HeuACBqlXLEYERASQYcv/EQKsJQRo8RGQHsCXoD6qGF6KmmauDF9eiAjYGaCJxwDtI8YWJAHI60srIQG7A2SiQaKmUYrHta0nWEFicpJx7CKFgHQA/saULjbTACUowG5YrnqMRUAEAJtM6lo2FRrCUYi0+RZJ7gFlKe1ajASkCtCNpcUYADgDaOIX50ECdgFoehRSljVNVaHIJGHT6LRTlvKYwlpsqlKABxKQBgBdrQABaFtJc/qJqtKlR5YhAKzFl6cEivCJQiRgd0D/ggRDSKK6Rpq6bl0IwLeE2xhNTkA6AC1EvHELAMZ4Yi4kYHeAMnQATYWppe0FCGjxNycUgOVo1Z6IgGgAzU+0MyF9dAHDJYltS1feKydgZ4ASngEgrS/B4Y3Iwm0qAZEAbCpaEkjcBXQJkhgffyQgBYARUIr9sgvLMNyKdgH+K1EExA7oD7E0tLd/tfc/df4ERADAVqI7JDag+FEMmXCKQm9RKcB/jNETbMNKQBoA+wiiUbLsfK4quR0lX2bB5gMlJcfO56GClMdVEnknCEgD0KdI+ssjJN3ppI+n9CaltIBg09fUx6AJSAlgRXW5IA3KDoEW0C4Xv4Tlk0FAOgBNK4klDf58f+sCpIlB0CLM8w3Pn4BdAZZeA0eEELYBsIRAQCqA4RR4HQNcr0MbkM3On4CPAroJMA35ZafbaoB5AgHpAmTTOQywxcgAY4SV/wcI+DggTO+3n/1pSFNer3OAF86fgJ0BdrsiLEH7N9LffiMkrNoNExABACU4DpDWaUD48IqAFAByG8LffMRRGdY2ICEAPYAAYOjxJQEpAOwxM37ixABIoKHLlKXXAtSvOK1MT0AEAEVYCSpAhrcfQwPPaEaw5Kt/HImA3QFDJBm6W4gIKz5L7/EEHAWAwrzfNZ2V3O12v8txae2WLgFHA4DQTd+lvC0xAVEB/OSjgDeXHgFRAZrf6C5HeoyAvwCwDalesPiPKhZPBQFpA+yC5YPpCTgUYFV6AnYBdN8WplsHeOKcCdgVEL7RPrA+fmSjMycgCkDIsG3o+JHVsxwBewH+AUY9Zx90BRLbAAAAAElFTkSuQmCC";
    }
  });

  // src/lib/ui/settings/patches/shared.tsx
  function wrapOnPress(onPress, navigation2, renderPromise, screenOptions, props) {
    return () => _async_to_generator(function* () {
      if (onPress) return void onPress();
      var Component = yield renderPromise().then((m) => m.default);
      if (typeof screenOptions === "string") {
        screenOptions = {
          title: screenOptions
        };
      }
      navigation2 ??= tabsNavigationRef.getRootNavigationRef();
      navigation2.navigate("SHIGGYCORD_CUSTOM_PAGE", {
        ...screenOptions,
        render: () => /* @__PURE__ */ jsx(Component, {
          ...props
        })
      });
    })();
  }
  var tabsNavigationRef, CustomPageRenderer;
  var init_shared = __esm({
    "src/lib/ui/settings/patches/shared.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_jsxRuntime();
      init_common();
      init_wrappers();
      init_components2();
      tabsNavigationRef = findByPropsLazy("getRootNavigationRef");
      CustomPageRenderer = React.memo(() => {
        var navigation2 = NavigationNative.useNavigation();
        var route = NavigationNative.useRoute();
        var { render: PageComponent, ...args } = route.params;
        React.useEffect(() => void navigation2.setOptions({
          ...args
        }), []);
        return /* @__PURE__ */ jsx(ErrorBoundary, {
          children: /* @__PURE__ */ jsx(PageComponent, {})
        });
      });
    }
  });

  // src/lib/ui/settings/patches/tabs.tsx
  function useIsFirstRender() {
    var firstRender = false;
    React.useEffect(() => void (firstRender = true), []);
    return firstRender;
  }
  function patchTabsUI(unpatches2) {
    var getRows = () => Object.values(registeredSections).flatMap((sect) => sect.map((row) => ({
      [row.key]: {
        type: "pressable",
        title: row.title,
        icon: row.icon,
        IconComponent: () => /* @__PURE__ */ jsx(TableRow.Icon, {
          source: row.icon
        }),
        usePredicate: row.usePredicate,
        useTrailing: row.useTrailing,
        useTitle: row.title,
        onPress: wrapOnPress(row.onPress, null, row.render, row.title()),
        withArrow: true
      }
    }))).reduce((a2, c2) => Object.assign(a2, c2));
    var origRendererConfig = settingConstants.SETTING_RENDERER_CONFIG;
    var rendererConfigValue = settingConstants.SETTING_RENDERER_CONFIG;
    Object.defineProperty(settingConstants, "SETTING_RENDERER_CONFIG", {
      enumerable: true,
      configurable: true,
      get: () => ({
        ...rendererConfigValue,
        VendettaCustomPage: {
          type: "route",
          title: () => "ShiggyCord",
          useTitle: () => "ShiggyCord",
          screen: {
            route: "VendettaCustomPage",
            getComponent: () => CustomPageRenderer
          }
        },
        SHIGGYCORD_CUSTOM_PAGE: {
          type: "route",
          title: () => "ShiggyCord",
          useTitle: () => "ShiggyCord",
          screen: {
            route: "SHIGGYCORD_CUSTOM_PAGE",
            getComponent: () => CustomPageRenderer
          }
        },
        BUNNY_CUSTOM_PAGE: {
          type: "route",
          title: () => "ShiggyCord",
          useTitle: () => "ShiggyCord",
          screen: {
            route: "BUNNY_CUSTOM_PAGE",
            getComponent: () => CustomPageRenderer
          }
        },
        ...getRows()
      }),
      set: (v2) => rendererConfigValue = v2
    });
    unpatches2.push(() => {
      Object.defineProperty(settingConstants, "SETTING_RENDERER_CONFIG", {
        value: origRendererConfig,
        writable: true,
        get: void 0,
        set: void 0
      });
    });
    try {
      unpatches2.push(after("createList", createListModule, function(args, ret) {
        var [config] = args;
        if (config?.sections && Array.isArray(config.sections)) {
          var sections = config.sections;
          var accountSectionIndex = sections.findIndex((i2) => i2.settings?.includes("ACCOUNT"));
          if (accountSectionIndex !== -1) {
            var index = accountSectionIndex + 1;
            Object.keys(registeredSections).forEach((sect) => {
              var alreadyExists = sections.some((s) => s.label === sect);
              if (!alreadyExists) {
                sections.splice(index++, 0, {
                  label: sect,
                  title: sect,
                  settings: registeredSections[sect].map((a2) => a2.key)
                });
              }
            });
          }
        }
        return ret;
      }));
    } catch (unused) {
      unpatches2.push(after("default", SettingsOverviewScreen, (_2, ret) => {
        if (useIsFirstRender()) return;
        var { sections } = findInReactTree(ret, (i2) => i2.props?.sections).props;
        var index = -~sections.findIndex((i2) => i2.settings.includes("ACCOUNT")) || 1;
        Object.keys(registeredSections).forEach((sect) => {
          sections.splice(index++, 0, {
            label: sect,
            title: sect,
            settings: registeredSections[sect].map((a2) => a2.key)
          });
        });
      }));
    }
  }
  var settingConstants, createListModule, SettingsOverviewScreen;
  var init_tabs = __esm({
    "src/lib/ui/settings/patches/tabs.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_patcher();
      init_components();
      init_wrappers();
      init_settings2();
      init_shared();
      init_utils();
      settingConstants = findByPropsLazy("SETTING_RENDERER_CONFIG");
      createListModule = findByPropsLazy("createList");
      SettingsOverviewScreen = findByNameLazy("SettingsOverviewScreen", false);
    }
  });

  // src/lib/ui/settings/index.tsx
  var settings_exports2 = {};
  __export(settings_exports2, {
    patchSettings: () => patchSettings,
    registerSection: () => registerSection,
    registeredSections: () => registeredSections
  });
  function registerSection(section) {
    registeredSections[section.name] = section.items;
    return () => delete registeredSections[section.name];
  }
  function patchSettings() {
    var unpatches2 = new Array();
    patchTabsUI(unpatches2);
    return () => unpatches2.forEach((u2) => u2());
  }
  var registeredSections;
  var init_settings2 = __esm({
    "src/lib/ui/settings/index.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_tabs();
      registeredSections = {};
    }
  });

  // src/core/debug/safeMode.ts
  function isSafeMode() {
    return settings.safeMode?.enabled === true;
  }
  function toggleSafeMode2() {
    return _async_to_generator(function* ({ to = !isSafeMode(), reload = true } = {}) {
      var enabled = (settings.safeMode ??= {
        enabled: to
      }).enabled = to;
      var currentColor = getCurrentTheme();
      yield writeThemeToNative(enabled ? {} : currentColor?.data ?? {});
      if (reload) setTimeout(() => BundleUpdaterManager.reload(), 500);
    }).apply(this, arguments);
  }
  var init_safeMode = __esm({
    "src/core/debug/safeMode.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_themes();
      init_modules();
      init_settings();
    }
  });

  // src/core/ui/settings/pages/General/Version.tsx
  function Version({ label, version, icon }) {
    return /* @__PURE__ */ jsx(TableRow, {
      label,
      trailing: /* @__PURE__ */ jsx(TableRowTrailingText, {
        text: version
      }),
      icon: /* @__PURE__ */ jsx(TableRow.Icon, {
        source: typeof icon === "string" ? findAssetId(icon) : icon
      }),
      onPress: () => {
        clipboard.setString(`${label} - ${version}`);
        showToast.showCopyToClipboard();
      }
    });
  }
  var init_Version = __esm({
    "src/core/ui/settings/pages/General/Version.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_assets();
      init_common();
      init_components();
      init_toasts();
    }
  });

  // src/core/ui/settings/pages/General/About.tsx
  function About() {
    var debugInfo = getDebugInfo();
    useProxy(settings);
    useProxy(loaderConfig);
    var coreVersions = [
      {
        label: Strings.SHIGGYCORD,
        version: debugInfo.bunny.version,
        icon: {
          uri: shiggy_default
        }
      },
      {
        label: "Discord",
        version: `${debugInfo.discord.version} (${debugInfo.discord.build})`,
        icon: "Discord"
      },
      {
        label: Strings.LOADER,
        version: `${debugInfo.bunny.loader.name} ${debugInfo.bunny.loader.version}`,
        icon: "DownloadIcon"
      }
    ];
    var runtimeVersions = [
      {
        label: "React",
        version: debugInfo.react.version,
        icon: "ScienceIcon"
      },
      {
        label: "React Native",
        version: debugInfo.react.nativeVersion,
        icon: "MobilePhoneIcon"
      },
      {
        label: Strings.BYTECODE,
        version: debugInfo.hermes.bytecodeVersion,
        icon: "TopicsIcon"
      }
    ];
    var deviceInfo = [
      {
        label: Strings.OPERATING_SYSTEM,
        version: `${debugInfo.os.name} ${debugInfo.os.version}`,
        icon: "ScreenIcon"
      },
      ...debugInfo.os.sdk ? [
        {
          label: "SDK Version",
          version: debugInfo.os.sdk,
          icon: "StaffBadgeIcon"
        }
      ] : [],
      ...import_react_native18.Platform.OS !== "ios" ? [
        {
          label: "Device",
          version: `${debugInfo.device.brand} ${debugInfo.device.model}`,
          icon: "MobilePhoneIcon"
        },
        {
          label: Strings.MANUFACTURER,
          version: debugInfo.device.manufacturer,
          icon: "WrenchIcon"
        }
      ] : []
    ];
    return /* @__PURE__ */ jsx(import_react_native18.ScrollView, {
      style: {
        flex: 1
      },
      contentContainerStyle: {
        paddingBottom: 38
      },
      children: /* @__PURE__ */ jsxs(Stack, {
        style: {
          paddingVertical: 24,
          paddingHorizontal: 12
        },
        spacing: 24,
        children: [
          /* @__PURE__ */ jsxs(import_react_native18.View, {
            style: {
              alignItems: "center",
              paddingVertical: 16
            },
            children: [
              /* @__PURE__ */ jsx(Text, {
                variant: "heading-xl/bold",
                style: {
                  textAlign: "center"
                },
                children: Strings.SHIGGYCORD
              }),
              /* @__PURE__ */ jsx(Text, {
                variant: "text-md/medium",
                style: {
                  textAlign: "center",
                  marginTop: 4
                },
                children: "Shiggy your discord client!"
              })
            ]
          }),
          /* @__PURE__ */ jsx(TableRowGroup, {
            title: "Core Components",
            children: coreVersions.map((v2, i2) => /* @__PURE__ */ jsx(Version, {
              label: v2.label,
              version: v2.version,
              icon: v2.icon
            }, i2))
          }),
          /* @__PURE__ */ jsx(TableRowGroup, {
            title: "Runtime Environment",
            children: runtimeVersions.map((v2, i2) => /* @__PURE__ */ jsx(Version, {
              label: v2.label,
              version: v2.version,
              icon: v2.icon
            }, i2))
          }),
          /* @__PURE__ */ jsx(TableRowGroup, {
            title: "Device Information",
            children: deviceInfo.map((p, i2) => /* @__PURE__ */ jsx(Version, {
              label: p.label,
              version: p.version,
              icon: p.icon
            }, i2))
          }),
          /* @__PURE__ */ jsx(TableRowGroup, {
            title: "Additional Details",
            children: /* @__PURE__ */ jsx(TableRow, {
              label: "Architecture",
              trailing: /* @__PURE__ */ jsx(TableRow.TrailingText, {
                text: import_react_native18.Platform.OS === "android" ? "Android ARM64" : "iOS ARM64"
              }),
              icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                source: findAssetId("ScreenIcon")
              })
            })
          })
        ]
      })
    });
  }
  var import_react_native18;
  var init_About = __esm({
    "src/core/ui/settings/pages/General/About.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_i18n();
      init_settings3();
      init_Version();
      init_storage();
      init_debug();
      init_settings();
      init_components();
      import_react_native18 = __toESM(require_react_native());
      init_assets();
    }
  });

  // src/lib/ui/alerts.ts
  var alerts_exports = {};
  __export(alerts_exports, {
    dismissAlert: () => dismissAlert,
    openAlert: () => openAlert
  });
  var openAlert, dismissAlert;
  var init_alerts = __esm({
    "src/lib/ui/alerts.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_lazy();
      init_metro();
      ({ openAlert, dismissAlert } = lazyDestructure(() => findByProps("openAlert", "dismissAlert")));
    }
  });

  // src/core/ui/settings/pages/General/index.tsx
  var General_exports = {};
  __export(General_exports, {
    default: () => General
  });
  function General() {
    useProxy(settings);
    var debugInfo = getDebugInfo();
    var navigation2 = NavigationNative.useNavigation();
    var CommunityCardButton = ({ icon, label, subLabel, color: color2, onPress }) => /* @__PURE__ */ jsx(import_react_native19.TouchableOpacity, {
      style: {
        flex: 1
      },
      onPress,
      activeOpacity: 0.7,
      children: /* @__PURE__ */ jsx(Card, {
        style: {
          backgroundColor: color2,
          borderRadius: 16,
          padding: 16,
          height: 100,
          justifyContent: "center"
        },
        children: /* @__PURE__ */ jsxs(import_react_native19.View, {
          style: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 12
          },
          children: [
            /* @__PURE__ */ jsx(import_react_native19.View, {
              style: {
                width: 32,
                height: 32,
                justifyContent: "center",
                alignItems: "center"
              },
              children: /* @__PURE__ */ jsx(TableRow.Icon, {
                source: icon,
                style: {
                  tintColor: "#FFFFFF",
                  width: 24,
                  height: 24
                }
              })
            }),
            /* @__PURE__ */ jsxs(import_react_native19.View, {
              style: {
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                flex: 1
              },
              children: [
                /* @__PURE__ */ jsx(Text, {
                  variant: "text-md/semibold",
                  style: {
                    color: "text-default",
                    textAlign: "left"
                  },
                  children: label
                }),
                subLabel && /* @__PURE__ */ jsx(Text, {
                  variant: "text-sm/medium",
                  style: {
                    color: "#FFFFFFCC",
                    textAlign: "left"
                  },
                  children: subLabel
                })
              ]
            })
          ]
        })
      })
    });
    return /* @__PURE__ */ jsx(import_react_native19.ScrollView, {
      style: {
        flex: 1
      },
      contentContainerStyle: {
        paddingBottom: 38
      },
      children: /* @__PURE__ */ jsxs(Stack, {
        style: {
          paddingVertical: 24,
          paddingHorizontal: 12
        },
        spacing: 24,
        children: [
          /* @__PURE__ */ jsxs(TableRowGroup, {
            title: "App Information",
            children: [
              /* @__PURE__ */ jsx(TableRow, {
                label: "ShiggyCord",
                icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                  source: {
                    uri: shiggy_default ?? ""
                  }
                }),
                trailing: /* @__PURE__ */ jsx(TableRow.TrailingText, {
                  text: debugInfo.bunny.version
                })
              }),
              /* @__PURE__ */ jsx(TableRow, {
                label: "Discord",
                subLabel: `Version ${debugInfo.discord.version}`,
                icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                  source: findAssetId("Discord")
                }),
                trailing: /* @__PURE__ */ jsx(TableRow.TrailingText, {
                  text: `Build ${debugInfo.discord.build}`
                })
              }),
              /* @__PURE__ */ jsx(TableRow, {
                label: "Loader",
                subLabel: `${debugInfo.bunny.loader.name} loader`,
                icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                  source: findAssetId("DownloadIcon")
                }),
                trailing: /* @__PURE__ */ jsx(TableRow.TrailingText, {
                  text: debugInfo.bunny.loader.version ?? ""
                })
              })
            ]
          }),
          /* @__PURE__ */ jsxs(TableRowGroup, {
            title: "Quick Actions",
            children: [
              /* @__PURE__ */ jsx(TableRow, {
                label: Strings.RELOAD_DISCORD,
                subLabel: "Restart the application",
                icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                  source: findAssetId("RetryIcon")
                }),
                onPress: () => BundleUpdaterManager.reload()
              }),
              /* @__PURE__ */ jsx(TableSwitchRow, {
                label: "Safe Mode",
                subLabel: "Temporarily disable all add-ons",
                icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                  source: findAssetId("ShieldIcon")
                }),
                value: isSafeMode(),
                onValueChange: (to) => {
                  toggleSafeMode2({
                    to,
                    reload: false
                  });
                  openAlert("bunny-reload-safe-mode", /* @__PURE__ */ jsx(AlertModal, {
                    title: "Reload now?",
                    content: !to ? "All add-ons will load normally." : "All add-ons will be temporarily disabled upon reload.",
                    actions: /* @__PURE__ */ jsxs(AlertActions, {
                      children: [
                        /* @__PURE__ */ jsx(AlertActionButton, {
                          text: "Reload Now",
                          variant: "destructive",
                          onPress: () => BundleUpdaterManager.reload()
                        }),
                        /* @__PURE__ */ jsx(AlertActionButton, {
                          text: "Later",
                          variant: "secondary"
                        })
                      ]
                    })
                  }));
                }
              })
            ]
          }),
          /* @__PURE__ */ jsxs(TableRowGroup, {
            title: "Developer",
            children: [
              /* @__PURE__ */ jsx(TableSwitchRow, {
                label: Strings.DEVELOPER_SETTINGS,
                subLabel: "Enable developer tools and settings",
                icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                  source: findAssetId("WrenchIcon")
                }),
                value: settings.developerSettings,
                onValueChange: (v2) => {
                  settings.developerSettings = v2;
                }
              }),
              /* @__PURE__ */ jsx(TableSwitchRow, {
                label: Strings.SETTINGS_ACTIVATE_DISCORD_EXPERIMENTS,
                subLabel: Strings.SETTINGS_ACTIVATE_DISCORD_EXPERIMENTS_DESC,
                icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                  source: findAssetId("StaffBadgeIcon")
                }),
                value: settings.enableDiscordDeveloperSettings,
                onValueChange: (v2) => {
                  settings.enableDiscordDeveloperSettings = v2;
                }
              })
            ]
          }),
          /* @__PURE__ */ jsx(TableRowGroup, {
            title: "Community & Support",
            children: /* @__PURE__ */ jsxs(import_react_native19.View, {
              style: {
                flexDirection: "row",
                gap: 12
              },
              children: [
                /* @__PURE__ */ jsx(CommunityCardButton, {
                  icon: findAssetId("Discord"),
                  label: "Discord",
                  subLabel: "Join our support server",
                  color: "#5865F2",
                  onPress: () => import_react_native19.Linking.openURL(DISCORD_SERVER)
                }),
                /* @__PURE__ */ jsx(CommunityCardButton, {
                  icon: findAssetId("img_account_sync_github_white"),
                  label: "GitHub",
                  subLabel: "View the source code",
                  color: "#24292E",
                  onPress: () => import_react_native19.Linking.openURL(GITHUB)
                })
              ]
            })
          }),
          /* @__PURE__ */ jsx(TableRowGroup, {
            title: "System Information",
            children: /* @__PURE__ */ jsx(TableRow, {
              arrow: true,
              label: Strings.ABOUT,
              subLabel: "Detailed technical information",
              icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                source: findAssetId("CircleInformationIcon-primary")
              }),
              onPress: () => navigation2.push("SHIGGYCORD_CUSTOM_PAGE", {
                title: Strings.ABOUT,
                render: () => /* @__PURE__ */ jsx(About, {})
              })
            })
          })
        ]
      })
    });
  }
  var import_react_native19, import_react5;
  var init_General = __esm({
    "src/core/ui/settings/pages/General/index.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_safeMode();
      init_i18n();
      init_settings3();
      init_About();
      init_storage();
      init_assets();
      init_debug();
      init_modules();
      init_settings();
      init_alerts();
      init_constants();
      init_common();
      init_components();
      import_react_native19 = __toESM(require_react_native());
      import_react5 = __toESM(require_react());
    }
  });

  // src/lib/utils/isValidHttpUrl.ts
  function isValidHttpUrl(input) {
    var url2;
    try {
      url2 = new URL(input);
    } catch (unused) {
      return false;
    }
    return url2.protocol === "http:" || url2.protocol === "https:";
  }
  var init_isValidHttpUrl = __esm({
    "src/lib/utils/isValidHttpUrl.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // node_modules/fuzzysort/fuzzysort.js
  var fuzzysort_exports = {};
  __export(fuzzysort_exports, {
    cleanup: () => cleanup,
    default: () => fuzzysort_default,
    go: () => go,
    highlight: () => highlight,
    prepare: () => prepare,
    remap: () => remap,
    score: () => score,
    single: () => single,
    snapshot: () => snapshot
  });
  function single(search, target) {
    if (!search || !target) return null;
    var query = getQuery(search);
    if (!isPrepared(target)) target = getPrepared(target);
    if ((query.bitflags & target._bitflags) !== query.bitflags) return null;
    var result = !query.hasSpace && query.lowerCodes.length === 2 ? algorithm2(query, target) : algorithm(query, target);
    return result && materialize(result);
  }
  function go(search, targets, options) {
    if (targets instanceof SnapshotTargets) return goSnapshot(search, targets, options);
    var key2 = options?.key;
    var keys = !key2 && options?.keys;
    var firstTarget = targets[0];
    if (!key2 && !keys && typeof firstTarget === "object" && firstTarget !== null && !isPrepared(firstTarget)) {
      throw new Error("fuzzysort: key or keys is required when searching object targets");
    }
    if (!search) return all(targets, options);
    var query = getQuery(search);
    if (keys) return goKeys(query, targets, options);
    var searchBitflags = query.bitflags;
    var twoChar = !query.hasSpace && query.lowerCodes.length === 2;
    var threshold = denormalizeScore(options?.threshold ?? 0.5);
    var limit = getLimit(options);
    var scoreFn = options?.scoreFn;
    var resultCount = 0;
    var limited = 0;
    var getter = key2 && makeGetter(key2);
    for (var i2 = 0; i2 < targets.length; i2++) {
      var obj = targets[i2];
      var target = key2 ? getter === null ? obj[key2] : getter(obj) : obj;
      if (!target) continue;
      if (!isPrepared(target)) target = getPrepared(target);
      if ((searchBitflags & target._bitflags) !== searchBitflags) continue;
      var result = twoChar ? algorithm2(query, target) : algorithm(query, target);
      if (result === null) continue;
      var resultScore = result._score;
      if (scoreFn) {
        result = materialize(result, key2 ? obj : void 0);
        resultScore = scoreFn(result);
        if (!resultScore) continue;
        result._score = resultScore = denormalizeScore(resultScore);
      }
      if (resultScore < threshold) continue;
      var room = resultCount < limit;
      if (room) resultCount++;
      else {
        limited++;
        if (resultScore <= heap.peek()._score) continue;
      }
      if (!scoreFn) result = materialize(result, key2 ? obj : void 0);
      room ? heap.add(result) : heap.replaceTop(result);
    }
    return finishResults(resultCount, limited);
  }
  function highlight(result, open = "<b>", close = "</b>", threshold = 0.5) {
    var callback = typeof open === "function" ? open : null;
    var target = result.target;
    if (result._bestKeyScore !== void 0 && normalizeScore(result._score) < normalizeScore(result._bestKeyScore) * threshold) return callback ? [
      target
    ] : target;
    var raw = result._indexes;
    var indexes = raw === void 0 ? result.indexes : raw.slice(0, raw.len ?? raw.length).sort((a2, b) => a2 - b);
    if (!indexes.length) return callback ? [
      target
    ] : target;
    var output = callback ? [] : "";
    var lastIndex = 0;
    var matchI = 0;
    for (var i2 = 0; i2 < indexes.length; ) {
      var start2 = indexes[i2++];
      var end = start2 + 1;
      while (indexes[i2] === end) {
        i2++;
        end++;
      }
      var before3 = target.slice(lastIndex, start2);
      var match = target.slice(start2, end);
      if (callback) output.push(before3, callback(match, matchI++));
      else output += before3 + open + match + close;
      lastIndex = end;
    }
    if (callback) output.push(target.slice(lastIndex));
    else output += target.slice(lastIndex);
    return output;
  }
  function score(result) {
    var value = result.score;
    return value === void 0 ? normalizeScore(result._score) : value;
  }
  function remap(mappings) {
    for (var char in mappings) {
      remappings[char] = mappings[char];
      if (char.charCodeAt(0) < 128) customAsciiRemappings = true;
    }
    cleanup();
  }
  function prepare(target) {
    return prepTarget(target);
  }
  function snapshot(targets, options) {
    return new SnapshotTargets(targets, options);
  }
  function cleanup() {
    targetCache.clear();
    searchCache.clear();
    heap.clear();
    simpleMatch = [];
    strictMatch = [];
    seen = [];
    seenAt = [];
    changes = [];
    partials = [];
    spaceScores = [];
    partIndexes = [];
    winnerIndexes = [];
    winnerScores = [];
    winnerKeys = [];
    keyTargets = [];
    keyResults = [];
    candidateBitOffsets = [];
    seenGeneration = 0;
  }
  function goSnapshotValues(search, snapshot2, options, singleChar) {
    var targets = snapshot2._targets;
    var objects = snapshot2._objects;
    var threshold = denormalizeScore(options?.threshold ?? 0.5);
    var limit = getLimit(options);
    var scoreFn = options?.scoreFn;
    var searchLen = search.lowerCodes.length;
    var shortSearch = !search.hasSpace && searchLen <= 3;
    var twoChar = !search.hasSpace && searchLen === 2;
    var rows = snapshot2._candidateRows;
    var rowsLength = snapshot2._candidateLength;
    var matchedRows = snapshot2._rows;
    var matchedCount = 0;
    var resultCount = 0;
    var limited = 0;
    for (var n = 0; n < rowsLength; n++) {
      var i2 = rows === null ? n : rows[n];
      var target = targets[i2];
      if (target === noTarget || (search.bitflags & target._bitflags) !== search.bitflags) continue;
      var targetShort = shortSearch && target.target.length < 65535;
      var cutoff = !scoreFn && threshold === -INF && resultCount >= limit ? heap.peek()._score : -INF;
      var result = void 0;
      if (singleChar && targetShort) result = algorithm1(search, target, snapshot2._first, i2);
      else if (twoChar && targetShort) {
        var start2 = snapshot2._offsets[i2];
        var end = snapshot2._offsets[i2 + 1];
        result = algorithm2(search, target, snapshot2._beginnings, start2, end, cutoff);
      } else if (twoChar) result = algorithm2(search, target, null, 0, 0, cutoff);
      else if (targetShort) {
        var start1 = snapshot2._offsets[i2];
        var end1 = snapshot2._offsets[i2 + 1];
        result = algorithm(search, target, false, false, false, true, snapshot2._beginnings, start1, end1, cutoff);
      } else result = algorithm(search, target, false, false, false, true, null, 0, 0, cutoff);
      if (result === null) continue;
      matchedRows[matchedCount++] = i2;
      if (result === prunedMatch) {
        limited++;
        continue;
      }
      var resultScore = result._score;
      if (scoreFn) {
        result = materialize(result, objects?.[i2]);
        resultScore = scoreFn(result);
        if (!resultScore) continue;
        result._score = resultScore = denormalizeScore(resultScore);
      }
      if (resultScore < threshold) continue;
      var room = resultCount < limit;
      if (room) resultCount++;
      else {
        limited++;
        if (resultScore <= heap.peek()._score) continue;
      }
      if (objects && !scoreFn) result = materialize(result, objects[i2]);
      room ? heap.add(result) : heap.replaceTop(result);
    }
    snapshot2._matchedRowsLen = matchedCount;
    return finishResults(resultCount, limited, !objects && !scoreFn && materialize);
  }
  function goSnapshot(search, snapshot2, options) {
    if (options?.key || options?.keys) throw new Error("fuzzysort: key/keys must be provided to snapshot(), not go()");
    snapshot2._finish();
    if (!search) return allSnapshot(snapshot2, options);
    var query = getQuery(search);
    var backtrack = snapshot2._backtrack(query, options);
    if (backtrack) return backtrack;
    snapshot2._beginSearch(query);
    try {
      var results;
      if (snapshot2._mode < 2) {
        var searchLen = query.lowerCodes.length;
        var code = query.lowerCodes[0];
        var singleChar = searchLen === 1 && code >= 97 && code <= 122;
        results = goSnapshotValues(query, snapshot2, options, singleChar);
      } else results = goKeys(query, snapshot2._objects, options, snapshot2);
      snapshot2._endSearch(query);
      snapshot2._remember(query, results, options);
      return results;
    } catch (error) {
      snapshot2._resetSearch();
      throw error;
    }
  }
  function goKeys(query, objects, options, snapshot2) {
    var indexed = snapshot2 !== void 0;
    var keys = indexed ? null : options.keys;
    var getters = indexed ? null : keys.map(makeGetter);
    var targets = indexed ? snapshot2._targets : null;
    var keysLength = indexed ? snapshot2._keysLength : keys.length;
    var searchBitflags = query.bitflags;
    var hasSpace = query.hasSpace;
    var spaceCount = query.parts.length;
    var threshold = denormalizeScore(options?.threshold ?? 0.5);
    var limit = getLimit(options);
    var searchLen = query.lowerCodes.length;
    var short = indexed && !hasSpace && searchLen <= 3;
    var twoChar = !hasSpace && searchLen === 2;
    var code = query.lowerCodes[0];
    var singleChar = short && searchLen === 1 && code >= 97 && code <= 122;
    var scoreFn = options?.scoreFn;
    var deferMaterialization = indexed && !scoreFn && (limit !== INF || threshold > -INF);
    var rows = indexed ? snapshot2._candidateRows : null;
    var rowsLength = indexed ? snapshot2._candidateLength : objects.length;
    var matchedRows = indexed ? snapshot2._rows : null;
    var matchedCount = 0;
    var resultCount = 0;
    var limited = 0;
    outer: for (var n = 0; n < rowsLength; n++) {
      var i2 = rows === null ? n : rows[n];
      var row = i2 * keysLength;
      if (indexed) {
        if ((searchBitflags & snapshot2._bitflags[i2]) !== searchBitflags) continue;
      } else {
        var obj = objects[i2];
        var keysBitflags = 0;
        for (var k2 = 0; k2 < keysLength; k2++) {
          var target = getters[k2] === null ? obj[keys[k2]] : getters[k2](obj);
          if (!target) target = noTarget;
          else if (!isPrepared(target)) target = getPrepared(target);
          keyTargets[k2] = target;
          keysBitflags |= target._bitflags;
        }
        if ((searchBitflags & keysBitflags) !== searchBitflags) continue;
      }
      if (hasSpace) for (var s = 0; s < spaceCount; s++) {
        spaceScores[s] = winnerScores[s] = -INF;
        winnerKeys[s] = -1;
      }
      for (var k1 = 0; k1 < keysLength; k1++) {
        var target1 = indexed ? targets[row + k1] : keyTargets[k1];
        if (target1 === noTarget) {
          keyResults[k1] = noTarget;
          continue;
        }
        if (hasSpace && indexed) {
          var possible = false;
          for (var s1 = 0; s1 < spaceCount; s1++) {
            var partBitflags = query.parts[s1].bitflags;
            if ((partBitflags & target1._bitflags) === partBitflags) {
              possible = true;
              break;
            }
          }
          if (!possible) {
            keyResults[k1] = noTarget;
            continue;
          }
        } else if (!hasSpace && (searchBitflags & target1._bitflags) !== searchBitflags) {
          keyResults[k1] = noTarget;
          continue;
        }
        var match = void 0;
        if (indexed) {
          var valueRow = row + k1;
          var targetShort = short && target1.target.length < 65535;
          if (singleChar && targetShort) match = algorithm1(query, target1, snapshot2._first, valueRow);
          else if (twoChar && targetShort) {
            var start2 = snapshot2._offsets[valueRow];
            var end = snapshot2._offsets[valueRow + 1];
            match = algorithm2(query, target1, snapshot2._beginnings, start2, end);
          } else if (twoChar) match = algorithm2(query, target1);
          else if (targetShort) {
            var start1 = snapshot2._offsets[valueRow];
            var end1 = snapshot2._offsets[valueRow + 1];
            match = algorithm(query, target1, false, false, false, true, snapshot2._beginnings, start1, end1);
          } else match = algorithm(query, target1, false, hasSpace);
        } else match = twoChar ? algorithm2(query, target1) : algorithm(query, target1, false, hasSpace);
        if (match === null) {
          keyResults[k1] = noTarget;
          continue;
        }
        keyResults[k1] = deferMaterialization ? match : materialize(match);
        if (hasSpace) {
          mergePartScores(spaceCount);
          for (var s2 = 0; s2 < spaceCount; s2++) {
            var partScore = partials[s2];
            if (partScore <= winnerScores[s2]) continue;
            winnerScores[s2] = partScore;
            winnerKeys[s2] = k1;
            var source = partIndexes[s2];
            var winner = winnerIndexes[s2] ||= [];
            winner.length = source.length;
            for (var j2 = 0; j2 < source.length; j2++) winner[j2] = source[j2];
          }
        }
      }
      if (hasSpace) {
        for (var s3 = 0; s3 < spaceCount; s3++) if (winnerKeys[s3] !== -1) {
          appendIndexes(keyResults[winnerKeys[s3]]._indexes, winnerIndexes[s3]);
        }
      }
      var resultScore = void 0;
      if (hasSpace) {
        resultScore = 0;
        for (var s4 = 0; s4 < spaceCount; s4++) {
          var partScore1 = spaceScores[s4];
          if (partScore1 === -INF) continue outer;
          resultScore += partScore1;
        }
      } else {
        resultScore = mergeScores(keyResults, keysLength);
        if (resultScore === -INF) continue;
      }
      if (indexed) matchedRows[matchedCount++] = i2;
      var result = deferMaterialization ? null : captureKeysResult(keyResults, keysLength, objects[i2], resultScore, hasSpace);
      if (scoreFn) {
        resultScore = scoreFn(result);
        if (!resultScore) continue;
        result._score = resultScore = denormalizeScore(resultScore);
      }
      if (resultScore < threshold) continue;
      var room = resultCount < limit;
      if (room) resultCount++;
      else {
        limited++;
        if (resultScore <= heap.peek()._score) continue;
      }
      if (result === null) result = captureKeysResult(keyResults, keysLength, objects[i2], resultScore, hasSpace);
      room ? heap.add(result) : heap.replaceTop(result);
    }
    if (indexed) snapshot2._matchedRowsLen = matchedCount;
    return finishResults(resultCount, limited, deferMaterialization && materializeKeys);
  }
  function allSnapshot(snapshot2, options) {
    var results = [];
    var targets = snapshot2._targets;
    var objects = snapshot2._objects;
    var keysLength = snapshot2._keysLength;
    var total = keysLength === void 0 ? targets.length : objects.length;
    results.total = total;
    var limit = getLimit(options);
    for (var i2 = 0, length = Math.min(total, limit); i2 < length; i2++) {
      if (keysLength === void 0) {
        results.push(newResult(targets[i2].target, -INF, objects?.[i2]));
        continue;
      }
      var row = i2 * keysLength;
      for (var k2 = 0; k2 < keysLength; k2++) {
        var target = targets[row + k2];
        keyResults[k2] = target === noTarget ? noTarget : newResult(target.target, -INF);
      }
      results.push(captureKeysResult(keyResults, keysLength, objects[i2], -INF));
    }
    return results;
  }
  function all(targets, options) {
    var results = [];
    results.total = targets.length;
    var limit = getLimit(options);
    var key2 = options?.key;
    var keys = !key2 && options?.keys;
    if (keys) {
      var getters = keys.map(makeGetter);
      for (var obj of targets) {
        for (var k2 = keys.length - 1; k2 >= 0; k2--) {
          var target = getters[k2] === null ? obj[keys[k2]] : getters[k2](obj);
          if (!target) keyResults[k2] = noTarget;
          else {
            if (!isPrepared(target)) target = getPrepared(target);
            target._score = -INF;
            target._indexes.len = 0;
            keyResults[k2] = target;
          }
        }
        results.push(captureKeysResult(keyResults, keys.length, obj, -INF));
        if (results.length >= limit) break;
      }
      return results;
    }
    var getter = key2 && makeGetter(key2);
    for (var obj1 of targets) {
      var target1 = key2 ? getter === null ? obj1[key2] : getter(obj1) : obj1;
      if (target1 == null) continue;
      if (!isPrepared(target1)) target1 = getPrepared(target1);
      if (key2) target1 = newResult(target1.target, -INF, obj1);
      else {
        target1._score = -INF;
        target1._indexes.len = 0;
      }
      results.push(target1);
      if (results.length >= limit) break;
    }
    return results;
  }
  function finishResults(length, limited, transform) {
    if (!length) return noResults;
    var results = new Array(length);
    for (var i2 = length - 1; i2 >= 0; i2--) {
      var result = heap.poll();
      if (transform) result = transform(result);
      if (result instanceof KeysResult && !result._partWinners) markBestKeyScore(result);
      results[i2] = result;
    }
    results.total = length + limited;
    return results;
  }
  function materializeKeys(result) {
    for (var k2 = 0; k2 < result.length; k2++) if (result[k2] !== noTarget) result[k2] = materialize(result[k2]);
    return result;
  }
  function algorithm1(search, target, firstTable, row) {
    var matchI = target._targetLower.indexOf(search._lower);
    if (matchI === -1) return null;
    var beginning = firstTable[row * 26 + search.lowerCodes[0] - 97];
    var strict = beginning !== 0;
    if (strict) matchI = beginning - 1;
    var _$score = matchI === 0 ? 0 : -matchI * matchI * 0.2;
    if (!strict) _$score *= 1e3;
    else if (target._beginningsLen > 24) _$score *= (target._beginningsLen - 24) * 10;
    target._score = _$score - target._targetLowerCodes.length + 1;
    target._indexes[0] = matchI;
    target._indexes.len = 1;
    return target;
  }
  function algorithm2(search, target, beginnings = null, start2 = 0, end = 0, cutoff = -INF) {
    var targetCodes = target._targetLowerCodes;
    var targetLen = targetCodes.length;
    var firstCode = search.lowerCodes[0];
    var secondCode = search.lowerCodes[1];
    var first = 0;
    while (targetCodes[first] !== firstCode) if (++first >= targetLen) return null;
    var second = first + 1;
    while (targetCodes[second] !== secondCode) if (++second >= targetLen) return null;
    if (cutoff !== -INF && scoreCeiling(2, targetLen) <= cutoff) return prunedMatch;
    if (beginnings === null) {
      beginnings = target._beginnings;
      if (beginnings === null) target._beginnings = beginnings = makeBeginnings(target);
      end = beginnings.length;
    }
    var substringI = target._targetLower.indexOf(search._lower, first);
    var substring = substringI !== -1;
    var low = lowerBound(beginnings, start2, end, substringI);
    var substringStart = substring && low < end && beginnings[low] === substringI;
    var strict = substringStart && substringI === first;
    if (!strict) {
      var firstBeginning = start2;
      while (firstBeginning < end && beginnings[firstBeginning] < first) firstBeginning++;
      for (var backtracks = 0; firstBeginning < end; ) {
        var strictFirst = beginnings[firstBeginning];
        if (targetCodes[strictFirst] !== firstCode) {
          firstBeginning++;
          continue;
        }
        var consecutive = strictFirst + 1;
        if (targetCodes[consecutive] === secondCode) {
          first = strictFirst;
          second = consecutive;
          strict = true;
          break;
        }
        var secondBeginning = firstBeginning + 1;
        while (secondBeginning < end && beginnings[secondBeginning] <= consecutive) secondBeginning++;
        while (secondBeginning < end && targetCodes[beginnings[secondBeginning]] !== secondCode) secondBeginning++;
        if (secondBeginning < end) {
          first = strictFirst;
          second = beginnings[secondBeginning];
          strict = true;
          break;
        }
        if (++backtracks > 200) break;
        firstBeginning++;
      }
    }
    if (substring && !substringStart) {
      while (low < end && beginnings[low] <= substringI) low++;
      for (; low < end; low++) {
        var index = beginnings[low];
        if (targetCodes[index] === firstCode && targetCodes[index + 1] === secondCode) {
          substringI = index;
          substringStart = true;
          break;
        }
      }
    }
    if (substring && (!strict || substringStart)) {
      first = substringI;
      second = substringI + 1;
    }
    var resultScore = second - first === 1 ? 0 : first - second * 2 - 11;
    if (first) resultScore -= first * first * 0.2;
    if (!strict) resultScore *= 1e3;
    else if (end - start2 > 24) resultScore *= (end - start2 - 24) * 10;
    var lengthPenalty = (targetLen - 2) / 2;
    resultScore -= lengthPenalty;
    if (substring) resultScore /= 5;
    if (substringStart) resultScore /= 5;
    resultScore -= lengthPenalty;
    var substringEnd = substring && second === first + 1 && (second + 1 === targetLen || isBeginning(beginnings, start2, end, second + 1));
    target._score = substringEnd ? resultScore + Math.min(4, -resultScore / 2) : resultScore;
    target._indexes[0] = first;
    target._indexes[1] = second;
    target._indexes.len = 2;
    return target;
  }
  function algorithm(search, target, spaces = false, partial = false, changed = false, singleMatch = true, beginnings = null, start2 = 0, end = 0, cutoff = -INF) {
    if (!spaces && search.hasSpace) return algorithmSpaces(search, target, partial);
    var searchCodes = search.lowerCodes;
    var targetCodes = target._targetLowerCodes;
    var searchLen = searchCodes.length;
    var targetLen = targetCodes.length;
    var searchCode = searchCodes[0];
    var searchI = 0;
    var targetI = 0;
    for (; ; ) {
      if (searchCode === targetCodes[targetI]) {
        simpleMatch[searchI] = targetI;
        if (++searchI === searchLen) break;
        searchCode = searchCodes[searchI];
      }
      if (++targetI >= targetLen) return null;
    }
    if (cutoff !== -INF && searchLen > 1 && scoreCeiling(searchLen, targetLen) <= cutoff) return prunedMatch;
    if (searchLen === 1 && !changed && singleMatch) {
      var matchI;
      var strict;
      if (target._singleMatchCode === searchCode) {
        matchI = target._singleMatchIndex;
        strict = target._singleMatchStrict;
      } else if (target._nextBeginningIndexes !== null) {
        var next = target._nextBeginningIndexes;
        targetI = simpleMatch[0] === 0 ? 0 : next[simpleMatch[0] - 1];
        while (targetI < targetLen && searchCode !== targetCodes[targetI]) targetI = next[targetI];
        strict = targetI < targetLen;
        matchI = strict ? targetI : simpleMatch[0];
      } else {
        prepareSingleMatch(target, searchCode, simpleMatch[0]);
        matchI = target._singleMatchIndex;
        strict = target._singleMatchStrict;
      }
      var resultScore = matchI === 0 ? 0 : -matchI * matchI * 0.2;
      if (!strict) resultScore *= 1e3;
      else if (target._beginningsLen > 24) resultScore *= (target._beginningsLen - 24) * 10;
      target._score = resultScore - (targetLen - 1);
      target._indexes[0] = matchI;
      target._indexes.len = 1;
      return target;
    }
    searchI = 0;
    var strict1 = false;
    var strictLen = 0;
    var next1 = target._nextBeginningIndexes;
    if (beginnings === null && next1 === null) next1 = target._nextBeginningIndexes = makeNextBeginnings(target);
    var beginningLen = beginnings === null ? changed ? 0 : target._beginningsLen : end - start2;
    if (!beginningLen) {
      beginningLen = 1;
      for (var i2 = next1[0]; i2 < targetLen; i2 = next1[i2]) beginningLen++;
      if (!changed) target._beginningsLen = beginningLen;
    }
    var substringI = searchLen <= 1 ? -1 : target._targetLower.indexOf(search._lower, simpleMatch[0]);
    var isSubstring = substringI !== -1;
    var substringStart = isSubstring && (substringI === 0 || (beginnings ? isBeginning(beginnings, start2, end, substringI) : next1[substringI - 1] === substringI));
    if (substringStart && substringI === simpleMatch[0]) strict1 = true;
    else {
      targetI = simpleMatch[0] === 0 ? 0 : beginnings ? nextBeginning(beginnings, start2, end, simpleMatch[0] - 1, targetLen) : next1[simpleMatch[0] - 1];
      var backtracks = 0;
      if (targetI !== targetLen) for (; ; ) {
        if (targetI >= targetLen) {
          if (searchI <= 0 || ++backtracks > 200) break;
          searchI--;
          var previous = strictMatch[--strictLen];
          targetI = beginnings ? nextBeginning(beginnings, start2, end, previous, targetLen) : next1[previous];
        } else if (searchCodes[searchI] === targetCodes[targetI]) {
          strictMatch[strictLen++] = targetI;
          if (++searchI === searchLen) {
            strict1 = true;
            break;
          }
          targetI++;
        } else targetI = beginnings ? nextBeginning(beginnings, start2, end, targetI, targetLen) : next1[targetI];
      }
    }
    if (isSubstring && !substringStart) {
      if (beginnings) {
        for (var b = start2; b < end; b++) {
          var i1 = beginnings[b];
          if (i1 <= substringI) continue;
          var s = 0;
          for (; s < searchLen && searchCodes[s] === targetCodes[i1 + s]; s++) ;
          if (s === searchLen) {
            substringI = i1;
            substringStart = true;
            break;
          }
        }
      } else for (var i22 = 0; i22 < next1.length; i22 = next1[i22]) {
        if (i22 <= substringI) continue;
        var s1 = 0;
        for (; s1 < searchLen && searchCodes[s1] === targetCodes[i22 + s1]; s1++) ;
        if (s1 === searchLen) {
          substringI = i22;
          substringStart = true;
          break;
        }
      }
    }
    var matches;
    if (!strict1) {
      if (isSubstring) for (var i3 = 0; i3 < searchLen; i3++) simpleMatch[i3] = substringI + i3;
      matches = simpleMatch;
    } else if (substringStart) {
      for (var i4 = 0; i4 < searchLen; i4++) simpleMatch[i4] = substringI + i4;
      matches = simpleMatch;
    } else matches = strictMatch;
    var matchEnd = matches[searchLen - 1] + 1;
    var substringEnd = isSubstring && matchEnd - matches[0] === searchLen && (matchEnd === targetLen || (beginnings ? isBeginning(beginnings, start2, end, matchEnd) : next1[matchEnd - 1] === matchEnd));
    target._score = calculateScore(matches, searchLen, targetLen, strict1, beginningLen, isSubstring, substringStart, substringEnd);
    for (var i5 = 0; i5 < searchLen; i5++) target._indexes[i5] = matches[i5];
    target._indexes.len = searchLen;
    return target;
  }
  function mergePartScores(length) {
    for (var i2 = 0; i2 < length; i2++) {
      var partial = partials[i2];
      var best = spaceScores[i2];
      if (partial > -1e3 && best > -INF) best = Math.max(best, (best + partial) / 4);
      spaceScores[i2] = Math.max(best, partial);
    }
  }
  function appendIndexes(indexes, additions) {
    var length = indexes.len;
    outer: for (var i2 = 0; i2 < additions.length; i2++) {
      var index = additions[i2];
      for (var j2 = 0; j2 < length; j2++) if (indexes[j2] === index) continue outer;
      indexes[length++] = index;
    }
    indexes.len = length;
  }
  function mergeScores(results, length) {
    var total = -INF;
    for (var i2 = 0; i2 < length; i2++) {
      var _$score = results[i2]._score;
      if (_$score > -1e3 && total > -INF) total = Math.max(total, (total + _$score) / 4);
      if (_$score > total) total = _$score;
    }
    return total;
  }
  function calculateScore(matches, searchLen, targetLen, strict, beginningLen, substring, substringStart, substringEnd) {
    var _$score = 0;
    var groups = 0;
    for (var i2 = 1; i2 < searchLen; i2++) if (matches[i2] - matches[i2 - 1] !== 1) {
      _$score -= matches[i2];
      groups++;
    }
    var unmatchedDistance = matches[searchLen - 1] - matches[0] - (searchLen - 1);
    _$score -= (12 + unmatchedDistance) * groups;
    if (matches[0] !== 0) _$score -= matches[0] * matches[0] * 0.2;
    if (!strict) _$score *= 1e3;
    else if (beginningLen > 24) _$score *= (beginningLen - 24) * 10;
    var lengthPenalty = (targetLen - searchLen) / 2;
    _$score -= lengthPenalty;
    var substringBonus = 1 + searchLen * searchLen;
    if (substring) _$score /= substringBonus;
    if (substringStart) _$score /= substringBonus;
    _$score -= lengthPenalty;
    return substringEnd ? _$score + Math.min(4, -_$score / 2) : _$score;
  }
  function algorithmSpaces(search, target, partial) {
    var seenLen = 0;
    var generation = ++seenGeneration;
    var _$score = 0;
    var result = null;
    var previousFirst = 0;
    var searches = search.parts;
    var changesLen = 0;
    var matched = false;
    for (var i2 = 0; i2 < searches.length; i2++) {
      partials[i2] = -INF;
      if (partial) (partIndexes[i2] ||= []).length = 0;
      result = algorithm(searches[i2], target, false, false, changesLen !== 0, false);
      if (result === null) {
        if (partial) continue;
        resetBeginnings(target, changesLen);
        return null;
      }
      matched = true;
      if (i2 < searches.length - 1) {
        var indexes = result._indexes;
        var consecutive = true;
        for (var j2 = 0; j2 < indexes.len - 1; j2++) if (indexes[j2 + 1] - indexes[j2] !== 1) {
          consecutive = false;
          break;
        }
        if (consecutive) {
          var beginning = indexes[indexes.len - 1] + 1;
          var previous = target._nextBeginningIndexes[beginning - 1];
          for (var j1 = beginning - 1; j1 >= 0 && target._nextBeginningIndexes[j1] === previous; j1--) {
            target._nextBeginningIndexes[j1] = beginning;
            changes[changesLen * 2] = j1;
            changes[changesLen * 2 + 1] = previous;
            changesLen++;
          }
        }
      }
      if (partial) {
        var indexes1 = partIndexes[i2];
        indexes1.length = result._indexes.len;
        for (var j22 = 0; j22 < indexes1.length; j22++) indexes1[j22] = result._indexes[j22];
      }
      var partScore = result._score / searches.length;
      _$score += partScore;
      partials[i2] = partScore;
      if (result._indexes[0] < previousFirst) _$score -= (previousFirst - result._indexes[0]) * 2;
      previousFirst = result._indexes[0];
      if (!partial) for (var j3 = 0; j3 < result._indexes.len; j3++) {
        var index = result._indexes[j3];
        if (seenAt[index] === generation) continue;
        seenAt[index] = generation;
        seen[seenLen++] = index;
      }
    }
    if (partial && !matched) return null;
    resetBeginnings(target, changesLen);
    if (target._bitflags & SPACE_BIT) {
      var spacedResult = algorithm(search, target, true);
      if (spacedResult !== null && spacedResult._score > _$score) {
        if (partial) {
          var searchFrom = 0;
          for (var i1 = 0; i1 < searches.length; i1++) {
            partials[i1] = spacedResult._score / searches.length;
            var part = searches[i1]._lower;
            var searchI = search._lower.indexOf(part, searchFrom);
            var indexes2 = partIndexes[i1];
            indexes2.length = part.length;
            for (var j4 = 0; j4 < part.length; j4++) indexes2[j4] = spacedResult._indexes[searchI + j4];
            searchFrom = searchI + part.length;
          }
          if (spacedResult._score < GOOD_PART_SCORE) spacedResult._indexes.len = 0;
        }
        return spacedResult;
      }
    }
    if (partial) {
      result = target;
      var targetLower = target._targetLower;
      for (var i22 = 1; i22 < searches.length; i22++) {
        var previous1 = partIndexes[i22 - 1];
        if (!previous1.length || !partIndexes[i22].length) continue;
        var previousEnd = previous1[previous1.length - 1] + 1;
        var at = previousEnd;
        var code = void 0;
        while ((code = targetLower.charCodeAt(at)) === 32 || code >= 9 && code <= 13) at++;
        var part1 = searches[i22]._lower;
        if (!targetLower.startsWith(part1, at)) continue;
        for (var j5 = previousEnd; j5 < at; j5++) previous1.push(j5);
        var indexes3 = partIndexes[i22];
        indexes3.length = part1.length;
        for (var j6 = 0; j6 < part1.length; j6++) indexes3[j6] = at + j6;
      }
      result._indexes.len = 0;
      for (var i3 = 0; i3 < searches.length; i3++) if (partials[i3] * searches.length >= GOOD_PART_SCORE) {
        appendIndexes(result._indexes, partIndexes[i3]);
      }
    } else {
      for (var i4 = 0; i4 < seenLen; i4++) result._indexes[i4] = seen[i4];
      result._indexes.len = seenLen;
    }
    result._score = _$score;
    return result;
  }
  function resetBeginnings(target, changesLen) {
    for (var i2 = changesLen - 1; i2 >= 0; i2--) {
      target._nextBeginningIndexes[changes[i2 * 2]] = changes[i2 * 2 + 1];
    }
  }
  function copyResult(result) {
    if (result === noTarget) return noTarget;
    if (result instanceof KeysResult) {
      var copy = result.map(copyResult);
      copy.obj = result.obj;
      copy._score = result._score;
      if (result._partWinners) copy._partWinners = true;
      return copy;
    }
    var copy1 = materialize(result, result.obj);
    if (result._bestKeyScore !== void 0) copy1._bestKeyScore = result._bestKeyScore;
    var indexes = result._indexes;
    copy1._indexes = indexes.slice(0, indexes.len ?? indexes.length);
    copy1._indexes.len = copy1._indexes.length;
    return copy1;
  }
  function copyResults(results) {
    var copies = results.map(copyResult);
    copies.total = results.total;
    return copies;
  }
  function prepTarget(target) {
    if (isPrepared(target)) target = target.target;
    else if (typeof target === "number") target = "" + target;
    else if (typeof target !== "string") target = "";
    var info = lowerInfo(target);
    return newResult(target, -INF, null, info._lower, info.lowerCodes, info.bitflags);
  }
  function prepQuery(search) {
    if (typeof search === "number") search = "" + search;
    else if (typeof search !== "string") search = "";
    search = remapChars(search).trim();
    var info = lowerInfoRemapped(search);
    info.bitflags &= ~SPACE_BIT;
    info.parts = info.hasSpace ? [
      ...new Set(info._lower.split(/\s+/))
    ].map(prepQuery) : [];
    return info;
  }
  function getPrepared(target) {
    if (target.length > 999) return prepTarget(target);
    var prepared = targetCache.get(target);
    if (prepared === void 0) targetCache.set(target, prepared = prepTarget(target));
    return prepared;
  }
  function getQuery(search) {
    if (search.length > 999) return prepQuery(search);
    var prepared = searchCache.get(search);
    if (prepared === void 0) {
      if (searchCache.size >= 512) searchCache.clear();
      searchCache.set(search, prepared = prepQuery(search));
    }
    return prepared;
  }
  function scanBeginnings(prepared, visit) {
    var target = remapChars(prepared.target);
    var wasUpper = false;
    var wasAlnum = false;
    var count = 0;
    for (var i2 = 0; i2 < target.length; i2++) {
      var code = target.charCodeAt(i2);
      var upper = code >= 65 && code <= 90;
      var alnum = upper || code >= 97 && code <= 122 || code >= 48 && code <= 57;
      var beginning = upper && !wasUpper || !wasAlnum || !alnum;
      wasUpper = upper;
      wasAlnum = alnum;
      if (beginning) {
        count++;
        visit(i2);
      }
    }
    prepared._beginningsLen = count;
  }
  function indexBeginnings(prepared, firstTable, row, packed) {
    if (prepared.target.length >= 65535) return;
    var target = remapChars(prepared.target);
    var lowerCodes = prepared._targetLowerCodes;
    var offset = row * 26;
    var wasUpper = false;
    var wasAlnum = false;
    var count = 0;
    for (var i2 = 0; i2 < target.length; i2++) {
      var code = target.charCodeAt(i2);
      var upper = code >= 65 && code <= 90;
      var alnum = upper || code >= 97 && code <= 122 || code >= 48 && code <= 57;
      var beginning = upper && !wasUpper || !wasAlnum || !alnum;
      wasUpper = upper;
      wasAlnum = alnum;
      if (!beginning) continue;
      count++;
      packed.push(i2);
      code = lowerCodes[i2];
      if (code >= 97 && code <= 122) {
        var slot = offset + code - 97;
        if (firstTable[slot] === 0) firstTable[slot] = i2 + 1;
      }
    }
    prepared._beginningsLen = count;
  }
  function prepareSingleMatch(prepared, searchCode, fallbackIndex) {
    var matchI = fallbackIndex;
    var strict = false;
    scanBeginnings(prepared, (i2) => {
      if (!strict && searchCode === prepared._targetLowerCodes[i2]) {
        matchI = i2;
        strict = true;
      }
    });
    prepared._singleMatchCode = searchCode;
    prepared._singleMatchIndex = matchI;
    prepared._singleMatchStrict = strict;
  }
  function makeBeginnings(prepared) {
    var beginnings = [];
    scanBeginnings(prepared, (i2) => beginnings.push(i2));
    return beginnings;
  }
  function makeNextBeginnings(prepared) {
    var next = [];
    var fill = 0;
    scanBeginnings(prepared, (i2) => {
      for (; fill < i2; fill++) next[fill] = i2;
    });
    for (; fill < prepared.target.length; fill++) next[fill] = prepared.target.length;
    return next;
  }
  function remapCharacter(char) {
    var remapped = remappings[char];
    if (remapped !== void 0) return remapped;
    if (char.charCodeAt(0) < 128) return char;
    remapped = char.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    return remapped.length === 1 ? remapped : char;
  }
  function remapChars(value) {
    if (customAsciiRemappings) return value.replace(/[\s\S]/g, remapCharacter);
    return /[^\x00-\x7F]|[\\"`]/.test(value) ? value.replace(/[^\x00-\x7F]|[\\"`]/g, remapCharacter) : value;
  }
  function lowerInfo(value) {
    return lowerInfoRemapped(remapChars(value));
  }
  function lowerInfoRemapped(value) {
    var lower = value.toLowerCase();
    var lowerCodes = [];
    var bitflags = 0;
    var hasSpace = false;
    for (var i2 = 0; i2 < lower.length; i2++) {
      var code = lowerCodes[i2] = lower.charCodeAt(i2);
      if (code === 32) {
        hasSpace = true;
        bitflags |= SPACE_BIT;
        continue;
      }
      var bit = code >= 97 && code <= 122 ? code - 97 : code >= 48 && code <= 57 ? 26 : code <= 127 ? 30 : 31;
      bitflags |= 1 << bit;
    }
    return {
      lowerCodes,
      bitflags,
      hasSpace,
      _lower: lower
    };
  }
  function newResult(target, score2 = -INF, obj = null, lower = "", lowerCodes = null, bitflags = 0) {
    var result = new Result();
    result.target = target;
    result.obj = obj;
    result._score = score2;
    result._indexes = [];
    result._targetLower = lower;
    result._targetLowerCodes = lowerCodes;
    result._nextBeginningIndexes = null;
    result._beginnings = null;
    result._beginningsLen = 0;
    result._singleMatchCode = result._singleMatchIndex = -1;
    result._singleMatchStrict = false;
    result._bitflags = bitflags;
    return result;
  }
  function materialize(prepared, obj = null) {
    var result = new Result();
    result.target = prepared.target;
    result.obj = obj;
    result._score = prepared._score;
    result._indexes = prepared._indexes;
    return result;
  }
  function markBestKeyScore(result) {
    var best = -INF;
    for (var i2 = 0; i2 < result.length; i2++) if (result[i2] !== noTarget && result[i2]._score > best) best = result[i2]._score;
    for (var i1 = 0; i1 < result.length; i1++) if (result[i1] !== noTarget) result[i1]._bestKeyScore = best;
    return result;
  }
  function captureKeysResult(matches, keysLength, obj, score2, partWinners = false) {
    var result = new KeysResult(keysLength);
    for (var k2 = 0; k2 < keysLength; k2++) result[k2] = matches[k2];
    result.obj = obj;
    result._score = score2;
    if (partWinners) result._partWinners = true;
    return result;
  }
  function makeGetter(key2) {
    if (typeof key2 === "function") return key2;
    var path = Array.isArray(key2) ? key2 : typeof key2 === "string" && key2.includes(".") ? key2.split(".") : null;
    if (path === null) return null;
    return (obj) => {
      if (path !== key2) {
        var direct = obj[key2];
        if (direct !== void 0) return direct;
      }
      for (var i2 = 0; obj && i2 < path.length; i2++) obj = obj[path[i2]];
      return obj;
    };
  }
  function scoreCeiling(searchLen, targetLen) {
    var lengthPenalty = (targetLen - searchLen) / 2;
    var bonus = 1 + searchLen * searchLen;
    var _$score = -lengthPenalty - lengthPenalty / (bonus * bonus);
    return _$score + Math.min(4, -_$score / 2);
  }
  function bitCount(value) {
    value -= value >>> 1 & 1431655765;
    value = (value & 858993459) + (value >>> 2 & 858993459);
    return (value + (value >>> 4) & 252645135) * 16843009 >>> 24;
  }
  function lowerBound(values, start2, end, value) {
    while (start2 < end) {
      var middle = start2 + end >> 1;
      if (values[middle] < value) start2 = middle + 1;
      else end = middle;
    }
    return start2;
  }
  function nextBeginning(indexes, start2, end, index, targetLen) {
    var next = lowerBound(indexes, start2, end, index + 1);
    return next < end ? indexes[next] : targetLen;
  }
  function isBeginning(indexes, start2, end, index) {
    var found = lowerBound(indexes, start2, end, index);
    return found < end && indexes[found] === index;
  }
  function getLimit(options) {
    return (options?.limit ?? 10) || INF;
  }
  function scheduleTask(run) {
    var id2;
    if (typeof requestIdleCallback === "function") {
      id2 = requestIdleCallback(run, {
        timeout: 100
      });
      return () => typeof cancelIdleCallback === "function" && cancelIdleCallback(id2);
    }
    if (typeof setImmediate === "function") {
      id2 = setImmediate(run);
      return () => typeof clearImmediate === "function" && clearImmediate(id2);
    }
    id2 = setTimeout(run);
    return () => clearTimeout(id2);
  }
  function createHeap() {
    var items = [];
    var length = 0;
    function down() {
      var index = 0;
      var item = items[0];
      for (var child = 1; child < length; child = 1 + index * 2) {
        var right = child + 1;
        index = right < length && items[right]._score < items[child]._score ? right : child;
        items[index - 1 >> 1] = items[index];
      }
      for (var parent = index - 1 >> 1; index > 0 && item._score < items[parent]._score; parent = (index = parent) - 1 >> 1) {
        items[index] = items[parent];
      }
      items[index] = item;
    }
    return {
      add(item) {
        var index = length++;
        for (var parent = index - 1 >> 1; index > 0 && item._score < items[parent]._score; parent = (index = parent) - 1 >> 1) {
          items[index] = items[parent];
        }
        items[index] = item;
      },
      poll() {
        if (!length) return;
        var root = items[0];
        var last = items[--length];
        items[length] = void 0;
        if (length) {
          items[0] = last;
          down();
        }
        return root;
      },
      peek() {
        return length ? items[0] : void 0;
      },
      replaceTop(item) {
        items[0] = item;
        down();
      },
      clear() {
        items.length = length = 0;
      }
    };
  }
  var SnapshotTargets, Result, KeysResult, normalizeScore, denormalizeScore, GOOD_PART_SCORE, isPrepared, INF, SPACE_BIT, noResults, targetCache, searchCache, simpleMatch, strictMatch, seen, seenAt, changes, partials, spaceScores, partIndexes, winnerIndexes, winnerScores, winnerKeys, keyTargets, keyResults, candidateBitOffsets, seenGeneration, remappings, remapFrom, remapTo, i, customAsciiRemappings, heap, noTarget, prunedMatch, fuzzysort_default;
  var init_fuzzysort = __esm({
    "node_modules/fuzzysort/fuzzysort.js"() {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_call_super();
      init_class_call_check();
      init_create_class();
      init_inherits();
      init_wrap_native_super();
      SnapshotTargets = /* @__PURE__ */ (function() {
        "use strict";
        function SnapshotTargets2(targets, options) {
          _class_call_check(this, SnapshotTargets2);
          this._mode = options?.keys ? 2 : options?.key ? 1 : 0;
          this._keys = this._mode === 2 ? options.keys.slice() : [
            options?.key
          ];
          this._input = targets.slice();
          this._index = 0;
          this._done = false;
          this._error = null;
          this._scheduled = null;
          if (targets.length === 0) this._finish();
          else this._schedule();
        }
        _create_class(SnapshotTargets2, [
          {
            key: "_schedule",
            value: function _schedule() {
              if (this._scheduled !== null) return;
              this._scheduled = scheduleTask((deadline) => {
                this._scheduled = null;
                this._run(deadline);
              });
            }
          },
          {
            key: "_cancel",
            value: function _cancel() {
              if (this._scheduled !== null) this._scheduled();
              this._scheduled = null;
            }
          },
          {
            key: "_initialize",
            value: function _initialize() {
              if (this._targets) return;
              var keysLength = this._mode === 2 ? this._keys.length : 1;
              var valueCount = this._input.length * keysLength;
              var rowCount = this._input.length;
              this._targets = new Array(valueCount);
              this._first = new Uint16Array(valueCount * 26);
              this._offsets = new Uint32Array(valueCount + 1);
              this._buildingBeginnings = [];
              this._rowCount = rowCount;
              this._rowWords = rowCount + 31 >> 5;
              this._rowBits = new Uint32Array(this._rowWords * 32);
              this._rows = new Uint32Array(rowCount);
              this._lastRowsLen = 0;
              this._matchedRowsLen = 0;
              this._lastQuery = null;
              this._candidateRows = null;
              this._candidateLength = rowCount;
              this._history = [];
              if (this._mode) {
                this._objects = this._input;
                this._getters = this._keys.map(makeGetter);
              }
              if (this._mode === 2) {
                this._keysLength = keysLength;
                this._bitflags = new Int32Array(rowCount);
              }
            }
          },
          {
            key: "_run",
            value: function _run(deadline) {
              if (this._done || this._error) return;
              var end = Date.now() + 4;
              var hasTime = () => deadline && !deadline.didTimeout ? deadline.timeRemaining() > 1 : Date.now() < end;
              try {
                this._initialize();
                do
                  this._prepareOne();
                while (this._index < this._input.length && hasTime());
                if (this._index === this._input.length) this._complete();
                else this._schedule();
              } catch (error) {
                this._error = error;
                this._done = true;
              }
            }
          },
          {
            key: "_indexRow",
            value: function _indexRow(row, bitflags) {
              var flags = bitflags >>> 0;
              var word = row >> 5;
              var mask = 1 << (row & 31);
              var words = this._rowWords;
              var bits = this._rowBits;
              while (flags) {
                var lowest = flags & -flags;
                var bit = 31 - Math.clz32(lowest);
                bits[bit * words + word] |= mask;
                flags = (flags & flags - 1) >>> 0;
              }
            }
          },
          {
            key: "_prepareOne",
            value: function _prepareOne() {
              var i2 = this._index++;
              var mode = this._mode;
              var obj = this._input[i2];
              var keysLength = mode === 2 ? this._keysLength : 1;
              var bitflags = 0;
              for (var k2 = 0; k2 < keysLength; k2++) {
                var value = mode === 0 ? obj : this._getters[k2] === null ? obj[this._keys[k2]] : this._getters[k2](obj);
                var row = mode === 2 ? i2 * keysLength + k2 : i2;
                var prepared = this._targets[row] = value ? prepTarget(value) : noTarget;
                if (prepared !== noTarget) indexBeginnings(prepared, this._first, row, this._buildingBeginnings);
                this._offsets[row + 1] = this._buildingBeginnings.length;
                bitflags |= prepared._bitflags;
              }
              if (mode === 2) this._bitflags[i2] = bitflags;
              this._indexRow(i2, bitflags);
            }
          },
          {
            key: "_complete",
            value: function _complete() {
              this._beginnings = Uint16Array.from(this._buildingBeginnings);
              this._buildingBeginnings = this._input = this._getters = this._keys = null;
              this._done = true;
            }
          },
          {
            key: "_bitOffsets",
            value: function _bitOffsets(bitflags) {
              var offsetsLen = 0;
              var words = this._rowWords;
              for (var bit = 0; bit < 32; bit++) if (bitflags & 1 << bit) candidateBitOffsets[offsetsLen++] = bit * words;
              return offsetsLen;
            }
          },
          {
            key: "_matchRows",
            value: function _matchRows(bitflags, fill = false, stop = INF) {
              var offsetsLen = this._bitOffsets(bitflags);
              if (!offsetsLen) {
                if (fill) {
                  this._candidateRows = null;
                  this._candidateLength = this._rowCount;
                }
                return this._rowCount;
              }
              var bits = this._rowBits;
              var words = this._rowWords;
              var rowsLen = 0;
              for (var word = 0; word < words; word++) {
                var matches = bits[candidateBitOffsets[0] + word];
                for (var i2 = 1; i2 < offsetsLen && matches; i2++) matches &= bits[candidateBitOffsets[i2] + word];
                if (!fill) {
                  rowsLen += bitCount(matches);
                  if (rowsLen >= stop) return rowsLen;
                  continue;
                }
                while (matches) {
                  var lowest = matches & -matches;
                  this._rows[rowsLen++] = (word << 5) + 31 - Math.clz32(lowest);
                  matches = (matches & matches - 1) >>> 0;
                }
              }
              if (fill) {
                this._candidateRows = this._rows;
                this._candidateLength = rowsLen;
              }
              return rowsLen;
            }
          },
          {
            key: "_beginSearch",
            value: function _beginSearch(query) {
              this._matchedRowsLen = 0;
              var previousQuery = this._lastQuery;
              var previousLength = this._lastRowsLen;
              this._lastQuery = null;
              var bitflags = query.bitflags >>> 0;
              if (previousQuery !== null && query._lower.startsWith(previousQuery)) {
                var staticCount = this._matchRows(bitflags, false, previousLength);
                if (previousLength <= staticCount) {
                  this._candidateRows = this._rows;
                  this._candidateLength = previousLength;
                  return;
                }
              }
              this._matchRows(bitflags, true);
            }
          },
          {
            key: "_endSearch",
            value: function _endSearch(query) {
              this._lastRowsLen = this._matchedRowsLen;
              this._matchedRowsLen = 0;
              this._lastQuery = query._lower || null;
              this._candidateRows = null;
              this._candidateLength = 0;
            }
          },
          {
            key: "_backtrack",
            value: function _backtrack(query, options) {
              var history = this._history;
              if (history.length < 2 || options?.scoreFn || options?.threshold !== void 0) return null;
              var limit = getLimit(options);
              if (limit === INF) return null;
              var current = history[history.length - 1];
              var value = query._lower;
              if (current.query === value && current.limit === limit && current.results) return copyResults(current.results);
              if (value.length >= current.query.length || !current.query.startsWith(value)) return null;
              var i2 = history.length - 2;
              while (i2 >= 0 && history[i2].query.length > value.length) i2--;
              var entry = history[i2];
              if (!entry || entry.query !== value || entry.limit !== limit) return null;
              history.length = i2 + 1;
              if (!entry.results) return null;
              this._resetSearch();
              return copyResults(entry.results);
            }
          },
          {
            key: "_remember",
            value: function _remember(query, results, options) {
              var history = this._history;
              var limit = getLimit(options);
              if (options?.scoreFn || options?.threshold !== void 0 || limit === INF || results.length > 256) {
                history.length = 0;
                return;
              }
              var value = query._lower;
              var last = history[history.length - 1];
              if (last && !value.startsWith(last.query)) history.length = 0;
              else if (last?.query === value && last.limit === limit) history.pop();
              history.push({
                query: value,
                limit,
                results: value.length <= 32 ? copyResults(results) : null
              });
            }
          },
          {
            key: "_resetSearch",
            value: function _resetSearch() {
              this._lastQuery = null;
              this._lastRowsLen = this._matchedRowsLen = this._candidateLength = 0;
              this._candidateRows = null;
            }
          },
          {
            key: "_finish",
            value: function _finish() {
              if (this._error) throw this._error;
              if (this._done) return;
              this._cancel();
              try {
                this._initialize();
                while (this._index < this._input.length) this._prepareOne();
                this._complete();
              } catch (error) {
                this._error = error;
                this._done = true;
                throw error;
              }
            }
          }
        ]);
        return SnapshotTargets2;
      })();
      Result = /* @__PURE__ */ (function() {
        "use strict";
        function Result2() {
          _class_call_check(this, Result2);
        }
        _create_class(Result2, [
          {
            key: "indexes",
            get: function get() {
              return this._indexes.slice(0, this._indexes.len).sort((a2, b) => a2 - b);
            }
          },
          {
            key: "indexes",
            set: function set(value) {
              this._indexes = value;
            }
          },
          {
            key: "highlight",
            value: function value(open, close, threshold) {
              return highlight(this, open, close, threshold);
            }
          },
          {
            key: "score",
            get: function get() {
              return normalizeScore(this._score);
            }
          }
        ]);
        return Result2;
      })();
      KeysResult = /* @__PURE__ */ (function(Array1) {
        "use strict";
        _inherits(KeysResult2, Array1);
        function KeysResult2() {
          _class_call_check(this, KeysResult2);
          return _call_super(this, KeysResult2, arguments);
        }
        _create_class(KeysResult2, [
          {
            key: "score",
            get: function get() {
              return normalizeScore(this._score);
            }
          }
        ]);
        return KeysResult2;
      })(_wrap_native_super(Array));
      normalizeScore = (value) => value === -INF ? 0 : value > 1 ? value : Math.E ** (((-value + 1) ** 0.04307 - 1) * -2);
      denormalizeScore = (value) => value === 0 ? -INF : value > 1 ? value : 1 - Math.pow(Math.log(value) / -2 + 1, 1 / 0.04307);
      GOOD_PART_SCORE = denormalizeScore(0.5);
      isPrepared = (value) => typeof value === "object" && typeof value?._bitflags === "number";
      INF = Infinity;
      SPACE_BIT = 1 << 27;
      noResults = [];
      noResults.total = 0;
      targetCache = /* @__PURE__ */ new Map();
      searchCache = /* @__PURE__ */ new Map();
      simpleMatch = [];
      strictMatch = [];
      seen = [];
      seenAt = [];
      changes = [];
      partials = [];
      spaceScores = [];
      partIndexes = [];
      winnerIndexes = [];
      winnerScores = [];
      winnerKeys = [];
      keyTargets = [];
      keyResults = [];
      candidateBitOffsets = [];
      seenGeneration = 0;
      remappings = {};
      remapFrom = '\\"`\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u201F\xAB\xBB\u2039\u203A\u2010\u2013\u2014\u2212\u2044\u2215\u2026\xF8\xD8\u0142\u0141\u0111\u0110\xF0\xD0\u0131\u0127\u0126\u0167\u0166';
      remapTo = "/''''''''''''''----//.oOlLdDdDihHtT";
      for (i = 0; i < remapFrom.length; i++) remappings[remapFrom[i]] = remapTo[i];
      customAsciiRemappings = false;
      heap = createHeap();
      noTarget = prepTarget("");
      prunedMatch = {};
      fuzzysort_default = {
        single,
        go,
        highlight,
        score,
        remap,
        prepare,
        snapshot,
        cleanup
      };
    }
  });

  // src/core/ui/components/AddonPage.tsx
  function InputAlert(props) {
    var [value, setValue] = React.useState("");
    var [error, setError] = React.useState("");
    var [isFetching, setIsFetching] = React.useState(false);
    var [validUrl, setValidUrl] = React.useState(false);
    React.useEffect(() => {
      setValidUrl(isValidHttpUrl(value));
    }, [
      value
    ]);
    function onConfirmWrapper() {
      if (!value || !isValidHttpUrl(value)) return;
      setIsFetching(true);
      props.fetchFn(value).then(() => dismissAlert("AddonInputAlert")).catch((e) => e instanceof Error ? setError(e.message) : String(e)).finally(() => setIsFetching(false));
    }
    return /* @__PURE__ */ jsx(AlertModal, {
      title: props.label,
      content: "Type in the source URL you want to install from:",
      extraContent: /* @__PURE__ */ jsxs(Stack, {
        style: {
          marginTop: -8,
          gap: 12
        },
        children: [
          /* @__PURE__ */ jsx(import_react_native20.View, {
            style: {
              backgroundColor: "rgba(0,0,0,0.05)",
              borderRadius: 8,
              padding: 4,
              paddingHorizontal: 8
            },
            children: /* @__PURE__ */ jsx(TextInput, {
              autoFocus: true,
              isClearable: true,
              value,
              onChange: (v2) => {
                setValue(v2);
                if (error) setError("");
              },
              returnKeyType: "done",
              onSubmitEditing: onConfirmWrapper,
              state: error ? "error" : void 0,
              errorMessage: error || void 0,
              style: {
                fontSize: 16
              }
            })
          }),
          /* @__PURE__ */ jsx(import_react_native20.View, {
            style: {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            },
            children: /* @__PURE__ */ jsx(Button, {
              size: "sm",
              variant: "tertiary",
              text: "Import from clipboard",
              icon: findAssetId("ClipboardListIcon"),
              onPress: () => clipboard.getString().then((str) => setValue(str.trim()))
            })
          })
        ]
      }),
      actions: /* @__PURE__ */ jsxs(import_react_native20.View, {
        style: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8
        },
        children: [
          /* @__PURE__ */ jsx(AlertActionButton, {
            disabled: isFetching,
            text: "Cancel",
            variant: "secondary",
            style: {
              flex: 1
            }
          }),
          /* @__PURE__ */ jsx(Button, {
            loading: isFetching,
            text: isFetching ? "Installing..." : "Install",
            variant: "primary",
            onPress: onConfirmWrapper,
            icon: !isFetching ? findAssetId("DownloadIcon") : void 0,
            style: {
              flex: 1
            }
          })
        ]
      })
    });
  }
  function AddonPage({ CardComponent, ...props }) {
    var [search, setSearch] = React.useState("");
    var [sortFn, setSortFn] = React.useState(() => null);
    var { bottom: bottomInset } = useSafeAreaInsets();
    var navigation2 = NavigationNative.useNavigation();
    var fuzzysortRef = React.useRef(null);
    var [fuzzysortReady, setFuzzysortReady] = React.useState(false);
    React.useEffect(() => {
      var mounted = true;
      Promise.resolve().then(() => (init_fuzzysort(), fuzzysort_exports)).then((mod) => {
        var f2 = mod.default ?? mod;
        if (mounted) {
          fuzzysortRef.current = f2;
          setFuzzysortReady(true);
        }
      }).catch(() => {
      });
      return () => {
        mounted = false;
      };
    }, []);
    (0, import_react6.useEffect)(() => {
      if (props.OptionsActionSheetComponent) {
        navigation2.setOptions({
          headerRight: () => /* @__PURE__ */ jsx(IconButton, {
            size: "sm",
            variant: "secondary",
            icon: findAssetId("MoreHorizontalIcon"),
            onPress: () => showSheet("AddonMoreSheet", props.OptionsActionSheetComponent)
          })
        });
      }
    }, [
      navigation2
    ]);
    var results = (0, import_react6.useMemo)(() => {
      var values = props.items;
      if (props.resolveItem) values = values.map(props.resolveItem).filter(isNotNil);
      var items = values.filter((i2) => isNotNil(i2) && typeof i2 === "object");
      if (!search && sortFn) items.sort(sortFn);
      if (!fuzzysortReady || !fuzzysortRef.current) return [];
      return fuzzysortRef.current.go(search, items, {
        keys: props.searchKeywords,
        all: true
      });
    }, [
      props.items,
      sortFn,
      search,
      fuzzysortReady
    ]);
    var onInstallPress = (0, import_react6.useCallback)(() => {
      if (!props.installAction) return () => {
      };
      var { label, onPress, fetchFn } = props.installAction;
      if (fetchFn) {
        openAlert("AddonInputAlert", /* @__PURE__ */ jsx(InputAlert, {
          label: label ?? "Install",
          fetchFn
        }));
      } else {
        onPress?.();
      }
    }, []);
    if (results.length === 0 && !search) {
      return /* @__PURE__ */ jsxs(import_react_native20.View, {
        style: {
          gap: 32,
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center"
        },
        children: [
          /* @__PURE__ */ jsxs(import_react_native20.View, {
            style: {
              gap: 8,
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsx(import_react_native20.Image, {
                source: findAssetId("empty_quick_switcher")
              }),
              /* @__PURE__ */ jsx(Text, {
                variant: "text-lg/semibold",
                color: "text-default",
                children: "Oops! Nothing to see here\u2026 yet!"
              })
            ]
          }),
          /* @__PURE__ */ jsx(Button, {
            size: "lg",
            icon: findAssetId("DownloadIcon"),
            text: props.installAction?.label ?? "Install",
            onPress: onInstallPress
          })
        ]
      });
    }
    var headerElement = /* @__PURE__ */ jsxs(import_react_native20.View, {
      style: {
        paddingBottom: 8
      },
      children: [
        settings.safeMode?.enabled && /* @__PURE__ */ jsxs(import_react_native20.View, {
          style: {
            marginBottom: 10
          },
          children: [
            /* @__PURE__ */ jsx(HelpMessage, {
              messageType: 0,
              children: props.safeModeHint?.message
            }),
            props.safeModeHint?.footer
          ]
        }),
        /* @__PURE__ */ jsxs(import_react_native20.View, {
          style: {
            flexDirection: "row",
            gap: 8
          },
          children: [
            /* @__PURE__ */ jsx(Search_default, {
              style: {
                flexGrow: 1
              },
              isRound: !!props.sortOptions,
              onChangeText: (v2) => setSearch(v2)
            }),
            props.sortOptions && /* @__PURE__ */ jsx(IconButton, {
              icon: findAssetId("MoreVerticalIcon"),
              variant: "tertiary",
              disabled: !!search,
              onPress: () => showSimpleActionSheet({
                key: "AddonListSortOptions",
                header: {
                  title: "Sort Options"
                },
                options: Object.entries(props.sortOptions).map(([name, fn]) => ({
                  label: name,
                  onPress: () => setSortFn(() => fn)
                }))
              })
            })
          ]
        }),
        props.ListHeaderComponent && /* @__PURE__ */ jsx(props.ListHeaderComponent, {})
      ]
    });
    return /* @__PURE__ */ jsxs(ErrorBoundary, {
      children: [
        /* @__PURE__ */ jsx(FlashList, {
          data: results,
          extraData: search,
          estimatedItemSize: 136,
          ListHeaderComponent: headerElement,
          ListEmptyComponent: () => /* @__PURE__ */ jsxs(import_react_native20.View, {
            style: {
              gap: 12,
              padding: 12,
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsx(import_react_native20.Image, {
                source: findAssetId("devices_not_found")
              }),
              /* @__PURE__ */ jsx(Text, {
                variant: "text-lg/semibold",
                color: "text-default",
                children: "Hmmm... could not find that!"
              })
            ]
          }),
          contentContainerStyle: {
            padding: 8,
            paddingHorizontal: 12,
            paddingBottom: 90
          },
          ItemSeparatorComponent: () => /* @__PURE__ */ jsx(import_react_native20.View, {
            style: {
              height: 8
            }
          }),
          ListFooterComponent: props.ListFooterComponent,
          renderItem: ({ item }) => /* @__PURE__ */ jsx(CardComponent, {
            item: item.obj,
            result: item
          })
        }),
        props.installAction && /* @__PURE__ */ jsx(FloatingActionButton, {
          positionBottom: bottomInset + 8,
          icon: findAssetId("PlusLargeIcon"),
          onPress: onInstallPress
        })
      ]
    });
  }
  var import_react6, import_react_native20, showSimpleActionSheet, hideActionSheet;
  var init_AddonPage = __esm({
    "src/core/ui/components/AddonPage.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_assets();
      init_settings();
      init_alerts();
      init_sheets();
      init_isValidHttpUrl();
      init_lazy();
      init_metro();
      init_common();
      init_components();
      init_components2();
      init_dist();
      import_react6 = __toESM(require_react());
      import_react_native20 = __toESM(require_react_native());
      ({ showSimpleActionSheet, hideActionSheet } = lazyDestructure(() => findByProps("showSimpleActionSheet")));
    }
  });

  // src/core/ui/settings/pages/Plugins/usePluginCardStyles.ts
  var usePluginCardStyles;
  var init_usePluginCardStyles = __esm({
    "src/core/ui/settings/pages/Plugins/usePluginCardStyles.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_common();
      init_styles();
      usePluginCardStyles = createStyles({
        smallIcon: {
          tintColor: tokens.colors.LOGO_PRIMARY,
          height: 18,
          width: 18
        },
        badgeIcon: {
          tintColor: tokens.colors.LOGO_PRIMARY,
          height: 12,
          width: 12
        },
        badgesContainer: {
          flexWrap: "wrap",
          flexDirection: "row",
          gap: 6,
          borderRadius: 6,
          padding: 4
        }
      });
    }
  });

  // src/core/ui/settings/pages/Plugins/components/PluginCard.tsx
  function getHighlightColor() {
    return getChroma2()(tokens.unsafe_rawColors.YELLOW_300).alpha(0.3).hex();
  }
  function Title() {
    var styles = usePluginCardStyles();
    var { plugin, result } = useCardContext();
    var highlightedNode = result[0].highlight((m, i2) => /* @__PURE__ */ jsx(Text, {
      style: {
        backgroundColor: getHighlightColor()
      },
      children: m
    }, i2));
    var icon = plugin.icon && findAssetId(plugin.icon);
    var textNode = /* @__PURE__ */ jsx(Text, {
      numberOfLines: 1,
      variant: "heading-lg/semibold",
      children: highlightedNode.length ? highlightedNode : plugin.name
    });
    return /* @__PURE__ */ jsxs(import_react_native21.View, {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
      },
      children: [
        icon && /* @__PURE__ */ jsx(import_react_native21.Image, {
          style: styles.smallIcon,
          source: icon
        }),
        textNode
      ]
    });
  }
  function Authors() {
    var { plugin, result } = useCardContext();
    var styles = usePluginCardStyles();
    if (!plugin.authors) return null;
    var highlightedNode = result[2].highlight((m, i2) => /* @__PURE__ */ jsx(Text, {
      style: {
        backgroundColor: getHighlightColor()
      },
      children: m
    }, i2));
    var badges = plugin.getBadges();
    var authorText = highlightedNode.length > 0 ? highlightedNode : plugin.authors.map((a2) => a2.name).join(", ");
    return /* @__PURE__ */ jsxs(import_react_native21.View, {
      style: {
        flexDirection: "row",
        flexWrap: "wrap",
        flexShrink: 1,
        gap: 4
      },
      children: [
        /* @__PURE__ */ jsxs(Text, {
          variant: "text-sm/semibold",
          color: "text-muted",
          children: [
            "by ",
            authorText
          ]
        }),
        badges.length > 0 && /* @__PURE__ */ jsx(import_react_native21.View, {
          style: styles.badgesContainer,
          children: badges.map((b, i2) => /* @__PURE__ */ jsx(import_react_native21.Image, {
            source: b.source,
            style: styles.badgeIcon
          }, i2))
        })
      ]
    });
  }
  function Description() {
    var { plugin, result } = useCardContext();
    var highlightedNode = result[1].highlight((m, i2) => /* @__PURE__ */ jsx(Text, {
      style: {
        backgroundColor: getHighlightColor()
      },
      children: m
    }, i2));
    return /* @__PURE__ */ jsx(Text, {
      variant: "text-md/medium",
      children: highlightedNode.length ? highlightedNode : plugin.description
    });
  }
  function PluginCard({ result, item: plugin }) {
    plugin.usePluginState();
    var [, forceUpdate] = React2.useReducer(() => ({}), 0);
    var cardContextValue = (0, import_react7.useMemo)(() => ({
      plugin,
      result
    }), [
      plugin,
      result
    ]);
    var idLower = (plugin.id || "").toLowerCase();
    var isProtectedCore = idLower.includes("quickinstall");
    return /* @__PURE__ */ jsx(CardContext.Provider, {
      value: cardContextValue,
      children: /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsxs(Stack, {
          spacing: 16,
          children: [
            /* @__PURE__ */ jsxs(import_react_native21.View, {
              style: {
                flexDirection: "row",
                justifyContent: "space-between"
              },
              children: [
                /* @__PURE__ */ jsxs(import_react_native21.View, {
                  style: {
                    flexShrink: 1
                  },
                  children: [
                    /* @__PURE__ */ jsx(Title, {}),
                    /* @__PURE__ */ jsx(Authors, {})
                  ]
                }),
                /* @__PURE__ */ jsx(import_react_native21.View, {
                  children: /* @__PURE__ */ jsxs(Stack, {
                    spacing: 12,
                    direction: "horizontal",
                    children: [
                      /* @__PURE__ */ jsx(Actions, {}),
                      /* @__PURE__ */ jsx(import_react_native21.View, {
                        style: {
                          opacity: isProtectedCore ? 0.45 : 1
                        },
                        children: /* @__PURE__ */ jsx(TableSwitch, {
                          value: plugin.isEnabled(),
                          disabled: isProtectedCore,
                          onValueChange: (v2) => {
                            if (isProtectedCore) return;
                            plugin.toggle(v2);
                            forceUpdate();
                          }
                        })
                      })
                    ]
                  })
                })
              ]
            }),
            /* @__PURE__ */ jsx(Description, {})
          ]
        })
      })
    });
  }
  var import_react7, import_react_native21, getChroma2, CardContext, useCardContext, Actions;
  var init_PluginCard = __esm({
    "src/core/ui/settings/pages/Plugins/components/PluginCard.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_common();
      init_usePluginCardStyles();
      init_assets();
      init_components();
      init_sheets();
      import_react7 = __toESM(require_react());
      import_react_native21 = __toESM(require_react_native());
      getChroma2 = () => require_chroma_js();
      CardContext = /* @__PURE__ */ (0, import_react7.createContext)(null);
      useCardContext = () => (0, import_react7.useContext)(CardContext);
      Actions = () => {
        var { plugin } = useCardContext();
        var navigation2 = NavigationNative.useNavigation();
        return /* @__PURE__ */ jsxs(import_react_native21.View, {
          style: {
            flexDirection: "row",
            gap: 6
          },
          children: [
            /* @__PURE__ */ jsx(IconButton, {
              size: "sm",
              variant: "secondary",
              icon: findAssetId("SettingsIcon"),
              disabled: !plugin.getPluginSettingsComponent(),
              onPress: () => navigation2.push("SHIGGYCORD_CUSTOM_PAGE", {
                title: plugin.name,
                render: plugin.getPluginSettingsComponent()
              })
            }),
            /* @__PURE__ */ jsx(IconButton, {
              size: "sm",
              variant: "secondary",
              icon: findAssetId("CircleInformationIcon-primary"),
              onPress: () => void showSheet("PluginInfoActionSheet", plugin.resolveSheetComponent(), {
                plugin,
                navigation: navigation2
              })
            })
          ]
        });
      };
    }
  });

  // src/core/vendetta/plugins.ts
  var plugins_exports = {};
  __export(plugins_exports, {
    VdPluginManager: () => VdPluginManager
  });
  var plugins, pluginInstance, VdPluginManager;
  var init_plugins = __esm({
    "src/core/vendetta/plugins.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_storage();
      init_settings();
      init_utils();
      init_logger();
      plugins = wrapSync(createStorage(createMMKVBackend("VENDETTA_PLUGINS")));
      pluginInstance = {};
      VdPluginManager = {
        plugins,
        pluginFetch(url2) {
          return _async_to_generator(function* () {
            return yield safeFetch(url2, {
              cache: "no-store"
            });
          })();
        },
        fetchPlugin(id2) {
          return _async_to_generator(function* () {
            if (!id2.endsWith("/")) id2 += "/";
            var existingPlugin = plugins[id2];
            var pluginManifest;
            try {
              pluginManifest = yield (yield this.pluginFetch(id2 + "manifest.json")).json();
            } catch (unused) {
              throw new Error(`Failed to fetch manifest for ${id2}`);
            }
            var pluginJs;
            if (existingPlugin?.manifest.hash !== pluginManifest.hash) {
              try {
                pluginJs = yield (yield this.pluginFetch(id2 + (pluginManifest.main || "index.js"))).text();
              } catch (unused) {
              }
            }
            if (!pluginJs && !existingPlugin) throw new Error(`Failed to fetch JS for ${id2}`);
            plugins[id2] = {
              id: id2,
              manifest: pluginManifest,
              enabled: existingPlugin?.enabled ?? false,
              update: existingPlugin?.update ?? true,
              js: pluginJs ?? existingPlugin.js
            };
          }).call(this);
        },
        installPlugin(id2, enabled = true) {
          return _async_to_generator(function* () {
            if (!id2.endsWith("/")) id2 += "/";
            if (typeof id2 !== "string" || id2 in plugins) throw new Error("Plugin already installed");
            yield this.fetchPlugin(id2);
            if (enabled) yield this.startPlugin(id2);
          }).call(this);
        },
        /**
        * @internal
        */
        evalPlugin(plugin) {
          return _async_to_generator(function* () {
            var vendettaForPlugins = {
              ...globalThis.vendetta,
              plugin: {
                id: plugin.id,
                manifest: plugin.manifest,
                // Wrapping this with wrapSync is NOT an option.
                storage: yield createStorage(createMMKVBackend(plugin.id))
              },
              logger: new LoggerClass(`ShiggyCord \xBB ${plugin.manifest.name}`)
            };
            var pluginString = `vendetta=>{return ${plugin.js}}
//# sourceURL=${plugin.id}`;
            var raw = (0, eval)(pluginString)(vendettaForPlugins);
            var ret = typeof raw === "function" ? raw() : raw;
            return ret?.default ?? ret ?? {};
          })();
        },
        startPlugin(id2) {
          return _async_to_generator(function* () {
            if (!id2.endsWith("/")) id2 += "/";
            var plugin = plugins[id2];
            if (!plugin) throw new Error("Attempted to start non-existent plugin");
            try {
              if (!settings.safeMode?.enabled) {
                var pluginRet = yield this.evalPlugin(plugin);
                pluginInstance[id2] = pluginRet;
                pluginRet.onLoad?.();
              }
              plugin.enabled = true;
            } catch (e) {
              logger.error(`Plugin ${plugin.id} errored whilst loading, and will be unloaded`, e);
              try {
                pluginInstance[plugin.id]?.onUnload?.();
              } catch (e2) {
                logger.error(`Plugin ${plugin.id} errored whilst unloading`, e2);
              }
              delete pluginInstance[id2];
              plugin.enabled = false;
            }
          }).call(this);
        },
        stopPlugin(id2, disable = true) {
          if (!id2.endsWith("/")) id2 += "/";
          var plugin = plugins[id2];
          var pluginRet = pluginInstance[id2];
          if (!plugin) throw new Error("Attempted to stop non-existent plugin");
          if (!settings.safeMode?.enabled) {
            try {
              pluginRet?.onUnload?.();
            } catch (e) {
              logger.error(`Plugin ${plugin.id} errored whilst unloading`, e);
            }
            delete pluginInstance[id2];
          }
          if (disable) plugin.enabled = false;
        },
        removePlugin(id2) {
          return _async_to_generator(function* () {
            if (!id2.endsWith("/")) id2 += "/";
            var plugin = plugins[id2];
            if (plugin.enabled) this.stopPlugin(id2);
            delete plugins[id2];
            yield purgeStorage(id2);
          }).call(this);
        },
        /**
        * @internal
        */
        initPlugins() {
          return _async_to_generator(function* () {
            yield awaitStorage(settings, plugins);
            var allIds = Object.keys(plugins);
            if (!settings.safeMode?.enabled) {
              var enabledIds = allIds.filter((pl) => plugins[pl].enabled);
              var batchSize = 2;
              var staggerInterval = 500;
              if (enabledIds.length > 0) {
                var sleep = (ms) => new Promise((res) => setTimeout(res, ms));
                for (var i2 = 0; i2 < enabledIds.length; i2 += batchSize) {
                  var batch = enabledIds.slice(i2, i2 + batchSize);
                  yield allSettled(batch.map((id2) => _async_to_generator(function* () {
                    try {
                      if (!plugins[id2]) return;
                      yield this.startPlugin(id2).catch((e) => logger.error(`Vendetta plugin ${id2} failed to start:`, e));
                    } catch (err) {
                      logger.error(`Unexpected error while starting vendetta plugin ${id2}:`, err);
                    }
                  }).call(this)));
                  if (i2 + batchSize < enabledIds.length) {
                    yield sleep(staggerInterval);
                  }
                }
              }
              (() => _async_to_generator(function* () {
                var toFetch = allIds.filter((pl2) => plugins[pl2]?.update);
                for (var pl of toFetch) {
                  try {
                    yield this.fetchPlugin(pl).catch((e) => {
                      logger.error(e.message);
                    });
                  } catch (e) {
                    logger.error(`Failed background fetch for vendetta plugin ${pl}:`, e);
                  }
                  yield new Promise((res) => setTimeout(res, 200));
                }
              }).call(this))();
            }
            return () => this.stopAllPlugins();
          }).call(this);
        },
        stopAllPlugins() {
          return Object.keys(pluginInstance).forEach((p) => this.stopPlugin(p, false));
        },
        getSettings: (id2) => pluginInstance[id2]?.settings
      };
    }
  });

  // src/core/plugins/quickinstall/forumPost.tsx
  function useExtractThreadContent(thread, _firstMessage = null, actionSheet3 = false) {
    if (thread.guild_id !== KETTU_DISCORD_SERVER_ID && thread.guild_id !== VD_DISCORD_SERVER_ID) return;
    var postType;
    if (thread.parent_id === KETTU_PLUGINS_CHANNEL_ID || thread.parent_id === VD_PLUGINS_CHANNEL_ID) {
      postType = "Plugin";
    } else if ((thread.parent_id === KETTU_THEMES_CHANNEL_ID || thread.parent_id === VD_THEMES_CHANNEL_ID) && isThemeSupported()) {
      postType = "Theme";
    } else return;
    var { firstMessage } = actionSheet3 ? useFirstForumPostMessage(thread) : {
      firstMessage: _firstMessage
    };
    var urls = firstMessage?.content?.match(HTTP_REGEX_MULTI)?.filter(postMap[postType].urlsFilter);
    if (!urls || !urls[0]) return;
    if (postType === "Plugin" && !urls[0].endsWith("/")) urls[0] += "/";
    return [
      postType,
      urls[0]
    ];
  }
  function useInstaller(thread, firstMessage = null, actionSheet3 = false) {
    var [postType, url2] = useExtractThreadContent(thread, firstMessage, actionSheet3) ?? [];
    useProxy(VdPluginManager.plugins);
    useProxy(themes);
    var [isInstalling, setIsInstalling] = React.useState(false);
    if (!postType || !url2) return [
      true
    ];
    var isInstalled = Boolean(postMap[postType].storage[url2]);
    var installOrRemove = () => _async_to_generator(function* () {
      setIsInstalling(true);
      try {
        yield postMap[postType].installOrRemove(url2);
      } catch (e) {
        showToast(e.message, findAssetId("Small"));
      } finally {
        setIsInstalling(false);
      }
    })();
    return [
      false,
      postType,
      isInstalled,
      isInstalling,
      installOrRemove
    ];
  }
  var useFirstForumPostMessage, forumReactions, postMap, installButtonPatch, forumPost_default;
  var init_forumPost = __esm({
    "src/core/plugins/quickinstall/forumPost.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_jsxRuntime();
      init_i18n();
      init_plugins();
      init_storage();
      init_themes();
      init_assets();
      init_loader();
      init_patcher();
      init_constants();
      init_lazy();
      init_components();
      init_wrappers();
      init_components2();
      init_toasts();
      ({ useFirstForumPostMessage } = lazyDestructure(() => findByProps("useFirstForumPostMessage")));
      forumReactions = findByPropsLazy("MostCommonForumPostReaction");
      postMap = {
        Plugin: {
          storage: VdPluginManager.plugins,
          urlsFilter: (url2) => url2.startsWith(VD_PROXY_PREFIX),
          installOrRemove: (url2) => {
            var isInstalled = postMap.Plugin.storage[url2];
            return isInstalled ? VdPluginManager.removePlugin(url2) : VdPluginManager.installPlugin(url2);
          }
        },
        Theme: {
          storage: themes,
          urlsFilter: (url2) => url2.endsWith(".json"),
          installOrRemove: (url2) => {
            var isInstalled = postMap.Theme.storage[url2];
            return isInstalled ? removeTheme(url2) : installTheme(url2);
          }
        }
      };
      installButtonPatch = () => after("MostCommonForumPostReaction", forumReactions, ([{ thread, firstMessage }], res) => {
        var [shouldReturn, _2, installed, loading, installOrRemove] = useInstaller(thread, firstMessage, true);
        if (shouldReturn) return;
        return /* @__PURE__ */ jsxs(Fragment, {
          children: [
            res,
            /* @__PURE__ */ jsx(ErrorBoundary, {
              children: /* @__PURE__ */ jsx(Button, {
                size: "sm",
                loading,
                disabled: loading,
                // variant={installed ? "destructive" : "primary"} crashes older version because "destructive" was renamed from "danger" and there's no sane way for compat check horror
                variant: installed ? "secondary" : "primary",
                text: installed ? Strings.UNINSTALL : Strings.INSTALL,
                onPress: installOrRemove,
                icon: findAssetId(installed ? "ic_message_delete" : "DownloadIcon"),
                style: {
                  marginLeft: 8
                }
              })
            })
          ]
        });
      });
      forumPost_default = (() => {
        var patches3 = [
          // actionSheetPatch(),
          installButtonPatch()
        ];
        return () => patches3.map((p) => p());
      });
    }
  });

  // src/lib/ui/components/InputAlert.tsx
  function InputAlert2({ title, confirmText, confirmColor, onConfirm, cancelText, placeholder, initialValue = "", secureTextEntry }) {
    var [value, setValue] = React.useState(initialValue);
    var [error, setError] = React.useState("");
    function onConfirmWrapper() {
      var asyncOnConfirm = Promise.resolve(onConfirm(value));
      asyncOnConfirm.then(() => {
        Alerts.close();
      }).catch((e) => {
        setError(e.message);
      });
    }
    return /* @__PURE__ */ jsx(LegacyAlert, {
      title,
      confirmText,
      confirmColor,
      isConfirmButtonDisabled: error.length !== 0,
      onConfirm: onConfirmWrapper,
      cancelText,
      onCancel: () => Alerts.close(),
      children: /* @__PURE__ */ jsx(LegacyFormInput, {
        placeholder,
        value,
        onChange: (v2) => {
          setValue(typeof v2 === "string" ? v2 : v2.text);
          if (error) setError("");
        },
        returnKeyType: "done",
        onSubmitEditing: onConfirmWrapper,
        error: error || void 0,
        secureTextEntry,
        autoFocus: true,
        showBorder: true,
        style: {
          alignSelf: "stretch"
        }
      })
    });
  }
  var Alerts;
  var init_InputAlert = __esm({
    "src/lib/ui/components/InputAlert.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_components();
      init_wrappers();
      Alerts = findByPropsLazy("openLazy", "close");
    }
  });

  // src/core/vendetta/alerts.ts
  function showConfirmationAlert(options) {
    var internalOptions = options;
    internalOptions.body = options.content;
    delete internalOptions.content;
    internalOptions.isDismissable ??= true;
    return Alerts2.show(internalOptions);
  }
  var Alerts2, showCustomAlert, showInputAlert;
  var init_alerts2 = __esm({
    "src/core/vendetta/alerts.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_wrappers();
      init_InputAlert();
      Alerts2 = findByPropsLazy("openLazy", "close");
      showCustomAlert = (component, props) => Alerts2.openLazy({
        importer: () => _async_to_generator(function* () {
          return () => React.createElement(component, props);
        })()
      });
      showInputAlert = (options) => showCustomAlert(InputAlert2, options);
    }
  });

  // src/core/plugins/quickinstall/url.tsx
  function typeFromUrl(url2) {
    if (!url2 || typeof url2 !== "string" || url2.length > 2048) return;
    if (url2.startsWith(VD_PROXY_PREFIX)) {
      return "plugin";
    } else if (url2.endsWith(".json") && isThemeSupported()) {
      return "theme";
    }
  }
  function installWithToast(type, url2) {
    (type === "plugin" ? VdPluginManager.installPlugin.bind(VdPluginManager) : installTheme)(url2).then(() => {
      showToast(Strings.SUCCESSFULLY_INSTALLED, findAssetId("Check"));
    }).catch((e) => {
      showToast(e.message, findAssetId("Small"));
    });
  }
  var import_react_native22, showSimpleActionSheet2, handleClick, getChannelId, getChannel, url_default;
  var init_url = __esm({
    "src/core/plugins/quickinstall/url.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_i18n();
      init_alerts2();
      init_plugins();
      init_themes();
      init_assets();
      init_loader();
      init_patcher();
      init_constants();
      init_lazy();
      init_common();
      init_filters();
      init_finders();
      init_wrappers();
      init_toasts();
      import_react_native22 = __toESM(require_react_native());
      showSimpleActionSheet2 = findExports(byMutableProp("showSimpleActionSheet"));
      handleClick = findByPropsLazy("handleClick");
      ({ getChannelId } = lazyDestructure(() => channels));
      ({ getChannel } = lazyDestructure(() => findByProps("getChannel")));
      url_default = (() => {
        var patches3 = new Array();
        patches3.push(after("showSimpleActionSheet", showSimpleActionSheet2, (args) => {
          if (args[0].key !== "LongPressUrl") return;
          var { header: { title: url2 }, options } = args[0];
          var urlType = typeFromUrl(url2);
          if (!urlType) return;
          options.push({
            label: Strings.INSTALL_ADDON,
            onPress: () => installWithToast(urlType, url2)
          });
        }));
        patches3.push(instead("handleClick", handleClick, function(args, orig) {
          return _async_to_generator(function* () {
            var { href: url2 } = args[0];
            var urlType = typeFromUrl(url2);
            if (!urlType) return orig.apply(this, args);
            if (urlType === "theme" && getChannel(getChannelId())?.parent_id !== VD_THEMES_CHANNEL_ID && getChannel(getChannelId())?.parent_id !== KETTU_THEMES_CHANNEL_ID) return orig.apply(this, args);
            showConfirmationAlert({
              title: Strings.HOLD_UP,
              content: formatString("CONFIRMATION_LINK_IS_A_TYPE", {
                urlType
              }),
              onConfirm: () => installWithToast(urlType, url2),
              confirmText: Strings.INSTALL,
              cancelText: Strings.CANCEL,
              secondaryConfirmText: Strings.OPEN_IN_BROWSER,
              onConfirmSecondary: () => import_react_native22.Linking.openURL(url2)
            });
          }).call(this);
        }));
        return () => patches3.forEach((p) => p());
      });
    }
  });

  // src/core/plugins/quickinstall/index.ts
  var quickinstall_exports = {};
  __export(quickinstall_exports, {
    default: () => quickinstall_default
  });
  var patches, quickinstall_default;
  var init_quickinstall = __esm({
    "src/core/plugins/quickinstall/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_plugins2();
      init_forumPost();
      init_url();
      patches = [];
      quickinstall_default = defineCorePlugin({
        manifest: {
          id: "bunny.quickinstall",
          version: "1.0.0",
          type: "plugin",
          spec: 3,
          main: "",
          display: {
            name: "QuickInstall",
            description: "Quickly install Vendetta plugins and themes",
            authors: [
              {
                name: "Vendetta Team"
              }
            ]
          }
        },
        start() {
          patches = [
            forumPost_default(),
            url_default()
          ];
        },
        stop() {
          patches.forEach((p) => p());
        }
      });
    }
  });

  // src/lib/api/react/jsx.ts
  var jsx_exports = {};
  __export(jsx_exports, {
    deleteJsxCreate: () => deleteJsxCreate,
    onJsxCreate: () => onJsxCreate,
    patchJsx: () => patchJsx
  });
  function onJsxCreate(Component, callback) {
    if (!callbacks.has(Component)) callbacks.set(Component, []);
    callbacks.get(Component).push(callback);
  }
  function deleteJsxCreate(Component, callback) {
    if (!callbacks.has(Component)) return;
    var cbs = callbacks.get(Component);
    cbs.splice(cbs.indexOf(callback), 1);
    if (cbs.length === 0) callbacks.delete(Component);
  }
  function patchJsx() {
    var callback = ([Component], ret) => {
      if (typeof ret.type === "undefined") {
        ret.type = "RCTView";
        return ret;
      }
      if (typeof Component === "function" && callbacks.has(Component.name)) {
        var cbs = callbacks.get(Component.name);
        for (var cb of cbs) {
          var _ret = cb(Component, ret);
          if (_ret !== void 0) ret = _ret;
        }
        return ret;
      }
    };
    var patches3 = [
      after("jsx", jsxRuntime2, callback),
      after("jsxs", jsxRuntime2, callback)
    ];
    return () => patches3.forEach((unpatch2) => unpatch2());
  }
  var callbacks, jsxRuntime2;
  var init_jsx = __esm({
    "src/lib/api/react/jsx.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_patcher();
      init_metro();
      callbacks = /* @__PURE__ */ new Map();
      jsxRuntime2 = findByPropsLazy("jsx", "jsxs");
    }
  });

  // src/core/plugins/badges/index.tsx
  var badges_exports = {};
  __export(badges_exports, {
    default: () => badges_default
  });
  var useBadgesModule, badgesCache, badgeProps, pendingRequests, badges_default;
  var init_badges = __esm({
    "src/core/plugins/badges/index.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_patcher();
      init_jsx();
      init_metro();
      init_plugins2();
      init_common();
      useBadgesModule = findByNameLazy("useBadges", false);
      badgesCache = /* @__PURE__ */ new Map();
      badgeProps = /* @__PURE__ */ new Map();
      pendingRequests = /* @__PURE__ */ new Set();
      badges_default = defineCorePlugin({
        manifest: {
          id: "bunny.badges",
          version: "1.1.0",
          type: "plugin",
          spec: 3,
          main: "",
          display: {
            name: "Badges",
            description: "Adds badges to user's profile",
            authors: [
              {
                name: "cocobo1"
              },
              {
                name: "pylixonly"
              }
            ]
          }
        },
        start() {
          onJsxCreate("ProfileBadge", (component, ret) => {
            if (ret.props.id?.startsWith("rain-")) {
              var cachedProps = badgeProps.get(ret.props.id);
              if (cachedProps) {
                ret.props.source = cachedProps.source;
                ret.props.label = cachedProps.label;
                ret.props.id = cachedProps.id;
              }
            }
          });
          onJsxCreate("RenderedBadge", (component, ret) => {
            if (ret.props.id?.startsWith("rain-")) {
              var cachedProps = badgeProps.get(ret.props.id);
              if (cachedProps) {
                Object.assign(ret.props, cachedProps);
              }
            }
          });
          var fetchAndProcessBadges = (userId) => _async_to_generator(function* () {
            if (pendingRequests.has(userId)) return;
            pendingRequests.add(userId);
            try {
              var [badgesRes, rolesRes] = yield Promise.all([
                fetch("https://codeberg.org/raincord/badges/raw/branch/main/badges.json"),
                fetch("https://codeberg.org/raincord/badges/raw/branch/main/assets/roles/roles.json")
              ]);
              var badgesData = yield badgesRes.json();
              var rolesData = yield rolesRes.json();
              var userBadgeData = badgesData[userId] || {
                roles: [],
                custom: []
              };
              var allBadges = [];
              if (userBadgeData.roles) {
                userBadgeData.roles.forEach((roleName) => {
                  var roleData = rolesData[roleName];
                  if (roleData) {
                    allBadges.push({
                      label: roleData.label,
                      url: roleData.url
                    });
                  }
                });
              }
              if (userBadgeData.custom) {
                allBadges.push(...userBadgeData.custom);
              }
              badgesCache.set(userId, allBadges);
              allBadges.forEach((badge, i2) => {
                var badgeId = `rain-${userId}-${i2}`;
                var safeUrl = /^https?:\/\//.test(badge.url) ? badge.url : null;
                if (!safeUrl) return;
                badgeProps.set(badgeId, {
                  id: badgeId,
                  source: {
                    uri: safeUrl
                  },
                  label: badge.label,
                  userId
                });
              });
              FluxDispatcher.dispatch({
                type: "USER_UPDATE",
                user: {
                  id: userId
                }
              });
            } finally {
              pendingRequests.delete(userId);
            }
          })();
          after("default", useBadgesModule, ([user], result) => {
            if (!user) return;
            var userId = user.userId;
            var cached = badgesCache.get(userId);
            if (!cached) {
              if (!pendingRequests.has(userId)) {
                fetchAndProcessBadges(userId);
              }
              return;
            }
            cached.forEach((badge, i2) => {
              var badgeId = `rain-${userId}-${i2}`;
              result.unshift({
                id: badgeId,
                description: badge.label,
                icon: " _"
              });
            });
          });
        }
      });
    }
  });

  // src/core/plugins/notrack/index.ts
  var notrack_exports = {};
  __export(notrack_exports, {
    default: () => notrack_default
  });
  function patchNetwork() {
    var analyticsTest = /client-analytics\.braintreegateway\.com|discord\.com\/api\/v9\/(science|track)|app\.adjust\..*|.*\.ingest\.sentry\.io/;
    try {
      var unpatch2 = instead("send", XMLHttpRequest.prototype, function(args, orig) {
        if (this.__sentry_xhr__?.url && analyticsTest.test(this.__sentry_xhr__.url)) {
          return void 0;
        }
        return orig.apply(this, args);
      });
      return unpatch2;
    } catch (e) {
      return () => false;
    }
  }
  function patchConsole() {
    var sentrified = {};
    try {
      Object.keys(console).forEach((key2) => {
        var consoleFunc = console[key2];
        if (consoleFunc) {
          sentrified[key2] = consoleFunc;
          var originalFunc = consoleFunc.__sentry_original__;
          console[key2] = originalFunc ?? consoleFunc;
        }
      });
    } catch (e) {
      logger.log("Failed to de-sentrify console functions!", e);
    }
    return () => {
      Object.keys(sentrified).forEach((key2) => {
        if (sentrified[key2]) {
          console[key2] = sentrified[key2];
        }
      });
    };
  }
  function patchMiscellaneous() {
    var miscPatches = [
      // Global analytics utilities
      AnalyticsUtils?.AnalyticsActionHandlers && noop("handleTrack", AnalyticsUtils.AnalyticsActionHandlers),
      AnalyticsUtils?.AnalyticsActionHandlers && noop("handleFingerprint", AnalyticsUtils.AnalyticsActionHandlers),
      // Super properties tracking
      SuperPropUtils && noop("track", SuperPropUtils),
      // Voice state metadata tracking
      VoiceStateUtils && noop("trackWithMetadata", VoiceStateUtils),
      // Crash reporter
      CrashReportUtils && noop("submitLiveCrashReport", CrashReportUtils),
      // Metrics
      MetricsUtils?._metrics && noop("push", MetricsUtils._metrics)
    ].filter(Boolean);
    return () => miscPatches.forEach((p) => p());
  }
  function patchSentry() {
    var sentryPatches = [];
    if (Sentry.initializer) {
      sentryPatches.push(noop("initSentry", Sentry.initializer));
    }
    if (Sentry.main && Sentry.main.addBreadcrumb) {
      sentryPatches.push(noop("addBreadcrumb", Sentry.main));
    }
    if (Sentry.client) {
      try {
        Sentry.client.getOptions().enabled = false;
        Sentry.client.close();
        if (Sentry.main) {
          if (Sentry.main.getStackTop) {
            Sentry.main.getStackTop().scope.clear();
          }
          if (Sentry.main.getScope) {
            Sentry.main.getScope().clear();
          }
        }
      } catch (e) {
      }
    }
    return () => {
      try {
        sentryPatches.forEach((p) => p());
        if (Sentry.client) {
          Sentry.client.getOptions().enabled = true;
          Sentry.client.open();
        }
      } catch (e) {
      }
    };
  }
  var patches2, AnalyticsUtils, SuperPropUtils, VoiceStateUtils, CrashReportUtils, MetricsUtils, sentryGlobal, sentryHub, sentryClient, Sentry, noop, notrack_default;
  var init_notrack = __esm({
    "src/core/plugins/notrack/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_plugins2();
      init_metro();
      init_patcher();
      init_logger();
      patches2 = [];
      AnalyticsUtils = findByProps("AnalyticsActionHandlers");
      SuperPropUtils = findByProps("encodeProperties", "track");
      VoiceStateUtils = findByProps("getVoiceStateMetadata");
      CrashReportUtils = findByProps("submitLiveCrashReport");
      MetricsUtils = findByProps("_metrics");
      sentryGlobal = globalThis.__SENTRY__;
      sentryHub = sentryGlobal?.hub;
      sentryClient = sentryHub?.getClient();
      Sentry = {
        initializer: findByProps("initSentry"),
        main: sentryHub,
        client: sentryClient
      };
      noop = (prop2, parent) => {
        try {
          return instead(prop2, parent, () => void 0);
        } catch (e) {
          return () => false;
        }
      };
      notrack_default = defineCorePlugin({
        manifest: {
          id: "bunny.notrack",
          version: "1.1.0",
          type: "plugin",
          spec: 3,
          main: "",
          display: {
            name: "NoTrack",
            description: "Disables Discord's telemetry",
            authors: [
              {
                name: "maisymoe"
              }
            ]
          }
        },
        start() {
          patches2 = [
            patchNetwork(),
            patchConsole(),
            patchMiscellaneous(),
            patchSentry()
          ].filter(Boolean);
          logger.log("NoTrack: Enabled - all telemetry tracking disabled");
        },
        stop() {
          patches2.forEach((p) => p?.());
          patches2 = [];
          logger.log("NoTrack: Disabled - telemetry tracking restored");
        }
      });
    }
  });

  // src/core/plugins/fixembed/index.ts
  var fixembed_exports = {};
  __export(fixembed_exports, {
    default: () => fixembed_default
  });
  function transformLinks(content, config) {
    var result = content;
    if (config.twitter) {
      result = result.replace(/https?:\/\/(?:www\.)?(twitter\.com|x\.com)(\/[^\s]+)/gi, "https://fxtwitter.com$2");
    }
    if (config.instagram) {
      result = result.replace(/https?:\/\/(?:www\.)?instagram\.com(\/[^\s]+)/gi, "https://oginstagram.com$1");
    }
    if (config.tiktok) {
      result = result.replace(/https?:\/\/(?:www\.)?tiktok\.com(\/[^\s]+)/gi, "https://tnktok.com$1");
      result = result.replace(/https?:\/\/vm\.tiktok\.com\/([A-Za-z0-9]+)\/?/gi, "https://vm.tnktok.com/$1");
    }
    if (config.reddit) {
      result = result.replace(/https?:\/\/(?:www\.)?reddit\.com(\/[^\s]+)/gi, "https://vxreddit.com$1");
    }
    return result;
  }
  var TableRowGroup2, TableRow2, TableSwitchRow2, Stack2, ScrollView4, Text3, MessageActions, unpatch, fixembed_default;
  var init_fixembed = __esm({
    "src/core/plugins/fixembed/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_plugins2();
      init_metro();
      init_patcher();
      init_logger();
      init_settings();
      init_common();
      ({ TableRowGroup: TableRowGroup2, TableRow: TableRow2, TableSwitchRow: TableSwitchRow2, Stack: Stack2 } = findByProps("TableRowGroup", "TableRow", "TableSwitchRow", "Stack"));
      ({ ScrollView: ScrollView4, Text: Text3 } = require_react_native());
      MessageActions = findByProps("sendMessage");
      unpatch = null;
      fixembed_default = defineCorePlugin({
        manifest: {
          id: "bunny.fixembed",
          version: "1.0.0",
          type: "plugin",
          spec: 3,
          main: "",
          display: {
            name: "FixEmbed",
            description: "Improves social media embeds by using privacy-friendly alternative frontends.",
            authors: [
              {
                name: "ShiggyCord Team"
              }
            ]
          }
        },
        SettingsComponent() {
          var { useState: useState10, useEffect: useEffect6 } = React2;
          var [config, setConfig] = useState10({
            twitter: settings.fixembed?.twitter ?? true,
            instagram: settings.fixembed?.instagram ?? true,
            tiktok: settings.fixembed?.tiktok ?? true,
            reddit: settings.fixembed?.reddit ?? true
          });
          useEffect6(() => {
            settings.fixembed = config;
          }, [
            config
          ]);
          var updateConfig = (key2, value) => {
            setConfig((prev) => ({
              ...prev,
              [key2]: value
            }));
          };
          var { TableRowGroup: _TRG, TableRow: _TR, TableSwitchRow: _TSR, Stack: _S } = findByProps("TableRowGroup", "TableRow", "TableSwitchRow", "Stack");
          if (!_TRG || !_TSR || !_TR || !_S) {
            return React2.createElement(ScrollView4, {
              style: {
                flex: 1,
                padding: 12
              }
            }, React2.createElement(Text3, null, "FixEmbed UI unavailable (missing TableRow components)."));
          }
          var TableRowGroup3 = _TRG;
          var TableRow3 = _TR;
          var TableSwitchRow3 = _TSR;
          var Stack3 = _S;
          return React2.createElement(ScrollView4, {
            style: {
              flex: 1
            }
          }, [
            React2.createElement(Stack3, {
              spacing: 8,
              style: {
                padding: 10
              }
            }, React2.createElement(TableRowGroup3, {
              title: "Platforms"
            }, React2.createElement(TableSwitchRow3, {
              label: "Twitter/X",
              value: config.twitter,
              onValueChange: (v2) => updateConfig("twitter", v2)
            }), React2.createElement(TableSwitchRow3, {
              label: "Instagram",
              value: config.instagram,
              onValueChange: (v2) => updateConfig("instagram", v2)
            }), React2.createElement(TableSwitchRow3, {
              label: "TikTok",
              value: config.tiktok,
              onValueChange: (v2) => updateConfig("tiktok", v2)
            }), React2.createElement(TableSwitchRow3, {
              label: "Reddit",
              value: config.reddit,
              onValueChange: (v2) => updateConfig("reddit", v2)
            })), React2.createElement(TableRowGroup3, {
              title: "About"
            }, React2.createElement(TableRow3, {
              label: "Description",
              subLabel: "This plugin automatically converts social media links to privacy-friendly alternative frontends for better embeds.",
              disabled: true
            })))
          ]);
        },
        start() {
          logger.log("FixEmbed: Starting plugin");
          settings.fixembed = settings.fixembed || {
            twitter: true,
            instagram: true,
            tiktok: true,
            reddit: true
          };
          if (!unpatch) {
            unpatch = after("sendMessage", MessageActions, (args) => {
              var config = settings.fixembed;
              if (args[1]?.content) {
                args[1].content = transformLinks(args[1].content, config);
                args[1].nonce = args[1].nonce || Math.random().toString(36).slice(2);
              }
            });
          }
          logger.log("FixEmbed: Patched outgoing messages");
        },
        stop() {
          logger.log("FixEmbed: Stopping plugin");
          if (unpatch) {
            unpatch();
            unpatch = null;
          }
          logger.log("FixEmbed: Unpatched outgoing messages");
        }
      });
    }
  });

  // src/core/plugins/index.ts
  function makeLazyPlugin(loaderFn, preenabled = true) {
    var container = {
      loader: () => {
        var mod = loaderFn();
        var inst = mod && (mod.default ?? mod);
        return inst;
      },
      preenabled,
      get default() {
        var inst = container.loader();
        Object.defineProperty(container, "default", {
          value: inst,
          writable: false,
          enumerable: true
        });
        return inst;
      }
    };
    return container;
  }
  function defineCorePlugin(instance) {
    instance[/* @__PURE__ */ Symbol.for("bunny.core.plugin")] = true;
    return instance;
  }
  var getCorePlugins;
  var init_plugins2 = __esm({
    "src/core/plugins/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      getCorePlugins = () => ({
        "bunny.quickinstall": makeLazyPlugin(() => (init_quickinstall(), __toCommonJS(quickinstall_exports)), true),
        "bunny.badges": makeLazyPlugin(() => (init_badges(), __toCommonJS(badges_exports))),
        "bunny.notrack": makeLazyPlugin(() => (init_notrack(), __toCommonJS(notrack_exports))),
        "bunny.fixembed": makeLazyPlugin(() => (init_fixembed(), __toCommonJS(fixembed_exports)))
      });
    }
  });

  // src/lib/api/commands/types.ts
  var ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType;
  var init_types = __esm({
    "src/lib/api/commands/types.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      ApplicationCommandInputType = /* @__PURE__ */ (function(ApplicationCommandInputType2) {
        ApplicationCommandInputType2[ApplicationCommandInputType2["BUILT_IN"] = 0] = "BUILT_IN";
        ApplicationCommandInputType2[ApplicationCommandInputType2["BUILT_IN_TEXT"] = 1] = "BUILT_IN_TEXT";
        ApplicationCommandInputType2[ApplicationCommandInputType2["BUILT_IN_INTEGRATION"] = 2] = "BUILT_IN_INTEGRATION";
        ApplicationCommandInputType2[ApplicationCommandInputType2["BOT"] = 3] = "BOT";
        ApplicationCommandInputType2[ApplicationCommandInputType2["PLACEHOLDER"] = 4] = "PLACEHOLDER";
        return ApplicationCommandInputType2;
      })({});
      ApplicationCommandOptionType = /* @__PURE__ */ (function(ApplicationCommandOptionType2) {
        ApplicationCommandOptionType2[ApplicationCommandOptionType2["SUB_COMMAND"] = 1] = "SUB_COMMAND";
        ApplicationCommandOptionType2[ApplicationCommandOptionType2["SUB_COMMAND_GROUP"] = 2] = "SUB_COMMAND_GROUP";
        ApplicationCommandOptionType2[ApplicationCommandOptionType2["STRING"] = 3] = "STRING";
        ApplicationCommandOptionType2[ApplicationCommandOptionType2["INTEGER"] = 4] = "INTEGER";
        ApplicationCommandOptionType2[ApplicationCommandOptionType2["BOOLEAN"] = 5] = "BOOLEAN";
        ApplicationCommandOptionType2[ApplicationCommandOptionType2["USER"] = 6] = "USER";
        ApplicationCommandOptionType2[ApplicationCommandOptionType2["CHANNEL"] = 7] = "CHANNEL";
        ApplicationCommandOptionType2[ApplicationCommandOptionType2["ROLE"] = 8] = "ROLE";
        ApplicationCommandOptionType2[ApplicationCommandOptionType2["MENTIONABLE"] = 9] = "MENTIONABLE";
        ApplicationCommandOptionType2[ApplicationCommandOptionType2["NUMBER"] = 10] = "NUMBER";
        ApplicationCommandOptionType2[ApplicationCommandOptionType2["ATTACHMENT"] = 11] = "ATTACHMENT";
        return ApplicationCommandOptionType2;
      })({});
      ApplicationCommandType = /* @__PURE__ */ (function(ApplicationCommandType2) {
        ApplicationCommandType2[ApplicationCommandType2["CHAT"] = 1] = "CHAT";
        ApplicationCommandType2[ApplicationCommandType2["USER"] = 2] = "USER";
        ApplicationCommandType2[ApplicationCommandType2["MESSAGE"] = 3] = "MESSAGE";
        return ApplicationCommandType2;
      })({});
    }
  });

  // src/core/commands/eval.ts
  var eval_exports = {};
  __export(eval_exports, {
    default: () => eval_default
  });
  function wrapInJSCodeblock(resString) {
    return "```js\n" + resString.replaceAll("`", "`" + ZERO_WIDTH_SPACE_CHARACTER) + "\n```";
  }
  var util, AsyncFunction, ZERO_WIDTH_SPACE_CHARACTER, eval_default;
  var init_eval = __esm({
    "src/core/commands/eval.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_i18n();
      init_types();
      init_settings();
      init_common();
      init_wrappers();
      util = findByPropsLazy("inspect");
      AsyncFunction = (() => _async_to_generator(function* () {
        return void 0;
      })()).constructor;
      ZERO_WIDTH_SPACE_CHARACTER = "\u200B";
      eval_default = (() => ({
        name: "eval",
        description: Strings.COMMAND_EVAL_DESC,
        shouldHide: () => settings.enableEvalCommand === true,
        options: [
          {
            name: "code",
            type: ApplicationCommandOptionType.STRING,
            description: Strings.COMMAND_EVAL_OPT_CODE,
            required: true
          },
          {
            name: "async",
            type: ApplicationCommandOptionType.BOOLEAN,
            description: Strings.COMMAND_EVAL_OPT_ASYNC
          }
        ],
        execute(_0, _1) {
          return _async_to_generator(function* ([code, async], ctx) {
            try {
              var res = util.inspect(async?.value ? yield AsyncFunction(code.value)() : new Function("return (" + code.value + ")")());
              var trimmedRes = res.length > 2e3 ? res.slice(0, 2e3) + "..." : res;
              messageUtil.sendBotMessage(ctx.channel.id, wrapInJSCodeblock(trimmedRes));
            } catch (err) {
              messageUtil.sendBotMessage(ctx.channel.id, wrapInJSCodeblock(err?.stack ?? err));
            }
          }).apply(this, arguments);
        }
      }));
    }
  });

  // src/core/commands/debug.ts
  var debug_exports2 = {};
  __export(debug_exports2, {
    default: () => debug_default
  });
  var debug_default;
  var init_debug2 = __esm({
    "src/core/commands/debug.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_i18n();
      init_types();
      init_debug();
      init_common();
      debug_default = (() => ({
        name: "debug",
        description: Strings.COMMAND_DEBUG_DESC,
        options: [
          {
            name: "ephemeral",
            type: ApplicationCommandOptionType.BOOLEAN,
            description: Strings.COMMAND_DEBUG_OPT_EPHEMERALLY
          }
        ],
        execute([ephemeral], ctx) {
          var info = getDebugInfo();
          if (info.device.codename === void 0) {
            info.device.codename = "";
          } else {
            info.device.codename = "(" + info.device.codename + ")";
          }
          var content = [
            "**ShiggyCord Debug Info**",
            `> ShiggyCord: ${info.bunny.version} (${info.bunny.loader.name} ${info.bunny.loader.version})`,
            `> Discord: ${info.discord.version} (${info.discord.build})`,
            `> React: ${info.react.version} (RN ${info.react.nativeVersion})`,
            `> Hermes: ${info.hermes.version} (bcv${info.hermes.bytecodeVersion})`,
            `> System: ${info.os.name} ${info.os.version} ${info.os.sdk ? `(SDK ${info.os.sdk})` : ""}`.trimEnd(),
            `> Device: ${info.device.model} ${info.device.codename}`
          ].join("\n");
          if (ephemeral?.value) {
            messageUtil.sendBotMessage(ctx.channel.id, content);
          } else {
            var fixNonce = (BigInt(Date.now() - 14200704e5) << 22n).toString();
            messageUtil.sendMessage(ctx.channel.id, {
              content
            }, void 0, {
              nonce: fixNonce
            });
          }
        }
      }));
    }
  });

  // src/core/commands/plugins.ts
  var plugins_exports2 = {};
  __export(plugins_exports2, {
    default: () => plugins_default
  });
  var plugins_default;
  var init_plugins3 = __esm({
    "src/core/commands/plugins.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_i18n();
      init_types();
      init_common();
      init_plugins();
      init_plugins4();
      plugins_default = (() => ({
        name: "plugins",
        description: Strings.COMMAND_PLUGINS_DESC,
        options: [
          {
            name: "ephemeral",
            displayName: "ephemeral",
            type: ApplicationCommandOptionType.BOOLEAN,
            description: Strings.COMMAND_DEBUG_OPT_EPHEMERALLY
          }
        ],
        execute([ephemeral], ctx) {
          var coreIds = [
            ...corePluginInstances.keys()
          ];
          var coreManifests = coreIds.map((id3) => registeredPlugins.get(id3)).filter(Boolean);
          var coreEnabled = coreManifests.filter((m) => Boolean(pluginSettings[m.id]?.enabled)).map((m) => m.display?.name ?? m.name ?? m.id).sort((a2, b) => a2.localeCompare(b));
          var coreDisabled = coreManifests.filter((m) => !Boolean(pluginSettings[m.id]?.enabled)).map((m) => m.display?.name ?? m.name ?? m.id).sort((a2, b) => a2.localeCompare(b));
          var aggregated = /* @__PURE__ */ new Map();
          try {
            var vdRaw = VdPluginManager && VdPluginManager.plugins || {};
            var vdPlugins = Object.values(vdRaw).filter(Boolean);
            for (var p of vdPlugins) {
              var id2 = p.manifest?.id ?? p.id ?? String(p.manifest?.name ?? Math.random());
              var name = p.manifest?.name ?? id2;
              var enabled = Boolean(p.enabled);
              var existing = aggregated.get(id2);
              if (existing) {
                existing.sources.add("vendetta");
                existing.enabled = existing.enabled || enabled;
              } else {
                aggregated.set(id2, {
                  id: id2,
                  name,
                  sources: /* @__PURE__ */ new Set([
                    "vendetta"
                  ]),
                  enabled
                });
              }
            }
          } catch (e) {
          }
          for (var [id1, manifest] of registeredPlugins) {
            if (!manifest) continue;
            var isExternal = manifest.parentRepository != null;
            if (!isExternal) continue;
            if (corePluginInstances.has(id1)) continue;
            var name1 = manifest.display?.name ?? manifest.name ?? id1;
            var installed = pluginSettings[id1] != null;
            var enabled1 = Boolean(pluginSettings[id1]?.enabled);
            var existing1 = aggregated.get(id1);
            if (existing1) {
              existing1.sources.add("bunny");
              existing1.enabled = existing1.enabled || enabled1;
            } else {
              if (installed) {
                aggregated.set(id1, {
                  id: id1,
                  name: name1,
                  sources: /* @__PURE__ */ new Set([
                    "bunny"
                  ]),
                  enabled: enabled1
                });
              }
            }
          }
          var available = [
            ...registeredPlugins.values()
          ].filter((m) => Boolean(m) && m.parentRepository && !corePluginInstances.has(m.id)).map((m) => ({
            id: m.id,
            name: m.display?.name ?? m.name ?? m.id,
            installed: pluginSettings[m.id] != null
          })).filter((x2) => !x2.installed).sort((a2, b) => a2.name.localeCompare(b.name)).map((x2) => x2.name);
          var externalList = Array.from(aggregated.values()).sort((a2, b) => a2.name.localeCompare(b.name));
          var externalEnabled = externalList.filter((e) => e.enabled).map((e) => e.name);
          var externalDisabled = externalList.filter((e) => !e.enabled).map((e) => e.name);
          var lines = [];
          lines.push(`**Plugins (${coreManifests.length}):**`);
          if (coreEnabled.length > 0) {
            lines.push(`Enabled (${coreEnabled.length}):`);
            lines.push("> " + coreEnabled.join(", "));
          }
          if (coreDisabled.length > 0) {
            lines.push(`Disabled (${coreDisabled.length}):`);
            lines.push("> " + coreDisabled.join(", "));
          }
          if (coreManifests.length === 0) {
            lines.push("_No core plugins registered._");
          }
          lines.push(`**External Plugins (${externalList.length}):**`);
          if (externalEnabled.length > 0) {
            lines.push(`Installed & Enabled (${externalEnabled.length}):`);
            lines.push("> " + externalEnabled.join(", "));
          }
          if (externalDisabled.length > 0) {
            lines.push(`Installed & Disabled (${externalDisabled.length}):`);
            lines.push("> " + externalDisabled.join(", "));
          }
          if (externalList.length === 0) {
            lines.push("_No external plugins found._");
          }
          var content = lines.join("\n");
          if (ephemeral?.value) {
            messageUtil.sendBotMessage(ctx.channel.id, content);
          } else {
            var fixNonce = (BigInt(Date.now() - 14200704e5) << 22n).toString();
            messageUtil.sendMessage(ctx.channel.id, {
              content
            }, void 0, {
              nonce: fixNonce
            });
          }
        }
      }));
    }
  });

  // src/core/commands/reload.ts
  var reload_exports = {};
  __export(reload_exports, {
    default: () => reload_default
  });
  var reload_default;
  var init_reload = __esm({
    "src/core/commands/reload.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_i18n();
      init_modules();
      reload_default = (() => ({
        name: "reload",
        description: Strings.COMMAND_RELOAD_DESC,
        options: [],
        execute() {
          BundleUpdaterManager.reload();
        }
      }));
    }
  });

  // src/lib/api/commands/index.ts
  var commands_exports = {};
  __export(commands_exports, {
    patchCommands: () => patchCommands,
    registerCommand: () => registerCommand
  });
  function patchCommands() {
    var unpatch2 = after("getBuiltInCommands", commands, ([type], res) => {
      return [
        ...res,
        ...commands2.filter((c2) => (type instanceof Array ? type.includes(c2.type) : type === c2.type) && c2.__bunny?.shouldHide?.() !== false)
      ];
    });
    [
      (init_eval(), __toCommonJS(eval_exports)),
      (init_debug2(), __toCommonJS(debug_exports2)),
      (init_plugins3(), __toCommonJS(plugins_exports2)),
      (init_reload(), __toCommonJS(reload_exports))
    ].forEach((r) => registerCommand(r.default()));
    return () => {
      commands2 = [];
      unpatch2();
    };
  }
  function registerCommand(command) {
    var builtInCommands;
    try {
      builtInCommands = commands.getBuiltInCommands(ApplicationCommandType.CHAT, true, false);
    } catch (unused) {
      builtInCommands = commands.getBuiltInCommands(Object.values(ApplicationCommandType), true, false);
    }
    builtInCommands.sort((a2, b) => parseInt(b.id) - parseInt(a2.id));
    var lastCommand = builtInCommands[builtInCommands.length - 1];
    command.id = (parseInt(lastCommand.id, 10) - 1).toString();
    command.__bunny = {
      shouldHide: command.shouldHide
    };
    command.applicationId ??= "-1";
    command.type ??= ApplicationCommandType.CHAT;
    command.inputType = ApplicationCommandInputType.BUILT_IN;
    command.displayName ??= command.name;
    command.untranslatedName ??= command.name;
    command.displayDescription ??= command.description;
    command.untranslatedDescription ??= command.description;
    if (command.options) for (var opt of command.options) {
      opt.displayName ??= opt.name;
      opt.displayDescription ??= opt.description;
    }
    instead("execute", command, (args, orig) => {
      Promise.resolve(orig.apply(command, args)).then((ret) => {
        if (ret && typeof ret === "object") {
          messageUtil.sendMessage(args[1].channel.id, ret);
        }
      }).catch((err) => {
        logger.error("Failed to execute command", err);
      });
    });
    commands2.push(command);
    return () => commands2 = commands2.filter(({ id: id2 }) => id2 !== command.id);
  }
  var commands2;
  var init_commands = __esm({
    "src/lib/api/commands/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_types();
      init_patcher();
      init_logger();
      init_common();
      commands2 = [];
    }
  });

  // src/lib/api/flux/index.ts
  var flux_exports = {};
  __export(flux_exports, {
    dispatcher: () => dispatcher,
    injectFluxInterceptor: () => injectFluxInterceptor,
    intercept: () => intercept
  });
  function injectFluxInterceptor() {
    var cb = (payload) => {
      for (var intercept2 of intercepts) {
        var res = intercept2(payload);
        if (res == null) {
          continue;
        } else if (!res) {
          payload[blockedSym] = true;
        } else if (typeof res === "object") {
          Object.assign(payload, res);
          payload[modifiedSym] = true;
        }
      }
      return blockedSym in payload;
    };
    (dispatcher._interceptors ??= []).unshift(cb);
    return () => {
      var idx = interceptIndex.get(cb);
      if (idx !== void 0) {
        intercepts.splice(idx, 1);
        interceptIndex.delete(cb);
        intercepts.forEach((intercept2, i2) => interceptIndex.set(intercept2, i2));
      }
    };
  }
  function intercept(cb) {
    var id2 = nextInterceptId++;
    interceptIndex.set(cb, id2);
    intercepts.push(cb);
    return () => {
      var idx = interceptIndex.get(cb);
      if (idx !== void 0) {
        intercepts.splice(idx, 1);
        interceptIndex.delete(cb);
        intercepts.forEach((intercept2, i2) => interceptIndex.set(intercept2, i2));
      }
    };
  }
  var blockedSym, modifiedSym, dispatcher, intercepts, interceptIndex, nextInterceptId;
  var init_flux = __esm({
    "src/lib/api/flux/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_common();
      blockedSym = /* @__PURE__ */ Symbol.for("bunny.flux.blocked");
      modifiedSym = /* @__PURE__ */ Symbol.for("bunny.flux.modified");
      dispatcher = FluxDispatcher;
      intercepts = [];
      interceptIndex = /* @__PURE__ */ new Map();
      nextInterceptId = 0;
    }
  });

  // src/lib/api/native/index.ts
  var native_exports = {};
  __export(native_exports, {
    fs: () => fs_exports
  });
  var init_native = __esm({
    "src/lib/api/native/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_fs();
    }
  });

  // src/lib/api/react/index.ts
  var react_exports = {};
  __export(react_exports, {
    jsx: () => jsx_exports
  });
  var init_react = __esm({
    "src/lib/api/react/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsx();
    }
  });

  // src/lib/api/index.ts
  var api_exports = {};
  __export(api_exports, {
    assets: () => assets_exports,
    commands: () => commands_exports,
    debug: () => debug_exports,
    flux: () => flux_exports,
    native: () => native_exports,
    patcher: () => patcher_exports,
    react: () => react_exports,
    settings: () => settings_exports,
    storage: () => storage_exports
  });
  var init_api = __esm({
    "src/lib/api/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_assets();
      init_commands();
      init_debug();
      init_flux();
      init_native();
      init_patcher();
      init_react();
      init_settings();
      init_storage2();
    }
  });

  // src/lib/addons/plugins/api.ts
  function shimDisposableFn(unpatches2, f2) {
    var dummy = (...props) => {
      var up = f2(...props);
      unpatches2.push(up);
      return up;
    };
    for (var key2 in f2) if (typeof f2[key2] === "function") {
      dummy[key2] = shimDisposableFn(unpatches2, f2[key2]);
    }
    return dummy;
  }
  function createBunnyPluginApi(id2) {
    var disposers = new Array();
    var object = {
      ...globalThis.bunny,
      api: {
        ...globalThis.bunny.api,
        patcher: {
          before: shimDisposableFn(disposers, patcher_exports.before),
          after: shimDisposableFn(disposers, patcher_exports.after),
          instead: shimDisposableFn(disposers, patcher_exports.instead)
        },
        commands: {
          ...globalThis.bunny.api.commands,
          registerCommand: shimDisposableFn(disposers, registerCommand)
        },
        flux: {
          ...globalThis.bunny.api.flux,
          intercept: shimDisposableFn(disposers, globalThis.bunny.api.flux.intercept)
        }
      },
      // Added something in here? Make sure to also update BunnyPluginProperty in ./types
      plugin: {
        createStorage: () => createStorage2(`plugins/storage/${id2}.json`),
        manifest: registeredPlugins.get(id2),
        logger
      }
    };
    return {
      object,
      disposers
    };
  }
  var init_api2 = __esm({
    "src/lib/addons/plugins/api.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_api();
      init_commands();
      init_storage2();
      init_logger();
      init_plugins4();
    }
  });

  // src/lib/addons/plugins/index.ts
  var plugins_exports3 = {};
  __export(plugins_exports3, {
    apiObjects: () => apiObjects,
    corePluginInstances: () => corePluginInstances,
    deleteRepository: () => deleteRepository,
    disablePlugin: () => disablePlugin,
    enablePlugin: () => enablePlugin,
    getBisectBatches: () => getBisectBatches,
    getPluginSettingsComponent: () => getPluginSettingsComponent,
    initPlugins: () => initPlugins,
    installPlugin: () => installPlugin,
    isCorePlugin: () => isCorePlugin,
    isGreaterVersion: () => isGreaterVersion,
    isPluginEnabled: () => isPluginEnabled,
    isPluginInstalled: () => isPluginInstalled,
    pluginInstances: () => pluginInstances,
    pluginRepositories: () => pluginRepositories,
    pluginSettings: () => pluginSettings,
    refreshPlugin: () => refreshPlugin,
    registerCorePlugins: () => registerCorePlugins,
    registerInstalledPlugins: () => registerInstalledPlugins,
    registeredPlugins: () => registeredPlugins,
    startPlugin: () => startPlugin,
    stopPlugin: () => stopPlugin,
    uninstallPlugin: () => uninstallPlugin,
    updateAllRepository: () => updateAllRepository,
    updateAndWritePlugin: () => updateAndWritePlugin,
    updatePlugins: () => updatePlugins,
    updateRepository: () => updateRepository
  });
  function registerCorePlugins() {
    try {
      var core = getCorePlugins();
      for (var id2 in core) {
        try {
          var { default: instance, preenabled } = core[id2];
          registeredPlugins.set(id2, instance.manifest);
          corePluginInstances.set(id2, instance);
          try {
            if (pluginSettings[id2] == null) {
              pluginSettings[id2] = {
                enabled: preenabled ?? true
              };
            }
          } catch (e) {
            console.error("Failed to set default pluginSettings for core plugin", id2, e);
          }
        } catch (e) {
          console.error("Failed to register core plugin", id2, e);
        }
      }
    } catch (e) {
      console.error("registerCorePlugins: unexpected error", e);
    }
  }
  function assert(condition, id2, attempt) {
    if (!condition) throw new Error(`[${id2}] Attempted to ${attempt}`);
  }
  function isGreaterVersion(v1, v2) {
    if (semver.gt(v1, v2)) return true;
    var coerced = semver.coerce(v1);
    if (coerced == null) return false;
    return semver.prerelease(v1)?.includes("dev") && semver.eq(coerced, v2);
  }
  function isExternalPlugin(manifest) {
    return "parentRepository" in manifest;
  }
  function isCorePlugin(id2) {
    return corePluginInstances.has(id2);
  }
  function getPluginSettingsComponent(id2) {
    var instance = pluginInstances.get(id2);
    if (!instance) return null;
    if (instance.SettingsComponent) return instance.SettingsComponent;
    return null;
  }
  function isPluginInstalled(id2) {
    return pluginSettings[id2] != null;
  }
  function isPluginEnabled(id2) {
    return Boolean(pluginSettings[id2]?.enabled);
  }
  function updateAndWritePlugin(repoUrl, id2, fetchScript) {
    return _async_to_generator(function* () {
      var manifestCandidates = [
        `builds/${id2}/manifest.json`,
        `${id2}/manifest.json`
      ];
      var manifest;
      var lastManifestErr = null;
      for (var candidate of manifestCandidates) {
        var url2 = new URL(candidate, repoUrl).toString();
        try {
          manifest = yield fetchJSON(repoUrl, candidate);
          break;
        } catch (e) {
          lastManifestErr = e;
        }
      }
      if (!manifest) {
        throw lastManifestErr ?? new Error(`Failed to fetch manifest for ${id2}`);
      }
      manifest.parentRepository = repoUrl;
      if (fetchScript) {
        manifest.jsPath = `plugins/scripts/${id2}.js`;
        var scriptCandidates = [
          `builds/${id2}/index.js`,
          `${id2}/index.js`
        ];
        var js;
        var lastScriptErr = null;
        for (var candidate1 of scriptCandidates) {
          var url1 = new URL(candidate1, repoUrl).toString();
          try {
            js = yield fetchJS(repoUrl, candidate1);
            break;
          } catch (e) {
            lastScriptErr = e;
          }
        }
        if (!js) {
          throw lastScriptErr ?? new Error(`Failed to fetch script for ${id2}`);
        }
        try {
          yield writeFile(manifest.jsPath, js);
        } catch (writeErr) {
          throw writeErr;
        }
      }
      try {
        yield updateStorage(`plugins/manifests/${id2}.json`, manifest);
      } catch (e) {
        throw e;
      }
      if (registeredPlugins.has(id2)) {
        var existingManifest = registeredPlugins.get(id2);
        return Object.assign(existingManifest, manifest);
      }
      return manifest;
    })();
  }
  function refreshPlugin(id2, repoUrl) {
    return _async_to_generator(function* () {
      var manifest = registeredPlugins.get(id2);
      assert(manifest, id2, "refresh a non-registered plugin");
      assert(pluginInstances.get(id2), id2, "refresh a non-started plugin");
      stopPlugin(id2);
      if (isExternalPlugin(manifest)) {
        manifest = yield updateAndWritePlugin(repoUrl ?? manifest.parentRepository, id2, true);
      }
      registeredPlugins.delete(id2);
      registeredPlugins.set(id2, manifest);
      yield startPlugin(id2);
    })();
  }
  function updateRepository(repoUrl) {
    return _async_to_generator(function* () {
      var repo;
      var storedRepo = pluginRepositories[repoUrl];
      var updated = false;
      try {
        repo = yield fetchJSON(repoUrl, "repo.json");
      } catch (repoErr) {
        try {
          var manifest = yield fetchJSON(repoUrl, "manifest.json");
          var inferredId = manifest?.id ?? manifest?.name ?? (() => {
            try {
              var u2 = new URL(repoUrl);
              var p = u2.pathname.replace(/^\/|\/$/g, "");
              return p || u2.hostname;
            } catch (unused) {
              return "local-plugin";
            }
          })();
          repo = {
            [inferredId]: manifest,
            // Keep a $meta marker to be consistent with multi-plugin repos (optional)
            $meta: {
              source: repoUrl
            }
          };
          pluginRepositories[repoUrl] = repo;
          storedRepo = pluginRepositories[repoUrl];
          updated = true;
        } catch (manifestErr) {
          throw repoErr;
        }
      }
      if (!storedRepo) {
        for (var id2 in repo) {
          if (corePluginInstances.has(id2)) {
            throw new Error(`Plugins can't have the same ID as any of Bunny core plugin '${id2}'`);
          }
        }
        updated = true;
        pluginRepositories[repoUrl] = repo;
      } else {
        for (var plugin in storedRepo) if (!repo[plugin]) {
          delete storedRepo[plugin];
        }
      }
      var pluginIds = Object.keys(repo).filter((id3) => !id3.startsWith("$"));
      yield Promise.all(pluginIds.map((pluginId) => _async_to_generator(function* () {
        if (!storedRepo || !storedRepo[pluginId] || repo[pluginId].alwaysFetch || isGreaterVersion(repo[pluginId].version, storedRepo[pluginId].version)) {
          updated = true;
          pluginRepositories[repoUrl][pluginId] = repo[pluginId];
          yield updateAndWritePlugin(repoUrl, pluginId, Boolean(storedRepo && pluginSettings[pluginId]));
        } else {
          var manifest2 = yield preloadStorageIfExists(`plugins/manifests/${pluginId}.json`);
          if (!manifest2) {
            yield updateAndWritePlugin(repoUrl, pluginId, Boolean(storedRepo && pluginSettings[pluginId]));
          }
        }
      })()));
      for (var id1 of pluginIds) {
        var manifest1 = getPreloadedStorage(`plugins/manifests/${id1}.json`);
        if (manifest1 === void 0) continue;
        var existing = registeredPlugins.get(id1);
        if (existing && !isGreaterVersion(manifest1.version, existing.version)) {
          continue;
        }
        registeredPlugins.set(id1, manifest1);
      }
      return updated;
    })();
  }
  function deleteRepository(repoUrl) {
    return _async_to_generator(function* () {
      assert(repoUrl !== OFFICIAL_PLUGINS_REPO_URL, repoUrl, "delete the official repository");
      assert(pluginRepositories[repoUrl], repoUrl, "delete a non-registered repository");
      var promQueues = [];
      for (var [id2, manifest] of registeredPlugins) {
        if (!isExternalPlugin(manifest) || manifest.parentRepository !== repoUrl) continue;
        if (isPluginInstalled(id2)) {
          promQueues.push(uninstallPlugin(id2));
        }
        promQueues.push(purgeStorage2(`plugins/manifests/${id2}.json`));
        registeredPlugins.delete(id2);
      }
      delete pluginRepositories[repoUrl];
      yield Promise.all(promQueues);
      updateAllRepository();
    })();
  }
  function enablePlugin(id2, start2) {
    return _async_to_generator(function* () {
      assert(isPluginInstalled(id2), id2, "enable a non-installed plugin");
      if (start2) yield startPlugin(id2);
      pluginSettings[id2].enabled = true;
    })();
  }
  function disablePlugin(id2) {
    assert(isPluginInstalled(id2), id2, "disable a non-installed plugin");
    pluginInstances.has(id2) && stopPlugin(id2);
    pluginSettings[id2].enabled = false;
  }
  function installPlugin(id2, start2) {
    return _async_to_generator(function* () {
      var manifest = registeredPlugins.get(id2);
      assert(manifest, id2, "install an non-registered plugin");
      assert(!isPluginInstalled(id2), id2, "install an already installed plugin");
      assert(isExternalPlugin(manifest), id2, "install a core plugin");
      yield updateAndWritePlugin(manifest.parentRepository, id2, true);
      pluginSettings[id2] = {
        enabled: true
      };
      if (start2) startPlugin(id2);
    })();
  }
  function uninstallPlugin(id2) {
    return _async_to_generator(function* () {
      var manifest = registeredPlugins.get(id2);
      assert(manifest, id2, "uninstall an unregistered plugin");
      assert(isPluginInstalled(id2), id2, "uninstall a non-installed plugin");
      assert(isExternalPlugin(manifest), id2, "uninstall a core plugin");
      pluginInstances.has(id2) && stopPlugin(id2);
      delete pluginSettings[id2];
      yield purgeStorage2(`plugins/storage/${id2}.json`);
      yield removeFile(`plugins/scripts/${id2}.js`);
    })();
  }
  function startPlugin(_0) {
    return _async_to_generator(function* (id2, { throwIfDisabled = false, disableWhenThrown = true } = {}) {
      var manifest = registeredPlugins.get(id2);
      assert(manifest, id2, "start a non-registered plugin");
      assert(isPluginInstalled(id2), id2, "start a non-installed plugin");
      assert(!throwIfDisabled || pluginSettings[id2]?.enabled, id2, "start a disabled plugin");
      assert(!pluginInstances.has(id2), id2, "start an already started plugin");
      yield preloadStorageIfExists(`plugins/storage/${id2}.json`);
      var pluginInstance2;
      var instantiator;
      if (isExternalPlugin(manifest)) {
        try {
          var iife = yield readFile(manifest.jsPath);
          try {
            globalThis.__SHIGGY_CURRENT_PLUGIN = id2;
          } catch (unused) {
          }
          if (!iife || iife.length === 0) throw new Error("Plugin script is empty");
          if (iife.length > 10 * 1024 * 1024) throw new Error("Plugin script exceeds 10MB limit");
          var suspiciousPatterns = [
            /__SENTRY__/g,
            /XMLHttpRequest\.prototype\.send/
          ];
          for (var pat of suspiciousPatterns) {
            pat.lastIndex = 0;
            if (pat.test(iife)) throw new Error("Plugin script contains blocked patterns");
          }
          instantiator = globalEvalWithSourceUrl(`(bunny,definePlugin)=>{${iife};return plugin?.default ?? plugin;}`, `bunny-plugin/${id2}-${manifest.version}`);
        } catch (error) {
          var e = new Error("An error occured while parsing plugin's code, possibly a syntax error?", {
            cause: error
          });
          e.pluginId = id2;
          throw e;
        } finally {
          try {
            globalThis.__SHIGGY_CURRENT_PLUGIN = null;
          } catch (unused) {
          }
        }
        try {
          try {
            globalThis.__SHIGGY_CURRENT_PLUGIN = id2;
          } catch (unused) {
          }
          var api = createBunnyPluginApi(id2);
          try {
            pluginInstance2 = instantiator(api.object, (p) => {
              return Object.assign(p, {
                manifest
              });
            });
          } catch (innerError) {
            var e1 = new Error("An error occured while instantiating plugin's code");
            e1.cause = innerError;
            e1.pluginId = id2;
            throw e1;
          }
          if (!pluginInstance2) {
            var e2 = new Error(`Plugin '${id2}' does not export a valid plugin instance`);
            e2.pluginId = id2;
            throw e2;
          }
          apiObjects.set(id2, api);
          pluginInstances.set(id2, pluginInstance2);
        } catch (error) {
          if (!error.pluginId) error.pluginId = id2;
          throw error;
        } finally {
          try {
            globalThis.__SHIGGY_CURRENT_PLUGIN = null;
          } catch (unused) {
          }
        }
      } else {
        pluginInstance2 = corePluginInstances.get(id2);
        assert(pluginInstance2, id2, "start a non-existent core plugin");
        pluginInstances.set(id2, pluginInstance2);
      }
      try {
        pluginInstance2.start?.();
        pluginSettings[id2].enabled = true;
      } catch (error) {
        disableWhenThrown && disablePlugin(id2);
        throw new Error("An error occured while starting the plugin", {
          cause: error
        });
      }
    }).apply(this, arguments);
  }
  function stopPlugin(id2) {
    var instance = pluginInstances.get(id2);
    assert(instance, id2, "stop a non-started plugin");
    instance.stop?.();
    var obj = apiObjects.get(id2);
    obj?.disposers.forEach((d2) => d2());
    pluginInstances.delete(id2);
  }
  function getBisectBatches(maxPerStep = 50) {
    var enabled = [];
    for (var [id2, manifest] of registeredPlugins) {
      try {
        var isExternal = manifest.parentRepository != null;
        var enabledFlag = Boolean(pluginSettings[id2]?.enabled);
        if (!isExternal) continue;
        if (!enabledFlag) continue;
        enabled.push(id2);
      } catch (unused) {
      }
    }
    var ids = enabled.slice(0, maxPerStep);
    if (ids.length <= 1) return ids.length === 1 ? [
      [
        ids[0]
      ]
    ] : [];
    var batches = [];
    var candidates = ids.slice();
    while (candidates.length > 1) {
      var half = Math.ceil(candidates.length / 2);
      var toDisable = candidates.slice(0, half);
      batches.push(toDisable);
      candidates = candidates.slice(half);
      if (candidates.length === 1) {
        batches.push([
          candidates[0]
        ]);
        break;
      }
    }
    return batches;
  }
  function updateAllRepository() {
    return _async_to_generator(function* () {
      try {
        yield updateRepository(OFFICIAL_PLUGINS_REPO_URL);
      } catch (error) {
        console.error("Failed to update official plugins repository", error);
      }
      var fetchOnStart = !!(updaterSettings.fetchPluginsOnStart ?? true);
      var overrides = updaterSettings.repoAutoFetchOverrides ?? {};
      var repos = Object.keys(pluginRepositories);
      yield allSettled(repos.map((repo) => _async_to_generator(function* () {
        if (repo === OFFICIAL_PLUGINS_REPO_URL) return;
        var repoOverride = overrides[repo];
        if (!fetchOnStart && repoOverride !== true) return;
        try {
          yield updateRepository(repo);
        } catch (e) {
          console.error(`Failed to update repository ${repo}`, e);
        }
      })()));
    })();
  }
  function updatePlugins() {
    return _async_to_generator(function* () {
      yield awaitStorage2(pluginRepositories, pluginSettings);
      var corePlugins = getCorePlugins();
      for (var id2 in corePlugins) {
        var { default: instance, preenabled } = corePlugins[id2];
        pluginSettings[id2] ??= {
          enabled: preenabled ?? true
        };
        registeredPlugins.set(id2, instance.manifest);
        corePluginInstances.set(id2, instance);
      }
      try {
        yield updateRepository(OFFICIAL_PLUGINS_REPO_URL);
      } catch (error) {
        console.error("Failed to update official plugins repository", error);
      }
      var fetchOnStart = !!(updaterSettings.fetchPluginsOnStart ?? true);
      var overrides = updaterSettings.repoAutoFetchOverrides ?? {};
      if (fetchOnStart) {
        yield updateAllRepository();
      } else {
        var repos = Object.keys(pluginRepositories).filter((r) => r !== OFFICIAL_PLUGINS_REPO_URL && overrides[r] === true);
        yield allSettled(repos.map((repo) => _async_to_generator(function* () {
          try {
            yield updateRepository(repo);
          } catch (e) {
            console.error(`Failed to update repository ${repo}`, e);
          }
        })()));
      }
      var enabledIds = [
        ...registeredPlugins.keys()
      ].filter((id3) => isPluginEnabled(id3) && !pluginInstances.has(id3));
      yield allSettled(enabledIds.map((id3) => _async_to_generator(function* () {
        try {
          yield startPlugin(id3).catch((e) => {
            console.error(`Failed to start plugin ${id3}:`, e);
          });
        } catch (error) {
          console.error(`Unexpected error while starting plugin ${id3}:`, error);
        }
      })()));
    })();
  }
  function registerInstalledPlugins() {
    return _async_to_generator(function* () {
      yield awaitStorage2(pluginRepositories, pluginSettings);
      var ids = Object.keys(pluginSettings ?? {});
      if (ids.length === 0) return;
      var results = yield allSettled(ids.map((id2) => _async_to_generator(function* () {
        if (registeredPlugins.has(id2) || isCorePlugin(id2)) return;
        var loaded = yield preloadStorageIfExists(`plugins/manifests/${id2}.json`);
        if (loaded) {
          var manifest = getPreloadedStorage(`plugins/manifests/${id2}.json`);
          if (manifest) {
            registeredPlugins.set(id2, manifest);
          }
        }
      })()));
    })();
  }
  function initPlugins() {
    return _async_to_generator(function* () {
      try {
        registerCorePlugins();
      } catch (unused) {
      }
      yield awaitStorage2(pluginRepositories, pluginSettings);
      yield registerInstalledPlugins();
      var enabledIds = [
        ...registeredPlugins.keys()
      ].filter((id2) => isPluginEnabled(id2));
      if (enabledIds.length === 0) return;
      yield allSettled(enabledIds.map((id2) => _async_to_generator(function* () {
        try {
          if (!isPluginEnabled(id2) || pluginInstances.has(id2)) return;
          yield startPlugin(id2).catch((e) => {
            console.error(`Failed to start plugin ${id2}:`, e);
          });
        } catch (error) {
          console.error(`Unexpected error while starting plugin ${id2}:`, error);
        }
      })()));
    })();
  }
  var corePluginInstances, registeredPlugins, pluginInstances, apiObjects, pluginRepositories, pluginSettings, _fetch, fetchJS, fetchJSON;
  var init_plugins4 = __esm({
    "src/lib/addons/plugins/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_plugins2();
      init_fs();
      init_storage2();
      init_utils();
      init_constants();
      init_common();
      init_settings();
      init_api2();
      corePluginInstances = /* @__PURE__ */ new Map();
      registeredPlugins = /* @__PURE__ */ new Map();
      pluginInstances = /* @__PURE__ */ new Map();
      apiObjects = /* @__PURE__ */ new Map();
      pluginRepositories = createStorage2("plugins/repositories.json");
      pluginSettings = createStorage2("plugins/settings.json");
      _fetch = (repoUrl, path) => {
        try {
          var u2 = new URL(path, repoUrl);
          u2.searchParams.set("_", String(Date.now()));
          return safeFetch(u2, {
            cache: "no-store"
          });
        } catch (e) {
          return safeFetch(new URL(path, repoUrl), {
            cache: "no-store"
          });
        }
      };
      fetchJS = (repoUrl, path) => _fetch(repoUrl, path).then((r) => r.text());
      fetchJSON = (repoUrl, path) => _fetch(repoUrl, path).then((r) => r.json());
    }
  });

  // src/metro/common/stores.ts
  var UserStore;
  var init_stores = __esm({
    "src/metro/common/stores.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_wrappers();
      UserStore = findByStoreNameLazy("UserStore");
    }
  });

  // src/core/ui/settings/pages/Plugins/sheets/TitleComponent.tsx
  function TitleComponent({ plugin }) {
    var users = FluxUtils.useStateFromStoresArray([
      UserStore
    ], () => {
      plugin.authors?.forEach((a2) => a2.id && maybeFetchUser(a2.id));
      return plugin.authors?.map((a2) => UserStore.getUser(a2.id));
    });
    var { authors } = plugin;
    var authorsTextNode = /* @__PURE__ */ jsx(Text, {
      variant: "text-md/medium",
      style: {
        flexWrap: "wrap"
      },
      children: (authors ?? []).map((author, idx) => /* @__PURE__ */ jsxs(import_react8.default.Fragment, {
        children: [
          /* @__PURE__ */ jsx(Text, {
            variant: "text-md/medium",
            onPress: author.id ? () => showUserProfileActionSheet({
              userId: author.id
            }) : void 0,
            children: author.name
          }),
          idx < (authors?.length ?? 0) - 1 ? ", " : ""
        ]
      }, author.id ?? author.name))
    });
    return /* @__PURE__ */ jsxs(import_react_native23.View, {
      style: {
        gap: 4
      },
      children: [
        /* @__PURE__ */ jsx(import_react_native23.View, {
          children: /* @__PURE__ */ jsx(Text, {
            variant: "heading-xl/semibold",
            children: plugin.name
          })
        }),
        /* @__PURE__ */ jsx(import_react_native23.View, {
          style: {
            flexDirection: "row",
            flexShrink: 1
          },
          children: authors?.length && /* @__PURE__ */ jsxs(import_react_native23.View, {
            style: {
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              paddingVertical: 4,
              paddingHorizontal: 8,
              backgroundColor: "#00000016",
              borderRadius: 32
            },
            children: [
              users.length && /* @__PURE__ */ jsx(AvatarPile, {
                size: "xxsmall",
                names: plugin.authors?.map((a2) => a2.name),
                totalCount: plugin.authors?.length,
                children: users.map((a2) => /* @__PURE__ */ jsx(Avatar, {
                  size: "xxsmall",
                  user: a2
                }))
              }),
              /* @__PURE__ */ jsx(import_react_native23.View, {
                style: {
                  flexDirection: "row",
                  alignItems: "center",
                  flexWrap: "wrap"
                },
                children: authorsTextNode
              })
            ]
          })
        })
      ]
    });
  }
  var import_react8, import_react_native23, showUserProfileActionSheet, maybeFetchUser;
  var init_TitleComponent = __esm({
    "src/core/ui/settings/pages/Plugins/sheets/TitleComponent.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      import_react8 = __toESM(require_react());
      init_lazy();
      init_metro();
      init_common();
      init_components();
      init_stores();
      import_react_native23 = __toESM(require_react_native());
      showUserProfileActionSheet = findByNameLazy("showUserProfileActionSheet");
      ({ getUser: maybeFetchUser } = lazyDestructure(() => findByProps("getUser", "fetchProfile")));
    }
  });

  // src/core/ui/settings/pages/Plugins/sheets/PluginInfoActionSheet.tsx
  var PluginInfoActionSheet_exports = {};
  __export(PluginInfoActionSheet_exports, {
    default: () => PluginInfoActionSheet
  });
  function PluginInfoIconButton(props) {
    var { onPress } = props;
    props.onPress &&= () => {
      hideSheet("PluginInfoActionSheet");
      onPress?.();
    };
    return /* @__PURE__ */ jsx(IconButton, {
      ...props
    });
  }
  function PluginInfoActionSheet({ plugin, navigation: navigation2 }) {
    plugin.usePluginState();
    var [loading, setLoading] = (0, import_react9.useState)(false);
    var isVendettaPlugin = plugin.id.includes("/");
    var isCorePlugin2 = plugin.id.startsWith("bunny.") || plugin.id.startsWith("vendetta.");
    var copyPluginUrl = () => {
      var url2 = plugin.id;
      if (isVendettaPlugin) {
        url2 = plugin.id;
      } else {
        try {
          var pluginAny = plugin;
          var repoUrl = pluginAny._manifest?.parentRepository || pluginAny.manifest?.parentRepository;
          url2 = repoUrl ? `${repoUrl}/builds/${plugin.id}` : plugin.id;
        } catch (e) {
          url2 = plugin.id;
        }
      }
      clipboard.setString(url2);
      if (typeof showToast?.showCopyToClipboard === "function") {
        showToast.showCopyToClipboard();
      } else {
        showToast("Copied to clipboard");
      }
    };
    var refetchPlugin = () => _async_to_generator(function* () {
      setLoading(true);
      try {
        if (isVendettaPlugin) {
          var vdPlugin = VdPluginManager.plugins[plugin.id];
          if (vdPlugin.enabled) VdPluginManager.stopPlugin(plugin.id, false);
          yield VdPluginManager.fetchPlugin(plugin.id);
          if (vdPlugin.enabled) yield VdPluginManager.startPlugin(plugin.id);
          showToast("Plugin refreshed successfully");
        } else {
          refreshPlugin(plugin.id);
          showToast("Plugin refreshed successfully");
        }
      } catch (e) {
        console.error("Failed to refresh plugin:", e);
        showToast("Failed to refresh plugin");
      } finally {
        setLoading(false);
      }
    })();
    var clearPluginData = () => {
      showConfirmationAlert({
        title: "Clear Data",
        content: "Are you sure you want to clear all data for this plugin? This action cannot be undone.",
        confirmText: "Clear",
        confirmColor: "red",
        cancelText: "Cancel",
        onConfirm: () => _async_to_generator(function* () {
          hideSheet("PluginInfoActionSheet");
          try {
            if (isVendettaPlugin) {
              var vdPlugin = VdPluginManager.plugins[plugin.id];
              if (vdPlugin.enabled) VdPluginManager.stopPlugin(plugin.id, false);
              yield purgeStorage(plugin.id);
              if (vdPlugin.enabled) yield VdPluginManager.startPlugin(plugin.id);
            } else {
              yield purgeStorage2(`plugins/storage/${plugin.id}.json`);
            }
            showToast("Plugin data cleared successfully");
          } catch (e) {
            console.error("Failed to clear plugin data:", e);
            showToast("Failed to clear plugin data");
          }
        })()
      });
    };
    var uninstallPluginHandler = () => {
      if (isCorePlugin2) {
        showToast("Core plugins cannot be uninstalled");
        return;
      }
      showConfirmationAlert({
        title: "Uninstall Plugin",
        content: "Are you sure you want to uninstall this plugin? This action cannot be undone.",
        confirmText: "Uninstall",
        confirmColor: "red",
        cancelText: "Cancel",
        onConfirm: () => _async_to_generator(function* () {
          hideSheet("PluginInfoActionSheet");
          try {
            if (isVendettaPlugin) {
              yield VdPluginManager.removePlugin(plugin.id);
            } else {
              yield uninstallPlugin(plugin.id);
            }
            showToast("Plugin uninstalled successfully");
          } catch (e) {
            console.error("Failed to uninstall plugin:", e);
            showToast(`Failed to uninstall plugin: ${e instanceof Error ? e.message : String(e)}`);
          }
        })()
      });
    };
    return /* @__PURE__ */ jsx(ActionSheet, {
      children: /* @__PURE__ */ jsxs(import_react_native24.ScrollView, {
        contentContainerStyle: {
          gap: 12,
          marginBottom: 12
        },
        children: [
          /* @__PURE__ */ jsx(import_react_native24.View, {
            style: {
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingVertical: 24,
              justifyContent: "space-between",
              width: "100%"
            },
            children: /* @__PURE__ */ jsx(TitleComponent, {
              plugin
            })
          }),
          /* @__PURE__ */ jsxs(import_react_native24.View, {
            style: {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              paddingHorizontal: 4
            },
            children: [
              /* @__PURE__ */ jsx(PluginInfoIconButton, {
                label: "Configure",
                variant: "secondary",
                disabled: !plugin.getPluginSettingsComponent(),
                icon: findAssetId("SettingsIcon"),
                onPress: () => {
                  navigation2.push("SHIGGYCORD_CUSTOM_PAGE", {
                    title: plugin.name,
                    render: plugin.getPluginSettingsComponent()
                  });
                }
              }),
              /* @__PURE__ */ jsx(PluginInfoIconButton, {
                label: "Refetch",
                variant: "secondary",
                icon: findAssetId("RetryIcon"),
                onPress: refetchPlugin,
                disabled: loading
              }),
              /* @__PURE__ */ jsx(PluginInfoIconButton, {
                label: "Copy URL",
                variant: "secondary",
                icon: findAssetId("LinkIcon"),
                onPress: copyPluginUrl
              }),
              /* @__PURE__ */ jsx(PluginInfoIconButton, {
                label: "Clear Data",
                variant: "secondary",
                icon: findAssetId("FileIcon"),
                onPress: clearPluginData
              }),
              !isCorePlugin2 && /* @__PURE__ */ jsx(PluginInfoIconButton, {
                label: "Uninstall",
                variant: "secondary",
                icon: findAssetId("TrashIcon"),
                onPress: uninstallPluginHandler
              })
            ]
          }),
          /* @__PURE__ */ jsxs(Card, {
            children: [
              /* @__PURE__ */ jsx(Text, {
                variant: "text-md/semibold",
                style: {
                  marginBottom: 4,
                  color: "text-strong"
                },
                children: "Description"
              }),
              /* @__PURE__ */ jsx(Text, {
                variant: "text-md/medium",
                children: plugin.description
              })
            ]
          })
        ]
      })
    });
  }
  var import_react9, import_react_native24;
  var init_PluginInfoActionSheet = __esm({
    "src/core/ui/settings/pages/Plugins/sheets/PluginInfoActionSheet.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_jsxRuntime();
      init_plugins4();
      init_assets();
      init_storage2();
      init_sheets();
      init_components();
      init_common();
      import_react9 = __toESM(require_react());
      import_react_native24 = __toESM(require_react_native());
      init_toasts();
      init_alerts2();
      init_plugins();
      init_storage();
      init_TitleComponent();
    }
  });

  // src/core/ui/settings/pages/Plugins/models/bunny.ts
  function unifyBunnyPlugin(manifest) {
    return {
      id: manifest.id,
      name: manifest.display.name,
      description: manifest.display.description,
      authors: manifest.display.authors,
      getBadges() {
        return [];
      },
      isEnabled: () => isPluginEnabled(manifest.id),
      isInstalled: () => manifest.id in pluginSettings,
      usePluginState() {
        useObservable([
          pluginSettings
        ]);
      },
      toggle(start2) {
        try {
          start2 ? enablePlugin(manifest.id, true) : disablePlugin(manifest.id);
        } catch (e) {
          console.error(e);
        }
      },
      resolveSheetComponent() {
        return Promise.resolve().then(() => (init_PluginInfoActionSheet(), PluginInfoActionSheet_exports));
      },
      getPluginSettingsComponent() {
        return getPluginSettingsComponent(manifest.id);
      }
    };
  }
  var init_bunny = __esm({
    "src/core/ui/settings/pages/Plugins/models/bunny.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_plugins4();
      init_storage2();
    }
  });

  // src/core/ui/settings/pages/Plugins/models/vendetta.ts
  function unifyVdPlugin(vdPlugin) {
    return {
      id: vdPlugin.id,
      name: vdPlugin.manifest.name,
      description: vdPlugin.manifest.description,
      authors: vdPlugin.manifest.authors,
      icon: vdPlugin.manifest.vendetta?.icon,
      getBadges() {
        return [];
      },
      isEnabled: () => vdPlugin.enabled,
      isInstalled: () => Boolean(vdPlugin && VdPluginManager.plugins[vdPlugin.id]),
      usePluginState() {
        var dummyProxy = createProxy({}).proxy;
        useProxy(VdPluginManager.plugins[vdPlugin.id] ?? dummyProxy);
      },
      toggle(start2) {
        start2 ? VdPluginManager.startPlugin(vdPlugin.id) : VdPluginManager.stopPlugin(vdPlugin.id);
      },
      resolveSheetComponent() {
        return Promise.resolve().then(() => (init_PluginInfoActionSheet(), PluginInfoActionSheet_exports));
      },
      getPluginSettingsComponent() {
        return VdPluginManager.getSettings(vdPlugin.id);
      }
    };
  }
  var init_vendetta = __esm({
    "src/core/ui/settings/pages/Plugins/models/vendetta.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_plugins();
      init_storage();
    }
  });

  // src/core/ui/settings/pages/Plugins/index.tsx
  var Plugins_exports = {};
  __export(Plugins_exports, {
    default: () => Plugins
  });
  function normalizeIdFromInstallUrl(url2) {
    return url2.endsWith("/") ? url2 : url2 + "/";
  }
  function InstallButton({ addon, installing, setInstalling, setRefreshTick }) {
    var pluginId = normalizeIdFromInstallUrl(addon.installUrl);
    var plugin = VdPluginManager.plugins[pluginId];
    var installed = !!plugin;
    var isInstalling = installing.has(pluginId);
    var isQuickInstall = pluginId.toLowerCase().includes("quickinstall");
    var [, forceUpdate] = useReducer((x2) => x2 + 1, 0);
    var [rotation, setRotation] = React2.useState(0);
    var [pulse, setPulse] = React2.useState(1);
    var continueInstallation = () => {
      performInstall();
    };
    var handleInstall = () => _async_to_generator(function* () {
      if (isInstalling) return;
      if (addon.status === "broken" || addon.status === "warning") {
        var isBroken = addon.status === "broken";
        openAlert2("bunny-plugin-status-warning", /* @__PURE__ */ jsx(AlertModalComponent, {
          title: isBroken ? "Plugin is Broken" : "Plugin Warning",
          content: isBroken ? "This plugin is marked as broken and may not work properly or could cause issues. Do you still want to install it?" : "This plugin has warnings and might have issues. Do you want to continue with the installation?",
          extraContent: addon.warningMessage ? /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsx(Text, {
              variant: "text-md/normal",
              children: addon.warningMessage
            })
          }) : null,
          actions: /* @__PURE__ */ jsxs(AlertActionsComponent, {
            children: [
              /* @__PURE__ */ jsx(AlertActionButton3, {
                text: "Install Anyway",
                variant: isBroken ? "destructive" : "primary",
                onPress: continueInstallation
              }),
              /* @__PURE__ */ jsx(AlertActionButton3, {
                text: "Cancel",
                variant: "secondary"
              })
            ]
          })
        }));
        return;
      }
      continueInstallation();
    })();
    var performInstall = () => _async_to_generator(function* () {
      setInstalling((prev) => /* @__PURE__ */ new Set([
        ...prev,
        pluginId
      ]));
      var animationInterval = setInterval(() => {
        setRotation((prev) => (prev + 15) % 360);
        setPulse((prev) => 0.8 + 0.2 * Math.sin(Date.now() / 200));
        forceUpdate();
      }, 100);
      try {
        yield VdPluginManager.installPlugin(addon.installUrl);
        setRefreshTick((prev) => prev + 1);
        showSheet("PluginInstalledSheet", () => /* @__PURE__ */ jsxs(ActionSheet, {
          children: [
            /* @__PURE__ */ jsx(BottomSheetTitleHeader, {
              title: "Plugin Installed"
            }),
            /* @__PURE__ */ jsxs(import_react_native25.View, {
              style: {
                padding: 16,
                alignItems: "center",
                gap: 12
              },
              children: [
                /* @__PURE__ */ jsx(import_react_native25.View, {
                  style: {
                    backgroundColor: "rgba(67, 181, 129, 0.1)",
                    borderRadius: 50,
                    padding: 16
                  },
                  children: /* @__PURE__ */ jsx(import_react_native25.Image, {
                    source: findAssetId("CheckmarkCircle"),
                    style: {
                      width: 32,
                      height: 32,
                      tintColor: "#43b581"
                    }
                  })
                }),
                /* @__PURE__ */ jsxs(Text, {
                  variant: "heading-md/bold",
                  children: [
                    addon.name,
                    " installed successfully!"
                  ]
                }),
                /* @__PURE__ */ jsx(Text, {
                  variant: "text-md/medium",
                  color: "text-muted",
                  style: {
                    textAlign: "center"
                  },
                  children: "The plugin has been added to your plugins list."
                }),
                /* @__PURE__ */ jsx(Button, {
                  size: "lg",
                  text: "Close",
                  variant: "primary",
                  style: {
                    width: "100%"
                  },
                  onPress: () => hideActionSheet2()
                })
              ]
            })
          ]
        }));
      } catch (e) {
        openAlert2("bunny-plugin-install-failed", /* @__PURE__ */ jsx(AlertModalComponent, {
          title: "Installation Failed",
          content: "Failed to install plugin",
          extraContent: /* @__PURE__ */ jsxs(Stack, {
            spacing: 16,
            style: {
              width: "100%"
            },
            children: [
              /* @__PURE__ */ jsx(import_react_native25.View, {
                style: {
                  alignItems: "center",
                  marginTop: 8
                },
                children: /* @__PURE__ */ jsx(import_react_native25.View, {
                  style: {
                    backgroundColor: "rgba(240, 71, 71, 0.1)",
                    borderRadius: 50,
                    padding: 16,
                    marginBottom: 12
                  },
                  children: /* @__PURE__ */ jsx(import_react_native25.Image, {
                    source: findAssetId("ErrorCircle"),
                    style: {
                      width: 32,
                      height: 32,
                      tintColor: "#f04747"
                    }
                  })
                })
              }),
              /* @__PURE__ */ jsx(Card, {
                style: {
                  backgroundColor: "rgba(0,0,0,0.05)",
                  padding: 12,
                  borderRadius: 8
                },
                children: /* @__PURE__ */ jsx(Text, {
                  variant: "text-md/semibold",
                  color: "text-danger",
                  children: e instanceof Error ? e.message : String(e)
                })
              })
            ]
          }),
          actions: /* @__PURE__ */ jsxs(import_react_native25.View, {
            style: {
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8
            },
            children: [
              /* @__PURE__ */ jsx(AlertActionButton3, {
                text: "Cancel",
                variant: "secondary",
                style: {
                  flex: 1
                }
              }),
              /* @__PURE__ */ jsx(AlertActionButton3, {
                text: "Try Again",
                icon: findAssetId("RetryIcon"),
                variant: "primary",
                style: {
                  flex: 1
                },
                onPress: () => {
                  dismissAlert2("bunny-plugin-install-failed");
                  setTimeout(performInstall, 500);
                }
              })
            ]
          })
        }));
      } finally {
        clearInterval(animationInterval);
        setRotation(0);
        setPulse(1);
        setInstalling((prev) => {
          var newSet = new Set(prev);
          newSet.delete(pluginId);
          return newSet;
        });
      }
    })();
    var handleUninstall = () => {
      VdPluginManager.removePlugin(pluginId);
      setRefreshTick((prev) => prev + 1);
    };
    if (installed) {
      return /* @__PURE__ */ jsx(Button, {
        size: "sm",
        text: "Uninstall",
        variant: "destructive",
        icon: findAssetId("TrashIcon"),
        onPress: handleUninstall,
        disabled: isQuickInstall,
        style: {
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1
        }
      });
    }
    return /* @__PURE__ */ jsx(import_react_native25.View, {
      style: {
        opacity: pulse
      },
      children: /* @__PURE__ */ jsx(Button, {
        size: "sm",
        text: isInstalling ? "Installing..." : "Install",
        variant: "primary",
        disabled: isInstalling,
        loading: isInstalling,
        style: {
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1
        },
        icon: isInstalling ? /* @__PURE__ */ jsx(import_react_native25.View, {
          style: {
            transform: [
              {
                rotate: `${rotation}deg`
              }
            ]
          },
          children: /* @__PURE__ */ jsx(import_react_native25.Image, {
            source: findAssetId("RetryIcon"),
            style: {
              width: 16,
              height: 16
            }
          })
        }) : findAssetId("DownloadIcon"),
        onPress: handleInstall
      })
    });
  }
  function TrailingButtons({ addon, installing, setInstalling, setRefreshTick }) {
    return /* @__PURE__ */ jsxs(import_react_native25.View, {
      style: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
      },
      children: [
        /* @__PURE__ */ jsx(IconButton, {
          size: "sm",
          variant: "secondary",
          icon: findAssetId("MoreHorizontalIcon"),
          onPress: () => {
            showSimpleActionSheet3({
              key: "AddonShareSheet",
              header: {
                title: "Share Plugin"
              },
              options: [
                {
                  label: "Copy Install URL",
                  onPress: () => {
                    clipboard.setString(addon.installUrl);
                  }
                },
                {
                  label: "Copy Source URL",
                  onPress: () => {
                    if (addon.sourceUrl) {
                      clipboard.setString(addon.sourceUrl);
                    }
                  }
                }
              ]
            });
          }
        }),
        /* @__PURE__ */ jsx(InstallButton, {
          addon,
          installing,
          setInstalling,
          setRefreshTick
        })
      ]
    });
  }
  function BrowseAddonCard({ addon, installing, setInstalling, setRefreshTick }) {
    var { name, description, authors, status, warningMessage } = addon;
    var statusColor = "text-normal";
    if (status === "working") statusColor = "#4ADE80";
    if (status === "broken") statusColor = "#EF4444";
    if (status === "warning") statusColor = "#F59E0B";
    return /* @__PURE__ */ jsx(Card, {
      children: /* @__PURE__ */ jsxs(Stack, {
        spacing: 16,
        children: [
          /* @__PURE__ */ jsxs(import_react_native25.View, {
            style: {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxs(import_react_native25.View, {
                style: {
                  flexShrink: 1
                },
                children: [
                  /* @__PURE__ */ jsx(Text, {
                    numberOfLines: 1,
                    variant: "heading-lg/semibold",
                    children: name
                  }),
                  /* @__PURE__ */ jsxs(Text, {
                    variant: "text-md/semibold",
                    color: "text-muted",
                    children: [
                      "by ",
                      authors?.join(", ") || "Unknown"
                    ]
                  }),
                  /* @__PURE__ */ jsxs(Text, {
                    variant: "text-md/semibold",
                    style: {
                      color: statusColor
                    },
                    children: [
                      "Status: ",
                      status
                    ]
                  })
                ]
              }),
              /* @__PURE__ */ jsx(import_react_native25.View, {
                children: /* @__PURE__ */ jsx(TrailingButtons, {
                  addon,
                  installing,
                  setInstalling,
                  setRefreshTick
                })
              })
            ]
          }),
          /* @__PURE__ */ jsx(Text, {
            variant: "text-md/medium",
            children: description
          }),
          warningMessage && /* @__PURE__ */ jsxs(Text, {
            variant: "text-sm/medium",
            color: "text-muted",
            children: [
              "Warning: ",
              warningMessage
            ]
          })
        ]
      })
    });
  }
  function InstalledPluginPage(props) {
    var items = props.useItems();
    return /* @__PURE__ */ jsx(AddonPage, {
      CardComponent: PluginCard,
      title: Strings.PLUGINS,
      searchKeywords: [
        "name",
        "description",
        (p) => p.authors?.map((a2) => typeof a2 === "string" ? a2 : a2.name).join() || ""
      ],
      sortOptions: {
        "Enabled First": (a2, b) => Number(b.isEnabled()) - Number(a2.isEnabled()),
        "Disabled First": (a2, b) => Number(a2.isEnabled()) - Number(b.isEnabled()),
        "Date (Newest)": (a2, b) => {
          var vdOrder = Object.keys(VdPluginManager.plugins || {});
          var bnOrder = Object.keys(pluginSettings || {});
          var idx = (id2) => {
            var vdI = vdOrder.indexOf(id2);
            var bnI = bnOrder.indexOf(id2);
            return Math.max(vdI, bnI);
          };
          return idx(b.id) - idx(a2.id);
        },
        "Date (Oldest)": (a2, b) => {
          var vdOrder = Object.keys(VdPluginManager.plugins || {});
          var bnOrder = Object.keys(pluginSettings || {});
          var idx = (id2) => {
            var vdI = vdOrder.indexOf(id2);
            var bnI = bnOrder.indexOf(id2);
            return Math.max(vdI, bnI);
          };
          return idx(a2.id) - idx(b.id);
        },
        "Name (A-Z)": (a2, b) => a2.name.localeCompare(b.name),
        "Name (Z-A)": (a2, b) => b.name.localeCompare(a2.name)
      },
      safeModeHint: {
        message: Strings.SAFE_MODE_NOTICE_PLUGINS
      },
      items,
      ...props
    });
  }
  function BrowsePluginPage(props) {
    var indexMap = /* @__PURE__ */ new Map();
    (props.plugins || []).forEach((p, i2) => indexMap.set(normalizeIdFromInstallUrl(p.installUrl), i2));
    var findBunnyIdForAddon = (addon) => {
      for (var [id2, manifest] of registeredPlugins) {
        if (!manifest) continue;
        var name = manifest.display?.name ?? id2;
        if (name === addon.name) return id2;
      }
      return null;
    };
    var isEnabledForAddon = (addon) => {
      var vendettaId = normalizeIdFromInstallUrl(addon.installUrl);
      var vd = VdPluginManager.plugins[vendettaId];
      if (vd) return Boolean(vd.enabled ?? true);
      var bnId = findBunnyIdForAddon(addon);
      if (bnId) return Boolean(pluginSettings[bnId]?.enabled);
      return false;
    };
    var isInstalledForAddon = (addon) => {
      var vendettaId = normalizeIdFromInstallUrl(addon.installUrl);
      if (VdPluginManager.plugins[vendettaId]) return true;
      var bnId = findBunnyIdForAddon(addon);
      if (bnId) return Boolean(pluginSettings[bnId] != null);
      return false;
    };
    var getIndexForAddon = (addon) => indexMap.get(normalizeIdFromInstallUrl(addon.installUrl)) ?? 0;
    return /* @__PURE__ */ jsx(AddonPage, {
      CardComponent: ({ item }) => /* @__PURE__ */ jsx(BrowseAddonCard, {
        addon: item,
        installing: props.installing,
        setInstalling: props.setInstalling,
        setRefreshTick: props.setRefreshTick
      }),
      title: Strings.PLUGINS,
      searchKeywords: [
        "name",
        "description",
        (p) => (p.authors || []).join(", ")
      ],
      sortOptions: {
        // Newest first -> larger index is newer (we treat list order as chronological)
        "Date (Newest)": (a2, b) => getIndexForAddon(b) - getIndexForAddon(a2),
        // Oldest first -> smaller index is older
        "Date (Oldest)": (a2, b) => getIndexForAddon(a2) - getIndexForAddon(b),
        // Health-based sorts: surface problematic plugins first or working ones first
        "Broken First": (a2, b) => {
          var score2 = (p) => p.status === "broken" ? 3 : p.status === "warning" ? 2 : p.status === "working" ? 1 : 0;
          return score2(b) - score2(a2);
        },
        "Warning First": (a2, b) => {
          var score2 = (p) => p.status === "warning" ? 3 : p.status === "broken" ? 2 : p.status === "working" ? 1 : 0;
          return score2(b) - score2(a2);
        },
        "Working First": (a2, b) => {
          var score2 = (p) => p.status === "working" ? 3 : p.status === "warning" ? 2 : p.status === "broken" ? 1 : 0;
          return score2(b) - score2(a2);
        },
        // Keep name sorts
        "Name (A-Z)": (a2, b) => a2.name.localeCompare(b.name),
        "Name (Z-A)": (a2, b) => b.name.localeCompare(a2.name)
      },
      items: props.plugins
    });
  }
  function Plugins() {
    useProxy(settings);
    var navigation2 = NavigationNative.useNavigation();
    var [mode, setMode] = React2.useState("installed");
    var [plugins2, setPlugins] = React2.useState([]);
    var [loading, setLoading] = React2.useState(false);
    var [error, setError] = React2.useState(null);
    var [installing, setInstalling] = React2.useState(/* @__PURE__ */ new Set());
    var [refreshTick, setRefreshTick] = React2.useState(0);
    React2.useEffect(() => {
      navigation2.setOptions({
        headerRight: () => /* @__PURE__ */ jsx(Button, {
          size: "sm",
          variant: "secondary",
          text: mode === "installed" ? "Browse" : "Installed",
          icon: findAssetId(mode === "installed" ? "LinkIcon" : "DownloadIcon"),
          onPress: () => setMode(mode === "installed" ? "browse" : "installed")
        })
      });
    }, [
      navigation2,
      mode
    ]);
    var fetchPlugins = React2.useCallback(() => _async_to_generator(function* () {
      setLoading(true);
      setError(null);
      try {
        var response = yield safeFetch(PLUGIN_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        var data = yield response.json();
        var pluginList = [];
        if (Array.isArray(data)) {
          pluginList = data;
        } else if (data.OFFICIAL_PLUGINS) {
          pluginList = data.OFFICIAL_PLUGINS;
        }
        setPlugins(pluginList);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setPlugins([]);
      } finally {
        setLoading(false);
      }
    })(), []);
    React2.useEffect(() => {
      if (mode === "browse") {
        fetchPlugins();
      }
    }, [
      mode,
      fetchPlugins,
      refreshTick
    ]);
    if (mode === "installed") {
      return /* @__PURE__ */ jsx(InstalledPluginPage, {
        useItems: () => {
          useProxy(VdPluginManager.plugins);
          useObservable([
            pluginSettings
          ]);
          var vdIds = Object.keys(VdPluginManager.plugins || {});
          var vdPlugins = vdIds.slice().reverse().map((id2) => unifyVdPlugin(VdPluginManager.plugins[id2]));
          var installedBnIds = Object.keys(pluginSettings || {}).filter((id2) => registeredPlugins.has(id2)).slice().reverse();
          var bnPlugins = installedBnIds.map((id2) => registeredPlugins.get(id2)).map(unifyBunnyPlugin);
          var allPlugins = [
            ...vdPlugins,
            ...bnPlugins
          ];
          return allPlugins;
        },
        ListHeaderComponent: () => null,
        installAction: {
          label: "Install a plugin",
          fetchFn: (url2) => _async_to_generator(function* () {
            return yield VdPluginManager.installPlugin(url2);
          })()
        }
      });
    }
    if (error) {
      return /* @__PURE__ */ jsx(import_react_native25.View, {
        style: {
          flex: 1,
          paddingHorizontal: 8,
          justifyContent: "center",
          alignItems: "center"
        },
        children: /* @__PURE__ */ jsxs(Card, {
          style: {
            gap: 8
          },
          children: [
            /* @__PURE__ */ jsx(Text, {
              style: {
                textAlign: "center"
              },
              variant: "heading-lg/bold",
              children: "An error occurred while fetching the repository"
            }),
            /* @__PURE__ */ jsx(Text, {
              style: {
                textAlign: "center"
              },
              variant: "text-sm/medium",
              color: "text-muted",
              children: error
            }),
            /* @__PURE__ */ jsx(Button, {
              size: "lg",
              text: "Refetch",
              onPress: fetchPlugins,
              icon: findAssetId("RetryIcon")
            })
          ]
        })
      });
    }
    return /* @__PURE__ */ jsx(BrowsePluginPage, {
      plugins: plugins2,
      installing,
      setInstalling,
      setRefreshTick
    });
  }
  var import_react_native25, useReducer, openAlert2, AlertModalComponent, AlertActionsComponent, AlertActionButton3, hideActionSheet2, showSimpleActionSheet3, dismissAlert2, PLUGIN_URL;
  var init_Plugins = __esm({
    "src/core/ui/settings/pages/Plugins/index.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_jsxRuntime();
      init_common();
      import_react_native25 = __toESM(require_react_native());
      init_components();
      init_i18n();
      init_AddonPage();
      init_PluginCard();
      init_plugins();
      init_storage();
      init_plugins4();
      init_assets();
      init_settings();
      init_storage2();
      init_lazy();
      init_metro();
      init_safeFetch();
      init_common();
      init_components();
      init_sheets();
      init_lazy();
      init_bunny();
      init_vendetta();
      ({ useReducer } = React2);
      ({ openAlert: openAlert2 } = lazyDestructure(() => findByProps("openAlert", "dismissAlert")));
      ({ AlertModal: AlertModalComponent, AlertActions: AlertActionsComponent, AlertActionButton: AlertActionButton3 } = lazyDestructure(() => findByProps("AlertModal", "AlertActions")));
      ({ hideActionSheet: hideActionSheet2 } = lazyDestructure(() => findByProps("openLazy", "hideActionSheet")));
      ({ showSimpleActionSheet: showSimpleActionSheet3 } = lazyDestructure(() => findByProps("showSimpleActionSheet")));
      dismissAlert2 = proxyLazy(() => findByProps("close", "openLazy").close);
      PLUGIN_URL = "https://raw.githubusercontent.com/Purple-EyeZ/Plugins-List/refs/heads/main/src/plugins-data.json";
    }
  });

  // src/core/ui/components/AddonCard.tsx
  function AddonCard(props) {
    var styles = useStyles3();
    return /* @__PURE__ */ jsx(Card, {
      children: /* @__PURE__ */ jsxs(Stack, {
        spacing: 16,
        children: [
          /* @__PURE__ */ jsxs(import_react_native26.View, {
            style: {
              flexDirection: "row",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxs(import_react_native26.View, {
                style: styles.headerLeading,
                children: [
                  /* @__PURE__ */ jsx(Text, {
                    numberOfLines: 1,
                    ellipsizeMode: "tail",
                    style: styles.headerLabel,
                    children: props.headerLabel
                  }),
                  props.headerSublabel && /* @__PURE__ */ jsx(Text, {
                    numberOfLines: 1,
                    ellipsizeMode: "tail",
                    style: styles.headerSubtitle,
                    children: props.headerSublabel
                  })
                ]
              }),
              /* @__PURE__ */ jsxs(import_react_native26.View, {
                style: [
                  styles.headerTrailing,
                  {
                    marginLeft: "auto"
                  }
                ],
                children: [
                  /* @__PURE__ */ jsxs(import_react_native26.View, {
                    style: styles.actions,
                    children: [
                      props.overflowActions && /* @__PURE__ */ jsx(IconButton, {
                        onPress: () => showSimpleActionSheet4({
                          key: "CardOverflow",
                          header: {
                            title: props.overflowTitle,
                            icon: props.headerIcon && /* @__PURE__ */ jsx(LegacyFormRow.Icon, {
                              style: {
                                marginRight: 8
                              },
                              source: findAssetId(props.headerIcon)
                            })
                          },
                          options: props.overflowActions?.map((i2) => ({
                            ...i2,
                            icon: findAssetId(i2.icon)
                          }))
                        }),
                        size: "sm",
                        variant: "secondary",
                        icon: findAssetId("CircleInformationIcon-primary")
                      }),
                      props.actions?.map(({ icon, onPress, disabled }) => /* @__PURE__ */ jsx(IconButton, {
                        onPress,
                        disabled,
                        size: "sm",
                        variant: "secondary",
                        icon: findAssetId(icon)
                      }))
                    ]
                  }),
                  props.toggleType && (props.toggleType === "switch" ? /* @__PURE__ */ jsx(FormSwitch, {
                    value: props.toggleValue(),
                    onValueChange: props.onToggleChange
                  }) : /* @__PURE__ */ jsx(import_react_native26.TouchableOpacity, {
                    onPress: () => {
                      props.onToggleChange?.(!props.toggleValue());
                    },
                    children: /* @__PURE__ */ jsx(FormRadio, {
                      selected: props.toggleValue()
                    })
                  }))
                ]
              })
            ]
          }),
          props.descriptionLabel && /* @__PURE__ */ jsx(Text, {
            variant: "text-md/medium",
            children: props.descriptionLabel
          })
        ]
      })
    });
  }
  var import_react_native26, hideActionSheet3, showSimpleActionSheet4, useStyles3;
  var init_AddonCard = __esm({
    "src/core/ui/components/AddonCard.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_assets();
      init_lazy();
      init_components();
      init_wrappers();
      init_color();
      init_styles();
      import_react_native26 = __toESM(require_react_native());
      ({ hideActionSheet: hideActionSheet3 } = lazyDestructure(() => findByProps("openLazy", "hideActionSheet")));
      ({ showSimpleActionSheet: showSimpleActionSheet4 } = lazyDestructure(() => findByProps("showSimpleActionSheet")));
      useStyles3 = createStyles({
        card: {
          backgroundColor: semanticColors?.CARD_SECONDARY_BG,
          borderRadius: 12,
          overflow: "hidden"
        },
        header: {
          padding: 0
        },
        headerLeading: {
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          scale: 1.2
        },
        headerTrailing: {
          display: "flex",
          flexDirection: "row",
          gap: 15,
          alignItems: "center"
        },
        headerLabel: {
          ...TextStyleSheet["heading-lg/semibold"]
        },
        headerLabelCompact: {
          ...TextStyleSheet["text-md/semibold"]
        },
        headerSubtitle: {
          ...TextStyleSheet["text-sm/semibold"],
          color: semanticColors.TEXT_MUTED
        },
        descriptionLabel: {
          ...TextStyleSheet["text-md/semibold"],
          color: "text-strong"
        },
        actions: {
          flexDirection: "row-reverse",
          alignItems: "center",
          gap: 5
        },
        iconStyle: {
          tintColor: semanticColors.LOGO_PRIMARY,
          opacity: 0.2,
          height: 64,
          width: 64,
          left: void 0,
          right: "30%",
          top: "-10%"
        }
      });
    }
  });

  // src/core/ui/settings/pages/Themes/sheets/ThemeInfoActionSheet.tsx
  var ThemeInfoActionSheet_exports = {};
  __export(ThemeInfoActionSheet_exports, {
    default: () => ThemeInfoActionSheet
  });
  function ThemeInfoIconButton(props) {
    var { onPress } = props;
    props.onPress &&= () => {
      hideSheet("ThemeInfoActionSheet");
      onPress?.();
    };
    return /* @__PURE__ */ jsx(IconButton, {
      ...props,
      label: props.label
    });
  }
  function TitleComponent2({ theme }) {
    var { authors } = theme.data;
    return /* @__PURE__ */ jsxs(import_react_native27.View, {
      style: {
        gap: 4
      },
      children: [
        /* @__PURE__ */ jsx(import_react_native27.View, {
          children: /* @__PURE__ */ jsx(Text, {
            variant: "heading-xl/semibold",
            children: theme.data.name
          })
        }),
        /* @__PURE__ */ jsx(import_react_native27.View, {
          style: {
            flexDirection: "row",
            flexShrink: 1
          },
          children: authors && authors.length > 0 && /* @__PURE__ */ jsx(import_react_native27.TouchableOpacity, {
            style: {
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              paddingVertical: 4,
              paddingHorizontal: 8,
              backgroundColor: "#00000016",
              borderRadius: 32
            },
            disabled: !authors.some((a2) => a2.id),
            children: /* @__PURE__ */ jsxs(Text, {
              variant: "text-md/medium",
              children: [
                "by ",
                authors.map((a2) => a2.name).join(", ")
              ]
            })
          })
        })
      ]
    });
  }
  function ThemeInfoActionSheet({ theme, navigation: navigation2 }) {
    var [themeState, setThemeState] = (0, import_react10.useState)({
      ...theme
    });
    var [loading, setLoading] = (0, import_react10.useState)(false);
    (0, import_react10.useEffect)(() => {
      var interval = setInterval(() => {
        setThemeState({
          ...theme
        });
      }, 500);
      return () => clearInterval(interval);
    }, [
      theme
    ]);
    var copyThemeUrl = () => {
      clipboard.setString(themeState.id);
      if (typeof showToast?.showCopyToClipboard === "function") {
        showToast.showCopyToClipboard();
      } else {
        showToast("Copied to clipboard");
      }
    };
    var refetchTheme = () => _async_to_generator(function* () {
      setLoading(true);
      try {
        yield fetchTheme(themeState.id, themeState.selected);
        showToast("Theme refreshed successfully");
      } catch (e) {
        console.error("Failed to refresh theme:", e);
        showToast("Failed to refresh theme");
      } finally {
        setLoading(false);
      }
    })();
    var removeThemeHandler = () => {
      showConfirmationAlert({
        title: Strings.HOLD_UP,
        content: formatString("ARE_YOU_SURE_TO_DELETE_THEME", {
          name: themeState.data.name
        }),
        confirmText: Strings.DELETE,
        cancelText: Strings.CANCEL,
        confirmColor: "red",
        onConfirm: () => _async_to_generator(function* () {
          hideSheet("ThemeInfoActionSheet");
          try {
            var wasSelected = yield removeTheme(themeState.id);
            if (wasSelected) selectTheme(null);
            showToast("Theme removed successfully");
          } catch (e) {
            console.error("Failed to remove theme:", e);
            showToast("Failed to remove theme");
          }
        })()
      });
    };
    var applyTheme = () => {
      try {
        selectTheme(themeState);
        hideSheet("ThemeInfoActionSheet");
        showToast(`Applied theme: ${themeState.data.name}`);
      } catch (e) {
        console.error("Failed to apply theme:", e);
        showToast("Failed to apply theme");
      }
    };
    return /* @__PURE__ */ jsx(ActionSheet, {
      children: /* @__PURE__ */ jsxs(import_react_native27.ScrollView, {
        contentContainerStyle: {
          gap: 12,
          marginBottom: 12
        },
        children: [
          /* @__PURE__ */ jsx(import_react_native27.View, {
            style: {
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingVertical: 24,
              justifyContent: "space-between",
              width: "100%"
            },
            children: /* @__PURE__ */ jsx(TitleComponent2, {
              theme: themeState
            })
          }),
          /* @__PURE__ */ jsxs(import_react_native27.View, {
            style: {
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 65,
              paddingHorizontal: 8
            },
            children: [
              /* @__PURE__ */ jsx(ThemeInfoIconButton, {
                label: Strings.REFETCH,
                variant: "secondary",
                icon: findAssetId("RetryIcon"),
                onPress: refetchTheme,
                disabled: loading
              }),
              /* @__PURE__ */ jsx(ThemeInfoIconButton, {
                label: Strings.COPY_URL,
                variant: "secondary",
                icon: findAssetId("LinkIcon"),
                onPress: copyThemeUrl
              }),
              /* @__PURE__ */ jsx(ThemeInfoIconButton, {
                label: Strings.UNINSTALL,
                variant: "secondary",
                icon: findAssetId("TrashIcon"),
                onPress: removeThemeHandler
              })
            ]
          }),
          /* @__PURE__ */ jsxs(Card, {
            children: [
              /* @__PURE__ */ jsx(Text, {
                variant: "text-md/semibold",
                style: {
                  marginBottom: 4,
                  color: semanticColors.MOBILE_TEXT_HEADING_PRIMARY
                },
                children: "Description"
              }),
              /* @__PURE__ */ jsx(Text, {
                variant: "text-md/medium",
                children: themeState.data.description || "No description provided."
              })
            ]
          })
        ]
      })
    });
  }
  var import_react10, import_react_native27;
  var init_ThemeInfoActionSheet = __esm({
    "src/core/ui/settings/pages/Themes/sheets/ThemeInfoActionSheet.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_jsxRuntime();
      init_assets();
      init_sheets();
      init_components();
      init_common();
      import_react10 = __toESM(require_react());
      import_react_native27 = __toESM(require_react_native());
      init_toasts();
      init_alerts2();
      init_themes();
      init_i18n();
      init_color();
    }
  });

  // src/core/ui/settings/pages/Themes/ThemeCard.tsx
  function ThemeCard({ item: theme }) {
    var navigation2 = NavigationNative.useNavigation();
    var [removed, setRemoved] = React2.useState(false);
    if (removed) return null;
    var { authors } = theme.data;
    return /* @__PURE__ */ jsx(AddonCard, {
      headerLabel: theme.data.name,
      headerSublabel: authors ? `by ${authors.map((i2) => i2.name).join(", ")}` : "",
      descriptionLabel: theme.data.description ?? "No description.",
      toggleType: !settings.safeMode?.enabled ? "radio" : void 0,
      toggleValue: () => themes[theme.id].selected,
      onToggleChange: (v2) => {
        try {
          selectTheme(v2 ? theme : null);
        } catch (e) {
          console.error("Error while selecting theme:", e);
        }
      },
      overflowTitle: theme.data.name,
      actions: [
        {
          icon: "CircleInformationIcon-primary",
          onPress: () => {
            var importPromise = Promise.resolve().then(() => (init_ThemeInfoActionSheet(), ThemeInfoActionSheet_exports));
            showSheet("ThemeInfoActionSheet", importPromise, {
              theme,
              navigation: navigation2
            });
          }
        }
      ]
    });
  }
  var init_ThemeCard = __esm({
    "src/core/ui/settings/pages/Themes/ThemeCard.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_AddonCard();
      init_themes();
      init_settings();
      init_sheets();
      init_common();
    }
  });

  // src/core/ui/settings/pages/Themes/index.tsx
  var Themes_exports = {};
  __export(Themes_exports, {
    default: () => Themes
  });
  function BrowserThemeCard({ theme, installing, setInstalling, setRefreshTick }) {
    var { name, description, authors, installUrl } = theme;
    useProxy(themes);
    var themeId = installUrl;
    var isInstalling = installing.has(themeId);
    var isInstalled = themes[themeId];
    var [, forceUpdate] = useReducer2((x2) => x2 + 1, 0);
    var [rotation, setRotation] = React2.useState(0);
    var [pulse, setPulse] = React2.useState(1);
    var handleInstall = () => _async_to_generator(function* () {
      if (isInstalling) return;
      setInstalling((prev) => /* @__PURE__ */ new Set([
        ...prev,
        themeId
      ]));
      var animationInterval = setInterval(() => {
        setRotation((prev) => (prev + 15) % 360);
        setPulse((prev) => 0.8 + 0.2 * Math.sin(Date.now() / 200));
        forceUpdate();
      }, 100);
      try {
        yield installTheme(themeId);
        setRefreshTick((prev) => prev + 1);
        forceUpdate();
        showSheet("ThemeInstalledSheet", () => /* @__PURE__ */ jsxs(ActionSheet, {
          children: [
            /* @__PURE__ */ jsx(BottomSheetTitleHeader, {
              title: "Theme Installed"
            }),
            /* @__PURE__ */ jsxs(import_react_native28.View, {
              style: {
                padding: 16,
                alignItems: "center",
                gap: 12
              },
              children: [
                /* @__PURE__ */ jsx(import_react_native28.View, {
                  style: {
                    backgroundColor: "rgba(67, 181, 129, 0.1)",
                    borderRadius: 50,
                    padding: 16
                  },
                  children: /* @__PURE__ */ jsx(import_react_native28.Image, {
                    source: findAssetId("CheckmarkCircle"),
                    style: {
                      width: 32,
                      height: 32,
                      tintColor: "#43b581"
                    }
                  })
                }),
                /* @__PURE__ */ jsxs(Text, {
                  variant: "heading-md/bold",
                  children: [
                    name,
                    " installed successfully!"
                  ]
                }),
                /* @__PURE__ */ jsx(Text, {
                  variant: "text-md/medium",
                  color: "text-muted",
                  style: {
                    textAlign: "center"
                  },
                  children: "The theme has been added to your themes list."
                }),
                /* @__PURE__ */ jsx(import_react_native28.View, {
                  style: {
                    flexDirection: "row",
                    gap: 8,
                    width: "100%",
                    justifyContent: "space-between"
                  },
                  children: /* @__PURE__ */ jsx(Button, {
                    size: "lg",
                    text: "Close",
                    variant: "primary",
                    style: {
                      flex: 1
                    },
                    onPress: () => hideActionSheet4()
                  })
                })
              ]
            })
          ]
        }));
      } catch (e) {
        console.error("Failed to install theme:", e);
        showSheet("ThemeInstallFailedSheet", () => /* @__PURE__ */ jsxs(ActionSheet, {
          children: [
            /* @__PURE__ */ jsx(BottomSheetTitleHeader, {
              title: "Installation Failed"
            }),
            /* @__PURE__ */ jsxs(import_react_native28.View, {
              style: {
                padding: 16,
                alignItems: "center",
                gap: 12
              },
              children: [
                /* @__PURE__ */ jsx(import_react_native28.View, {
                  style: {
                    backgroundColor: "rgba(240, 71, 71, 0.1)",
                    borderRadius: 50,
                    padding: 16
                  },
                  children: /* @__PURE__ */ jsx(import_react_native28.Image, {
                    source: findAssetId("ErrorCircle"),
                    style: {
                      width: 32,
                      height: 32,
                      tintColor: "#f04747"
                    }
                  })
                }),
                /* @__PURE__ */ jsx(Text, {
                  variant: "heading-md/bold",
                  children: "Failed to install theme"
                }),
                /* @__PURE__ */ jsx(Card, {
                  style: {
                    width: "100%"
                  },
                  children: /* @__PURE__ */ jsx(Text, {
                    variant: "text-md/medium",
                    children: e instanceof Error ? e.message : String(e)
                  })
                }),
                /* @__PURE__ */ jsxs(import_react_native28.View, {
                  style: {
                    flexDirection: "row",
                    gap: 8,
                    width: "100%",
                    justifyContent: "space-between"
                  },
                  children: [
                    /* @__PURE__ */ jsx(Button, {
                      size: "md",
                      text: "Cancel",
                      variant: "secondary",
                      style: {
                        flex: 1
                      },
                      onPress: () => hideActionSheet4()
                    }),
                    /* @__PURE__ */ jsx(Button, {
                      size: "md",
                      text: "Try Again",
                      variant: "primary",
                      icon: findAssetId("RetryIcon"),
                      style: {
                        flex: 1
                      },
                      onPress: () => {
                        hideActionSheet4();
                        setTimeout(handleInstall, 500);
                      }
                    })
                  ]
                })
              ]
            })
          ]
        }));
      } finally {
        clearInterval(animationInterval);
        setRotation(0);
        setPulse(1);
        setInstalling((prev) => {
          var newSet = new Set(prev);
          newSet.delete(themeId);
          return newSet;
        });
      }
    })();
    var handleUninstall = () => _async_to_generator(function* () {
      try {
        yield removeTheme(themeId);
        setRefreshTick((prev) => prev + 1);
        forceUpdate();
      } catch (e) {
        console.error("Failed to uninstall theme:", e);
      }
    })();
    return /* @__PURE__ */ jsx(Card, {
      children: /* @__PURE__ */ jsxs(Stack, {
        spacing: 16,
        children: [
          /* @__PURE__ */ jsxs(import_react_native28.View, {
            style: {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxs(import_react_native28.View, {
                style: {
                  flexShrink: 1
                },
                children: [
                  /* @__PURE__ */ jsx(Text, {
                    numberOfLines: 1,
                    variant: "heading-lg/semibold",
                    children: name
                  }),
                  /* @__PURE__ */ jsxs(Text, {
                    variant: "text-md/semibold",
                    color: "text-muted",
                    children: [
                      "by ",
                      authors?.join(", ") || "Unknown"
                    ]
                  })
                ]
              }),
              /* @__PURE__ */ jsxs(import_react_native28.View, {
                style: {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8
                },
                children: [
                  /* @__PURE__ */ jsx(IconButton, {
                    size: "sm",
                    variant: "secondary",
                    icon: findAssetId("MoreHorizontalIcon"),
                    onPress: () => {
                      showSimpleActionSheet5({
                        key: "ThemeShareSheet",
                        header: {
                          title: "Share Theme"
                        },
                        options: [
                          {
                            label: "Copy Install URL",
                            onPress: () => {
                              clipboard.setString(themeId);
                            }
                          }
                        ]
                      });
                    }
                  }),
                  isInstalled ? /* @__PURE__ */ jsx(Button, {
                    size: "sm",
                    text: "Uninstall",
                    variant: "destructive",
                    icon: findAssetId("TrashIcon"),
                    onPress: handleUninstall
                  }) : /* @__PURE__ */ jsx(import_react_native28.View, {
                    style: {
                      opacity: pulse
                    },
                    children: /* @__PURE__ */ jsx(Button, {
                      size: "sm",
                      text: isInstalling ? "Installing..." : "Install",
                      variant: "primary",
                      disabled: isInstalling,
                      loading: isInstalling,
                      icon: isInstalling ? /* @__PURE__ */ jsx(import_react_native28.View, {
                        style: {
                          transform: [
                            {
                              rotate: `${rotation}deg`
                            }
                          ]
                        },
                        children: /* @__PURE__ */ jsx(import_react_native28.Image, {
                          source: findAssetId("RetryIcon"),
                          style: {
                            width: 16,
                            height: 16
                          }
                        })
                      }) : findAssetId("DownloadIcon"),
                      onPress: handleInstall
                    })
                  })
                ]
              })
            ]
          }),
          /* @__PURE__ */ jsx(Text, {
            variant: "text-md/medium",
            children: description
          })
        ]
      })
    });
  }
  function BrowseThemePage(props) {
    useProxy(themes);
    return /* @__PURE__ */ jsx(AddonPage, {
      CardComponent: ({ item }) => /* @__PURE__ */ jsx(BrowserThemeCard, {
        theme: item,
        installing: props.installing,
        setInstalling: props.setInstalling,
        setRefreshTick: props.setRefreshTick
      }),
      title: Strings.THEMES,
      searchKeywords: [
        "name",
        "description",
        (t) => (t.authors || []).join(", ")
      ],
      sortOptions: {
        "Date (Newest)": (a2, b) => 0,
        "Date (Oldest)": (a2, b) => 0,
        "Name (A-Z)": (a2, b) => a2.name.localeCompare(b.name),
        "Name (Z-A)": (a2, b) => b.name.localeCompare(a2.name)
      },
      items: props.themes
    });
  }
  function Themes() {
    useProxy(settings);
    useProxy(themes);
    var navigation2 = NavigationNative.useNavigation();
    var [mode, setMode] = React2.useState("installed");
    var [themesList, setThemesList] = React2.useState([]);
    var [loading, setLoading] = React2.useState(false);
    var [error, setError] = React2.useState(null);
    var [installing, setInstalling] = React2.useState(/* @__PURE__ */ new Set());
    var [refreshTick, setRefreshTick] = React2.useState(0);
    React2.useEffect(() => {
      var headerButtons = [];
      headerButtons.push(/* @__PURE__ */ jsx(Button, {
        size: "sm",
        variant: "secondary",
        text: mode === "installed" ? "Browse" : "Installed",
        icon: findAssetId(mode === "installed" ? "LinkIcon" : "DownloadIcon"),
        style: {
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2
        },
        onPress: () => setMode(mode === "installed" ? "browse" : "installed")
      }, "mode-toggle"));
      headerButtons.push(/* @__PURE__ */ jsx(IconButton, {
        size: "sm",
        variant: "secondary",
        icon: findAssetId("MoreHorizontalIcon"),
        onPress: () => showSheet("ThemeOptionsSheet", () => {
          useObservable([
            colorsPref
          ]);
          return /* @__PURE__ */ jsxs(ActionSheet, {
            children: [
              /* @__PURE__ */ jsx(BottomSheetTitleHeader, {
                title: "Options"
              }),
              /* @__PURE__ */ jsxs(import_react_native28.View, {
                style: {
                  paddingVertical: 20,
                  gap: 12
                },
                children: [
                  /* @__PURE__ */ jsxs(TableRowGroup, {
                    title: "Override Theme Type",
                    children: [
                      /* @__PURE__ */ jsx(TableCheckboxRow, {
                        label: "Auto",
                        icon: /* @__PURE__ */ jsx(TableRowIcon, {
                          source: findAssetId("RobotIcon")
                        }),
                        checked: !colorsPref.type,
                        onPress: () => {
                          if (!colorsPref.type) {
                            colorsPref.type = "dark";
                          }
                          getCurrentTheme()?.data && updateBunnyColor(getCurrentTheme().data, {
                            update: true
                          });
                        }
                      }),
                      /* @__PURE__ */ jsx(TableCheckboxRow, {
                        label: "Dark",
                        icon: /* @__PURE__ */ jsx(TableRowIcon, {
                          source: findAssetId("ThemeDarkIcon")
                        }),
                        checked: colorsPref.type === "dark",
                        onPress: () => {
                          colorsPref.type = colorsPref.type === "dark" ? void 0 : "dark";
                          getCurrentTheme()?.data && updateBunnyColor(getCurrentTheme().data, {
                            update: true
                          });
                        }
                      }),
                      /* @__PURE__ */ jsx(TableCheckboxRow, {
                        label: "Light",
                        icon: /* @__PURE__ */ jsx(TableRowIcon, {
                          source: findAssetId("ThemeLightIcon")
                        }),
                        checked: colorsPref.type === "light",
                        onPress: () => {
                          colorsPref.type = colorsPref.type === "light" ? void 0 : "light";
                          getCurrentTheme()?.data && updateBunnyColor(getCurrentTheme().data, {
                            update: true
                          });
                        }
                      })
                    ]
                  }),
                  /* @__PURE__ */ jsx(TableRowGroup, {
                    title: "Chat Background",
                    children: /* @__PURE__ */ jsx(TableCheckboxRow, {
                      label: "Show Background",
                      subLabel: "Enable or disable themes background on chat",
                      icon: /* @__PURE__ */ jsx(TableRowIcon, {
                        source: findAssetId("ImageIcon")
                      }),
                      checked: !colorsPref.customBackground,
                      onPress: () => {
                        colorsPref.customBackground = !colorsPref.customBackground ? "hidden" : null;
                      }
                    })
                  })
                ]
              })
            ]
          });
        })
      }, "options"));
      navigation2.setOptions({
        headerRight: () => /* @__PURE__ */ jsx(import_react_native28.View, {
          style: {
            flexDirection: "row",
            gap: 8
          },
          children: headerButtons
        })
      });
    }, [
      navigation2,
      mode
    ]);
    var fetchThemes = React2.useCallback(() => _async_to_generator(function* () {
      setLoading(true);
      setError(null);
      try {
        var response = yield safeFetch(THEME_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        var data = yield response.json();
        var themeList = [];
        if (Array.isArray(data)) {
          themeList = data;
        } else if (data.OFFICIAL_THEMES) {
          themeList = data.OFFICIAL_THEMES;
        } else if (data.themes) {
          themeList = data.themes;
        } else if (data.THEMES) {
          themeList = data.THEMES;
        } else if (data.items) {
          themeList = data.items;
        }
        setThemesList(themeList);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setThemesList([]);
      } finally {
        setLoading(false);
      }
    })(), []);
    React2.useEffect(() => {
      if (mode === "browse") {
        fetchThemes();
      }
    }, [
      mode,
      fetchThemes,
      refreshTick
    ]);
    if (mode === "installed") {
      return /* @__PURE__ */ jsx(AddonPage, {
        title: Strings.THEMES,
        searchKeywords: [
          "data.name",
          "data.description",
          (p) => p.data.authors?.map((a2) => a2.name).join(", ") ?? ""
        ],
        sortOptions: {
          "Name (A-Z)": (a2, b) => a2.data.name.localeCompare(b.data.name),
          "Name (Z-A)": (a2, b) => b.data.name.localeCompare(a2.data.name)
        },
        installAction: {
          label: "Install a theme",
          fetchFn: (url2) => _async_to_generator(function* () {
            try {
              yield installTheme(url2);
              showSheet("ThemeInstalledSheet", () => /* @__PURE__ */ jsxs(ActionSheet, {
                children: [
                  /* @__PURE__ */ jsx(BottomSheetTitleHeader, {
                    title: "Theme Installed"
                  }),
                  /* @__PURE__ */ jsxs(import_react_native28.View, {
                    style: {
                      padding: 16,
                      alignItems: "center",
                      gap: 12
                    },
                    children: [
                      /* @__PURE__ */ jsx(import_react_native28.View, {
                        style: {
                          backgroundColor: "rgba(67, 181, 129, 0.1)",
                          borderRadius: 50,
                          padding: 16
                        },
                        children: /* @__PURE__ */ jsx(import_react_native28.Image, {
                          source: findAssetId("CheckmarkCircle"),
                          style: {
                            width: 32,
                            height: 32,
                            tintColor: "#43b581"
                          }
                        })
                      }),
                      /* @__PURE__ */ jsx(Text, {
                        variant: "heading-md/bold",
                        children: "Theme installed successfully!"
                      }),
                      /* @__PURE__ */ jsx(Text, {
                        variant: "text-md/medium",
                        color: "text-muted",
                        style: {
                          textAlign: "center"
                        },
                        children: "The theme has been added to your themes list."
                      }),
                      /* @__PURE__ */ jsx(import_react_native28.View, {
                        style: {
                          flexDirection: "row",
                          gap: 8,
                          width: "100%",
                          justifyContent: "space-between"
                        },
                        children: /* @__PURE__ */ jsx(Button, {
                          size: "md",
                          text: "Cancel",
                          variant: "secondary",
                          style: {
                            flex: 1
                          },
                          onPress: () => hideActionSheet4()
                        })
                      })
                    ]
                  })
                ]
              }));
            } catch (e) {
              throw e;
            }
          })()
        },
        items: Object.values(themes),
        safeModeHint: {
          message: formatString("SAFE_MODE_NOTICE_THEMES", {
            enabled: Boolean(settings.safeMode?.currentThemeId)
          }),
          footer: settings.safeMode?.currentThemeId && /* @__PURE__ */ jsx(Button, {
            size: "small",
            text: Strings.DISABLE_THEME,
            onPress: () => delete settings.safeMode?.currentThemeId,
            style: {
              marginTop: 8
            }
          })
        },
        CardComponent: ThemeCard
      });
    }
    if (error) {
      return /* @__PURE__ */ jsx(import_react_native28.View, {
        style: {
          flex: 1,
          paddingHorizontal: 16,
          justifyContent: "center",
          alignItems: "center"
        },
        children: /* @__PURE__ */ jsxs(Card, {
          style: {
            gap: 16,
            padding: 20,
            width: "100%",
            maxWidth: 400
          },
          children: [
            /* @__PURE__ */ jsxs(import_react_native28.View, {
              style: {
                alignItems: "center"
              },
              children: [
                /* @__PURE__ */ jsx(import_react_native28.View, {
                  style: {
                    backgroundColor: "rgba(240, 71, 71, 0.1)",
                    borderRadius: 50,
                    padding: 16,
                    marginBottom: 12
                  },
                  children: /* @__PURE__ */ jsx(import_react_native28.Image, {
                    source: findAssetId("ErrorCircle"),
                    style: {
                      width: 32,
                      height: 32,
                      tintColor: "#f04747"
                    }
                  })
                }),
                /* @__PURE__ */ jsx(Text, {
                  style: {
                    textAlign: "center"
                  },
                  variant: "heading-lg/bold",
                  children: "Connection Error"
                }),
                /* @__PURE__ */ jsx(Text, {
                  style: {
                    textAlign: "center",
                    marginTop: 8,
                    marginBottom: 8
                  },
                  variant: "text-md/medium",
                  color: "text-muted",
                  children: "An error occurred while fetching the theme repository:"
                })
              ]
            }),
            /* @__PURE__ */ jsx(Card, {
              style: {
                backgroundColor: "rgba(0,0,0,0.05)",
                padding: 12,
                borderRadius: 8
              },
              children: /* @__PURE__ */ jsx(Text, {
                variant: "text-md/semibold",
                color: "text-danger",
                children: error
              })
            }),
            /* @__PURE__ */ jsx(Button, {
              size: "lg",
              text: "Try Again",
              onPress: fetchThemes,
              icon: findAssetId("RetryIcon"),
              style: {
                marginTop: 8
              }
            })
          ]
        })
      });
    }
    return /* @__PURE__ */ jsx(BrowseThemePage, {
      themes: themesList,
      installing,
      setInstalling,
      setRefreshTick
    });
  }
  var import_react_native28, useReducer2, hideActionSheet4, showSimpleActionSheet5, THEME_URL;
  var init_Themes = __esm({
    "src/core/ui/settings/pages/Themes/index.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_jsxRuntime();
      init_i18n();
      init_AddonPage();
      init_ThemeCard();
      init_storage();
      init_themes();
      init_preferences();
      init_updater();
      init_assets();
      init_settings();
      init_storage2();
      init_lazy();
      init_safeFetch();
      init_metro();
      init_common();
      init_sheets();
      init_components();
      import_react_native28 = __toESM(require_react_native());
      ({ useReducer: useReducer2 } = React2);
      ({ hideActionSheet: hideActionSheet4 } = lazyDestructure(() => findByProps("openLazy", "hideActionSheet")));
      ({ showSimpleActionSheet: showSimpleActionSheet5 } = lazyDestructure(() => findByProps("showSimpleActionSheet")));
      THEME_URL = "https://raw.githubusercontent.com/kmmiio99o/theme-marketplace/refs/heads/main/themes.json";
    }
  });

  // src/lib/addons/fonts/index.ts
  var fonts_exports = {};
  __export(fonts_exports, {
    fonts: () => fonts,
    installFont: () => installFont,
    removeFont: () => removeFont,
    saveFont: () => saveFont,
    selectFont: () => selectFont,
    updateFont: () => updateFont,
    updateFonts: () => updateFonts,
    validateFont: () => validateFont
  });
  function writeFont(font) {
    return _async_to_generator(function* () {
      if (!font && font !== null) throw new Error("Arg font must be a valid object or null");
      if (font) {
        yield writeFile("fonts.json", JSON.stringify(font));
      } else {
        yield removeFile("fonts.json");
      }
    })();
  }
  function validateFont(font) {
    if (!font || typeof font !== "object") throw new Error("URL returned a null/non-object JSON");
    if (typeof font.spec !== "number") throw new Error("Invalid font 'spec' number");
    if (font.spec !== 1) throw new Error("Only fonts which follows spec:1 are supported");
    var requiredFields = [
      "name",
      "main"
    ];
    if (requiredFields.some((f2) => !font[f2])) throw new Error(`Font is missing one of the fields: ${requiredFields}`);
    if (font.name.startsWith("__")) throw new Error("Font names cannot start with __");
    if (font.name in fonts) throw new Error(`There is already a font named '${font.name}' installed`);
  }
  function saveFont(data, selected = false) {
    return _async_to_generator(function* () {
      var fontDefJson;
      if (typeof data === "string") {
        try {
          fontDefJson = yield (yield safeFetch(data)).json();
        } catch (e) {
          throw new Error(`Failed to fetch fonts at ${data}`, {
            cause: e
          });
        }
      } else {
        fontDefJson = data;
      }
      validateFont(fontDefJson);
      var errors = yield allSettled(Object.entries(fontDefJson.main).map(([font, url2]) => _async_to_generator(function* () {
        var ext = url2.split(".").pop();
        if (ext !== "ttf" && ext !== "otf") ext = "ttf";
        var path = `downloads/fonts/${fontDefJson.name}/${font}.${ext}`;
        if (!(yield fileExists(path))) yield downloadFile(url2, path);
      })())).then((it) => it.map((it2) => it2.status === "fulfilled" ? void 0 : it2.reason));
      if (errors.some((it) => it)) throw errors;
      fonts[fontDefJson.name] = fontDefJson;
      if (selected) writeFont(fonts[fontDefJson.name]);
      return fontDefJson;
    })();
  }
  function updateFont(fontDef) {
    return _async_to_generator(function* () {
      var fontDefCopy = {
        ...fontDef
      };
      if (fontDefCopy.source) fontDefCopy = {
        ...yield fetch(fontDefCopy.source).then((it) => it.json()),
        // Can't change these properties
        name: fontDef.name,
        source: fontDef.source
      };
      var selected = fonts.__selected === fontDef.name;
      yield removeFont(fontDef.name);
      yield saveFont(fontDefCopy, selected);
    })();
  }
  function installFont(url2, selected = false) {
    return _async_to_generator(function* () {
      var font = yield saveFont(url2);
      if (selected) yield selectFont(font.name);
    })();
  }
  function selectFont(name) {
    return _async_to_generator(function* () {
      if (name && !(name in fonts)) throw new Error("Selected font does not exist!");
      if (name) {
        fonts.__selected = name;
      } else {
        delete fonts.__selected;
      }
      yield writeFont(name == null ? null : fonts[name]);
    })();
  }
  function removeFont(name) {
    return _async_to_generator(function* () {
      var selected = fonts.__selected === name;
      if (selected) yield selectFont(null);
      delete fonts[name];
      try {
        yield clearFolder(`downloads/fonts/${name}`);
      } catch (unused) {
      }
    })();
  }
  function updateFonts() {
    return _async_to_generator(function* () {
      yield awaitStorage(fonts);
      allSettled(Object.keys(fonts).map((name) => saveFont(fonts[name], fonts.__selected === name)));
    })();
  }
  var fonts;
  var init_fonts = __esm({
    "src/lib/addons/fonts/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_storage();
      init_fs();
      init_utils();
      fonts = wrapSync(createStorage(createMemoryBackend("BUNNY_FONTS", {})));
    }
  });

  // src/core/ui/settings/pages/Fonts/FontEditor.tsx
  function promptDetachConfirmationForThen(fontName, cb) {
    if (fontName && fonts[fontName].source) openAlert3("revenge-fonts-detach-source-confirmation", /* @__PURE__ */ jsx(AlertModal3, {
      title: "Detach font pack URL?",
      content: "You need to detach the font pack URL from this font pack before you can manually edit its font entries. Do you want to detach the font pack URL?",
      actions: /* @__PURE__ */ jsxs(Stack, {
        children: [
          /* @__PURE__ */ jsx(AlertActionButton4, {
            text: "Detach",
            variant: "destructive",
            onPress: () => {
              delete fonts[fontName].source;
              cb();
            }
          }),
          /* @__PURE__ */ jsx(AlertActionButton4, {
            text: Strings.CANCEL,
            variant: "secondary"
          })
        ]
      })
    }));
    else cb();
  }
  function guessFontName(urls) {
    var fileNames = urls.map((url2) => {
      var { pathname } = new URL(url2);
      var fileName = pathname.replace(/\.[^/.]+$/, "");
      return fileName.split("/").pop();
    }).filter(Boolean);
    var shortest = fileNames.reduce((shortest2, name) => {
      return name.length < shortest2.length ? name : shortest2;
    }, fileNames[0] || "");
    return shortest?.replace(/-[A-Za-z]*$/, "") || null;
  }
  function RevengeFontsExtractor({ fonts: fonts2, setName }) {
    var currentTheme = getCurrentTheme().data;
    var themeFonts = currentTheme.fonts;
    var [fontName, setFontName] = (0, import_react11.useState)(guessFontName(Object.values(themeFonts)));
    var [error, setError] = (0, import_react11.useState)(void 0);
    return /* @__PURE__ */ jsxs(import_react_native29.View, {
      style: {
        padding: 8,
        paddingBottom: 16,
        gap: 12
      },
      children: [
        /* @__PURE__ */ jsx(TextInput, {
          autoFocus: true,
          size: "md",
          label: Strings.FONT_NAME,
          value: fontName,
          placeholder: fontName || "Whitney",
          onChange: setFontName,
          errorMessage: error,
          state: error ? "error" : void 0
        }),
        /* @__PURE__ */ jsx(Text, {
          variant: "text-xs/normal",
          color: "text-muted",
          children: formatString("THEME_EXTRACTOR_DESC", {
            fonts: Object.keys(themeFonts).join(Strings.SEPARATOR)
          })
        }),
        /* @__PURE__ */ jsx(Button, {
          size: "md",
          variant: "primary",
          text: Strings.EXTRACT,
          disabled: !fontName,
          onPress: () => {
            if (!fontName) return;
            try {
              validateFont({
                spec: 1,
                name: fontName,
                main: themeFonts
              });
              setName(fontName);
              Object.assign(fonts2, themeFonts);
              actionSheet2.hideActionSheet();
            } catch (e) {
              setError(String(e));
            }
          }
        })
      ]
    });
  }
  function JsonFontImporter({ fonts: fonts2, setName, setSource }) {
    var [fontLink, setFontLink] = (0, import_react11.useState)("");
    var [saving, setSaving] = (0, import_react11.useState)(false);
    var [error, setError] = (0, import_react11.useState)(void 0);
    return /* @__PURE__ */ jsxs(import_react_native29.View, {
      style: {
        padding: 8,
        paddingBottom: 16,
        gap: 12
      },
      children: [
        /* @__PURE__ */ jsx(TextInput, {
          autoFocus: true,
          size: "md",
          label: "Font Link",
          value: fontLink,
          placeholder: "https://link.to/font/pack.json",
          onChange: setFontLink,
          errorMessage: error,
          state: error ? "error" : void 0
        }),
        /* @__PURE__ */ jsx(Button, {
          size: "md",
          variant: "primary",
          text: "Import",
          disabled: !fontLink || saving,
          loading: saving,
          onPress: () => {
            setSaving(true);
            (() => _async_to_generator(function* () {
              var res = yield safeFetch(fontLink, {
                cache: "no-store"
              });
              var json = yield res.json();
              validateFont(json);
              setName(json.name);
              setSource(fontLink);
              Object.assign(fonts2, json.main);
            })())().then(() => actionSheet2.hideActionSheet()).catch((e) => setError(String(e))).finally(() => setSaving(false));
          }
        })
      ]
    });
  }
  function EntryEditorActionSheet(props) {
    var [familyName, setFamilyName] = (0, import_react11.useState)(props.name);
    var [fontUrl, setFontUrl] = (0, import_react11.useState)(props.fontEntries[props.name]);
    return /* @__PURE__ */ jsxs(import_react_native29.View, {
      style: {
        padding: 8,
        paddingBottom: 16,
        gap: 12
      },
      children: [
        /* @__PURE__ */ jsx(TextInput, {
          autoFocus: true,
          size: "md",
          label: "Family Name (to override)",
          value: familyName,
          placeholder: "ggsans-Bold",
          onChange: setFamilyName
        }),
        /* @__PURE__ */ jsx(TextInput, {
          size: "md",
          label: "Font URL",
          value: fontUrl,
          placeholder: "https://link.to/the/font.ttf",
          onChange: setFontUrl
        }),
        /* @__PURE__ */ jsx(Button, {
          size: "md",
          variant: "primary",
          text: "Apply",
          onPress: () => {
            delete props.fontEntries[props.name];
            props.fontEntries[familyName] = fontUrl;
            props.onChange();
            actionSheet2.hideActionSheet();
          }
        })
      ]
    });
  }
  function promptActionSheet(Component, fontEntries, props) {
    actionSheet2.openLazy(Promise.resolve({
      default: () => /* @__PURE__ */ jsx(ErrorBoundary, {
        children: /* @__PURE__ */ jsxs(ActionSheet, {
          children: [
            /* @__PURE__ */ jsx(BottomSheetTitleHeader, {
              title: "Import Font"
            }),
            /* @__PURE__ */ jsx(Component, {
              fonts: fontEntries,
              ...props
            })
          ]
        })
      })
    }), "FontEditorActionSheet");
  }
  function NewEntryRow({ fontName, fontEntry }) {
    var nameRef = (0, import_react11.useRef)();
    var urlRef = (0, import_react11.useRef)();
    var [nameSet, setNameSet] = (0, import_react11.useState)(false);
    var [error, setError] = (0, import_react11.useState)();
    return /* @__PURE__ */ jsxs(import_react_native29.View, {
      style: {
        flexDirection: "row",
        gap: 8,
        justifyContent: "flex-start"
      },
      children: [
        /* @__PURE__ */ jsx(import_react_native29.View, {
          style: {
            flex: 1
          },
          children: /* @__PURE__ */ jsx(TextInput, {
            isRound: true,
            size: "md",
            label: nameSet ? nameRef.current : void 0,
            placeholder: nameSet ? "https://path.to/the/file.ttf" : "PostScript name (e.g. ggsans-Bold)",
            leadingIcon: () => nameSet ? null : /* @__PURE__ */ jsx(TableRow.Icon, {
              source: findAssetId("PlusSmallIcon")
            }),
            leadingText: nameSet ? nameRef.current : "",
            onChange: (text) => (nameSet ? urlRef : nameRef).current = text,
            errorMessage: error,
            state: error ? "error" : void 0
          })
        }),
        nameSet && /* @__PURE__ */ jsx(IconButton, {
          size: "md",
          variant: "secondary",
          onPress: () => {
            nameRef.current = "";
            setNameSet(false);
          },
          icon: findAssetId("TrashIcon")
        }),
        /* @__PURE__ */ jsx(IconButton, {
          size: "md",
          variant: "primary",
          onPress: () => promptDetachConfirmationForThen(fontName, () => {
            if (!nameSet && nameRef.current) {
              setNameSet(true);
            } else if (nameSet && nameRef.current && urlRef.current) {
              try {
                var parsedUrl = new URL(urlRef.current);
                if (!parsedUrl.protocol || !parsedUrl.host) {
                  throw "Invalid URL";
                }
                fontEntry[nameRef.current] = urlRef.current;
                nameRef.current = void 0;
                urlRef.current = void 0;
                setNameSet(false);
              } catch (e) {
                setError(String(e));
              }
            }
          }),
          icon: findAssetId(nameSet ? "PlusSmallIcon" : "ArrowLargeRightIcon")
        })
      ]
    });
  }
  function FontEditor(props) {
    var [name, setName] = (0, import_react11.useState)(props.name);
    var [source, setSource] = (0, import_react11.useState)(props.name && fonts[props.name].source);
    var [importing, setIsImporting] = (0, import_react11.useState)(false);
    var [errors, setErrors] = (0, import_react11.useState)();
    var memoEntry = (0, import_react11.useMemo)(() => {
      return createProxy(props.name ? {
        ...fonts[props.name].main
      } : {}).proxy;
    }, [
      props.name
    ]);
    var fontEntries = useProxy(memoEntry);
    var navigation2 = NavigationNative.useNavigation();
    var [, forceUpdate] = React.useReducer(() => ({}), 0);
    return /* @__PURE__ */ jsx(import_react_native29.ScrollView, {
      style: {
        flex: 1
      },
      contentContainerStyle: {
        paddingBottom: 38
      },
      children: /* @__PURE__ */ jsxs(Stack, {
        style: {
          paddingVertical: 24,
          paddingHorizontal: 12
        },
        spacing: 12,
        children: [
          !props.name ? /* @__PURE__ */ jsxs(TableRowGroup, {
            title: "Import",
            children: [
              getCurrentTheme()?.data?.fonts && /* @__PURE__ */ jsx(TableRow, {
                label: Strings.LABEL_EXTRACT_FONTS_FROM_THEME,
                subLabel: Strings.DESC_EXTRACT_FONTS_FROM_THEME,
                icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                  source: findAssetId("HammerIcon")
                }),
                onPress: () => promptActionSheet(RevengeFontsExtractor, fontEntries, {
                  setName
                })
              }),
              /* @__PURE__ */ jsx(TableRow, {
                label: "Import font entries from a link",
                subLabel: "Directly import from a link with a pre-configured JSON file",
                icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                  source: findAssetId("LinkIcon")
                }),
                onPress: () => promptActionSheet(JsonFontImporter, fontEntries, {
                  setName,
                  setSource
                })
              })
            ]
          }) : /* @__PURE__ */ jsxs(TableRowGroup, {
            title: "Actions",
            children: [
              /* @__PURE__ */ jsx(TableRow, {
                label: "Refetch fonts from source",
                icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                  source: findAssetId("RetryIcon")
                }),
                onPress: () => _async_to_generator(function* () {
                  yield updateFont(fonts[props.name]);
                  navigation2.goBack();
                })()
              }),
              /* @__PURE__ */ jsx(TableRow, {
                variant: "danger",
                label: "Delete font pack",
                icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                  variant: "danger",
                  source: findAssetId("TrashIcon")
                }),
                onPress: () => removeFont(props.name).then(() => navigation2.goBack())
              })
            ]
          }),
          /* @__PURE__ */ jsx(TextInput, {
            size: "lg",
            value: name,
            label: Strings.FONT_NAME,
            placeholder: "Whitney",
            onChange: setName
          }),
          props.name && fonts[props.name].source && /* @__PURE__ */ jsx(TextInput, {
            size: "lg",
            value: source,
            label: "Font Pack URL",
            onChange: setSource
          }),
          /* @__PURE__ */ jsxs(TableRowGroup, {
            title: "Font Entries",
            children: [
              Object.entries(fontEntries).map(([name2, url2], index) => {
                var error = errors?.[index];
                return /* @__PURE__ */ jsx(TableRow, {
                  label: name2,
                  subLabel: error ? /* @__PURE__ */ jsx(Text, {
                    variant: "text-xs/medium",
                    color: "text-feedback-critical",
                    children: error.message
                  }) : url2,
                  trailing: /* @__PURE__ */ jsxs(Stack, {
                    spacing: 8,
                    direction: "horizontal",
                    children: [
                      /* @__PURE__ */ jsx(IconButton, {
                        size: "sm",
                        variant: "secondary",
                        icon: findAssetId("PencilIcon"),
                        onPress: () => promptDetachConfirmationForThen(props.name, () => promptActionSheet(EntryEditorActionSheet, fontEntries, {
                          name: name2,
                          fontEntries,
                          onChange: () => {
                            setErrors(void 0);
                            forceUpdate();
                          }
                        }))
                      }),
                      /* @__PURE__ */ jsx(IconButton, {
                        size: "sm",
                        variant: "secondary",
                        icon: findAssetId("TrashIcon"),
                        onPress: () => promptDetachConfirmationForThen(props.name, () => {
                          delete fontEntries[name2];
                          setErrors(void 0);
                        })
                      })
                    ]
                  })
                });
              }),
              /* @__PURE__ */ jsx(TableRow, {
                label: /* @__PURE__ */ jsx(NewEntryRow, {
                  fontName: props.name,
                  fontEntry: fontEntries
                })
              })
            ]
          }),
          errors && /* @__PURE__ */ jsx(Text, {
            variant: "text-sm/medium",
            color: "text-feedback-critical",
            children: "Some font entries cannot be imported. Please modify the entries and try again."
          }),
          /* @__PURE__ */ jsx(import_react_native29.View, {
            style: {
              flexDirection: "row",
              justifyContent: "flex-end",
              bottom: 0,
              left: 0
            },
            children: /* @__PURE__ */ jsx(Button, {
              size: "lg",
              loading: importing,
              disabled: importing || !name || Object.keys(fontEntries).length === 0,
              variant: "primary",
              text: props.name ? "Save" : "Import",
              onPress: () => _async_to_generator(function* () {
                if (!name) return;
                setErrors(void 0);
                setIsImporting(true);
                if (!props.name) {
                  saveFont({
                    spec: 1,
                    name,
                    main: fontEntries,
                    source
                  }).then(() => navigation2.goBack()).catch((e) => setErrors(e)).finally(() => setIsImporting(false));
                } else {
                  Object.assign(fonts[props.name], {
                    name,
                    main: fontEntries
                  });
                  updateFont(fonts[props.name]).then(() => navigation2.goBack()).catch((e) => setErrors(e)).finally(() => setIsImporting(false));
                }
              })(),
              icon: findAssetId(props.name ? "toast_image_saved" : "DownloadIcon"),
              style: {
                marginLeft: 8
              }
            })
          })
        ]
      })
    });
  }
  var import_react11, import_react_native29, actionSheet2, openAlert3, AlertModal3, AlertActionButton4;
  var init_FontEditor = __esm({
    "src/core/ui/settings/pages/Fonts/FontEditor.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_jsxRuntime();
      init_i18n();
      init_storage();
      init_fonts();
      init_themes();
      init_assets();
      init_utils();
      init_lazy();
      init_common();
      init_components();
      init_wrappers();
      init_components2();
      import_react11 = __toESM(require_react());
      import_react_native29 = __toESM(require_react_native());
      actionSheet2 = findByPropsLazy("hideActionSheet");
      ({ openAlert: openAlert3 } = lazyDestructure(() => findByProps("openAlert", "dismissAlert")));
      ({ AlertModal: AlertModal3, AlertActionButton: AlertActionButton4 } = lazyDestructure(() => findByProps("AlertModal", "AlertActions")));
    }
  });

  // globals:react-native-webview
  var require_react_native_webview = __commonJS({
    "globals:react-native-webview"(exports, module) {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      module.exports = require_depsModule()["react-native-webview"];
    }
  });

  // src/core/ui/settings/pages/Fonts/preview.html
  var preview_default;
  var init_preview = __esm({
    "src/core/ui/settings/pages/Fonts/preview.html"() {
      preview_default = '<head>\n    <meta name="viewport" content="initial-scale=1.0" />\n</head>\n<body style="overflow: hidden; padding: 0; margin: 0"></body>\n<script>\n    const props = $$props;\n\n    new FontFace("Preview", `url(${props.family})`).load().then((font) => {\n        document.fonts.add(font);\n\n        const p = document.createElement("p");\n        p.textContent = props.text;\n        p.style.fontFamily = font.family;\n        p.style.fontSize = `${props.size}px`;\n        p.style.color = props.color;\n\n        document.body.appendChild(p);\n        ReactNativeWebView.postMessage(true);\n    });\n<\/script>\n';
    }
  });

  // src/core/ui/settings/pages/Fonts/FontCard.tsx
  function FontPreview({ font }) {
    var [loaded, setLoaded] = (0, import_react12.useState)(false);
    var styles = useStyles4();
    var TEXT_DEFAULT = useToken2(tokens.colors.TEXT_DEFAULT);
    var { fontFamily: fontFamilyList, fontSize } = TextStyleSheet["text-md/medium"];
    var fontFamily = fontFamilyList.split(/,/g)[0];
    var props = (0, import_react12.useMemo)(() => ({
      family: font.main[fontFamily],
      size: fontSize * import_react_native30.PixelRatio.getFontScale(),
      color: TEXT_DEFAULT,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }), [
      font.main,
      fontFamily,
      fontSize,
      TEXT_DEFAULT
    ]);
    return /* @__PURE__ */ jsxs(import_react_native30.View, {
      style: {
        width: "100%",
        height: 64
      },
      children: [
        /* @__PURE__ */ jsx(import_react_native_webview.WebView, {
          onMessage: () => setLoaded(true),
          source: {
            html: preview_default.replace("$$props", JSON.stringify(props))
          },
          javaScriptEnabled: true,
          scrollEnabled: false,
          overScrollMode: "never",
          showsHorizontalScrollIndicator: false,
          showsVerticalScrollIndicator: false,
          pointerEvents: "none",
          style: [
            styles.full,
            {
              backgroundColor: "transparent",
              opacity: Number(loaded)
            }
          ]
        }),
        !loaded && /* @__PURE__ */ jsx(import_react_native30.View, {
          style: [
            styles.full,
            {
              justifyContent: "center",
              alignItems: "center"
            }
          ],
          children: /* @__PURE__ */ jsx(Text, {
            color: "text-muted",
            variant: "heading-lg/semibold",
            children: "Loading..."
          })
        })
      ]
    });
  }
  function FontCard({ item: font }) {
    useProxy(fonts);
    var navigation2 = NavigationNative.useNavigation();
    var selected = fonts.__selected === font.name;
    return /* @__PURE__ */ jsx(Card, {
      children: /* @__PURE__ */ jsxs(Stack, {
        spacing: 16,
        children: [
          /* @__PURE__ */ jsxs(import_react_native30.View, {
            style: {
              flexDirection: "row",
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsx(import_react_native30.View, {
                children: /* @__PURE__ */ jsx(Text, {
                  variant: "heading-lg/semibold",
                  children: font.name
                })
              }),
              /* @__PURE__ */ jsx(import_react_native30.View, {
                style: {
                  marginLeft: "auto"
                },
                children: /* @__PURE__ */ jsxs(Stack, {
                  spacing: 12,
                  direction: "horizontal",
                  children: [
                    /* @__PURE__ */ jsx(IconButton, {
                      onPress: () => {
                        navigation2.push("BUNNY_CUSTOM_PAGE", {
                          title: "Edit Font",
                          render: () => /* @__PURE__ */ jsx(FontEditor, {
                            name: font.name
                          })
                        });
                      },
                      size: "sm",
                      variant: "secondary",
                      disabled: selected,
                      icon: findAssetId("WrenchIcon")
                    }),
                    /* @__PURE__ */ jsx(Button, {
                      size: "sm",
                      variant: selected ? "secondary" : "primary",
                      text: selected ? "Unapply" : "Apply",
                      onPress: () => _async_to_generator(function* () {
                        yield selectFont(selected ? null : font.name);
                        showConfirmationAlert({
                          title: Strings.HOLD_UP,
                          content: "Reload Discord to apply changes?",
                          confirmText: Strings.RELOAD,
                          cancelText: Strings.CANCEL,
                          confirmColor: "red",
                          onConfirm: BundleUpdaterManager.reload
                        });
                      })()
                    })
                  ]
                })
              })
            ]
          }),
          /* @__PURE__ */ jsx(FontPreview, {
            font
          })
        ]
      })
    });
  }
  var import_react12, import_react_native30, import_react_native_webview, useToken2, useStyles4;
  var init_FontCard = __esm({
    "src/core/ui/settings/pages/Fonts/FontCard.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_jsxRuntime();
      init_i18n();
      init_alerts2();
      init_storage();
      init_fonts();
      init_assets();
      init_lazy();
      init_modules();
      init_styles();
      init_common();
      init_components();
      init_metro();
      import_react12 = __toESM(require_react());
      import_react_native30 = __toESM(require_react_native());
      import_react_native_webview = __toESM(require_react_native_webview());
      init_preview();
      init_FontEditor();
      ({ useToken: useToken2 } = lazyDestructure(() => findByProps("useToken")));
      useStyles4 = createStyles({
        full: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%"
        }
      });
    }
  });

  // src/core/ui/settings/pages/Fonts/index.tsx
  var Fonts_exports = {};
  __export(Fonts_exports, {
    default: () => Fonts
  });
  function Fonts() {
    useProxy(settings);
    useProxy(fonts);
    var navigation2 = NavigationNative.useNavigation();
    return /* @__PURE__ */ jsx(AddonPage, {
      title: Strings.FONTS,
      searchKeywords: [
        "name",
        "description"
      ],
      sortOptions: {
        "Name (A-Z)": (a2, b) => a2.name.localeCompare(b.name),
        "Name (Z-A)": (a2, b) => b.name.localeCompare(a2.name)
      },
      items: Object.values(fonts),
      safeModeHint: {
        message: Strings.SAFE_MODE_NOTICE_FONTS
      },
      CardComponent: FontCard,
      installAction: {
        label: "Install a font",
        onPress: () => {
          navigation2.push("BUNNY_CUSTOM_PAGE", {
            title: "Import Font",
            render: () => /* @__PURE__ */ jsx(FontEditor, {})
          });
        }
      }
    });
  }
  var init_Fonts = __esm({
    "src/core/ui/settings/pages/Fonts/index.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_i18n();
      init_AddonPage();
      init_FontEditor();
      init_storage();
      init_fonts();
      init_settings();
      init_common();
      init_FontCard();
    }
  });

  // src/core/ui/hooks/useFS.ts
  function useFileExists(path, prefix) {
    var [state, setState] = (0, import_react13.useState)(2);
    var check = () => fileExists(path, {
      prefix
    }).then((exists) => setState(exists ? 1 : 0)).catch(() => setState(3));
    var customFS = (0, import_react13.useMemo)(() => new Proxy(fs_exports, {
      get(target, p, receiver) {
        var val = Reflect.get(target, p, receiver);
        if (typeof val !== "function") return;
        return (...args) => {
          var promise = (check(), val(...args));
          if (promise?.constructor?.name === "Promise") {
            setState(2);
            promise.finally(check);
          }
          return promise;
        };
      }
    }), []);
    (0, import_react13.useEffect)(() => void check(), []);
    return [
      state,
      customFS
    ];
  }
  var import_react13, CheckState;
  var init_useFS = __esm({
    "src/core/ui/hooks/useFS.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_fs();
      import_react13 = __toESM(require_react());
      CheckState = /* @__PURE__ */ (function(CheckState2) {
        CheckState2[CheckState2["FALSE"] = 0] = "FALSE";
        CheckState2[CheckState2["TRUE"] = 1] = "TRUE";
        CheckState2[CheckState2["LOADING"] = 2] = "LOADING";
        CheckState2[CheckState2["ERROR"] = 3] = "ERROR";
        return CheckState2;
      })({});
    }
  });

  // src/core/ui/settings/pages/Developer/AssetDisplay.tsx
  function AssetDisplay({ asset }) {
    var type = String(asset.type ?? "").toLowerCase();
    var isImage = DISPLAYABLE_IMAGE_TYPES.has(type);
    var isTextPreview = DISPLAYABLE_TEXT_TYPES.has(type);
    return /* @__PURE__ */ jsx(TableRow, {
      variant: isImage || isTextPreview ? "default" : "danger",
      label: asset.name,
      subLabel: `Index: ${asset.id} Type: ${asset.type}`,
      icon: isImage ? /* @__PURE__ */ jsx(import_react_native31.Image, {
        source: asset.id,
        style: {
          width: 32,
          height: 32
        }
      }) : /* @__PURE__ */ jsx(TableRow.Icon, {
        variant: "danger",
        source: findAssetId(type in iconMap ? iconMap[type] : iconMap.default)
      }),
      onPress: () => openAlert4("revenge-asset-display-details", /* @__PURE__ */ jsx(AlertModal4, {
        title: asset.name,
        content: `Index: ${asset.id}
Module ID: ${asset.moduleId}
Type: ${asset.type}`,
        extraContent: isImage ? /* @__PURE__ */ jsx(import_react_native31.Image, {
          resizeMode: "contain",
          source: asset.id,
          style: {
            flex: 1,
            width: "auto",
            height: 192
          }
        }) : isTextPreview ? (
          // For JSON-like assets (jsona, json, lottie) attempt to require the module
          // and show a readable JSON/text preview. If loading fails, show a helpful message.
          (() => {
            try {
              var moduleExport = requireModule(asset.moduleId);
              var printable = typeof moduleExport === "object" ? JSON.stringify(moduleExport, null, 2) : String(moduleExport);
              return /* @__PURE__ */ jsx(import_react_native31.ScrollView, {
                style: {
                  maxHeight: 192,
                  padding: 8
                },
                children: /* @__PURE__ */ jsx(Text, {
                  variant: "text-sm/medium",
                  style: {
                    fontSize: 12,
                    fontFamily: "monospace"
                  },
                  children: printable
                })
              });
            } catch (e) {
              return /* @__PURE__ */ jsxs(Text, {
                variant: "text-sm/medium",
                color: "text-warning",
                style: {
                  width: "100%",
                  textAlign: "center"
                },
                children: [
                  "Could not load preview for ",
                  type.toUpperCase(),
                  "."
                ]
              });
            }
          })()
        ) : /* @__PURE__ */ jsxs(Text, {
          variant: "text-sm/medium",
          color: "text-danger",
          style: {
            width: "100%",
            textAlign: "center"
          },
          children: [
            "Asset type ",
            String(asset.type).toUpperCase(),
            " is not supported for preview."
          ]
        }),
        actions: /* @__PURE__ */ jsxs(Stack, {
          children: [
            /* @__PURE__ */ jsx(AlertActionButton5, {
              text: "Copy asset name",
              variant: "primary",
              onPress: () => copyToClipboard(asset.name)
            }),
            /* @__PURE__ */ jsx(AlertActionButton5, {
              text: "Copy asset index",
              variant: "secondary",
              onPress: () => copyToClipboard(asset.id.toString())
            })
          ]
        })
      }))
    });
  }
  var import_react_native31, openAlert4, AlertModal4, AlertActionButton5, DISPLAYABLE_IMAGE_TYPES, DISPLAYABLE_TEXT_TYPES, iconMap, copyToClipboard;
  var init_AssetDisplay = __esm({
    "src/core/ui/settings/pages/Developer/AssetDisplay.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_assets();
      init_lazy();
      init_metro();
      init_common();
      init_components();
      init_toasts();
      import_react_native31 = __toESM(require_react_native());
      init_modules2();
      ({ openAlert: openAlert4 } = lazyDestructure(() => findByProps("openAlert", "dismissAlert")));
      ({ AlertModal: AlertModal4, AlertActionButton: AlertActionButton5 } = lazyDestructure(() => findByProps("AlertModal", "AlertActions")));
      DISPLAYABLE_IMAGE_TYPES = /* @__PURE__ */ new Set([
        "png",
        "jpg",
        "jpeg",
        "svg",
        "gif"
      ]);
      DISPLAYABLE_TEXT_TYPES = /* @__PURE__ */ new Set([
        "jsona",
        "json",
        "lottie"
      ]);
      iconMap = {
        jsona: "ic_file_text",
        lottie: "ic_image",
        webm: "CirclePlayIcon-primary",
        ttf: "ic_add_text",
        default: "UnknownGameIcon"
      };
      copyToClipboard = (text) => {
        clipboard.setString(text);
        showToast.showCopyToClipboard();
      };
    }
  });

  // src/core/ui/settings/pages/Developer/AssetBrowser.tsx
  function AssetBrowser() {
    var [search, setSearch] = (0, import_react14.useState)("");
    var [updateTick, setUpdateTick] = (0, import_react14.useState)(0);
    useProxy(assetBrowserStorage);
    var getFilteredAssets = (0, import_react14.useCallback)(() => {
      return Array.from(iterateAssets()).filter((asset) => {
        var type = String(asset.type ?? "").toLowerCase();
        return assetBrowserStorage.enabledFilters[type] === true;
      });
    }, [
      updateTick
    ]);
    var all2 = (0, import_react14.useMemo)(() => getFilteredAssets(), [
      getFilteredAssets
    ]);
    var toggleFilter = (filterId) => {
      assetBrowserStorage.enabledFilters[filterId] = !assetBrowserStorage.enabledFilters[filterId];
      setUpdateTick((prev) => prev + 1);
    };
    var handleFilterPress = () => {
      showSheet("AssetBrowserFilter", () => {
        useProxy(assetBrowserStorage);
        return /* @__PURE__ */ jsxs(ActionSheet, {
          children: [
            /* @__PURE__ */ jsx(BottomSheetTitleHeader, {
              title: Strings.ASSET_TYPES
            }),
            /* @__PURE__ */ jsx(TableRowGroup, {
              title: Strings.IMAGE_FILES,
              children: IMAGE_FILES.map((fileType) => /* @__PURE__ */ jsx(TableCheckboxRow, {
                label: fileType.label,
                checked: assetBrowserStorage.enabledFilters[fileType.id] === true,
                onPress: () => toggleFilter(fileType.id)
              }, fileType.id))
            }),
            /* @__PURE__ */ jsx(TableRowGroup, {
              title: Strings.TEXT_FILES,
              children: TEXT_FILES.map((fileType) => /* @__PURE__ */ jsx(TableCheckboxRow, {
                label: fileType.label,
                checked: assetBrowserStorage.enabledFilters[fileType.id] === true,
                onPress: () => toggleFilter(fileType.id)
              }, fileType.id))
            })
          ]
        });
      });
    };
    return /* @__PURE__ */ jsx(ErrorBoundary, {
      children: /* @__PURE__ */ jsxs(import_react_native32.View, {
        style: {
          flex: 1
        },
        children: [
          /* @__PURE__ */ jsxs(import_react_native32.View, {
            style: {
              flexDirection: "row",
              margin: 10,
              gap: 8,
              alignItems: "center"
            },
            children: [
              /* @__PURE__ */ jsx(Search_default, {
                style: {
                  flex: 1
                },
                isRound: true,
                onChangeText: (v2) => setSearch(v2)
              }),
              /* @__PURE__ */ jsx(IconButton, {
                icon: findAssetId("FileIcon"),
                variant: "tertiary",
                onPress: handleFilterPress
              })
            ]
          }),
          /* @__PURE__ */ jsx(import_react_native32.View, {
            style: {
              flex: 1,
              borderRadius: 16,
              paddingHorizontal: 12,
              overflow: "hidden",
              backgroundColor: "transparent"
            },
            children: /* @__PURE__ */ jsx(import_react_native32.FlatList, {
              data: all2.filter((a2) => a2.name.includes(search) || a2.id.toString() === search),
              renderItem: ({ item }) => /* @__PURE__ */ jsx(AssetDisplay, {
                asset: item
              }),
              contentContainerStyle: {
                overflow: "hidden",
                backgroundColor: "transparent",
                borderRadius: 16
              },
              keyExtractor: (a2) => a2.name
            })
          })
        ]
      })
    });
  }
  var import_react14, import_react_native32, IMAGE_FILES, TEXT_FILES, ALL_FILE_TYPES, createInitialFilters, assetBrowserStorage;
  var init_AssetBrowser = __esm({
    "src/core/ui/settings/pages/Developer/AssetBrowser.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_AssetDisplay();
      init_assets();
      init_assets();
      init_i18n();
      init_components();
      init_components2();
      init_sheets();
      init_storage();
      import_react14 = __toESM(require_react());
      import_react_native32 = __toESM(require_react_native());
      IMAGE_FILES = [
        {
          id: "png",
          label: "PNG",
          defaultEnabled: true
        },
        {
          id: "jpg",
          label: "JPG",
          defaultEnabled: true
        },
        {
          id: "jpeg",
          label: "JPEG",
          defaultEnabled: true
        },
        {
          id: "svg",
          label: "SVG",
          defaultEnabled: true
        },
        {
          id: "gif",
          label: "GIF",
          defaultEnabled: true
        }
      ];
      TEXT_FILES = [
        {
          id: "jsona",
          label: "JSONA",
          defaultEnabled: false
        },
        {
          id: "json",
          label: "JSON",
          defaultEnabled: false
        },
        {
          id: "lottie",
          label: "Lottie",
          defaultEnabled: false
        }
      ];
      ALL_FILE_TYPES = [
        ...IMAGE_FILES,
        ...TEXT_FILES
      ];
      createInitialFilters = () => {
        var filters = {};
        ALL_FILE_TYPES.forEach((type) => {
          filters[type.id] = type.defaultEnabled;
        });
        return filters;
      };
      ({ proxy: assetBrowserStorage } = createProxy({
        enabledFilters: createInitialFilters()
      }));
    }
  });

  // src/core/ui/settings/pages/Developer/index.tsx
  var Developer_exports = {};
  __export(Developer_exports, {
    default: () => Developer
  });
  function Developer() {
    var [rdtFileExists, fs] = useFileExists("preloads/reactDevtools.js");
    var [isDebuggerConnected, setIsDebuggerConnected] = (0, import_react15.useState)(isConnectedToDebugger2());
    var isRdtConnected = useIsRdtConnected();
    var styles = useStyles5();
    var navigation2 = NavigationNative.useNavigation();
    useProxy(settings);
    useProxy(loaderConfig);
    (0, import_react15.useEffect)(() => {
      var interval = setInterval(() => {
        setIsDebuggerConnected(isConnectedToDebugger2());
      }, 1e3);
      return () => clearInterval(interval);
    }, []);
    var handleDebuggerConnect = () => {
      if (isDebuggerConnected) {
        disconnectFromDebugger2();
        setIsDebuggerConnected(false);
      } else {
        connectToDebugger2(settings.debuggerUrl);
        setTimeout(() => setIsDebuggerConnected(isConnectedToDebugger2()), 100);
      }
    };
    var handleReactDevToolsConnect = () => {
      if (isRdtConnected) {
        disconnectRdt();
      } else {
        if (!settings.devToolsUrl?.trim()) {
          showToast("Invalid devTools URL!", findAssetId("Small"));
          return;
        }
        connectRdt(settings.devToolsUrl);
      }
    };
    return /* @__PURE__ */ jsx(ErrorBoundary, {
      children: /* @__PURE__ */ jsx(import_react_native34.ScrollView, {
        style: {
          flex: 1
        },
        contentContainerStyle: {
          paddingBottom: 38
        },
        children: /* @__PURE__ */ jsxs(Stack, {
          style: {
            paddingVertical: 24,
            paddingHorizontal: 12
          },
          spacing: 24,
          children: [
            /* @__PURE__ */ jsxs(Stack, {
              spacing: 4,
              children: [
                /* @__PURE__ */ jsx(TableRowGroup, {
                  title: Strings.DEBUGGER_URL,
                  children: /* @__PURE__ */ jsx(Stack, {
                    spacing: 4,
                    children: /* @__PURE__ */ jsx(TextInput, {
                      placeholder: "127.0.0.1:9090",
                      size: "md",
                      leadingIcon: () => /* @__PURE__ */ jsx(LegacyFormText, {
                        style: styles.leadingText,
                        children: "ws://"
                      }),
                      defaultValue: settings.debuggerUrl,
                      onChange: (v2) => settings.debuggerUrl = v2
                    })
                  })
                }),
                /* @__PURE__ */ jsxs(TableRowGroup, {
                  children: [
                    /* @__PURE__ */ jsx(TableSwitchRow, {
                      label: Strings.AUTO_DEBUGGER,
                      icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                        source: findAssetId("copy")
                      }),
                      value: settings.autoDebugger,
                      onValueChange: (v2) => {
                        settings.autoDebugger = v2;
                      }
                    }),
                    /* @__PURE__ */ jsx(TableRow, {
                      label: Strings.CONNECT_TO_DEBUG_WEBSOCKET,
                      subLabel: "Connect DevTools for debugging",
                      icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                        source: findAssetId("WrenchIcon")
                      }),
                      onPress: handleDebuggerConnect
                    })
                  ]
                })
              ]
            }),
            isReactDevToolsPreloaded() && /* @__PURE__ */ jsxs(Stack, {
              spacing: 4,
              children: [
                /* @__PURE__ */ jsx(TableRowGroup, {
                  title: "React Development",
                  children: /* @__PURE__ */ jsx(Stack, {
                    spacing: 4,
                    children: /* @__PURE__ */ jsx(TextInput, {
                      placeholder: "127.0.0.1:8097",
                      size: "md",
                      leadingIcon: () => /* @__PURE__ */ jsx(LegacyFormText, {
                        style: styles.leadingText,
                        children: "ws://"
                      }),
                      defaultValue: settings.devToolsUrl,
                      onChange: (v2) => settings.devToolsUrl = v2
                    })
                  })
                }),
                /* @__PURE__ */ jsxs(TableRowGroup, {
                  children: [
                    /* @__PURE__ */ jsx(TableSwitchRow, {
                      label: Strings.AUTO_DEVTOOLS,
                      icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                        source: findAssetId("ic_badge_staff")
                      }),
                      value: settings.autoDevTools,
                      onValueChange: (v2) => {
                        settings.autoDevTools = v2;
                      }
                    }),
                    /* @__PURE__ */ jsx(TableRow, {
                      label: Strings.CONNECT_TO_REACT_DEVTOOLS,
                      subLabel: "Connect React DevTools for component debugging",
                      icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                        source: findAssetId("ic_badge_staff")
                      }),
                      onPress: handleReactDevToolsConnect
                    }),
                    isLoaderConfigSupported() && isVendettaLoader() && /* @__PURE__ */ jsx(TableSwitchRow, {
                      label: Strings.LOAD_REACT_DEVTOOLS,
                      subLabel: `${Strings.VERSION}: ${getReactDevToolsVersion()}`,
                      icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                        source: findAssetId("ic_badge_staff")
                      }),
                      value: loaderConfig.loadReactDevTools,
                      onValueChange: (v2) => {
                        loaderConfig.loadReactDevTools = v2;
                      }
                    })
                  ]
                })
              ]
            }),
            isLoaderConfigSupported() && /* @__PURE__ */ jsxs(TableRowGroup, {
              title: "Loader Configuration",
              children: [
                /* @__PURE__ */ jsx(TableSwitchRow, {
                  label: Strings.LOAD_FROM_CUSTOM_URL,
                  subLabel: Strings.LOAD_FROM_CUSTOM_URL_DEC,
                  icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                    source: findAssetId("LinkIcon")
                  }),
                  value: loaderConfig.customLoadUrl.enabled,
                  onValueChange: (v2) => {
                    loaderConfig.customLoadUrl.enabled = v2;
                  }
                }),
                loaderConfig.customLoadUrl.enabled && /* @__PURE__ */ jsx(TableRow, {
                  label: /* @__PURE__ */ jsx(TextInput, {
                    defaultValue: loaderConfig.customLoadUrl.url,
                    size: "md",
                    onChange: (v2) => loaderConfig.customLoadUrl.url = v2,
                    placeholder: "http://localhost:4040/shiggycord.js",
                    label: Strings.SHIGGYCORD_URL
                  })
                })
              ]
            }),
            /* @__PURE__ */ jsxs(TableRowGroup, {
              title: "Inspection & Testing",
              children: [
                /* @__PURE__ */ jsx(TableRow, {
                  arrow: true,
                  label: Strings.ASSET_BROWSER,
                  subLabel: "Browse and inspect Discord's assets",
                  icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                    source: findAssetId("ic_image")
                  }),
                  trailing: TableRow.Arrow,
                  onPress: () => navigation2.push("SHIGGYCORD_CUSTOM_PAGE", {
                    title: Strings.ASSET_BROWSER,
                    render: AssetBrowser
                  })
                }),
                /* @__PURE__ */ jsx(TableRow, {
                  label: Strings.INSTALL_REACT_DEVTOOLS,
                  subLabel: Strings.RESTART_REQUIRED_TO_TAKE_EFFECT,
                  icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                    source: findAssetId("DownloadIcon")
                  }),
                  trailing: /* @__PURE__ */ jsx(Button, {
                    size: "sm",
                    loading: rdtFileExists === CheckState.LOADING,
                    disabled: rdtFileExists === CheckState.LOADING,
                    variant: rdtFileExists === CheckState.TRUE ? "secondary" : "primary",
                    text: rdtFileExists === CheckState.TRUE ? Strings.UNINSTALL : Strings.INSTALL,
                    onPress: () => _async_to_generator(function* () {
                      if (rdtFileExists === CheckState.FALSE) {
                        fs.downloadFile(RDT_EMBED_LINK, "preloads/reactDevtools.js").then(() => showToast("Successfully installed! A reload is required", findAssetId("DownloadIcon")));
                      } else if (rdtFileExists === CheckState.TRUE) {
                        fs.removeFile("preloads/reactDevtools.js");
                      }
                    })(),
                    icon: findAssetId(rdtFileExists === CheckState.TRUE ? "TrashIcon" : "DownloadIcon"),
                    style: {
                      marginLeft: 8
                    }
                  })
                }),
                /* @__PURE__ */ jsx(TableRow, {
                  arrow: true,
                  label: Strings.ERROR_BOUNDARY_TOOLS_LABEL,
                  subLabel: "Test error boundaries and crash handling",
                  icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                    source: findAssetId("ic_warning_24px")
                  }),
                  onPress: () => showSimpleActionSheet6({
                    key: "ErrorBoundaryTools",
                    header: {
                      title: "Which ErrorBoundary do you want to trip?",
                      icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                        style: {
                          marginRight: 8
                        },
                        source: findAssetId("ic_warning_24px")
                      })
                    },
                    options: [
                      {
                        label: Strings.SHIGGYCORD,
                        onPress: () => navigation2.push("SHIGGYCORD_CUSTOM_PAGE", {
                          render: () => /* @__PURE__ */ jsx(ErrorBoundaryScreen, {
                            error: new Error("ShiggyCord test crash"),
                            rerender: () => {
                            }
                          })
                        })
                      },
                      {
                        label: "Discord",
                        isDestructive: true,
                        onPress: () => navigation2.push("SHIGGYCORD_CUSTOM_PAGE", {
                          noErrorBoundary: true
                        })
                      }
                    ]
                  })
                }),
                /* @__PURE__ */ jsx(TableSwitchRow, {
                  label: Strings.ENABLE_EVAL_COMMAND,
                  subLabel: Strings.ENABLE_EVAL_COMMAND_DESC,
                  icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                    source: findAssetId("PencilIcon")
                  }),
                  value: !!settings.enableEvalCommand,
                  onValueChange: (v2) => {
                    settings.enableEvalCommand = v2;
                  }
                })
              ]
            }),
            /* @__PURE__ */ jsx(TableRowGroup, {
              title: "Dangerous Actions",
              children: /* @__PURE__ */ jsx(TableRow, {
                label: Strings.CLEAR_BUNDLE,
                subLabel: "Clear cached bundle and force reload",
                icon: /* @__PURE__ */ jsx(TableRow.Icon, {
                  source: findAssetId("TrashIcon")
                }),
                onPress: () => {
                  openAlert5("shiggycord-clear-bundle-reload-confirmation", /* @__PURE__ */ jsx(AlertModal5, {
                    title: Strings.MODAL_RELOAD_REQUIRED,
                    content: Strings.MODAL_RELOAD_REQUIRED_DESC,
                    actions: /* @__PURE__ */ jsxs(Stack, {
                      children: [
                        /* @__PURE__ */ jsx(AlertActionButton6, {
                          text: Strings.RELOAD,
                          variant: "destructive",
                          onPress: () => import_react_native33.NativeModules.BundleUpdaterManager.reload()
                        }),
                        /* @__PURE__ */ jsx(AlertActionButton6, {
                          text: Strings.CANCEL,
                          variant: "secondary"
                        })
                      ]
                    })
                  }));
                }
              })
            })
          ]
        })
      })
    });
  }
  var import_react_native33, import_react_native34, import_react15, hideActionSheet5, showSimpleActionSheet6, openAlert5, AlertModal5, AlertActionButton6, RDT_EMBED_LINK, useStyles5;
  var init_Developer = __esm({
    "src/core/ui/settings/pages/Developer/index.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_jsxRuntime();
      init_i18n();
      init_useFS();
      init_AssetBrowser();
      init_storage();
      init_assets();
      init_debug();
      init_loader();
      init_settings();
      init_lazy();
      init_common();
      init_components();
      init_wrappers();
      init_color();
      init_components2();
      init_ErrorBoundaryScreen();
      init_styles();
      import_react_native33 = __toESM(require_react_native());
      import_react_native34 = __toESM(require_react_native());
      init_toasts();
      import_react15 = __toESM(require_react());
      ({ hideActionSheet: hideActionSheet5 } = lazyDestructure(() => findByProps("openLazy", "hideActionSheet")));
      ({ showSimpleActionSheet: showSimpleActionSheet6 } = lazyDestructure(() => findByProps("showSimpleActionSheet")));
      ({ openAlert: openAlert5 } = lazyDestructure(() => findByProps("openAlert", "dismissAlert")));
      ({ AlertModal: AlertModal5, AlertActionButton: AlertActionButton6 } = lazyDestructure(() => findByProps("AlertModal", "AlertActions")));
      RDT_EMBED_LINK = "https://codeberg.org/raincord/raindevtools/raw/branch/dev/dist/index.bundle";
      useStyles5 = createStyles({
        leadingText: {
          ...TextStyleSheet["heading-md/semibold"],
          color: semanticColors.TEXT_MUTED,
          marginRight: -4
        },
        inputGroup: {
          marginTop: 4,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: "hidden"
        }
      });
    }
  });

  // src/core/ui/settings/index.ts
  function initSettings() {
    registerSection({
      name: "ShiggyCord",
      items: [
        {
          key: "SHIGGYCORD",
          title: () => Strings.SHIGGYCORD,
          icon: {
            uri: shiggy_default
          },
          render: () => Promise.resolve().then(() => (init_General(), General_exports)),
          useTrailing: () => `(${"1.4.1.11"})`
        },
        {
          key: "BUNNY_PLUGINS",
          title: () => Strings.PLUGINS,
          icon: findAssetId("PuzzlePieceIcon"),
          render: () => Promise.resolve().then(() => (init_Plugins(), Plugins_exports))
        },
        {
          key: "BUNNY_THEMES",
          title: () => Strings.THEMES,
          icon: findAssetId("PaintPaletteIcon"),
          render: () => Promise.resolve().then(() => (init_Themes(), Themes_exports)),
          usePredicate: () => isThemeSupported()
        },
        {
          key: "BUNNY_FONTS",
          title: () => Strings.FONTS,
          icon: findAssetId("LettersIcon"),
          render: () => Promise.resolve().then(() => (init_Fonts(), Fonts_exports)),
          usePredicate: () => isFontSupported()
        },
        {
          key: "BUNNY_DEVELOPER",
          title: () => Strings.DEVELOPER,
          icon: findAssetId("WrenchIcon"),
          render: () => Promise.resolve().then(() => (init_Developer(), Developer_exports)),
          usePredicate: () => useProxy(settings).developerSettings ?? false
        }
      ]
    });
    registerSection({
      name: "Bunny",
      items: []
    });
    registerSection({
      name: "Revenge",
      items: []
    });
    registerSection({
      name: "Vendetta",
      items: []
    });
  }
  var init_settings3 = __esm({
    "src/core/ui/settings/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_shiggy();
      init_i18n();
      init_storage();
      init_assets();
      init_loader();
      init_settings();
      init_settings2();
    }
  });

  // globals:lodash
  var require_lodash = __commonJS({
    "globals:lodash"(exports, module) {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      module.exports = require_depsModule()["lodash"];
    }
  });

  // globals:util
  var require_util = __commonJS({
    "globals:util"(exports, module) {
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      module.exports = require_depsModule()["util"];
    }
  });

  // src/core/vendetta/api.tsx
  var import_react16, import_react_native35, initVendettaObject;
  var init_api3 = __esm({
    "src/core/vendetta/api.tsx"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_jsxRuntime();
      init_alerts2();
      init_storage();
      init_storage();
      init_themes();
      init_assets();
      init_commands();
      init_debug();
      init_loader();
      init_patcher();
      init_settings();
      init_utils();
      init_cyrb64();
      init_logger();
      init_metro();
      init_common();
      init_components();
      init_components();
      init_color();
      init_components2();
      init_styles();
      init_toasts();
      init_dist();
      import_react16 = __toESM(require_react());
      import_react_native35 = __toESM(require_react_native());
      init_plugins();
      initVendettaObject = () => {
        var createStackBasedFilter = (fn) => {
          return (filter) => {
            return fn(factories_exports.createSimpleFilter(filter, cyrb64Hash(new Error().stack)));
          };
        };
        var api = globalThis.vendetta = {
          patcher: {
            before: patcher_default.before,
            after: patcher_default.after,
            instead: patcher_default.instead
          },
          metro: {
            modules: globalThis.modules,
            find: createStackBasedFilter(findExports),
            findAll: createStackBasedFilter(findAllExports),
            findByProps: (...props) => {
              if (props.length === 1 && props[0] === "KeyboardAwareScrollView") {
                props.push("listenToKeyboardEvents");
              }
              var ret = findByProps(...props);
              if (ret == null) {
                if (props.includes("ActionSheetTitleHeader")) {
                  var module = findByProps("ActionSheetRow");
                  return {
                    ...module,
                    ActionSheetTitleHeader: module.BottomSheetTitleHeader,
                    ActionSheetContentContainer: ({ children }) => {
                      (0, import_react16.useEffect)(() => console.warn("Discord has removed 'ActionSheetContentContainer', please move into something else. This has been temporarily replaced with View"), []);
                      return /* @__PURE__ */ (0, import_react16.createElement)(import_react_native35.View, null, children);
                    }
                  };
                }
              }
              return ret;
            },
            findByPropsAll: (...props) => findByPropsAll(...props),
            findByName: (name, defaultExp) => {
              if (name === "create" && typeof defaultExp === "undefined") {
                return findByName("create", false).default;
              }
              return findByName(name, defaultExp ?? true);
            },
            findByNameAll: (name, defaultExp = true) => findByNameAll(name, defaultExp),
            findByDisplayName: (displayName, defaultExp = true) => findByDisplayName(displayName, defaultExp),
            findByDisplayNameAll: (displayName, defaultExp = true) => findByDisplayNameAll(displayName, defaultExp),
            findByTypeName: (typeName, defaultExp = true) => findByTypeName(typeName, defaultExp),
            findByTypeNameAll: (typeName, defaultExp = true) => findByTypeNameAll(typeName, defaultExp),
            findByStoreName: (name) => findByStoreName(name),
            common: {
              constants,
              channels,
              i18n,
              url,
              toasts,
              stylesheet: {
                createThemedStyleSheet
              },
              clipboard,
              assets,
              invites,
              commands,
              navigation,
              navigationStack,
              NavigationNative,
              Flux,
              FluxDispatcher,
              React: React2,
              ReactNative,
              get moment() {
                return require_moment();
              },
              get chroma() {
                var cached = this._chroma;
                if (cached) return cached;
                var loaded = require_chroma_js();
                this._chroma = loaded;
                return loaded;
              },
              get lodash() {
                return require_lodash();
              },
              get util() {
                return require_util();
              }
            }
          },
          constants: {
            DISCORD_SERVER: "https://discord.gg/n9QQ4XhhJP",
            GITHUB: "https://github.com/vendetta-mod",
            PROXY_PREFIX: "https://vd-plugins.github.io/proxy",
            HTTP_REGEX: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
            HTTP_REGEX_MULTI: /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)/g,
            DISCORD_SERVER_ID: "1015931589865246730",
            PLUGINS_CHANNEL_ID: "1091880384561684561",
            THEMES_CHANNEL_ID: "1091880434939482202"
          },
          utils: {
            findInReactTree: (tree, filter) => findInReactTree(tree, filter),
            findInTree: (tree, filter, options) => findInTree(tree, filter, options),
            safeFetch: (input, options, timeout) => safeFetch(input, options, timeout),
            unfreeze: (obj) => Object.isFrozen(obj) ? {
              ...obj
            } : obj,
            without: (object, ...keys) => omit(object, keys)
          },
          debug: {
            connectToDebugger: (url2) => connectToDebugger2(url2),
            getDebugInfo: () => getDebugInfo()
          },
          ui: {
            components: {
              Forms,
              General: ReactNative,
              Alert: LegacyAlert,
              Button: CompatButton,
              HelpMessage: (...props) => /* @__PURE__ */ jsx(HelpMessage, {
                ...props
              }),
              SafeAreaView: (...props) => /* @__PURE__ */ jsx(SafeAreaView, {
                ...props
              }),
              Summary,
              ErrorBoundary,
              Codeblock,
              Search: Search_default
            },
            toasts: {
              showToast: (content, asset) => showToast(content, asset)
            },
            alerts: {
              showConfirmationAlert: (options) => showConfirmationAlert(options),
              showCustomAlert: (component, props) => showCustomAlert(component, props),
              showInputAlert: (options) => showInputAlert(options)
            },
            assets: {
              all: new Proxy({}, {
                get(cache, p) {
                  if (typeof p !== "string") return void 0;
                  if (cache[p]) return cache[p];
                  for (var asset of iterateAssets()) {
                    if (asset.name) return cache[p] = asset;
                  }
                },
                ownKeys(cache) {
                  var keys = /* @__PURE__ */ new Set();
                  for (var asset of iterateAssets()) {
                    cache[asset.name] = asset;
                    keys.add(asset.name);
                  }
                  return [
                    ...keys
                  ];
                }
              }),
              find: (filter) => findAsset(filter),
              getAssetByName: (name) => findAsset(name),
              getAssetByID: (id2) => findAsset(id2),
              getAssetIDByName: (name) => findAssetId(name)
            },
            semanticColors,
            rawColors
          },
          plugins: {
            plugins: VdPluginManager.plugins,
            fetchPlugin: (source) => VdPluginManager.fetchPlugin(source),
            installPlugin: (source, enabled = true) => VdPluginManager.installPlugin(source, enabled),
            startPlugin: (id2) => VdPluginManager.startPlugin(id2),
            stopPlugin: (id2, disable = true) => VdPluginManager.stopPlugin(id2, disable),
            removePlugin: (id2) => VdPluginManager.removePlugin(id2),
            getSettings: (id2) => VdPluginManager.getSettings(id2)
          },
          themes: {
            themes,
            fetchTheme: (id2, selected) => fetchTheme(id2, selected),
            installTheme: (id2) => installTheme(id2),
            selectTheme: (id2) => selectTheme(id2 === "default" ? null : themes[id2]),
            removeTheme: (id2) => removeTheme(id2),
            getCurrentTheme: () => getThemeFromLoader(),
            updateThemes: () => updateThemes()
          },
          commands: {
            registerCommand
          },
          storage: {
            createProxy: (target) => createProxy(target),
            useProxy: (_storage) => useProxy(_storage),
            createStorage: (backend) => createStorage(backend),
            wrapSync: (store) => wrapSync(store),
            awaitSyncWrapper: (store) => awaitStorage(store),
            createMMKVBackend: (store) => createMMKVBackend(store),
            createFileBackend: (file) => {
              if (isPyonLoader() && file === "vendetta_theme.json") {
                file = "pyon/current-theme.json";
              }
              return createFileBackend(file);
            }
          },
          settings,
          loader: {
            identity: getVendettaLoaderIdentity() ?? void 0,
            config: loaderConfig
          },
          logger: {
            log: (...message) => console.log(...message),
            info: (...message) => console.info(...message),
            warn: (...message) => console.warn(...message),
            error: (...message) => console.error(...message),
            time: (...message) => console.time(...message),
            trace: (...message) => console.trace(...message),
            verbose: (...message) => console.log(...message)
          },
          version: versionHash,
          unload: () => {
            delete globalThis.vendetta;
          }
        };
        return () => api.unload();
      };
    }
  });

  // src/global.d.ts
  var init_global_d = __esm({
    "src/global.d.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // src/modules.d.ts
  var init_modules_d = __esm({
    "src/modules.d.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
    }
  });

  // src/lib/ui/index.ts
  var ui_exports = {};
  __export(ui_exports, {
    alerts: () => alerts_exports,
    components: () => components_exports2,
    settings: () => settings_exports2,
    sheets: () => sheets_exports,
    styles: () => styles_exports,
    toasts: () => toasts_exports
  });
  var init_ui = __esm({
    "src/lib/ui/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_alerts();
      init_components2();
      init_settings2();
      init_sheets();
      init_styles();
      init_toasts();
    }
  });

  // src/lib/index.ts
  var lib_exports = {};
  __export(lib_exports, {
    _jsx: () => jsxRuntime_exports,
    api: () => api_exports,
    fonts: () => fonts_exports,
    managers: () => managers,
    metro: () => metro_exports,
    plugins: () => plugins_exports3,
    themes: () => themes_exports,
    ui: () => ui_exports,
    unload: () => unload,
    utils: () => utils_exports
  });
  function unload() {
    for (var d2 of _disposer) if (typeof d2 === "function") d2();
    delete globalThis.bunny;
  }
  var managers, _disposer;
  var init_lib = __esm({
    "src/lib/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_global_d();
      init_modules_d();
      init_fonts();
      init_plugins4();
      init_themes();
      init_api();
      init_ui();
      init_utils();
      init_metro();
      init_fonts();
      init_plugins4();
      init_themes();
      init_jsxRuntime();
      init_lazy();
      managers = proxyLazy(() => {
        console.warn("bunny.managers.* is deprecated, and moved the top level (bunny.*). bunny.managers will be eventually removed soon");
        return {
          get fonts() {
            return fonts_exports;
          },
          get plugins() {
            return plugins_exports3;
          },
          get themes() {
            return themes_exports;
          }
        };
      }, {
        hint: "object"
      });
      _disposer = [];
      unload.push = (fn) => {
        _disposer.push(fn);
      };
    }
  });

  // src/lib/utils/timings.ts
  function start(name) {
    var t0 = now();
    var stopped = false;
    return function stop() {
      if (stopped) return 0;
      stopped = true;
      var duration = Math.max(0, now() - t0);
      record(name, duration);
      return duration;
    };
  }
  function measureSync(name, fn) {
    var t0 = now();
    try {
      return fn();
    } finally {
      var duration = Math.max(0, now() - t0);
      record(name, duration);
    }
  }
  function measureAsync(name, fn) {
    return _async_to_generator(function* () {
      var t0 = now();
      try {
        return yield fn();
      } finally {
        var duration = Math.max(0, now() - t0);
        record(name, duration);
      }
    })();
  }
  function wrap(name, fn) {
    var wrapped = function wrapped2(...args) {
      var t0 = now();
      try {
        var res = fn.apply(this, args);
        if (res && typeof res.then === "function") {
          return res.finally(() => {
            var duration2 = Math.max(0, now() - t0);
            record(name, duration2);
          });
        }
        return res;
      } finally {
        if (fn.constructor?.name !== "AsyncFunction") {
          var duration = Math.max(0, now() - t0);
          record(name, duration);
        }
      }
    };
    return wrapped;
  }
  function record(name, durationMs) {
    if (!name) name = "<unnamed>";
    var s = _stats.get(name);
    if (!s) {
      _stats.set(name, {
        name,
        calls: 1,
        totalMs: durationMs,
        lastMs: durationMs,
        minMs: durationMs,
        maxMs: durationMs
      });
      return;
    }
    s.calls += 1;
    s.lastMs = durationMs;
    s.totalMs += durationMs;
    if (durationMs < s.minMs) s.minMs = durationMs;
    if (durationMs > s.maxMs) s.maxMs = durationMs;
  }
  function report(limit = 25) {
    var rows = [];
    for (var [, s] of _stats) {
      rows.push({
        name: s.name,
        calls: s.calls,
        totalMs: s.totalMs,
        avgMs: s.calls > 0 ? s.totalMs / s.calls : 0,
        lastMs: s.lastMs,
        minMs: s.minMs,
        maxMs: s.maxMs
      });
    }
    rows.sort((a2, b) => b.totalMs - a2.totalMs);
    return rows.slice(0, limit);
  }
  function logReport(limit = 25) {
    var rows = report(limit);
    if (rows.length === 0) {
      console.info("[timings] no recorded timings");
      return;
    }
    console.groupCollapsed(`[timings] top ${rows.length} (by total ms)`);
    try {
      console.table(rows.map((r2) => ({
        name: r2.name,
        calls: r2.calls,
        totalMs: Number(r2.totalMs.toFixed(2)),
        avgMs: Number(r2.avgMs.toFixed(2)),
        lastMs: Number(r2.lastMs.toFixed(2)),
        minMs: Number(r2.minMs.toFixed(2)),
        maxMs: Number(r2.maxMs.toFixed(2))
      })));
    } catch (unused) {
      for (var r of rows) {
        console.log(`${r.name} \u2014 total ${r.totalMs.toFixed(2)}ms \u2022 avg ${r.avgMs.toFixed(2)}ms \u2022 last ${r.lastMs.toFixed(2)}ms \u2022 calls ${r.calls}`);
      }
    } finally {
      console.groupEnd();
    }
  }
  function clear() {
    _stats.clear();
  }
  function withTimingAsync(name, fn) {
    return _async_to_generator(function* () {
      var t0 = now();
      try {
        return yield fn();
      } finally {
        record(name, Math.max(0, now() - t0));
      }
    })();
  }
  function withTimingSync(name, fn) {
    var t0 = now();
    try {
      return fn();
    } finally {
      record(name, Math.max(0, now() - t0));
    }
  }
  var now, _stats, timings;
  var init_timings = __esm({
    "src/lib/utils/timings.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      now = (() => {
        if (typeof performance !== "undefined" && typeof performance.now === "function") {
          return () => performance.now();
        }
        return () => Date.now();
      })();
      _stats = /* @__PURE__ */ new Map();
      timings = {
        start,
        measureSync,
        measureAsync,
        wrap,
        record,
        report,
        logReport,
        clear,
        withTimingAsync,
        withTimingSync
      };
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    default: () => index_default
  });
  var import_react_native36, index_default;
  var init_index = __esm({
    "src/index.ts"() {
      "use strict";
      init_asyncIteratorSymbol();
      init_promiseAllSettled();
      init_weakref();
      init_async_to_generator();
      init_patchErrorBoundary();
      init_fixes();
      init_i18n();
      init_settings3();
      init_api3();
      init_fonts();
      init_themes();
      init_commands();
      init_debug();
      init_flux();
      init_jsx();
      init_logger();
      init_settings2();
      import_react_native36 = __toESM(require_react_native());
      init_debug();
      init_lib();
      init_timings();
      index_default = (() => _async_to_generator(function* () {
        var criticalInitFns = [
          [
            "initThemes",
            () => initThemes()
          ],
          [
            "injectFluxInterceptor",
            () => injectFluxInterceptor()
          ],
          [
            "patchSettings",
            () => patchSettings()
          ],
          [
            "patchLogHook",
            () => patchLogHook()
          ],
          [
            "patchCommands",
            () => patchCommands()
          ],
          [
            "patchJsx",
            () => patchJsx()
          ],
          [
            "patchErrorBoundary",
            () => patchErrorBoundary()
          ],
          [
            "initVendettaObject",
            () => initVendettaObject()
          ],
          [
            "initFetchI18nStrings",
            () => initFetchI18nStrings()
          ],
          [
            "initSettings",
            () => initSettings()
          ],
          [
            "initFixes",
            () => fixes_default()
          ],
          [
            "initDebugger",
            () => initDebugger()
          ]
        ];
        yield Promise.all(criticalInitFns.map(([name, fn]) => timings.measureAsync(`critical:${name}`, () => _async_to_generator(function* () {
          return fn();
        })()))).then((u2) => u2.forEach((f2) => f2 && unload.push(f2))).catch((e) => {
          console.warn("Critical initialization error:", e);
        });
        globalThis.bunny = lib_exports;
        logger.log("ShiggyCord: UI-critical initialization complete \u2014 deferring plugin & network work");
        var runDeferred = () => _async_to_generator(function* () {
          var { VdPluginManager: VdPluginManager2 } = yield Promise.resolve().then(() => (init_plugins(), plugins_exports));
          var { initPlugins: initPlugins2, updatePlugins: updatePlugins2 } = yield Promise.resolve().then(() => (init_plugins4(), plugins_exports3));
          yield Promise.all([
            VdPluginManager2.initPlugins().then((u2) => u2 && unload.push(u2)).catch((e) => logger.log("Vendetta init failed:", e)),
            initPlugins2().catch((e) => logger.log("initPlugins failed:", e))
          ]);
          updatePlugins2().catch((e) => logger.log("updatePlugins failed:", e));
          updateFonts().catch((e) => logger.log("updateFonts failed:", e));
        })();
        try {
          import_react_native36.InteractionManager.runAfterInteractions(() => {
            setTimeout(runDeferred, 50);
          });
        } catch (e) {
          setTimeout(runDeferred, 200);
        }
        logger.log("ShiggyCord is ready.");
      })());
    }
  });

  // src/entry.ts
  init_asyncIteratorSymbol();
  init_promiseAllSettled();
  init_weakref();
  init_async_to_generator();
  var { instead: instead3 } = require_dist();
  globalThis.window = globalThis;
  function initializeShiggyCord() {
    return _async_to_generator(function* () {
      try {
        yield (init_caches(), __toCommonJS(caches_exports)).initMetroCache();
        (init_index(), __toCommonJS(index_exports)).default();
      } catch (e) {
        var { ClientInfoManager } = (init_modules(), __toCommonJS(modules_exports));
        var stack = e instanceof Error ? e.stack : void 0;
        console.log(stack ?? e?.toString?.() ?? e);
        alert([
          "Failed to load ShiggyCord!\n",
          `Build Number: ${ClientInfoManager.getConstants().Build}`,
          `ShiggyCord: ${"1.4.1.11"}`,
          stack || e?.toString?.()
        ].join("\n"));
      }
    })();
  }
  if (typeof globalThis.__r === "undefined") {
    deferredCalls = [];
    unpatches = [];
    deferMethodExecution = (object, method, condition, resume, returnWith) => {
      var restore = instead3(method, object, function(args, original) {
        if (!condition || condition(...args)) {
          var queue = {
            object,
            method,
            args,
            resume
          };
          deferredCalls.push(queue);
          return returnWith ? returnWith(queue) : void 0;
        }
        return original.apply(this, args);
      });
      unpatches.push(restore);
    };
    resumeDeferred = () => {
      for (var queue of deferredCalls) {
        var { object, method, args, resume } = queue;
        if (resume) {
          resume(queue);
        } else {
          object[method](...args);
        }
      }
      deferredCalls.length = 0;
    };
    onceIndexRequired = (originalRequire) => {
      if (globalThis.__fbBatchedBridge) {
        var batchedBridge = globalThis.__fbBatchedBridge;
        deferMethodExecution(
          batchedBridge,
          "callFunctionReturnFlushedQueue",
          // If the call is to AppRegistry, we want to defer it because it is not yet registered (Revenge delays it)
          // Same goes to the non-callable modules, which are not registered yet, so we ensure that only registered ones can get through
          (...args) => args[0] === "AppRegistry" || !batchedBridge.getCallableModule(args[0]),
          ({ args }) => {
            if (batchedBridge.getCallableModule(args[0])) {
              batchedBridge.__callFunction(...args);
            }
          },
          () => batchedBridge.flushedQueue()
        );
      }
      if (globalThis.RN$AppRegistry) {
        deferMethodExecution(globalThis.RN$AppRegistry, "runApplication");
      }
      var startDiscord = () => _async_to_generator(function* () {
        yield initializeShiggyCord();
        for (var unpatch2 of unpatches) unpatch2();
        unpatches.length = 0;
        originalRequire(0);
        resumeDeferred();
      })();
      startDiscord();
    };
    Object.defineProperties(globalThis, {
      __r: {
        configurable: true,
        get: () => _requireFunc,
        set(v2) {
          _requireFunc = function patchedRequire(a2) {
            if (a2 === 0) {
              if (globalThis.modules instanceof Map) globalThis.modules = Object.fromEntries(globalThis.modules);
              onceIndexRequired(v2);
              _requireFunc = v2;
            } else return v2(a2);
          };
        }
      },
      __d: {
        configurable: true,
        get() {
          if (globalThis.Object && !globalThis.modules) {
            globalThis.modules = globalThis.__c?.();
          }
          return this.value;
        },
        set(v2) {
          this.value = v2;
        }
      }
    });
  } else {
    initializeShiggyCord();
  }
  var _requireFunc;
  var deferredCalls;
  var unpatches;
  var deferMethodExecution;
  var resumeDeferred;
  var onceIndexRequired;
})();
