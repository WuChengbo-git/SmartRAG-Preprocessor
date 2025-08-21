#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function updateVersion(newVersion) {
  const rootDir = path.join(__dirname, '..');
  
  // 1. 更新根目录 package.json
  const rootPackagePath = path.join(rootDir, 'package.json');
  if (fs.existsSync(rootPackagePath)) {
    const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
    rootPackage.version = newVersion;
    fs.writeFileSync(rootPackagePath, JSON.stringify(rootPackage, null, 2) + '\n');
    console.log(`✅ Updated root package.json to ${newVersion}`);
  }

  // 2. 更新前端 package.json
  const frontendPackagePath = path.join(rootDir, 'frontend', 'package.json');
  if (fs.existsSync(frontendPackagePath)) {
    const frontendPackage = JSON.parse(fs.readFileSync(frontendPackagePath, 'utf8'));
    frontendPackage.version = newVersion;
    fs.writeFileSync(frontendPackagePath, JSON.stringify(frontendPackage, null, 2) + '\n');
    console.log(`✅ Updated frontend/package.json to ${newVersion}`);
  }

  // 3. 更新后端 pyproject.toml
  const pyprojectPath = path.join(rootDir, 'backend', 'pyproject.toml');
  if (fs.existsSync(pyprojectPath)) {
    let content = fs.readFileSync(pyprojectPath, 'utf8');
    content = content.replace(/version = "[^"]*"/, `version = "${newVersion}"`);
    fs.writeFileSync(pyprojectPath, content);
    console.log(`✅ Updated backend/pyproject.toml to ${newVersion}`);
  }

  // 4. 更新 VERSION 文件
  const versionPath = path.join(rootDir, 'VERSION');
  fs.writeFileSync(versionPath, newVersion);
  console.log(`✅ Updated VERSION file to ${newVersion}`);

  // 5. 更新 README.md 中的版本徽章
  const readmePath = path.join(rootDir, 'README.md');
  if (fs.existsSync(readmePath)) {
    let content = fs.readFileSync(readmePath, 'utf8');
    content = content.replace(
      /\[!\[Version\]\(https:\/\/img\.shields\.io\/badge\/version-[^-]*-blue\.svg\)\]/,
      `[![Version](https://img.shields.io/badge/version-${newVersion}-blue.svg)]`
    );
    fs.writeFileSync(readmePath, content);
    console.log(`✅ Updated README.md version badge to ${newVersion}`);
  }

  console.log(`\n🎉 Successfully updated all version references to ${newVersion}!`);
  console.log('\n📋 Next steps:');
  console.log('1. Commit the changes: git add . && git commit -m "bump version to v' + newVersion + '"');
  console.log('2. Create and push tag: git tag -a v' + newVersion + ' -m "Release v' + newVersion + '" && git push origin v' + newVersion);
}

// 获取命令行参数
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('❌ Error: Please provide a version number');
  console.log('Usage: node scripts/update-version.js <version>');
  console.log('Example: node scripts/update-version.js 1.0.2');
  process.exit(1);
}

// 验证版本格式 (semantic versioning)
const semverRegex = /^\d+\.\d+\.\d+$/;
if (!semverRegex.test(newVersion)) {
  console.error('❌ Error: Invalid version format. Please use semantic versioning (e.g., 1.0.2)');
  process.exit(1);
}

updateVersion(newVersion);