import fs from 'iofs'
import { join } from 'path'
import Es from 'esbuild'
import chokidar from 'chokidar'
import { red, blue } from 'kolorist'
import { compileScss } from './utils.js'

const OPTIONS = {
  target: 'esnext',
  minify: false,
  format: 'esm'
}

function parse(origin, target, name) {
  let ext = name.slice(name.lastIndexOf('.') + 1)

  switch (ext) {
    case 'css':
    case 'jpg':
    case 'png':
    case 'svg':
    case 'json':
    case 'gif':
    case 'webp':
      console.log('复制 %s ...', blue(name))
      fs.cp(origin, target)
      break

    case 'js':
      {
        let code = fs.cat(origin).toString()
        console.log('编译 %s ...', blue(name))
        try {
          code = code.replace(/css`([\w\W]*?)`/g, function (m, scss) {
            scss = compileScss(scss)
            return `css\`${scss}\``
          })
          code = Es.transformSync(code, OPTIONS).code
        } catch (err) {
          console.log('compile scss: ', name)
          console.error(err)
        }
        fs.echo(code, target)
      }
      break
  }
}

export default function compile(root = '', isProd = false, es = 'esnext') {
  //
  const SOURCE_DIR = join(root, 'src')
  const DIST_DIR = join(root, 'dist')

  OPTIONS.target = es
  OPTIONS.minify = isProd

  if (isProd) {
    fs.rm(DIST_DIR, true)

    let list = fs.ls(SOURCE_DIR, true)

    list.forEach(it => {
      if (fs.isfile(it)) {
        if (it.endsWith('.DS_Store') || it.includes('/.')) {
          return
        }
        let name = it.slice(SOURCE_DIR.length)
        let target = join(DIST_DIR, name)
        parse(it, target, name)
      }
    })
  } else {
    let ready = false

    chokidar
      .watch(SOURCE_DIR)
      .on('all', (act, filePath) => {
        let name = filePath.slice(SOURCE_DIR.length)
        let target = join(DIST_DIR, name)

        if (ready) {
          console.clear()
        }

        if (act === 'add' || act === 'change') {
          parse(filePath, target, name)
        }
      })
      .on('ready', () => {
        ready = true
      })
  }
}
