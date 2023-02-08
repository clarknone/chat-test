export function extractErrorMessage(e: any): string {
  const index = e?.message?.indexOf(':');
  let message = e?.message;
  if (index >= 0) {
    message = e.message.substr(index + 1);
  }
  return message;
}
