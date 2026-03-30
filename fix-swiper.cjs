const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find <script type="application/json" className="swiper-config">...</script>
  content = content.replace(/<script type="application\/json" className="swiper-config">(.*?)<\/script>/gs, (match, p1) => {
    // Escape backticks if any
    const safeStr = p1.replace(/`/g, '\\`');
    return `<script type="application/json" className="swiper-config" dangerouslySetInnerHTML={{ __html: \`${safeStr}\` }}></script>`;
  });

  fs.writeFileSync(filePath, content);
}
console.log('Swiper configs fixed in JSX.');
