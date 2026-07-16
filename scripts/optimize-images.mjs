/**
 * فشرده‌سازی JPG/PNG داخل src/assets (in-place)
 * اجرا: node scripts/optimize-images.mjs
 */
import { readdir, stat, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = path.join(root, 'src', 'assets');

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png']);

async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await walk(full)));
        } else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) {
            files.push(full);
        }
    }

    return files;
}

async function optimizeFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const before = (await stat(filePath)).size;
    const input = await readFile(filePath);
    const rel = path.relative(assetsDir, filePath).replace(/\\/g, '/');
    const isHero = rel.startsWith('hero') || rel.includes('hero-');
    const maxWidth = isHero ? 1920 : 1400;

    let pipeline = sharp(input).rotate().resize({
        width: maxWidth,
        height: maxWidth,
        fit: 'inside',
        withoutEnlargement: true,
    });

    let output;
    if (ext === '.png') {
        output = await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer();
    } else {
        output = await pipeline.jpeg({ quality: 78, mozjpeg: true }).toBuffer();
    }

    if (output.length >= before * 0.98) {
        return { filePath, before, after: before, skipped: true };
    }

    await writeFile(filePath, output);
    return { filePath, before, after: output.length, skipped: false };
}

const files = await walk(assetsDir);
let saved = 0;

for (const file of files) {
    const result = await optimizeFile(file);
    const delta = result.before - result.after;
    if (!result.skipped) saved += delta;
    const label = path.relative(root, result.filePath);
    console.log(
        `${result.skipped ? 'skip' : 'ok  '} ${label}  ${(result.before / 1024).toFixed(0)}KB → ${(result.after / 1024).toFixed(0)}KB`,
    );
}

console.log(`\nSaved ~${(saved / 1024).toFixed(0)} KB total`);
