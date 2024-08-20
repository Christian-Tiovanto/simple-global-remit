import { authenticator } from 'otplib';

authenticator.options = { digits: 6 };

export function generateOtpAndSecret() {
  const secret = authenticator.generateSecret();
  const otp = authenticator.generate(secret);
  return { secret, otp };
}
