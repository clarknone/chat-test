import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ChatInviteDocument } from 'src/chat/entities/chat.entity';
import { IAuthUser } from 'src/helper/interfaces/auth/auth.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: IAuthUser, invite: ChatInviteDocument) {
    const url = `http://chat.onrender.com/chat/${invite.topic}?invite=${invite._id}`;

    await this.mailerService.sendMail({
      to: invite.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: `Invitations To Chat On Chat Test`,
      text: `You have been invited by ${user.fullname} to chat on CHAT TEST\n\nClick <a href="${url}">here</a> to chat`,
    });
  }
}
