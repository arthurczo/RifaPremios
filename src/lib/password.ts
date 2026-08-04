import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const PASSWORD_PREFIX = 'scrypt';
const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString('hex');

  return `${PASSWORD_PREFIX}$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, storedValue: string) {
  if (!storedValue) {
    return false;
  }

  const [prefix, salt, hash] = storedValue.split('$');

  if (prefix !== PASSWORD_PREFIX || !salt || !hash) {
    return storedValue === password;
  }

  const derivedKey = scryptSync(password, salt, KEY_LENGTH);
  const storedKey = Buffer.from(hash, 'hex');

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
}
