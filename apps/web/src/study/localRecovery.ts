import {
  exportLocalWorkspaceBackup,
  restoreLocalWorkspaceBackup,
} from "@thiepn/local-db/backup";

/**
 * Device-only recovery for the exact Japanese workspace selected in the UI.
 * A caller-supplied lease fences late export/restore after sign-out or switch.
 * The existing native backup engine owns SHA-256, per-store owner integrity,
 * all-or-nothing empty-destination restore, and exclusion of Core sync cursors.
 */
const MAX_FILE_BYTES = 128 * 1024 * 1024;

function assertWorkspace(current: () => boolean): void {
  if (!current()) throw new Error("JAPANESE_BACKUP_WORKSPACE_CHANGED");
}

export async function prepareLocalWorkspaceDownload(
  workspaceId: string,
  isCurrent: () => boolean,
): Promise<string> {
  assertWorkspace(isCurrent);
  const raw = await exportLocalWorkspaceBackup(workspaceId);
  assertWorkspace(isCurrent);
  return raw;
}

export async function restoreLocalWorkspaceFile(
  workspaceId: string,
  file: Pick<File, "size" | "text">,
  isCurrent: () => boolean,
): Promise<void> {
  assertWorkspace(isCurrent);
  if (file.size > MAX_FILE_BYTES) throw new Error("JAPANESE_BACKUP_SIZE_INVALID");
  const raw = await file.text();
  assertWorkspace(isCurrent);
  await restoreLocalWorkspaceBackup(workspaceId, raw, isCurrent);
  assertWorkspace(isCurrent);
}

/** Never upload a backup, attach it to a support request, or retain its URL. */
export function downloadLocalWorkspaceFile(workspaceId: string, raw: string): void {
  const kind = workspaceId === "guest" ? "guest" : "account";
  const file = new Blob([raw], { type: "application/json" });
  const url = URL.createObjectURL(file);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `japanese-${kind}-local-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    try { anchor.click(); }
    finally { anchor.remove(); }
  } finally {
    // Browser downloads copy the blob when followed; release the object URL
    // after the click has reached the browser's download handler.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export function localRecoveryErrorMessage(error: unknown): string {
  const code = error instanceof Error ? error.message : "";
  if (code === "JAPANESE_BACKUP_DESTINATION_NOT_EMPTY")
    return "Restore was not applied: this device's current workspace already contains data. Existing progress was not overwritten.";
  if (code === "JAPANESE_BACKUP_WORKSPACE_CHANGED")
    return "The active study workspace changed. The backup operation was cancelled without switching accounts.";
  if (code === "JAPANESE_BACKUP_HEADER_INVALID" || code === "JAPANESE_BACKUP_OWNER_MISMATCH")
    return "This backup belongs to a different Japanese workspace or has an invalid header. Nothing was imported.";
  if (code.startsWith("JAPANESE_BACKUP_"))
    return "The selected backup failed validation or could not be restored. Existing progress was not overwritten.";
  return "Local backup is unavailable on this device right now. Existing study data was not changed.";
}
