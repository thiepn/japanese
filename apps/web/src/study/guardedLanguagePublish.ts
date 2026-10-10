/**
 * An asynchronous language-dashboard publish must remain bound to the same
 * authenticated learner throughout read-model construction and token acquisition.
 * Invalidation on workspace change also rejects A -> B -> A transitions.
 *
 * Already-started network requests cannot be canceled by this guard; the server
 * remains responsible for authenticating every incoming mutation.
 */
export interface PublishAuthContext {
  readonly status: string;
  readonly accountId: string | null;
}

export interface GuardedPublishOptions<T, Result> {
  readonly readAuth: () => Promise<PublishAuthContext>;
  readonly isConnected: () => Promise<boolean>;
  readonly currentStudyAccount: () => string;
  readonly currentReaderAccount: () => string;
  readonly readModel: () => Promise<T>;
  readonly accessToken: () => Promise<string | null>;
  readonly send: (model: T, accessToken: () => Promise<string | null>) => Promise<Result>;
}

export class GuardedLanguagePublisher {
  private generation = 0;

  invalidate(): void {
    this.generation++;
  }

  async publish<T, Result>(options: GuardedPublishOptions<T, Result>): Promise<Result | null> {
    const generation = ++this.generation;
    const starting = await options.readAuth();
    const owner = starting.status === "authenticated" ? starting.accountId : null;
    if (!owner) return null;

    const stillAuthorized = async (): Promise<boolean> => {
      if (
        this.generation !== generation ||
        options.currentStudyAccount() !== owner ||
        options.currentReaderAccount() !== owner
      ) return false;
      const live = await options.readAuth();
      return (
        this.generation === generation &&
        live.status === "authenticated" &&
        live.accountId === owner &&
        options.currentStudyAccount() === owner &&
        options.currentReaderAccount() === owner
      );
    };

    if (!(await stillAuthorized()) || !(await options.isConnected()) || !(await stillAuthorized()))
      return null;

    const model = await options.readModel();

    // Auth, connection and workspace may all have changed while IndexedDB read.
    if (!(await stillAuthorized()) || !(await options.isConnected()) || !(await stillAuthorized()))
      return null;

    return options.send(model, async () => {
      if (!(await stillAuthorized())) return null;
      const token = await options.accessToken();
      // Do not give a new account's token to a previous account's read model.
      return token && (await stillAuthorized()) ? token : null;
    });
  }
}
