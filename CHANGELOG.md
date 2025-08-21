# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2] - 2025-08-21

### Changed
- 版本管理系统重构 - 统一版本管理，一键同步所有文件
- 项目版本重置为开发版本 0.0.2

### Added
- 自动版本同步脚本 - `scripts/update-version.js`
- 版本管理npm命令 - `version:patch`, `version:minor`, `version:major`, `version:update`
- 前端动态版本显示 - UI界面自动读取package.json版本
- VERSION文件 - 统一版本源

### Technical
- 前后端包名规范化 - 添加项目前缀
- 版本管理流程文档化 - README.md中添加详细说明

## [0.0.1] - 2025-08-21

### Added
- 2層フォルダ管理機能 - プロジェクト/サブフォルダ構造による整理
- アップロード時のチャンク設定統合 - ファイル管理ページで一括設定
- 全文対照エディタ機能 - 全文表示とチャンク編集の同時表示
- 親子チャンク設定 - 2階層チャンク構造でより精度の高い検索
- メタデータ管理機能 - 文書レベルとチャンクレベルの詳細設定
- 処理モニタリング統計 - 完了/処理中/待機中/失敗の件数表示

### Enhanced
- ファイルアップロードUI - フォルダツリー表示と直感的な操作
- チャンク分割設定 - 段落/ページ/見出し/文章/トークン単位での分割
- 親チャンク分割方法 - ドキュメント全体/セクション/ページ群/固定サイズ
- エディタ機能 - リアルタイムプレビューとハイライト表示
- 処理キュー - リアルタイム進行状況とバッチ操作

### Fixed
- 親チャンク設定の依存関係 - スイッチ切り替え時の正常動作
- フォーム状態管理 - 設定値の正確な保存と復元
- TypeScript型安全性 - インターフェース定義の完全性

### Technical
- React TypeScript フロントエンド最適化
- Ant Design コンポーネント統合
- 状態管理とフォーム処理の改善
- 日本語UI完全対応

## [1.0.0] - 2025-07-15

### Initial Release
- 基本的なファイルアップロード機能
- PDF、Word、Excel、PowerPoint、HTML、CSV、TXT対応
- 基本的なチャンク分割機能
- ドキュメント処理キュー
- JSON形式でのエクスポート
- Docker環境でのワンクリック起動
- FastAPI + React構成
- 基本的なビジュアルエディタ