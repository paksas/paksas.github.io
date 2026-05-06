const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const fs = require('fs');

const SITE_DIR = path.resolve(__dirname, '..', '_site');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent(req.url.split('?')[0]);
      if (urlPath.endsWith('/')) urlPath += 'index.html';
      const filePath = path.join(SITE_DIR, urlPath);
      if (!filePath.startsWith(SITE_DIR)) { res.writeHead(403); return res.end(); }
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); return res.end('Not found'); }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

(async () => {
  if (!fs.existsSync(SITE_DIR)) {
    console.error(`Missing ${SITE_DIR}. Run "bundle exec jekyll build" first.`);
    process.exit(1);
  }

  const server = await startServer();
  const port = server.address().port;

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  const url = `http://127.0.0.1:${port}/resume/`;
  console.log(`Loading ${url}`);
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');

  const outPath = path.join(SITE_DIR, 'resume.pdf');
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
  });

  await browser.close();
  server.close();
  console.log(`Wrote ${outPath}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
