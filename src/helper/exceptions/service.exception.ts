import { IErrorResponse } from "../interfaces/error/error.interface";

export class ServiceException extends Error {
  public code: number = 400;
  constructor(error: IErrorResponse) {
    super(error.error);
    this.name = 'Service Exception';
    this.code = error.status || this.code;
  }
}
