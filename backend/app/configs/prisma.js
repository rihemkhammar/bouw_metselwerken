import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon to use WebSocket in Node.js
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

// Create Neon adapter
const adapter = new PrismaNeon({ connectionString });

// Use global prisma in dev to avoid multiple instances
const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;
