import { Injectable } from '@nestjs/common';
import Redis, { Redis as RedisType } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: RedisType;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async set(key: string, value: string, mode?: string, duration?: number) {
    if (mode && duration) {
      return this.redis.set(key, value, mode as any, duration);
    }
    return this.redis.set(key, value);
  }

  async del(key: string) {
    return this.redis.del(key);
  }

  async lpush(key: string, value: string) {
    return this.redis.lpush(key, value);
  }

  async lrange(key: string, start: number, stop: number) {
    return this.redis.lrange(key, start, stop);
  }

  async ltrim(key: string, start: number, stop: number) {
    return this.redis.ltrim(key, start, stop);
  }
}
