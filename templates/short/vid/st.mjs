import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
const BE = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
// usage: node st.mjs COMP prefix t1 t2 ...   (env SC scale, PROPS json)
const [id, pre, ...ts] = process.argv.slice(2);
const props = JSON.parse(process.env.PROPS || "{}");
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl, id, inputProps: props, browserExecutable: BE });
for (const t of ts) {
  await renderStill({ composition: comp, serveUrl, inputProps: props, output: `../stills/${pre}_${t}.${process.env.JPG ? "jpg" : "png"}`, ...(process.env.JPG ? { imageFormat: "jpeg", jpegQuality: 95 } : { imageFormat: "png" }), frame: Math.round(Number(t) * 30), scale: Number(process.env.SC || 0.5), browserExecutable: BE });
}
