# Task #48 최종 보고서 - 첫 main 릴리즈와 Chrome Web Store 제출본 동기화

GitHub Issue: [#48](https://github.com/postmelee/crop/issues/48)
마일스톤: M030

## 작업 요약

- 대상 이슈: #48
- 마일스톤: M030
- 단계 수: 4
- 작업 목적: 첫 Chrome Web Store 제출 전에 `main`/tag 기준 privacy URL과 GitHub Release asset, Dashboard 업로드 후보 ZIP을 같은 release 기준으로 동기화한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| `mydocs/orders/20260607.md` | #48 진행/완료 상태 기록 | 오늘할일 보드 |
| `mydocs/plans/task_m030_48.md` | 수행계획서 작성 | task 범위와 승인 기준 |
| `mydocs/plans/task_m030_48_impl.md` | 구현계획서 작성 | Stage별 산출물/검증/커밋 경계 |
| `mydocs/working/task_m030_48_stage1.md` | 원격 `main` 부재, PR #47 merge, Release 부재 확인 | 첫 release bootstrap 판단 근거 |
| `mydocs/working/task_m030_48_stage2.md` | build/typecheck/test/package/verify와 ZIP checksum 기록 | Chrome Web Store upload 후보 검증 |
| `mydocs/working/task_m030_48_stage3.md` | 원격 `main`, `v0.1.0` tag/Release/asset, privacy URL 확인 기록 | GitHub Release와 Dashboard 후보 동기화 근거 |
| `mydocs/report/task_m030_48_report.md` | 최종 보고서 작성 | PR 게시 전 승인 자료 |
| GitHub branch `main` | `53808a2147c120e67f7bb93b737b2f6d0526d6f4`에서 최초 생성 | release 기준 branch |
| GitHub tag `v0.1.0` | `53808a2147c120e67f7bb93b737b2f6d0526d6f4` 기준 생성 | release 고정 기준 |
| GitHub Release `v0.1.0` | `crop v0.1.0` Release와 asset 생성 | 제출 artifact 배포 기준 |

## 문서 위치 검증

이번 task는 제품/사용자-facing 기능 문서를 만들지 않았다. 수행계획서의 문서 위치 판단대로 release 실행 기록과 제출 증빙은 `mydocs/working/`과 `mydocs/report/`에 작성했다.

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| `mydocs/working/task_m030_48_stage1.md` | `mydocs/working/` | `mydocs/working/task_m030_48_stage1.md` | OK | 첫 `main` bootstrap 판단은 일회성 단계 기록 |
| `mydocs/working/task_m030_48_stage2.md` | `mydocs/working/` | `mydocs/working/task_m030_48_stage2.md` | OK | package 검증 로그와 checksum 단계 기록 |
| `mydocs/working/task_m030_48_stage3.md` | `mydocs/working/` | `mydocs/working/task_m030_48_stage3.md` | OK | Release asset과 privacy URL 확인 단계 기록 |
| `mydocs/report/task_m030_48_report.md` | `mydocs/report/` | `mydocs/report/task_m030_48_report.md` | OK | Dashboard 제출 직전 근거와 잔여 위험 최종 정리 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| 원격 `main` branch | 없음 | `53808a2147c120e67f7bb93b737b2f6d0526d6f4` |
| GitHub tag | 없음 | `v0.1.0` |
| GitHub Release | 없음 | `https://github.com/postmelee/crop/releases/tag/v0.1.0` |
| Release asset | 없음 | `crop-0.1.0-cws.zip`, 438,474 bytes |
| Release asset SHA-256 | 없음 | `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15` |
| CWS ZIP contents | #46 dry-run 기준 13 files | release asset 기준 13 files |
| 자동 테스트 | #47 CI 성공 | local Stage 2: 17 files, 213 tests passed |
| privacy URL 후보 | `main` 후보만 있었으나 원격 `main` 없음 | `v0.1.0` tag URL과 `main` URL 모두 접근 확인 |
| Chrome Web Store `Submit for review` | 미수행 | 미수행 |

## 제출 기준 값

| 항목 | 값 |
|---|---|
| Release 기준 commit | `53808a2147c120e67f7bb93b737b2f6d0526d6f4` |
| Release URL | `https://github.com/postmelee/crop/releases/tag/v0.1.0` |
| Release asset URL | `https://github.com/postmelee/crop/releases/download/v0.1.0/crop-0.1.0-cws.zip` |
| Dashboard upload 후보 | `/tmp/crop-0.1.0-cws.zip` 또는 Release asset `crop-0.1.0-cws.zip` |
| ZIP SHA-256 | `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15` |
| ZIP size | `438,474` bytes |
| Privacy policy URL 1차 후보 | `https://github.com/postmelee/crop/blob/v0.1.0/PRIVACY.md` |
| Privacy policy URL branch 후보 | `https://github.com/postmelee/crop/blob/main/PRIVACY.md` |
| `PRIVACY.md` contents SHA | `29f580ed98e124904268a7d9225b2cc8cfda6722` |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| 원격 `main`이 없다는 현재 상태를 Stage 1에서 확인하고 첫 release bootstrap 방법을 확정한다 | OK — Stage 1에서 원격 `main` 없음, default branch `devel`, PR #47 merge commit `53808a2` 확인 |
| `main` 또는 release tag 기준 `PRIVACY.md` URL이 접근 가능한 제출 후보로 확인된다 | OK — `main`과 `v0.1.0` 기준 URL 모두 GitHub contents API로 확인 |
| release 기준에서 `/tmp/crop-0.1.0-cws.zip`이 fresh 생성되고 `npm run verify:cws`를 통과한다 | OK — Stage 2에서 build/package/verify 통과, ZIP 13 files 생성 |
| ZIP root에 `manifest.json`이 있고 repository root 문서/config, `mydocs`, `node_modules`, `.DS_Store`, `__MACOSX`가 없다 | OK — `unzip -Z1`와 `verify:cws`로 확인 |
| manifest 권한이 `activeTab`, `scripting`, `clipboardWrite`, `downloads` 범위를 유지한다 | OK — `dist/manifest.json` 확인 결과 expected permissions와 empty `host_permissions` |
| GitHub Release asset과 Dashboard upload 후보 파일이 checksum으로 같은 파일임을 확인한다 | OK — local ZIP과 downloaded Release asset SHA-256이 동일 |
| Chrome Web Store `Submit for review`는 이번 task에서 수행하지 않는다 | OK — Dashboard upload와 review submit 모두 미수행 |

### 단계별 검증 결과

- Stage 1: [`task_m030_48_stage1.md`](../working/task_m030_48_stage1.md) — 원격 `main` 없음, default branch `devel`, PR #47 merge commit `53808a2`, Release 없음 확인.
- Stage 2: [`task_m030_48_stage2.md`](../working/task_m030_48_stage2.md) — build/typecheck/test/package/verify 통과, ZIP SHA-256 `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15` 고정.
- Stage 3: [`task_m030_48_stage3.md`](../working/task_m030_48_stage3.md) — `main`, `v0.1.0` tag/Release/asset 생성, privacy URL과 asset checksum 확인.
- Stage 4: 최종 보고서 작성, 오늘할일 완료 처리, 최종 grep/status/diff 검증 수행.

## Stage 4 통합 검증 상세

| 검증 | 결과 |
|---|---|
| `git ls-remote --heads origin main devel` | OK — `main`과 `devel` 모두 `53808a2147c120e67f7bb93b737b2f6d0526d6f4` |
| `git ls-remote --tags origin v0.1.0` | OK — `v0.1.0`이 `53808a2147c120e67f7bb93b737b2f6d0526d6f4` |
| `gh release view v0.1.0` | OK — Release asset `crop-0.1.0-cws.zip`, size `438474`, digest `sha256:84c69f...` |
| `gh api repos/postmelee/crop/contents/PRIVACY.md?ref=main` | OK — URL과 contents SHA 확인 |
| `gh api repos/postmelee/crop/contents/PRIVACY.md?ref=v0.1.0` | OK — URL과 contents SHA 확인 |
| `shasum -a 256 /tmp/crop-0.1.0-cws.zip /tmp/crop-release-check-48-stage3/crop-0.1.0-cws.zip` | OK — local ZIP과 Release download checksum 동일 |
| `wc -c /tmp/crop-0.1.0-cws.zip /tmp/crop-release-check-48-stage3/crop-0.1.0-cws.zip` | OK — 둘 다 `438474` bytes |
| `rg -n "Submit for review|PRIVACY.md|crop-0.1.0-cws.zip|v0.1.0|checksum|SHA-256|GitHub Release|Dashboard" ...` | OK — 단계/최종 보고서에서 제출 근거와 미수행 범위 확인 |
| `git diff --check` | OK — whitespace 경고 없음 |

## 잔여 위험과 후속 작업

### 잔여 위험

- GitHub default branch는 아직 `devel`이다. 이번 task 범위에는 default branch 변경을 포함하지 않았다.
- Chrome Web Store Dashboard에는 아직 ZIP을 업로드하지 않았고, `Submit for review`도 수행하지 않았다.
- Store Dashboard에 ZIP 업로드 후 표시되는 권한이 문서화된 권한과 일치하는지 실제 화면에서 다시 확인해야 한다.
- deferred publishing 선택, small promotional image, localized asset, privacy disclosure 저장 상태는 Dashboard에서 작업지시자가 최종 확인해야 한다.
- `main`이 최초 생성됐으므로 이후 release는 #46 runbook의 `devel -> main` release PR 경로를 사용해야 한다.

### 후속 작업 후보

- Chrome Web Store Dashboard에 `crop-0.1.0-cws.zip` 업로드.
- Dashboard privacy policy URL에 `https://github.com/postmelee/crop/blob/v0.1.0/PRIVACY.md` 입력.
- Dashboard package 권한 표시, privacy disclosure, asset, deferred publishing 상태 최종 확인.
- 작업지시자 별도 승인 후 Chrome Web Store `Submit for review` 진행.
- 필요 시 GitHub default branch를 `main`으로 전환할지 별도 운영 task로 판단.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
- Chrome Web Store `Submit for review`는 이번 보고 승인만으로 수행하지 않으며, 별도 명시 승인이 필요하다.
