import fs from 'fs';
import path from 'path';

const localesDir = '/Users/tomn/src/mdclipboardext/public/_locales';
const locales = ['de', 'es', 'fr', 'ja', 'pt_BR', 'zh_CN'];

locales.forEach(locale => {
  const filePath = path.join(localesDir, locale, 'messages.json');
  if (fs.existsSync(filePath)) {
    console.log(`Processing ${locale}...`);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const json = JSON.parse(content);

      let modified = false;
      for (const key in json) {
        if (json[key].description) {
          delete json[key].description;
          modified = true; // Mark modified if we actually deleted something
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
        console.log(`Updated ${locale}`);
      } else {
        console.log(`No changes for ${locale}`);
      }
    } catch (err) {
      console.error(`Error processing ${locale}:`, err);
    }
  } else {
    // If the folder exists but no messages.json, that's fine, just skip or warn
    console.warn(`File not found for ${locale}: ${filePath}`);
  }
});
