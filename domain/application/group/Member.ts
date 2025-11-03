import { CONFIG } from "../../../resource/config/config";
import type { MailGateway } from "../mail/MailGateway";

export class Member {
  id: string;
  name: string;
  email: string;
  mailGateway: MailGateway;

  constructor({
    id,
    name,
    email,
    mailGateway,
  }: {
    id: string;
    name: string;
    email: string;
    mailGateway: MailGateway;
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.mailGateway = mailGateway;
  }

  public async assignMember(member: Member): Promise<void> {
    console.log(`🔔 Assigning ${member.name} to ${this.name}`);

    const htmlBody = `
    <p>Bonjour <strong>${this.name}</strong>,</p>
    <p>Vous avez pigé <strong>${member.name}</strong> ! 🎁</p>
    <p>Cordialement,<br>${CONFIG.common.fromName}</p>
  `;

    await this.mailGateway.send(
      this.email,
      `Pige pour l'échange de cadeaux`,
      htmlBody
    );

    console.log(`📨 Email sent to ${this.name} <${this.email}>`);
  }
}
