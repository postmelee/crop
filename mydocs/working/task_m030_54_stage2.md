# Task #54 Stage 2 보고서 - v0.1.0 release body 초안 작성

GitHub Issue: [#54](https://github.com/postmelee/crop/issues/54)
구현계획서: [`task_m030_54_impl.md`](../plans/task_m030_54_impl.md)
Stage: 2

## 단계 목적

Stage 1에서 확인한 `v0.1.0` Release 기준값과 #50 GitHub Release note 템플릿을 바탕으로, 원격 GitHub Release body에 적용할 공개 초안을 작성한다. 이번 Stage에서는 초안만 작성하며, `gh release edit`나 원격 Release 수정은 수행하지 않는다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/tech/task_m030_54_v010_release_body.md` | Stage 2 공개 body 초안, 초안 판단, Stage 1 검증 로그 표기 보정을 추가했다. |
| `mydocs/working/task_m030_54_stage2.md` | Stage 2 검증 결과와 Stage 3 승인 요청을 정리했다. |

## 본문 변경 정도 / 본문 무손실 여부

원격 GitHub Release body는 수정하지 않았다. Stage 1에서 보존한 현재 body 원문도 유지했다. 기술 노트에는 `Stage 2 초안 영역`만 확장했고, Stage 1 검증 로그의 Chrome Web Store 확인 명령은 placeholder 검증에 걸리지 않는 동일 의미의 `curl -I -L` 형태로 표기만 보정했다.

## 검증 결과

실행 명령:

```bash
rg -n "user 안내|developer 검증 기록|Chrome Web Store|privacy|asset|SHA-256|verification|rollback|follow-up" mydocs/tech/task_m030_54_v010_release_body.md
rg -n "\\{[a-zA-Z0-9_ -]+\\}|notes-file 작성 체크|미확인|TODO" mydocs/tech/task_m030_54_v010_release_body.md
git diff --check
```

결과:

- OK: 첫 번째 `rg`에서 `user 안내`, `developer 검증 기록`, Chrome Web Store, privacy, asset, SHA-256, verification, rollback/follow-up 문맥이 모두 확인됐다.
- OK: 두 번째 `rg`는 빈 출력이다. 공개 body 초안과 기술 노트에 placeholder, 작성 체크 문구, 내부 추정 금지어, TODO가 남아 있지 않다.
- OK: 공개 body 초안에서 템플릿 주석과 체크박스를 제거했다.
- OK: Chrome Web Store 상태는 `published`, Store URL은 `https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki`로 작성했다.
- OK: asset URL, size, SHA-256 checksum, privacy URL, verification 결과가 Stage 1/#48 기준값과 일치한다.
- OK: `git diff --check` 통과.

## 잔여 위험

- Stage 2 초안은 아직 원격 GitHub Release body에 적용되지 않았다.
- Stage 3에서 `gh release edit`를 실행하면 공개 Release body가 바뀌므로, 이번 보고서 승인 전에는 원격 수정 작업을 진행하지 않는다.
- Chrome Web Store URL HTTP 확인은 CLI 접근성 확인이며, 브라우저 UI의 버튼 상태 검증은 아니다.

## 다음 단계 영향

- Stage 3에서는 승인된 초안만 임시 파일로 저장하고 `gh release edit v0.1.0 --notes-file`로 원격 body만 수정한다.
- Stage 3에서는 tag, title, asset, draft/prerelease 상태가 바뀌지 않았는지 update 직후 재조회해야 한다.
- Stage 3 완료보고서에는 update 전후 body 요약과 불변 항목 확인을 기록해야 한다.

## 승인 요청

- Stage 2 산출물과 공개 body 초안을 승인하면 Stage 3로 진행한다.
- Stage 3에서는 승인된 초안만 GitHub Release `v0.1.0` body에 반영하며, release asset, tag, title, draft/prerelease 상태는 변경하지 않는다.
