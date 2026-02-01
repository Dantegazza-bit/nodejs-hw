import crypto from 'node:crypto';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

const generateToken = () => crypto.randomBytes(32).toString('hex');

export const createSession = async (userId) => {
  const accessToken = generateToken();
  const refreshToken = generateToken();

  const now = Date.now();

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(now + ONE_DAY),
  });

  return session;
};

export const setSessionCookies = (res, session) => {
  const commonOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.cookie('accessToken', session.accessToken, {
    ...commonOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...commonOptions,
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id.toString(), {
    ...commonOptions,
    maxAge: ONE_DAY,
  });
};
