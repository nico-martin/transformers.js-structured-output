import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SPACE_REPOSITORY =
  "git@hf.co:spaces/nico-martin/transformers.js-structured-output";
const SPACE_URL =
  "https://huggingface.co/spaces/nico-martin/transformers.js-structured-output";
const GITHUB_URL =
  "https://github.com/nico-martin/transformers.js-structured-output";
const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDirectory = join(projectDirectory, "dist");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: projectDirectory,
    stdio: "inherit",
    ...options,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} exited with status ${result.status}`
    );
  }
}

run("pnpm", ["run", "build"]);
const temporaryDirectory = mkdtempSync(
  join(tmpdir(), "structured-output-deploy-")
);
const spaceDirectory = join(temporaryDirectory, "space");

try {
  run("git", ["clone", "--depth", "1", SPACE_REPOSITORY, spaceDirectory]);
  run("git", ["xet", "install", "--local"], { cwd: spaceDirectory });
  run("git", ["lfs", "track", "*.wasm"], { cwd: spaceDirectory });

  for (const entry of readdirSync(spaceDirectory)) {
    if ([".git", ".gitattributes", "README.md"].includes(entry)) continue;
    rmSync(join(spaceDirectory, entry), { recursive: true, force: true });
  }

  for (const entry of readdirSync(distDirectory)) {
    cpSync(join(distDirectory, entry), join(spaceDirectory, entry), {
      recursive: true,
    });
  }

  const readmePath = join(spaceDirectory, "README.md");
  if (!existsSync(readmePath)) {
    writeFileSync(
      readmePath,
      "---\ntitle: Transformers.js Structured Output\nsdk: static\napp_file: index.html\npinned: false\n---\n"
    );
  }
  const githubContext =
    `This playground showcases JSON Schema and regex constraints for language models running locally in the browser with Transformers.js. Compare constrained and unconstrained output with event extraction, color palette, and URL slug examples.\n\n` +
    `Explore the implementation and run the demo yourself in the [GitHub repository](${GITHUB_URL}).`;
  let readme = readFileSync(readmePath, "utf8")
    .replace(
      /^Check out the configuration reference at https:\/\/huggingface\.co\/docs\/hub\/spaces-config-reference[^\r\n]*\r?\n?/gm,
      ""
    )
    .replace(`[Source code on GitHub](${GITHUB_URL})`, githubContext);
  if (!readme.includes(GITHUB_URL)) {
    readme = `${readme.trimEnd()}\n\n${githubContext}\n`;
  }
  writeFileSync(readmePath, `${readme.trimEnd()}\n`);

  run("git", ["add", "--all"], { cwd: spaceDirectory });
  const diff = spawnSync("git", ["diff", "--cached", "--quiet"], {
    cwd: spaceDirectory,
    stdio: "inherit",
  });

  if (diff.error) throw diff.error;
  if (diff.status === 0) {
    console.log("The Space is already up to date.");
  } else if (diff.status === 1) {
    run("git", ["commit", "-m", "Deploy production build"], {
      cwd: spaceDirectory,
    });
    run("git", ["push", "origin", "HEAD:main"], { cwd: spaceDirectory });
    console.log(`Deployed to ${SPACE_URL}`);
  } else {
    throw new Error(`git diff exited with status ${diff.status}`);
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
