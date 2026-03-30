const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('template.html', 'utf8').split('\n');

function toJSX(lines) {
  let str = lines.join('\n');
  
  // Basic replacements
  str = str.replace(/class=/g, 'className=');
  str = str.replace(/for=/g, 'htmlFor=');
  
  // Close unclosed tags
  str = str.replace(/<img(.*?[^\/])>/g, '<img$1 />');
  str = str.replace(/<input(.*?[^\/])>/g, '<input$1 />');
  str = str.replace(/<hr>/g, '<hr />');
  str = str.replace(/<br>/g, '<br />');
  str = str.replace(/required=""/g, 'required');
  str = str.replace(/allowfullscreen=""/g, 'allowFullScreen');
  str = str.replace(/frameborder="0"/g, 'frameBorder="0"');
  
  // Fix styles
  str = str.replace(/style="background-image: url\((.*?)\);?"/g, 'style={{ backgroundImage: `url($1)` }}');
  str = str.replace(/style="width: 100%; height: 400px;"/g, 'style={{ width: "100%", height: "400px" }}');

  return str;
}

const pages = {
  Home: {
    lines: [
      ...html.slice(88 - 1, 107),
      ...html.slice(156 - 1, 210),
      ...html.slice(212 - 1, 253),
      ...html.slice(614 - 1, 745)
    ],
  },
  About: { lines: [ ...html.slice(109 - 1, 154) ] },
  Menu: { lines: [ ...html.slice(255 - 1, 612) ] },
  Events: { lines: [ ...html.slice(747 - 1, 818) ] },
  Chefs: { lines: [ ...html.slice(820 - 1, 894) ] },
  Gallery: { lines: [ ...html.slice(953 - 1, 1010) ] },
  Contact: { 
    lines: [ 
      ...html.slice(896 - 1, 951),
      ...html.slice(1012 - 1, 1103)
    ] 
  }
};

for (const [name, data] of Object.entries(pages)) {
  const jsx = `export default function ${name}() {
  return (
    <>
      ${toJSX(data.lines)}
    </>
  );
}`;
  fs.writeFileSync(path.join('src', 'pages', `${name}.jsx`), jsx);
}
console.log('Pages extracted successfully.');
