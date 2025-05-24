import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Realtime, RealtimeChannel } from 'ably';

@Injectable()
export class AblyService implements OnModuleDestroy {
  private readonly client: Realtime;
  private readonly logger = new Logger(AblyService.name);

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('ABLY_API_KEY');

    this.client = new Realtime({
      key: apiKey,
    });

    this.client.connection.on('connected', () => {
      this.logger.log('Connected to Ably');
    });

    this.client.connection.on('failed', (error) => {
      this.logger.error('Ably connection failed', error);
    });
  }

  getChannel(channelName: string): RealtimeChannel {
    return this.client.channels.get(channelName);
  }


  async publish(channelName: string, name: string, data: any): Promise<void> {
    try {
      const channel = this.getChannel(channelName);

      // Ably publish returns a Promise in newer versions
      await channel.publish(name, data);

      this.logger.debug(`Successfully published to channel ${channelName}`);
    } catch (error) {
      this.logger.error(`Failed to publish to channel ${channelName}:`, error);
      throw error;
    }
  }

  // Alternative method that returns boolean
  async publishAndReturnBoolean(
    channelName: string,
    name: string,
    data: any,
  ): Promise<boolean> {
    try {
      const channel = this.getChannel(channelName);

      await channel.publish(name, data);

      this.logger.debug(`Successfully published to channel ${channelName}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Ably publish failed for channel ${channelName}:`,
        error,
      );
      return false;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Closing Ably connection');
    this.client.close();
  }
}