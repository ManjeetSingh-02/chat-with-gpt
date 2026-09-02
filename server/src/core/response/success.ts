// class to standardize API Success Response
export class SuccessResponse<D = undefined, M = undefined> {
  readonly success = true;
  readonly message: string;
  readonly data?: D;
  readonly meta?: M;

  // constructor to initialize SuccessResponse
  constructor({ message, data, meta }: { message: string; data?: D; meta?: M }) {
    // assign the properties to the instance
    this.message = message;
    if (data !== undefined) this.data = data;
    if (meta !== undefined) this.meta = meta;
  }
}
