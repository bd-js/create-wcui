import fs from 'iofs'
import { join, resolve, dirname, parse } from 'path'
import Es from 'esbuild'
import chokidar from 'chokidar'
import { red, blue } from 'kolorist'
import { compileScss } from './utils.js'

const noc = Buffer.from('')

export default function compile(root = '', isProd = false, es) {
  //
  const SOURCE_DIR = join(root, 'src')
  const DIST_DIR = join(root, 'dist')

  const OPTIONS = {
    target: es || 'esnext',
    minify: isProd,
    format: 'esm'
  }

  if (isProd) {
    fs.rm(DIST_DIR, true)
  }

  let ready = false

  chokidar
    .watch(SOURCE_DIR)
    .on('all', (act, filePath) => {
      if (isProd || ready) {
        let file = filePath.slice(SOURCE_DIR.length)
        let target = join(DIST_DIR, file)

        if (act === 'add' || act === 'change') {
          let ext = file.slice(file.lastIndexOf('.') + 1)

          switch (ext) {
            case 'css':
            case 'jpg':
            case 'png':
            case 'svg':
            case 'json':
            case 'gif':
            case 'webp':
              console.log('复制 %s ...', blue(file))
              fs.cp(filePath, target)
              break

            case 'js':
              {
                let code = fs.cat(filePath).toString()
                console.log('编译 %s ...', blue(file))
                code = Es.transformSync(code, OPTIONS).code.replace(
                  /css`([\w\W]*?)`/g,
                  function (m, scss) {
                    scss = compileScss(scss)
                    return `css\`${scss}\``
                  }
                )

                fs.echo(code, target)
              }
              break
          }
        }
      }
    })
    .on('ready', () => {
      ready = true
      if (isProd) {
        process.exit()
      }
    })
}
