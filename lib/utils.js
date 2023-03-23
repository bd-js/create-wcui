import scss from '@bytedo/sass'
import fs from 'iofs'

const OPTIONS = {
  indentType: 'space',
  indentWidth: 2
}

/**
 * 编译scss为css
 * @param file <String> 文件路径或scss代码
 * @param mini <Boolean> 是否压缩
 */
export function compileScss(file, mini = true) {
  let style = mini ? 'compressed' : 'expanded'
  try {
    if (fs.isfile(file)) {
      return scss.compile(file, { style, ...OPTIONS }).css.trim()
    } else {
      return scss
        .compileString(file.replace(/@loop/g, '@each'), { style, ...OPTIONS })
        .css.trim()
    }
  } catch (err) {
    console.log('compile scss: ', file)
    console.error(err)
    return ''
  }
}
