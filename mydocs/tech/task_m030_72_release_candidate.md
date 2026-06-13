# Task #72 release candidate 기준값

GitHub Issue: [#72](https://github.com/postmelee/crop/issues/72)
기준일: 2026-06-13

## 목적

다음 `crop` release 후보를 만들기 위해 `v0.1.0` 이후 `origin/main`과 `origin/devel`에 누적된 변경, 현재 version 값, package 산출물 이름 기준, 권한 경계를 정리한다. 이 문서는 Stage 2의 version bump, GitHub Release body 후보, `devel -> main` release PR 본문 후보의 입력값으로 사용한다.

## Stage 1 기준 snapshot

| 항목 | 값 |
|---|---|
| 현재 작업 브랜치 | `local/task72` |
| 최신 공개 tag | `v0.1.0` |
| `origin/main` | `4a6e2b2 Main sync: merge devel issue template updates` |
| `origin/devel` | `d107bec Merge pull request #69 from postmelee/publish/task68` |
| `package.json` version | `0.1.0` |
| `manifest.json` version | `0.1.0` |
| package 기본 ZIP 경로 | `/tmp/crop-0.1.0-cws.zip` |
| manifest permissions | `activeTab`, `scripting`, `clipboardWrite`, `downloads` |
| manifest host permissions | 없음 |

`scripts/package-cws.mjs`는 `package.json`의 `name`과 `version`을 사용해 기본 ZIP 경로를 만든다. 따라서 Stage 2에서 `0.1.1`로 bump하면 package 후보는 `/tmp/crop-0.1.1-cws.zip`가 된다.

## Branch/tag 상태

현재 local branch는 #72 작업 브랜치이며 upstream은 설정하지 않았다.

```text
## local/task72
```

현재 tag 목록은 `v0.1.0` 하나다.

```text
v0.1.0
```

## `v0.1.0..origin/main` 후보 변경

`origin/main`에는 `v0.1.0` 이후 다음 계열 변경이 포함되어 있다.

| 계열 | 근거 commit/PR | release note 분류 후보 |
|---|---|---|
| 첫 main/release 실행 기록 | PR #49 / Issue #48 | developer 검증 기록 |
| Chrome Web Store 게시 후 README 설치 안내 | PR #53 / Issue #51 | user 안내 보조 항목 |
| GitHub Release note 템플릿과 release runbook | PR #55 / Issue #50 | developer 검증 기록 |
| v0.1.0 Release body 표준화 | PR #62 / Issue #54 | developer 검증 기록 |
| GitHub Community Standards 보강 | PR #56 / Issue #29 | contributor-facing 변경 |
| 사용자 버그 제보 Issue Form | PR #67 / Issue #65 | user/contributor 안내 |
| README badge, locale header, image asset | PR #64와 main 직접 보정 commit | user/contributor 안내 |

대표 `origin/main` 전용 commit:

```text
4a6e2b2 Main sync: merge devel issue template updates
6b20b7c README: fix badge link underlines
f741d5f README: add badges and locale header assets
8232fd9 Update README.md
60baff2 Merge pull request #64 from postmelee/publish/main-docs-assets
c052a6e Main sync: add README image assets
```

## `v0.1.0..origin/devel` 후보 변경

`origin/devel`에는 `origin/main`의 공통 M030 변경 외에 #66과 #68 캡처 안정화 보정이 추가되어 있다.

| 계열 | 근거 commit/PR | release note 분류 후보 |
|---|---|---|
| selected stitching 검정 대체 블록 보정 | PR #70 / Issue #66 | user-facing bug fix |
| Always scroll bars 환경 우측 여백 보정 | PR #69 / Issue #68 | user-facing bug fix |
| 사용자 버그 제보 Issue Form | PR #67 / Issue #65 | user/contributor 안내 |
| GitHub Community Standards 보강 | PR #56 / Issue #29 | contributor-facing 변경 |
| release note/runbook/body 표준화 | PR #55, #62 / Issues #50, #54 | developer 검증 기록 |
| 첫 release 실행과 README 설치 안내 | PR #49, #53 / Issues #48, #51 | developer 검증 기록과 user 안내 보조 항목 |

`origin/devel`의 first-parent merge 목록:

```text
d107bec Merge pull request #69 from postmelee/publish/task68
bc2279a Merge pull request #70 from postmelee/publish/task66
4f38458 Merge pull request #67 from postmelee/publish/task65
d41dc6a Merge pull request #56 from postmelee/publish/task29
a4ae500 Merge pull request #62 from postmelee/publish/task54
5c202ac Merge pull request #55 from postmelee/publish/task50
3971f0e Merge pull request #53 from postmelee/publish/task51
83c4c96 Merge pull request #49 from postmelee/publish/task48
```

## `origin/main..origin/devel` 차이 해석

`git diff --name-status origin/main..origin/devel`는 main 전용 README 이미지 asset을 `D`로 표시한다. 이것은 `origin/devel` tree가 main 전용 asset commit을 포함하지 않기 때문에 생기는 branch 간 tree 비교 결과다.

이번 release PR은 `devel -> main` 3-way merge 흐름이므로, main 전용 asset 삭제를 release 의도로 해석하지 않는다. Stage 4 또는 release PR 생성 전에는 release PR diff에서 main 전용 README asset이 보존되는지 다시 확인해야 한다.

`origin/main..origin/devel`의 실질적 devel 전용 release 후보는 #66과 #68이다.

## 권한 경계

현재 manifest 권한은 다음과 같다.

```text
{"permissions":["activeTab","scripting","clipboardWrite","downloads"],"host_permissions":[]}
```

권한 grep 결과:

```text
package.json:3:  "version": "0.1.0",
manifest.json:4:  "version": "0.1.0",
src/background/service-worker.ts:75:  tabs: {
src/background/service-worker.ts:162:    const dataUrl = await chrome.tabs.captureVisibleTab(sender.tab?.windowId, {
tests/content/overlay/phase6-regression.test.ts:70:  host_permissions?: string[];
tests/content/overlay/phase6-regression.test.ts:863:  it("keeps MVP extension permissions free of debugger and all-url host access", () => {
tests/content/overlay/phase6-regression.test.ts:864:    expect(manifestJson.permissions ?? []).not.toContain("debugger");
tests/content/overlay/phase6-regression.test.ts:865:    expect(manifestJson.permissions ?? []).not.toContain("<all_urls>");
tests/content/overlay/phase6-regression.test.ts:866:    expect(manifestJson.host_permissions ?? []).not.toContain("<all_urls>");
```

해석:

- `tabs`는 `src/background/service-worker.ts`의 API namespace와 test fixture type에서만 나타났다.
- manifest permission에 `tabs`, `debugger`, `<all_urls>`, broad `host_permissions`가 추가된 흔적은 없다.
- Stage 2/3에서도 version bump와 package build 후 manifest permission을 다시 확인해야 한다.

## User-facing release 후보

다음 항목은 사용자 안내의 주요 변경점 후보로 둔다.

- 선택 영역이 viewport 밖으로 일부 벗어난 selected stitching 캡처에서 검정 영역이 저장되는 문제를 보정했다.
- macOS `Show scroll bars: Always` 환경에서 선택 이미지 Copy/Save 결과 오른쪽에 scrollbar gutter 유래 흰 여백이 붙는 문제를 보정했다.
- 사용자가 GitHub에서 구조화된 버그 제보 Issue Form을 사용할 수 있게 됐다.
- README와 다국어 README의 설치/소개/asset 표시가 보강됐다.

다음 항목은 developer 검증 기록 또는 contributor-facing 변경으로 분리한다.

- GitHub Release body 템플릿과 release pipeline guide 정리.
- 기존 `v0.1.0` GitHub Release body 표준화.
- Community Standards, Code of Conduct, Contributing, Security, Funding 문서 보강.
- 첫 main/release 실행 기록과 Chrome Web Store 게시 후 README 설치 안내.

## Version 후보 판단

Stage 1 기준 추천 version은 `v0.1.1`이다.

판단 근거:

- 현재 공개 release와 package/manifest version이 모두 `0.1.0`이다.
- `origin/devel`의 주요 사용자-facing 변경은 #66, #68의 bug fix/stabilization이다.
- 새 캡처 모드, 새 권한, Chrome Web Store 제출 정책, 공개 API에 해당하는 기능 확장은 없다.
- 문서/운영 보강은 release note에는 포함하되 minor version 상승 사유로 보지 않는다.

Stage 2 승인 요청:

- `package.json` version을 `0.1.1`로 변경한다.
- `manifest.json` version을 `0.1.1`로 변경한다.
- GitHub Release tag 후보를 `v0.1.1`로 둔다.
- package 후보 경로를 `/tmp/crop-0.1.1-cws.zip`로 둔다.

## Stage 2 입력값

| 항목 | Stage 2 후보 |
|---|---|
| release version | `0.1.1` |
| release tag | `v0.1.1` |
| package asset name | `crop-0.1.1-cws.zip` |
| package output path | `/tmp/crop-0.1.1-cws.zip` |
| Chrome Web Store 상태 표현 | 작업지시자 직접 제출 전까지 `not submitted` 후보 |
| privacy URL 후보 | release PR merge 전에는 `https://github.com/postmelee/crop/blob/main/PRIVACY.md`, tag 생성 후에는 `https://github.com/postmelee/crop/blob/v0.1.1/PRIVACY.md` 후보 |

## Stage 1 검증 로그

```bash
git fetch --all --tags --prune
git status --short --branch
git tag --sort=-creatordate
git log --oneline v0.1.0..origin/main
git log --oneline v0.1.0..origin/devel
git log --merges --first-parent --oneline v0.1.0..origin/devel
git diff --name-status origin/main..origin/devel
node -p "require('./package.json').version"
rg -n '"version"|debugger|<all_urls>|host_permissions|tabs' package.json manifest.json src tests
```

결과 요약:

- OK: 원격 fetch 성공.
- OK: 작업 브랜치는 `local/task72`.
- OK: 최신 tag는 `v0.1.0`.
- OK: `package.json`과 `manifest.json` version은 `0.1.0`.
- OK: manifest 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads`, host permission 없음.
- OK: `origin/main` 전용 README asset 변경과 `origin/devel` 전용 #66/#68 변경을 구분했다.
- OK: Stage 2 version 후보를 `0.1.1`로 정리했다.

## Stage 2 version bump 결과

기준일: 2026-06-14

Stage 1 승인에 따라 release 후보 version을 `0.1.1`로 반영했다.

| 파일 | 변경 전 | 변경 후 |
|---|---|---|
| `package.json` | `0.1.0` | `0.1.1` |
| `manifest.json` | `0.1.0` | `0.1.1` |

Stage 2 이후 package 후보:

| 항목 | 값 |
|---|---|
| release version | `0.1.1` |
| release tag | `v0.1.1` |
| package asset name | `crop-0.1.1-cws.zip` |
| package output path | `/tmp/crop-0.1.1-cws.zip` |
| Chrome Web Store 상태 표현 | `not submitted` |

## GitHub Release body 후보

아래 body 후보는 `mydocs/_templates/github_release_note.md` 구조를 기준으로 작성했다. Stage 3 package 검증 후 asset size, SHA-256 checksum, verification 결과를 확정값으로 갱신한다.

```markdown
# crop v0.1.1

## user 안내

### 설치 / 업데이트

- Chrome Web Store: not submitted for `v0.1.1`
- 설치 URL: https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki
- 업데이트 방식: Chrome Web Store 제출과 review 완료 후 자동 업데이트 후보
- 대상 버전: `v0.1.1`

### 주요 변경점

- 선택 영역이 viewport 밖으로 일부 벗어난 selected stitching 캡처에서 검정 영역이 저장되는 문제를 보정했다.
- macOS `Show scroll bars: Always` 환경에서 선택 이미지 Copy/Save 결과 오른쪽에 scrollbar gutter 유래 흰 여백이 붙는 문제를 보정했다.
- GitHub에서 crop 버그를 구조화해 제보할 수 있는 Issue Form을 추가했다.
- README와 다국어 README의 badge, locale header, image asset 표시를 보강했다.

### 권한과 privacy

- 권한 변화: 없음. `activeTab`, `scripting`, `clipboardWrite`, `downloads`를 유지하고 `debugger`, `<all_urls>`, broad `host_permissions`, manifest `tabs` permission을 추가하지 않는다.
- privacy URL: https://github.com/postmelee/crop/blob/v0.1.1/PRIVACY.md
- 데이터 처리: 스크린샷은 브라우저 안에서 로컬 처리된다. `crop`은 스크린샷이나 페이지 데이터를 서버로 업로드하지 않고 telemetry를 포함하지 않는다.

### known limitations

- Chrome은 `chrome://` 페이지와 Chrome Web Store 페이지 같은 제한된 페이지에서 extension injection을 차단한다.
- Cross-origin iframe contents와 closed shadow DOM internals는 content script에서 검사할 수 없다.
- 동적 페이지, fixed 또는 sticky layout, lazy loading이 있는 페이지에서는 tiled capture 결과가 페이지 상태에 영향을 받을 수 있다.

### Chrome Web Store 상태

- Store 상태: not submitted
- Store package: `crop-0.1.1-cws.zip`
- 확인일: 2026-06-14

## developer 검증 기록

### release 기준

| 항목 | 값 |
|---|---|
| Tag | `v0.1.1` |
| Release commit | main release PR merge commit으로 확정 |
| Base branch | `main` |
| 포함 PR | #49, #53, #55, #56, #62, #64, #67, #69, #70, Task #72 PR |
| 포함 Issue | #48, #51, #50, #29, #54, #65, #68, #66, #72 |

### package asset

| 항목 | 값 |
|---|---|
| asset 이름 | `crop-0.1.1-cws.zip` |
| asset URL | `https://github.com/postmelee/crop/releases/download/v0.1.1/crop-0.1.1-cws.zip` |
| asset size | 451,909 bytes |
| SHA-256 checksum | `57ab12022f97f7b90d91d258434bf5f0010f562c03328e6d7d23df3ae4f59aa3` |
| 생성 명령 | `npm run build && npm run package:cws` |
| 검증 명령 | `npm run verify:cws` |

### verification 결과

| 검증 | 결과 |
|---|---|
| `npm run build` | PASS. Vite production build 완료 |
| `npm run typecheck` | PASS. TypeScript diagnostics 없음 |
| `npm test` | PASS. 17 files, 230 tests passed |
| `npm run package:cws` | PASS. `/tmp/crop-0.1.1-cws.zip`, 13 files, 451,909 bytes 생성 |
| `npm run verify:cws` | PASS. Chrome Web Store ZIP verification passed |
| ZIP contents 확인 | PASS. ZIP root `manifest.json` 포함, forbidden repository/dependency entry 출력 없음 |
| manifest permission 확인 | PASS. `activeTab`, `scripting`, `clipboardWrite`, `downloads`; host permissions 없음 |
| privacy URL 확인 | 후보 URL 형식 확인. tag 생성 후 `https://github.com/postmelee/crop/blob/v0.1.1/PRIVACY.md` 접근성 최종 확인 필요 |

### rollback / follow-up

- Rollback 기준: release PR merge 또는 tag 생성 전 문제가 발견되면 `v0.1.0` 공개 release를 유지하고 #72 또는 별도 issue-backed 보정 task에서 수정한다.
- 후속 작업: Chrome Web Store package upload와 `Submit for review`는 작업지시자가 직접 진행한다.
- 자동 release notes: 사용 안 함. 수동 body 후보와 검증 기록을 기준으로 한다.
```

## `devel -> main` Release PR 본문 후보

제목 후보:

```text
Release: v0.1.1
```

본문 후보:

```markdown
## 요약

- `v0.1.1` release 후보를 `main`으로 승격한다.
- 사용자-facing 변경은 selected stitching 검정 영역 보정, Always scroll bars 환경 우측 여백 보정, 사용자 버그 제보 Issue Form, README/asset 보강이다.
- Chrome Web Store package upload와 `Submit for review`는 이 PR에서 수행하지 않는다.

## 포함 변경

- #66: viewport 밖 selected stitching의 검정 캡처 보정
- #68: Always scroll bars 환경 캡처 우측 여백 보정
- #65: 사용자 버그 제보용 Issue Form 추가
- #29: GitHub Community Standards 보강
- #50, #54: GitHub Release body와 release note 운영 기준 정리
- #48, #51: 첫 release 실행 기록과 Chrome Web Store 게시 후 README 설치 안내
- #64 및 main 보정 commit: README badge, locale header, image asset 보강
- #72: release 후보 정리, version bump, release body 후보, package 검증 기록

## 검증

- `npm run build`, `npm run typecheck`, `npm test`, `npm run package:cws`, `npm run verify:cws` 통과
- `/tmp/crop-0.1.1-cws.zip`: 13 files, 451,909 bytes
- SHA-256: `57ab12022f97f7b90d91d258434bf5f0010f562c03328e6d7d23df3ae4f59aa3`
- ZIP root `manifest.json` 포함, forbidden repository/dependency entry 없음
- Stage 4에서 release PR 생성 전 main 전용 README asset 보존 여부를 다시 확인한다.

## 승인 상태

- `main` merge: 별도 승인 전 보류
- tag/GitHub Release 생성: 별도 승인 전 보류
- Chrome Web Store upload와 `Submit for review`: 작업지시자가 직접 진행
```

## Stage 2 검증 요약

- version grep은 `package.json`과 `manifest.json`의 `0.1.1`을 찾아야 한다.
- release 후보 grep은 Stage 2 release body 후보와 release PR 본문 후보의 핵심 문맥을 찾아야 한다.
- 템플릿 잔여 표식 검사는 출력이 없어야 한다.
- `git diff --check`는 경고 없이 통과해야 한다.

## Stage 3 package validation 결과

기준일: 2026-06-14

| 항목 | 결과 |
|---|---|
| `npm run build` | PASS. `dist/manifest.json`, locale files, background/content bundles 생성 |
| `npm run typecheck` | PASS. TypeScript diagnostics 없음 |
| `npm test` | PASS. 17 test files, 230 tests passed |
| `npm run package:cws` | PASS. `/tmp/crop-0.1.1-cws.zip` 생성 |
| `npm run verify:cws` | PASS. Chrome Web Store ZIP verification passed |
| ZIP root manifest | PASS. `manifest.json`이 ZIP root에 존재 |
| forbidden ZIP entries | PASS. `.DS_Store`, `__MACOSX`, `node_modules`, `mydocs`, repository root 문서/config 출력 없음 |
| manifest permission | PASS. `activeTab`, `scripting`, `clipboardWrite`, `downloads`만 확인, `host_permissions` 없음 |

Package asset:

| 항목 | 값 |
|---|---|
| path | `/tmp/crop-0.1.1-cws.zip` |
| file count | 13 |
| asset size | 451,909 bytes |
| uncompressed size | 450,333 bytes |
| SHA-256 | `57ab12022f97f7b90d91d258434bf5f0010f562c03328e6d7d23df3ae4f59aa3` |

ZIP contents:

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

Manifest permission 확인:

```text
manifest.json
version=0.1.1
permissions=["activeTab","scripting","clipboardWrite","downloads"]
host_permissions=[]
optional_permissions=[]
optional_host_permissions=[]
dist/manifest.json
version=0.1.1
permissions=["activeTab","scripting","clipboardWrite","downloads"]
host_permissions=[]
optional_permissions=[]
optional_host_permissions=[]
```
