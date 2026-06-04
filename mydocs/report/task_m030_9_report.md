# Task #9 최종 보고서 - Chrome Web Store 배포 준비

GitHub Issue: [#9](https://github.com/postmelee/crop/issues/9)
마일스톤: M030

## 작업 요약

- 대상 이슈: #9
- 마일스톤: M030
- 단계 수: 5개 Stage + 2개 아이콘 보정 하위 단계
- 작업 목적: `crop` 0.1.0을 Chrome Web Store 제출 준비 상태로 만들기 위해 정책/문구/privacy/package/icon asset을 정리하고 실제 제출 전 blocker를 분리한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `PRIVACY.md` | Chrome Web Store용 privacy policy 후보 작성 | 사용자-facing privacy policy, Store privacy policy URL 후보 |
| `README.md`, `README.ko.md`, `README.zh-CN.md`, `README.ja.md` | privacy policy 링크 추가 | README family의 privacy 안내 |
| `manifest.json` | `icons`와 `action.default_icon` 추가 | Chrome extension metadata와 toolbar/action icon |
| `public/icons/crop-{16,32,48,128}.png` | 사용자 제공 dark icon 기반 extension icon set 추가 | manifest icon, Store icon 후보 |
| `tests/manifest.test.ts` | manifest icon metadata와 icon file 존재 검증 추가 | manifest 회귀 테스트 |
| `mydocs/plans/task_m030_9.md` | 수행 계획서 작성 및 fresh zip 생성 절차 보정 | 작업 계획 기록 |
| `mydocs/plans/task_m030_9_impl.md` | Stage 1~5 구현계획서 작성 및 검증 절차 보정 | 구현 계획 기록 |
| `mydocs/tech/task_m030_9_chrome_web_store.md` | Store 정책 매핑, Store copy, privacy/permission draft, package checklist, source availability, blocker 정리 | Chrome Web Store 배포 준비 진실 원천 |
| `mydocs/working/task_m030_9_stage1.md` ~ `task_m030_9_stage5_2.md` | 단계별 완료 보고서 작성 | 단계별 검증/결정 기록 |
| `mydocs/orders/20260604.md` | #9 완료 처리 | 오늘할일 상태 |
| `mydocs/report/task_m030_9_report.md` | 최종 보고서 작성 | PR 전 최종 결과 기록 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `PRIVACY.md` | 저장소 루트 | `PRIVACY.md` | OK | 수행계획서/구현계획서의 사용자-facing privacy policy 위치와 일치 |
| Chrome Web Store 준비 노트 | `mydocs/tech/` | `mydocs/tech/task_m030_9_chrome_web_store.md` | OK | Store copy, 권한 justification, release checklist를 기술 노트에 보관 |
| 수행/구현 계획서 | `mydocs/plans/` | `mydocs/plans/task_m030_9.md`, `mydocs/plans/task_m030_9_impl.md` | OK | 문서 파일명에 milestone과 issue 포함 |
| 단계 보고서 | `mydocs/working/` | `mydocs/working/task_m030_9_stage*.md` | OK | Stage별 완료 보고서 위치와 일치 |
| 최종 보고서 | `mydocs/report/` | `mydocs/report/task_m030_9_report.md` | OK | 최종 보고서 위치와 일치 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| task commit 수 | 0 | 9개 Stage/계획 커밋 + 최종 보고 커밋 예정 |
| privacy policy | 없음 | `PRIVACY.md` 84 lines |
| Chrome Web Store 기술 노트 | 없음 | 498 lines |
| 단계 보고서 | 없음 | Stage 1~5.2 보고서 7개 |
| manifest icon metadata | 없음 | `icons`와 `action.default_icon` 4 size 연결 |
| icon asset | 없음 | 16/32/48/128 PNG 4개 |
| manifest test 수 | 3개 | 4개 |
| 전체 테스트 | 17 files, 201 tests(Stage 4 기준) | 17 files, 202 tests |
| 최신 upload zip | 16 entries(Stage 4 기준) | 13 files, uncompressed total 411,155 bytes |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| Store listing copy가 README/manifest/source behavior와 충돌하지 않는다 | OK — Stage 2 copy와 Stage 4/최종 grep에서 기능, 제한, privacy 문맥 대조 |
| single-purpose statement가 current page screenshot selection/capture 범위로 제한된다 | OK — `mydocs/tech/task_m030_9_chrome_web_store.md`에 단일 목적 문구 기록 |
| privacy policy와 Dashboard disclosure 초안이 local processing/no server/no telemetry/Copy/Save를 반영한다 | OK — `PRIVACY.md`와 Store privacy fields draft 작성, 최종 privacy grep 통과 |
| `activeTab`, `scripting`, `clipboardWrite`, `downloads` 권한 justification이 실제 사용처와 일치한다 | OK — manifest/source/Store justification 대조 완료 |
| `debugger`, `<all_urls>`, broad `host_permissions`를 추가하지 않는다 | OK — manifest와 `dist/manifest.json` 모두 4개 권한만 포함 |
| release zip root에 `manifest.json`이 존재한다 | OK — `/tmp/crop-0.1.0-cws.zip` fresh 생성 후 root `manifest.json` 확인 |
| release zip에 `_locales/{en,ko,ja,zh_CN}/messages.json`이 포함된다 | OK — zip contents에서 4개 locale 확인 |
| release zip에 `node_modules/`, `mydocs/`, repo root 개발 파일이 섞이지 않는다 | OK — 최신 zip은 runtime/package files 13개만 포함 |
| MPL source availability와 notice 상태를 Store 배포 관점에서 확인한다 | OK — `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0`, README/source boundary 검토 |
| Mozilla/Firefox는 attribution/license/technical reference 맥락에서만 언급한다 | OK — Store listing copy에는 미사용, README/NOTICE/THIRD_PARTY는 attribution/non-affiliation 문맥 |
| Store icon/manifest icon 상태를 최종 보고서에 반영한다 | OK — Stage 5.2 dark icon 기준으로 manifest icon과 Store icon blocker 해소 |
| 실제 Chrome Web Store 제출, review submit, 게시 상태 변경은 수행하지 않는다 | OK — 이번 task에서는 문서/package/icon 준비까지만 수행 |

### 단계별 검증 결과

- Stage 1: [task_m030_9_stage1.md](../working/task_m030_9_stage1.md) — 공식 문서와 현재 산출물 매핑, 권한/브랜딩 grep, asset blocker 초기 분류 통과.
- Stage 2: [task_m030_9_stage2.md](../working/task_m030_9_stage2.md) — `PRIVACY.md`, Store copy, permission/privacy draft 작성과 privacy/branding/permission grep 통과.
- Stage 3: [task_m030_9_stage3.md](../working/task_m030_9_stage3.md) — `npm run build`, zip root/package contents, source availability checklist 통과.
- Stage 4: [task_m030_9_stage4.md](../working/task_m030_9_stage4.md) — `npm run typecheck`, `npm test`, `npm run build`, 통합 권한/privacy/branding grep 통과.
- Stage 5: [task_m030_9_stage5.md](../working/task_m030_9_stage5.md) — manifest icon metadata와 PNG icon set 추가, 202 tests 통과, package icon 포함 확인.
- Stage 5.1: [task_m030_9_stage5_1.md](../working/task_m030_9_stage5_1.md) — 사용자 제공 PNG 기반 icon set 재생성과 SVG 제거, fresh zip 13 files 확인.
- Stage 5.2: [task_m030_9_stage5_2.md](../working/task_m030_9_stage5_2.md) — 사용자 제공 dark icon 기반 icon set 재생성, fresh zip 13 files/411,155 bytes 확인.

### 최종 통합 검증

| 주제 | 검증 방법 | 결과 | 근거 |
|---|---|---|---|
| TypeScript 정합성 | `npm run typecheck` | OK | `tsc --noEmit` 통과 |
| 전체 테스트 | `npm test` | OK | 17 files, 202 tests passed |
| Production build | `npm run build` | OK | Vite 21 modules transformed, `dist/manifest.json` 및 bundle 생성 |
| Icon file 형식 | `file public/icons/crop-*.png` | OK | 16/32/48/128 PNG 모두 8-bit RGBA |
| Package contents | fresh write zip + `unzip -l` | OK | 13 files, root `manifest.json`, `_locales/*`, `icons/crop-*.png` 포함 |
| 권한 회귀 | 권한 grep | OK | manifest/dist manifest 요청 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads` |
| Privacy/branding 문맥 | privacy/branding grep | OK | no server upload, no telemetry, local processing, Mozilla/Firefox attribution/non-affiliation 문맥 확인 |
| Diff 상태 | `git diff --check`, `git status --short` | OK | final report 작성 전 clean 상태에서 통과 |

## 잔여 위험과 후속 작업

### 잔여 위험

- Store screenshot은 아직 없다. 실제 제출 전 1280x800 또는 640x400 screenshot 제작이 필요하다.
- Small promotional image는 아직 없다. 실제 제출 전 440x280 PNG/JPEG 제작이 필요하다.
- Store Dashboard 입력, zip upload, review submit, category/Homepage/Support URL/privacy policy URL 확정은 이번 task 범위 밖이다.
- 실제 Chrome extension 수동 smoke는 제출 직전 수행해야 한다. 특히 `dist/` unpacked load, action/shortcut, selected/visible/full-page Copy/Save, restricted page, cross-origin iframe 제한을 확인해야 한다.
- 최신 package는 source map을 포함한다. 현 task에서는 포함 정책으로 문서화했지만 제출 직전 최종 승인 대상이다.
- Chrome Web Store 정책과 Dashboard 화면은 바뀔 수 있으므로 실제 제출 직전 공식 문서와 Dashboard를 다시 대조해야 한다.

### 후속 작업 후보

- Chrome Web Store Developer Dashboard 입력값 확정 및 제출 체크리스트 신규 이슈 등록.
- Store screenshot 1280x800 또는 640x400 제작.
- Small promotional image 440x280 제작.
- localized Store listing copy와 localized screenshots 작성.
- optional marquee promotional image와 promo video 필요 여부 확인.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
