# Task #29 Stage 2 보고서 - 기여자 안내와 행동 강령 작성

GitHub Issue: [#29](https://github.com/postmelee/crop/issues/29)
구현계획서: [`task_m030_29_impl.md`](../plans/task_m030_29_impl.md)
Stage: 2

## 단계 목적

공개 저장소의 기본 community health file 중 `CONTRIBUTING.md`와 `CODE_OF_CONDUCT.md`를 작성했다. 외부 기여자가 내부 Hyper-Waterfall 산출물을 직접 작성해야 한다고 오해하지 않도록, 일반적인 Issue/Pull Request 흐름과 maintainer 내부 절차의 경계를 분리해 설명했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `CONTRIBUTING.md` | 외부 기여자의 Issue/PR 기대사항, 권한/브랜딩/라이선스 경계, Hyper-Waterfall 전환 원칙 작성 |
| `CODE_OF_CONDUCT.md` | 공개 협업 행동 기준, 허용하지 않는 행동, 신고/처리 원칙 작성 |
| `mydocs/working/task_m030_29_stage2.md` | Stage 2 산출물과 검증 결과 기록 |
| `mydocs/orders/20260608.md` | #29 비고를 Stage 2 완료 후 Stage 3 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

신규 문서 2개를 작성했다. 기존 공식 문서, source, manifest, workflow 파일은 변경하지 않았다. `CONTRIBUTING.md`와 `CODE_OF_CONDUCT.md`는 Contributor Covenant 등 외부 전문을 복사하지 않고 저장소 운영 기준에 맞춰 새로 작성했다.

작업 중 `origin/devel`에 #51이 merge되어 `local/task29`가 뒤처졌다. Stage 2 커밋 전 `origin/devel` 위로 rebase했고, `mydocs/orders/20260608.md` 충돌은 #51 완료 행과 #29 진행 행을 모두 보존하는 방식으로 해결했다.

## 검증 결과

실행 명령:

```bash
sed -n '1,280p' CONTRIBUTING.md
sed -n '1,240p' CODE_OF_CONDUCT.md
rg -n "Hyper-Waterfall|issue|pull request|security|conduct|Mozilla|Firefox|debugger|<all_urls>|activeTab|scripting|clipboardWrite|downloads" CONTRIBUTING.md CODE_OF_CONDUCT.md AGENTS.md mydocs/manual
rg -n "affiliated|endorsed|sponsored|official" CONTRIBUTING.md CODE_OF_CONDUCT.md
git diff --check
```

결과:

- OK: `CONTRIBUTING.md`는 Issue 우선 논의, 작은 PR, PR template, 검증 결과 기록, 권한/브랜딩/라이선스 경계를 포함한다.
- OK: `CONTRIBUTING.md`는 외부 기여자가 내부 task 문서나 단계 보고서를 직접 작성할 필요가 없다고 명시한다.
- OK: `CODE_OF_CONDUCT.md`는 기대 행동, 허용하지 않는 행동, 신고/처리 원칙, 적용 범위를 포함한다.
- OK: `rg -n "Hyper-Waterfall|issue|pull request|security|conduct|Mozilla|Firefox|debugger|<all_urls>|activeTab|scripting|clipboardWrite|downloads" ...`로 주요 정책 키워드와 내부 매뉴얼 경계를 대조했다.
- OK: `rg -n "affiliated|endorsed|sponsored|official" CONTRIBUTING.md CODE_OF_CONDUCT.md`는 매칭 없음으로 종료했다. 영어 제휴/보증 암시 표현은 새 문서에 없다.
- OK: `git diff --check`는 경고 없이 통과했다.

## 잔여 위험

- `CODE_OF_CONDUCT.md`의 비공개 신고 경로는 현재 별도 이메일이나 private vulnerability reporting 상태를 확정하지 못해 `@postmelee`와 GitHub profile 연락 경로 중심으로 보수적으로 작성했다. Stage 4의 `SECURITY.md`에서 보안 제보 경로를 다시 정리해야 한다.
- 새 community health file은 branch-local 상태에서는 Community Profile API에 반영되지 않는다. PR merge 후 default branch 기준으로 최종 확인해야 한다.

## 다음 단계 영향

- Stage 3에서는 `.github/ISSUE_TEMPLATE/task.yml`과 필요 시 `.github/ISSUE_TEMPLATE/config.yml`을 다룬다.
- Stage 2 문서가 외부 기여의 기본 경계를 잡았으므로, Stage 3 issue template 문구는 이 문서와 충돌하지 않게 유지해야 한다.
- Stage 4에서 README community 링크를 정리할 때 `CONTRIBUTING.md`와 `CODE_OF_CONDUCT.md`를 연결할 수 있다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3으로 진행한다.
