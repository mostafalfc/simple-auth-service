import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { DateTime } from 'luxon';
import { TempUsersService } from '../services/temp-users.service';

@Processor('jobs')
export class DeleteTempUsersJob implements OnApplicationBootstrap {
  constructor(
    @InjectQueue('jobs') private queue: Queue,
    private readonly userService: TempUsersService,
  ) {}

  logger = new Logger(DeleteTempUsersJob.name);
  async onApplicationBootstrap(): Promise<void> {
    await this.queue.add('delete_temp_users', '', {
      repeat: {
        cron: CronExpression.EVERY_MINUTE,
      },
      jobId: 'delete_temp_users',
      removeOnComplete: true,
    });
  }

  @Process('delete_temp_users')
  async run(): Promise<void> {
    const now = new Date().toISOString();
    const from_date = DateTime.fromISO(now)
      .minus({ minute: 2 })
      .startOf('minute')
      .toJSDate();
    const to_date = DateTime.fromISO(now)
      .minus({ minute: 2 })
      .endOf('minute')
      .toJSDate();
    const deleted_users_count =
      await this.userService.deleteTempUsersBetweenDates(from_date, to_date);

    this.logger.verbose(`${deleted_users_count} not verified user deleted`);
  }
}
