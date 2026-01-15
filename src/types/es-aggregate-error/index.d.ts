declare module "es-aggregate-error" {
  export default class AggregateError extends Error {
    errors: unknown[];
    constructor(errors?: unknown[], message?: string);
  }
}
