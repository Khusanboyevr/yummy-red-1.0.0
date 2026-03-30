const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix HTML comments
  content = content.replace(/<!--(.*?)-->/gs, '{/*$1*/}');

  // Fix some potentially unclosed tags my first script missed
  content = content.replace(/<source(.*?[^\/])>/g, '<source$1 />');

  // Remove data-aos attributes if they cause hydration issues (optional, but class/className is more important)
  // Actually data-aos is fine in React.

  // The inline styles like `style="width: 100%; height: 400px;"` were fixed, but maybe others exist?
  // Let's check for any remaining style="..."
  content = content.replace(/style="([^"]*)"/g, (match, p1) => {
    // very basic converter for style="foo: bar; baz: qux" to style={{ foo: "bar", baz: "qux" }}
    const styles = p1.split(';').filter(s => s.trim()).map(s => {
      let [key, val] = s.split(':');
      if(!val) return '';
      key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      return `${key}: "${val.trim()}"`;
    }).join(', ');
    return `style={{ ${styles} }}`;
  });

  fs.writeFileSync(filePath, content);
}
console.log('JSX files cleaned up.');
