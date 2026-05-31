# crop

`crop`은 Chrome MV3 확장 프로젝트다. 목표 MVP는 사용자가 확장 아이콘 또는 단축키로 오버레이를 열고, DOM 요소를 선택해 visible viewport 안의 PNG를 복사하거나 저장하는 가벼운 스크린샷 UX를 제공하는 것이다.

## MVP 방향

MVP 포함 범위:

- Chrome Manifest V3 확장
- action icon과 keyboard command 진입점
- Shadow DOM 기반 overlay UI
- DOM 요소 hover 하이라이트
- 선택 영역 Copy, Save, Cancel 동작
- visible viewport 캡처
- `activeTab`, `scripting`, `clipboardWrite`, `downloads` 권한 전략

MVP 제외 범위:

- full page capture
- scroll stitching
- `debugger` 권한
- `<all_urls>` host 권한
- telemetry 또는 server upload

## 저장소 운영 방식

이 저장소는 Hyper-Waterfall을 따른다. 작업은 GitHub Issue, task branch, 오늘할일, 수행계획서, 구현계획서, 단계 보고서, 최종 보고서, PR 단위로 추적한다.

주요 로컬 참조:

- `AGENTS.md`: 코딩 에이전트용 저장소 규칙
- `mydocs/manual/`: Hyper-Waterfall 매뉴얼
- `mydocs/plans/`: 수행계획서와 구현계획서
- `mydocs/working/`: 단계 보고서
- `mydocs/report/`: 최종 보고서

## 개발 상태

M020 #14 기준으로 Chrome MV3 shell, Firefox식 overlay UI, visible viewport capture/crop backend, Copy/Save 사용자 action, selected region 조정 UX, same-origin iframe 요소 선택 기반이 준비됐다.

- `manifest.json` source manifest
- Vite 기반 `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` 산출
- background service worker의 action icon/`open-crop` command 주입 흐름
- content script의 `__crop_root__` Shadow DOM overlay
- 중복 실행 방지와 Escape/Cancel 제거 동작
- Firefox식 top-right mode toolbar와 중앙 preview prompt
- Firefox-derived preview face SVG와 visible/full page menu icon
- pointer 위치를 따라 움직이는 preview face 눈동자
- Firefox식 overlay crosshair cursor와 drag 중 grabbing cursor
- Firefox 원본에 가까운 prompt 중앙 배치와 compact mode toolbar 보정
- Firefox-derived helper 기반 DOM 요소 hover highlight
- same-origin/srcdoc iframe 내부 요소 hover/click selection과 parent viewport 좌표 변환
- page-coordinate 기반 hover/click/drag selection과 window scroll-follow highlight
- Firefox식 viewport+100 감지 기준을 적용한 large element hover 보정
- 클릭 기반 selected rectangle 고정
- pointer drag 기반 임의 영역 selection
- drag selection 중 viewport edge 근처 pointer 유지 시 vertical/horizontal edge auto-scroll
- edge auto-scroll 중 page-coordinate selected rectangle 갱신과 pointerup/Escape/Cancel cleanup
- selected rectangle 기준 Copy/Save/Cancel buttons 표시
- selected rectangle의 8방향 resize handle과 내부 drag move interaction
- selected rectangle의 Arrow/Shift/Alt keyboard move/resize 조정
- selected rectangle 내부 `width x height` size badge 표시
- Firefox식 selected action buttons 위치, 순서, 원본 icon, focus ring, primary/secondary styling
- Copy/Save buttons에서 capture/crop backend 호출
- background service worker의 `chrome.tabs.captureVisibleTab()` 기반 visible viewport PNG capture
- background service worker의 `chrome.downloads.download()` 기반 PNG Save
- selected page-coordinate rectangle을 visible viewport intersection으로 변환하는 crop geometry helper
- screenshot natural size와 viewport CSS size 비율 기반 source crop rect 계산
- capture 직전 overlay host 숨김과 capture 이후 복구
- PNG data URL to Blob helper와 ClipboardItem 기반 Copy
- 문서 title 기반 PNG filename sanitizer
- Copy 성공 후 overlay 제거와 우측 상단 완료 toast
- Save 성공 후 overlay 제거와 다운로드 시작, Save 완료 toast 미표시
- Copy 실패 시 overlay 유지와 Save fallback 안내
- Save 실패 시 overlay 유지와 재시도 안내
- selected rectangle 밖 클릭 시 idle overlay/prompt 상태 복귀
- 중복 실행 시 mode toolbar one-shot flash와 반복 flash debounce

아직 구현하지 않은 후속 범위:

- #15 full page capture와 scroll stitching

현재 제한:

- 현재 버전은 `chrome.tabs.captureVisibleTab()` 기반 visible viewport 캡처만 저장한다.
- 화면 밖으로 이어지는 요소를 선택할 수 있어도 실제 Copy/Save PNG는 화면에 보이는 viewport 교차 영역만 포함한다.
- same-origin/srcdoc iframe 내부 요소 선택은 지원하지만, cross-origin iframe 내부와 closed shadow DOM 내부 선택은 Chrome MV3 권한 경계 때문에 boundary fallback 또는 제한으로 처리된다.
- full page capture는 후속 작업 범위다.

## 로컬 개발

필수 환경:

- Node.js 20 이상
- npm

의존성 설치:

```bash
npm install
```

빌드와 타입체크:

```bash
npm run build
npm run typecheck
```

빌드 결과는 `dist/`에 생성된다. Chrome에 로드할 대상 폴더도 `dist/`다.

## Chrome Unpacked Extension 로드

