#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const targetFile = path.join(
  __dirname,
  '../node_modules/@capgo/capacitor-updater/android/src/main/java/ee/forgr/capacitor_updater/DelayUpdateUtils.java'
);

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  let changed = false;

  const replacements = [
    ['case DelayUntilNext.background:', 'case background:'],
    ['case DelayUntilNext.kill:', 'case kill:'],
    ['case DelayUntilNext.date:', 'case date:'],
    ['case DelayUntilNext.nativeVersion:', 'case nativeVersion:']
  ];

  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.replace(from, to);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('✅ Successfully patched Capgo DelayUpdateUtils.java enum switch syntax.');
  } else {
    console.log('ℹ️ Capgo DelayUpdateUtils.java already patched.');
  }
}
