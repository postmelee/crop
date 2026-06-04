# Task #9 수행계획서 - Chrome Web Store 배포 준비

GitHub Issue: [#9](https://github.com/postmelee/crop/issues/9)
마일스톤: M030

## 목적

현재 `devel` 기준 `crop` 0.1.0 산출물을 Chrome Web Store 제출 직전 상태로 정리한다. Store listing, privacy disclosure, permission justification, release package 검증 절차, MPL source availability, trademark disclaimer, Store asset 준비 상태를 실제 구현과 일치하게 문서화한다.

이번 task의 결과는 Chrome Web Store Developer Dashboard에 입력할 문구와 제출 전 검증 체크리스트다. 실제 Store 제출, review submit, 게시 상태 변경은 작업지시자의 별도 승인 단계로 남긴다.

## 배경

이슈 #9는 초기에는 visible viewport MVP 배포 준비를 전제로 작성되었지만, 이후 full-page capture, selected page rectangle stitching, `downloads` 권한, README family, extension i18n이 `devel`에 병합되었다. 2026-06-04 기준 이슈 본문은 최신 상태로 갱신되었고, 사전 확인에서 `npm run typecheck`, `npm test`, `npm run build`, `git diff --check`가 통과했다.

Chrome Web Store 제출 전에는 Store listing과 Developer Dashboard privacy fields가 실제 기능, 권한, 데이터 처리 방식과 맞아야 한다. 특히 `activeTab`, `scripting`, `clipboardWrite`, `downloads` 권한은 단일 목적과 연결해 설명하고, screenshot/page data가 서버로 전송되지 않는다는 privacy 정책을 외부에서 확인 가능한 형태로 제공해야 한다.

참고 기준:

- Chrome Web Store Program Policies: <https://developer.chrome.com/docs/webstore/program-policies/policies>
- Chrome Web Store publish guide: <https://developer.chrome.com/webstore/publish>
- Chrome Web Store privacy fields guide: <https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/>
- Chrome Web Store listing guide: <https://developer.chrome.com/docs/webstore/cws-dashboard-listing>
- Chrome Web Store image guide: <https://developer.chrome.com/docs/webstore/images>
- 기존 산출물: `README.md`, `README.ko.md`, `README.zh-CN.md`, `README.ja.md`, `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0`
- 선행 보고서: `mydocs/report/task_m030_28_report.md`, `mydocs/report/task_m030_31_report.md`, `mydocs/report/task_m030_33_report.md`

## 범위

### 포함

- Chrome Web Store short description, detailed description, single-purpose statement 초안 작성
- Developer Dashboard privacy fields와 외부 privacy policy 문구 작성
- `activeTab`, `scripting`, `clipboardWrite`, `downloads` 권한 justification 작성
- 현재 제한사항 disclosure 정리: restricted page, cross-origin iframe, closed shadow DOM, dynamic/sticky/fixed layout stitching 한계
- release package 생성과 검증 절차 정리
- `_locales/en`, `_locales/ko`, `_locales/ja`, `_locales/zh_CN` package 포함 확인 절차 정리
- `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0` 기준 MPL source availability 점검
- Mozilla/Firefox trademark 및 affiliation disclaimer 점검
- Store icon, screenshot, promotional image 준비 상태와 blocker 여부 기록
- 수동 smoke checklist 작성

### 제외

- 작업지시자 별도 승인 없는 Chrome Web Store 실제 제출, 게시, review submit
- 새 캡처 기능 또는 overlay UX 대규모 변경
- `debugger`, `<all_urls>`, broad `host_permissions` 추가
- 서버 전송, telemetry, analytics, 계정, 결제 기능
- cross-origin iframe full-page capture, privileged screenshot API, browser-native scroll stitching
- Store icon/screenshot/promotional image 자체 제작. 단, asset 부재와 후속 작업 필요성 판단은 포함

## 설계 방향

- Store 문구는 README family의 현재 설명을 재사용하되 Store review 관점에 맞게 더 짧고 직접적인 문장으로 재가공한다.
- 단일 목적은 "current page screenshot selection and capture" 범위로 좁힌다. full-page stitching은 별도 제품 목적이 아니라 같은 screenshot capture 목적의 캡처 모드로 설명한다.
- privacy policy는 사용자가 외부에서 접근할 수 있는 공개 문서가 필요하므로 루트 `PRIVACY.md` 생성을 제안한다. 내용은 local processing, no server upload, no telemetry, Copy/Save 시 데이터 이동, Chrome 제한 페이지를 중심으로 둔다.
- Store listing copy, permission justification, release checklist는 Developer Dashboard 입력을 위한 작업 산출물이므로 `mydocs/tech/task_m030_9_chrome_web_store.md`에 둔다.
- release package는 `dist/`를 root로 압축하는 절차를 기준으로 문서화한다. `node_modules/`, `mydocs/`, repository root 파일이 zip에 섞이지 않도록 검증한다.
- manifest 권한은 현재 목록을 유지하고, `debugger`, `<all_urls>`, broad `host_permissions` 미요청 상태를 회귀 검증한다.
- Store asset 자체 제작은 제외하되, 현재 manifest에 `icons` 정의가 없는 점과 Chrome Web Store 필수 이미지 상태를 blocker로 명확히 남긴다.

## 문서 위치 판단

이번 task는 사용자-facing privacy policy와 Chrome Web Store 제출용 운영 문서를 만든다. 외부 공개가 필요한 privacy policy는 저장소 루트의 공식 공개 문서로 두고, Store copy/checklist는 Developer Dashboard 입력 전 작업 산출물이므로 `mydocs/tech/`에 둔다.

| 파일 | 분류 | 대상 독자 | 선택 위치 | 대안 위치 | 선택 이유 |
|---|---|---|---|---|---|
| `PRIVACY.md` | 공식 사용자 문서 | Chrome Web Store reviewer, 사용자 | 저장소 루트 | `docs/privacy.md`, README privacy 섹션 | Store privacy policy URL로 직접 연결하기 쉽고, 현재 프로젝트가 별도 `docs/` 루트를 공식 문서 위치로 채택하지 않았기 때문 |
| `mydocs/tech/task_m030_9_chrome_web_store.md` | 기술 조사/운영 산출물 | 작업지시자, maintainer, 에이전트 | `mydocs/tech/` | 저장소 루트, `docs/` | Store listing copy, 권한 justification, release checklist는 제품 문서라기보다 제출 작업 산출물이며 기존 `mydocs/tech/` 용도와 맞기 때문 |
| `README.md` 외 README family | 공식 사용자 문서 | 사용자, 기여자 | 저장소 루트 기존 위치 | 해당 없음 | Store copy와 privacy policy가 README의 기능/제한/권한 설명과 모순되지 않는지 확인하되, README 본문 변경은 최소화 |
| `NOTICE`, `THIRD_PARTY.md` | 공식 고지/라이선스 문서 | 사용자, 기여자, reviewer | 저장소 루트 기존 위치 | 해당 없음 | MPL source availability와 attribution의 기존 진실 원천이므로 위치를 유지 |
| `mydocs/plans/task_m030_9_impl.md` | 작업 산출물 | 작업지시자, 에이전트 | `mydocs/plans/` | 해당 없음 | 하이퍼-워터폴 구현계획서 표준 위치 |
| `mydocs/working/task_m030_9_stage{N}.md` | 작업 산출물 | 작업지시자, 에이전트 | `mydocs/working/` | 해당 없음 | 단계 보고서 표준 위치 |
| `mydocs/report/task_m030_9_report.md` | 작업 산출물 | 작업지시자, 에이전트 | `mydocs/report/` | 해당 없음 | 최종 보고서 표준 위치 |

## 예상 변경 파일

신규:

- `PRIVACY.md`
- `mydocs/tech/task_m030_9_chrome_web_store.md`
- `mydocs/plans/task_m030_9_impl.md`
- `mydocs/working/task_m030_9_stage1.md`
- `mydocs/working/task_m030_9_stage2.md`
- `mydocs/working/task_m030_9_stage3.md`
- `mydocs/working/task_m030_9_stage4.md`
- `mydocs/report/task_m030_9_report.md`

수정:

- `mydocs/orders/20260604.md`
- 필요 시 `README.md`, `README.ko.md`, `README.zh-CN.md`, `README.ja.md`
- 필요 시 `NOTICE`, `THIRD_PARTY.md`

이번 task 산출물:

- `mydocs/orders/20260604.md`
- `mydocs/plans/task_m030_9.md`
- `mydocs/plans/task_m030_9_impl.md`
- `mydocs/working/task_m030_9_stage{N}.md`
- `mydocs/report/task_m030_9_report.md`

## 잠정 단계

- **Stage 1 — Store 정책과 현행 산출물 매핑**
  - Chrome Web Store 정책 요구사항, 현재 README/manifest/locale/license 상태, asset 준비 상태를 대조한다.
  - `mydocs/tech/task_m030_9_chrome_web_store.md` 초안에 single-purpose, listing, privacy, permission, asset inventory 골격을 만든다.
- **Stage 2 — Privacy policy와 Store copy 작성**
  - `PRIVACY.md`를 작성하고 Store listing/privacy/permission 문구를 현재 동작과 일치하게 정리한다.
  - README family, manifest, source code와 문구가 충돌하지 않는지 grep과 수동 검토로 확인한다.
- **Stage 3 — Release package와 source availability checklist**
  - `npm run build` 후 `dist/` 압축 절차, zip contents 검증, `_locales` 포함 확인, source map 포함 정책을 정리한다.
  - `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0`의 배포 관점 고지를 점검한다.
- **Stage 4 — 통합 검증과 제출 전 blocker 정리**
  - typecheck/test/build, 권한/브랜딩/privacy grep, zip contents review를 수행한다.
  - Store asset 부재 등 실제 제출 전 blocker와 후속 승인 필요 사항을 최종 보고서에 정리한다.

## 검증 계획

### 단계별 검증

- Stage 1
  - `gh issue view 9 --repo postmelee/crop --json number,title,state,labels,milestone,body`
  - `rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" manifest.json README.md README.ko.md README.zh-CN.md README.ja.md src tests`
  - `rg -n "Mozilla|Firefox|affiliated|endorsed|sponsored|telemetry|server|privacy" README.md README.ko.md README.zh-CN.md README.ja.md NOTICE THIRD_PARTY.md`
  - `git diff --check`
- Stage 2
  - `rg -n "server|telemetry|local|clipboard|download|Chrome Web Store|privacy|permission" PRIVACY.md mydocs/tech/task_m030_9_chrome_web_store.md README.md`
  - `rg -n "Mozilla|Firefox|official|affiliated|endorsed|sponsored" PRIVACY.md mydocs/tech/task_m030_9_chrome_web_store.md README.md NOTICE THIRD_PARTY.md`
  - `git diff --check`
- Stage 3
  - `npm run build`
  - `find dist -maxdepth 3 -type f | sort`
  - `sed -n '1,220p' dist/manifest.json`
  - `(cd dist && zip -qr /tmp/crop-0.1.0-cws.zip .)`
  - `unzip -l /tmp/crop-0.1.0-cws.zip`
  - `git diff --check`
- Stage 4
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
  - `git diff --check`
  - `git status --short`

### 통합 검증

- Store listing/privacy/permission copy가 현재 README/manifest/source behavior와 모순되지 않는다.
- `activeTab`, `scripting`, `clipboardWrite`, `downloads` 외 권한이 추가되지 않는다.
- release zip root에 `manifest.json`이 있고, `_locales/{en,ko,ja,zh_CN}/messages.json`이 포함된다.
- release zip에 `node_modules/`, `mydocs/`, repository root 개발 파일이 섞이지 않는다.
- MPL source availability와 Mozilla/Firefox disclaimer가 Store 배포 관점에서 확인된다.
- Store asset 준비 상태와 실제 제출 전 blocker가 최종 보고서에 명확히 남는다.
- `git status --short`가 PR 준비 전 빈 출력이다.
- `git diff --check`가 경고 없이 통과한다.

## 리스크

- **Store asset blocker**: 현재 manifest에 `icons` 정의가 없고 Store listing 이미지도 별도 관리되지 않는다. 이번 task에서 asset을 제작하지 않으므로 실제 제출 전 별도 승인 task가 필요할 수 있다.
- **Privacy policy 공개 URL**: Chrome Web Store는 privacy policy 접근성을 요구한다. 루트 `PRIVACY.md`를 GitHub 공개 URL로 사용하는 방향을 승인받고, 실제 Store Dashboard 입력은 별도 제출 승인 단계에서 수행한다.
- **Source map 포함 정책**: 현재 Vite build는 source map을 생성한다. Store package에 source map을 포함할지 여부는 code readability와 package 노출 관점에서 Stage 3에 검토하고 기록한다.
- **문구와 구현의 불일치**: full-page stitching과 cross-origin iframe 제한은 과장 없이 설명해야 한다. README, source, tests를 기준으로 문구를 검증한다.
- **실제 Store review 변동성**: Chrome Web Store 정책과 review 판단은 변경될 수 있다. 공식 문서 링크와 검토일을 산출물에 남기고, 제출 직전 다시 확인한다.

## 승인 요청 사항

- 루트 `PRIVACY.md`를 공식 사용자-facing privacy policy 문서로 생성하는 방향을 승인한다.
- `mydocs/tech/task_m030_9_chrome_web_store.md`를 Store listing copy, permission justification, release checklist 작업 산출물 위치로 사용하는 방향을 승인한다.
- Store asset 제작과 실제 Chrome Web Store 제출은 이번 task 범위에서 제외하고, blocker 또는 후속 승인 항목으로 기록하는 방향을 승인한다.
- 위 Stage 1~4 구성과 검증 계획으로 구현계획서 작성을 진행하는 것을 승인한다.

승인되면 `task_m030_9_impl.md`에서 단계별 산출물, 검증 명령, 커밋 메시지를 구체화한다.
