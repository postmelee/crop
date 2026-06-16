# Task #77 Stage 2 보고서 - Release body와 배포 문서 보정

GitHub Issue: [#77](https://github.com/postmelee/crop/issues/77)
구현계획서: [`task_m030_77_impl.md`](../plans/task_m030_77_impl.md)
Stage: 2

## 단계 목적

Stage 2는 Stage 1에서 확정한 보정안에 따라 GitHub Release `v0.1.1` body를 Chrome Web Store published 상태로 수정하고, 반복 release 운영 문서의 package path 하드코딩을 version 기반 예시로 바꾸는 단계다.

또한 #37 Dashboard 기술 노트와 #72 release candidate 기술 노트는 과거 기록을 덮어쓰지 않고 최신 상태 주석/게시 후 확인 섹션만 추가했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| GitHub Release `v0.1.1` body | Chrome Web Store 상태를 `not submitted`에서 `published`로 보정하고 후속 작업 문구를 게시 완료 상태로 수정 |
| `mydocs/manual/release_pipeline_guide.md` | 반복 release 절차의 `/tmp/crop-0.1.0-cws.zip` 예시를 `/tmp/crop-{version}-cws.zip`로 일반화 |
| `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md` | #37 문서가 `v0.1.0` Dashboard 제출 준비 스냅샷임을 밝히는 최신 상태 주석 추가 |
| `mydocs/tech/task_m030_72_release_candidate.md` | `v0.1.1` GitHub Release와 Chrome Web Store published 상태를 확인했다는 게시 후 확인 섹션 추가 |
| `mydocs/working/task_m030_77_stage2.md` | Stage 2 변경과 검증 결과 기록 |
| `mydocs/orders/20260616.md` | #77 비고를 Stage 2 완료 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

GitHub Release `v0.1.1` body는 기존 구조와 developer 검증 기록을 유지하고 Chrome Web Store 상태/업데이트/follow-up 문구만 보정했다. tag, release title/name, draft/prerelease 상태, release commit, asset 이름, asset URL, asset size, SHA-256 checksum, verification 결과 표는 변경하지 않았다.

`release_pipeline_guide.md`는 반복 release 절차에 남아 있던 특정 version package path만 일반화했다. #37/#72 기술 노트는 원문 이력을 보존했고, 최신 상태는 새 섹션으로 분리했다.

## 검증 결과

실행 명령:

```bash
gh release edit v0.1.1 --repo postmelee/crop --notes-file /private/tmp/crop-task77-v011-release-body-stage2.md
gh release view v0.1.1 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,assets,body
rg -n "not submitted|published|crop-0.1.0-cws.zip|crop-\\{version\\}-cws.zip|/tmp/crop-\\{version\\}-cws.zip" mydocs/manual/release_pipeline_guide.md mydocs/tech/task_m030_37_chrome_web_store_dashboard.md mydocs/tech/task_m030_72_release_candidate.md
rg -n "Chrome Web Store|published|v0.1.1|asset|SHA-256|Submit for review|수행하지" mydocs/working/task_m030_77_stage2.md
git diff --check
```

결과:

- OK: `gh release edit`가 `https://github.com/postmelee/crop/releases/tag/v0.1.1`를 반환했다.
- OK: Release body의 사용자 안내가 `Chrome Web Store: published for v0.1.1`, `Store 상태: published`, `확인일: 2026-06-16`로 보정됐다.
- OK: Release body의 업데이트 방식이 신규 설치 가능 및 Chrome Web Store 자동 업데이트 기준으로 보정됐다.
- OK: Release body의 follow-up이 `해당 없음. v0.1.1 Chrome Web Store review 통과와 게시를 확인했다.`로 보정됐다.
- OK: Release metadata는 `tagName=v0.1.1`, `name=crop v0.1.1`, `isDraft=false`, `isPrerelease=false`로 유지됐다.
- OK: Release asset은 `crop-0.1.1-cws.zip`, 451,909 bytes, SHA-256 `57ab12022f97f7b90d91d258434bf5f0010f562c03328e6d7d23df3ae4f59aa3`, state `uploaded`로 유지됐다.
- OK: `release_pipeline_guide.md`에서 package path 예시는 `/tmp/crop-{version}-cws.zip`로 확인됐다.
- OK: #37 기술 노트에 최신 상태 주석을 추가했고, 기존 `/tmp/crop-0.1.0-cws.zip` 문구는 #37 당시 스냅샷으로 보존했다.
- OK: #72 기술 노트에 게시 후 확인 섹션을 추가했고, 기존 `not submitted` 문구는 release candidate 당시 기록으로 보존했다.
- OK: `git diff --check` 통과.

## 보정 전후 핵심 차이

| 위치 | 보정 전 | 보정 후 |
|---|---|---|
| Release body 설치 / 업데이트 | `Chrome Web Store: not submitted for v0.1.1` | `Chrome Web Store: published for v0.1.1` |
| Release body 업데이트 방식 | `Chrome Web Store 제출과 review 완료 후 자동 업데이트 후보` | `Chrome Web Store에서 신규 설치 가능하며 기존 설치는 Chrome Web Store 자동 업데이트 기준을 따른다.` |
| Release body Store 상태 | `not submitted` | `published` |
| Release body 확인일 | `2026-06-14` | `2026-06-16` |
| Release body 후속 작업 | Chrome Web Store upload와 `Submit for review` 직접 진행 | 해당 없음. review 통과와 게시 확인 |
| release pipeline package path | `/tmp/crop-0.1.0-cws.zip` | `/tmp/crop-{version}-cws.zip` |

## 잔여 위험

- GitHub Release body는 원격 객체이므로 저장소 diff에 직접 포함되지 않는다. Stage 2와 최종 보고서에서 조회 결과를 근거로 보존한다.
- #37/#72 문서에는 과거 상태인 `/tmp/crop-0.1.0-cws.zip`와 `not submitted`가 남아 있다. 이는 이력 보존 목적이며, 최신 기준은 추가 주석과 GitHub Release body를 따른다.
- Chrome Web Store Dashboard 내부 상태는 이 단계에서 조작하거나 조회하지 않았다. 공개 listing과 작업지시자의 게시 완료 통지를 기준으로 삼는다.

## 다음 단계 영향

- Stage 3에서는 Release body가 published 상태를 유지하는지 다시 확인한다.
- Web Store listing URL 접근성과 README/PRIVACY 수정 불필요 근거를 최종 보고서에 정리한다.
- `release_pipeline_guide.md`, #37/#72 기술 노트 변경이 의도대로 이력 보존과 최신 기준 분리를 달성했는지 통합 검증한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 통합 검증과 최종 보고로 진행한다.
