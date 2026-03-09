#!/usr/bin/env node

const { createInterface } = require('node:readline/promises');
const { stdin, stdout, exit, cwd } = require('node:process');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const PRESETS = ['node20-nest11', 'node22-nest11', 'node20-nest10'];

function printHelp() {
  stdout.write(
    [
      'nest-flex commands:',
      '  init      Run interactive wizard',
      '  generate  Forward options to schematics',
      '',
      'Examples:',
      '  npx @hongyeol/nest-flex-schematics init',
      '  npx @hongyeol/nest-flex-schematics generate --name my-app --package-manager npm --version-mode preset --preset node20-nest11 --runtime fastify --api-style rest --database postgres --orm prisma --auth jwt --validation class-validator --swagger --test-preset unit --no-docker'
    ].join('\n') + '\n'
  );
}

async function promptInput(rl, message, fallback) {
  const answer = (await rl.question(`${message}${fallback ? ` (${fallback})` : ''}: `)).trim();
  return answer || fallback;
}

async function promptSelect(rl, message, options) {
  stdout.write(`\n${message}\n`);
  options.forEach((option, idx) => {
    stdout.write(`  ${idx + 1}) ${option}\n`);
  });

  while (true) {
    const raw = (await rl.question('Select number: ')).trim();
    const selected = Number.parseInt(raw, 10);
    if (Number.isInteger(selected) && selected >= 1 && selected <= options.length) {
      return options[selected - 1];
    }
    stdout.write('Invalid selection. Try again.\n');
  }
}

async function promptConfirm(rl, message, defaultValue) {
  const hint = defaultValue ? 'Y/n' : 'y/N';
  while (true) {
    const raw = (await rl.question(`${message} (${hint}): `)).trim().toLowerCase();
    if (!raw) return defaultValue;
    if (raw === 'y' || raw === 'yes') return true;
    if (raw === 'n' || raw === 'no') return false;
    stdout.write('Please answer y or n.\n');
  }
}

function resolveOrmOptions(database) {
  if (database === 'postgres' || database === 'mysql') return ['prisma', 'typeorm'];
  return ['mongoose'];
}

function validateSelections(result) {
  const errors = [];

  if (result.database === 'mongodb' && result.orm !== 'mongoose') {
    errors.push('mongodb only supports mongoose.');
  }

  if ((result.database === 'postgres' || result.database === 'mysql') && result.orm === 'mongoose') {
    errors.push('mongoose is only supported with mongodb.');
  }

  if ((result.apiStyle === 'graphql' || result.apiStyle === 'both') && result.graphqlDriver === 'mercurius') {
    if (result.runtime !== 'fastify') {
      errors.push('mercurius is only supported when runtime is fastify.');
    }
    if (Number.parseInt(result.nestVersion, 10) < 11) {
      errors.push('mercurius requires nest >= 11.');
    }
  }

  if (Number.parseInt(result.nestVersion, 10) < 11 && result.runtime === 'fastify' && result.swagger) {
    errors.push('nest < 11 does not support fastify + swagger in this generator.');
  }

  return errors;
}

function buildSchematicsArgs(input) {
  const collectionPath = path.resolve(__dirname, '..', 'tools', 'schematics', 'collection.json');
  const args = [
    require.resolve('@angular-devkit/schematics-cli/bin/schematics.js'),
    `${collectionPath}:nest-boilerplate`,
    '--debug=false',
    '--dry-run=false',
    '--no-interactive',
    '--name',
    input.name,
    '--package-manager',
    input.packageManager,
    '--version-mode',
    input.versionMode,
    '--runtime',
    input.runtime,
    '--api-style',
    input.apiStyle,
    '--database',
    input.database,
    '--orm',
    input.orm,
    '--auth',
    input.auth,
    '--validation',
    input.validation,
    '--test-preset',
    input.testPreset,
    input.swagger ? '--swagger' : '--no-swagger',
    input.docker ? '--docker' : '--no-docker'
  ];

  if (input.versionMode === 'preset') {
    args.push('--preset', input.preset);
  } else {
    args.push('--node-version', input.nodeVersion, '--nest-version', input.nestVersion);
  }

  if (input.apiStyle === 'graphql' || input.apiStyle === 'both') {
    args.push('--graphql-approach', input.graphqlApproach, '--graphql-driver', input.graphqlDriver);
  }

  return args;
}

