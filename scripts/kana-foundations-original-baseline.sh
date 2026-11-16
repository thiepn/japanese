#!/usr/bin/env bash
# Reproduce the October 26 original Google AI Studio integration in an isolated
# detached worktree. Never checks out or mutates main, live app or learner data.
set -euo pipefail
ORIGINAL_SHA="5974a2353d9d001aae47a1dde846f6839e95b3c7"
REPO="$(git rev-parse --show-toplevel)"
DEST="$1"
if [[ -n "$DEST" && "$DEST" != /* ]]; then
  echo "Output destination must be an absolute temporary path." >&2
  exit 2
fi
SCRATCH="$(mktemp -d "/tmp/kana-original-XXXXXXXX")"
CHECKOUT="$SCRATCH/historical"
cleanup() {
  git -C "$REPO" worktree remove --force "$CHECKOUT" >/dev/null 2>&1 || true
  rm -rf "$SCRATCH"
}
trap cleanup EXIT
git -C "$REPO" cat-file -e "$ORIGINAL_SHA^{commit}"
git -C "$REPO" worktree add --detach "$CHECKOUT" "$ORIGINAL_SHA"
test -s "$CHECKOUT/apps/kana-studio/src/main.tsx"
grep -q "createRoot" "$CHECKOUT/apps/kana-studio/src/main.tsx"
echo "Reproducing original Kana Studio from $ORIGINAL_SHA (detached temporary checkout)"
(
 cd "$CHECKOUT"
 pnpm install --no-frozen-lockfile
 pnpm --filter @thiepn/japanese-kana-studio build
 test -s "apps/kana-studio/dist/index.html"
)
if [[ -n "$DEST" ]]; then
  mkdir -p "$DEST"
  cp -R "$CHECKOUT/apps/kana-studio/dist/." "$DEST/"
  printf '%s\n' "$ORIGINAL_SHA" > "$DEST/ORIGINAL_COMMIT.txt"
fi
echo "Original standalone Kana Studio built from pinned historical source."
