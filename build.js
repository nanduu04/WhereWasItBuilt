import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure dist directory exists
fs.ensureDirSync('dist');

// Copy static files
const filesToCopy = [
  'manifest.json',
  'src/popup/popup.html'
];

filesToCopy.forEach(file => {
  let destination;
  if (file === 'src/popup/popup.html') {
    destination = path.join(__dirname, 'dist', 'popup.html');
  } else {
    destination = path.join(__dirname, 'dist', path.basename(file));
  }
  const source = path.join(__dirname, file);
  if (fs.existsSync(source)) {
    fs.copySync(source, destination);
    console.log(`Copied ${file} to ${destination}`);
  } else {
    console.warn(`Warning: ${file} not found`);
  }
}); 