1. `npm run build`를 실행한다.
2. Chrome에서 `chrome://extensions`를 연다.
3. Developer mode를 켠다.
4. Load unpacked를 선택하고 이 저장소의 `dist/` 폴더를 지정한다.
5. 일반 웹 페이지 탭에서 `crop` action icon을 클릭한다.
6. 등록 가능한 환경에서는 `Ctrl+Shift+S`, macOS에서는 `Command+Shift+S`도 확인한다.

기대 결과:

- 현재 탭에 dark dim overlay, dashed viewport boundary, 오른쪽 위 mode toolbar가 표시된다.
- overlay 위의 기본 커서는 Firefox처럼 crosshair로 표시되고, drag selection 중에는 grabbing으로 표시된다.
- mode toolbar에는 `보이는 영역 선택`과 `전체 페이지 선택`이 보인다. `전체 페이지 선택`은 MVP 범위 밖이므로 현재 비활성 placeholder다.
- 중앙에는 영역 선택 안내 문구, Cancel button, pointer 위치에 따라 눈동자가 움직이는 preview face가 표시된다.
- 일반 DOM 요소에 마우스를 올리면 dashed hover highlight가 표시된다.
- same-origin/srcdoc iframe 내부 요소에 마우스를 올리면 parent page 좌표에 맞춰 dashed hover highlight가 표시되고, 클릭하면 selected rectangle으로 고정된다.
- viewport 밖으로 이어지는 요소와 화면보다 큰 partially visible 요소는 page 좌표 기준으로 선택되어, 선택 후 window scroll 시 테두리가 같은 문서 영역을 따라간다.
- hover highlight 상태에서 클릭하면 selected rectangle이 고정되고 Firefox식 selected action buttons가 선택 영역 우하단 기준으로 표시된다. 버튼은 Close, Copy, Save 순서와 원본 icon, focus ring, primary/secondary color 상태를 따른다.
- selected rectangle에는 8방향 resize handle, 내부 move surface, 중앙 `width x height` size badge가 표시된다.
- selected rectangle 내부를 드래그하면 선택 영역이 이동하고, 모서리/변 handle을 드래그하면 선택 영역 크기가 조정된다.
- selected 상태에서 Arrow는 1px 이동, Shift+Arrow는 10px 이동, Alt/Option+Arrow는 해당 edge 1px resize, Alt/Option+Shift+Arrow는 10px resize로 동작한다.
- selected rectangle 밖을 클릭하면 선택이 해제되고 중앙 prompt와 mode toolbar가 다시 보이며, 같은 클릭으로 새 선택이 즉시 발생하지 않는다.
- 마우스를 누른 채 40px 이상 드래그하면 임의 영역 selected rectangle이 생성되고 Copy/Save/Cancel buttons가 표시된다.
- 드래그 중 pointer를 viewport 위/아래/좌/우 edge 근처에 유지하면 페이지가 자동 스크롤되고 선택 영역이 문서 좌표 기준으로 계속 확장된다.
- edge auto-scroll은 pointerup, Escape, Cancel, overlay 제거 시 중단된다.
- Copy/Save buttons는 capture/crop backend를 호출하고 crop output width/height metadata를 내부 action 결과로 기록한다.
- Copy를 클릭하면 selected crop PNG가 시스템 클립보드에 기록되고 overlay가 제거된다. 이미지 붙여넣기가 가능한 앱이나 웹 입력면에서 paste할 수 있다.
- Save를 클릭하면 selected crop PNG가 다운로드된다. 파일명은 문서 title을 기반으로 안전하게 sanitize되고, 중복 파일은 Chrome 다운로드 동작에 따라 고유 이름으로 저장된다.
- Copy 성공 후 우측 상단에 `crop` 완료 toast가 표시되고, toast host에는 smoke용 action/width/height metadata가 기록된다. Save 성공은 다운로드만 시작하고 완료 toast를 표시하지 않는다.
- Copy 실패 시 overlay가 유지되고 Save fallback 안내가 표시된다. Save 실패 시 overlay가 유지되고 재시도 안내가 표시된다.
- 중앙 Cancel button, selected 상태의 Cancel button, 또는 Escape 키로 overlay가 제거된다.
- 처음 overlay를 열 때 mode toolbar flash가 반복되지 않는다.
- 같은 탭에서 다시 실행하면 overlay가 여러 개 쌓이지 않고 기존 mode toolbar가 한 번만 짧게 강조된다.
- `chrome://`, Chrome Web Store 같은 제한 페이지에서는 주입이 실패할 수 있으며 background console warning으로 확인한다.

## 소스 구조

초기 source boundary:

- `src/background/`: Chrome extension service worker 코드
- `src/content/`: injected content script 코드
- `src/content/overlay/`: Shadow DOM overlay UI 코드
- `src/firefox-derived/`: MPL-2.0을 유지하는 Mozilla Firefox Screenshots 유래 코드
- `src/shared/`: message, rectangle, filename, crop, clipboard 공용 helper

Firefox-derived source는 Chrome 전용 디렉터리와 섞지 않는다.

## 브랜딩

제품명은 `crop`이다.

이 프로젝트는 Mozilla 또는 Firefox와 제휴, 보증, 후원을 받지 않는다. Mozilla와 Firefox 이름은 upstream material 식별이 필요한 라이선스, attribution, 기술 출처 맥락에서만 사용한다.

## 라이선스

이 저장소의 신규 코드는 파일에 별도 표시가 없는 한 MIT License 배포를 의도한다. 자세한 내용은 `LICENSE`를 참조한다.

Mozilla Firefox Screenshots source에서 각색한 파일은 Mozilla Public License 2.0 notice를 유지하고 `src/firefox-derived/` 아래에 둔다. `LICENSE-MPL-2.0`, `NOTICE`, `THIRD_PARTY.md`를 함께 참조한다.
