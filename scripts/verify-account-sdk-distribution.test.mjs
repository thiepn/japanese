import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { mkdtemp, mkdir, writeFile, rm, symlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  ACCOUNT_SDK_BLOBS,
  ACCOUNT_SDK_SOURCE_COMMIT,
  gitBlobSha256CompatibleGitSha1,
  inspectAccountSdkDistribution,
} from "./verify-account-sdk-distribution.mjs";

const metadata = JSON.stringify({
  name: "@thiepn/account-session",
  version: "0.1.0",
  private: false,
  type: "module",
  exports: { ".": "./src/index.ts" },
  license: "SEE LICENSE IN LICENSE",
});
const sample = {
  "LICENSE": "THIEPN first-party fixture; not the actual Account license",
  "package.json": metadata,
  "src/browser-sso.ts": "export const browserSso = true;\n",
  "src/index.ts": "export const accountSession = true;\n",
};

async function fixture() {
  const dir = await mkdtemp(join(tmpdir(), "jp-account-sdk-test-"));
  await mkdir(join(dir, "src"));
  for (const [name, source] of Object.entries(sample)) {
    await writeFile(join(dir, name), source);
  }
  return {
    dir,
    pins: Object.fromEntries(
      Object.entries(sample).map(([name, source]) => [
        name, gitBlobSha256CompatibleGitSha1(source),
      ]),
    ),
  };
}

describe("Account private SDK source distribution guard", () => {
  it("pins exact upstream Account commit and four Git blob identifiers", () => {
    assert.match(ACCOUNT_SDK_SOURCE_COMMIT, /^[a-f0-9]{40}$/);
    assert.deepEqual(Object.keys(ACCOUNT_SDK_BLOBS).sort(), Object.keys(sample).sort());
    for (const sha of Object.values(ACCOUNT_SDK_BLOBS)) assert.match(sha, /^[a-f0-9]{40}$/);
    assert.equal(
      gitBlobSha256CompatibleGitSha1("test content\n"),
      "d670460b4b4aece5915caf5c68d12f560a9fe3e4",
    );
  });

  it("does not treat absence of an operator-staged package as approval", async () => {
    await assert.rejects(
      inspectAccountSdkDistribution(""),
      /ACCOUNT_SDK_PACKAGE_ROOT_REQUIRED/,
    );
  });

  it("accepts byte-for-byte staged source with matching pins, but never grants release", async () => {
    const { dir, pins } = await fixture();
    try {
      const result = await inspectAccountSdkDistribution(dir, pins);
      assert.equal(result.status, "SOURCE_BLOBS_MATCH_PINNED_ACCOUNT_COMMIT");
      assert.equal(result.releaseAuthorized, false);
      assert.equal(result.humanApproved, false);
      assert.equal(result.clientRegistered, false);
      assert.deepEqual(result.checkedFiles, pins);
    } finally { await rm(dir, { recursive: true, force: true }); }
  });

  it("rejects mutated bytes even when package metadata still looks valid", async () => {
    const { dir, pins } = await fixture();
    try {
      await writeFile(join(dir, "src/index.ts"), "tampered source");
      await assert.rejects(
        inspectAccountSdkDistribution(dir, pins),
        /ACCOUNT_SDK_DISTRIBUTION_HASH_MISMATCH:src\/index.ts/,
      );
    } finally { await rm(dir, { recursive: true, force: true }); }
  });

  it("rejects unexpected material and symlinks instead of silently packaging extras", async () => {
    const { dir, pins } = await fixture();
    try {
      await writeFile(join(dir, "src/unknown.js"), "unknown");
      await assert.rejects(
        inspectAccountSdkDistribution(dir, pins),
        /ACCOUNT_SDK_DISTRIBUTION_UNEXPECTED_FILES/,
      );
      await rm(join(dir, "src/unknown.js"));
      await rm(join(dir, "src/index.ts"));
      await symlink(join(dir, "LICENSE"), join(dir, "src/index.ts"));
      await assert.rejects(
        inspectAccountSdkDistribution(dir, pins),
        /ACCOUNT_SDK_DISTRIBUTION_UNSAFE_FILE:src\/index.ts/,
      );
    } finally { await rm(dir, { recursive: true, force: true }); }
  });

  it("rejects a plausible but wrong Account package manifest without publishing it", async () => {
    const { dir, pins } = await fixture();
    try {
      const fake = metadata.replace("@thiepn/account-session", "@thiepn/other-app");
      await writeFile(join(dir, "package.json"), fake);
      const altered = { ...pins, "package.json": gitBlobSha256CompatibleGitSha1(fake) };
      await assert.rejects(
        inspectAccountSdkDistribution(dir, altered),
        /ACCOUNT_SDK_DISTRIBUTION_METADATA_INVALID/,
      );
    } finally { await rm(dir, { recursive: true, force: true }); }
  });
});
