# Pige de Cadeaux

## Configuration

- You will need to setup your Google Cloud account with the Gmail service
- The token will be generated automatically by manually extracting it from the URL if it does not exist
- Add this file to resources/config along with the corresponding files:

```typescript
export const CONFIG = {
  gmail: {
    credentialsPath: "./resource/credential/google/credential.json",
    tokenPath: "./resource/credential/google/token.json",
  },
  data: {
    groupCsvPath: "./resource/data/group.csv",
  },
  common: {
    fromEmail: "---insert email here---",
    fromName: "Le Pigeur de Cadeaux",
  },
};
```

- For the CSV, use this format:

```csv
id,name,email
1,Alice,alice@gmail.com
2,Bob,bob@gmail.com
3,Charlie,charlie@gmail.com
```

## Development

- install with `bun install`
- test with `bun test --rerun-each=100`
- run with `bun run index.ts`
