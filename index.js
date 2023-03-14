#!/usr/bin/env node

/**
 * {}
 * @author yutent<yutent.io@gmail.com>
 * @date 2022/09/28 15:12:45
 */

import fs from 'iofs'
import { join, normalize } from 'path'
import { red, blue } from 'kolorist'

import compile from './lib/main.js'

const WORK_SPACE = process.cwd()
const IS_WINDOWS = process.platform === 'win32'

const NODE_VERSION = +process.versions.node.split('.').slice(0, 2).join('.')

let args = process.argv.slice(2)

if (NODE_VERSION < 16.6) {
  console.log(red('Error: 你当前的环境不满足 @bd/core 构建工具的要求'))
  console.log(
    '@bd/core 需要Node.js版本在 %s 以上, \n你当前的Node.js版本为: %s',
    blue('v16.6.0'),
    red(process.version),
    '\n\n'
  )
  process.exit()
}

switch (args[0]) {
  case 'dev':
    compile(WORK_SPACE)
    break

  case 'build':
    compile(WORK_SPACE, true)
    break

  case 'build-es6':
    compile(WORK_SPACE, true, 'es6')
    break
}
