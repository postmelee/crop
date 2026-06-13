# Task #72 Stage 2 보고서

GitHub Issue: [#72](https://github.com/postmelee/crop/issues/72)  
구현계획서: [`task_m030_72_impl.md`](../plans/task_m030_72_impl.md)  
Stage: 2

## 단계 목적

Stage 1에서 승인된 `v0.1.1` 후보를 실제 manifest/package version 값에 반영하고, GitHub Release body 후보와 `devel -> main` Release PR 본문 후보를 작성한다. Chrome Web Store 새 제출, GitHub Release 생성, tag 생성, release PR 생성은 이 단계 범위에서 제외했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `package.json` | npm package version을 `0.1.0`에서 `0.1.1`로 변경했다. |
| `manifest.json` | Chrome extension manifest version을 `0.1.0`에서 `0.1.1`로 변경했다. |
| `mydocs/tech/task_m030_72_release_candidate.md` | Stage 2 version bump 결과, GitHub Release body 후보, Release PR 본문 후보, Stage 2 검증 요약을 추가했다. |
| `mydocs/orders/20260614.md` | Task #72의 Stage 2 완료 보고 후 승인 대기 상태를 오늘할일에 기록했다. |
| `mydocs/working/task_m030_72_stage2.md` | Stage 2 산출물, 검증 결과, 잔여 위험, 다음 단계 영향을 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

소스 코드는 변경하지 않았다. `package.json`과 `manifest.json`은 version 값만 변경했고, manifest 권한과 runtime 동작 항목은 그대로 유지했다. 릴리즈 후보 문서는 Stage 1 본문을 삭제하지 않고 Stage 2 섹션을 덧붙였으며, template 잔여 표식으로 오인될 수 있는 표현은 검증 규칙에 맞게 정리했다.

## 검증 결과

실행 명령:

```bash
rg -n '"version": "0.1.1"' package.json manifest.json
rg -n "v0.1.1|Release|Chrome Web Store|checksum|privacy|verification|rollback|follow-up|not submitted|Release PR" mydocs/tech/task_m030_72_release_candidate.md mydocs/working/task_m030_72_stage2.md
rg -n "\{[a-zA-Z0-9_ -]+\}|TODO|미확인|placeholder" mydocs/tech/task_m030_72_release_candidate.md
git diff --check
```

결과:

- OK: version grep이 `package.json:3`과 `manifest.json:4`의 `"version": "0.1.1"`을 확인했다.
- OK: release 후보 grep이 `v0.1.1`, `Release`, `Chrome Web Store`, `checksum`, `privacy`, `verification`, `rollback`, `follow-up`, `not submitted`, `Release PR` 문맥을 release 후보 문서에서 확인했다.
- OK: template 잔여 표식 검사는 출력이 없었다.
- OK: `git diff --check`는 출력 없이 통과했다.

## 잔여 위험

- package asset size와 SHA-256 checksum은 Stage 3에서 `/tmp/crop-0.1.1-cws.zip` 생성 후 확정해야 한다.
- `npm run build`, `npm run typecheck`, `npm test`, `npm run package:cws`, `npm run verify:cws` 결과는 Stage 3 검증 기록으로 확정해야 한다.
- `v0.1.1` tag URL은 tag 생성 전까지 후보 URL이다.
- Chrome Web Store upload와 `Submit for review`는 작업지시자가 직접 진행한다.

## 다음 단계 영향

- Stage 3는 현재 version `0.1.1` 기준으로 package를 생성하고, ZIP contents, asset size, SHA-256 checksum, release 검증 결과를 release 후보 문서에 확정값으로 반영한다.
- Stage 4는 Stage 3 검증 완료 후 main 전용 README asset 보존 여부와 `devel -> main` release PR 생성 여부를 별도 승인으로 진행한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 package validation으로 진행한다.
