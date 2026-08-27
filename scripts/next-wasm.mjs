import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const command = process.argv[2] ?? "dev";
const nextBin = join(projectRoot, "node_modules", "next", "dist", "bin", "next");
const wasmDirectory = join(projectRoot, "node_modules", "@next", "swc-wasm-nodejs");
const useWebpack = command === "dev" || command === "build";

if (!existsSync(nextBin) || !existsSync(join(wasmDirectory, "wasm.js"))) {
  console.error("Next.js or its WASM compiler is missing. Run npm install first.");
  process.exit(1);
}

const child = spawn(
  process.execPath,
  [nextBin, command, ...(useWebpack ? ["--webpack"] : []), ...process.argv.slice(3)],
  {
    cwd: projectRoot,
    env: { ...process.env, NEXT_TEST_WASM_DIR: wasmDirectory },
    stdio: "inherit",
    windowsHide: true,
  },
);

child.on("error", (error) => {
  console.error(error);
  process.exit(1);
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
