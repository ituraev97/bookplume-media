import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
const BE = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const jobs = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const cache = {};
for (const j of jobs) {
  const key = j.id + JSON.stringify(j.props || {});
  if (!cache[key]) cache[key] = await selectComposition({ serveUrl, id: j.id, inputProps: j.props || {}, browserExecutable: BE });
  const jpg = j.out.endsWith(".jpg");
  await renderStill({ composition: cache[key], serveUrl, inputProps: j.props || {}, output: j.out, frame: Math.round((j.t || 0) * 30), scale: j.scale || 0.5, browserExecutable: BE, ...(jpg ? { imageFormat: "jpeg", jpegQuality: 95 } : { imageFormat: "png" }) });
  console.log("ok", j.out);
}
