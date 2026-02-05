// packages/backend/src/stores/index.ts
import { IStore } from './baseStore';
import { MemoryStore } from './memoryStore';
import { UpstashRedisStore } from './upstashStore';

const STORE_TYPE = process.env.STORE_TYPE || 'upstash';

let storeInstance: IStore;

if (STORE_TYPE === 'memory') {
    console.log('Using In-Memory Store');
    storeInstance = new MemoryStore();
} else {
    console.log('Using Upstash Redis Store');
    storeInstance = new UpstashRedisStore();
}

export const store = storeInstance;
