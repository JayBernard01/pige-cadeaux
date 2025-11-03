import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import type { MailGateway } from "../../../domain/application/mail/MailGateway";

export class GmailGateway implements MailGateway {
  private gmail: any;
  private fromEmail: string;
  private fromName: string;

  private constructor(gmail: any, fromEmail: string, fromName: string) {
    this.gmail = gmail;
    this.fromEmail = fromEmail;
    this.fromName = fromName;
  }

  static async create(
    credentialsPath: string,
    tokenPath: string,
    fromEmail: string,
    fromName: string
  ) {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
    const { client_id, client_secret, redirect_uris } = credentials.installed;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    let tokens;

    if (fs.existsSync(tokenPath)) {
      tokens = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
    } else {
      const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
      });
      console.log("Authorize this app by visiting this URL:\n", authUrl);

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      const code: string = await new Promise((resolve) =>
        rl.question("Enter code here: ", resolve)
      );
      rl.close();

      const response = await oAuth2Client.getToken(code);
      tokens = response.tokens;
      fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
      console.log("✅ Token saved to", tokenPath);
    }

    oAuth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    return new GmailGateway(gmail, fromEmail, fromName);
  }

  private encodeRFC2047(str: string): string {
    return `=?UTF-8?B?${Buffer.from(str, "utf-8").toString("base64")}?=`;
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    const encodedSubject = this.encodeRFC2047(subject);
    const encodedFrom = this.encodeRFC2047(`${this.fromName}`);

    const messageLines = [
      `From: ${encodedFrom} <${this.fromEmail}>`,
      `To: ${to}`,
      `Subject: ${encodedSubject}`,
      `Content-Type: text/html; charset="UTF-8"`,
      "",
      body,
    ];

    const rawMessage = Buffer.from(messageLines.join("\n"), "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await this.gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: rawMessage },
    });

    console.log(`✉️ Gmail sent to ${to} (${subject})`);
  }
}
