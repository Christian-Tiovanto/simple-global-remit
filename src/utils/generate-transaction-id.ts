export function generateSerial(id: number): string {
  const currentTime = Date.now();
  const paddedUserId = id.toString();
  const randomNumber = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  const serial = `${currentTime}-${paddedUserId}-${randomNumber}`;
  return serial;
}
