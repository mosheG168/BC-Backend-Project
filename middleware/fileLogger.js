import fs from 'fs';
import path from 'path';

export const fileLogger = (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      const logDir = path.join(process.cwd(), 'logs');
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
      }

      const logFile = path.join(logDir, `${new Date().toISOString().slice(0, 10)}.log`);
      const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} ${res.statusMessage}\n`;

      fs.appendFileSync(logFile, logEntry);
    }
  });
  next();
};
