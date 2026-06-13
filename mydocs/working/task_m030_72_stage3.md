# Task #72 Stage 3 보고서

GitHub Issue: [#72](https://github.com/postmelee/crop/issues/72)
구현계획서: [`task_m030_72_impl.md`](../plans/task_m030_72_impl.md)
Stage: 3

## 단계 목적

Stage 2에서 작성한 `v0.1.1` release candidate를 실제 package 산출물 기준으로 검증한다. build, typecheck, test, Chrome Web Store ZIP package 생성과 검증을 실행하고, asset size, SHA-256 checksum, ZIP contents, manifest permission 결과를 release 후보 문서에 반영한다. Chrome Web Store upload, GitHub Release 생성, tag 생성, release PR 생성은 수행하지 않았다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/tech/task_m030_72_release_candidate.md` | `crop-0.1.1-cws.zip` asset size, SHA-256 checksum, package 검증 결과, ZIP contents, manifest permission 확인 결과를 반영했다. |
| `mydocs/orders/20260614.md` | Task #72 상태를 Stage 3 완료 보고 후 승인 대기로 갱신했다. |
| `mydocs/working/task_m030_72_stage3.md` | Stage 3 산출물, 검증 결과, 잔여 위험, 다음 단계 영향을 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

소스 코드와 manifest/package version은 변경하지 않았다. `dist/`는 검증을 위해 `npm run build`로 재생성됐지만 repository 산출물로 stage하지 않는다. release 후보 문서는 Stage 2 본문을 유지한 채 Stage 3 확정값과 검증 결과를 추가했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm test
npm run package:cws
npm run verify:cws
unzip -l /tmp/crop-0.1.1-cws.zip
unzip -Z1 /tmp/crop-0.1.1-cws.zip
shasum -a 256 /tmp/crop-0.1.1-cws.zip
rg -n "debugger|<all_urls>|host_permissions|tabs" manifest.json dist/manifest.json
rg -n "npm run build|npm run typecheck|npm test|npm run package:cws|npm run verify:cws|SHA-256|manifest.json|forbidden|Chrome Web Store" mydocs/tech/task_m030_72_release_candidate.md mydocs/working/task_m030_72_stage3.md
git diff --check
```

결과:

- OK: `npm run build` 통과. Vite production build가 `dist/manifest.json`, locale files, background/content bundles를 생성했다.
- OK: `npm run typecheck` 통과. TypeScript diagnostics 출력 없음.
- OK: `npm test` 통과. 17 test files, 230 tests passed.
- OK: `npm run package:cws` 통과. `/tmp/crop-0.1.1-cws.zip` 생성, 13 files, 451,909 bytes.
- OK: `npm run verify:cws` 통과. Chrome Web Store ZIP verification passed.
- OK: `unzip -l` 기준 ZIP uncompressed size는 450,333 bytes이고 ZIP root에 `manifest.json`이 있다.
- OK: `unzip -Z1` 기준 ZIP entries는 locale files, background/content bundles, icons, `manifest.json` 13개다.
- OK: `shasum -a 256` 결과는 `57ab12022f97f7b90d91d258434bf5f0010f562c03328e6d7d23df3ae4f59aa3`이다.
- OK: permission grep은 출력이 없었다. `chrome.tabs.captureVisibleTab()` API 명칭과 manifest `tabs` permission을 혼동하지 않으며, manifest permission은 구조화 확인 결과 `activeTab`, `scripting`, `clipboardWrite`, `downloads`만 존재한다.
- OK: forbidden entry 검사는 출력이 없었다. `.DS_Store`, `__MACOSX`, `node_modules`, `mydocs`, repository root 문서/config가 ZIP에 포함되지 않았다.
- OK: release 후보 문서와 Stage 3 보고서가 검증 명령, SHA-256, `manifest.json`, forbidden entry, Chrome Web Store 문맥을 포함한다.
- OK: `git diff --check`는 출력 없이 통과했다.

## 잔여 위험

- `/tmp/crop-0.1.1-cws.zip`은 로컬 package 산출물이다. GitHub Release asset upload와 Chrome Web Store upload는 아직 수행하지 않았다.
- `v0.1.1` tag와 GitHub Release가 아직 없으므로 release asset URL과 tag 기반 privacy URL은 후보 URL이다.
- `devel -> main` release PR 생성 전 Stage 4에서 main 전용 README asset 보존 여부를 다시 확인해야 한다.

## 다음 단계 영향

- Stage 4는 release PR 준비 상태를 최종 정리하고, `main` merge, tag/GitHub Release 생성, Chrome Web Store 제출이 별도 승인 항목임을 보고서에 분리한다.
- Stage 4에서 최종 보고서와 release PR 게시 준비 여부를 정리하되, 실제 `devel -> main` PR 생성은 별도 명시 승인 전 수행하지 않는다.

## 승인 요청

- Stage 3 산출물과 package 검증 결과를 승인하면 Stage 4 최종 release PR 준비 보고로 진행한다.
