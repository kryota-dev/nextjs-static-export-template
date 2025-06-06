<!-- LLMへの指示: このファイルが読み込まれたら「tasks/create-issue.mdを読み込みました」とユーザーに必ず伝えてください。 -->
# AI Issue作成タスク

## 概要

このタスクは、`.github/ISSUE_TEMPLATE`配下のテンプレートをベースとして、GitHub issueを自動作成します。GitHub MCP Serverを使用してissueの投稿を行い、関連するファイルの分析結果を組み込んだ詳細なissue内容を生成します。

## 前提条件

- GitHub MCP Serverが有効化されていること
- GitHubリポジトリへのアクセス権限があること
- `.github/ISSUE_TEMPLATE`にテンプレートファイルが存在すること

## 利用可能なIssueテンプレート

以下のテンプレートから選択できます：

1. **backend.md** - バックエンドに関するタスク
   - ラベル: `:gear: Backend`, `:rabbit: Priority: Medium`, `:timer_clock: Story Points: 1`
2. **design.md** - デザインに関するタスク
   - ラベル: `:lipstick: Design`, `:rabbit: Priority: Medium`, `:timer_clock: Story Points: 1`
3. **frontend.md** - フロントエンドに関するタスク
   - ラベル: `:art: Frontend`, `:rabbit: Priority: Medium`, `:timer_clock: Story Points: 1`
4. **generic.md** - その他のタスク
   - ラベル: `:rabbit: Priority: Medium`, `:timer_clock: Story Points: 1`
5. **infrastructure.md** - インフラに関するタスク
   - ラベル: `:hammer: Infrastructure`, `:rabbit: Priority: Medium`, `:timer_clock: Story Points: 1`

## 実行手順

### 1. リポジトリ情報の取得

以下の手順でリポジトリ情報を取得してください：

1. **リモートリポジトリ情報の取得**: `git remote get-url origin` からowner/repoを抽出
2. **認証ユーザーの取得**: `mcp_github_get_me` でユーザー名を取得

### 2. テンプレートの選択

ユーザーに対して以下の選択肢を提示してください：

```markdown
どのタイプのissueを作成しますか？

1. バックエンドに関するタスク (backend)
2. デザインに関するタスク (design)  
3. フロントエンドに関するタスク (frontend)
4. その他のタスク (generic)
5. インフラに関するタスク (infrastructure)

番号またはキーワードを入力してください：
```

### 3. 基本情報の取得

選択されたテンプレートに基づいて、以下の情報をユーザーから取得してください：

1. **issueタイトル**: 具体的で説明的なタイトル
2. **As-Is**: 現状の問題点や課題
3. **To-Be**: 理想的な状態
4. **達成すべきこと**: 具体的なタスク（複数可）
5. **備考**: 追加情報やメモ
6. **優先度** (任意): Priority: Low/Medium/High の選択
7. **ストーリーポイント** (任意): 1, 2, 3, 5, 8 から選択

### 4. 関連ファイルの分析 (任意)

ユーザーに関連ファイルのパスを尋ね、指定されたファイルがある場合は分析を行ってください：

```markdown
このissueに関連するファイルがあれば、パスを指定してください（複数可、スペース区切り）:
例: src/components/Button.tsx src/pages/index.tsx
```

関連ファイルが指定された場合：

- ファイルの内容を読み込んで分析
- コードの構造、依存関係、潜在的な問題点を特定
- 具体的な改善提案を生成

### 5. 重複チェック

`mcp_github_search_issues` または `mcp_github_list_issues` を使用して類似のissueが既に存在しないかチェックしてください：

- 入力されたタイトルに含まれるキーワードで検索
- `state: "open"` で開いているissueのみを検索対象とする
- 類似のissueが見つかった場合は、ユーザーに確認を取る

### 6. Issue内容の自動生成

以下の要素を含むissue内容を自動生成してください：

#### 基本構造（テンプレートベース）

```markdown
## As-Is
{ユーザー入力 + ファイル分析結果}

## To-Be  
{ユーザー入力 + 具体的な改善案}

## 達成すべきこと
{ユーザー入力をチェックリスト形式で整理}

## 関連ファイル
{指定されたファイルの一覧と概要}

## 技術的考慮事項
{ファイル分析に基づく技術的な注意点}

## 備考
{ユーザー入力 + 分析結果のサマリー}
```

