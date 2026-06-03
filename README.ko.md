# crop

언어: [English](README.md) | Korean | [Simplified Chinese](README.zh-CN.md) | [Japanese](README.ja.md)

`crop`은 정밀한 페이지 스크린샷을 찍기 위한 Chrome Manifest V3 확장이다. 오버레이를 열고, 페이지 요소를 선택하거나 원하는 영역을 직접 그린 뒤, 결과 PNG를 복사하거나 저장할 수 있다.

배포 상태: `crop`은 Chrome Web Store 배포 준비 중이며 아직 Chrome Web Store에 등록되어 있지 않다. 현재는 로컬에서 확장을 빌드한 뒤 생성된 `dist/` 폴더를 unpacked extension으로 로드한다.

## crop 기능

- 확장 action icon 또는 `Ctrl+Shift+S` 단축키(macOS에서는 `Command+Shift+S`)로 열린다.
- 현재 탭 위에 페이지 오버레이를 표시한다.
- 포인터를 움직이면 DOM 요소를 하이라이트한다.
- 요소를 클릭하거나, 사용자 지정 영역을 드래그하거나, 선택 영역을 캡처 전에 크기 조정/이동할 수 있다.
- 선택한 PNG를 시스템 클립보드에 복사하거나 PNG 파일로 다운로드한다.
- 현재 보이는 viewport를 직접 캡처한다.
- 보이는 viewport 캡처를 스크롤하며 이어 붙여 현재 top-level document를 full-page PNG로 캡처한다.
- Chrome이 content script의 iframe document 접근을 허용하는 경우 same-origin 및 `srcdoc` iframe 요소 선택을 지원한다.
- 현재 viewport 밖으로 이어지는 선택 영역은 스크롤과 stitching으로 선택한 page rectangle 전체를 캡처한다.

## 소스에서 로드

요구사항:

- Node.js 20 이상
- npm
- unpacked extension을 로드할 수 있는 Google Chrome 또는 다른 Chromium 브라우저

확장 빌드:

```bash
npm install
npm run build
```

Chrome에 로드:

1. `chrome://extensions`를 연다.
2. Developer mode를 켠다.
3. Load unpacked를 클릭한다.
4. 이 저장소의 `dist/` 폴더를 선택한다.
5. 일반 웹 페이지를 열고 `crop` action icon을 클릭한다.

제안 단축키가 기존 브라우저 또는 운영체제 단축키와 충돌하면 Chrome이 단축키를 비워 둘 수 있다. 확장 단축키는 `chrome://extensions/shortcuts`에서 확인할 수 있다.

## 기본 사용법

1. 일반 웹 페이지를 연다.
2. `crop` action icon을 클릭하거나 `Ctrl+Shift+S`를 누른다. macOS에서는 `Command+Shift+S`를 사용한다.
3. 캡처 흐름 중 하나를 선택한다.
   - 요소 위로 이동한 뒤 클릭해서 선택한다.
   - 드래그해서 사용자 지정 영역을 그린다.
   - visible-page 버튼으로 현재 viewport를 캡처한다.
   - full-page 버튼으로 현재 top-level document를 캡처한다.
4. 필요하면 선택 영역을 조정한다.
5. Copy를 클릭해 PNG를 클립보드에 쓰거나 Save를 클릭해 PNG를 다운로드한다.
6. 캡처하지 않고 닫으려면 Escape를 누르거나 Cancel을 사용한다.

## 권한

`crop`은 다음 Chrome extension permissions를 사용한다.

| 권한 | 필요한 이유 |
|---|---|
| `activeTab` | 사용자가 확장을 실행한 뒤 현재 탭에 임시 접근 권한을 준다. |
| `scripting` | 활성 탭에 오버레이 content script를 주입한다. |
| `clipboardWrite` | Copy가 생성한 PNG를 클립보드에 쓸 수 있게 한다. |
| `downloads` | Save가 생성한 PNG 파일을 다운로드할 수 있게 한다. |

이 확장은 `debugger`, `<all_urls>`, broad host permissions 또는 `host_permissions`를 요청하지 않는다.

## 개인정보

스크린샷은 브라우저 안에서 로컬 처리(local processing)된다. `crop`은 스크린샷을 업로드하지 않고, 페이지 데이터를 server로 보내지 않으며, telemetry를 포함하지 않는다.

이미지는 사용자가 명시적으로 Copy 또는 Save를 사용할 때만 페이지 밖으로 나간다.

- Copy는 PNG를 시스템 클립보드에 쓴다.
- Save는 Chrome에 PNG 파일 다운로드를 요청한다.

## 현재 제한사항

- Chrome은 `chrome://` 페이지와 Chrome Web Store 페이지 같은 제한 페이지에서 확장 주입을 막는다.
- cross-origin iframe 내용은 content script에서 검사할 수 없다. `crop`은 same-origin 및 `srcdoc` iframe document를 처리할 수 있지만, cross-origin iframe document 내부 선택은 지원하지 않는다.
- closed shadow DOM 내부에는 접근할 수 없다.
- full-page capture는 현재 top-level document를 대상으로 한다. cross-origin iframe document를 별도 full page로 stitching하지 않는다.
- full-page capture는 `chrome.tabs.captureVisibleTab()`과 scroll stitching을 사용한다. lazy loading, animation, sticky layout 변화, 큰 canvas 크기가 있는 동적 페이지에서는 결과가 불완전하거나 명시적인 크기 오류가 날 수 있다.
- fixed/sticky page chrome은 stitched capture 중 별도 처리가 필요할 수 있다. `crop`은 반복되는 fixed/sticky 요소를 가능한 한 줄이지만 privileged browser-native screenshot API는 사용하지 않는다.

## 개발

유용한 명령:

```bash
npm run build
npm run typecheck
npm test
```

source manifest는 `manifest.json`이다. 빌드 후 Chrome에 로드할 대상은 `dist/`다.

저장소 구조:

- `src/background/`: Chrome extension service worker.
- `src/content/`: injected content script entrypoint.
- `src/content/overlay/`: Shadow DOM overlay UI와 capture orchestration.
- `src/shared/`: message, geometry, crop, filename, clipboard helper.
- `src/firefox-derived/`: Mozilla Firefox Screenshots에서 각색한 MPL-2.0 적용 source.
- `tests/`: unit 및 regression tests.
- `mydocs/`: Hyper-Waterfall 계획, 보고서, 기술 노트, task history.

이 저장소는 Hyper-Waterfall workflow를 따른다. 추적되는 작업은 GitHub Issue에서 시작해 task branch, daily order, plan, implementation plan, stage report, final report, pull request 순서로 진행된다.

## 출처와 라이선스

제품명은 `crop`이다.

`crop`은 Mozilla 또는 Firefox와 affiliated, endorsed, sponsored 관계가 아니다. Mozilla와 Firefox 이름은 사실에 기반한 source attribution, license notices, technical references에만 사용한다.

새 프로젝트 코드는 MIT License 배포를 의도한다. `LICENSE`를 참고한다.

Mozilla Firefox Screenshots source에서 각색한 파일은 `src/firefox-derived/` 아래에 두며 Mozilla Public License 2.0 notice를 유지한다. 자세한 내용은 `LICENSE-MPL-2.0`, `NOTICE`, `THIRD_PARTY.md`를 참고한다.
