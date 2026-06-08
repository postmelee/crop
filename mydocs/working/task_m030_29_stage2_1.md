# Task #29 Stage 2.1 보고서 - 다국어 community 문서 보정

GitHub Issue: [#29](https://github.com/postmelee/crop/issues/29)
구현계획서: [`task_m030_29_impl.md`](../plans/task_m030_29_impl.md)
Stage: 2.1

## 단계 목적

Stage 2 산출물인 `CONTRIBUTING.md`와 `CODE_OF_CONDUCT.md`를 public repository 기준에 맞게 다국어 분리 구조로 보정했다. GitHub Community Profile이 인식하는 표준 파일은 English canonical로 유지하고, 한국어, Simplified Chinese, Japanese 번역 파일은 별도 루트 문서로 분리했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `CONTRIBUTING.md` | English canonical 기여 안내로 보정, 언어 링크와 canonical 안내 추가 |
| `CONTRIBUTING.ko.md` | 한국어 기여 안내 번역 추가 |
| `CONTRIBUTING.zh-CN.md` | Simplified Chinese 기여 안내 번역 추가 |
| `CONTRIBUTING.ja.md` | Japanese 기여 안내 번역 추가 |
| `CODE_OF_CONDUCT.md` | English canonical 행동 강령으로 보정, 언어 링크와 canonical 안내 추가 |
| `CODE_OF_CONDUCT.ko.md` | 한국어 행동 강령 번역 추가 |
| `CODE_OF_CONDUCT.zh-CN.md` | Simplified Chinese 행동 강령 번역 추가 |
| `CODE_OF_CONDUCT.ja.md` | Japanese 행동 강령 번역 추가 |
| `mydocs/plans/task_m030_29.md` | 다국어 community 문서 위치와 수용 기준 보정 |
| `mydocs/plans/task_m030_29_impl.md` | Stage 2 산출물과 검증 명령 보정 |
| `mydocs/working/task_m030_29_stage2_1.md` | Stage 2.1 보정 내용과 검증 결과 기록 |
| `mydocs/orders/20260608.md` | #29 비고를 Stage 2.1 완료 후 Stage 3 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

기존 Stage 2 한국어 본문은 `CONTRIBUTING.ko.md`와 `CODE_OF_CONDUCT.ko.md`로 분리했다. `CONTRIBUTING.md`와 `CODE_OF_CONDUCT.md`는 English canonical로 재작성했다. 중국어와 일본어 번역은 English canonical의 구조와 의미를 기준으로 작성했다.

행동 강령 문서는 번역 간 의미 차이 위험이 있으므로 모든 번역 파일 상단에 English 문서가 기준이라는 안내를 넣었다.

## 검증 결과

실행 명령:

```bash
ls CONTRIBUTING.md CONTRIBUTING.ko.md CONTRIBUTING.zh-CN.md CONTRIBUTING.ja.md CODE_OF_CONDUCT.md CODE_OF_CONDUCT.ko.md CODE_OF_CONDUCT.zh-CN.md CODE_OF_CONDUCT.ja.md
sed -n '1,280p' CONTRIBUTING.md
sed -n '1,240p' CODE_OF_CONDUCT.md
rg -n "CONTRIBUTING\\.(ko|zh-CN|ja)\\.md|CODE_OF_CONDUCT\\.(ko|zh-CN|ja)\\.md|canonical|English" CONTRIBUTING*.md CODE_OF_CONDUCT*.md
rg -n "Hyper-Waterfall|issue|pull request|security|conduct|Mozilla|Firefox|debugger|<all_urls>|activeTab|scripting|clipboardWrite|downloads" CONTRIBUTING*.md CODE_OF_CONDUCT*.md AGENTS.md mydocs/manual
rg -n "affiliated|endorsed|sponsored|official" CONTRIBUTING*.md CODE_OF_CONDUCT*.md
git diff --check
```

결과:

- OK: 8개 community 문서 파일이 모두 존재한다.
- OK: `CONTRIBUTING.md`와 `CODE_OF_CONDUCT.md`는 English canonical이며 한국어, 중국어, 일본어 링크를 포함한다.
- OK: 번역 파일은 English canonical 우선 안내를 포함한다.
- OK: `rg -n "CONTRIBUTING\\.(ko|zh-CN|ja)\\.md|CODE_OF_CONDUCT\\.(ko|zh-CN|ja)\\.md|canonical|English" ...`로 언어 링크와 canonical 안내를 확인했다.
- OK: 정책 키워드 grep으로 Hyper-Waterfall, Issue/PR, security, conduct, Mozilla/Firefox, 권한 경계를 확인했다.
- OK: `rg -n "affiliated|endorsed|sponsored|official" CONTRIBUTING*.md CODE_OF_CONDUCT*.md`는 매칭 없음으로 종료했다.
- OK: `git diff --check`는 경고 없이 통과했다.

## 잔여 위험

- 번역 파일은 의미가 English canonical과 다르지 않게 작성했지만, 향후 문서 수정 시 번역 drift가 생길 수 있다. canonical 안내를 유지하고 PR review에서 언어별 변경을 함께 확인해야 한다.
- GitHub Community Profile은 `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`만 직접 인식한다. 언어별 파일은 상단 링크를 통해 접근 가능하게 한다.

## 다음 단계 영향

- Stage 3의 issue template 문구는 English canonical community 문서와 충돌하지 않게 유지해야 한다.
- Stage 4 README 링크 정리 시 canonical 파일을 기본 링크로 두고, 필요하면 언어별 링크는 각 canonical 문서 내부 링크에 맡긴다.

## 승인 요청

- Stage 2.1 보정 산출물과 검증 결과를 승인하면 Stage 3으로 진행한다.
