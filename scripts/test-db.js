const { Client } = require('pg');

async function testConnection(url) {
    const client = new Client({
        connectionString: url,
    });
    try {
        await client.connect();
        console.log(`SUCCESS connection to: ${url}`);
        await client.end();
        return true;
    } catch (err) {
        console.log(`FAILED connection to: ${url}`);
        console.error(err.message);
        return false;
    }
}

async function main() {
    const pass = "MohammedNhass2007";
    const project = "dfoejqtufpdhxusjvfar";

    // Attempt 1: Direct but with different port if possible? (No, usually 5432)
    // Attempt 2: Guessing common Pooler regions
    const regions = ['eu-central-1', 'us-east-1', 'eu-west-1', 'us-west-1'];

    for (const region of regions) {
        const url = `postgresql://postgres.${project}:${pass}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
        console.log(`Testing ${region}...`);
        if (await testConnection(url)) {
            console.log("FOUND WORKING POOLER URL!");
            process.exit(0);
        }
    }
}

main();
