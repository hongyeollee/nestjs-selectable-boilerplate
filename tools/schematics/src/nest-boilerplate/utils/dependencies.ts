import { NormalizedOptions } from '../schema';

function nestRange(major: number): string {
  return `^${major}.0.0`;
}

function nestPackage(options: NormalizedOptions, pkg: 'config' | 'graphql' | 'apollo' | 'mercurius' | 'swagger') {
  const isNest11 = options.nestMajor >= 11;
  if (pkg === 'config') return isNest11 ? '^4.0.0' : '^3.0.0';
  if (pkg === 'graphql') return isNest11 ? '^13.0.0' : '^12.0.0';
  if (pkg === 'apollo') return isNest11 ? '^13.0.0' : '^12.0.0';
  if (pkg === 'mercurius') return '^13.0.0';
  return isNest11 ? '^11.0.0' : '^7.0.0';
}

export function resolveDeps(options: NormalizedOptions): {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
} {
  const dependencies: Record<string, string> = {
    '@nestjs/common': nestRange(options.nestMajor),
    '@nestjs/core': nestRange(options.nestMajor),
    '@nestjs/config': nestPackage(options, 'config'),
    'reflect-metadata': '^0.2.2',
    rxjs: '^7.8.1'
  };

  dependencies[options.runtime === 'fastify' ? '@nestjs/platform-fastify' : '@nestjs/platform-express'] =
    nestRange(options.nestMajor);

  if (options.validation === 'class-validator') {
    dependencies['class-transformer'] = '^0.5.1';
    dependencies['class-validator'] = '^0.14.1';
  } else {
    dependencies.zod = '^3.24.2';
  }

  if (options.orm === 'prisma') {
    dependencies['@prisma/client'] = '^6.4.1';
  } else if (options.orm === 'typeorm') {
    dependencies['@nestjs/typeorm'] = nestRange(options.nestMajor);
    dependencies.typeorm = '^0.3.22';
  } else {
    dependencies['@nestjs/mongoose'] = nestRange(options.nestMajor);
    dependencies.mongoose = '^8.12.1';
  }

  if (options.database === 'postgres') dependencies.pg = '^8.13.1';
  if (options.database === 'mysql') dependencies.mysql2 = '^3.12.0';

  if (options.includeGraphql) {
    dependencies['@nestjs/graphql'] = nestPackage(options, 'graphql');
    dependencies.graphql = '^16.10.0';
    if (options.graphqlDriver === 'apollo') {
      dependencies['@nestjs/apollo'] = nestPackage(options, 'apollo');
      dependencies['@apollo/server'] = options.nestMajor >= 11 ? '^5.0.0' : '^4.11.3';
      if (options.runtime === 'fastify') {
        dependencies['@as-integrations/fastify'] = options.nestMajor >= 11 ? '^3.0.0' : '^2.0.0';
      }
    } else {
      dependencies['@nestjs/mercurius'] = nestPackage(options, 'mercurius');
      dependencies.mercurius = '^16.0.1';
    }
  }

  if (options.auth === 'jwt') {
    dependencies['@nestjs/jwt'] = nestRange(options.nestMajor);
    dependencies['@nestjs/passport'] = nestRange(options.nestMajor);
    dependencies.passport = '^0.7.0';
    dependencies['passport-jwt'] = '^4.0.1';
  }

  if (options.includeRest && options.swagger) {
    dependencies['@nestjs/swagger'] = nestPackage(options, 'swagger');
    dependencies['swagger-ui-express'] = '^5.0.1';
    if (options.runtime === 'fastify') {
      dependencies['@fastify/static'] = 'latest';
      dependencies['@fastify/view'] = 'latest';
    }
  }

  const devDependencies: Record<string, string> = {
    '@nestjs/cli': nestRange(options.nestMajor),
    '@nestjs/schematics': nestRange(options.nestMajor),
    '@nestjs/testing': nestRange(options.nestMajor),
    '@types/node': '^20.17.23',
    typescript: '^5.8.2',
    jest: '^29.7.0',
    '@types/jest': '^29.5.14',
    'ts-jest': '^29.2.6',
    eslint: '^9.21.0',
    prettier: '^3.5.2'
  };

  if (options.orm === 'prisma') devDependencies.prisma = '^6.4.1';
  if (options.auth === 'jwt') devDependencies['@types/passport-jwt'] = '^4.0.1';
  if (options.testPreset === 'unit-e2e') {
    devDependencies.supertest = '^7.0.0';
    devDependencies['@types/supertest'] = '^6.0.3';
  }

  return { dependencies, devDependencies };
}
