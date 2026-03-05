import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  noop,
  url
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { NestBoilerplateSchema } from './schema';
import { normalizeOptions } from './utils/options';
import { compatibilityErrors, compatibilityWarnings } from './utils/compatibility';
import { resolveDeps } from './utils/dependencies';

export function nestBoilerplate(input: NestBoilerplateSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const options = normalizeOptions(input);
    const errors = compatibilityErrors(options);
    if (errors.length) {
      throw new Error(errors.join('\n'));
    }
    for (const warning of compatibilityWarnings(options)) {
      context.logger.warn(warning);
    }

    const deps = resolveDeps(options);
    const vars = {
      ...strings,
      ...options,
      dot: '.',
      packageJsonDependencies: JSON.stringify(deps.dependencies, null, 2),
      packageJsonDevDependencies: JSON.stringify(deps.devDependencies, null, 2),
      supportTierLabel: options.supportTier === 'official' ? 'Official Support' : 'Custom (Best-Effort)',
      dockerfileBaseImage: `node:${options.nodeMajor}-alpine`
    };

    const root = options.name;
    return chain([
      merge('./files/base', root, vars),
      options.includeRest ? merge('./files/rest', root, vars) : noop(),
      options.includeGraphql
        ? merge(
            options.graphqlApproach === 'schema-first'
              ? './files/graphql-schema-first'
              : './files/graphql-code-first',
            root,
            vars
          )
        : noop(),
      options.auth === 'jwt' ? merge('./files/auth-jwt', root, vars) : noop(),
      options.orm === 'prisma' ? merge('./files/db-prisma', root, vars) : noop(),
      options.orm === 'typeorm' ? merge('./files/db-typeorm', root, vars) : noop(),
      options.orm === 'mongoose' ? merge('./files/db-mongoose', root, vars) : noop(),
      options.testPreset === 'unit-e2e' ? merge('./files/testing-e2e', root, vars) : noop(),
      options.docker ? merge('./files/deploy-docker', root, vars) : noop()
    ])(tree, context);
  };
}

function merge(path: string, root: string, vars: Record<string, unknown>): Rule {
  return mergeWith(apply(url(path), [applyTemplates(vars), move(root)]));
}
