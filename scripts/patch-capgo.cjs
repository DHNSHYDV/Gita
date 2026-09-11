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

// Patch Java 21 -> Java 17 in newly added Capacitor plugins
const pluginsToPatch = [
  path.join(__dirname, '../node_modules/@capacitor/share/android/build.gradle'),
  path.join(__dirname, '../node_modules/@capacitor/filesystem/android/build.gradle')
];

for (const pluginFile of pluginsToPatch) {
  if (fs.existsSync(pluginFile)) {
    let content = fs.readFileSync(pluginFile, 'utf8');
    let patched = false;
    if (content.includes('JavaVersion.VERSION_21')) {
      content = content.replace(/JavaVersion\.VERSION_21/g, 'JavaVersion.VERSION_17');
      patched = true;
    }
    if (content.includes('jvmToolchain(21)')) {
      content = content.replace('jvmToolchain(21)', 'jvmToolchain(17)');
      patched = true;
    }
    if (patched) {
      fs.writeFileSync(pluginFile, content, 'utf8');
      console.log(`✅ Patched Java 17 in ${path.basename(path.dirname(pluginFile))}`);
    }
  }
}
