import { defineCorePlugin } from "..";

export default defineCorePlugin({
  manifest: {
    id: "bunny.enhancements",
    version: "0.1.0",
    type: "plugin",
    spec: 3,
    main: "",
    display: {
      name: "Shiggy Enhancements",
      description:
        "Fixes common discord bugs because discord wont (originally Kettu Enhancements)",
      authors: [{ name: "cocobo1" }, { name: "Shiggy Team" }],
    },
  },
  start() {},
});
