import { Module } from '@nestjs/common';
import { AdocaoController } from './adocao.controller';
import { AdocaoService } from './adocao.service';

@Module({
  controllers: [AdocaoController],
  providers: [AdocaoService]
})
export class AdocaoModule {}
