import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
const BE = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl, id: "Thumb", browserExecutable: BE });
await renderStill({ composition: comp, serveUrl, output: process.argv[2] || "../thumb.jpg", imageFormat: "jpeg", jpegQuality: 90, frame: 0, browserExecutable: BE });
