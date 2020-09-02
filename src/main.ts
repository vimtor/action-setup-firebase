import * as core from '@actions/core';
import * as exec from '@actions/exec';

const run = async () => {
  core.info(
    ` Available environment variables:\n -> ${Object.keys(process.env)
      .map(i => `${i} :: ${process.env[i]}`)
      .join('\n -> ')}`,
  );

  core.info('Setting input and environment variables');
  const token = core.getInput('firebase-token');

  if (!token) {
    throw new Error('Missing mandatory input: firebase-token');
  }

  core.exportVariable('FIREBASE_TOKEN', token);
  await exec.exec('npm', ['install', '-g', 'firebase-tools']);
};

run()
  .then(() => core.info('Updated files version successfully'))
  .catch(error => core.setFailed(error.message));
