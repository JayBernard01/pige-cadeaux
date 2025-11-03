export interface MailGateway {
  send(to: string, subject: string, body: string): Promise<void>;
}
