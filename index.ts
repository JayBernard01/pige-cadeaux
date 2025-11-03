import { GmailGateway } from "./infrastructure/gateway/gmail/GmailGateway";
import { InMemoryGroupRepository } from "./infrastructure/persistence/InMemoryGroupRepository";
import { CONFIG } from "./resource/config/config";

const gateway = await GmailGateway.create(
  CONFIG.gmail.credentialsPath,
  CONFIG.gmail.tokenPath,
  CONFIG.common.fromEmail,
  CONFIG.common.fromName
);
const inMemoryGroupRepository = new InMemoryGroupRepository(gateway);
const group = await inMemoryGroupRepository.loadGroup(CONFIG.data.groupCsvPath);
await group.assignAllMembers();
console.log("✅ All members have been assigned and notified via email.");
