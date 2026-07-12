// Legacy receipts helper placeholder
// Deprecated in favor of modular Socket.io read receipt socket events handlers.
export const processReceiptLegacy = (messageId) => {
  console.warn("Using deprecated legacy receipt processor.");
  return { messageId, processed: true };
};
