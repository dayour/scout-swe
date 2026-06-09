export class ScoutApiError extends Error {
  readonly status: number;
  readonly url: string;
  readonly body: unknown;

  constructor(message: string, status: number, url: string, body: unknown) {
    super(message);
    this.name = "ScoutApiError";
    this.status = status;
    this.url = url;
    this.body = body;
  }
}
