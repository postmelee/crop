# Task #72 최종 보고서 - 다음 릴리즈 후보 정리와 devel -> main 승격 준비

GitHub Issue: [#72](https://github.com/postmelee/crop/issues/72)
마일스톤: M030

## 작업 요약

- 대상 이슈: #72
- 마일스톤: M030
- 단계 수: 4
- 작업 목적: 다음 release 후보를 `v0.1.1`로 정리하고, package 검증값, GitHub Release body 후보, `devel -> main` Release PR 본문 후보를 준비한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `package.json` | package version을 `0.1.0`에서 `0.1.1`로 변경 | release/package metadata |
| `manifest.json` | Chrome extension manifest version을 `0.1.0`에서 `0.1.1`로 변경 | Chrome extension metadata |
| `mydocs/orders/20260613.md` | Task #72 시작과 Stage 1 상태 기록 | 내부 작업 보드 |
| `mydocs/orders/20260614.md` | Stage 2~4 진행 상태와 PR 게시 승인 대기 상태 기록 | 내부 작업 보드 |
| `mydocs/plans/task_m030_72.md` | 수행계획서 작성 | 내부 작업 산출물 |
| `mydocs/plans/task_m030_72_impl.md` | Stage 1~4 구현계획서 작성 | 내부 작업 산출물 |
| `mydocs/tech/task_m030_72_release_candidate.md` | release 후보 범위, version 판단, GitHub Release body 후보, Release PR 본문 후보, package checksum, Stage 4 준비 상태 기록 | release 준비 기술 노트 |
| `mydocs/working/task_m030_72_stage1.md` | release 후보 범위와 version 판단 결과 기록 | 내부 작업 산출물 |
| `mydocs/working/task_m030_72_stage2.md` | version bump와 release candidate 초안 작성 결과 기록 | 내부 작업 산출물 |
| `mydocs/working/task_m030_72_stage3.md` | package validation 결과 기록 | 내부 작업 산출물 |
| `mydocs/working/task_m030_72_stage4.md` | 최종 release PR 준비 보고 기록 | 내부 작업 산출물 |
| `mydocs/report/task_m030_72_report.md` | 최종 결과 보고서 작성 | 내부 작업 산출물 |

## 문서 위치 검증

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `mydocs/tech/task_m030_72_release_candidate.md` | `mydocs/tech/` | `mydocs/tech/task_m030_72_release_candidate.md` | OK | release 후보 판단과 공개 body 후보를 task-specific 기술 노트에 두기로 한 구현계획서와 일치 |
| `mydocs/plans/task_m030_72.md` | `mydocs/plans/` | `mydocs/plans/task_m030_72.md` | OK | 수행계획서 산출물 |
| `mydocs/plans/task_m030_72_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_72_impl.md` | OK | 구현계획서 산출물 |
| `mydocs/working/task_m030_72_stage{N}.md` | `mydocs/working/` | `task_m030_72_stage1.md`~`task_m030_72_stage4.md` | OK | 단계별 완료 보고서 산출물 |
| `mydocs/report/task_m030_72_report.md` | `mydocs/report/` | `mydocs/report/task_m030_72_report.md` | OK | 최종 보고서 산출물 |
| 공식 사용자 문서 루트 | 새로 만들지 않음 | 해당 없음 | OK | 이번 task는 release 준비 문서 작업이며 `docs/`, `specs/`, `site/`, `website/`, `adr/` 루트를 새로 만들지 않음 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| package version | `0.1.0` | `0.1.1` |
| manifest version | `0.1.0` | `0.1.1` |
| 최신 공개 tag | `v0.1.0` | 변경 없음 |
| release 후보 tag | 없음 | `v0.1.1` 후보 |
| Chrome Web Store package 후보 | `/tmp/crop-0.1.0-cws.zip` | `/tmp/crop-0.1.1-cws.zip` |
| package asset size | 미확정 | 451,909 bytes |
| package uncompressed size | 미확정 | 450,333 bytes |
| package SHA-256 | 미확정 | `57ab12022f97f7b90d91d258434bf5f0010f562c03328e6d7d23df3ae4f59aa3` |
| package ZIP entries | 미확정 | 13 files |
| test 결과 | 미확정 | 17 files, 230 tests passed |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| release version이 승인되어 있고 version 파일이 그 기준과 일치한다. | OK — Stage 1 승인 version `0.1.1`을 `package.json`과 `manifest.json`에 반영했다. |
| release body 후보에 template 잔여 표식이 남아 있지 않다. | OK — Stage 2에서 잔여 표식 grep 출력 없음. |
| 사용자 안내에는 실제 사용자-facing 변경과 known limitations만 들어간다. | OK — selected stitching 검정 영역 보정, Always scroll bars 우측 여백 보정, 사용자 버그 제보 Issue Form, README/asset 보강과 known limitations를 분리했다. |
| developer 검증 기록에는 포함 PR/Issue, asset 후보, checksum, verification 결과가 들어간다. | OK — release 후보 문서에 포함 PR/Issue, `crop-0.1.1-cws.zip`, SHA-256, build/typecheck/test/package/verify 결과를 기록했다. |
| `devel -> main` Release PR 전에 필요한 로컬 검증이 통과한다. | OK — `npm run build`, `npm run typecheck`, `npm test`, `npm run package:cws`, `npm run verify:cws` 통과. |
| `debugger`, `<all_urls>`, broad `host_permissions`, manifest `tabs` 권한이 추가되지 않는다. | OK — manifest permission은 `activeTab`, `scripting`, `clipboardWrite`, `downloads`; `host_permissions` 없음. |
| Chrome Web Store package upload와 `Submit for review`를 수행하지 않는다. | OK — package 생성과 검증만 수행했고 upload/submit은 수행하지 않았다. |
| `main` merge, tag 생성, GitHub Release 생성은 별도 명시 승인 전 수행하지 않는다. | OK — 모두 수행하지 않았다. |
| main 전용 README asset 삭제를 release 의도로 오인하지 않는다. | OK — 2-dot tree diff의 asset 삭제 표시는 주의 항목으로 기록했고, 3-dot PR diff에서 `assets/`와 README 계열 삭제 출력이 없음을 확인했다. |

### 단계별 검증 결과

- Stage 1: [`task_m030_72_stage1.md`](../working/task_m030_72_stage1.md) — `origin/main`/`origin/devel` 변경, version 후보, 권한 경계, release 후보 범위 확인.
- Stage 2: [`task_m030_72_stage2.md`](../working/task_m030_72_stage2.md) — `package.json`/`manifest.json` `0.1.1` 반영, GitHub Release body 후보와 Release PR 본문 후보 작성, 잔여 표식 검사 통과.
- Stage 3: [`task_m030_72_stage3.md`](../working/task_m030_72_stage3.md) — build/typecheck/test/package/verify 통과, ZIP contents, permission, SHA-256 확인.
- Stage 4: [`task_m030_72_stage4.md`](../working/task_m030_72_stage4.md) — 최종 release PR 준비 상태, 보류 승인 항목, Chrome Web Store 제외 범위 확인.

## 잔여 위험과 후속 작업

### 잔여 위험

- Task #72 커밋은 아직 `origin/devel`에 merge되지 않았다. 최종 보고서 승인 후 `publish/task72` 브랜치와 `devel` 대상 PR 게시 절차가 필요하다.
- `devel -> main` Release PR은 아직 생성하지 않았다. Task #72 PR merge 후 별도 명시 승인으로 진행해야 한다.
- `v0.1.1` tag와 GitHub Release는 아직 생성하지 않았다. tag 기반 privacy URL과 release asset URL은 tag 생성 후 최종 확인해야 한다.
- Chrome Web Store upload와 `Submit for review`는 작업지시자가 직접 진행한다.
- `origin/main..local/task72` 2-dot tree diff는 main 전용 asset을 삭제처럼 표시한다. 실제 Release PR 생성 전에도 3-dot PR diff와 merge 결과에서 main 전용 README asset 보존 여부를 다시 확인해야 한다.

### 후속 작업 후보

- 최종 보고서 승인 후 `task-final-report` 절차로 `publish/task72` 브랜치 push와 `devel` 대상 PR 게시.
- Task #72 PR merge 후 별도 승인으로 `devel -> main` Release PR 생성.
- `main` merge 후 별도 승인으로 `v0.1.1` tag, GitHub Release, asset upload 진행.
- Chrome Web Store 새 제출은 작업지시자가 직접 진행.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 Task #72 PR 게시 절차로 진행한다.
- `devel -> main` Release PR 생성, `main` merge, tag/GitHub Release 생성, Chrome Web Store 제출은 이 승인과 별개로 각각 명시 승인 후 진행한다.
