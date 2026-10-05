#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import { join, resolve, basename } from 'node:path';
import process from 'node:process';

// Configuration & Limits
const MAX_DESCRIPTION_LENGTH = 150;
const MAX_README_SNIPPET_LENGTH = 1500;
const MAX_RUNTIME_FRAMEWORKS = 18;
const MAX_DEV_TOOLS = 8;
const MAX_ENTRYPOINTS = 8;
const MAX_TOP_DIRECTORIES = 15;

const IGNORED_DIRS = new Set([
  '.git', 'node_modules', 'dist', 'build', '.next', '.nuxt', '.turbo',
  'coverage', '.venv', 'venv', '__pycache__', 'target', 'bin', 'obj', '.gemini'
]);

const ENTRY_PATTERNS = [
  'main.', 'index.', 'app.', 'server.', 'mod.', 'lib.', 'routes.', 'docker-compose'
];

const TOOLING_NOISE = /^(eslint|prettier|@types\/|husky|lint-staged|ts-node|rimraf|commitlint)/i;

/**
 * Safely fetches plain text from a URL without throwing uncaught exceptions.
 */
async function safeFetchText(url, headers = {}, fallback = '') {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return fallback;
    }
    return await res.text();
  } catch {
    return fallback;
  }
}

/**
 * Safely fetches and parses JSON from a URL without throwing uncaught exceptions.
 */
async function safeFetchJson(url, headers = {}, fallback = null) {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return fallback;
    }
    return await res.json();
  } catch {
    return fallback;
  }
}

/**
 * Extracts a concise one-line description from README snippet.
 */
function extractDescriptionFromReadme(readmeSnippet) {
  if (!readmeSnippet) {
    return '';
  }
  const lines = readmeSnippet.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('<') && !trimmed.startsWith('![')) {
      return trimmed
        .replace(/\*\*/g, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .slice(0, MAX_DESCRIPTION_LENGTH);
    }
  }
  return '';
}

/**
 * Filters and collects non-tooling dependencies up to a specified limit.
 */
function collectDependencies(depsObject, limit) {
  const collected = [];
  for (const dep of Object.keys(depsObject || {})) {
    if (!TOOLING_NOISE.test(dep)) {
      collected.push(dep);
      if (collected.length >= limit) {
        break;
      }
    }
  }
  return collected;
}

/**
 * Extracts high-signal runtime frameworks and dev tools.
 */
function extractFrameworksFromPkg(pkg) {
  if (!pkg || typeof pkg !== 'object') {
    return { runtimeFrameworks: [], devTools: [] };
  }
  return {
    runtimeFrameworks: collectDependencies(pkg.dependencies, MAX_RUNTIME_FRAMEWORKS),
    devTools: collectDependencies(pkg.devDependencies, MAX_DEV_TOOLS)
  };
}

/**
 * Extracts 1-2 level directory path from split path parts.
 */
function getTopDirectory(parts) {
  if (parts.length <= 1) {
    return '';
  }
  return parts.length === 2 ? parts[0] : `${parts[0]}/${parts[1]}`;
}

/**
 * Classifies a single file path into the scan state accumulator.
 */
function classifyFilePath(relativePath, state) {
  const parts = relativePath.split('/');
  if (parts.some((part) => { return IGNORED_DIRS.has(part); })) {
    return;
  }

  const dir = getTopDirectory(parts);
  if (dir && state.topDirectories.size < MAX_TOP_DIRECTORIES) {
    state.topDirectories.add(dir);
  }

  const base = basename(relativePath).toLowerCase();
  if (base === 'readme.md' && !state.readmeFile) {
    state.readmeFile = relativePath;
  }
  if (base === 'package.json') {
    state.hasPackageJson = true;
  }
  if (state.entrypoints.length < MAX_ENTRYPOINTS && ENTRY_PATTERNS.some((pattern) => { return base.startsWith(pattern); })) {
    state.entrypoints.push(relativePath);
  }
}

/**
 * Parses GitHub repo owner and name from URL or shorthand string.
 */
