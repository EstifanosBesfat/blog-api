const winston = require("winston");

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Production logs should be JSON (easier to parse)
  ),
  transports: [
    // 1. Write all errors to 'error.log'
    new winston.transports.File({ filename: "error.log", level: "error" }),
    // 2. Write all logs (info, warn, error) to 'combined.log'
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// If we are NOT in production, log to the console with colors
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = logger;