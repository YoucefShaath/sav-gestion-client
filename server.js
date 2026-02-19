const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Lightweight proxy: forward any /api/* requests to a PHP backend (useful for local dev + cPanel-style PHP API)
  function proxyToPhp(req, res, target) {
    const { protocol } = new URL(target);
    const proxyLib = protocol === "https:" ? require("https") : require("http");
    const parsed = new URL(target);

    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (protocol === "https:" ? 443 : 80),
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxyReq = proxyLib.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on("error", (err) => {
      console.error("PHP proxy error:", err);
      res.statusCode = 502;
      res.end("Bad Gateway");
    });

    req.pipe(proxyReq, { end: true });
  }

  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    // Proxy API requests to PHP backend so frontend can keep using /api/* unchanged
    if (parsedUrl.pathname && parsedUrl.pathname.startsWith("/api/")) {
      const phpTarget = process.env.PHP_API_URL || "http://localhost:8000";
      return proxyToPhp(req, res, phpTarget);
    }
    handle(req, res, parsedUrl);
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:" + (process.env.PORT || 3000));
  });
});
