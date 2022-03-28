import { execSync } from 'child_process'
import * as toolCache from '@actions/tool-cache'
import * as core from '@actions/core'
import commandExists from 'command-exists'

const installNpm = () => execSync('npm install -g firebase-tools')
const getVersion = () => Buffer.from(execSync('firebase --version').buffer).toString()

const installBash = async (os: 'Linux' | 'macOS') => {
  let toolPath: string
  if (os === 'Linux') {
    toolPath = await toolCache.downloadTool('https://firebase.tools/bin/linux/latest')
  } else {
    toolPath = await toolCache.downloadTool('https://firebase.tools/bin/macos/latest')
  }

  const version = getVersion()

  const cachedPath = await toolCache.cacheDir(toolPath, 'firebase-tools', version)
  core.addPath(cachedPath)
}

const run = async () => {
  const token = core.getInput('firebase-token')
  const os = process.env.RUNNER_OS

  if (!token) {
    throw new Error('Missing mandatory input: firebase-token')
  }

  core.exportVariable('FIREBASE_TOKEN', token)
  core.info('Exported environment variable FIREBASE_TOKEN')

  if (await commandExists('npm')) {
    // TODO: Add cache
    core.info('Detected NPM installation')
    try {
      core.info('Trying to install firebase-tools using NPM')
      installNpm()
    } catch (e) {
      core.info('Installation failed through NPM (maybe you forgot actions/setup-node before this action)')

      if (os === 'Linux' || os === 'macOS') {
        core.info('Trying BASH instead')
        await installBash(os)
      } else {
        throw new Error('On windows you must setup node before running this action')
      }
    }
  } else if (os === 'Linux' || os === 'macOS') {
    core.info('Trying to install firebase-tools using BASH')
    await installBash(os)
  } else if (os === 'Windows') {
    throw new Error('On windows you must setup node before running this action')
  }
}

run()
  .then(() => core.info('Successfully installed firebase-tools CLI'))
  .catch(error => core.setFailed(error.message))
