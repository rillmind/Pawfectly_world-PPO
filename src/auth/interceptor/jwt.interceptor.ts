import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from "@nestjs/common";
import { Observable } from "rxjs";
import * as jwt from "jsonwebtoken";

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.[1]; // Pega o token do cabeçalho
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Substitua 'process.env.JWT_SECRET' pela sua chave secreta
        request.user = decoded; // Adiciona os dados do usuário ao objeto de requisição
      } catch (error) {
        // Tratar erros de decodificação, como token inválido ou expirado
      }
    }
    return next.handle();
  }
}
