# Task #28 Stage 1 완료 보고서

GitHub Issue: [#28](https://github.com/postmelee/crop/issues/28)
구현계획서: [`task_m030_28_impl.md`](../plans/task_m030_28_impl.md)
Stage: 1

## 단계 목적

Stage 1은 루트 `README.md`의 정보 구조를 개발 상태 기록 중심에서 사용자-facing English 초안 중심으로 재배치하는 단계다. 아직 다국어 README 파일은 만들지 않고, Stage 3에서 연결할 Korean, Simplified Chinese, Japanese 문서 계획을 상단 placeholder로 표시한다.

이번 단계의 목적은 Chrome Web Store 배포 준비와 브랜딩 자산 작업에서 재사용할 공개 문구의 첫 골격을 만드는 것이다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `README.md` | 기존 한국어 개발 상태 기록형 README를 English 사용자용 초안으로 전면 재구성했다. 기능, 설치, 사용법, 권한, privacy, 제한사항, 개발자 quick start, attribution/license 섹션을 배치했다. |
| `mydocs/orders/20260603.md` | #28 비고를 Stage 1 완료 보고 후 Stage 2 승인 대기 상태로 갱신했다. |
| `mydocs/working/task_m030_28_stage1.md` | Stage 1 변경 내용, 검증 결과, 잔여 위험을 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

`README.md`는 199줄의 한국어 개발 상태/검증 기록 중심 문서에서 156줄의 English 사용자-facing 초안으로 전면 재작성했다. 원문 문장을 무손실 보존하지는 않았다.

대신 다음 정보는 사용자용 문맥으로 축약해 유지했다.

- Chrome MV3 확장이라는 정체성
- action icon과 `Ctrl+Shift+S`/`Command+Shift+S` 진입점
- DOM 요소 선택, drag selection, Copy/Save, visible viewport capture, full page stitching
- same-origin/srcdoc iframe 지원과 cross-origin/closed shadow 제한
- `activeTab`, `scripting`, `clipboardWrite`, `downloads` 권한
- 서버 전송 없음, telemetry 없음, 로컬 처리
- Mozilla/Firefox attribution과 MPL source boundary

기존의 세부 개발 이력, fixture 기대 결과, 내부 smoke checklist는 루트 README에서 제거했다. 해당 세부 이력은 기존 GitHub Issues, `mydocs/`, 테스트, 품질 매트릭스가 보존 위치다.

## 검증 결과

실행 명령:

```bash
git diff -- README.md
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>" README.md manifest.json
rg -n "Mozilla|Firefox|official|endorsed|sponsored|affiliated" README.md
git diff --check
```

결과:

- OK: `git diff -- README.md`로 README가 사용자용 English 구조로 재배치된 것을 확인했다.
- OK: 권한 grep에서 `manifest.json`의 `activeTab`, `scripting`, `clipboardWrite`, `downloads`와 README 권한 표가 함께 확인됐다.
- OK: README는 `debugger`, `<all_urls>`를 요청하지 않는다고 명시한다. `manifest.json`에도 해당 권한은 없다.
- OK: Mozilla/Firefox 관련 grep은 attribution/license 문맥과 "not affiliated with, endorsed by, or sponsored by" disclaimer에서만 확인됐다.
- OK: `git diff --check`가 경고 없이 통과했다.

## 잔여 위험

- Stage 1 초안이므로 English 문장의 밀도, section naming, Chrome Web Store 제출 문구로 재사용 가능한 수준의 polish는 Stage 2에서 더 보정해야 한다.
- 다국어 README 파일은 아직 생성하지 않았다. 현재 루트 README에는 번역 예정 문구만 있으며, 실제 링크 연결은 Stage 3 범위다.
- README 상단에 실제 asset, screenshot, video는 넣지 않았다. 이는 후속 브랜딩 자산 이슈 범위다.
- `Chrome Web Store`, `published` 표현은 "아직 배포되지 않음"을 설명하기 위해 포함됐다. Stage 2에서 Store 제출 완료로 오해될 표현이 없는지 다시 검토한다.

## 다음 단계 영향

- Stage 2는 이번 skeleton을 기준으로 English README 문장을 더 압축하고, 기능 설명/권한 설명/privacy/limitations 문구를 배포 준비용 문구로 다듬는다.
- Stage 3은 Stage 2에서 확정된 English README를 기준으로 `README.ko.md`, `README.zh-CN.md`, `README.ja.md`를 만들고 실제 언어 링크를 연결한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 — English README 완성도 보정으로 진행한다.
