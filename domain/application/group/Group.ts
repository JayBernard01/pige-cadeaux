import { Member } from "./Member";
import crypto from "crypto";

export class Group {
  memberCollection: Member[];

  constructor(members: Member[]) {
    this.memberCollection = members;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = crypto.randomInt(0, i + 1);
      const tmp = arr[i]!;
      arr[i] = arr[j]!;
      arr[j] = tmp;
    }
    return arr;
  }

  public async assignAllMembers(): Promise<void> {
    const shuffled = this.shuffleArray(this.memberCollection);

    const assignments = new Map<Member, Member>();

    for (let i = 0; i < shuffled.length; i++) {
      const member = shuffled[i]!;
      const assignedMember = shuffled[(i + 1) % shuffled.length]!;
      assignments.set(member, assignedMember);
    }

    await Promise.all(
      Array.from(assignments.entries()).map(([member, assignedMember]) =>
        member.assignMember(assignedMember)
      )
    );
  }
}
