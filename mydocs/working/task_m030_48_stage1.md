# Task #48 Stage 1 보고서 - 첫 main release 기준 확정

GitHub Issue: [#48](https://github.com/postmelee/crop/issues/48)
구현계획서: [`task_m030_48_impl.md`](../plans/task_m030_48_impl.md)
Stage: 1

## 단계 목적

이번 Stage는 첫 Chrome Web Store 제출을 위한 release 기준을 정하기 전에 현재 GitHub 원격 상태를 확인하는 단계다. 특히 원격 `main` 브랜치가 없는 상태에서 #46 runbook의 `devel -> main` release PR 경로를 그대로 적용할 수 있는지, 아니면 첫 `main` bootstrap 예외가 필요한지를 확인했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/working/task_m030_48_stage1.md` | 원격 branch/default branch/PR #47/GitHub Release 현황과 첫 release 기준 판단 기록 |

## 본문 변경 정도 / 본문 무손실 여부

이번 Stage는 소스 코드와 제품 문서를 수정하지 않았다. `mydocs/working/`에 Stage 1 실행 결과와 판단만 신규 기록했다.

## 확인 결과

| 항목 | 결과 | 판단 |
|---|---|---|
| 현재 작업 브랜치 | `local/task48` | OK |
| `origin/devel` | `53808a2 Merge pull request #47 from postmelee/publish/task46` | OK |
| 원격 `main` | 없음 | 첫 release bootstrap 예외 필요 |
| GitHub default branch | `devel` | 현재 public 기준은 `devel` |
| PR #47 | `MERGED`, base `devel`, merge commit `53808a2147c120e67f7bb93b737b2f6d0526d6f4` | OK |
| PR #47 CI | `Build, test, and package` 성공 | OK |
| GitHub Release 목록 | 없음 | `v0.1.0` Release 신규 생성 필요 |
| 작업 트리 | clean | OK |

## 첫 release 기준 판단

첫 release 기준 commit은 PR #47 merge commit인 `53808a2147c120e67f7bb93b737b2f6d0526d6f4`로 둔다.

원격 `main`이 아직 없으므로 첫 release에는 다음 bootstrap 예외가 필요하다.

1. `main` 브랜치를 `origin/devel`의 `53808a2` commit에서 최초 생성한다.
2. 이후 반복 release는 #46 runbook의 `devel -> main` release PR 경로로 되돌린다.
3. package 검증은 이 release 기준 commit에서 수행한다.
4. tag/GitHub Release는 manifest version `0.1.0`과 맞춰 `v0.1.0` 후보를 사용한다.
5. Chrome Web Store Dashboard에 제출할 privacy policy URL 후보는 `main` 생성 후 `https://github.com/postmelee/crop/blob/main/PRIVACY.md`, tag 생성 후 `https://github.com/postmelee/crop/blob/v0.1.0/PRIVACY.md` 둘 다 확인한 뒤 최종 보고서에 남긴다.

이번 Stage에서는 원격 `main`, tag, GitHub Release, Release asset을 생성하지 않았다.

## 검증 결과

실행 명령:

```bash
git fetch origin
git status --short --branch
git branch -vv --all
git ls-remote --heads origin main devel
gh api repos/postmelee/crop --jq '.default_branch, .html_url'
gh pr view 47 --repo postmelee/crop --json number,title,state,baseRefName,headRefName,mergeCommit,url,statusCheckRollup
gh release list --repo postmelee/crop --limit 10
git show --no-patch --oneline origin/devel
git diff --check
```

결과:

- OK: `git fetch origin` 통과.
- OK: `git status --short --branch` 결과는 `## local/task48`.
- OK: `git branch -vv --all`에서 `origin/devel`은 `53808a2`, `origin/HEAD -> origin/devel`, 원격 `main` 추적 branch 없음.
- OK: `git ls-remote --heads origin main devel` 결과는 `refs/heads/devel`만 출력.
- OK: `gh api repos/postmelee/crop --jq '.default_branch, .html_url'` 결과는 `devel`, `https://github.com/postmelee/crop`.
- OK: `gh pr view 47` 결과는 `MERGED`, base `devel`, head `publish/task46`, merge commit `53808a2147c120e67f7bb93b737b2f6d0526d6f4`, CI success.
- OK: `gh release list --repo postmelee/crop --limit 10` 결과는 빈 출력으로 기존 Release 없음.
- OK: `git show --no-patch --oneline origin/devel` 결과는 `53808a2 Merge pull request #47 from postmelee/publish/task46`.
- OK: `git diff --check` 통과.

네트워크 제한으로 일부 GitHub 조회는 sandbox 안에서 1차 실패 후 승인 경로로 재실행했다. 재실행 결과는 모두 OK다.

## 잔여 위험

- 원격 `main` 최초 생성은 저장소 공개 기준을 바꾸는 작업이므로 다음 단계에서 명시 승인 후에만 수행해야 한다.
- GitHub default branch는 아직 `devel`이다. 첫 `main` 생성 후 default branch를 바꿀지 여부는 이번 task 범위에 포함하지 않는다.
- `v0.1.0` tag와 Release는 아직 없으므로 Stage 3에서 기존 tag 충돌 여부를 다시 확인해야 한다.
- Dashboard 실제 `Submit for review`는 이번 task 범위에서 제외된다.

## 다음 단계 영향

- Stage 2는 release 기준 commit `53808a2`에서 package를 fresh 생성하고 checksum을 고정한다.
- Stage 3에서는 승인된 bootstrap 방향에 따라 원격 `main`을 `53808a2`에서 최초 생성하고, `v0.1.0` tag/GitHub Release와 ZIP asset을 동기화한다.
- Chrome Web Store privacy URL은 `main` 또는 `v0.1.0` URL이 실제 접근 가능한지 확인된 뒤 최종 보고서에서 제출 후보로 확정한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2로 진행한다.
- 다음 승인 후에는 release 기준 commit `53808a2`에서 package 검증을 수행하고, 후속 Stage 3에서 원격 `main` 최초 생성과 `v0.1.0` Release 생성을 준비한다.