#### 自動生成される追加セクション

- **影響範囲**: 変更による影響範囲の推定
- **依存関係**: 他のissueやPRとの関連性
- **テスト項目**: 実装後に確認すべき項目
- **参考リンク**: 関連するドキュメントやベストプラクティス

### 7. 下書きファイルの保存

以下の手順で下書きファイルを保存してください：

1. **ディレクトリ構造の作成**:

   ```
   .cursor/issues/drafts/{template_type}/
   ```

2. **ファイル名の生成**:

   ```
   {timestamp}.md
   ```

   - `timestamp`: `YYYYMMDD-HHMMSS`形式（例: `20241225-143022`）

3. **完全なパス例**:

   ```
   .cursor/issues/drafts/frontend/20241225-143022.md
   .cursor/issues/drafts/backend/20241225-150315.md
   ```

### 8. ユーザー確認プロセス

下書きファイルを作成後、以下の確認を行ってください：

1. **下書き内容の表示**: 生成したissue下書きの内容をユーザーに提示
2. **確認の取得**: 「このissueを作成しますか？」とユーザーに確認
3. **選択肢の提示**:
   - 「はい」: issue作成を実行
   - 「いいえ」: 下書きのみ保存して終了
   - 「修正」: 内容の修正が必要な場合の対応

### 9. Issue作成の実行

ユーザーが「はい」と回答した場合のみ、以下を実行してください：

1. **Issue作成の実行**:

   `mcp_github_create_issue` を使用してissueを作成：
   - `title`: 自動生成されたissueタイトル
   - `body`: 下書きファイルの内容
   - `labels`: テンプレートに応じたラベル配列
   - `assignees`: 現在のユーザーを自動でアサイン
   - `owner`, `repo`: リポジトリ情報

2. **Issue番号の取得**:
   作成されたissueのレスポンスからissue番号を抽出

3. **下書きファイルのリネーム**:
   - Before: `.cursor/issues/drafts/{template_type}/{timestamp}.md`
   - After: `.cursor/issues/{issue_number}.md`

4. **テンプレートディレクトリの削除**:
   下書きファイルのリネーム完了後、**空になった**テンプレートディレクトリのみを削除
   - 削除条件: `.cursor/issues/drafts/{template_type}/` が空の場合のみ
   - 保護条件: 他の下書きファイルが残っている場合は削除しない

## ラベル自動設定ルール

テンプレートタイプに応じて以下のラベルを自動設定：

- **backend**: `[":gear: Backend", ":rabbit: Priority: Medium", ":timer_clock: Story Points: 1"]`
- **design**: `[":lipstick: Design", ":rabbit: Priority: Medium", ":timer_clock: Story Points: 1"]`
- **frontend**: `[":art: Frontend", ":rabbit: Priority: Medium", ":timer_clock: Story Points: 1"]`
- **generic**: `[":rabbit: Priority: Medium", ":timer_clock: Story Points: 1"]`
- **infrastructure**: `[":hammer: Infrastructure", ":rabbit: Priority: Medium", ":timer_clock: Story Points: 1"]`

ユーザーが優先度やストーリーポイントを指定した場合は、デフォルト値を上書き：

- **優先度**: `:rabbit: Priority: Low/Medium/High`
- **ストーリーポイント**: `:timer_clock: Story Points: 1/2/3/5/8`

## ファイル分析ルール

関連ファイルが指定された場合の分析項目：

### フロントエンドファイル (.tsx, .ts, .jsx, .js)

- **コンポーネント構造**: props, state, ライフサイクル
- **依存関係**: import/export関係
- **スタイリング**: CSS-in-JS, Tailwind, CSS Modules
- **パフォーマンス**: メモ化、レンダリング最適化
- **アクセシビリティ**: WAI-ARIA、セマンティック要素

### バックエンドファイル (.py, .js, .ts, .go, .java)

- **API設計**: エンドポイント、レスポンス形式
- **データ処理**: バリデーション、変換ロジック
- **セキュリティ**: 認証、認可、入力検証
- **パフォーマンス**: データベースクエリ、キャッシュ
- **エラーハンドリング**: 例外処理、ログ出力

### 設定ファイル (.json, .yml, .yaml, .toml)

