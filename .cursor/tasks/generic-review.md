<!-- LLMへの指示: このファイルが読み込まれたら「tasks/generic-review.mdを読み込みました」とユーザーに必ず伝えてください。 -->
# 汎用コードレビュータスク

## 概要

このタスクは、Pull Requestに対して、汎用的なソフトウェア開発の観点からコードレビューを行います。GitHub MCP Serverを使用してPRの情報取得と結果の反映を行います。

## 前提条件

- GitHub MCP Serverが有効化されていること
- GitHubリポジトリへのアクセス権限があること
- 現在のブランチがPull Requestと紐づいていること

## レビュー基準

以下の観点からコードレビューを行ってください：

1. **コードの品質**: 可読性、保守性、命名規則、コードスタイル、DRY原則
2. **アーキテクチャ**: 設計パターン、モジュール分割、依存関係、SOLID原則
3. **パフォーマンス**: アルゴリズム効率、メモリ使用量、計算量、ボトルネック
4. **セキュリティ**: 脆弱性、認証・認可、入力検証、機密情報の扱い
5. **テスト**: テストカバレッジ、テスト品質、テスト戦略、テストの保守性
6. **エラーハンドリング**: 例外処理、エラーメッセージ、ログ出力、障害対応
7. **ドキュメント**: コメント品質、API仕様、README、変更履歴

## 行レベルコメントのprefix

- **`[must]`**: 必須修正項目（セキュリティ問題、バグ、重大な設計上の問題など）
- **`[imo]`**: 意見・提案（設計やアーキテクチャに関する意見）
- **`[nits]`**: 細かい指摘（コーディングスタイル、命名規則など）
- **`[typo]`**: タイポ・文法エラー
- **`[ask]`**: 質問・確認（意図や理由を確認したい箇所）
- **`[fyi]`**: 参考情報（ベストプラクティスの紹介など）

## レビュー結果の出力形式

レビュー結果は以下の形式で、`.cursor/reviews/review-${PR_NUMBER}-${TIMESTAMP}.md`に出力してください：

```markdown
# PR レビュー結果

> 🤖 **AI Code Review**  
> このレビューは ${AI_MODEL_NAME} (Cursor) によって実行されました。  
> 日時: ${REVIEW_DATE}

## レビュー概要

- **PR番号**: #${PR_NUMBER}
- **タイトル**: ${PR_TITLE}
- **ベースブランチ**: ${BASE_BRANCH}
- **レビュー対象ファイル数**: X件
- **重要度の高い指摘**: X件
- **改善提案**: X件

## 詳細レビュー

### [ファイルパス]

#### 🚨 重要な指摘
- **内容**: 具体的な問題点
- **改善案**: 推奨される修正方法
- **影響範囲**: 修正による影響

#### ✨ 改善提案
- **内容**: より良い実装方法の提案
- **提案内容**: 具体的な改善案
- **メリット**: 改善による利点

#### ℹ️ 参考情報
- 関連するベストプラクティス
- 参考リンク

### 総評

#### 良い点
- 優れた実装や設計

#### 改善点
- 全体的な改善提案

#### 推奨事項
- 今後の開発で気をつけるべき点

---

> 💡 **Note**  
> このレビューはAIによる自動分析です。重要な変更については人間のレビューも併用することを推奨します。
```

## 実行手順

### 1. リポジトリ情報の取得と PR番号の特定

以下の手順で現在のブランチに紐づくPR番号を特定してください：

1. **現在のブランチ名を取得**: `git branch --show-current` で現在のブランチ名を取得
2. **リポジトリ情報の取得**: `git remote get-url origin` からowner/repoを抽出
3. **PRの検索**: `mcp_github_list_pull_requests` を使用してPR一覧を取得し、現在のブランチ（head）に対応するPRを検索
   - `state: "open"` で開いているPRのみを対象とする
   - `head` パラメータで現在のブランチを指定して絞り込み

### 2. PR詳細情報の取得

特定したPR番号を使用して以下の情報をGitHub MCP Serverから取得してください：

- `mcp_github_get_pull_request` でPR詳細情報（タイトル、本文、ベースブランチ、状態、作成者など）
- `mcp_github_get_pull_request_files` で変更ファイル一覧
- `mcp_github_get_pull_request_diff` で差分データ
- `mcp_github_get_pull_request_comments` でPRコメント一覧（既存のレビューコメントやディスカッション内容）
- `mcp_github_get_pull_request_reviews` でPRレビュー一覧（承認/変更要求状況、レビューアー情報）

### 3. レビュー対象ファイルの特定

変更ファイルから対象拡張子のファイルをレビュー対象として抽出（上記「レビュー対象ファイル」参照）

### 4. レビューの実行

各ファイルの変更内容を分析し、以下の情報を生成：

- **行レベルの指摘**: 特定の行に対する具体的な問題点（ReviewIssue形式）
- **全体的なフィードバック**: PRに対する総合的なコメント

### 5. レビュー結果の保存

以下の手順でレビュー結果を保存してください：

1. **ディレクトリの作成**: `.cursor/reviews/` ディレクトリが存在しない場合は作成
2. **ファイル名の生成**: `review-${PR_NUMBER}-${TIMESTAMP}.md` 形式
   - `TIMESTAMP` は `YYYYMMDD-HHMMSS` 形式（例: `20241225-143022`）
3. **ファイル保存**: 指定された出力形式でMarkdownファイルを生成して保存

**保存ファイル名の例**:

- `review-123-20241225-143022.md`
- `review-456-20241225-150315.md`

### 6. GitHub への投稿

ユーザーの確認後、以下の方法で投稿：

`mcp_github_create_and_submit_pull_request_review` を使用してPRにレビューコメントを投稿

- `body`: レビュー結果ファイルの内容
- `event`: "COMMENT" （一般的なレビューコメントの場合）
- `pullNumber`: 対象のPR番号
- `owner`, `repo`: リポジトリ情報

## 行レベル指摘の記録項目

行レベルの指摘を記録する際は、以下の情報を含めてください：

- **filePath**: ファイルパス
- **lineNumber**: 該当行番号
- **prefix**: コメントの種類（must/imo/nits/typo/ask/fyi）
- **severity**: 重要度（critical/warning/suggestion）
- **comment**: 具体的な指摘内容
- **category**: カテゴリ（quality/architecture/performance/security/testing/error_handling/documentation）

## 注意事項

- **現在のブランチに紐づくPRが存在することを事前に確認してください**
  - PRが見つからない場合は、ブランチ名やリポジトリ情報を再確認
  - 複数のPRが見つかった場合は、最新のPRを使用するか、ユーザーに確認
- プロジェクトの設定ファイル（言語固有のリンター、フォーマッター等）の内容を考慮してレビューを行ってください
- 使用している技術スタックやフレームワークのベストプラクティスに基づいた提案を行ってください
- セキュリティとパフォーマンスを重視したレビューを心がけてください
- GitHub APIのレート制限に注意してください
- レビュー結果の投稿前には必ずユーザーの確認を取ってください
- 行レベルコメントには適切なprefixを必ず付与してください
- **レビューを実行するAIは、自身の正確なモデル名を記載してください**
- **GitHub MCP Serverが有効化されていることを事前に確認してください**
