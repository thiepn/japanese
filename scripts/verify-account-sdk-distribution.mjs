#!/usr/bin/env node
/**
 * Offline acceptance of an OPERATOR-SUPPLIED unpacked Account SDK.
 * Does not fetch a private repo, publish SDK bytes, access OAuth credentials
 * or authorize production activation. Git blob identity pins the exact
 * source contents from Account commit 7ebde5df82ecfba6ed0aed6ffbcfccafff493da9.
 */
import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

export const ACCOUNT_SDK_SOURCE_COMMIT =
  "7ebde5df82ecfba6ed0aed6ffbcfccafff493da9";

export const ACCOUNT_SDK_BLOBS = Object.freeze({
  "LICENSE": "7a3093d3cfdeb453457189c3b46f5cd594f1daab",
  "package.json": "a0cb26f238960c7c543cd9b64877a89625337528",
  "src/browser-sso.ts": "30dd645a93955671021e24d8999c2988a5303e34",
  "src/index.ts": "ae0a99369476b2d114de4b57528e212b460bb551",
});

export function gitBlobSha256CompatibleGitSha1(bytes) {
  const data = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  return createHash("sha1")
    .update(`blob ${data.length}\0`, "utf8")
    .update(data)
    .digest("hex");
}

async function exactDirectory(directory, names) {
  const stat = await lstat(directory);
  if (!stat.isDirectory() || stat.isSymbolicLink()) {
    throw new Error("ACCOUNT_SDK_DISTRIBUTION_UNSAFE_PATH");
  }
  const actual = (await readdir(directory)).sort();
  if (JSON.stringify(actual) !== JSON.stringify([...names].sort())) {
    throw new Error("ACCOUNT_SDK_DISTRIBUTION_UNEXPECTED_FILES");
  }
}

export async function inspectAccountSdkDistribution(
  root,
  expectedBlobs = ACCOUNT_SDK_BLOBS,
) {
  if (typeof root !== "string" || !root.trim()) {
    throw new Error("ACCOUNT_SDK_PACKAGE_ROOT_REQUIRED");
  }
  const directory = resolve(root);
  await exactDirectory(directory, ["LICENSE", "package.json", "src"]);
  await exactDirectory(join(directory, "src"), ["browser-sso.ts", "index.ts"]);

  const files = {};
  for (const [relative, pinnedSha] of Object.entries(expectedBlobs)) {
    const file = join(directory, relative);
    const stat = await lstat(file);
    if (!stat.isFile() || stat.isSymbolicLink()) {
      throw new Error(`ACCOUNT_SDK_DISTRIBUTION_UNSAFE_FILE:${relative}`);
    }
    const bytes = await readFile(file);
    const actual = gitBlobSha256CompatibleGitSha1(bytes);
    if (actual !== pinnedSha) {
      throw new Error(`ACCOUNT_SDK_DISTRIBUTION_HASH_MISMATCH:${relative}`);
    }
    files[relative] = actual;
  }
  const metadata = JSON.parse(await readFile(join(directory, "package.json"), "utf8"));
  if (
    metadata.name !== "@thiepn/account-session" ||
    metadata.version !== "0.1.0" ||
    metadata.private !== false ||
    metadata.type !== "module" ||
    metadata.exports?.["."] !== "./src/index.ts" ||
    metadata.license !== "SEE LICENSE IN LICENSE"
  ) {
    throw new Error("ACCOUNT_SDK_DISTRIBUTION_METADATA_INVALID");
  }
  // Original first-party license, not MIT/CC0. Consumer publication/use
  // remains subject to the operator and rightsholder's authorization.
  return Object.freeze({
    status: "SOURCE_BLOBS_MATCH_PINNED_ACCOUNT_COMMIT",
    upstreamCommit: ACCOUNT_SDK_SOURCE_COMMIT,
    checkedFiles: files,
    clientRegistered: false,
    humanApproved: false,
    releaseAuthorized: false,
  });
}

async function cli(argv) {
  if (argv.length !== 2 || argv[0] !== "--package-root") {
    process.stderr.write(
      "Usage: node scripts/verify-account-sdk-distribution.mjs --package-root /operator/staged/account-session\n" +
      "No SDK package is bundled; missing operator-provided bytes are NOT_TESTED.\n",
    );
    process.exitCode = 2;
    return;
  }
  try {
    const result = await inspectAccountSdkDistribution(argv[1]);
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  } catch (error) {
    process.stderr.write(
      `${error instanceof Error ? error.message : "ACCOUNT_SDK_DISTRIBUTION_INVALID"}\n`,
    );
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await cli(process.argv.slice(2));
}
