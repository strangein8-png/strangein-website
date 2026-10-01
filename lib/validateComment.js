const BLOCKED_PATTERNS = [
  /https?:\/\//i,                         // http:// https://
  /\bwww\./i,                             // www.something
  /\b[a-z0-9-]+\.(com|net|org|io|in|co|me|info|biz|xyz|dev|app|ly|gl|link|site|online|store|shop|tk|ru|cn|ai)\b/i, // bare domains
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i, // emails
  /<[^>]*>/,                              // HTML tags
  /\b(t\.me|wa\.me|bit\.ly|tinyurl)\b/i,  // common short/chat links
  /\bdot\s*(com|net|org|in)\b/i,          // "example dot com" tricks
];

export function validateCommentText(value = '') {
  // remove invisible characters people use to sneak links through
  const cleaned = value.replace(/[\u200B-\u200D\uFEFF]/g, '');

  if (BLOCKED_PATTERNS.some((re) => re.test(cleaned))) {
    return 'Only plain text is allowed. Links, emails and HTML are not permitted.';
  }
  return null; // valid
}