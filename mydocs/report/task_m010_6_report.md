# Task #6 최종 보고서

GitHub Issue: [#6](https://github.com/postmelee/crop/issues/6)
마일스톤: M010

## 작업 요약

- 대상 이슈: #6
- 마일스톤: M010
- 단계 수: 5
- 작업 목적: selected rectangle을 visible viewport PNG capture 결과로 crop하는 내부 backend를 구현한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `src/shared/messages.ts` | capture request/response type, request factory, request/response guard 추가 | content-background runtime message contract |
| `src/background/service-worker.ts` | `runtime.onMessage` capture handler와 `chrome.tabs.captureVisibleTab()` 호출 추가 | Chrome MV3 background API boundary |
| `src/shared/rect.ts` | rect normalize/intersection, page/viewport projection, visible viewport clipping helper 추가 | crop geometry 순수 helper |
| `src/shared/crop-image.ts` | viewport crop rect를 screenshot source rect로 변환하고 data URL을 canvas crop하는 helper 추가 | capture image crop backend |
| `src/content/overlay/crop-overlay.ts` | Copy/Save action에서 overlay 숨김, capture request, viewport clipping, PNG crop pipeline 연결 | overlay selected action runtime |
| `tests/shared/rect.test.ts` | rect projection/clipping 테스트 추가 | geometry regression guard |
| `tests/shared/crop-image.test.ts` | image scale/source rect, DPR 비의존, 80/100/125/150% zoom-like ratio 테스트 추가 | crop scale regression guard |
| `tests/shared/messages.test.ts` | capture message contract 테스트 추가 | message contract regression guard |
| `README.md` | 개발 상태와 Chrome unpacked smoke 기대 결과를 capture backend 기준으로 갱신 | 기여자 로컬 실행 문서 |
| `mydocs/working/task_m010_6_stage*.md` | Stage 1~4 단계 보고서 작성 | Hyper-Waterfall 단계 기록 |
| `mydocs/orders/20260528.md` | #6 완료 상태 반영 | 오늘할일 보드 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `README.md` | 루트 `README.md` | 루트 `README.md` | OK | 수행계획서의 문서 위치 판단과 동일하게 로컬 개발/smoke 기대 결과만 갱신 |
| 공식 제품 문서 루트 | 해당 없음 | 해당 없음 | OK | 이번 task에서 `docs/`, `specs/`, `site/`, `website/`, `adr` 같은 공식 제품 문서 루트를 만들지 않음 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| Vitest test files | 7 | 8 |
| Vitest tests | 65 | 67 |
| 수동 smoke crop metadata | 없음 | `status=ok`, `width=640`, `height=360` |
| Chrome MV3 권한 | `activeTab`, `scripting`, `clipboardWrite` | 변경 없음 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| selected 영역을 PNG data output으로 crop할 수 있다 | OK — 수동 smoke에서 Copy 후 `data-crop-capture-status=ok`, `width=640`, `height=360` 확인 |
| capture 전 overlay가 숨겨지고 실패/성공 후 복구된다 | OK — Stage 3 `captureVisibleTabWithoutOverlay()`의 `visibility=hidden` + `finally` 복구 구현, Stage 4에서 Copy 후 overlay 재시도 가능 상태 확인 |
| HiDPI/zoom 좌표는 screenshot natural size와 viewport CSS size 비율로 계산된다 | OK — 80/100/125/150% zoom-like ratio fixture 포함 `tests/shared/crop-image.test.ts` 통과 |
| selected rect가 viewport 밖으로 이어지면 visible intersection만 crop된다 | OK — `clipPageRectToViewport()`와 `getSourceCropRect()` 테스트 통과 |
| background가 `chrome.tabs.captureVisibleTab()`으로 visible viewport를 캡처한다 | OK — Stage 1 build/typecheck/grep 통과, Stage 4 수동 smoke에서 실제 capture result metadata 확인 |
| Clipboard write와 file download는 실행되지 않는다 | OK — Copy/Save는 crop result 생성까지만 수행하고 clipboard/download/toast는 #7로 유지 |
| `debugger`와 `<all_urls>` 권한을 추가하지 않는다 | OK — `manifest.json` 권한 변경 없음 |
| `npm run build` 통과 | OK — Vite production build 성공 |
| `npm run typecheck` 통과 | OK — `tsc --noEmit` 성공 |
| `npm run test` 통과 | OK — Vitest 8개 test file, 67개 test 통과 |
| `git diff --check` 통과 | OK — whitespace 경고 없음 |

### 단계별 검증 결과

- Stage 1: [`task_m010_6_stage1.md`](../working/task_m010_6_stage1.md) — capture message protocol과 background handler 구현, build/typecheck/grep/diff 통과
- Stage 2: [`task_m010_6_stage2.md`](../working/task_m010_6_stage2.md) — crop geometry와 scale helper 구현, typecheck/test/grep/diff 통과
- Stage 3: [`task_m010_6_stage3.md`](../working/task_m010_6_stage3.md) — overlay capture pipeline 연결, build/typecheck/test/grep/diff 통과
- Stage 4: [`task_m010_6_stage4.md`](../working/task_m010_6_stage4.md) — Chrome 수동 smoke에서 crop metadata 성공 확인, 자동 smoke 한계 기록

## 잔여 위험과 후속 작업

### 잔여 위험

- 자동 Chrome extension E2E smoke는 새 프로필의 extension command와 `activeTab` 사용자 제스처 제약 때문에 안정화하지 못했다. 이번 task는 사용자의 로드된 Chrome 확장 환경에서 수동 smoke로 보완했다.
- Stage 4는 crop result metadata와 복구 상태를 확인했다. 클립보드에 기록된 실제 이미지 pixel 검증은 #7에서 clipboard write를 구현한 뒤 수행해야 한다.

### 후속 작업 후보

- #7: Copy clipboard write, Save file download, Copy 성공 후 overlay 제거와 우측 상단 완료 toast 구현
- #12: 드래그 선택 edge auto-scroll 구현
- #13: 선택 영역 resize/move handles와 keyboard 조정 구현
- #15: full page capture와 scroll stitching 구현

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
