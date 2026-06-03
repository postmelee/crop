# Task #28 Stage 4 완료 보고서

GitHub Issue: [#28](https://github.com/postmelee/crop/issues/28)
구현계획서: [`task_m030_28_impl.md`](../plans/task_m030_28_impl.md)
Stage: 4

## 단계 목적

Stage 4는 README family 전체를 통합 검토하고, 언어 링크, 권한 설명, privacy/local processing, limitations, attribution/license, branding disclaimer가 같은 기준을 유지하는지 확인하는 마지막 단계다.

이번 단계에서는 기능 범위나 문서 위치를 확장하지 않고, 다국어 README에 남은 어색한 English 운영 표현을 각 언어의 사용자-facing 문장으로 좁게 보정했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `README.md` | 언어 링크 표시명을 `한국어`, `简体中文`, `日本語`로 보정했다. |
| `README.ko.md` | `action icon`, `viewport`, `content script`, `top-level document`, `affiliated/endorsed/sponsored` 등 과도한 English 표현을 한국어 사용자 문장으로 보정했다. |
| `README.zh-CN.md` | 언어 링크 표시와 source loading, capture, permissions, privacy, limitations, attribution 문구를 Simplified Chinese 사용자 문장으로 보정했다. |
| `README.ja.md` | 언어 링크 표시와 source loading, capture, permissions, privacy, limitations, attribution 문구를 Japanese 사용자 문장으로 보정했다. |
| `mydocs/orders/20260603.md` | #28 비고를 Stage 4 완료 보고 후 최종 보고 승인 대기 상태로 갱신했다. |
| `mydocs/working/task_m030_28_stage4.md` | Stage 4 변경 내용, 검증 결과, 잔여 위험을 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

Stage 4는 Stage 3에서 만든 README family의 정보 구조를 유지하면서 문구만 좁게 보정했다. 기능 목록, 권한 표, privacy stance, limitations, attribution/license 항목은 모두 유지했다.

보정 방향:

- 루트 README의 언어 링크 표시를 각 언어 이름으로 보정했다.
- 한국어/중국어/일본어 README에서 사용자가 읽는 본문은 각 언어 표현을 우선했다.
- `activeTab`, `scripting`, `clipboardWrite`, `downloads`, `debugger`, `<all_urls>`, `host_permissions`, `LICENSE-MPL-2.0`, `NOTICE`, `THIRD_PARTY.md`처럼 정확한 식별자가 필요한 항목은 그대로 유지했다.
- `local processing`, `telemetry`, `host permissions`, `license notices`, `technical references`처럼 후속 grep과 정책 검토에 필요한 일부 기준 용어는 괄호 또는 문맥 안에 유지했다.

## 검증 결과

실행 명령:

```bash
git diff -- README.md README.ko.md README.zh-CN.md README.ja.md
ls README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "README\\.(ko|zh-CN|ja)\\.md|README.md" README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" README.md README.ko.md README.zh-CN.md README.ja.md manifest.json
rg -n "Chrome Web Store|published|available|install from|Mozilla|Firefox|official|endorsed|sponsored|affiliated" README.md README.ko.md README.zh-CN.md README.ja.md
rg -n "server|telemetry|local|privacy|permission|limitation|license|MPL|NOTICE|THIRD_PARTY" README.md README.ko.md README.zh-CN.md README.ja.md
git diff --check
git status --short
```

결과:

- OK: README 4개 파일이 모두 존재한다.
- OK: 루트 README와 각 다국어 README 상단의 언어 링크가 실제 파일 경로를 가리킨다.
- OK: 권한 grep에서 README family와 `manifest.json`의 `activeTab`, `scripting`, `clipboardWrite`, `downloads`가 확인됐다.
- OK: `debugger`, `<all_urls>`, `host_permissions`는 미요청 문구와 검증 문맥으로만 확인됐다.
- OK: Chrome Web Store 문구는 "아직 등록/상장/掲載되지 않음"과 제한 페이지 문맥으로만 확인됐다.
- OK: Mozilla/Firefox 문구는 attribution/license/disclaimer 문맥으로만 확인됐다.
- OK: privacy/license grep에서 local processing, server/server 번역, telemetry, permission, MPL, `NOTICE`, `THIRD_PARTY.md` 문맥이 확인됐다.
- OK: `git diff --check`가 경고 없이 통과했다.
- OK: `git status --short`는 커밋 전 예상 범위인 README family 수정만 표시했다.

## 잔여 위험

- 다국어 README는 저장소 문서 기준 번역이다. Chrome Web Store listing localization은 별도 Store 제출 task에서 다시 다듬어야 한다.
- 번역 품질은 자동 grep만으로 완전히 보장할 수 없다. PR 리뷰에서 자연스러운 문장성 확인이 남아 있다.
- README에는 아직 app icon, screenshot, feature video가 없다. 이는 사용자 제공 자산을 받은 뒤 별도 branding asset task에서 처리한다.

## 다음 단계 영향

- 모든 Stage가 완료됐으므로 다음 단계는 `task-final-report` 절차다.
- 최종 보고서에서는 README family, 문서 위치 판단, 검증 결과, 후속 #29 Community Standards와 branding asset 작업 연결을 정리한다.
- PR 게시 전 Stage 4 검증 명령 또는 핵심 grep을 최종 보고서에서 재확인한다.

## 승인 요청

- Stage 4 산출물과 검증 결과를 승인하면 `task-final-report` 절차로 최종 결과보고서 작성, 오늘할일 갱신, publish branch, PR 준비를 진행한다.
