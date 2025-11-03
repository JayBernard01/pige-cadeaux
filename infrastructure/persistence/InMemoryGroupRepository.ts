import fs from "fs/promises";
import type { MailGateway } from "../../domain/application/mail/MailGateway";
import { Group } from "../../domain/application/group/Group";
import { Member } from "../../domain/application/group/Member";

export class InMemoryGroupRepository {
  private groups: Map<string, Group> = new Map();
  private mailGateway: MailGateway;

  constructor(mailGateway: MailGateway) {
    this.mailGateway = mailGateway;
  }

  async loadGroup(filePath: string): Promise<Group> {
    const fileContent = await fs.readFile(filePath, "utf8");

    const lines = fileContent.trim().split("\n");

    const headers = lines
      .shift()
      ?.split(",")
      ?.map((h) => h.trim());
    if (!headers || headers.length < 3) {
      throw new Error("Invalid CSV headers. Expected: id,name,email");
    }

    const members = lines.map((line) => {
      const [id, name, email] = line.split(",").map((v) => v.trim());
      return new Member({
        id: id!,
        name: name!,
        email: email!,
        mailGateway: this.mailGateway,
      });
    });

    const group = new Group(members);
    this.groups.set("default", group);
    return group;
  }
}
