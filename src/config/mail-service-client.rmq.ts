import { ClientOptions, Transport } from '@nestjs/microservices';
import configuration from './configuration';

export const MailServiceRmqClient: ClientOptions = {
  transport: Transport.RMQ,
  options: {
    urls: [configuration().rmq.url],
    queue: configuration().rmq.queue,
    persistent: true,
  },
};
