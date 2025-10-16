export class DomainError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
  }
}
