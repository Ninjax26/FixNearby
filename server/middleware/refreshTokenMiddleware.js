import jwt from 'jsonwebtoken';

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret');
  } catch (error) {
    return null;
  }
};

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret', { expiresIn: '7d' });
  return { accessToken, refreshToken };
};