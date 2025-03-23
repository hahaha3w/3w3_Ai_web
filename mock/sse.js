import express from "express";

const app = express();
const PORT = 3000;

app.get("/api/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send an initial message
  sendEvent({ message: "Connected to SSE", timestamp: new Date().toISOString() });

  let count = 0;
  const maxEvents = 50;

  // Send periodic updates
  const interval = setInterval(() => {
    count++;
    sendEvent({ event: "update", count, timestamp: new Date().toISOString() });

    if (count >= maxEvents) {
      clearInterval(interval);
      res.end(); // End the connection after 5 events
    }
  }, 100);

  // Cleanup when the connection is closed
  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Mock SSE server running at http://localhost:${PORT}`);
});
