import crypto from 'crypto';

export function generateSecretKey() {
  return crypto.randomBytes(24).toString('hex');
}

export default generateSecretKey;