import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { LoggingService } from './logging.interface';

type Level = 'log' | 'warn' | 'error';

@Injectable()
export class AppLoggingService implements LoggingService {
  private level: Level;
  private logPath: string;
  private maxSize: number;

  constructor() {
    this.level = (process.env.LOG_LEVEL as Level) || 'log';
    this.maxSize = Number(process.env.LOG_FILE_SIZE_KB || 512) * 1024;

    const dir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    this.logPath = path.join(dir, 'app.log');
  }

  log(message: string, meta?: unknown) {
    if (this.level === 'log') this.write('LOG', message, meta);
  }

  warn(message: string, meta?: unknown) {
    this.write('WARN', message, meta);
  }

  error(message: string, meta?: unknown) {
    this.write('ERROR', message, meta);
  }

  private write(level: string, message: string, meta?: unknown) {
    this.rotate();

    const entry = JSON.stringify({
      time: new Date().toISOString(),
      level,
      message,
      meta,
    });

    fs.appendFileSync(this.logPath, entry + '\n');
  }

  private rotate() {
    if (!fs.existsSync(this.logPath)) return;
    const { size } = fs.statSync(this.logPath);
    if (size < this.maxSize) return;

    fs.renameSync(
      this.logPath,
      this.logPath.replace('.log', `-${Date.now()}.log`),
    );
  }
}
