import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import glob from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BASE_URL = 'https://omniflow.dev'

const PRIORITY_MAP: Record<string, string> = {
  '/': '1.0',
  '/settings': '0.8',
  default: '0.7',
}

const CHANGE_FREQ_MAP: Record<string, string> = {
  '/': 'daily',
  default: 'weekly',
}

// extract routes from router files
async function extractRoutesFromFiles(): Promise<string[]> {
  const routerDir = path.resolve(__dirname, '../src/router')
  const routerFiles = glob.sync('*.ts', { cwd: routerDir })

  const paths: Set<string> = new Set()

  // main routes
  paths.add('/')
  paths.add('/settings')

  for (const file of routerFiles) {
    if (file.startsWith('_')) continue // Skip _index.ts

    const filePath = path.join(routerDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    // Extract paths
    const pathRegex = /path:\s*['"`]([^'"`]+)['"`]/g
    let match

    while ((match = pathRegex.exec(content)) !== null) {
      const routePath = match[1]

      // skip empty paths
      if (routePath !== '' && routePath !== '/') {
        paths.add(routePath)
      }
    }
  }

  return Array.from(paths).sort()
}

// generate XML sitemap
function generateSitemap(routes: string[]): string {
  const today = new Date().toISOString().split('T')[0]

  const urlEntries = routes
    .map((route) => {
      const url = `${BASE_URL}${route}`
      const priority = PRIORITY_MAP[route] || PRIORITY_MAP.default
      const changefreq = CHANGE_FREQ_MAP[route] || CHANGE_FREQ_MAP.default

      return `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`
}

async function main() {
  try {
    const paths = await extractRoutesFromFiles()

    console.log(`found ${paths.length} routes`)

    const sitemap = generateSitemap(paths)

    const publicDir = path.resolve(__dirname, '../public')
    const sitemapPath = path.join(publicDir, 'sitemap.xml')

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    fs.writeFileSync(sitemapPath, sitemap, 'utf-8')

    console.log(`sitemap generated successfully: ${sitemapPath}`)
    console.log(`total URLs: ${paths.length}`)
  } catch (error) {
    console.error('error generating sitemap:', error)
    process.exit(1)
  }
}

main()
