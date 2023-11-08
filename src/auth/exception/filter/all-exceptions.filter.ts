import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;
    let message =
      exceptionResponse &&
      typeof exceptionResponse === "object" &&
      "message" in exceptionResponse
        ? exceptionResponse["message"]
        : "Internal server error";

    if (Array.isArray(message)) {
      message = message[0];
    }

    response.status(status).json({
      statusCode: status,
      msg: message,
    });
  }
}
