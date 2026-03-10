@echo off
REM Use the direct connection (port 5432) for schema migrations
set DATABASE_URL=postgresql://postgres.dfoejqtufpdhxusjvfar:MohammedNhass2007@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
npx prisma db push %*
