# crop Privacy Policy

Last updated: June 14, 2026

This privacy policy applies to `crop`, a Chrome Manifest V3 extension for
selecting and capturing screenshots from the current page.

This policy applies to `crop` v0.1.1 and later, unless it is replaced by a
newer policy.

## Summary

`crop` processes screenshots locally in your browser. It does not upload
screenshots, page content, or browsing data to a server. It does not include
telemetry, analytics, advertising, accounts, payments, or background tracking.

The image leaves the page only when you explicitly choose Copy or Save:

- Copy writes the generated PNG to your system clipboard.
- Save asks Chrome to download the generated PNG file.

## Data Processed By The Extension

When you invoke `crop`, the extension may temporarily process the following
data in the active tab:

- Screenshot pixels captured from the visible tab.
- Page geometry needed to highlight elements, draw a custom region, resize or
  move a selected region, and crop or stitch the screenshot.
- The generated PNG image that results from your explicit capture action.

This processing is limited to the extension's single purpose: selecting and
capturing screenshots from the current page.

## Data Collection And Sharing

`crop` does not collect, sell, rent, transfer, or share user data with third
parties. It does not send screenshot data, page data, or usage data to the
developer or to any analytics service.

`crop` does not use remote servers for screenshot processing. Screenshot
capture, cropping, and stitching happen locally in the browser.

## Clipboard And Downloads

If you choose Copy, Chrome and your operating system may keep the copied image
in the system clipboard according to their normal clipboard behavior.

If you choose Save, Chrome downloads the generated PNG file according to your
browser download settings.

## Chrome Extension Permissions

`crop` uses the following Chrome extension permissions:

| Permission | Why it is needed |
|---|---|
| `activeTab` | Grants temporary access to the current tab after you invoke the extension. |
| `scripting` | Injects the screenshot selection overlay into the active tab. |
| `clipboardWrite` | Allows Copy to write the generated PNG to the clipboard. |
| `downloads` | Allows Save to download the generated PNG file. |

`crop` does not request `debugger`, `<all_urls>`, broad host permissions, or
`host_permissions`.

## Limited Use

`crop` uses information accessed through Chrome extension APIs only to provide
or improve its single purpose: selecting and capturing screenshots from the
current page. This use is intended to comply with the Chrome Web Store User
Data Policy, including the Limited Use requirements.

## Browser And Page Limitations

Chrome blocks extension injection on restricted pages such as `chrome://`
pages and Chrome Web Store pages. `crop` also cannot inspect cross-origin
iframe contents or closed shadow DOM internals from a content script.

Full-page capture uses visible-tab captures plus scrolling and stitching.
If the stitched output would exceed browser canvas limits, `crop` may
downscale the PNG to keep it as a single image. Dynamic pages with lazy
loading, animations, or sticky layout changes can still produce imperfect
captures.

## Contact

For questions, issues, or source information, use the public repository:

<https://github.com/postmelee/crop>

# crop 개인정보처리방침

최종 업데이트: 2026년 6월 14일

이 개인정보처리방침은 현재 페이지에서 스크린샷을 선택하고 캡처하는
Chrome Manifest V3 확장 프로그램 `crop`에 적용됩니다.

이 방침은 더 새로운 방침으로 대체되기 전까지 `crop` v0.1.1 및 이후
버전에 적용됩니다.

## 요약

`crop`은 스크린샷을 내 브라우저 안에서 로컬로 처리합니다. 스크린샷,
페이지 콘텐츠, 브라우징 데이터를 서버로 업로드하지 않습니다. 사용 통계,
분석 기능, 광고, 계정, 결제, 백그라운드 추적 기능을 포함하지 않습니다.

이미지는 사용자가 명시적으로 복사 또는 저장을 선택할 때만 페이지 밖으로
내보내집니다.

- 복사는 생성된 PNG를 시스템 클립보드에 씁니다.
- 저장은 Chrome에 생성된 PNG 파일 다운로드를 요청합니다.

## 확장 프로그램이 처리하는 데이터

사용자가 `crop`을 실행하면 확장 프로그램은 활성 탭에서 다음 데이터를
일시적으로 처리할 수 있습니다.

- 보이는 탭에서 캡처한 스크린샷 픽셀.
- 요소를 강조 표시하고, 직접 영역을 그리고, 선택 영역을 이동하거나
  크기를 조절하고, 스크린샷을 자르거나 이어 붙이는 데 필요한 페이지
  구조와 위치 정보.
- 사용자의 명시적인 캡처 동작으로 생성된 PNG 이미지.

이 처리는 현재 페이지에서 스크린샷을 선택하고 캡처한다는 확장 프로그램의
단일 목적에 한정됩니다.

## 데이터 수집과 공유

`crop`은 사용자 데이터를 수집, 판매, 대여, 전송하거나 제3자와 공유하지
않습니다. 스크린샷 데이터, 페이지 데이터, 사용 데이터를 개발자 또는 분석
서비스로 보내지 않습니다.

