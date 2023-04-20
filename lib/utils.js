import scss from '@bytedo/sass'
import fs from 'iofs'

const OPTIONS = {
  indentType: 'space',
  indentWidth: 2
}

/**
 * 编译scss为css
 * @param source <String> scss代码
 * @param mini <Boolean> 是否压缩
 */
export function compileScss(source, mini = true) {
  let style = mini ? 'compressed' : 'expanded'
  try {
    return scss
      .compileString(source.replace(/@loop/g, '@each'), { style, ...OPTIONS })
      .css.trim()
  } catch (err) {
    console.log('compile scss: ', file)
    console.error(err)
    return ''
  }
}
