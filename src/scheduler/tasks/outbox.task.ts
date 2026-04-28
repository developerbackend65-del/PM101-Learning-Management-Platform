import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { EVENT_TYPE, STATUS_OUTBOX } from '../../../generated/prisma/enums';
import { OutboxRepository } from 'src/module/auth/repository/outbox.repository';
import { mintesToMilliseconds } from 'src/shared/time/time.util';
import { MailService } from 'src/shared/mail/mail.service';

@Injectable()
export class OutboxTask {
  constructor(
    private config: ConfigService,
    private readonly outboxRepo: OutboxRepository,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async processOutbox() {
    const messages = await this.outboxRepo.findMany();

    for (const msg of messages) {
      const { email, token } = msg.payload as {
        email: string;
        token: string;
      };
      try {
        if (msg.event_type === EVENT_TYPE.VERIFY_EMAIL) {
          const link = `${this.config.get<string>('DOMAIN')}/api/v1/auth/verify-email?token=${token}`;

          await this.mailService.sendVerifyEmail(email, link);
        }

        if (msg.event_type === EVENT_TYPE.RESET_PASSWORD) {
          const link = `${this.config.get<string>('DOMAIN')}/api/v1/auth/reset-password?token=${token}`;

          await this.mailService.sendResetPassword(email, link);
        }

        await this.outboxRepo.updateStatus(msg.id, {
          status: STATUS_OUTBOX.SENT,
        });
      } catch (err) {
        console.log(err);
        const newRetryCount = Number(msg.retryCount + 1);
        const delay = this.getDelay(newRetryCount);

        const newStatus =
          newRetryCount >= 3 ? STATUS_OUTBOX.FAILED : STATUS_OUTBOX.PENDING;

        await this.outboxRepo.updateStatus(msg.id, {
          status: newStatus,
          retryCount: newRetryCount,
          nextRetryAt: new Date(Date.now() + delay),
        });
      }
    }
  }

  private getDelay(retryCount: number): number {
    if (retryCount === 1) return mintesToMilliseconds(1);
    if (retryCount === 2) return mintesToMilliseconds(5);
    if (retryCount === 3) return mintesToMilliseconds(15);

    return mintesToMilliseconds(60);
  }
}
