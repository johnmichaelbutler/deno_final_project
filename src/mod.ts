// Only download Oak module for version 5.0.0
import { log, Application, send } from './deps.ts';

import api from './api.ts';

// Oak will ca
const app = new Application();
const PORT = 8000;

// Logger that will only give us logs for level ≥ info
await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("INFO"),
  },
  loggers: {
    default: {
      level: "INFO",
      handlers: ["console"],
    }
  }
});

// This is the final event handler. It listens for the error event on the window object and fires when it arrives
app.addEventListener("error", (event) => {
  log.error(event.error);
});

// Error handling middleware
app.use(async (ctx, next) => {
  // If any of the downstream middleware throw errors, we will catch here
  try {
    await next();
  } catch(err) {
    ctx.response.body = "Internal server error";
    throw err;
  }
})

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  log.info(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Access our routes in api.ts
app.use(api.routes());
// Gives us an option to make an 'options' request to the path.
app.use(api.allowedMethods());

app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [
    "/index.html",
    "/javascripts/script.js",
    "/stylesheets/style.css",
    "/models/planets.ts",
    "/images/favicon.png",
    "/videos/space.mp4"
    ];
    if(fileWhitelist.includes(filePath)) {
      await send(ctx,filePath, {
        root: `${Deno.cwd()}/public`,
      })
    }
})

if(import.meta.main) {
  log.info(`Starting server on port ${PORT}....`);
  await app.listen({
    port: PORT
  });
}