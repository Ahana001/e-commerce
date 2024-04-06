import crypto from 'crypto';

export async function encryptPassword(password: string) {
  const hashed_password = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');
    return hashed_password;
}

export async function comparePassword(password: string, hash: string) {
  const hashed_md5_password = await encryptPassword(password);
  if (hashed_md5_password === hash) {
      return true;
    } else {
      return false;
    }
}