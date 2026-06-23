const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch monorepo root so Metro can resolve packages/*
config.watchFolders = [monorepoRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Resolve local monorepo packages without npm registry
config.resolver.extraNodeModules = {
  '@lumen_cards/types': path.resolve(monorepoRoot, 'packages/types'),
};

module.exports = config;
