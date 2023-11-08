import {
  Catch,
  HttpStatus,
  ArgumentsHost,
  ExceptionFilter,
} from "@nestjs/common";
import { Response } from "express";
import { BaseException } from "../ownership.checker.exceptions";

@Catch(BaseException)
export class AppBaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: exception.message,
      error: "Internal Server Error",
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error);
  }
}
