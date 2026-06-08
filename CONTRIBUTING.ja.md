# crop コントリビューションガイド

言語: [English](CONTRIBUTING.md) | [한국어](CONTRIBUTING.ko.md) | [简体中文](CONTRIBUTING.zh-CN.md) | 日本語

この文書は日本語訳です。言語間で意味が異なる場合は English 版を正とします。

`crop` に関心を持っていただきありがとうございます。この文書では、この公開リポジトリで Issue や Pull Request を作成するときの基本的な期待事項を説明します。

このリポジトリの maintainer 作業は内部の Hyper-Waterfall ワークフローで管理されます。外部コントリビューターが内部タスク文書やステージレポートを書く必要はありません。maintainer は Issue や PR を確認したうえで、必要に応じて GitHub Issue、タスクブランチ、計画文書に変換することがあります。

## コントリビュート前の確認

- 既存の GitHub Issues と Pull Requests を先に検索してください。
- 新機能、バグ修正、ドキュメント変更はできるだけ小さい範囲に分けてください。
- ユーザー向けの製品名とブランドは `crop` のみを使用してください。
- Mozilla、Firefox、Screenshots の名称は、出典表示、ライセンス通知、技術参照の文脈でのみ使用してください。提携、推奨、スポンサー、公式製品であるかのような表現は避けてください。
- Chrome MV3 の権限は狭く保ってください。maintainer と事前に相談せずに `debugger`、`<all_urls>`、広範な host permissions、`tabs` 権限を追加しないでください。
- Firefox 由来コードや MPL 2.0 対象ファイルを変更する場合は、`src/firefox-derived/`、`NOTICE`、`THIRD_PARTY.md`、`LICENSE-MPL-2.0` の境界と通知を維持してください。

## Issue を作成する

新しい作業は、可能な限りまず Issue で相談してください。

有用な Issue には次の内容を含めます。

- 問題または提案の背景
- 期待する結果
- 含める範囲と除外する範囲
- 再現手順または検証方法
- 関連ページ、ブラウザバージョン、OS、スクリーンショットなどの文脈

機密性の高いセキュリティ詳細や個人情報を公開 Issue に詳しく書かないでください。公開できる最小限の説明だけを残し、maintainer と非公開のフォローアップ方法を調整してください。

## Pull Request を作成する

Pull Request は小さく、レビューしやすい単位にしてください。

基本的な期待事項:

- PR template を記入してください。
- なぜ変更が必要なのか、何を変更したのかを説明してください。
- ユーザーに見える挙動、権限、privacy、ブランド、ライセンスへの影響を明示してください。
- 関連 Issue があればリンクしてください。
- 実行した検証コマンドと結果を記録してください。
- 無関係な formatting、大規模リファクタリング、機能変更を 1 つの PR に混ぜないでください。

推奨検証:

```bash
npm run build
npm run typecheck
npm test
git diff --check
```

ドキュメントのみの PR では、source build/test が不要な場合があります。その場合は、実行しなかった理由を PR に書いてください。

## コードとドキュメントの基準

- 現在の実装がサポートしていない挙動を文書で約束しないでください。
- スクリーンショットはブラウザ内でローカル処理されるという privacy stance を維持してください。
- サーバーアップロード、telemetry、アカウント同期など、未実装の挙動を示唆しないでください。
- overlay、highlight、button が最終 PNG に含まれない状態を維持してください。
- Chrome の制限ページ、cross-origin iframe、closed shadow DOM、canvas サイズ制限などの制約を明確にしてください。

## Maintainer workflow と外部コントリビューション

Maintainer 作業は GitHub Issue を起点に追跡され、必要に応じて次の流れを取ります。

```text
Issue -> branch -> daily order -> plan -> implementation plan -> stage report -> final report -> pull request
```

これは maintainer と coding agent が変更を追跡するための内部運用手順です。外部コントリビューターは通常の Issue と Pull Request を使って提案できます。必要な場合、maintainer がその提案を tracked task に変換し、内部 workflow を処理します。

## Review と merge

- すべての PR には maintainer review が必要です。
- CI と必要な手動検証が通ってから merge できます。
- 範囲が広がったり方針判断が必要になったりした場合、maintainer は作業を Issue に戻して再計画することがあります。
- Issue は maintainer の承認後、または関連 PR の merge 後に close されます。

## 質問と議論

質問、利用報告、機能アイデアには GitHub Issues または Discussions を使ってください。Bug や具体的なタスク依頼には Issues が適しており、より広い提案、利用経験の共有、自由な会話には Discussions が適しています。