function parseGitHubUrl(input) {
  const match = input.match(/github\.com\/([^\/]+)\/([^\/#?]+)/i);
  if (match) {
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
  }
  const shorthand = input.match(/^([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/);
  if (shorthand) {
    return { owner: shorthand[1], repo: shorthand[2] };
  }
  return null;
}

/**
 * Constructs raw GitHub content URL.
 */
function getRawGitHubUrl(owner, repo, branch, filePath) {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
}

/**
 * Fetches README snippet from a remote GitHub repository.
 */
async function fetchGitHubReadme(owner, repo, branch, readmePath, headers) {
  if (!readmePath) {
    return '';
  }
  const rawUrl = getRawGitHubUrl(owner, repo, branch, readmePath);
  const rawText = await safeFetchText(rawUrl, headers);
  return rawText.slice(0, MAX_README_SNIPPET_LENGTH);
}

/**
 * Fetches and parses package.json frameworks from a remote GitHub repository.
 */
async function fetchGitHubFrameworks(owner, repo, branch, headers) {
  const pkgUrl = getRawGitHubUrl(owner, repo, branch, 'package.json');
  const pkg = await safeFetchJson(pkgUrl, headers);
  return pkg ? extractFrameworksFromPkg(pkg) : { runtimeFrameworks: [], devTools: [] };
}

/**
 * Fetch remote GitHub repo metadata and tree in a single pass.
 */
async function inspectGitHub(owner, repo) {
  const headers = {
    'User-Agent': 'blog-architect-scanner/1.0',
    'Accept': 'application/vnd.github.v3+json'
  };

  const apiBase = `https://api.github.com/repos/${owner}/${repo}`;
  const repoRes = await fetch(apiBase, { headers });
  if (!repoRes.ok) {
    throw new Error(`GitHub API error (${repoRes.status}): ${repoRes.statusText}`);
  }
  const repoData = await repoRes.json();
  const defaultBranch = repoData.default_branch || 'main';

  const treeData = await safeFetchJson(
    `${apiBase}/git/trees/${defaultBranch}?recursive=1`,
    headers,
    { tree: [] }
  );

  const state = { entrypoints: [], topDirectories: new Set(), readmeFile: '', hasPackageJson: false };
  for (const item of (treeData.tree || [])) {
    if (item.type === 'blob') {
      classifyFilePath(item.path, state);
    }
  }

  const readmeSnippet = await fetchGitHubReadme(owner, repo, defaultBranch, state.readmeFile, headers);
  const frameworks = state.hasPackageJson
    ? await fetchGitHubFrameworks(owner, repo, defaultBranch, headers)
    : { runtimeFrameworks: [], devTools: [] };

  return {
    target: `${owner}/${repo}`,
    description: repoData.description || extractDescriptionFromReadme(readmeSnippet),
    runtimeFrameworks: frameworks.runtimeFrameworks,
    devTools: frameworks.devTools,
    entrypoints: state.entrypoints,
    topDirectories: Array.from(state.topDirectories),
    readmeSnippet
  };
}

/**
 * Safely reads a local README file snippet.
 */
async function readLocalReadme(filePath) {
  if (!filePath) {
    return '';
  }
  try {
    const text = await readFile(filePath, 'utf-8');
    return text.slice(0, MAX_README_SNIPPET_LENGTH);
  } catch {
    return '';
  }
}

/**
 * Safely reads and extracts frameworks from local package.json.
 */
async function readLocalFrameworks(root) {
  try {
    const pkgText = await readFile(join(root, 'package.json'), 'utf-8');
    return extractFrameworksFromPkg(JSON.parse(pkgText));
  } catch {
    return { runtimeFrameworks: [], devTools: [] };
  }
}

/**
 * Recursively walks a directory and triggers callback for each file.
 */
async function walkDirectory(current, onFile) {
  const entries = await readdir(current, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name) || entry.name.startsWith('.')) {
      continue;
    }
    const fullPath = join(current, entry.name);
    if (entry.isDirectory()) {
      await walkDirectory(fullPath, onFile);
    } else if (entry.isFile()) {
      onFile(fullPath);
    }
  }
}

/**
 * Scan a local filesystem directory in a single pass.
 */
async function inspectLocal(dirPath) {
  const root = resolve(dirPath);
  const state = { entrypoints: [], topDirectories: new Set(), readmeFile: '', hasPackageJson: false };

  await walkDirectory(root, (filePath) => {
    const relativePath = filePath.replace(root + '/', '');
    classifyFilePath(relativePath, state);
  });

  const readmeSnippet = await readLocalReadme(state.readmeFile);
  const frameworks = state.hasPackageJson
    ? await readLocalFrameworks(root)
    : { runtimeFrameworks: [], devTools: [] };

  return {
    target: basename(root),
    description: extractDescriptionFromReadme(readmeSnippet),
    runtimeFrameworks: frameworks.runtimeFrameworks,
    devTools: frameworks.devTools,
    entrypoints: state.entrypoints,
    topDirectories: Array.from(state.topDirectories),
    readmeSnippet
  };
}

const input = process.argv[2] || process.cwd();
try {
  const gh = parseGitHubUrl(input);
  const result = gh
    ? await inspectGitHub(gh.owner, gh.repo)
    : await inspectLocal(input);

  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error(JSON.stringify({ error: err.message }, null, 2));
  process.exit(1);
}
