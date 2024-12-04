import Redis from 'ioredis';
import { readFile } from 'node:fs/promises';

export async function cashLuaScript(redis: Redis, path: string) {
  const luaScript = await readFile(path, 'utf-8');
  return redis.script('LOAD', luaScript) as unknown as string;
}
