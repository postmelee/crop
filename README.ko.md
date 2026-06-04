# crop

언어: [English](README.md) | 한국어 | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

`crop`은 정밀한 페이지 스크린샷을 찍기 위한 Chrome Manifest V3 확장입니다. 오버레이를 열고, 페이지 요소를 선택하거나 원하는 영역을 직접 그린 뒤, 결과 PNG를 복사하거나 저장할 수 있습니다.

배포 상태: `crop`은 Chrome Web Store 배포 준비 중이며 아직 Chrome Web Store에 등록되어 있지 않습니다. 현재는 로컬에서 확장을 빌드한 뒤 생성된 `dist/` 폴더를 압축 해제된 확장 프로그램으로 로드합니다.

## crop 기능

- 확장 프로그램 아이콘 또는 `Ctrl+Shift+S` 단축키(macOS에서는 `Command+Shift+S`)로 열 수 있습니다.
- 현재 탭 위에 페이지 오버레이를 표시합니다.
- 포인터를 움직이면 DOM 요소를 하이라이트합니다.
- 요소를 클릭하거나, 사용자 지정 영역을 드래그하거나, 선택 영역을 캡처 전에 크기 조정/이동할 수 있습니다.
- 선택한 PNG를 시스템 클립보드에 복사하거나 PNG 파일로 다운로드합니다.
- 현재 보이는 뷰포트를 직접 캡처합니다.
- 보이는 뷰포트 캡처를 스크롤하며 이어 붙여 현재 최상위 문서를 전체 페이지 PNG로 캡처합니다.
- Chrome이 콘텐츠 스크립트의 iframe 문서 접근을 허용하는 경우 동일 출처(same-origin) 및 `srcdoc` iframe 요소 선택을 지원합니다.
- 현재 뷰포트 밖으로 이어지는 선택 영역은 스크롤과 stitching으로 선택한 페이지 영역 전체를 캡처합니다.

## 소스에서 로드

요구사항:

- Node.js 20 이상
- npm
- 압축 해제된 확장 프로그램을 로드할 수 있는 Google Chrome 또는 다른 Chromium 브라우저

확장 빌드:

```bash
npm install
npm run build
```

Chrome에 로드:

1. `chrome://extensions`를 여세요.
2. Developer mode를 켜세요.
3. Load unpacked를 클릭하세요.
4. 이 저장소의 `dist/` 폴더를 선택하세요.
5. 일반 웹 페이지를 열고 `crop` 확장 프로그램 아이콘을 클릭하세요.

제안 단축키가 기존 브라우저 또는 운영체제 단축키와 충돌하면 Chrome이 단축키를 비워 둘 수 있습니다. 확장 단축키는 `chrome://extensions/shortcuts`에서 확인할 수 있습니다.

## 기본 사용법

1. 일반 웹 페이지를 여세요.
2. `crop` 확장 프로그램 아이콘을 클릭하거나 `Ctrl+Shift+S`를 누르세요. macOS에서는 `Command+Shift+S`를 사용하세요.
3. 캡처 흐름 중 하나를 선택하세요.
   - 요소 위로 이동한 뒤 클릭해서 선택하세요.
   - 드래그해서 사용자 지정 영역을 그리세요.
   - `보이는 영역 선택` 버튼으로 현재 뷰포트를 캡처하세요.
   - `전체 페이지 선택` 버튼으로 현재 최상위 문서를 캡처하세요.
4. 필요하면 선택 영역을 조정하세요.
5. Copy를 클릭해 PNG를 클립보드에 쓰거나 Save를 클릭해 PNG를 다운로드하세요.
6. 캡처하지 않고 닫으려면 Escape를 누르거나 Cancel을 사용하세요.

## 권한

`crop`은 다음 Chrome 확장 권한(permissions)을 사용합니다.

| 권한 | 필요한 이유 |
|---|---|
| `activeTab` | 사용자가 확장을 실행한 뒤 현재 탭에 임시 접근 권한을 부여합니다. |
| `scripting` | 활성 탭에 오버레이 콘텐츠 스크립트를 주입합니다. |
| `clipboardWrite` | Copy가 생성한 PNG를 클립보드에 쓸 수 있게 합니다. |
| `downloads` | Save가 생성한 PNG 파일을 다운로드할 수 있게 합니다. |

