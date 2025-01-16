export default function checkUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    return (
      parsedUrl.protocol === 'https:' &&
      (hostname === 'twitter.com' || hostname === 'x.com')
    );
  } catch {
    return false;
  }
}
