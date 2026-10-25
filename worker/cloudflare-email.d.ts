/** Minimal typing for the Workers runtime module, so the worker type-checks without @cloudflare/workers-types. */
declare module "cloudflare:email" {
  export class EmailMessage {
    constructor(from: string, to: string, raw: string);
    readonly from: string;
    readonly to: string;
  }
}
