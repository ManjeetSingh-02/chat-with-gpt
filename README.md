# chat-with-gpt
Simple chat app integrated with GPT

## .env (Server)
```
WEB_ORIGINS=<your-web-origins-comma-separated>
PORT=<your-port>
DATABASE_URL=<your-database-url>
NODE_ENV=production
BETTER_AUTH_URL=<your-better-auth-url>
BETTER_AUTH_SECRET=<your-better-auth-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
OPENAI_API_KEY=<your-openai-api-key>
```

## .env (Client)
```
VITE_API_URL=<your-api-url>
VITE_AUTH_URL=<your-better-auth-url>
```
## For Start (Server)
```
cd server
pnpm install
pnpm approve-builds (if needed)
docker compose up -d
pnpm prisma migrate dev
pnpm prisma generate
pnpm dev
```

## For Start (Client)
```
pnpm install
pnpm approve-builds (if needed)
pnpm dev
```
