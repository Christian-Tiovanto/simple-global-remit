import { authenticator } from 'otplib';

authenticator.options = { digits: 6, step: 1000 };

export function generateOtpAndSecret() {
  const secret = authenticator.generateSecret();
  const otp = authenticator.generate(secret);
  return { secret, otp };
}
