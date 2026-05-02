import { copyFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "../dist/public");
const src = resolve(dist, "index.html");

const routes = ["privacy", "terms"];

for (const route of routes) {
  mkdirSync(resolve(dist, route), { recursive: true });
  copyFileSync(src, resolve(dist, route, "index.html"));
  console.log(`copied index.html → ${route}/index.html`);
}
