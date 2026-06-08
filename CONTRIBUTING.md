# Contributing to crop

Languages: English | [한국어](CONTRIBUTING.ko.md) | [简体中文](CONTRIBUTING.zh-CN.md) | [日本語](CONTRIBUTING.ja.md)

This English document is the canonical version. Translations are provided for convenience.

Thank you for your interest in `crop`. This document explains the basic expectations for opening issues and pull requests in this public repository.

This repository uses an internal Hyper-Waterfall workflow for maintainer-managed work. External contributors do not need to write internal task documents or stage reports. A maintainer may review an issue or pull request and, when needed, convert it into a tracked GitHub Issue, task branch, and plan.

## Before contributing

- Search existing GitHub Issues and Pull Requests first.
- Keep new features, bug fixes, and documentation changes as small as practical.
- Use `crop` as the only user-facing product name and brand.
- Use Mozilla, Firefox, and Screenshots names only for source attribution, license notices, or technical references. Do not imply affiliation, endorsement, sponsorship, or product status from Mozilla or Firefox.
- Keep Chrome MV3 permissions narrow. Do not add `debugger`, `<all_urls>`, broad host permissions, or the `tabs` permission without prior maintainer discussion.
- When touching Firefox-derived or MPL 2.0-covered files, preserve the boundaries and notices in `src/firefox-derived/`, `NOTICE`, `THIRD_PARTY.md`, and `LICENSE-MPL-2.0`.

## Opening an issue

Start with an Issue when possible.

A useful Issue includes:

- Background for the problem or proposal
- Expected outcome
- Included and excluded scope
- Reproduction steps or a verification method
- Relevant page, browser version, operating system, screenshots, or other context

Do not put sensitive security details or personal information in a public Issue. Leave only the minimum public description and coordinate with the maintainer on a private follow-up path.

## Opening a pull request

Keep Pull Requests small and reviewable.

Basic expectations:

- Fill out the PR template.
- Explain why the change is needed and what changed.
- Call out any user-facing behavior, permission, privacy, branding, or license impact.
- Link related Issues when they exist.
- Record the verification commands you ran and their results.
- Avoid mixing unrelated formatting, large refactors, and feature changes in one PR.

Recommended verification:

```bash
npm run build
npm run typecheck
npm test
git diff --check
```

Documentation-only PRs may not need source build or test commands. If you skip them, explain why in the PR.

## Code and documentation standards

- Do not promise behavior that the current implementation does not support.
- Preserve the privacy stance that screenshots are processed locally in the browser.
- Do not imply server uploads, telemetry, account sync, or other unimplemented behavior.
- Keep the overlay, highlight, and buttons out of the final PNG.
- Be explicit about limits such as Chrome restricted pages, cross-origin iframes, closed shadow DOM, and canvas size limits.

## Maintainer workflow and external contributions

Maintainer work is tracked from GitHub Issues and may follow this flow:

```text
Issue -> branch -> daily order -> plan -> implementation plan -> stage report -> final report -> pull request
```

This is an internal operating workflow for maintainers and coding agents. External contributors can still use normal Issues and Pull Requests. If needed, a maintainer will turn a contribution into a tracked task and handle the internal workflow.

## Review and merge

- Every PR requires maintainer review.
- CI and required manual verification must pass before merge.
- If scope grows or policy decisions are needed, a maintainer may move the work back to an Issue and re-plan it.
- Issues are closed by maintainer approval or after the related PR is merged.

## Questions and discussions

Use GitHub Issues or Discussions for questions, usage reports, and feature ideas. Issues are better for bugs and concrete task requests. Discussions are better for broader suggestions, usage experience, and open-ended conversation.
