import { describe, it, expect } from "bun:test";
import { MockMailGateway } from "../../../infrastructure/gateway/mock/MockMailGateway";
import { Member } from "./Member";
import { Group } from "./Group";

describe("Group.assignAllMembers", () => {
  it("assigns each member to another member and sends exactly one email to each", async () => {
    const mailGateway = new MockMailGateway();

    const members = [
      new Member({
        id: "1",
        name: "Alice",
        email: "alice@example.com",
        mailGateway,
      }),
      new Member({
        id: "2",
        name: "Bob",
        email: "bob@example.com",
        mailGateway,
      }),
      new Member({
        id: "3",
        name: "Charlie",
        email: "charlie@example.com",
        mailGateway,
      }),
      new Member({
        id: "4",
        name: "David",
        email: "david@example.com",
        mailGateway,
      }),
    ];

    const group = new Group(members);
    await group.assignAllMembers();

    // Each member should receive exactly one email
    members.forEach((member) => {
      const emailsToMember = mailGateway.sentEmails.filter(
        (e) => e.to === member.email
      );
      expect(emailsToMember.length).toBe(1);
    });

    // No member should be assigned to themselves
    mailGateway.sentEmails.forEach((email) => {
      const recipient = members.find((m) => m.email === email.to);
      expect(recipient).toBeDefined();
      expect(email.subject).not.toContain(recipient!.name);
    });

    // Ensure all assignments are unique: no two members are assigned the same person
    const assignedNames = mailGateway.sentEmails
      .map((e) => {
        const match = e.subject.match(/assigned to (.+)$/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    const uniqueAssigned = new Set(assignedNames);
    expect(uniqueAssigned.size).toBe(members.length);
  });
});
