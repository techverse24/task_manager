import 'express-session';

declare module 'express-session' {
  interface SessionData {
    state: string; // Add any other custom properties you need here
  }
}
