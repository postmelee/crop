# crop 贡献指南

语言：[English](CONTRIBUTING.md) | [한국어](CONTRIBUTING.ko.md) | 简体中文 | [日本語](CONTRIBUTING.ja.md)

本文是简体中文译本，仅为方便阅读提供。如不同语言版本含义不一致，以 English 版本为准。

感谢你对 `crop` 感兴趣。本文说明在这个公开仓库中创建 Issue 和 Pull Request 时的基本期望。

本仓库的维护者工作使用内部 Hyper-Waterfall 流程管理。外部贡献者不需要编写内部任务文档或阶段报告。维护者可能会在评审 Issue 或 PR 后，将其转换为单独的 GitHub Issue、任务分支和计划文档。

## 贡献前请确认

- 先搜索现有 GitHub Issues 和 Pull Requests。
- 尽量把新功能、错误修复和文档修改拆成较小范围。
- 面向用户的产品名称和品牌只使用 `crop`。
- Mozilla、Firefox、Screenshots 名称只能用于来源标注、许可证说明或技术参考。不要暗示关联、认可、赞助或官方产品身份。
- 保持 Chrome MV3 权限范围较小。未经维护者事先讨论，不要添加 `debugger`、`<all_urls>`、宽泛的 host permissions 或 `tabs` 权限。
- 修改 Firefox 衍生代码或 MPL 2.0 覆盖文件时，请保留 `src/firefox-derived/`、`NOTICE`、`THIRD_PARTY.md` 和 `LICENSE-MPL-2.0` 中的边界和声明。

## 创建 Issue

请尽可能先通过 Issue 讨论新的工作。

一个有用的 Issue 通常包含：

- 问题或提案背景
- 期望结果
- 包含范围和排除范围
- 复现步骤或验证方式
- 相关页面、浏览器版本、操作系统、截图或其他上下文

不要在公开 Issue 中写入敏感安全细节或个人信息。请只留下可以公开的最小描述，并与维护者协调私下跟进方式。

## 创建 Pull Request

请保持 Pull Request 小而易于评审。

基本期望：

- 填写 PR template。
- 说明为什么需要此修改以及修改了什么。
- 明确标出对用户可见行为、权限、privacy、品牌或许可证的影响。
- 如有相关 Issue，请链接。
- 记录已运行的验证命令和结果。
- 不要在同一个 PR 中混入无关格式化、大规模重构和功能变更。

推荐验证：

```bash
npm run build
npm run typecheck
npm test
git diff --check
```

仅修改文档的 PR 可能不需要运行源码 build/test。如果跳过这些命令，请在 PR 中说明原因。

## 代码和文档标准

- 不要在文档中承诺当前实现不支持的行为。
- 保持截图在浏览器本地处理的 privacy stance。
- 不要暗示服务器上传、telemetry、账号同步或其他未实现行为。
- 确保 overlay、highlight 和按钮不会出现在最终 PNG 中。
- 明确说明 Chrome 受限页面、cross-origin iframe、closed shadow DOM、canvas 尺寸限制等限制。

## Maintainer workflow 与外部贡献

Maintainer 工作以 GitHub Issue 为跟踪起点，必要时会遵循以下流程：

```text
Issue -> branch -> daily order -> plan -> implementation plan -> stage report -> final report -> pull request
```

这是维护者和编码代理用于跟踪变更的内部流程。外部贡献者仍然可以使用普通 Issue 和 Pull Request。必要时，维护者会把贡献转换为被跟踪的 task，并处理内部 workflow。

## Review 和 merge

- 每个 PR 都需要 maintainer review。
- CI 和必要的手动验证必须通过后才能 merge。
- 如果范围扩大或需要政策判断，维护者可能会把工作退回到 Issue 并重新规划。
- Issue 会在维护者批准后或相关 PR merge 后关闭。

## 问题和讨论

问题、使用反馈和功能想法可以使用 GitHub Issues 或 Discussions。Bug 和具体任务请求更适合 Issues；更宽泛的建议、使用经验分享和开放式对话更适合 Discussions。
