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
- `activeTab`, `scripting`, `clipboardWrite` 권한 전략

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

M010 Phase 3 Stage 6 기준으로 Chrome MV3 shell과 Firefox식 overlay UI 기반이 준비됐다.

- `manifest.json` source manifest
- Vite 기반 `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js` 산출
- background service worker의 action icon/`open-crop` command 주입 흐름
- content script의 `__crop_root__` Shadow DOM overlay
- 중복 실행 방지와 Escape/Cancel 제거 동작
- Firefox식 top-right mode toolbar와 중앙 preview prompt
- Firefox-derived preview face SVG와 visible/full page menu icon
- pointer 위치를 따라 움직이는 preview face 눈동자
- Firefox-derived helper 기반 DOM 요소 hover highlight
- 클릭 기반 selected rectangle 고정
- pointer drag 기반 임의 영역 selection
- selected rectangle 기준 Copy/Save/Cancel buttons 표시

아직 구현하지 않은 후속 범위:

- visible viewport capture/crop backend
- Copy/Save button의 실제 clipboard write와 file download 동작
- capture 전 overlay 숨김과 최종 PNG 검증
- full page capture, scroll stitching, resize handles

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
6. 등록 가능한 환경에서는 `Ctrl+Shift+P`, macOS에서는 `Command+Shift+P`도 확인한다.

기대 결과:

- 현재 탭에 dark dim overlay, dashed viewport boundary, 오른쪽 위 mode toolbar가 표시된다.
- mode toolbar에는 `보이는 영역 선택`과 `전체 페이지 선택`이 보인다. `전체 페이지 선택`은 MVP 범위 밖이므로 현재 비활성 placeholder다.
- 중앙에는 영역 선택 안내 문구, Cancel button, pointer 위치에 따라 눈동자가 움직이는 preview face가 표시된다.
- 일반 DOM 요소에 마우스를 올리면 dashed hover highlight가 표시된다.
- hover highlight 상태에서 클릭하면 selected rectangle이 고정되고 Copy/Save/Cancel buttons가 선택 영역 근처에 표시된다.
- 마우스를 누른 채 40px 이상 드래그하면 임의 영역 selected rectangle이 생성되고 Copy/Save/Cancel buttons가 표시된다.
- Copy/Save buttons는 현재 UI만 표시한다. 실제 clipboard write와 file download는 후속 Phase에서 연결한다.
- 중앙 Cancel button, selected 상태의 Cancel button, 또는 Escape 키로 overlay가 제거된다.
- 같은 탭에서 다시 실행하면 overlay가 여러 개 쌓이지 않고 기존 mode toolbar가 짧게 강조된다.
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
