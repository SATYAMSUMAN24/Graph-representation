import express, { type Request, type Response, type NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// ✅ Parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Request logger & JSON response capturer middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  const path = req.path;
  let responseBody: Record<string, unknown> | undefined;

  // Capture original res.json
  const originalJson = res.json.bind(res);
  res.json = (body, ...args) => {
    responseBody = body;
    return originalJson(body, ...args);
  };

  // Log on response finish
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    if (path.startsWith("/api")) {
      let logEntry = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (responseBody) {
        logEntry += ` :: ${JSON.stringify(responseBody)}`;
      }
      if (logEntry.length > 150) {
        logEntry = logEntry.slice(0, 149) + "…";
      }
      log(logEntry);
    }
  });

  next();
});

// ✅ Bootstrap server asynchronously
(async () => {
  const server = await registerRoutes(app);

  // ✅ Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    log(`❌ ${status} Error: ${message}`);
    res.status(status).json({ message });
  });

  // ✅ Development mode: setup Vite middleware
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // ✅ Production mode: serve static built files
    serveStatic(app);
  }

  // ✅ Server listen config for localhost only
  const PORT = 5000;
  const HOST = "127.0.0.1"; // Localhost only

  server.listen(PORT, HOST, () => {
    log(`🚀 Server running locally at http://localhost:${PORT}`);
  });
})();
