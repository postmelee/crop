# Task #7 최종 보고서

GitHub Issue: [#7](https://github.com/postmelee/crop/issues/7)
마일스톤: M010

## 작업 요약

- 대상 이슈: #7
- 마일스톤: M010
- 단계 수: 5단계 + manual smoke 보정 2단계
- 작업 목적: #6의 visible viewport capture/crop 결과를 실제 Copy clipboard write와 Save file download 사용자 action으로 완성한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `manifest.json` | Save 안정화를 위한 `downloads` 권한 추가 | Chrome MV3 permission surface |
| `src/shared/clipboard.ts` | PNG data URL to Blob, ClipboardItem write helper 추가 | clipboard/write backend |
| `src/shared/filename.ts` | 문서 title 기반 PNG filename sanitizer 추가 | Save filename policy |
| `src/shared/messages.ts` | capture/download runtime message contract 추가 | content-background message contract |
| `src/background/service-worker.ts` | visible tab capture와 PNG download message handler 구현 | Chrome extension background API boundary |
| `src/content/overlay/crop-overlay.ts` | Copy/Save action, overlay hide lifecycle, success toast, failure fallback 연결 | overlay selected action runtime |
| `src/content/overlay/crop-template.ts` | action status 영역과 toast template 추가 | Shadow DOM UI template |
| `src/content/overlay/crop-overlay.css` | toast, action status, pending button style 추가 | Shadow DOM UI style |
| `tests/shared/clipboard.test.ts` | clipboard helper capability/error 테스트 추가 | clipboard regression guard |
| `tests/shared/filename.test.ts` | filename sanitizer edge case 테스트 추가 | filename regression guard |
| `tests/shared/messages.test.ts` | download message contract 테스트 추가 | runtime message regression guard |
| `README.md` | Phase 5 개발 상태와 Chrome unpacked smoke 기대 결과 갱신 | 기여자 로컬 실행 문서 |
| `mydocs/plans/task_m010_7.md` | Stage 4.2 권한 보정 승인 내용 반영 | Hyper-Waterfall 수행계획서 |
| `mydocs/plans/task_m010_7_impl.md` | Stage별 산출물/검증과 Stage 4.2 보정 계획 반영 | Hyper-Waterfall 구현계획서 |
| `mydocs/working/task_m010_7_stage*.md` | Stage 1~4.2 단계 보고서 작성 | Hyper-Waterfall 단계 기록 |
| `mydocs/orders/20260528.md` | #7 완료 상태 반영 | 오늘할일 보드 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | 루트 `README.md` | OK | 수행계획서의 문서 위치 판단과 동일하게 로컬 개발/smoke 기대 결과만 갱신 |
| 공식 제품 문서 루트 | 해당 없음 | 해당 없음 | OK | 이번 task에서 `docs/`, `specs/`, `site/`, `website/`, `adr` 같은 공식 제품 문서 루트를 만들지 않음 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| Vitest test files | 8 | 10 |
| Vitest tests | 67 | 80 |
| Chrome MV3 권한 | `activeTab`, `scripting`, `clipboardWrite` | `activeTab`, `scripting`, `clipboardWrite`, `downloads` |
| Copy manual smoke | crop result metadata만 확인 | clipboard paste 성공, overlay flicker 없음 |
| Save manual smoke | 미구현 또는 `<a download>` 실패 | PNG 다운로드 성공 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| selected crop PNG를 시스템 클립보드에 쓴다 | OK — 작업지시자 manual smoke에서 Copy 후 붙여넣기 성공 확인 |
| Copy 성공 후 overlay가 제거되고 우측 상단 toast가 표시된다 | OK — Stage 2 구현, Stage 4.1 이후 Copy 클릭 flicker 제거, 작업지시자 smoke 성공 |
| Save가 selected crop PNG 다운로드를 시작한다 | OK — Stage 4.2에서 `chrome.downloads.download()`로 보정 후 작업지시자 manual smoke 다운로드 성공 확인 |
| filename sanitizer가 안전한 `.png` 파일명을 만든다 | OK — `tests/shared/filename.test.ts` 6개 케이스 통과 |
| Copy 실패 시 overlay를 유지하고 Save fallback을 안내한다 | OK — Stage 4 fallback UI와 `data-crop-action-status` 구현, 자동 검증 통과 |
| Save 실패 시 overlay를 유지하고 재시도 안내를 표시한다 | OK — Stage 4 fallback UI 구현, Stage 4.2에서 background error response를 failure path로 전달 |
| Copy/Save 중복 클릭이 중복 capture/write/download를 만들지 않는다 | OK — pending guard가 clipboard/download 완료까지 유지됨 |
| 최종 PNG에 overlay/highlight/prompt/buttons/toast가 포함되지 않는다 | OK — action 전체 동안 overlay host를 `visibility=hidden`으로 유지하고 toast는 성공 후 생성 |
| visible viewport backend 범위를 유지한다 | OK — `chrome.tabs.captureVisibleTab()` 기반 유지, viewport 밖 선택은 visible intersection만 crop |
| `debugger`와 `<all_urls>` 권한을 추가하지 않는다 | OK — `manifest.json`에 해당 권한 없음, Stage 4.2에서 `downloads`만 승인 추가 |
| `npm run build` 통과 | OK — Vite production build 성공 |
| `npm run typecheck` 통과 | OK — `tsc --noEmit` 성공 |
| `npm run test` 통과 | OK — Vitest 10개 test file, 80개 test 통과 |
| `git diff --check` 통과 | OK — whitespace 경고 없음 |

### 단계별 검증 결과

- Stage 1: [`task_m010_7_stage1.md`](../working/task_m010_7_stage1.md) — clipboard helper와 filename sanitizer 구현, typecheck/test/grep/diff 통과
- Stage 2: [`task_m010_7_stage2.md`](../working/task_m010_7_stage2.md) — Copy 성공 흐름과 toast 구현, build/typecheck/test/diff 통과
- Stage 3: [`task_m010_7_stage3.md`](../working/task_m010_7_stage3.md) — 최초 Save 다운로드 흐름 구현, build/typecheck/test/diff 통과
- Stage 4: [`task_m010_7_stage4.md`](../working/task_m010_7_stage4.md) — 실패 fallback UX와 manual smoke 절차 정리, build/typecheck/test/diff 통과
- Stage 4.1: [`task_m010_7_stage4_1.md`](../working/task_m010_7_stage4_1.md) — Copy flicker 제거와 data URL Save 보정, build/typecheck/test/diff 통과
- Stage 4.2: [`task_m010_7_stage4_2.md`](../working/task_m010_7_stage4_2.md) — `downloads` 권한과 background download API 보정, build/typecheck/test/diff 통과

## 잔여 위험과 후속 작업

### 잔여 위험

- 자동 Chrome extension E2E smoke는 사용자의 로드된 Chrome 확장 환경과 다운로드 폴더 접근 제약 때문에 수동 smoke로 보완했다.
- Save는 visible viewport crop PNG data URL을 `chrome.downloads.download()`로 전달한다. full page/scroll stitching처럼 이미지가 커지는 후속 범위에서는 별도 backend 검토가 필요할 수 있다.
- viewport 밖까지 이어지는 선택 테두리는 page-coordinate 기준으로 표시되지만 실제 PNG는 현재 visible viewport intersection만 포함한다. 이는 MVP backend 범위와 일치한다.

### 후속 작업 후보

- #12: 드래그 선택 edge auto-scroll 구현
- #13: 선택 영역 resize/move handles와 keyboard 조정 구현
- #15: full page capture와 scroll stitching 구현
- iframe/nested context 내부 선택 고도화 후속 이슈

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