이 확장은 `debugger`, `<all_urls>`, 광범위한 host permissions 또는 `host_permissions`를 요청하지 않습니다.

## 개인정보

스크린샷은 브라우저 안에서 로컬 처리(local processing)됩니다. `crop`은 스크린샷을 업로드하지 않고, 페이지 데이터를 서버로 보내지 않으며, telemetry를 포함하지 않습니다.

이미지는 사용자가 명시적으로 Copy 또는 Save를 사용할 때만 페이지 밖으로 나갑니다.

- Copy는 PNG를 시스템 클립보드에 씁니다.
- Save는 Chrome에 PNG 파일 다운로드를 요청합니다.

전체 정책은 [Privacy Policy](PRIVACY.md)를 참고하세요.

## 현재 제한사항

- Chrome은 `chrome://` 페이지와 Chrome Web Store 페이지 같은 제한 페이지에서 확장 주입을 막습니다.
- cross-origin iframe 내용은 콘텐츠 스크립트에서 검사할 수 없습니다. `crop`은 동일 출처(same-origin) 및 `srcdoc` iframe 문서를 처리할 수 있지만, cross-origin iframe 문서 내부 선택은 지원하지 않습니다.
- closed shadow DOM 내부에는 접근할 수 없습니다.
- 전체 페이지 캡처는 현재 최상위 문서를 대상으로 합니다. cross-origin iframe 문서를 별도의 전체 페이지로 stitching하지 않습니다.
- 전체 페이지 캡처는 `chrome.tabs.captureVisibleTab()`과 scroll stitching을 사용합니다. lazy loading, animation, sticky layout 변화, 큰 canvas 크기가 있는 동적 페이지에서는 결과가 불완전하거나 명시적인 크기 오류가 날 수 있습니다.
- fixed/sticky page chrome은 stitched capture 중 별도 처리가 필요할 수 있습니다. `crop`은 반복되는 fixed/sticky 요소를 가능한 한 줄이지만 privileged browser-native screenshot API는 사용하지 않습니다.

## 개발

유용한 명령:

```bash
npm run build
npm run typecheck
npm test
```

소스 manifest는 `manifest.json`입니다. 빌드 후 Chrome에 로드할 대상은 `dist/`입니다.

저장소 구조:

- `src/background/`: Chrome extension service worker.
- `src/content/`: 주입되는 콘텐츠 스크립트 진입점.
- `src/content/overlay/`: Shadow DOM overlay UI와 캡처 흐름.
- `src/shared/`: message, geometry, crop, filename, clipboard helper.
- `src/firefox-derived/`: Mozilla Firefox Screenshots에서 각색한 MPL-2.0 적용 source.
- `tests/`: unit 및 regression tests.
- `mydocs/`: Hyper-Waterfall 계획, 보고서, 기술 노트, task history.

이 저장소는 Hyper-Waterfall workflow를 따릅니다. 추적되는 작업은 GitHub Issue에서 시작해 작업 브랜치, 오늘할일, 수행계획서, 구현계획서, 단계 보고서, 최종 보고서, pull request 순서로 진행됩니다.

## 출처와 라이선스

제품명은 `crop`입니다.

`crop`은 Mozilla 또는 Firefox와 제휴, 보증, 후원 관계가 아닙니다. Mozilla와 Firefox 이름은 사실에 기반한 출처 표기, license notices, technical references에만 사용합니다.

새 프로젝트 코드는 MIT License 배포를 의도합니다. `LICENSE`를 참고하세요.

Mozilla Firefox Screenshots source에서 각색한 파일은 `src/firefox-derived/` 아래에 두며 Mozilla Public License 2.0 notice를 유지합니다. 자세한 내용은 `LICENSE-MPL-2.0`, `NOTICE`, `THIRD_PARTY.md`를 참고하세요.
