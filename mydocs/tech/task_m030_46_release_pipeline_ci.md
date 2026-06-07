# Task #46 기술 노트 - 릴리즈 파이프라인과 PR CI 요구사항 조사

GitHub Issue: [#46](https://github.com/postmelee/crop/issues/46)
마일스톤: M030
확인일: 2026-06-07 KST
기준 브랜치: `local/task46`
선행 PR: [#45](https://github.com/postmelee/crop/pull/45)

## 목적

첫 `main` 릴리즈와 Chrome Web Store 제출 전에 반복 가능한 release pipeline, PR CI, Store 제출 ZIP 생성/검증 기준, Dashboard 제출 runbook의 경계를 정한다. 이 문서는 Stage 1 조사 결과와 이후 Stage 2~3 구현 판단 근거를 기록한다.

Stage 1 조사 당시에는 실제 GitHub Actions workflow, package script, release runbook을 아직 추가하지 않았고, 구현은 Stage 2와 Stage 3에서 수행하기로 했다.

## Stage 1 저장소 상태

| 항목 | 현재 상태 | Stage 1 판단 |
|---|---|---|
| `.github/workflows/` | 없음 | PR CI가 아직 없다. Stage 3에서 새 workflow를 추가한다. |
| `.github/pull_request_template.md` | PR 본문 템플릿만 존재 | CI/원격 검증 섹션은 있으나 실제 GitHub Actions check는 아직 없다. |
| `.github/ISSUE_TEMPLATE/task.yml` | 이슈 템플릿 존재 | #46 변경 대상 아님. |
| `scripts/` | 없음 | Stage 2에서 Store ZIP 생성/검증 스크립트를 새로 둔다. |
| `package.json` scripts | `build`, `test`, `typecheck` | CI baseline은 기존 scripts를 재사용하고, Stage 2에서 `package:cws`, `verify:cws`를 추가한다. |
| Node 조건 | root `engines`와 `packageManager` 없음. 의존성은 대체로 Node 18 이상 요구 | Stage 3 CI는 명시 Node version을 둔다. 후보는 Node 22 이상이며, 실제 값은 Stage 3에서 workflow에 고정한다. |
| release/store manual | `git_workflow_guide.md`, `release_update_protocol.md`, #37 기술 노트/보고서 | Git branch/release PR의 큰 흐름은 있으나 Crop Chrome Web Store 제출 runbook은 분리된 반복 매뉴얼이 필요하다. |

## 선행 산출물 대조

#37 PR #45 merge 후 Chrome Web Store Dashboard 입력값과 제출 중단 기준은 다음 판단으로 고정되어 있다.

- Privacy policy URL 후보는 `https://github.com/postmelee/crop/blob/main/PRIVACY.md`이며, `devel` -> `main` 반영 이후 또는 release tag 기준 URL을 최종 제출 전에 다시 확인한다.
- 실제 `Submit for review`는 `main` 반영, fresh package 검증, assets 확인, smoke test, 작업지시자 승인 전에는 누르지 않는다.
- 제출 후보 ZIP은 `dist/` 내부를 ZIP root로 삼고, root `manifest.json`을 포함해야 한다.
- PR 전 발견된 macOS metadata 리스크 때문에 `.DS_Store`, `__MACOSX`는 ZIP에 포함하지 않는다.
- repository 문서, `node_modules`, source root config 파일은 Store ZIP에 포함하지 않는다.
- Dashboard category는 `Tools` 1차 후보이고, privacy disclosure는 `Website content`만 체크하는 기준이다.

#46은 위 판단을 바꾸지 않는다. 목적은 #37의 one-off command와 수동 체크리스트를 반복 가능한 script, CI, runbook으로 끌어올리는 것이다.

## 기존 매뉴얼과의 경계

| 문서 | 이미 다루는 내용 | #46에서 보완할 내용 |
|---|---|---|
| `mydocs/manual/git_workflow_guide.md` | `local/taskN` -> `publish/taskN` -> `devel`, release PR `devel` -> `main`, tag 흐름 | Chrome Web Store ZIP, PR CI, Dashboard 제출 중단 기준은 별도 runbook에 둔다. |
| `mydocs/manual/release_update_protocol.md` | Hyper-Waterfall release/tag와 update protocol | Crop 0.1.0 Store package/review submit 절차와는 목적이 다르므로 직접 확장하지 않는다. |
| `.github/pull_request_template.md` | PR 본문에 자동/수동/CI 검증 결과를 적는 형식 | Stage 3에서 실제 CI workflow를 추가한 뒤 필요하면 최소 보정한다. |
| `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md` | Dashboard 입력값, package command, submit 전 blocker | #46 runbook이 이 문서를 참조하되 #37 이력 문서를 덮어쓰지 않는다. |

결론: 반복 운영 문서는 `mydocs/manual/release_pipeline_guide.md`로 새로 둔다. #46의 조사와 결정 근거는 이 기술 노트에 계속 누적한다.

## 공식 GitHub Actions 확인

확인일: 2026-06-07 KST

| 출처 | 확인 내용 | #46 적용 |
|---|---|---|
| GitHub Docs - Workflow syntax: <https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax> | workflow YAML은 `.github/workflows` 아래에 두며, `on`으로 trigger event와 branch filter를 정의할 수 있다. `workflow_dispatch`는 수동 실행에 사용한다. | Stage 3에서 `.github/workflows/ci.yml`을 추가하고 `pull_request`와 `workflow_dispatch`를 둔다. |
| GitHub Docs - Events that trigger workflows: <https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows> | `pull_request` event를 PR 검증 trigger로 사용할 수 있다. | task PR 대상 `devel`, release PR 대상 `main`을 CI 대상으로 둔다. |
| GitHub Docs - Dependency caching: <https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching> | cache에는 민감정보를 넣지 않아야 하며 lockfile 기반 key로 dependency cache를 구성할 수 있다. | CI는 `npm ci`를 기준으로 하고, cache는 `setup-node`의 npm cache를 사용한다. secrets나 release credential은 사용하지 않는다. |
| `actions/checkout`: <https://github.com/actions/checkout> | workflow가 repository 내용을 사용할 수 있도록 checkout한다. 2026-06-07 확인 시 README 예시는 `actions/checkout@v6`를 사용한다. | Stage 3 workflow에서 공식 README의 현재 major를 사용하되, release artifact 생성을 위해 별도 history fetch는 기본적으로 필요하지 않다. |
| `actions/setup-node`: <https://github.com/actions/setup-node> | Node version 설정과 npm/yarn/pnpm cache 입력을 지원한다. 2026-06-07 확인 시 README 예시는 `actions/setup-node@v6`와 `cache: npm`을 사용한다. | Stage 3에서 Node version과 `cache: npm`을 명시한다. |
| GitHub Docs - Store and share data with workflow artifacts: <https://docs.github.com/en/actions/tutorials/store-and-share-data> | artifacts는 job 사이 데이터 공유와 workflow 완료 후 파일 보관에 쓸 수 있다. | PR CI baseline에서는 artifact upload를 넣지 않는다. Store 제출용 ZIP은 승인된 release 절차에서 로컬/수동 재생성한다. |
| `actions/upload-artifact`: <https://github.com/actions/upload-artifact> | artifact upload action은 이름/경로/overwrite 같은 설정을 제공한다. 2026-06-07 확인 시 README 예시는 `actions/upload-artifact@v7`를 사용한다. | release artifact upload는 향후 별도 release workflow가 필요할 때 검토한다. 이번 Stage 3 PR CI에는 포함하지 않는다. |

## CI trigger와 명령 결정

Stage 3에서 추가할 PR CI의 기본 형태는 다음 방향으로 고정한다.

| 항목 | 결정 |
|---|---|
| workflow 파일 | `.github/workflows/ci.yml` |
| trigger | `pull_request` 대상 `devel`, `main`; `workflow_dispatch` |
| runner | `ubuntu-latest` |
| checkout | `actions/checkout` |
| Node setup | `actions/setup-node`, 명시 Node version, `cache: npm` |
| install | `npm ci` |
| 검증 | `npm run build`, `npm run typecheck`, `npm test`, `npm run package:cws`, `npm run verify:cws` |
| artifact upload | baseline 제외 |
| secrets | 사용하지 않음 |

`push` trigger는 Stage 3 baseline에서 제외한다. 이 저장소의 작업 단위 검증은 PR 중심이고, release PR도 `devel` -> `main` PR로 생성되므로 `pull_request`만으로 기본 흐름을 막을 수 있다. 필요하면 추후 `push` on `devel`/`main`을 별도 task로 추가한다.

## Store package 생성/검증 결정

Stage 2에서 one-off command 대신 `scripts/` 기반으로 표준화한다.

| 항목 | 결정 |
|---|---|
| 생성 script | `scripts/package-cws.mjs` |
| 검증 script | `scripts/verify-cws-zip.mjs` |
| package script | `package:cws`, `verify:cws` |
| 출력 ZIP | `/tmp/crop-0.1.0-cws.zip` |
| ZIP root | `dist/` 내부 파일 |
| 필수 포함 | root `manifest.json`, extension runtime files, `_locales`, icons |
| 금지 포함 | `.DS_Store`, `__MACOSX`, `node_modules`, `mydocs`, repository root 문서, package/config/source root 파일 |
| 권한 검증 | `debugger`, `<all_urls>`, broad `host_permissions`, `tabs`가 나타나면 실패 |

`package:cws`는 `dist/`를 입력으로 삼으므로 호출 전 `npm run build`가 필요하다. CI와 runbook은 이 순서를 명시해야 한다.

## release와 Chrome Web Store 제출 순서

Stage 3 runbook에는 다음 경계를 명확히 둔다.

1. task PR은 `publish/taskN` -> `devel`로 merge한다.
2. release 시점에 `devel` -> `main` release PR을 만든다.
3. release PR CI와 수동 package 검증을 통과한 뒤 merge한다.
4. `main` 반영 후 tag/GitHub Release를 생성한다. 실제 tag/release는 별도 승인된 release 단계에서 수행한다.
5. Chrome Web Store Dashboard draft 입력은 가능하지만, `Submit for review`는 `main` privacy URL 또는 release tag URL이 유효하고 Store ZIP이 최신 release 기준임을 확인한 뒤 진행한다.
6. `Submit for review` 직전에는 #37 Dashboard guide와 #46 release runbook의 중단 기준을 둘 다 확인한다.

## Stage 2 입력

Stage 2는 이 결론을 바탕으로 다음을 구현한다.

- `scripts/package-cws.mjs`를 추가한다.
- `scripts/verify-cws-zip.mjs`를 추가한다.
- `package.json`에 `package:cws`, `verify:cws`를 추가한다.
- `/tmp/crop-0.1.0-cws.zip` fresh 생성/검증 dry-run을 수행한다.
- 이 기술 노트에 Stage 2 실제 ZIP contents와 검증 결과를 추가한다.

## Stage 2 구현 결과

Stage 2에서는 #37 Stage 4.2의 one-off ZIP 생성 명령을 반복 가능한 Node scripts와 package scripts로 대체했다. #37 기술 노트는 이력 문서로 유지하고 직접 수정하지 않았다.

| 항목 | 구현 |
|---|---|
| ZIP 생성 | `scripts/package-cws.mjs` |
| ZIP 검증 | `scripts/verify-cws-zip.mjs` |
| 로컬/CI 진입점 | `npm run package:cws`, `npm run verify:cws` |
| 기본 ZIP 경로 | `/tmp/crop-0.1.0-cws.zip` |
| 입력 root | `dist/` |
| ZIP 방식 | Node 표준 라이브러리 기반 ZIP writer. 외부 `zip` CLI나 신규 npm 의존성 없음 |
| 검증 방식 | ZIP central directory 직접 파싱. method 0, method 8 entry를 읽을 수 있음 |

### 생성 script 기준

`scripts/package-cws.mjs`는 `dist/` 아래 파일을 정렬해 ZIP root에 넣는다. macOS metadata는 다음 기준으로 제외한다.

- `.DS_Store`
- `__MACOSX`

이번 Stage에서 `npm run build` 후 `dist/.DS_Store`가 실제로 존재하는 상태를 확인했다. 그럼에도 `npm run package:cws` 결과 ZIP에는 `.DS_Store`가 들어가지 않았다.

### 검증 script 기준

`scripts/verify-cws-zip.mjs`는 다음 조건을 실패 처리한다.

- root `manifest.json` 없음
- required runtime entry 누락
- unsafe path (`/`, `\`, `..`) 포함
- `.DS_Store`, `__MACOSX`, `node_modules`, `mydocs` 포함
- root `README*`, `PRIVACY.md`, `NOTICE`, `THIRD_PARTY.md`, `LICENSE*`, `package*.json`, `vite.config.*`, `tsconfig*.json` 포함
- manifest `permissions`가 `activeTab`, `scripting`, `clipboardWrite`, `downloads` 밖으로 확장됨
- `debugger`, `tabs`, `<all_urls>` 같은 unexpected optional permission 포함
- `host_permissions` entry 포함
- broad `optional_host_permissions` 포함

### Stage 2 package 결과

실행 명령:

```bash
npm run build
npm run package:cws
npm run verify:cws
unzip -l /tmp/crop-0.1.0-cws.zip
unzip -Z1 /tmp/crop-0.1.0-cws.zip
```

결과:

- `/tmp/crop-0.1.0-cws.zip` 생성 통과.
- ZIP은 13 files를 포함한다.
- `unzip -l` 기준 uncompressed total은 436,898 bytes다.
- package script 출력 기준 ZIP file size는 438,474 bytes다.
- root `manifest.json`, `_locales` 4개, icon 4개, background/content bundle과 source map이 포함된다.
- `.DS_Store`, `__MACOSX`, repository 문서, `node_modules`, source root config 파일은 포함되지 않는다.

`unzip -Z1 /tmp/crop-0.1.0-cws.zip` 기준 contents:

```text
_locales/en/messages.json
_locales/ja/messages.json
_locales/ko/messages.json
_locales/zh_CN/messages.json
background/service-worker.js
background/service-worker.js.map
content/inject.js
content/inject.js.map
icons/crop-128.png
icons/crop-16.png
icons/crop-32.png
icons/crop-48.png
manifest.json
```

## Stage 3 입력

Stage 3는 Stage 2 scripts가 통과한 뒤 다음을 구현한다.

- `.github/workflows/ci.yml`을 추가한다.
- CI가 Stage 2 package scripts를 그대로 호출하게 한다.
- `mydocs/manual/release_pipeline_guide.md`를 추가한다.
- `mydocs/manual/README.md`에 새 runbook entry를 추가한다.
- 필요 시 `.github/pull_request_template.md`의 CI/원격 검증 표기를 최소 보정한다.

## Stage 3 구현 결과

Stage 3에서는 PR CI workflow와 반복 release runbook을 추가했다.

| 항목 | 구현 |
|---|---|
| PR CI workflow | `.github/workflows/ci.yml` |
| trigger | `pull_request` 대상 `devel`, `main`; `workflow_dispatch` |
| 권한 | `contents: read` |
| runner | `ubuntu-latest` |
| Node | `actions/setup-node@v6`, `node-version: 24`, `cache: npm` |
| 검증 명령 | `npm ci`, `npm run build`, `npm run typecheck`, `npm test`, `npm run package:cws`, `npm run verify:cws` |
| release runbook | `mydocs/manual/release_pipeline_guide.md` |
| manual index | `mydocs/manual/README.md`에 runbook entry 추가 |
| PR template | 기존 `CI/원격 검증` 표가 있으므로 Stage 3에서 수정하지 않음 |

Stage 3 직전 공식 문서/README를 다시 확인했다.

- GitHub workflow syntax는 workflow 파일 위치, trigger event, branch filter, `workflow_dispatch`를 지원한다.
- `actions/checkout` README는 2026-06-07 확인 시 `actions/checkout@v6` 예시를 제공한다.
- `actions/setup-node` README는 2026-06-07 확인 시 `actions/setup-node@v6`, `node-version: 24`, `cache: npm` 예시를 제공한다.
- `workflow_dispatch`는 workflow file이 default branch에 있어야 수동 실행 event를 받는다. 따라서 이 workflow는 #46 PR이 merge되고 default branch에 반영된 뒤 수동 실행 대상이 된다.

Runbook은 다음 기준을 고정했다.

- task PR과 release PR을 분리한다.
- task PR은 `devel` 대상, release PR은 `devel -> main` 대상이다.
- Chrome Web Store `Submit for review`는 `main` 또는 release tag 기준 `PRIVACY.md` URL, release 기준 ZIP 재생성/검증, 필수 asset, deferred publishing 의도, 작업지시자 승인 전에는 누르지 않는다.
- `small promotional image`를 포함한 Store asset 누락은 제출 중단 기준이다.
- release workflow artifact upload는 이번 baseline에서 제외하고, Store 제출 ZIP은 release runbook에서 재생성/검증한다.

## Stage 4 통합 검증 결과

Stage 4에서는 Stage 1~3 산출물, #37 Dashboard guide, package scripts, PR CI workflow, release runbook을 대조했다.

통합 검증:

- `npm run build` 통과.
- `npm run typecheck` 통과.
- `npm test` 통과: 17 files, 213 tests.
- `npm run package:cws` 통과: `/tmp/crop-0.1.0-cws.zip`, 13 files, 438,474 bytes.
- `npm run verify:cws` 통과.
- `unzip -l /tmp/crop-0.1.0-cws.zip` 기준 uncompressed total 436,898 bytes.
- `unzip -Z1 /tmp/crop-0.1.0-cws.zip` 기준 package contents는 Stage 2와 동일하다.
- `dist/.DS_Store`가 존재하지만 ZIP에는 포함되지 않는다.

충돌 대조:

| 영역 | #37 기준 | #46 기준 | 결과 |
|---|---|---|---|
| Store ZIP | `/tmp/crop-0.1.0-cws.zip`, root `manifest.json`, 13 files, macOS metadata 제외 | `npm run package:cws`와 `npm run verify:cws`로 같은 ZIP 기준 고정 | OK |
| Privacy URL | `main` 또는 release tag 기준 `PRIVACY.md` | `main` 또는 release tag 기준 stable URL 전까지 submit 금지 | OK |
| Submit timing | `Submit for review`는 최종 검증, asset 확인, 승인 후 | `main`/tag, package verify, assets, deferred publishing, 승인 전 submit 금지 | OK |
| Category | `Tools` 1차, `Art & Design` fallback | release runbook은 Dashboard 입력값 상세를 #37 guide로 위임 | OK |
| Data disclosure | `Website content`만 체크 | release runbook은 #37 privacy disclosure 확인을 submit 조건으로 요구 | OK |
| Small promo | global small promotional image가 제출 전 blocker | small promotional image 누락을 submit 중단 기준으로 유지 | OK |

실제 release PR, GitHub Release/tag, Chrome Web Store upload/review submit은 수행하지 않았다.

## 잔여 위험

- GitHub Actions 공식 action major version은 변동될 수 있다. 변경 시 별도 task에서 workflow와 이 기술 노트를 함께 갱신한다.
- PR CI baseline에는 artifact upload를 넣지 않으므로 GitHub Actions UI에서 제출 ZIP을 직접 내려받는 흐름은 제공하지 않는다. Store 제출용 ZIP은 release runbook에서 재생성/검증한다.
- root `package.json`에 `engines`와 `packageManager`가 없어 CI Node/npm 버전 고정 근거가 약하다. Stage 3 workflow에는 Node 24를 명시했지만, 필요하면 별도 task로 `packageManager` 고정을 검토한다.
- 실제 GitHub Actions run은 PR 생성 후 원격에서만 확인할 수 있다. Stage 3까지는 workflow 구조와 로컬 명령 검증으로 대체한다.
