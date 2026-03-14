const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

const services = {
  serviceA: "https://service-a.com/health",
  serviceB: "https://service-b.com/health",
  serviceC: "https://service-c.com/health",
};

async function checkService(url) {
  try {
    const response = await axios.get(url, { timeout: 3000 });
    return response.status === 200 ? "UP" : "DOWN";
  } catch (error) {
    return "DOWN";
  }
}

app.get("/health", async (req, res) => {
  const healthStatus = {};

  for (const [name, url] of Object.entries(services)) {
    healthStatus[name] = await checkService(url);
  }

  const allHealthy = Object.values(healthStatus).every(
    (status) => status === "UP"
  );

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "HEALTHY" : "DEGRADED",
    services: healthStatus,
    timestamp: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`Health check service running on port ${PORT}`);
});
