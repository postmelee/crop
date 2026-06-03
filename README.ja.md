# crop

言語: [English](README.md) | [한국어](README.ko.md) | [简体中文](README.zh-CN.md) | 日本語

`crop` は、正確なページスクリーンショットを撮るための Chrome Manifest V3 拡張機能です。オーバーレイを開き、ページ要素を選択するか任意の範囲をドラッグして、生成された PNG をコピーまたは保存できます。

リリース状況: `crop` は Chrome Web Store 公開準備中で、まだ Chrome Web Store には掲載されていません。現時点ではローカルで拡張機能をビルドし、生成された `dist/` フォルダーを未パッケージの拡張機能として読み込みます。

## crop でできること

- 拡張機能のアイコンまたは `Ctrl+Shift+S` ショートカットで開きます。macOS では `Command+Shift+S` を使います。
- 現在のタブにページオーバーレイを表示します。
- ポインターを動かすと DOM 要素をハイライトします。
- 要素をクリックしたり、任意の範囲をドラッグしたり、キャプチャ前に選択範囲をリサイズまたは移動できます。
- 選択した PNG をシステムクリップボードへコピーするか、PNG ファイルとしてダウンロードします。
- 現在表示されているビューポートを直接キャプチャします。
- 表示中のビューポートキャプチャをスクロールしながら stitching して、現在の最上位ドキュメントをページ全体の PNG としてキャプチャします。
- Chrome がコンテンツスクリプトに iframe ドキュメントの検査を許可する場合、同一オリジン(same-origin)および `srcdoc` iframe 要素の選択に対応します。
- 現在のビューポートの外まで広がる選択範囲は、スクロールと stitching によりページ上の選択範囲全体をキャプチャします。

## ソースから読み込む

必要なもの:

- Node.js 20 以上
- npm
- 未パッケージの拡張機能を読み込める Google Chrome またはその他の Chromium ブラウザー

拡張機能をビルド:

```bash
npm install
npm run build
```

Chrome に読み込む:

1. `chrome://extensions` を開きます。
2. Developer mode を有効にします。
3. Load unpacked をクリックします。
4. このリポジトリの `dist/` フォルダーを選択します。
5. 通常のウェブページを開き、`crop` 拡張機能アイコンをクリックします。

推奨ショートカットが既存のブラウザーまたは OS のショートカットと競合する場合、Chrome はそのショートカットを未割り当てのままにすることがあります。拡張機能のショートカットは `chrome://extensions/shortcuts` で確認できます。

## 基本的な使い方

1. 通常のウェブページを開きます。
2. `crop` 拡張機能アイコンをクリックするか、`Ctrl+Shift+S` を押します。macOS では `Command+Shift+S` を使います。
3. キャプチャ方法を選びます。
   - 要素の上に移動してクリックし、その要素を選択します。
   - ドラッグして任意の範囲を描画します。
   - 「表示範囲を選択」ボタンで現在のビューポートをキャプチャします。
   - 「ページ全体を選択」ボタンで現在の最上位ドキュメントをキャプチャします。
4. 必要に応じて選択範囲を調整します。
5. Copy をクリックして PNG をクリップボードへ書き込むか、Save をクリックして PNG をダウンロードします。
6. キャプチャせずに閉じるには Escape を押すか Cancel を使います。

## 権限

`crop` は次の Chrome 拡張権限(permissions)を使います。

| 権限 | 必要な理由 |
|---|---|
| `activeTab` | 拡張機能を呼び出したあと、現在のタブへの一時的なアクセスを許可します。 |
| `scripting` | アクティブなタブにオーバーレイのコンテンツスクリプトを注入します。 |
| `clipboardWrite` | Copy が生成した PNG をクリップボードに書き込めるようにします。 |
| `downloads` | Save が生成した PNG ファイルをダウンロードできるようにします。 |

この拡張機能は `debugger`、`<all_urls>`、広範な host permissions、`host_permissions` を要求しません。

## プライバシー

スクリーンショットはブラウザー内でローカル処理(local processing)されます。`crop` はスクリーンショットをアップロードせず、ページデータをサーバーへ送信せず、telemetry も含みません。

画像がページの外へ出るのは、ユーザーが明示的に Copy または Save を使ったときだけです。

- Copy は PNG をシステムクリップボードに書き込みます。
- Save は Chrome に PNG ファイルのダウンロードを依頼します。

## 現在の制限

- Chrome は `chrome://` ページや Chrome Web Store ページなどの制限ページへの拡張機能の注入をブロックします。
- コンテンツスクリプトは cross-origin iframe の内容を検査できません。`crop` は同一オリジン(same-origin)および `srcdoc` iframe ドキュメントを扱えますが、cross-origin iframe ドキュメントの内部は選択できません。
- closed shadow DOM の内部にはアクセスできません。
- ページ全体のキャプチャは現在の最上位ドキュメントを対象にします。cross-origin iframe ドキュメントを別個のページ全体として stitching することはありません。
- ページ全体のキャプチャは `chrome.tabs.captureVisibleTab()` と scroll stitching を使います。lazy loading、animation、sticky layout の変化、大きな canvas サイズを持つ動的ページでは、不完全なキャプチャや明示的なサイズエラーが発生することがあります。
- fixed/sticky page chrome は stitched capture 中に特別な扱いが必要になる場合があります。`crop` は繰り返し現れる fixed/sticky 要素を可能な範囲で減らしますが、privileged browser-native screenshot API は使いません。

## 開発

便利なコマンド:

```bash
npm run build
npm run typecheck
npm test
```

ソース manifest は `manifest.json` です。ビルド後に Chrome へ読み込む対象は `dist/` です。

リポジトリ構成:

- `src/background/`: Chrome extension service worker。
- `src/content/`: 注入されるコンテンツスクリプトのエントリーポイント。
- `src/content/overlay/`: Shadow DOM overlay UI とキャプチャ処理。
- `src/shared/`: message、geometry、crop、filename、clipboard helper。
- `src/firefox-derived/`: Mozilla Firefox Screenshots から適応した MPL-2.0 対象 source。
- `tests/`: unit および regression tests。
- `mydocs/`: Hyper-Waterfall plans、reports、technical notes、task history。

このリポジトリは Hyper-Waterfall workflow に従います。追跡対象の作業は GitHub Issue から始まり、作業ブランチ、今日の作業、実行計画、実装計画、段階報告、最終報告、pull request の順に進みます。

## 帰属とライセンス

製品名は `crop` です。

`crop` は Mozilla または Firefox と提携、承認、後援の関係にはありません。Mozilla と Firefox の名称は、事実に基づく出典表記、license notices、technical references にのみ使用します。

新しいプロジェクトコードは MIT License で配布することを意図しています。`LICENSE` を参照してください。

Mozilla Firefox Screenshots source から適応したファイルは `src/firefox-derived/` に置かれ、Mozilla Public License 2.0 notice を保持します。詳細は `LICENSE-MPL-2.0`、`NOTICE`、`THIRD_PARTY.md` を参照してください。
