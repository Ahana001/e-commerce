import jwt from 'jsonwebtoken';

export default (entity: {}) => {
  const key = process.env.JWT_ACCESS_PRIVATE_KEY ?? '';
  return jwt.sign(entity, key, {
    expiresIn: Number(process.env.JWT_ACCESS_EXPIRY_IN_SECONDS),
    algorithm: 'RS256',
  });
};
