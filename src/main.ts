import { execSync } from 'child_process';
import * as core from '@actions/core';
import commandExists from 'command-exists';

const installNpm = () => execSync('npm install -g firebase-tools');
const installBash = () => execSync('curl -sL https://firebase.tools | bash');

const run = async () => {
  const token = core.getInput('firebase-token');
  const os = process.env.RUNNER_OS;

  if (!token) {
    throw new Error('Missing mandatory input: firebase-token');
  }

  core.exportVariable('FIREBASE_TOKEN', token);
  core.info('Exported environment variable FIREBASE_TOKEN');

  if (await commandExists('npm')) {
    core.info('Detected NPM installation');
    try {
      core.info('Trying to install firebase-tools using NPM');
      installNpm();
    } catch (e) {
      core.info('Installation failed through NPM (maybe you forgot actions/setup-node before this action)');
      core.info('Trying BASH instead');
      installBash();
    }
  } else if (os === 'Linux' || os === 'macOS') {
    core.info('Trying to install firebase-tools using BASH');
    installBash();
  } else if (os === 'Windows') {
    throw new Error('On windows you must setup node before running this action');
  }
};

run()
  .then(() => core.info('Successfully installed firebase-tools CLI'))
  .catch(error => core.setFailed(error.message));