- **設定項目**: 環境変数、デプロイ設定
- **セキュリティ**: 機密情報の扱い
- **依存関係**: パッケージバージョン
- **互換性**: 環境間の整合性

### ドキュメント (.md, .txt)

- **内容の充実度**: 情報の完全性
- **構造**: 見出し、目次、リンク
- **最新性**: 更新の必要性
- **読みやすさ**: 文章の明確さ

## エラーハンドリング

以下のエラーケースに対応してください：

- **GitHub MCP Server未有効化の場合**: GitHub MCP Serverの有効化を案内
- **テンプレートファイルが存在しない場合**: エラーメッセージと対処法を表示
- **関連ファイルが存在しない場合**: ファイルパスの再確認を案内
- **権限エラー**: 必要な権限の説明
- **GitHub MCP Server実行エラー**: APIの実行結果を確認し、適切なエラーメッセージを表示
- **無効な入力**: 選択肢の再提示
- **重複issue検出**: 既存issueの情報を表示し、続行するか確認

## 自動生成ルール

### タイトル生成ルール

ユーザー入力とファイル分析結果に基づいて以下の形式で生成：

1. **機能追加**: `feat: {機能名}の追加`
2. **バグ修正**: `fix: {対象}の修正`
3. **改善**: `improve: {対象}の改善`
4. **リファクタリング**: `refactor: {対象}のリファクタリング`
5. **ドキュメント**: `docs: {対象}ドキュメントの更新`
6. **インフラ**: `infra: {対象}の構築・改善`

### 達成すべきことの自動展開

ユーザー入力を分析して、具体的なタスクに分解：

- **設計タスク**: `[ ] 要件定義`, `[ ] 設計書作成`
- **実装タスク**: `[ ] 実装`, `[ ] テスト作成`
- **検証タスク**: `[ ] 動作確認`, `[ ] レビュー`
- **デプロイタスク**: `[ ] デプロイ`, `[ ] 動作監視`

### 技術的考慮事項の自動生成

関連ファイルの分析結果に基づいて：

- **パフォーマンス**: 処理速度、メモリ使用量の注意点
- **セキュリティ**: 脆弱性、認証・認可の考慮事項
- **互換性**: 既存機能との整合性、APIバージョン
- **テスト**: 単体テスト、統合テスト、E2Eテストの方針

## 注意事項

- **GitHub MCP Server有効化**: タスク実行前にGitHub MCP Serverが有効化されていることを確認
- **テンプレートファイルの確認**: `.github/ISSUE_TEMPLATE/`配下のファイル存在確認
- **ファイルパスの安全性**: 指定されたファイルパスの妥当性確認
- **権限確認**: issue作成権限がない場合の適切なエラーメッセージ
- **下書き保存**: issue作成に失敗しても下書きは保存された状態を維持
- **タイムスタンプの一意性**: 同じ時刻に複数実行された場合の対応
- **ラベル形式**: GitHubのラベル命名規則に準拠した形式で設定
- **重複防止**: 類似issueの存在確認を必ず実行
- **GitHub APIのレート制限**: 連続実行時の制限に注意

## 出力形式

### 成功時

```markdown
✅ **Issue作成完了**

- **Issue番号**: #123
- **タイトル**: feat: ユーザー認証機能の追加
- **URL**: https://github.com/owner/repo/issues/123
- **テンプレート**: frontend
- **ラベル**: :art: Frontend, :rabbit: Priority: High, :timer_clock: Story Points: 3
- **下書きファイル**: `.cursor/issues/123.md`
- **Assignee**: @username

Issueが正常に作成されました。作業を開始してください。
```

### 下書きのみ保存時

```markdown
📝 **Issue下書き保存完了**

- **下書きファイル**: `.cursor/issues/drafts/frontend/20241225-143022.md`
- **テンプレート**: frontend
- **タイトル**: feat: ユーザー認証機能の追加

下書きが保存されました。後でissueを作成する場合は、再度このタスクを実行してください。
```

### エラー時

```markdown
❌ **Issue作成エラー**

- **エラー内容**: [具体的なエラーメッセージ]
- **対処方法**: [推奨される対処法]
- **下書き状況**: [下書きファイルの保存状況]

エラーが発生しました。上記の対処方法を確認してください。
```
