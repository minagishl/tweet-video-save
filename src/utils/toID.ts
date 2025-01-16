export default function toID(url: string): string {
  try {
    // Remove query parameters and hash
    const cleanUrl = url.split(/[?#]/)[0];
    // Match the last number sequence in the URL
    const match = cleanUrl.match(/\/(\d+)(?:\/)?$/);
    return match ? match[1] : '';
  } catch {
    return '';
  }
}
