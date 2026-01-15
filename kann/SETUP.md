# エコバトルクイズ - ローカルセットアップガイド

このドキュメントでは、ダウンロードしたプロジェクトをローカル環境で実行するための手順を説明します。

## 前提条件

以下がインストールされていることを確認してください：

- **Node.js**: v18以上（[nodejs.org](https://nodejs.org/)からダウンロード）
- **pnpm**: パッケージマネージャー（Node.jsのインストール後、以下のコマンドで導入）

```bash
npm install -g pnpm
```

## セットアップ手順

### 1. プロジェクトフォルダに移動

```bash
cd eco_quiz_game
```

### 2. 依存関係をインストール

```bash
pnpm install
```

このコマンドを実行すると、`node_modules` フォルダが **プロジェクトルート直下** に自動作成されます。

**重要**: `node_modules` フォルダは手動で作成・移動する必要はありません。`pnpm install` が自動的に適切な場所に作成します。

### 3. 開発サーバーを起動（開発時）

```bash
pnpm run dev
```

このコマンドで開発サーバーが起動し、ブラウザで `http://localhost:5173` にアクセスできます。

### 4. 本番環境で実行（デプロイ用）

```bash
pnpm run build
npm start
```

- `pnpm run build`: プロジェクトをビルドして `dist/` フォルダを生成
- `npm start`: ビルドされたアプリケーションを本番環境で起動（`http://localhost:3000`）

## ファイル構成

```
eco_quiz_game/
├── client/                    # フロントエンド（React）
│   ├── public/               # 静的ファイル（画像、クイズデータなど）
│   │   ├── images/          # バッジ、キャラクター画像
│   │   └── quizzes.json     # クイズ問題データ
│   └── src/
│       ├── pages/           # ページコンポーネント
│       ├── components/      # UIコンポーネント
│       ├── hooks/           # カスタムフック
│       ├── lib/             # ユーティリティ関数
│       ├── App.tsx          # ルーティング設定
│       └── index.css        # グローバルスタイル
├── server/                   # バックエンド（Express）
│   └── index.ts             # サーバー設定
├── package.json             # プロジェクト設定・依存関係
├── tsconfig.json            # TypeScript設定
├── vite.config.ts           # Vite設定
└── node_modules/            # 依存パッケージ（pnpm installで自動作成）
```

## トラブルシューティング

### `node_modules` フォルダが見つからない場合

```bash
pnpm install
```

を再度実行してください。

### ポート3000/5173が既に使用されている場合

別のプロセスがポートを使用しています。以下のコマンドで確認・終了できます：

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

### クイズ問題が表示されない場合

`client/public/quizzes.json` ファイルが存在することを確認してください。

## クイズ問題のカスタマイズ

`client/public/quizzes.json` をテキストエディタで編集することで、クイズ問題を追加・変更できます。

**ファイル形式例:**
```json
{
  "questions": [
    {
      "id": "q1",
      "theme": "recycling",
      "difficulty": "EASY",
      "question": "ペットボトルはどのように分別すればいい？",
      "options": [
        "燃えるごみ",
        "燃えないごみ",
        "リサイクル",
        "そのまま捨てる"
      ],
      "correctAnswer": 2,
      "feedback": {
        "correct": "正解！ペットボトルはリサイクルできます。",
        "incorrect": "不正解。ペットボトルはリサイクル対象です。"
      },
      "timeLimit": 10,
      "baseScore": 100
    }
  ]
}
```

## よくある質問

**Q: `npm start` でエラーが出る**
A: 先に `pnpm run build` を実行してください。ビルドなしに本番環境は起動できません。

**Q: 開発中に変更が反映されない**
A: 開発サーバーを再起動してください（Ctrl+C で停止後、`pnpm run dev` で再起動）。

**Q: ポート5173を変更したい**
A: `vite.config.ts` を編集してポート番号を変更できます。

## サポート

問題が発生した場合は、以下を確認してください：

1. Node.js と pnpm のバージョンが要件を満たしているか
2. `pnpm install` が正常に完了しているか
3. `node_modules` フォルダが存在するか

---

**楽しいゲーム開発を！** 🎮
