#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

/**
 * Script to audit and revert fenced code blocks to ensure 1:1 English zero-touch compliance.
 * Usage: node audit-backticks.mjs <source-en.md> <target-translated.md>
 */

function extractFencedBlocks(content) {
  // Matches ``` or ~~~ code blocks from opening fence to closing fence
  const regex = /^(?:[ \t]*)(```|~~~)([^\n]*)\n([\s\S]*?)\n(?:[ \t]*)\1[ \t]*$/gm;
  const blocks = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({
      full: match[0],
      fence: match[1],
      info: match[2].trim(),
      code: match[3],
      index: match.index,
      length: match[0].length
    });
  }
  return blocks;
}

function auditAndRevertCodeBlocks() {
  const sourcePath = process.argv[2];
  const targetPath = process.argv[3];

  if (!sourcePath || !targetPath) {
    console.error('Error: Please provide both source and target markdown files.');
    console.log('Usage: node audit-backticks.mjs <source-en.md> <target-translated.md>');
    process.exit(1);
  }

  try {
    const resolvedSource = path.resolve(sourcePath);
    const resolvedTarget = path.resolve(targetPath);

    const sourceContent = fs.readFileSync(resolvedSource, 'utf8');
    let targetContent = fs.readFileSync(resolvedTarget, 'utf8');

    const sourceBlocks = extractFencedBlocks(sourceContent);
    const targetBlocks = extractFencedBlocks(targetContent);

    if (sourceBlocks.length !== targetBlocks.length) {
      console.error(`❌ Code Block Count Mismatch!`);
      console.error(`  - Source file has ${sourceBlocks.length} fenced code block(s).`);
      console.error(`  - Target file has ${targetBlocks.length} fenced code block(s).`);
      console.error(`\nPlease ensure every code block from the source is preserved in the target file.`);
      process.exit(1);
    }

    let revertedCount = 0;
    const replacements = [];

    for (let i = 0; i < sourceBlocks.length; i++) {
      const src = sourceBlocks[i];
      const trg = targetBlocks[i];

      if (src.full !== trg.full) {
        replacements.push({
          index: trg.index,
          length: trg.length,
          replacement: src.full,
          blockNum: i + 1,
          info: src.info || 'plain'
        });
        revertedCount++;
      }
    }

    if (revertedCount > 0) {
      // Apply replacements from back to front to avoid index drift
      replacements.sort((a, b) => b.index - a.index);
      for (const rep of replacements) {
        targetContent =
          targetContent.slice(0, rep.index) +
          rep.replacement +
          targetContent.slice(rep.index + rep.length);
      }

      fs.writeFileSync(resolvedTarget, targetContent, 'utf8');
      console.log(`🔄 Reverted ${revertedCount} of ${sourceBlocks.length} code block(s) to exact source English 1:1.`);
      replacements.forEach(r => {
        console.log(`  - Restored block #${r.blockNum} [${r.info}]`);
      });
    } else {
      console.log(`✅ All ${sourceBlocks.length} fenced code block(s) verified matching source English 1:1 (0 reverted).`);
    }

    process.exit(0);
  } catch (err) {
    console.error(`File Error: ${err.message}`);
    process.exit(1);
  }
}

auditAndRevertCodeBlocks();
