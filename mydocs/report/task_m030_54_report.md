# Task #54 최종 보고서 - v0.1.0 GitHub Release body 소급 표준화

GitHub Issue: [#54](https://github.com/postmelee/crop/issues/54)
마일스톤: M030

## 작업 요약

- 대상 이슈: #54
- 마일스톤: M030
- 단계 수: 4
- 작업 목적: 기존 GitHub Release `v0.1.0` body를 #50 release note 템플릿 구조에 맞춰 소급 표준화한다.

## 변경 파일 목록과 영향 범위

| 경로 | 변경 요약 | 영향 범위 |
|---|---|---|
| GitHub Release `v0.1.0` body | 기존 단일 문단 body를 `user 안내`와 `developer 검증 기록` 분리 구조로 업데이트 | 공개 GitHub Release body |
| `mydocs/orders/20260608.md` | #54 진행 상태를 완료 후보로 갱신 | 오늘할일 보드 |
| `mydocs/plans/task_m030_54.md` | 수행계획서 작성 | task 범위와 승인 기준 |
| `mydocs/plans/task_m030_54_impl.md` | 구현계획서 작성 | Stage별 산출물/검증/커밋 경계 |
| `mydocs/tech/task_m030_54_v010_release_body.md` | 현재 body, 기준값, 공개 body 초안, update 전후 비교, 검증 로그 기록 | task-specific 기술 근거 |
| `mydocs/working/task_m030_54_stage1.md` | 현재 release 상태와 기준값 확인 보고 | 단계 기록 |
| `mydocs/working/task_m030_54_stage2.md` | 공개 body 초안 작성 보고 | 단계 기록 |
| `mydocs/working/task_m030_54_stage3.md` | 원격 Release body 반영과 불변 항목 검증 보고 | 단계 기록 |
| `mydocs/working/task_m030_54_stage4.md` | 통합 검증과 최종 보고 단계 기록 | 단계 기록 |
| `mydocs/report/task_m030_54_report.md` | 최종 보고서 작성 | PR 게시 전 승인 자료 |

## 문서 위치 검증

이번 task는 GitHub Release body라는 공개 플랫폼 산출물을 수정했지만, 저장소 안에 남기는 산출물은 task-specific 운영 기록과 검증 근거다. 수행계획서의 문서 위치 판단대로 공식 사용자 문서 루트는 새로 만들지 않았다.

| 파일 | 계획된 위치 | 실제 위치 | 결과 | 근거 |
|---|---|---|---|---|
| GitHub Release `v0.1.0` body | GitHub Release | GitHub Release `v0.1.0` | OK | 공개 Release body가 진실 원천이며 Stage 3에서 승인 초안만 반영 |
| `mydocs/tech/task_m030_54_v010_release_body.md` | `mydocs/tech/` | `mydocs/tech/task_m030_54_v010_release_body.md` | OK | 현재 body, 기준값, 초안, update 전후 비교를 재사용 가능한 근거로 보관 |
| `mydocs/working/task_m030_54_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_54_stage1.md` ~ `task_m030_54_stage4.md` | OK | 단계 보고서 표준 위치 |
| `mydocs/report/task_m030_54_report.md` | `mydocs/report/` | `mydocs/report/task_m030_54_report.md` | OK | 최종 보고서 표준 위치 |

## 변경 전·후 정량 비교

| 지표 | 변경 전 | 변경 후 |
|---|---|---|
| GitHub Release body 구조 | 단일 문단 | `# crop v0.1.0`, `user 안내`, `developer 검증 기록` 구조 |
| Chrome Web Store 상태 표기 | submission candidate 문맥만 있음 | `published`와 Store URL 포함 |
| privacy URL | 없음 | `https://github.com/postmelee/crop/blob/v0.1.0/PRIVACY.md` |
| asset URL | 없음 | `https://github.com/postmelee/crop/releases/download/v0.1.0/crop-0.1.0-cws.zip` |
| asset size | 없음 | `438474 bytes` |
| SHA-256 checksum | 있음 | 동일 checksum 유지 |
| verification 결과 표 | 없음 | build/typecheck/test/package/verify/ZIP/privacy/Store URL 결과 포함 |
| Release tag | `v0.1.0` | `v0.1.0` |
| Release name/title | `crop v0.1.0` | `crop v0.1.0` |
| Draft/prerelease | `false` / `false` | `false` / `false` |
| Release asset | `crop-0.1.0-cws.zip`, `438474 bytes` | 동일 |

## 검증 결과

| 수용 기준 | 결과 |
|---|---|
| `v0.1.0` GitHub Release body가 #50 템플릿의 사용자 안내와 developer 검증 기록 분리 구조를 따른다 | OK — 원격 body에서 `user 안내`와 `developer 검증 기록` 구조 확인 |
| Chrome Web Store 상태, privacy URL, release asset, SHA-256 checksum, verification 결과가 body에 포함된다 | OK — Stage 3/4 `gh release view`와 기술 노트 grep에서 확인 |
| release asset과 tag/commit 기준은 기존 `v0.1.0` release와 일치한다 | OK — tag `v0.1.0`, commit `53808a2147c120e67f7bb93b737b2f6d0526d6f4`, asset size/checksum 일치 |
| release body 수정 전후 차이와 검증 결과가 task 산출물에 남는다 | OK — `mydocs/tech/task_m030_54_v010_release_body.md`, Stage 1~4 보고서에 기록 |
| release asset, tag, version, Dashboard 상태는 변경되지 않는다 | OK — asset metadata/tag/version 불변 확인, Chrome Web Store Dashboard 작업 미수행 |
| `git diff --check`가 경고 없이 통과한다 | OK — Stage 1~4에서 통과 |

### 단계별 검증 결과

- Stage 1: [`task_m030_54_stage1.md`](../working/task_m030_54_stage1.md) — 원격 Release metadata/body, asset checksum, privacy URL, Chrome Web Store URL HTTP 200 확인.
- Stage 2: [`task_m030_54_stage2.md`](../working/task_m030_54_stage2.md) — #50 템플릿 구조로 공개 body 초안 작성, 필수 키워드와 placeholder 금지 패턴 검증 통과.
- Stage 3: [`task_m030_54_stage3.md`](../working/task_m030_54_stage3.md) — 승인 초안을 원격 Release body에 반영, tag/title/asset/draft/prerelease 불변 및 asset checksum 재확인.
- Stage 4: [`task_m030_54_stage4.md`](../working/task_m030_54_stage4.md) — 원격 Release 재조회, 통합 grep, 제외 범위 grep, `git diff --check`, `git status --short` 확인.

## Stage 4 통합 검증 상세

| 검증 | 결과 |
|---|---|
| `gh release view v0.1.0 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,assets,body` | OK — body 구조, tag/name/url, draft/prerelease, asset metadata 확인 |
| `rg -n "v0.1.0|checksum|privacy|Chrome Web Store|asset|verification|SHA-256|user 안내|developer 검증 기록|#54" mydocs/tech mydocs/working mydocs/report` | OK — 기술 노트, 단계 보고서, 최종 보고서에서 필수 문맥 확인 |
| `rg -n "새 tag|새 GitHub Release|asset 교체|version bump|Chrome Web Store Dashboard|변경하지|제외" mydocs/working/task_m030_54_stage4.md mydocs/report/task_m030_54_report.md` | OK — 제외 범위와 변경하지 않은 항목 확인 |
| `git diff --check` | OK — whitespace 경고 없음 |
| `git status --short` | OK — Stage 4 산출물만 미커밋 변경으로 확인 후 단계 커밋 예정 |

## 제외 범위 확인

- 새 tag 또는 새 GitHub Release는 생성하지 않았다.
- release asset 교체, 삭제, 재업로드는 수행하지 않았다.
- version bump 정책은 변경하지 않았다.
- release 자동화 workflow는 도입하지 않았다.
- Chrome Web Store Dashboard 제출, upload, 상태 변경은 수행하지 않았다.
- #50 템플릿 구조는 재설계하지 않았다.
- README, manifest, privacy policy 본문, source code는 변경하지 않았다.

## 잔여 위험과 후속 작업

### 잔여 위험

- GitHub Release body는 Stage 3에서 이미 공개 변경됐다. 되돌림이 필요하면 Stage 1 기술 노트에 보존된 기존 body 또는 별도 승인된 수정 body로 다시 `gh release edit --notes-file`을 수행해야 한다.
- Chrome Web Store URL HTTP 확인은 CLI 접근성 확인이며, 브라우저 UI의 버튼 상태 검증은 아니다.
- `downloadCount`는 검증 다운로드로 변동되는 통계값이므로 release 불변 기준으로 사용하지 않는다.

### 후속 작업 후보

- 해당 없음. 이후 release는 `mydocs/_templates/github_release_note.md`를 사용한다.

## 작업지시자 승인 요청

- 최종 보고서와 수용 기준 검증 결과를 승인하면 PR 게시 절차로 진행한다.
