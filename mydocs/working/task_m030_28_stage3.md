# Task #28 Stage 3 완료 보고서

GitHub Issue: [#28](https://github.com/postmelee/crop/issues/28)
구현계획서: [`task_m030_28_impl.md`](../plans/task_m030_28_impl.md)
Stage: 3

## 단계 목적

Stage 3은 Stage 2에서 확정한 English README 구조를 기준으로 Korean, Simplified Chinese, Japanese README를 작성하고, 루트 README의 언어 placeholder를 실제 파일 링크로 연결하는 단계다.

이번 단계의 핵심은 번역 파일을 만들면서도 기능 범위, 권한 설명, privacy/local processing, limitations, attribution/license 문구가 English 원문을 벗어나지 않게 유지하는 것이다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `README.md` | 상단 translation placeholder를 `README.ko.md`, `README.zh-CN.md`, `README.ja.md` 실제 링크로 교체했다. |
| `README.ko.md` | Stage 2 English README와 같은 섹션 순서로 Korean README를 신규 작성했다. |
| `README.zh-CN.md` | Stage 2 English README와 같은 섹션 순서로 Simplified Chinese README를 신규 작성했다. |
| `README.ja.md` | Stage 2 English README와 같은 섹션 순서로 Japanese README를 신규 작성했다. |
| `mydocs/orders/20260603.md` | #28 비고를 Stage 3 완료 보고 후 Stage 4 승인 대기 상태로 갱신했다. |
| `mydocs/working/task_m030_28_stage3.md` | Stage 3 변경 내용, 검증 결과, 잔여 위험을 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

루트 `README.md`는 언어 링크만 좁게 수정했다. English 본문은 Stage 2 기준을 유지했다.

신규 다국어 README 3개는 English README의 정보 구조를 번역한 문서다. 각 파일은 122줄이며 다음 항목을 모두 포함한다.

- 언어 전환 링크
- release status: Chrome Web Store에 아직 등록되지 않았다는 문구
- 기능 목록
- source loading 절차
- 기본 사용법
- `activeTab`, `scripting`, `clipboardWrite`, `downloads` 권한 설명
- `debugger`, `<all_urls>`, broad host permissions, `host_permissions` 미요청
- local processing, server upload 없음, telemetry 없음
- 제한사항
- 개발 명령과 저장소 구조
- Mozilla/Firefox attribution disclaimer와 MIT/MPL/NOTICE/THIRD_PARTY 안내

번역 과정에서 새 기능 약속, Chrome Web Store 배포 완료 암시, Mozilla/Firefox 공식 제휴 암시는 추가하지 않았다.

## 검증 결과

실행 명령:

```bash
ls README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "README\\.(ko|zh-CN|ja)\\.md|README.md" README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" README.md README.ko.md README.zh-CN.md README.ja.md manifest.json
rg -n "Mozilla|Firefox|official|endorsed|sponsored|affiliated" README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "server|telemetry|local|privacy|permission|MPL|NOTICE|THIRD_PARTY" README.md README.ko.md README.zh-CN.md README.ja.md
git diff --check
```

결과:

- OK: 네 README 파일이 모두 존재한다.
- OK: 루트 README와 각 다국어 README 상단에서 실제 README 파일 링크가 확인됐다.
- OK: 권한 grep에서 모든 README와 `manifest.json`의 `activeTab`, `scripting`, `clipboardWrite`, `downloads`가 확인됐다.
- OK: 모든 다국어 README에서 `debugger`, `<all_urls>`, `host_permissions` 미요청 문구가 확인됐다.
- OK: Mozilla/Firefox 관련 grep은 attribution/disclaimer/license 문맥에서 확인됐다.
- OK: privacy/license grep에서 local processing, server, telemetry, permission, MPL, `NOTICE`, `THIRD_PARTY.md` 문맥이 확인됐다.
- OK: `git diff --check`가 경고 없이 통과했다.

추가 확인:

```bash
wc -l README.md README.ko.md README.zh-CN.md README.ja.md
```

결과:

- `README.md`: 157줄
- `README.ko.md`: 122줄
- `README.zh-CN.md`: 122줄
- `README.ja.md`: 122줄

## 잔여 위험

- 번역 품질은 자동 grep으로 완전히 보장할 수 없다. Stage 4에서 README family 전체를 다시 읽고 어색한 표현, 링크 오류, 번역 drift를 좁게 보정해야 한다.
- 다국어 README는 현재 GitHub 저장소 문서 기준이며 Chrome Web Store listing localization은 아직 별도 산출물이 아니다.
- README에는 아직 app icon, screenshot, feature video가 없다. 이는 후속 branding asset task에서 처리한다.

## 다음 단계 영향

- Stage 4는 네 README 파일을 통합 검토하면서 언어 링크, 권한 설명, privacy/local processing, limitations, attribution/license, branding disclaimer를 최종 대조한다.
- Stage 4에서 필요하면 다국어 README의 어색한 문장이나 English keyword 보존 방식을 좁게 보정한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4 — 통합 문서 검증과 잔여 정리로 진행한다.
