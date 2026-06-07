const clients = new Set();

export const registerNotificationClient = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  clients.add(res);
  
  req.on('close', () => {
    clients.delete(res);
  });
};

export const broadcastNotification = (data) => {
  for (const client of clients) {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
};