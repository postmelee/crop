# Task #54 Stage 3 보고서 - v0.1.0 release body 반영

GitHub Issue: [#54](https://github.com/postmelee/crop/issues/54)
구현계획서: [`task_m030_54_impl.md`](../plans/task_m030_54_impl.md)
Stage: 3

## 단계 목적

Stage 2에서 승인된 공개 body 초안을 GitHub Release `v0.1.0` body에 반영한다. 이번 Stage는 원격 Release body만 수정하며, release tag, title/name, asset, draft/prerelease 상태는 변경하지 않는다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| GitHub Release `v0.1.0` body | 승인된 Stage 2 초안으로 원격 Release body를 업데이트했다. |
| `mydocs/tech/task_m030_54_v010_release_body.md` | update 전후 body 요약, 원격 metadata 불변 확인, Stage 3 asset 재검증 로그를 추가했다. |
| `mydocs/working/task_m030_54_stage3.md` | Stage 3 검증 결과와 다음 단계 승인 요청을 정리했다. |

## 본문 변경 정도 / 본문 무손실 여부

원격 GitHub Release body는 기존 단일 문단에서 #50 템플릿 기반 구조로 재작성했다. Stage 1 기술 노트에 기존 body 원문을 보존했고, Stage 3 기술 노트에는 update 전후 요약을 남겼다. Release tag, title/name, asset, draft/prerelease 상태는 변경하지 않았다.

## 검증 결과

실행 명령:

```bash
gh release view v0.1.0 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,assets,body
gh release edit v0.1.0 --repo postmelee/crop --notes-file /private/tmp/crop-task54-v010-release-body-approved.md
gh release view v0.1.0 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,assets,body
gh release download v0.1.0 --repo postmelee/crop --pattern 'crop-0.1.0-cws.zip' --dir /tmp/crop-task54-release-check-stage3
shasum -a 256 /tmp/crop-task54-release-check-stage3/crop-0.1.0-cws.zip
wc -c /tmp/crop-task54-release-check-stage3/crop-0.1.0-cws.zip
rg -n "user 안내|developer 검증 기록|Chrome Web Store|privacy|asset|SHA-256|verification" mydocs/tech/task_m030_54_v010_release_body.md mydocs/working/task_m030_54_stage3.md
rg -n "tag|title|asset|draft|prerelease|변경하지|불변" mydocs/tech/task_m030_54_v010_release_body.md mydocs/working/task_m030_54_stage3.md
git diff --check
```

결과:

- OK: update 전 `gh release view`에서 기존 단일 문단 body와 기존 metadata를 확인했다.
- OK: `gh release edit v0.1.0 --notes-file /private/tmp/crop-task54-v010-release-body-approved.md`가 성공했고 Release URL을 반환했다.
- OK: update 후 `gh release view`에서 body가 `user 안내`와 `developer 검증 기록` 분리 구조로 조회됐다.
- OK: tag `v0.1.0`, Release name/title `crop v0.1.0`, Release URL, draft `false`, prerelease `false`는 불변이다.
- OK: asset `crop-0.1.0-cws.zip`, asset URL, size `438474 bytes`, digest `sha256:84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15`는 불변이다.
- OK: update 후 Release asset download 결과 SHA-256은 `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15`다.
- OK: update 후 Release asset byte size는 `438474`다.
- OK: 필수 키워드 grep에서 user/developer, Chrome Web Store, privacy, asset, SHA-256, verification 문맥을 확인했다.
- OK: 불변 항목 grep에서 tag/title/asset/draft/prerelease/변경하지/불변 문맥을 확인했다.
- OK: `git diff --check` 통과.

## 잔여 위험

- GitHub Release body는 이미 원격에서 변경됐다. 되돌림이 필요하면 Stage 1에 보존된 기존 단일 문단 body 또는 별도 승인된 수정 body로 `gh release edit --notes-file`을 다시 수행해야 한다.
- `downloadCount`는 Stage 3 다운로드 검증으로 증가할 수 있으므로 불변 기준으로 사용하지 않는다.
- Chrome Web Store URL HTTP 확인은 CLI 접근성 확인이며, 브라우저 UI의 버튼 상태 검증은 아니다.

## 다음 단계 영향

- Stage 4에서는 원격 Release body, 기술 노트, Stage 보고서, 최종 보고서를 통합 대조한다.
- Stage 4에서는 새 tag, 새 Release, asset 교체, version bump, Chrome Web Store Dashboard 작업이 수행되지 않았음을 최종 보고서에 명시한다.
- Stage 4에서는 오늘할일을 완료 후보로 갱신하고 PR 게시 전 최종 승인 요청 상태로 만든다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4로 진행한다.
