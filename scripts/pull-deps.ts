#!/usr/bin/env bun
/** biome-ignore-all lint/suspicious/noConsole: <Not in the runtime> */

/**
 * ! ONLY USE FOR DEVELOPMENT PURPOSE, ESPECIALLY FOR UPDATING
 * ! MAKE SURE YOU ALREADY HAVE GIT INSTALLED
 *
 * Clones g0ldyy FH6 Universal Radio Repositories to `deps/` directory.
 * (Will do `git pull` if directory already exists).
 *
 * The repositories will be used for generating their server API and schema.
 */
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { $ } from "bun";

interface DepConfig {
  /** Folder name will be created as `deps/<name>`*/
  name: string;

  /** Git URL */
  repo: string;

  /** Branch to pull. Default to `main` */
  branch?: string;
}

const ROOT_DIR = resolve(__dirname, "..");
const DEPS_DIR = resolve(ROOT_DIR, "deps");

const deps: DepConfig[] = [
  {
    name: "fh6-universal-radio",
    repo: "git@github.com:g0ldyy/fh6-universal-radio.git",
  },
];

async function syncDep(dep: DepConfig) {
  const targetPath = resolve(DEPS_DIR, dep.name);

  if (existsSync(targetPath)) {
    console.log(`Pulling latest for ${dep.name}`);
    await $`git -C ${targetPath} pull`;
  } else {
    console.log(`Cloning ${dep.name}`);
    if (dep.branch) {
      await $`git clone --branch ${dep.branch} ${dep.repo} ${targetPath}`;
    } else {
      await $`git clone ${dep.repo} ${targetPath}`;
    }
  }

  console.log(`\t${dep.name} ready`);
}

async function main() {
  mkdirSync(DEPS_DIR, { recursive: true });

  const onlyIndex = process.argv.indexOf("--only");
  const only = onlyIndex !== -1 ? process.argv[onlyIndex + 1] : null;

  const targets = only ? deps.filter((d) => d.name === only) : deps;

  if (targets.length === 0) {
    console.error(`No matching deps found`);
    process.exit(1);
  }

  for (const dep of targets) await syncDep(dep);
}

main().catch((err) => {
  console.error(`Failed to sync dependencies`, err);
  process.exit(1);
});