`crop`은 스크린샷 처리를 위해 원격 서버를 사용하지 않습니다. 스크린샷
캡처, 자르기, 이어 붙이기는 브라우저 안에서 로컬로 처리됩니다.

## 클립보드와 다운로드

사용자가 복사를 선택하면 Chrome과 운영체제는 일반적인 클립보드 동작에
따라 복사된 이미지를 시스템 클립보드에 보관할 수 있습니다.

사용자가 저장을 선택하면 Chrome은 브라우저 다운로드 설정에 따라 생성된
PNG 파일을 다운로드합니다.

## Chrome 확장 권한

`crop`은 다음 Chrome 확장 권한을 사용합니다.

| 권한 | 필요한 이유 |
|---|---|
| `activeTab` | 사용자가 확장 프로그램을 실행한 뒤 현재 탭에 임시로 접근하기 위해 필요합니다. |
| `scripting` | 활성 탭에 스크린샷 선택 화면을 주입하기 위해 필요합니다. |
| `clipboardWrite` | 복사 기능으로 생성된 PNG를 클립보드에 쓰기 위해 필요합니다. |
| `downloads` | 저장 기능으로 생성된 PNG 파일을 다운로드하기 위해 필요합니다. |

`crop`은 `debugger`, `<all_urls>`, 넓은 호스트 권한 또는
`host_permissions`를 요청하지 않습니다.

## 제한적 사용

`crop`은 Chrome 확장 API를 통해 접근한 정보를 현재 페이지의 스크린샷을
선택하고 캡처한다는 단일 목적을 제공하거나 개선하는 데만 사용합니다. 이
사용 방식은 Chrome Web Store User Data Policy와 Limited Use 요구사항을
준수하기 위한 것입니다.

## 브라우저와 페이지 제한

Chrome은 `chrome://` 페이지와 Chrome Web Store 페이지 같은 제한된
페이지에서 확장 프로그램 주입을 차단합니다. 또한 `crop`은 콘텐츠
스크립트에서 다른 출처의 iframe 내부나 closed shadow DOM 내부를 검사할
수 없습니다.

전체 페이지 캡처는 보이는 탭 캡처를 스크롤하며 이어 붙이는 방식으로
동작합니다. 이어 붙인 결과가 브라우저 캔버스 제한을 넘을 수 있는 경우
`crop`은 단일 이미지로 유지하기 위해 PNG를 축소할 수 있습니다. 스크롤할
때 늦게 불러오는 콘텐츠, 애니메이션, 고정된 레이아웃 변화가 있는 동적
페이지에서는 결과가 완벽하지 않을 수 있습니다.

## 연락처

질문, 이슈, 소스 정보는 공개 저장소를 사용해 주세요.

<https://github.com/postmelee/crop>

# crop プライバシーポリシー

最終更新日: 2026年6月14日

このプライバシーポリシーは、現在のページからスクリーンショットを
選択してキャプチャする Chrome Manifest V3 拡張機能 `crop` に適用されます。

このポリシーは、より新しいポリシーに置き換えられるまで、`crop` v0.1.1
以降に適用されます。

## 概要

`crop` はスクリーンショットをブラウザー内でローカルに処理します。
スクリーンショット、ページコンテンツ、閲覧データをサーバーへアップロード
しません。利用統計、分析機能、広告、アカウント、決済、バックグラウンド
追跡機能は含まれていません。

画像は、ユーザーが明示的にコピーまたは保存を選択した場合にのみ、
ページの外へ出力されます。

- コピーは、生成された PNG をシステムクリップボードに書き込みます。
- 保存は、生成された PNG ファイルをダウンロードするよう Chrome に依頼します。

## 拡張機能が処理するデータ

ユーザーが `crop` を実行すると、拡張機能はアクティブなタブで次のデータを
一時的に処理する場合があります。

- 表示中のタブからキャプチャしたスクリーンショットのピクセル。
- 要素の強調表示、範囲の描画、選択範囲の移動やサイズ変更、
  スクリーンショットの切り抜きや結合に必要なページの構造と位置情報。
- ユーザーの明示的なキャプチャ操作によって生成された PNG 画像。

この処理は、現在のページからスクリーンショットを選択してキャプチャする
という拡張機能の単一目的に限定されます。

## データの収集と共有

`crop` はユーザーデータを収集、販売、貸与、転送、または第三者と共有しません。
スクリーンショットデータ、ページデータ、利用データを開発者または分析サービス
へ送信しません。

`crop` はスクリーンショット処理にリモートサーバーを使用しません。
スクリーンショットのキャプチャ、切り抜き、結合はブラウザー内でローカルに
処理されます。

## クリップボードとダウンロード

ユーザーがコピーを選択した場合、Chrome とオペレーティングシステムは通常の
クリップボード動作に従って、コピーされた画像をシステムクリップボードに保持
することがあります。

ユーザーが保存を選択した場合、Chrome はブラウザーのダウンロード設定に従って
生成された PNG ファイルをダウンロードします。

## Chrome 拡張機能の権限

`crop` は次の Chrome 拡張機能の権限を使用します。

