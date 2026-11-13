import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
const BE = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const times = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl, id: "Main", browserExecutable: BE });
for (const t of times) {
  await renderStill({ composition: comp, serveUrl, output: `../stills/s_${t}.png`, frame: Math.round(t * 30), scale: 0.5, browserExecutable: BE });
}
