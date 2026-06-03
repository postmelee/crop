# crop

语言：[English](README.md) | [Korean](README.ko.md) | Simplified Chinese | [Japanese](README.ja.md)

`crop` 是一个用于精确截取网页截图的 Chrome Manifest V3 扩展。打开覆盖层，选择页面元素或拖出自定义区域，然后复制或保存生成的 PNG。

发布状态：`crop` 正在准备 Chrome Web Store 发布，目前尚未列入 Chrome Web Store。现在请在本地构建扩展，并将生成的 `dist/` 文件夹作为 unpacked extension 加载。

## crop 能做什么

- 可通过扩展 action icon 或 `Ctrl+Shift+S` 快捷键打开，在 macOS 上使用 `Command+Shift+S`。
- 在当前标签页上显示页面覆盖层。
- 当指针移动时高亮 DOM 元素。
- 可以点击元素、拖出自定义区域，并在截图前调整或移动选区。
- 将选中的 PNG 复制到系统剪贴板，或保存为下载的 PNG 文件。
- 直接截取当前可见 viewport。
- 通过滚动并拼接可见 viewport 截图，将当前 top-level document 截取为 full-page PNG。
- 当 Chrome 允许 content script 检查 iframe document 时，支持选择 same-origin 和 `srcdoc` iframe 元素。
- 对延伸到当前 viewport 外的选区，通过滚动和 stitching 截取完整的 selected page rectangle。

## 从源码加载

要求：

- Node.js 20 或更新版本
- npm
- 可以加载 unpacked extension 的 Google Chrome 或其他 Chromium 浏览器

构建扩展：

```bash
npm install
npm run build
```

在 Chrome 中加载：

1. 打开 `chrome://extensions`。
2. 启用 Developer mode。
3. 点击 Load unpacked。
4. 选择本仓库的 `dist/` 文件夹。
5. 打开普通网页，然后点击 `crop` action icon。

如果建议快捷键与现有浏览器或操作系统快捷键冲突，Chrome 可能会让该快捷键保持未分配状态。你可以在 `chrome://extensions/shortcuts` 中查看扩展快捷键。

## 基本用法

1. 打开普通网页。
2. 点击 `crop` action icon，或按 `Ctrl+Shift+S`。macOS 使用 `Command+Shift+S`。
3. 选择一种截图流程。
   - 移到元素上并点击以选择它。
   - 拖动绘制自定义区域。
   - 使用 visible-page 按钮截取当前 viewport。
   - 使用 full-page 按钮截取当前 top-level document。
4. 如有需要，调整选区。
5. 点击 Copy 将 PNG 写入剪贴板，或点击 Save 下载 PNG。
6. 如需关闭覆盖层且不截图，按 Escape 或使用 Cancel。

## 权限

`crop` 使用以下 Chrome extension permissions。

| 权限 | 需要原因 |
|---|---|
| `activeTab` | 在你调用扩展后，授予对当前标签页的临时访问权限。 |
| `scripting` | 将覆盖层 content script 注入到活动标签页。 |
| `clipboardWrite` | 允许 Copy 将生成的 PNG 写入剪贴板。 |
| `downloads` | 允许 Save 下载生成的 PNG 文件。 |

该扩展不请求 `debugger`、`<all_urls>`、broad host permissions 或 `host_permissions`。

## 隐私

截图会在你的浏览器中进行 local processing。`crop` 不上传截图，不把页面数据发送到 server，也不包含 telemetry。

只有当你明确使用 Copy 或 Save 时，图像才会离开页面。

- Copy 会将 PNG 写入系统剪贴板。
- Save 会请求 Chrome 下载 PNG 文件。

## 当前限制

- Chrome 会阻止扩展注入受限制页面，例如 `chrome://` 页面和 Chrome Web Store 页面。
- content script 无法检查 cross-origin iframe 内容。`crop` 可以处理 same-origin 和 `srcdoc` iframe document，但不能选择 cross-origin iframe document 内部内容。
- 无法访问 closed shadow DOM 内部。
- full-page capture 覆盖当前 top-level document。它不会把 cross-origin iframe document 作为独立 full page 进行 stitching。
- full-page capture 使用 `chrome.tabs.captureVisibleTab()` 加 scroll stitching。带有 lazy loading、animation、sticky layout 变化或超大 canvas 尺寸的动态页面，可能生成不完美的截图或明确的尺寸错误。
- fixed/sticky page chrome 在 stitched capture 中可能需要特殊处理。`crop` 会尽量减少重复的 fixed/sticky 元素，但不使用 privileged browser-native screenshot API。

## 开发

常用命令：

```bash
npm run build
npm run typecheck
npm test
```

source manifest 是 `manifest.json`。构建后，在 Chrome 中加载的目标目录是 `dist/`。

仓库结构：

- `src/background/`：Chrome extension service worker。
- `src/content/`：injected content script entrypoint。
- `src/content/overlay/`：Shadow DOM overlay UI 和 capture orchestration。
- `src/shared/`：message、geometry、crop、filename、clipboard helpers。
- `src/firefox-derived/`：从 Mozilla Firefox Screenshots 改编的 MPL-2.0 source。
- `tests/`：unit 和 regression tests。
- `mydocs/`：Hyper-Waterfall plans、reports、technical notes 和 task history。

本仓库遵循 Hyper-Waterfall workflow。被跟踪的工作从 GitHub Issue 开始，依次经过 task branch、daily order、plan、implementation plan、stage report、final report 和 pull request。

## 署名与许可证

产品名是 `crop`。

`crop` 与 Mozilla 或 Firefox 没有 affiliated、endorsed、sponsored 关系。Mozilla 和 Firefox 名称仅用于基于事实的 source attribution、license notices 和 technical references。

新的项目代码预期以 MIT License 分发。请参阅 `LICENSE`。

从 Mozilla Firefox Screenshots source 改编的文件保存在 `src/firefox-derived/` 下，并保留 Mozilla Public License 2.0 notice。详情请参阅 `LICENSE-MPL-2.0`、`NOTICE` 和 `THIRD_PARTY.md`。
