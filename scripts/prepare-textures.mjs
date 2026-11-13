import { mkdir, access, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'

const textures = {
  sun: '2k_sun.jpg', mercury: '2k_mercury.jpg', venus: '2k_venus_atmosphere.jpg',
  earth: '2k_earth_daymap.jpg', clouds: '2k_earth_clouds.jpg', mars: '2k_mars.jpg',
  jupiter: '2k_jupiter.jpg', saturn: '2k_saturn.jpg', uranus: '2k_uranus.jpg', neptune: '2k_neptune.jpg',
}
await mkdir('public/textures/2k', { recursive: true })
await mkdir('public/textures/1k', { recursive: true })
for (const [name, source] of Object.entries(textures)) {
  const high = `public/textures/2k/${name}.jpg`
  try { await access(high) } catch {
    const bytes = execFileSync('curl', ['-fSL', '--retry', '2', '--max-time', '60', `https://www.solarsystemscope.com/textures/download/${source}`], { maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'inherit'] })
    await writeFile(high, await sharp(bytes).resize({ width: 2048, withoutEnlargement: true }).jpeg({ quality: 88 }).toBuffer())
  }
  await sharp(high).resize({ width: 1024 }).jpeg({ quality: 80 }).toFile(`public/textures/1k/${name}.jpg`)
  console.log(`✓ ${name}`)
}
