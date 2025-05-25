import { Module, Global } from '@nestjs/common';
import { AblyService } from './ably.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AblyService],
  exports: [AblyService],
})
export class AblyModule {}

