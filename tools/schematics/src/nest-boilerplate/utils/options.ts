import { strings } from '@angular-devkit/core';
import { SchematicsException } from '@angular-devkit/schematics';
import { NestBoilerplateSchema, NormalizedOptions } from '../schema';
import { PRESETS } from './presets';

export function normalizeOptions(input: NestBoilerplateSchema): NormalizedOptions {
  const name = strings.dasherize((input.name || '').trim());
  if (!name) {
    throw new SchematicsException('name is required');
  }

  const includeGraphql = input.apiStyle === 'graphql' || input.apiStyle === 'both';
  const includeRest = input.apiStyle === 'rest' || input.apiStyle === 'both';

  let nodeMajor = 20;
  let nestMajor = 11;
  let supportTier: NormalizedOptions['supportTier'] = 'official';

  if (input.versionMode === 'preset') {
    const preset = input.preset || 'node20-nest11';
    const resolved = PRESETS[preset];
    nodeMajor = resolved.nodeMajor;
    nestMajor = resolved.nestMajor;
  } else {
    supportTier = 'custom-best-effort';
    nodeMajor = Number.parseInt(input.nodeVersion || '', 10);
    nestMajor = Number.parseInt(input.nestVersion || '', 10);
  }

  if (!Number.isInteger(nodeMajor) || !Number.isInteger(nestMajor)) {
    throw new SchematicsException('Invalid nodeVersion or nestVersion');
  }

  return {
    ...input,
    name,
    nodeMajor,
    nestMajor,
    supportTier,
    includeGraphql,
    includeRest,
    graphqlApproach: includeGraphql ? input.graphqlApproach || 'code-first' : undefined,
    graphqlDriver: includeGraphql ? input.graphqlDriver || 'apollo' : undefined
  };
}
