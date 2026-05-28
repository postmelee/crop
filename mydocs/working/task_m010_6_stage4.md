# Task #6 Stage 4 보고서

GitHub Issue: [#6](https://github.com/postmelee/crop/issues/6)
구현계획서: [`task_m010_6_impl.md`](../plans/task_m010_6_impl.md)
Stage: 4

## 단계 목적

Stage 3에서 연결한 visible viewport capture/crop pipeline을 실제 Chrome extension smoke로 확인한다. 특히 Copy 버튼 클릭 후 crop result가 생성되는지, selected rect가 viewport 기준 pixel 크기로 변환되는지, overlay를 숨긴 뒤 capture가 복구 가능한 상태로 돌아오는지 확인한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/working/task_m010_6_stage4.md` | Stage 4 자동/수동 smoke 결과, 검증 한계, 후속 #7 영향 기록 |
| `mydocs/orders/20260528.md` | #6 Stage 4 완료 상태 반영 |

## 본문 변경 정도 / 본문 무손실 여부

문서 작업만 수행했다. Stage 4에서는 소스 코드를 변경하지 않았고, Stage 3의 capture/crop pipeline 구현을 그대로 검증했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm run test
rg "captureVisibleTab|hide|restore|naturalWidth|naturalHeight|viewport" src README.md mydocs
git diff --check
```

결과:

- OK — `npm run build`: `dist/background/service-worker.js`, `dist/content/inject.js`, `dist/manifest.json` 생성 성공
- OK — `npm run typecheck`: `tsc --noEmit` 성공
- OK — `npm run test`: Vitest 8개 test file, 67개 test 통과
- OK — grep: `captureVisibleTab`, overlay hide/capture restore 경로, natural image size와 viewport scale helper 확인
- OK — `git diff --check`: whitespace 경고 없음

수동 smoke 결과:

- OK — 작업지시자 Chrome 수동 smoke에서 `Copy` 클릭 후 `data-crop-capture-status`가 `ok`로 설정됨
- OK — crop result metadata: `width = 640`, `height = 360`
- OK — `data-crop-capture-error` 없음
- OK — overlay는 Copy 이후에도 페이지 위에 남아 재시도 가능한 상태로 복구됨

자동 smoke 시도:

- MISS — 새 Chrome 프로필 + CDP 기반 자동 smoke는 extension command/`activeTab` 주입 제약 때문에 안정적으로 완료하지 못했다.
- 세부 원인: CDP `Input.dispatchKeyEvent`와 macOS key event가 새 프로필의 extension command를 안정적으로 트리거하지 못했고, service worker fallback은 사용자 제스처 없이 `chrome.scripting.executeScript` 권한을 얻지 못했다.
- 대응: 실제 사용자의 로드된 Chrome 확장 환경에서 수동 smoke를 수행했고, 결과를 본 보고서에 수용 기준 근거로 기록했다.

## 잔여 위험

- Stage 4는 crop result metadata까지 확인했다. 실제 clipboard write, file download, 완료 toast는 #7 범위라 아직 구현하지 않았다.
- 자동 extension E2E smoke는 현재 도구 제약이 있으므로, #7에서는 가능하면 사용자의 기존 Chrome 프로필 수동 smoke 절차를 README와 최종 보고서에 명확히 유지해야 한다.

## 다음 단계 영향

- Stage 5는 README와 최종 보고서에서 Copy/Save가 crop backend까지 연결되었고, 실제 clipboard/download/toast는 #7 범위임을 명확히 기록한다.
- 후속 #7에서는 Copy 성공 시 overlay를 닫고, 우측 상단에 완료 toast를 표시하는 UX를 clipboard write 성공 이후에 연결할 수 있다.

## 승인 요청

- Stage 4 산출물과 검증 결과를 승인하면 Stage 5로 진행한다.
