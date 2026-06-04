# Task #9 구현계획서 - Chrome Web Store 배포 준비

수행계획서: [`task_m030_9.md`](task_m030_9.md)
GitHub Issue: [#9](https://github.com/postmelee/crop/issues/9)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | Store 정책과 현행 산출물 매핑 | `mydocs/tech/task_m030_9_chrome_web_store.md` 초안 | 이슈/README/manifest/license 대조, 권한·브랜딩 grep |
| 2 | Privacy policy와 Store copy 작성 | `PRIVACY.md`, Store listing/privacy/permission copy | privacy·permission 문구 grep, README/manifest/source 대조 |
| 3 | Release package와 source availability checklist | package checklist, zip 검증 결과, source map 포함 정책 | `npm run build`, `dist`/zip contents review |
| 4 | 통합 검증과 제출 전 blocker 정리 | Stage 4 보고서, blocker/후속 작업 정리 | typecheck/test/build, 권한·privacy·브랜딩 grep, status/diff |
| 5 | 브랜드 아이콘 제작과 manifest 연결 | `public/icons/crop.*`, manifest icon metadata, Stage 5 보고서 | typecheck/test/build, icon package contents review |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로는 다음과 같이 일치시킨다. 공식 사용자-facing privacy policy는 루트 `PRIVACY.md`로 만들고, Chrome Web Store 입력 copy와 release checklist는 작업 산출물인 `mydocs/tech/task_m030_9_chrome_web_store.md`에 둔다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `PRIVACY.md` | 저장소 루트 | `PRIVACY.md` | OK | Store privacy policy URL 후보 |
| `mydocs/tech/task_m030_9_chrome_web_store.md` | `mydocs/tech/` | `mydocs/tech/task_m030_9_chrome_web_store.md` | OK | Store copy, 권한 justification, release checklist |
| `README.md` 외 README family | 저장소 루트 기존 위치 | 필요 시 기존 파일 | OK | 문구 대조 및 필요한 최소 보정 대상 |
| `NOTICE`, `THIRD_PARTY.md` | 저장소 루트 기존 위치 | 필요 시 기존 파일 | OK | source availability와 attribution 진실 원천 |
| `mydocs/plans/task_m030_9_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_9_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m030_9_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_9_stage{N}.md` | OK | 단계별 완료보고서 |
| `mydocs/report/task_m030_9_report.md` | `mydocs/report/` | `mydocs/report/task_m030_9_report.md` | OK | 최종 결과보고서 |

## 수용 기준 고정

- Chrome Web Store listing copy는 현재 README, manifest, source behavior와 모순되지 않는다.
- single-purpose statement는 "current page screenshot selection and capture" 범위로 제한한다.
- privacy policy와 Dashboard disclosure 문구는 local processing, no server upload, no telemetry, explicit Copy/Save behavior를 반영한다.
- `activeTab`, `scripting`, `clipboardWrite`, `downloads` 권한 justification은 실제 사용처와 일치한다.
- `debugger`, `<all_urls>`, broad `host_permissions`를 추가하지 않는다.
- release zip은 `dist/` 내용을 root로 압축하며 zip root에 `manifest.json`이 존재한다.
- release zip에 `_locales/{en,ko,ja,zh_CN}/messages.json`이 포함된다.
- release zip에 `node_modules/`, `mydocs/`, repository root 개발 파일이 섞이지 않는다.
- MPL source availability, `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0` 상태를 Store 배포 관점에서 확인한다.
- Mozilla/Firefox는 attribution, license, technical reference 맥락에서만 언급한다.
- Store icon/screenshot/promotional image의 현재 준비 상태와 실제 제출 전 blocker 여부를 최종 보고서에 남긴다.
- Stage 5에서 제작하는 아이콘은 제품명 `crop`만 사용하고 Mozilla/Firefox/Screenshots 제휴나 유사 브랜딩을 암시하지 않는다.
- 실제 Chrome Web Store 제출, review submit, 게시 상태 변경은 이번 task에서 수행하지 않는다.

## Stage 1 — Store 정책과 현행 산출물 매핑

### 산출물

신규:

- `mydocs/tech/task_m030_9_chrome_web_store.md`
- `mydocs/working/task_m030_9_stage1.md`

수정:

- 필요 시 `mydocs/orders/20260604.md`

### 변경 내용

- Chrome Web Store Program Policies, publish guide, privacy fields guide, listing guide, image guide를 기준으로 필요한 제출 항목을 정리한다.
- 기준일과 공식 문서 URL을 `mydocs/tech/task_m030_9_chrome_web_store.md`에 기록한다.
- 현재 `README.md`, README family, `manifest.json`, `_locales`, `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0` 상태를 Store 제출 항목과 매핑한다.
- 현행 기능과 제한사항을 listing copy에 반영할 bullet로 분리한다.
- asset inventory를 작성한다.
  - manifest `icons` 정의 여부
  - extension icon 준비 여부
  - screenshot/promotional image 준비 여부
  - localized screenshot 필요 여부
- Stage 1에서는 copy 초안을 완성하지 않고, 요구사항과 현행 산출물의 gap을 먼저 고정한다.

### 검증

```bash
gh issue view 9 --repo postmelee/crop --json number,title,state,labels,milestone,body
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" manifest.json README.md README.ko.md README.zh-CN.md README.ja.md src tests
rg -n "Mozilla|Firefox|affiliated|endorsed|sponsored|telemetry|server|privacy" README.md README.ko.md README.zh-CN.md README.ja.md NOTICE THIRD_PARTY.md
rg -n "icons|default_locale|__MSG_|_locales" manifest.json vite.config.ts _locales tests
git diff --check
```

### 커밋

```text
Task #9 Stage 1: Store 정책과 현행 산출물 매핑
```

## Stage 2 — Privacy policy와 Store copy 작성

### 산출물

신규:

- `PRIVACY.md`
- `mydocs/working/task_m030_9_stage2.md`

수정:

- `mydocs/tech/task_m030_9_chrome_web_store.md`
- 필요 시 `README.md`
- 필요 시 `README.ko.md`
- 필요 시 `README.zh-CN.md`
- 필요 시 `README.ja.md`

### 변경 내용

- 루트 `PRIVACY.md`를 작성한다.
  - local browser processing
  - no server upload
  - no telemetry/analytics
  - Copy와 Save 실행 시 clipboard/download로 이동하는 데이터
  - restricted page, cross-origin iframe, closed shadow DOM 같은 browser/platform limitation
  - 문의 또는 source reference는 public repository 기준으로 작성
- Chrome Web Store short description, detailed description, single-purpose statement를 작성한다.
- Developer Dashboard privacy disclosure 초안을 작성한다.
- 권한 justification을 작성한다.
  - `activeTab`: 사용자가 action/shortcut으로 실행한 현재 tab에 임시 접근
  - `scripting`: 현재 tab에 overlay content script injection
  - `clipboardWrite`: Copy action으로 PNG를 clipboard에 기록
  - `downloads`: Save action으로 PNG 파일 다운로드
- Store copy가 이미 게시된 것처럼 읽히거나 Mozilla/Firefox 제휴를 암시하지 않도록 문구를 제한한다.
- README family에서 privacy policy 링크나 설명 보강이 필요하면 최소 수정한다.

### 검증

```bash
rg -n "server|telemetry|analytics|local|clipboard|download|Chrome Web Store|privacy|permission" PRIVACY.md mydocs/tech/task_m030_9_chrome_web_store.md README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "Mozilla|Firefox|official|affiliated|endorsed|sponsored" PRIVACY.md mydocs/tech/task_m030_9_chrome_web_store.md README.md README.ko.md README.zh-CN.md README.ja.md NOTICE THIRD_PARTY.md
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" manifest.json PRIVACY.md mydocs/tech/task_m030_9_chrome_web_store.md README.md
git diff --check
```

### 커밋

```text
Task #9 Stage 2: Privacy policy와 Store copy 작성
```

## Stage 3 — Release package와 source availability checklist

### 산출물

신규:

- `mydocs/working/task_m030_9_stage3.md`

수정:

- `mydocs/tech/task_m030_9_chrome_web_store.md`
- 필요 시 `NOTICE`
- 필요 시 `THIRD_PARTY.md`
- 필요 시 `README.md`

### 변경 내용

- `npm run build` 산출물을 기준으로 Chrome Web Store upload zip 생성 절차를 문서화한다.
- `dist/`를 root로 압축하는 명령과 검증 명령을 고정한다.
- zip root에 `manifest.json`이 존재하는지 확인한다.
- `_locales/{en,ko,ja,zh_CN}/messages.json` 포함 여부를 확인한다.
- `node_modules/`, `mydocs/`, repository root 개발 파일이 zip에 섞이지 않는지 확인한다.
- 현재 build가 source map을 생성하므로 Store package source map 포함 정책을 검토하고 결과를 문서화한다.
- `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0` 기준으로 MPL source availability와 Firefox-derived source boundary가 배포 관점에서 충분한지 확인한다.
- 부족한 고지나 source availability 안내가 있으면 기존 고지 문서에 필요한 부분만 보강한다.

### 검증

```bash
npm run build
find dist -maxdepth 3 -type f | sort
sed -n '1,220p' dist/manifest.json
python3 -c 'from pathlib import Path; from zipfile import ZipFile, ZIP_DEFLATED; root=Path("dist"); z=ZipFile("/tmp/crop-0.1.0-cws.zip","w",ZIP_DEFLATED); [z.write(p,p.relative_to(root).as_posix()) for p in sorted(root.rglob("*")) if p.is_file()]; z.close()'
unzip -l /tmp/crop-0.1.0-cws.zip
rg -n "MPL|Mozilla|Firefox|source|LICENSE-MPL-2.0|NOTICE|THIRD_PARTY|affiliated|endorsed|sponsored" README.md PRIVACY.md NOTICE THIRD_PARTY.md mydocs/tech/task_m030_9_chrome_web_store.md
git diff --check
```

### 커밋

```text
Task #9 Stage 3: Release package와 source availability 정리
```

## Stage 4 — 통합 검증과 제출 전 blocker 정리

### 산출물

신규:

- `mydocs/working/task_m030_9_stage4.md`

수정:

- `mydocs/tech/task_m030_9_chrome_web_store.md`
- 필요 시 `PRIVACY.md`
- 필요 시 README family
- 필요 시 `mydocs/orders/20260604.md`

### 변경 내용

- Stage 1~3 산출물을 통합 검토한다.
- Store listing copy, privacy policy, permission justification, package checklist, source availability, branding disclaimer를 최종 대조한다.
- 실제 제출 전 blocker를 명확히 분류한다.
  - 제출 차단: Store 필수 icon/screenshot 등 없으면 blocker로 기록
  - 제출 전 승인 필요: Dashboard 입력, zip upload, review submit
  - 후속 개선: localized screenshot, promotional image, icon polishing 등
- 수동 smoke checklist를 정리하고 실행 가능 범위와 미실행 범위를 구분한다.
- 최종 보고 전 자동 검증을 재실행한다.

### 검증

```bash
npm run typecheck
npm test
npm run build
find dist -maxdepth 3 -type f | sort
sed -n '1,220p' dist/manifest.json
python3 -c 'from pathlib import Path; from zipfile import ZipFile, ZIP_DEFLATED; root=Path("dist"); z=ZipFile("/tmp/crop-0.1.0-cws.zip","w",ZIP_DEFLATED); [z.write(p,p.relative_to(root).as_posix()) for p in sorted(root.rglob("*")) if p.is_file()]; z.close()'
unzip -l /tmp/crop-0.1.0-cws.zip
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" manifest.json dist/manifest.json README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md mydocs/tech/task_m030_9_chrome_web_store.md src tests
rg -n "server|telemetry|analytics|local|privacy|clipboard|download|Mozilla|Firefox|official|affiliated|endorsed|sponsored" README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md NOTICE THIRD_PARTY.md mydocs/tech/task_m030_9_chrome_web_store.md
git diff --check
git status --short
```

### 커밋

```text
Task #9 Stage 4: 제출 전 blocker와 통합 검증 정리
```

## Stage 5 — 브랜드 아이콘 제작과 manifest 연결

### 산출물

신규:

- `public/icons/crop-16.png`
- `public/icons/crop-32.png`
- `public/icons/crop-48.png`
- `public/icons/crop-128.png`
- `mydocs/working/task_m030_9_stage5.md`

수정:

- `manifest.json`
- `tests/manifest.test.ts`
- `mydocs/tech/task_m030_9_chrome_web_store.md`
- 필요 시 `mydocs/orders/20260604.md`

### 변경 내용

- 제품명과 사용자-facing 브랜딩은 `crop`만 사용한다.
- Mozilla, Firefox, Screenshots를 아이콘/브랜딩 요소로 사용하지 않는다.
- 사용자 제공 PNG 아이콘을 기준으로 Chrome extension icon set을 생성한다.
- Chrome extension metadata와 action icon에 필요한 `16`, `32`, `48`, `128` PNG를 생성한다.
- `manifest.json`에 `icons`와 `action.default_icon`을 추가한다.
- Vite build의 기본 `public/` copy 동작으로 `dist/icons/*`가 package에 포함되는지 확인한다.
- Store icon/manifest icon blocker는 해소하고, screenshot/small promo image blocker는 잔여 항목으로 유지한다.

### 검증

```bash
file public/icons/crop-16.png public/icons/crop-32.png public/icons/crop-48.png public/icons/crop-128.png
npm run typecheck
npm test
npm run build
find dist -maxdepth 3 -type f | sort
sed -n '1,240p' dist/manifest.json
python3 - <<'PY'
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path("dist")
with ZipFile("/tmp/crop-0.1.0-cws.zip", "w", ZIP_DEFLATED) as zf:
    for path in sorted(root.rglob("*")):
        if path.is_file():
            zf.write(path, path.relative_to(root).as_posix())
PY
unzip -l /tmp/crop-0.1.0-cws.zip
git diff --check
```

### 커밋

```text
Task #9 Stage 5: 브랜드 아이콘 제작과 manifest 연결
```

## 최종 보고와 PR 준비

모든 Stage 완료와 승인 후 `task-final-report` 절차로 진행한다.

예상 산출물:

- `mydocs/report/task_m030_9_report.md`
- `mydocs/orders/20260604.md`
- `publish/task9` 원격 브랜치
- `devel` 대상 PR

예상 검증:

```bash
npm run typecheck
npm test
npm run build
git diff --check
git status --short
```

Stage 4~5에서 생성한 zip contents review와 blocker 정리 결과를 최종 보고서와 PR 본문에 반영한다.

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 구현 중 파일 위치나 범위가 이 계획과 달라지면 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 다시 받는다.
- Chrome Web Store 공식 문서 확인이 필요한 항목은 확인일과 URL을 `mydocs/tech/task_m030_9_chrome_web_store.md`에 남긴다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m030_9_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #9 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 구현계획서 자체는 `Task #9: 구현계획서 작성과 오늘할일 갱신` 커밋으로 별도 기록한다.
- 최종 보고와 PR 게시 커밋은 `task-final-report` 절차의 커밋 규칙을 따른다.

## 단계 의존성

- Stage 2는 Stage 1의 Store 정책 매핑과 현행 gap 정리가 승인된 뒤 진행한다.
- Stage 3은 Stage 2의 privacy policy와 Store copy가 승인된 뒤 진행한다.
- Stage 4는 Stage 3의 release package/source availability checklist가 승인된 뒤 진행한다.
- Stage 5는 Stage 4에서 확인한 icon blocker 보완 요청이 승인된 뒤 진행한다.
- 최종 보고와 PR 준비는 Stage 5 단계 보고서 승인 후 진행한다.

## 위험과 대응

- **Store asset blocker**: Stage 5에서 icon은 보완하지만 screenshot과 small promo image가 없으면 실제 제출이 막힐 수 있다. 남은 blocker를 명확히 기록하고 별도 asset task 또는 제출 승인 단계로 넘긴다.
- **Privacy policy URL 준비**: `PRIVACY.md`는 PR merge 후 GitHub URL로 사용할 수 있다. Store Dashboard 실제 입력은 별도 승인 단계에서 수행한다.
- **Source map 포함 판단**: source map은 debugging에는 유리하지만 package에 source를 더 노출한다. Stage 3에서 현재 build 정책과 Store package 관점의 판단을 기록한다.
- **문구 과장**: full-page/scroll stitching 한계를 숨기면 Store copy와 실제 동작이 어긋난다. README와 테스트 기준으로 제한사항을 명시한다.
- **공식 정책 변화**: Chrome Web Store 정책은 바뀔 수 있다. Stage 1에서 공식 문서 확인일과 링크를 남기고 제출 직전 재확인 항목으로 분리한다.

## 승인 요청 사항

- Stage 1~5 분할과 각 Stage 산출물
- 구현계획서에 명시한 검증 명령
- 단계별 커밋 메시지
- `PRIVACY.md`와 `mydocs/tech/task_m030_9_chrome_web_store.md`의 문서 위치
- Store screenshot/small promo image 제작과 실제 Chrome Web Store 제출을 이번 task 범위에서 제외하고 blocker/후속 승인 항목으로 남기는 기준
