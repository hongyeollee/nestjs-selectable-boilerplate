export type PackageManager = 'npm' | 'pnpm';
export type VersionMode = 'preset' | 'custom';
export type VersionPreset = 'node20-nest11' | 'node22-nest11' | 'node20-nest10';
export type Runtime = 'express' | 'fastify';
export type ApiStyle = 'rest' | 'graphql' | 'both';
export type GraphqlApproach = 'code-first' | 'schema-first';
export type GraphqlDriver = 'apollo' | 'mercurius';
export type Database = 'postgres' | 'mysql' | 'mongodb';
export type Orm = 'prisma' | 'typeorm' | 'mongoose';
export type Auth = 'none' | 'jwt';
export type Validation = 'class-validator' | 'zod';
export type TestPreset = 'unit' | 'unit-e2e';

export interface NestBoilerplateSchema {
  name: string;
  packageManager: PackageManager;
  versionMode: VersionMode;
  preset?: VersionPreset;
  nodeVersion?: string;
  nestVersion?: string;
  runtime: Runtime;
  apiStyle: ApiStyle;
  graphqlApproach?: GraphqlApproach;
  graphqlDriver?: GraphqlDriver;
  database: Database;
  orm: Orm;
  auth: Auth;
  validation: Validation;
  swagger: boolean;
  testPreset: TestPreset;
  docker: boolean;
}

export interface NormalizedOptions extends NestBoilerplateSchema {
  nodeMajor: number;
  nestMajor: number;
  supportTier: 'official' | 'custom-best-effort';
  includeGraphql: boolean;
  includeRest: boolean;
}
