const fs = require('fs');

function findAndReplace(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = dir + '/' + file.name;
    if (file.isDirectory()) {
      findAndReplace(fullPath);
    } else if (file.name.endsWith('.jsx') || file.name.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('SafeAreaView') && /import.*SafeAreaView.*from 'react-native'/.test(content)) {
        content = content.replace(/import\s+{([^}]*)}\s+from\s+'react-native'/g, (match, imports) => {
          if (imports.includes('SafeAreaView')) {
            let newImports = imports.replace(/,\s*SafeAreaView/, '').replace(/SafeAreaView\s*,/, '').replace(/SafeAreaView/, '').trim();
            if (newImports === '') return '';
            return 'import { ' + newImports + ' } from \'react-native\'';
          }
          return match;
        });
        
        content = 'import { SafeAreaView } from \'react-native-safe-area-context\';\n' + content;
        
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

findAndReplace('d:/Media Wave/Lawyer/claude/src');
