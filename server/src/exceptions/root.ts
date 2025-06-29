export enum ErrorCode {
  INTERNAL_EXCEPTION = 100,
  USER_ALREADY_EXISTS = 101,
  PASSWORD_MISMATCH = 102,
  USER_NOT_FOUND = 103,
  INVALID_CREDENTIALS = 104,
  ACCOUNT_INACTIVE = 105,
  ACCOUNT_PENDING = 106,
  TOKEN_REQUIRED = 107,
  INVALID_TOKEN = 108,
  CUSTOMER_ALREADY_EXISTS = 109,
  CUSTOMER_NOT_FOUND = 110,
  DELIVER_NOT_FOUND = 111,
  ROUTING_AREA_NOT_FOUND = 112,
  SENDER_NOT_FOUND = 113,
  MAIL_NOT_FOUND = 114,
  ROUTING_AREA_ALREADY_EXISTS = 115,
  INVALID_MAIL_STATUS = 116,
  MAIL_STATUS_ALREADY_EXISTS = 117,
  ROUTING_AREA_REQUIRED = 118,
  BILL_NOT_FOUND = 119,
  RECEIVER_NOT_FOUND = 120,
  EMPLOYEE_NOT_FOUND = 121,
  USERNAME_ALREADY_EXISTS = 122,
  EMAIL_ALREADY_EXISTS = 123,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export class HttpException extends Error {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  errors: any;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    error: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = error;
  }
}
