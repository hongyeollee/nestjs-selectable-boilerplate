import { NormalizedOptions } from '../schema';

export function compatibilityErrors(options: NormalizedOptions): string[] {
  const errors: string[] = [];

  if (options.database === 'mongodb' && options.orm !== 'mongoose') {
    errors.push('mongodb only supports mongoose in this generator.');
  }
  if ((options.database === 'postgres' || options.database === 'mysql') && options.orm === 'mongoose') {
    errors.push('mongoose is only supported with mongodb.');
  }

  if (options.includeGraphql && options.graphqlDriver === 'mercurius' && options.runtime !== 'fastify') {
    errors.push('mercurius is available only when runtime=fastify.');
  }

  if (options.includeGraphql && options.graphqlDriver === 'mercurius' && options.nestMajor < 11) {
    errors.push('mercurius support is available only for nest >= 11 in this generator.');
  }

  if (!options.includeGraphql && options.graphqlDriver === 'mercurius') {
    errors.push('graphqlDriver requires apiStyle graphql or both.');
  }

  if (options.nestMajor < 11 && options.runtime === 'fastify' && options.includeRest && options.swagger) {
    errors.push('nest < 11 with fastify + swagger is not supported in this generator.');
  }

  if (options.nestMajor >= 11 && options.nodeMajor < 20) {
    errors.push('nest >= 11 requires node >= 20.');
  }

  return errors;
}

export function compatibilityWarnings(options: NormalizedOptions): string[] {
  const warnings: string[] = [];

  if (options.supportTier === 'custom-best-effort') {
    warnings.push('Custom version mode selected: best-effort support only.');
  }

  if (options.nestMajor < 11) {
    warnings.push('Legacy nest major selected. Use this only when compatibility is required.');
  }

  return warnings;
}
