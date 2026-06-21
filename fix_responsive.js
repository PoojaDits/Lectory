import fs from 'fs';
import path from 'path';

const dir = './src/components/sections';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace max-w-8xl and max-w-9xl with max-w-7xl for consistent responsiveness
    content = content.replace(/max-w-[89]xl/g, 'max-w-7xl');
    
    fs.writeFileSync(filePath, content, 'utf-8');
  }
});
console.log('Fixed container widths.');
