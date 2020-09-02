import * as core from '@actions/core';
import * as exec from '@actions/exec';
import commandExists from 'command-exists';

const run = async () => {
  core.info(
    ` Available environment variables:\n -> ${Object.keys(process.env)
      .map(i => `${i} :: ${process.env[i]}`)
      .join('\n -> ')}`,
  );

  core.info('Setting input and environment variables');
  const token = core.getInput('firebase-token');
  const os = process.env.RUNNER_OS;

  if (!token) {
    throw new Error('Missing mandatory input: firebase-token');
  }

  core.exportVariable('FIREBASE_TOKEN', token);
  if (await commandExists('npm')) {
    await exec.exec('npm', ['install', '-g', 'firebase-tools']);
  } else if (os === 'Linux') {
    await exec.exec('curl', ['-sL', 'https://firebase.tools', '|', 'bash']);
  } else {
    throw new Error('On windows you need to setup node before');
  }
};

run()
  .then(() => core.info('Updated files version successfully'))
  .catch(error => core.setFailed(error.message));
