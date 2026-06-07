# Task #48 Stage 2 보고서 - release package 재생성과 검증

GitHub Issue: [#48](https://github.com/postmelee/crop/issues/48)
구현계획서: [`task_m030_48_impl.md`](../plans/task_m030_48_impl.md)
Stage: 2

## 단계 목적

이번 Stage는 Stage 1에서 정한 첫 release 기준 commit `53808a2147c120e67f7bb93b737b2f6d0526d6f4`의 package 산출물이 Chrome Web Store 제출 후보로 적합한지 fresh build와 ZIP 검증으로 확인하는 단계다.

현재 `local/task48`은 `origin/devel` 대비 `mydocs/` 계획/보고 문서만 추가된 상태이며, 소스 코드, manifest, package script, build 설정은 `origin/devel`과 동일하다. 따라서 이번 Stage의 package 검증은 release 기준 코드와 같은 코드/설정에서 수행됐다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/working/task_m030_48_stage2.md` | build/typecheck/test/package/verify 결과와 CWS ZIP checksum 기록 |
| `/tmp/crop-0.1.0-cws.zip` | Chrome Web Store Dashboard 업로드 후보 ZIP. Git에는 커밋하지 않음 |

## 본문 변경 정도 / 본문 무손실 여부

이번 Stage는 소스 코드, manifest, privacy policy, release manual을 수정하지 않았다. `mydocs/working/`에 검증 결과만 신규 기록했다.

## release 기준 일치 확인

| 확인 | 결과 |
|---|---|
| release 기준 commit | `53808a2147c120e67f7bb93b737b2f6d0526d6f4` |
| 현재 HEAD | `32337da23a45e432dca4beb43950f48543cef584` |
| `origin/devel...HEAD` 차이 | `mydocs/orders/20260607.md`, `mydocs/plans/task_m030_48.md`, `mydocs/plans/task_m030_48_impl.md`, `mydocs/working/task_m030_48_stage1.md` |
| source/config 차이 | 없음 |
| package 기준 판단 | ZIP 생성 대상인 `dist/`와 package scripts는 release 기준과 동일 |

## package 결과

| 항목 | 값 |
|---|---|
| ZIP 경로 | `/tmp/crop-0.1.0-cws.zip` |
| ZIP file size | `438,474` bytes |
| ZIP uncompressed total | `436,898` bytes |
| ZIP file count | 13 files |
| SHA-256 | `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15` |
| manifest version | `0.1.0` |
| manifest permissions | `activeTab`, `scripting`, `clipboardWrite`, `downloads` |
| manifest host permissions | 없음 |

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

로컬 `dist/` 안에는 `.DS_Store`가 존재했지만 `npm run package:cws`가 제출 ZIP에서 제외했고, `npm run verify:cws`가 forbidden entry absence를 통과했다. 제출 후보 ZIP에는 `.DS_Store`, `__MACOSX`, `node_modules`, `mydocs`, repository root 문서/config가 없다.

## 검증 결과

실행 명령:

```bash
git status --short --branch
git diff --name-status origin/devel...HEAD
git diff --name-only origin/devel...HEAD -- . ':(exclude)mydocs'
npm run build
npm run typecheck
npm test
npm run package:cws
npm run verify:cws
unzip -l /tmp/crop-0.1.0-cws.zip
unzip -Z1 /tmp/crop-0.1.0-cws.zip
shasum -a 256 /tmp/crop-0.1.0-cws.zip
wc -c /tmp/crop-0.1.0-cws.zip
node -e 'const fs=require("fs"); const m=JSON.parse(fs.readFileSync("./dist/manifest.json","utf8")); console.log(JSON.stringify({version:m.version,permissions:m.permissions,host_permissions:m.host_permissions ?? []}))'
git diff --check
```

결과:

- OK: `git status --short --branch` 결과는 `## local/task48`.
- OK: `git diff --name-status origin/devel...HEAD` 결과는 `mydocs/` 산출물 4개뿐이다.
- OK: `git diff --name-only origin/devel...HEAD -- . ':(exclude)mydocs'` 결과는 빈 출력으로 source/config 차이가 없다.
- OK: `npm run build` 통과. Vite build가 `dist/manifest.json`, locale, service worker, content bundle을 생성했다.
- OK: `npm run typecheck` 통과.
- OK: `npm test` 통과. 17 files, 213 tests passed.
- OK: `npm run package:cws` 통과. `/tmp/crop-0.1.0-cws.zip`, 13 files, 438,474 bytes 생성.
- OK: `npm run verify:cws` 통과. Chrome Web Store ZIP verification passed.
- OK: `unzip -l` 결과는 13 files, uncompressed total 436,898 bytes.
- OK: `unzip -Z1` 결과에 `manifest.json`이 root에 있고 forbidden entry가 없다.
- OK: `shasum -a 256` 결과는 `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15`.
- OK: `wc -c` 결과는 `438474 /tmp/crop-0.1.0-cws.zip`.
- OK: manifest 확인 결과는 `{"version":"0.1.0","permissions":["activeTab","scripting","clipboardWrite","downloads"],"host_permissions":[]}`.
- OK: `git diff --check` 통과.

## 잔여 위험

- `/tmp/crop-0.1.0-cws.zip`는 로컬 임시 파일이므로 Stage 3 Release asset 업로드 전 같은 파일을 유지해야 한다.
- GitHub Release asset 업로드 후에는 Release에서 다시 다운로드해 checksum을 대조해야 한다.
- 원격 `main`, `v0.1.0` tag, GitHub Release는 아직 생성하지 않았다.
- Chrome Web Store Dashboard upload와 `Submit for review`는 아직 수행하지 않았다.

## 다음 단계 영향

- Stage 3에서는 이 ZIP의 SHA-256 `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15`를 기준으로 GitHub Release asset 동일성을 확인한다.
- Stage 3에서 원격 `main`을 `53808a2` 기준으로 최초 생성하고, `v0.1.0` tag/GitHub Release와 asset 업로드를 수행하려면 작업지시자 승인이 필요하다.
- privacy policy URL은 `main`과 `v0.1.0` 양쪽을 실제 접근 확인한 뒤 제출 후보로 확정한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3로 진행한다.
- Stage 3에서는 원격 `main` 최초 생성, `v0.1.0` tag/GitHub Release 생성, `crop-0.1.0-cws.zip` Release asset 업로드, privacy URL 확인을 수행한다.
