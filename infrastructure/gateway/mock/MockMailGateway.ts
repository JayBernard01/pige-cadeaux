import type { MailGateway } from "../../../domain/application/mail/MailGateway";

export class MockMailGateway implements MailGateway {
  sentEmails: { to: string; subject: string; body: string }[] = [];

  async send(to: string, subject: string, body: string): Promise<void> {
    this.sentEmails.push({ to, subject, body });
  }
}
