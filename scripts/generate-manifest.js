// Este script Node.js genera el manifest.json correcto para el build de la extensión
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDir = path.join(__dirname, '../build');
const publicDir = path.join(__dirname, '../public');
const manifestSrc = path.join(publicDir, 'manifest.json');
const manifestDest = path.join(buildDir, 'manifest.json');
const assetsDir = path.join(buildDir, 'assets');

// Encuentra el archivo main-*.js generado por Vite
function findMainJs() {
  const files = fs.readdirSync(assetsDir);
  const mainJs = files.find(f => /^main-.*\.js$/.test(f));
  if (!mainJs) throw new Error('No se encontró main-*.js en assets');
  return `assets/${mainJs}`;
}

function updateManifest() {
  const manifest = JSON.parse(fs.readFileSync(manifestSrc, 'utf8'));
  const mainJsPath = findMainJs();
  if (manifest.content_scripts && manifest.content_scripts[0]) {
    manifest.content_scripts[0].js = [mainJsPath];
  }
  fs.writeFileSync(manifestDest, JSON.stringify(manifest, null, 2));
  console.log('Manifest actualizado:', manifestDest);
}

updateManifest();
