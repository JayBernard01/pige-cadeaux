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
    // Check that the email is correctly addressed
    mailGateway.sentEmails.forEach((email) => {
      const recipient = members.find((m) => m.email === email.to);
      expect(recipient).toBeDefined();
      const match = email.body.match(/Vous avez pigé <strong>(.+)<\/strong>/);
      const assignedName = match ? match[1] : null;
      expect(assignedName).not.toBe(recipient!.name);
      expect(email.body).toContain(
        `Bonjour <strong>${recipient!.name}</strong>`
      );
    });
  });

  it("assigns each member to another member and sends exactly one email to each with a prime number of peoples", async () => {
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
      new Member({
        id: "5",
        name: "Eve",
        email: "eve@example.com",
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
    // Check that the email is correctly addressed
    mailGateway.sentEmails.forEach((email) => {
      const recipient = members.find((m) => m.email === email.to);
      expect(recipient).toBeDefined();
      const match = email.body.match(/Vous avez pigé <strong>(.+)<\/strong>/);
      const assignedName = match ? match[1] : null;
      expect(assignedName).not.toBe(recipient!.name);
      expect(email.body).toContain(
        `Bonjour <strong>${recipient!.name}</strong>`
      );
    });
  });
});
