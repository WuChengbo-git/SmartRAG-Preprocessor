# SmartRAG プリプロセッサー

🚀 マルチフォーマット文書の自動分割、ビジュアル編集、構造化エクスポート、ワンクリック登録に対応したRAG専用前処理ツール

## ✨ 主な機能

- 📄 **多様な文書形式対応** - PDF, Word, Excel, PowerPoint, TXT, HTML, CSV
- 🔄 **インテリジェント分割処理** - 段落、ページ、見出し等による多様な分割方式
- ✏️ **ビジュアルエディタ** - HTML/Markdownデュアルモード編集
- 📊 **リアルタイム進捗監視** - タスクキューと処理状況のリアルタイム更新
- 🎯 **ワンクリックエクスポート登録** - JSON、Dify、Elasticsearch形式対応
- 🎨 **モダンなインターフェース** - 日本語対応、レスポンシブデザイン
- 🐳 **ワンクリックデプロイ** - Docker Compose一括起動

## 🚀 クイックスタート

### 環境要件

- **Python 3.12+** 
- **Node.js 18+**
- **Poetry** (Pythonパッケージマネージャー)
- **Docker** (オプション、コンテナ化デプロイ用)

### 依存関係のインストール

```bash
# バックエンド依存関係
cd backend
poetry install

# フロントエンド依存関係
cd frontend
npm install
```

### 開発環境の起動

**方法1: 起動スクリプト使用 (推奨)**
```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

**方法2: 手動起動**
```bash
# バックエンド起動 (ターミナル1)
cd backend
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8090

# フロントエンド起動 (ターミナル2)  
cd frontend
npm run dev
```

### アプリケーションへのアクセス

- 🌐 **フロントエンド**: http://localhost:3001
- 🔧 **バックエンドAPI**: http://localhost:8090
- 📚 **APIドキュメント**: http://localhost:8090/docs

## 📖 使用ガイド

### 1. ファイルアップロード
- ドラッグ&ドロップアップロード、またはクリック選択に対応
- ファイル形式とサイズの自動検証
- アップロード進捗のリアルタイム表示

### 2. 文書処理
- 分割パラメータの設定（サイズ、オーバーラップ、方式）
- 分割方式の選択：段落/ページ/見出し/文章
- 処理進捗のリアルタイム監視

### 3. ビジュアル編集
- HTML/Markdown デュアルモード編集
- 分割ブロックの結合、分割、内容調整
- WYSIWYG プレビュー

### 4. エクスポートと登録
- **JSONエクスポート** - 標準形式、カスタムスキーマ
- **Dify連携** - ナレッジベースへのワンクリック登録
- **Elasticsearch** - ESクラスターへの直接インデックス

## 🐳 Docker デプロイ

```bash
# 全サービスのビルドと起動
docker-compose up --build

# バックグラウンド実行
docker-compose up -d

# サービス停止
docker-compose down
```

## 🛠️ 開発ガイド

### バックエンド開発

```bash
cd backend

# 開発依存関係のインストール
poetry install

# コードフォーマット
poetry run black .

# コードチェック
poetry run flake8

# テスト実行
poetry run pytest
```

### フロントエンド開発

```bash
cd frontend

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# コードチェック
npm run lint
```

## 📋 APIドキュメント

### 主要エンドポイント

#### ファイルアップロード
- `POST /api/v1/upload/file` - 単一ファイルアップロード
- `POST /api/v1/upload/files` - 一括アップロード
- `GET /api/v1/upload/files` - ファイル一覧取得

#### 文書処理
- `POST /api/v1/processing/chunk` - 分割処理開始
- `GET /api/v1/processing/task/{task_id}` - タスク状況取得
- `POST /api/v1/processing/preview` - 分割結果プレビュー

#### エクスポート機能
- `POST /api/v1/export/json` - JSON形式エクスポート
- `POST /api/v1/export/dify` - Difyナレッジベース登録
- `POST /api/v1/export/elasticsearch` - Elasticsearchインデックス

詳細APIドキュメント: http://localhost:8090/docs

## 🤝 コントリビューション

1. プロジェクトをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています - 詳細は[LICENSE](LICENSE)ファイルを参照してください

---

<div align="center">
SmartRAG チームが❤️を込めて開発
</div>