async function runInit() {
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    stdout.write('\nNest Flex interactive init\n');

    const name = await promptInput(rl, '1) Project name', 'my-nest-app');
    const packageManager = await promptSelect(rl, '2) Package manager', ['npm', 'pnpm']);
    const versionMode = await promptSelect(rl, '3) Version mode', ['preset', 'custom']);

    let preset = 'node20-nest11';
    let nodeVersion = '20';
    let nestVersion = '11';
    if (versionMode === 'preset') {
      preset = await promptSelect(rl, '4) Preset', PRESETS);
      if (preset === 'node20-nest10') {
        nodeVersion = '20';
        nestVersion = '10';
      } else if (preset === 'node22-nest11') {
        nodeVersion = '22';
        nestVersion = '11';
      }
    } else {
      nodeVersion = await promptInput(rl, '4) Node major version', '20');
      nestVersion = await promptInput(rl, '4) Nest major version', '11');
    }

    const runtime = await promptSelect(rl, '5) Runtime', ['express', 'fastify']);
    const apiStyle = await promptSelect(rl, '6) API style', ['rest', 'graphql', 'both']);

    let graphqlApproach = 'code-first';
    let graphqlDriver = 'apollo';
    if (apiStyle === 'graphql' || apiStyle === 'both') {
      graphqlApproach = await promptSelect(rl, '7) GraphQL approach', ['code-first', 'schema-first']);
      const availableDrivers = runtime === 'fastify' ? ['apollo', 'mercurius'] : ['apollo'];
      graphqlDriver = await promptSelect(rl, '7) GraphQL driver', availableDrivers);
    }

    const database = await promptSelect(rl, '8) Database', ['postgres', 'mysql', 'mongodb']);
    const orm = await promptSelect(rl, '8) ORM/ODM', resolveOrmOptions(database));

    const auth = await promptSelect(rl, '9) Auth', ['none', 'jwt']);
    const validation = await promptSelect(rl, '9) Validation', ['class-validator', 'zod']);
    const swagger = await promptConfirm(rl, '9) Enable Swagger?', true);
    const testPreset = await promptSelect(rl, '9) Test preset', ['unit', 'unit-e2e']);
    const docker = await promptConfirm(rl, '9) Include Docker files?', true);

    const result = {
      name,
      packageManager,
      versionMode,
      preset,
      nodeVersion,
      nestVersion,
      runtime,
      apiStyle,
      graphqlApproach,
      graphqlDriver,
      database,
      orm,
      auth,
      validation,
      swagger,
      testPreset,
      docker
    };

    const errors = validateSelections(result);
    if (errors.length) {
      stdout.write(`\nConfiguration errors:\n- ${errors.join('\n- ')}\n`);
      exit(1);
    }

    const summary = [
      '',
      '10) Summary',
      `- name: ${result.name}`,
      `- packageManager: ${result.packageManager}`,
      `- versionMode: ${result.versionMode}`,
      result.versionMode === 'preset'
        ? `- preset: ${result.preset}`
        : `- node/nest: ${result.nodeVersion}/${result.nestVersion}`,
      `- runtime: ${result.runtime}`,
      `- apiStyle: ${result.apiStyle}`,
      result.apiStyle === 'rest'
        ? '- graphql: disabled'
        : `- graphql: ${result.graphqlApproach}/${result.graphqlDriver}`,
      `- database/orm: ${result.database}/${result.orm}`,
      `- auth: ${result.auth}`,
      `- validation: ${result.validation}`,
      `- swagger: ${result.swagger}`,
      `- testPreset: ${result.testPreset}`,
      `- docker: ${result.docker}`,
      ''
    ];
    stdout.write(summary.join('\n') + '\n');

    const confirmed = await promptConfirm(rl, 'Generate with these options?', true);
    if (!confirmed) {
      stdout.write('Cancelled.\n');
      return;
    }

    const args = buildSchematicsArgs(result);
    const run = spawnSync(process.execPath, args, {
      stdio: 'inherit',
      cwd: cwd()
    });

    if (run.status !== 0) {
      exit(run.status || 1);
    }
  } finally {
    rl.close();
  }
}

function runGenerate(rawArgs) {
  const collectionPath = path.resolve(__dirname, '..', 'tools', 'schematics', 'collection.json');
  const args = [
    require.resolve('@angular-devkit/schematics-cli/bin/schematics.js'),
    `${collectionPath}:nest-boilerplate`,
    ...rawArgs
  ];

  if (!rawArgs.some((arg) => arg.startsWith('--debug'))) {
    args.push('--debug=false');
  }

  if (!rawArgs.some((arg) => arg.startsWith('--dry-run'))) {
    args.push('--dry-run=false');
  }

  const run = spawnSync(process.execPath, args, {
    stdio: 'inherit',
    cwd: cwd()
  });

  if (run.status !== 0) {
    exit(run.status || 1);
  }
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  if (command === 'init') {
    await runInit();
    return;
  }

  if (command === 'generate') {
    runGenerate(rest);
    return;
  }

  stdout.write(`Unknown command: ${command}\n\n`);
  printHelp();
  exit(1);
}

main().catch((error) => {
  stdout.write(`Unexpected error: ${error instanceof Error ? error.message : String(error)}\n`);
  exit(1);
});
