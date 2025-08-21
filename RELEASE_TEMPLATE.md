# Release Template for SmartRAG-Preprocessor

Use this template when creating new releases.

## Release Checklist

### Pre-Release
- [ ] Update version numbers in all package files
- [ ] Update CHANGELOG.md with new features and fixes
- [ ] Run all tests (frontend and backend)
- [ ] Test Docker build and deployment
- [ ] Update documentation if needed
- [ ] Review and merge all pending PRs

### Version Updates (统一版本管理)
使用自动化脚本更新所有版本文件：

```bash
# 补丁版本 (1.0.1 → 1.0.2)
npm run version:patch

# 小版本 (1.0.1 → 1.1.0)  
npm run version:minor

# 大版本 (1.0.1 → 2.0.0)
npm run version:major

# 手动指定版本
npm run version:update 1.2.3
```

自动更新的文件：
- [ ] `package.json` (根目录)
- [ ] `frontend/package.json` 
- [ ] `backend/pyproject.toml`
- [ ] `VERSION` 文件
- [ ] `README.md` 版本徽章

### Release Process
1. Create and push version tag:
   ```bash
   git tag -a v1.0.1 -m "Release version 1.0.1"
   git push origin v1.0.1
   ```

2. GitHub Actions will automatically:
   - Create GitHub release
   - Build Docker images
   - Run tests
   - Generate release notes

### Manual Release (if needed)

#### Create Release Notes Template:
```markdown
## 🚀 What's New in v1.0.1

### ✨ New Features
- 📁 2層フォルダ管理システム - プロジェクト構造での整理
- ⚙️ 親子チャンク設定 - より精度の高い検索システム
- 📝 全文対照エディタ - リアルタイム編集機能

### 🔧 Improvements
- チャンク分割設定の統合
- 処理モニタリングの強化
- メタデータ管理機能の追加

### 🐛 Bug Fixes
- 親チャンク設定の依存関係修正
- フォーム状態管理の改善
- TypeScript型安全性の向上

### 📦 Installation

#### Docker (推奨)
```bash
git clone https://github.com/your-username/SmartRAG-Preprocessor.git
cd SmartRAG-Preprocessor
./start.sh  # Linux/Mac
# または
start.bat   # Windows
```

#### Manual Installation
```bash
git clone https://github.com/your-username/SmartRAG-Preprocessor.git
cd SmartRAG-Preprocessor
npm run install:all
npm run start
```

### 🎯 Browser Requirements
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 📄 Supported Formats
PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), HTML, CSV, TXT

### 🔗 Links
- [Documentation](README.md)
- [Changelog](CHANGELOG.md)
- [Issues](https://github.com/your-username/SmartRAG-Preprocessor/issues)
```

## Post-Release
- [ ] Announce release in relevant channels
- [ ] Update project documentation
- [ ] Monitor for issues and feedback
- [ ] Plan next release features

## Versioning Guidelines

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (x.0.0): Breaking changes
- **MINOR** (0.x.0): New features, backwards compatible
- **PATCH** (0.0.x): Bug fixes, backwards compatible

### Examples:
- `1.0.0` → `1.0.1`: Bug fixes only
- `1.0.0` → `1.1.0`: New features added
- `1.0.0` → `2.0.0`: Breaking changes