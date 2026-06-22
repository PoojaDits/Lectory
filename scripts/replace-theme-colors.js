import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const colorMap = {
  'amber-50': 'primary-50',
  'amber-100': 'primary-100',
  'amber-200': 'primary-200',
  'amber-600': 'primary-600',
  'amber-700': 'primary-700',
  'amber-800': 'primary-800',
  'amber-900': 'primary-900',
  'slate-50': 'secondary-50',
  'slate-100': 'secondary-100',
  'slate-200': 'secondary-200',
  'slate-600': 'secondary-600',
  'slate-700': 'secondary-700',
  'slate-800': 'secondary-800',
  'slate-900': 'secondary-900',
  '#d97706': 'var(--color-primary-600)',
  '#b45309': 'var(--color-primary-700)',
  '#1f2937': 'var(--color-secondary-800)'
};

let totalReplacements = 0;

walk(SRC_DIR, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css')) {
    // Skip constants.ts because we don't want to replace the reference definition
    if (filePath.endsWith('constants.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    for (const [key, value] of Object.entries(colorMap)) {
      // For tailwind classes, we use word boundaries to not match 'slate-500' accidentally
      if (key.startsWith('amber') || key.startsWith('slate')) {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        content = content.replace(regex, value);
      } else {
        // Hex codes
        const regex = new RegExp(key, 'g');
        content = content.replace(regex, value);
      }
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
      totalReplacements++;
    }
  }
});

console.log(`Done! Updated ${totalReplacements} files.`);
