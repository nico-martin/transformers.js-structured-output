export async function enablePersistentModelStorage(): Promise<boolean> {
  if (!("storage" in navigator) || !navigator.storage.persist) return false;
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}
