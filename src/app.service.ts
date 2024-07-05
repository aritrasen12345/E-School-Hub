import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `<html> <head> <meta charset="UTF-8" /> <style> @media (prefers-color-scheme: light) { body { background-color: #f4f4f4; color: #0b0f10; } } @media (prefers-color-scheme: dark) { body { background-color: #0b0f10; color: #f4f4f4; } } </style> </head> <h1 style="font-family: monospace; text-align: center; font-size: 72px"> <br /><br /><br /> 🤜📱🤛<br /> API is Ready!<br /> </h1> </html>`;
  }
}
