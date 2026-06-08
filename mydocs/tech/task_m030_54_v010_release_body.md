# Task #54 기술 노트 - v0.1.0 Release body 기준값

GitHub Issue: [#54](https://github.com/postmelee/crop/issues/54)
기준일: 2026-06-08

## 목적

기존 GitHub Release `v0.1.0` body를 #50에서 확정한 release note 템플릿 구조로 소급 표준화하기 전에, 현재 원격 Release 상태와 기준값을 기록한다. 이 문서는 Stage 2의 공개 body 초안, Stage 3의 update 전후 비교, Stage 4의 최종 검증 근거로 사용한다.

## Stage 1 현재 상태

### GitHub Release metadata

| 항목 | 값 |
|---|---|
| Release URL | `https://github.com/postmelee/crop/releases/tag/v0.1.0` |
| Tag | `v0.1.0` |
| Release name | `crop v0.1.0` |
| Release commit | `53808a2147c120e67f7bb93b737b2f6d0526d6f4` |
| Draft | `false` |
| Prerelease | `false` |

### 현재 Release body

현재 body는 user 안내와 developer 검증 기록이 분리되지 않은 단일 문단이다.

```text
Chrome Web Store submission candidate for crop v0.1.0. Release commit: 53808a2147c120e67f7bb93b737b2f6d0526d6f4. Generated with npm run build, npm run package:cws, and verified with npm run typecheck, npm test, npm run verify:cws. Asset SHA-256: 84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15.
```

### Release asset

| 항목 | 값 |
|---|---|
| asset 이름 | `crop-0.1.0-cws.zip` |
| asset URL | `https://github.com/postmelee/crop/releases/download/v0.1.0/crop-0.1.0-cws.zip` |
| asset API URL | `https://api.github.com/repos/postmelee/crop/releases/assets/440907819` |
| content type | `application/zip` |
| state | `uploaded` |
| size | `438474 bytes` |
| digest | `sha256:84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15` |
| downloaded SHA-256 | `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15` |
| createdAt | `2026-06-07T12:50:07Z` |
| updatedAt | `2026-06-07T12:50:08Z` |
| downloadCount | `2` |

### Privacy URL

| 항목 | 값 |
|---|---|
| tag 기준 privacy URL | `https://github.com/postmelee/crop/blob/v0.1.0/PRIVACY.md` |
| contents SHA | `29f580ed98e124904268a7d9225b2cc8cfda6722` |

### Chrome Web Store 상태

| 항목 | 값 |
|---|---|
| Store 상태 | `published` |
| Store URL | `https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki` |
| URL 확인 | `HTTP 200`, effective URL 동일 |
| 내부 근거 | #51 최종 보고서와 README가 게시 완료 및 Store 설치 가능 상태를 기록 |

주의: Chrome Web Store는 동적 페이지이므로 CLI HTTP 확인만으로 브라우저 UI의 `Add to Chrome` 버튼 상태까지 검증하지 않는다. Stage 1에서는 작업지시자가 제공한 게시 완료 상태, README/#51 기록, Store URL HTTP 200을 기준으로 `published` 후보값을 고정한다.

## #48 / #50 기준 대조

| 항목 | #48 기준 | Stage 1 현재 원격 상태 | 결과 |
|---|---|---|---|
| Release commit | `53808a2147c120e67f7bb93b737b2f6d0526d6f4` | `53808a2147c120e67f7bb93b737b2f6d0526d6f4` | OK |
| Release URL | `https://github.com/postmelee/crop/releases/tag/v0.1.0` | 동일 | OK |
| asset 이름 | `crop-0.1.0-cws.zip` | 동일 | OK |
| asset size | `438474 bytes` | `438474 bytes` | OK |
| ZIP SHA-256 | `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15` | 동일 | OK |
| privacy URL | `https://github.com/postmelee/crop/blob/v0.1.0/PRIVACY.md` | 동일 | OK |
| Chrome Web Store review submit | #48에서는 미수행 | #51 이후 published로 기록 | 변경 맥락 반영 필요 |

## #50 템플릿 대비 현재 body gap

현재 Release body에 이미 있는 정보:

- `v0.1.0` release commit
- build/package/verify 명령 요약
- asset SHA-256 checksum
- Chrome Web Store submission candidate 문맥

Stage 2에서 보강해야 할 정보:

- `user 안내`와 `developer 검증 기록`의 명시적 분리
- Chrome Web Store `published` 상태와 설치 URL
- 권한 변화와 privacy URL
- known limitations
- asset URL과 asset size
- verification 결과 표
- rollback / follow-up
- #50 템플릿의 작성 체크박스와 내부 주석 제거

## Stage 2 초안 영역

아래 본문은 Stage 3 승인 후 원격 GitHub Release `v0.1.0` body에 적용할 후보 초안이다. Stage 2에서는 초안만 작성했고, 원격 Release body는 변경하지 않았다.

### 공개 body 초안

```markdown
# crop v0.1.0

## user 안내

### 설치 / 업데이트

- Chrome Web Store: published
- 설치 URL: https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki
- 업데이트 방식: 자동 업데이트
- 대상 버전: `v0.1.0`

### 주요 변경점

- 확장 action icon 또는 `Ctrl+Shift+S` 단축키로 현재 tab에서 capture overlay를 열 수 있다.
- DOM element hover highlight, element selection, custom region selection, visible viewport capture, top-level full-page capture를 지원한다.
- 선택한 PNG를 system clipboard로 복사하거나 download 파일로 저장할 수 있다.

### 권한과 privacy

- 권한 변화: 첫 공개 릴리즈 기준. 필요한 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads`다.
- privacy URL: https://github.com/postmelee/crop/blob/v0.1.0/PRIVACY.md
- 데이터 처리: 스크린샷은 브라우저 안에서 로컬 처리된다. `crop`은 스크린샷이나 페이지 데이터를 서버로 업로드하지 않고 telemetry를 포함하지 않는다.

### known limitations

- Chrome은 `chrome://` 페이지와 Chrome Web Store 페이지 같은 제한된 페이지에서 extension injection을 차단한다.
- Cross-origin iframe contents와 closed shadow DOM internals는 content script에서 검사할 수 없다.
- Full-page와 scroll-stitched capture는 동적 페이지 또는 fixed/sticky layout 변화가 있는 페이지에서 완전하지 않을 수 있으며, 매우 큰 capture는 browser canvas limit 안에 맞추기 위해 downscale될 수 있다.

### Chrome Web Store 상태

- Store 상태: published
- Store package: `crop-0.1.0-cws.zip`
- 확인일: 2026-06-08

## developer 검증 기록

### release 기준

| 항목 | 값 |
|---|---|
| Tag | `v0.1.0` |
| Release commit | `53808a2147c120e67f7bb93b737b2f6d0526d6f4` |
| Base branch | `main` |
| 포함 PR | `#47` |
| 포함 Issue | `#46`, `#48` |

### package asset

| 항목 | 값 |
|---|---|
| asset 이름 | `crop-0.1.0-cws.zip` |
| asset URL | `https://github.com/postmelee/crop/releases/download/v0.1.0/crop-0.1.0-cws.zip` |
| asset size | `438474 bytes` |
| SHA-256 checksum | `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15` |
| 생성 명령 | `npm run build && npm run package:cws` |
| 검증 명령 | `npm run verify:cws` |

### verification 결과

| 검증 | 결과 |
|---|---|
| `npm run build` | OK - Vite build가 통과했고 extension package 입력이 생성됐다. |
| `npm run typecheck` | OK |
| `npm test` | OK - 17 files, 213 tests passed. |
| `npm run package:cws` | OK - `/tmp/crop-0.1.0-cws.zip`, 13 files, 438474 bytes. |
| `npm run verify:cws` | OK - Chrome Web Store ZIP verification passed. |
| ZIP contents 확인 | OK - `manifest.json`이 ZIP root에 있고 `.DS_Store`, `__MACOSX`, `node_modules`, `mydocs`, repository root docs/config 같은 forbidden entry가 없다. |
| privacy URL 확인 | OK - `https://github.com/postmelee/crop/blob/v0.1.0/PRIVACY.md`, contents SHA `29f580ed98e124904268a7d9225b2cc8cfda6722`. |
| Chrome Web Store URL 확인 | OK - `https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki`가 2026-06-08에 HTTP 200을 반환했다. |

### rollback / follow-up

- Rollback 기준: 이번 작업은 GitHub Release body만 변경한다. body update가 잘못되면 이전 단일 문단 body 또는 별도 승인된 수정 body로 되돌린다. 별도 task와 승인 없이 Release asset, tag, Store package를 교체하지 않는다.
- 후속 작업: 이 업데이트 이후 `v0.1.0` Release body 기준 후속 작업은 해당 없음. 이후 release는 `mydocs/_templates/github_release_note.md`를 사용한다.
- 자동 release notes: 사용 안 함. 이 Release body는 승인된 템플릿 구조를 기준으로 수동 관리한다.
```

### 초안 판단

- 템플릿 주석과 작성 체크박스는 공개 body 초안에서 제거했다.
- 모든 release 기준값은 Stage 1에서 확인한 원격 Release, downloaded asset, `v0.1.0` privacy URL, #48 package 검증 기록을 기준으로 채웠다.
- Chrome Web Store 상태는 작업지시자의 게시 완료 통지, #51 README 갱신 결과, Store URL HTTP 200 확인을 기준으로 `published`로 표기했다.
- `downloadCount`처럼 시간에 따라 변하는 값은 공개 body 초안에서 제외했다.
- Stage 3에서는 위 초안만 적용하고 tag, title, asset, draft/prerelease 상태는 변경하지 않는다.

## Stage 3 update 전후 비교 영역

Stage 3 승인 후 원격 GitHub Release body를 수정하면 update 전후 요약과 불변 항목을 이 섹션에 기록한다.

현재 불변 기준:

- Tag: `v0.1.0`
- Release name: `crop v0.1.0`
- Release commit: `53808a2147c120e67f7bb93b737b2f6d0526d6f4`
- Draft: `false`
- Prerelease: `false`
- Asset: `crop-0.1.0-cws.zip`
- Asset size: `438474 bytes`
- SHA-256: `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15`

## Stage 1 검증 로그

```bash
gh release view v0.1.0 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,assets,body
gh release download v0.1.0 --repo postmelee/crop --pattern 'crop-0.1.0-cws.zip' --dir /tmp/crop-task54-release-check-stage1
shasum -a 256 /tmp/crop-task54-release-check-stage1/crop-0.1.0-cws.zip
wc -c /tmp/crop-task54-release-check-stage1/crop-0.1.0-cws.zip
gh api 'repos/postmelee/crop/contents/PRIVACY.md?ref=v0.1.0' --jq '.html_url, .sha'
git ls-remote --tags origin v0.1.0
curl -I -L --max-time 20 https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki
```

결과:

- OK: Release URL, tag, name, draft/prerelease 상태, asset metadata, current body를 조회했다.
- OK: Release asset download 후 SHA-256이 `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15`로 확인됐다.
- OK: Release asset byte size가 `438474`로 확인됐다.
- OK: `v0.1.0` 기준 `PRIVACY.md` URL과 contents SHA를 확인했다.
- OK: 원격 `v0.1.0` tag가 `53808a2147c120e67f7bb93b737b2f6d0526d6f4`를 가리킨다.
- OK: Chrome Web Store URL이 HTTP 200으로 접근됐다.
- OK: Stage 1에서는 원격 GitHub Release body를 변경하지 않았다.
