/** biome-ignore-all lint/suspicious/noConsole: <Allow logging> */
import * as logger from "@tauri-apps/plugin-log";

export class Log {
  private jsonSpace: number;
  private devMinLevel: 1 | 2 | 3 | 4 | 5;
  private prodMinLevel: 1 | 2 | 3 | 4 | 5;
  private sendToConsole: boolean;

  constructor(options?: {
    jsonSpace?: number;
    devMinLevel?: 1 | 2 | 3 | 4 | 5;
    prodMinLevel?: 1 | 2 | 3 | 4 | 5;
    sendToConsole?: boolean;
  }) {
    this.jsonSpace = options?.jsonSpace ?? 2;
    this.devMinLevel = options?.devMinLevel ?? 1; // Trace level
    this.prodMinLevel = options?.prodMinLevel ?? 3; // Info level
    this.sendToConsole = options?.sendToConsole ?? true;
  }

  private Stringify(message: unknown): string {
    switch (typeof message) {
      case "string":
        return message;
      case "number":
        return message.toString();
      case "boolean":
        return message.toString();
      case "object":
        return JSON.stringify(message, null, this.jsonSpace);
      case "undefined":
        return "undefined";
      case "symbol":
        return message.toString();
      case "bigint":
        return message.toString();
      default:
        return String(message);
    }
  }

  private timestamp(): string {
    return new Date().toISOString();
  }

  private shouldLog(level: 1 | 2 | 3 | 4 | 5): boolean {
    const minLevel = import.meta.env.DEV ? this.devMinLevel : this.prodMinLevel;
    return level >= minLevel;
  }

  trace(...messages: unknown[]) {
    if (!this.shouldLog(1)) return;
    const msg = `${this.timestamp()} [TRACE] ${messages.map(this.Stringify).join(" ")}`;
    logger.trace(msg);
    if (this.sendToConsole) console.log(msg);
  }

  debug(...messages: unknown[]) {
    if (!this.shouldLog(2)) return;
    const msg = `${this.timestamp()} [DEBUG] ${messages.map(this.Stringify).join(" ")}`;
    logger.debug(msg);
    if (this.sendToConsole) console.log(msg);
  }

  info(...messages: unknown[]) {
    if (!this.shouldLog(3)) return;
    const msg = `${this.timestamp()} [INFO] ${messages.map(this.Stringify).join(" ")}`;
    logger.info(msg);
    if (this.sendToConsole) console.log(msg);
  }

  warn(...messages: unknown[]) {
    if (!this.shouldLog(4)) return;
    const msg = `${this.timestamp()} [WARN] ${messages.map(this.Stringify).join(" ")}`;
    logger.warn(msg);
    if (this.sendToConsole) console.warn(msg);
  }

  error(...messages: unknown[]) {
    if (!this.shouldLog(5)) return;
    const msg = `${this.timestamp()} [ERROR] ${messages.map(this.Stringify).join(" ")}`;
    logger.error(msg);
    if (this.sendToConsole) console.error(msg);
  }
}

const log = new Log({
  devMinLevel: 1,
  prodMinLevel: 3,
  sendToConsole: true,
});
export default log;
