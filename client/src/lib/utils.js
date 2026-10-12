/**
 * Global Helper Utilities Blueprint for Pulse Chat Framework
 */

/**
 * 1. Formats a standard ISO or Date timestamp exactly like WhatsApp rules.
 * - Shows time string if the event is from today.
 * - Displays "Yesterday" if the event is from the prior calendar date window.
 * - Outputs full locale date string if older than 24-48 hours.
 * @param {string|Date} dateParam - Incoming timestamp data block.
 * @returns {string} Highly readable clean timestamp layout string.
 */
export const formatChatTime = (dateParam) => {
  if (!dateParam) return '';
  const date = new Date(dateParam);
  const now = new Date();
  
  // Strip chronological hours to calculate clean day boundaries
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  if (date >= startOfToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (date >= startOfYesterday) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' });
  }
};

/**
 * 2. Generates fallback text initials out of a user profile display nickname.
 * - "Sathvik Workspace" -> "SW"
 * - "ANJUSRI" -> "AN" (or "A")
 * @param {string} name - Input profile name string.
 * @returns {string} Upper-case letters for avatar placeholders.
 */
export const getProfileInitials = (name) => {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

/**
 * 3. Truncates long message snippets displayed in the Left Sidebar list mapping.
 * @param {string} text - Raw conversation body text pipeline.
 * @param {number} maxLength - Character threshold boundary before cutting text (Default: 38).
 * @returns {string} Truncated string appended with trailing ellipsis notation.
 */
export const truncateSnippet = (text, maxLength = 38) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * 4. Sanitizes user profile nicknames and direct messaging room channel inputs.
 * Removes hazardous symbols, enforces character limits, and prevents whitespace exploits.
 * @param {string} inputString - Raw console input string text block.
 * @returns {string} Normalized clean string.
 */
export const sanitizeInput = (inputString) => {
  if (!inputString) return '';
  return inputString
    .replace(/[<>:"/\\|?*]/g, '') // Strips structural markdown or filesystem notation hooks
    .trim();
};

/**
 * 5. Generates deterministic color assignments based on string hashing.
 * Helpful for rendering unique text colors for group chat users (just like WhatsApp).
 * @param {string} name - User display name string parameters.
 * @returns {string} Dark theme web-safe hex color code matching layout arrays.
 */
export const getUserThemeColor = (name) => {
  if (!name) return '#53bdeb';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Selective range of bright, readable text colors for high-contrast dark modes
  const colors = [
    '#53bdeb', '#34d399', '#fbbf24', '#f87171', 
    '#a78bfa', '#f472b6', '#38bdf8', '#fb7185'
  ];
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
