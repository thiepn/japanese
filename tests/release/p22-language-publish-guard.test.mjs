import { describe, expect, it } from "vitest";
import { GuardedLanguagePublisher } from "../../apps/web/src/study/guardedLanguagePublish";

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((ok, fail) => { resolve = ok; reject = fail; });
  return { promise, resolve, reject };
}

function harness() {
  const guard = new GuardedLanguagePublisher();
  let owner = "account-A";
  let reader = "account-A";
  let auth = "account-A";
  let status = "authenticated";
  let connected = true;
  let published = [];
  let token = "token-A";
  const options = {
    readAuth: async () => ({ status, accountId: auth }),
    isConnected: async () => connected,
    currentStudyAccount: () => owner,
    currentReaderAccount: () => reader,
    readModel: async () => ({ due: 7, owner }),
    accessToken: async () => token,
    send: async (model, getToken) => {
      const bearer = await getToken();
      if (!bearer) throw new Error("AUTH_REQUIRED");
      published.push({ model, bearer });
      return "sent";
    },
  };
  return {
    guard, options, published,
    switchTo: (id) => { owner = id; reader = id; auth = id; guard.invalidate(); },
    setOwner: (id) => { owner = id; },
    setReader: (id) => { reader = id; },
    setAuth: (id, nextStatus = "authenticated") => { auth = id; status = nextStatus; },
    setConnected: (value) => { connected = value; },
    setToken: (value) => { token = value; },
  };
}

describe("P22 Japanese language dashboard account isolation", () => {
  it("publishes the correct owner's model with their bearer token", async () => {
    const h = harness();
    expect(await h.guard.publish(h.options)).toBe("sent");
    expect(h.published).toEqual([{model:{due:7,owner:"account-A"},bearer:"token-A"}]);
  });

  it("drops a read model if the active study and auth identities change during IndexedDB work", async () => {
    const h = harness();
    const reading = deferred();
    const readStarted = deferred();
    const sending = h.guard.publish({
      ...h.options,
      readModel: () => { readStarted.resolve(); return reading.promise; },
    });
    await readStarted.promise;
    h.switchTo("account-B");
    h.setToken("token-B");
    reading.resolve({due:11,owner:"account-A"});
    expect(await sending).toBeNull();
    expect(h.published).toEqual([]);
  });

  it("rejects old A data after A -> B -> A, even though the account ID matches again", async () => {
    const h = harness();
    const reading = deferred();
    const readStarted = deferred();
    const previous = h.guard.publish({
      ...h.options,
      readModel: () => { readStarted.resolve(); return reading.promise; },
    });
    await readStarted.promise;
    h.switchTo("account-B");
    h.switchTo("account-A");
    reading.resolve({due:99,owner:"account-A"});
    expect(await previous).toBeNull();
    expect(h.published).toEqual([]);
  });

  it("does not publish a stale same-owner model after a newer publish starts", async () => {
    const h = harness();
    const oldReading = deferred();
    const readStarted = deferred();
    const older = h.guard.publish({
      ...h.options,
      readModel: () => { readStarted.resolve(); return oldReading.promise; },
    });
    await readStarted.promise;
    expect(await h.guard.publish({...h.options,readModel:async()=>({due:2,owner:"account-A"})})).toBe("sent");
    oldReading.resolve({due:32,owner:"account-A"});
    expect(await older).toBeNull();
    expect(h.published).toEqual([{model:{due:2,owner:"account-A"},bearer:"token-A"}]);
  });

  it("rechecks account identity after an awaited token fetch, before any network send", async () => {
    const h = harness();
    const pendingToken = deferred();
    const tokenStarted = deferred();
    const sending = h.guard.publish({
      ...h.options,
      accessToken: () => { tokenStarted.resolve(); return pendingToken.promise; },
    });
    await tokenStarted.promise;
    h.switchTo("account-B");
    pendingToken.resolve("token-B");
    await expect(sending).rejects.toThrow("AUTH_REQUIRED");
    expect(h.published).toEqual([]);
  });

  it("does not send if Account connection is revoked during local read", async () => {
    const h = harness();
    const reading = deferred();
    const readStarted = deferred();
    const sending = h.guard.publish({
      ...h.options,
      readModel: () => { readStarted.resolve(); return reading.promise; },
    });
    await readStarted.promise;
    h.setConnected(false);
    reading.resolve({due:3,owner:"account-A"});
    expect(await sending).toBeNull();
    expect(h.published).toEqual([]);
  });

  it("rejects mismatched reader identity and expired authentication", async () => {
    const h = harness();
    h.setReader("account-B");
    expect(await h.guard.publish(h.options)).toBeNull();
    h.setReader("account-A");
    h.setAuth(null,"expired");
    expect(await h.guard.publish(h.options)).toBeNull();
    expect(h.published).toEqual([]);
  });

  it("does not silently mark a failed read as published", async () => {
    const h = harness();
    await expect(h.guard.publish({
      ...h.options,
      readModel: async () => { throw new Error("IDB unavailable"); },
    })).rejects.toThrow("IDB unavailable");
    expect(h.published).toEqual([]);
  });
});