| 権限 | 必要な理由 |
|---|---|
| `activeTab` | ユーザーが拡張機能を実行した後、現在のタブへ一時的にアクセスするために必要です。 |
| `scripting` | アクティブなタブにスクリーンショット選択画面を挿入するために必要です。 |
| `clipboardWrite` | コピー機能で生成された PNG をクリップボードに書き込むために必要です。 |
| `downloads` | 保存機能で生成された PNG ファイルをダウンロードするために必要です。 |

`crop` は `debugger`、`<all_urls>`、広範なホスト権限、または
`host_permissions` を要求しません。

## Limited Use

`crop` は Chrome 拡張 API を通じてアクセスした情報を、現在のページから
スクリーンショットを選択してキャプチャするという単一目的の提供または改善に
のみ使用します。この使用は、Chrome Web Store User Data Policy と Limited Use
要件に準拠することを意図しています。

## ブラウザーとページの制限

Chrome は `chrome://` ページや Chrome Web Store ページなどの制限されたページで
拡張機能の挿入をブロックします。また、`crop` はコンテンツスクリプトから別の
オリジンの iframe 内部や closed shadow DOM 内部を検査できません。

ページ全体のキャプチャは、表示中のタブをスクロールしながらキャプチャして結合する
方式で動作します。結合後の結果がブラウザーのキャンバス制限を超える可能性がある
場合、`crop` は単一の画像として保持するために PNG を縮小することがあります。
スクロール時に遅れて読み込まれるコンテンツ、アニメーション、固定レイアウトの変化が
ある動的ページでは、結果が完全にならないことがあります。

## 連絡先

質問、問題、ソース情報については公開リポジトリを使用してください。

<https://github.com/postmelee/crop>

# crop 隐私政策

最后更新日期: 2026年6月14日

本隐私政策适用于 `crop`，这是一款用于从当前页面选择并捕获截图的
Chrome Manifest V3 扩展程序。

除非被更新的政策取代，本政策适用于 `crop` v0.1.1 及更高版本。

## 概要

`crop` 会在你的浏览器内本地处理截图。它不会将截图、页面内容或浏览数据
上传到服务器。它不包含使用统计、分析功能、广告、账户、支付或后台跟踪功能。

只有在你明确选择复制或保存时，图片才会离开页面。

- 复制会将生成的 PNG 写入系统剪贴板。
- 保存会请求 Chrome 下载生成的 PNG 文件。

## 扩展程序处理的数据

当你运行 `crop` 时，扩展程序可能会在当前活动标签页中临时处理以下数据。

- 从可见标签页捕获的截图像素。
- 用于高亮元素、绘制自定义区域、移动或调整所选区域、裁剪或拼接截图的
  页面结构和位置信息。
- 由你的明确截图操作生成的 PNG 图片。

这些处理仅限于扩展程序的单一目的: 从当前页面选择并捕获截图。

## 数据收集与共享

`crop` 不会收集、出售、出租、传输用户数据，也不会与第三方共享用户数据。
它不会将截图数据、页面数据或使用数据发送给开发者或任何分析服务。

`crop` 不使用远程服务器处理截图。截图捕获、裁剪和拼接都在浏览器内本地完成。

## 剪贴板和下载

如果你选择复制，Chrome 和你的操作系统可能会按照其正常剪贴板行为，将复制的
图片保留在系统剪贴板中。

如果你选择保存，Chrome 会按照你的浏览器下载设置下载生成的 PNG 文件。

## Chrome 扩展权限

`crop` 使用以下 Chrome 扩展权限。

| 权限 | 使用原因 |
|---|---|
| `activeTab` | 在你运行扩展程序后临时访问当前标签页。 |
| `scripting` | 将截图选择界面注入到当前活动标签页。 |
| `clipboardWrite` | 在你使用复制功能时，将生成的 PNG 写入剪贴板。 |
| `downloads` | 在你使用保存功能时，下载生成的 PNG 文件。 |

`crop` 不请求 `debugger`、`<all_urls>`、宽泛的主机权限或
`host_permissions`。

## Limited Use

`crop` 仅将通过 Chrome 扩展 API 访问的信息用于提供或改进其单一目的:
从当前页面选择并捕获截图。此使用方式旨在遵守 Chrome Web Store User Data Policy
及其 Limited Use 要求。

## 浏览器和页面限制

Chrome 会阻止扩展程序注入到受限制的页面，例如 `chrome://` 页面和
Chrome Web Store 页面。`crop` 也无法通过内容脚本检查其他来源的 iframe 内部
或 closed shadow DOM 内部。

整页捕获通过滚动并拼接可见标签页截图来工作。如果拼接后的结果可能超过浏览器
画布限制，`crop` 可能会缩小 PNG，以便将其保持为单张图片。对于滚动时延迟加载的
内容、动画或固定布局变化的动态页面，结果仍可能不完美。

## 联系方式

如有问题、反馈或源代码相关请求，请使用公开仓库。

<https://github.com/postmelee/crop>
