const fs = require('fs');
const path = require('path');

const screensDir = 'd:\\Media Wave\\Lawyer\\mobile\\src\\screens';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  const lines = content.split('\n');
  let inHeaderBlock = false;
  let newLines = [];
  
  for (let line of lines) {
    if (line.match(/^\s*(header|headerTop):\s*\{\s*\r?$/)) {
      inHeaderBlock = true;
    } else if (inHeaderBlock && line.match(/^\s*\},\s*\r?$/)) {
      inHeaderBlock = false;
    }
    
    if (inHeaderBlock) {
      if (line.includes("backgroundColor: '#fff'") || 
          line.includes("borderBottomWidth: 1") || 
          line.includes("borderBottomColor: '#f1f5f9'")) {
        continue; // skip this line
      }
    }
    
    newLines.push(line);
  }
  
  const newContent = newLines.join('\n');
  if (newContent !== originalContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${path.basename(filePath)}`);
  }
}

fs.readdirSync(screensDir).forEach(file => {
  if (file.endsWith('.jsx')) {
    processFile(path.join(screensDir, file));
  }
});

console.log("Done");
