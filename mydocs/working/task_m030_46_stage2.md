# Task #46 Stage 2 보고서 - package artifact 생성/검증 표준화

GitHub Issue: [#46](https://github.com/postmelee/crop/issues/46)
구현계획서: [`task_m030_46_impl.md`](../plans/task_m030_46_impl.md)
Stage: 2

## 단계 목적

Chrome Web Store 제출 ZIP 생성과 검증을 #37의 one-off 명령에서 반복 가능한 package script로 전환한다. `dist/`를 ZIP root로 삼고, macOS metadata와 repository/development 파일이 제출 artifact에 섞이지 않도록 자동 검증 기준을 추가한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `scripts/package-cws.mjs` | `dist/`를 입력으로 `/tmp/crop-0.1.0-cws.zip`을 생성하는 Node ZIP writer 추가. `.DS_Store`, `__MACOSX` 제외 |
| `scripts/verify-cws-zip.mjs` | ZIP central directory와 manifest를 검사해 required entries, forbidden entries, 권한 경계를 검증 |
| `package.json` | `package:cws`, `verify:cws` scripts 추가 |
| `mydocs/tech/task_m030_46_release_pipeline_ci.md` | Stage 2 구현 결과, ZIP contents, #37 one-off 명령 대체 관계 기록 |
| `mydocs/working/task_m030_46_stage2.md` | Stage 2 검증 결과와 다음 단계 영향 기록 |
| `mydocs/orders/20260607.md` | #46 상태를 Stage 2 완료 후 Stage 3 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

코드 변경은 신규 `scripts/` 2개와 `package.json` scripts 추가에 한정된다. Chrome extension runtime 코드와 `manifest.json`은 변경하지 않았다. #37 이력 문서는 덮어쓰지 않고 #46 기술 노트에 새 표준과의 관계만 기록했다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run package:cws
npm run verify:cws
unzip -l /tmp/crop-0.1.0-cws.zip
unzip -Z1 /tmp/crop-0.1.0-cws.zip
node --check scripts/package-cws.mjs
node --check scripts/verify-cws-zip.mjs
rg -n "package:cws|verify:cws|scripts/package-cws.mjs|scripts/verify-cws-zip.mjs" package.json mydocs/tech/task_m030_46_release_pipeline_ci.md
git diff --check
```

결과:

- OK: `npm run build` 통과. Vite build는 runtime files와 locale files를 `dist/`에 생성했다.
- OK: `npm run package:cws` 통과. `/tmp/crop-0.1.0-cws.zip` 생성, 13 files, 438,474 bytes.
- OK: `npm run verify:cws` 통과. required entries와 manifest permission boundary 확인.
- OK: `unzip -l` 기준 uncompressed total 436,898 bytes, 13 files.
- OK: `unzip -Z1` 기준 `.DS_Store`, `__MACOSX`, `node_modules`, `mydocs`, repository root 문서/config 파일 없음.
- OK: `dist/.DS_Store`가 존재하는 상태에서도 package script가 ZIP에서 제외함을 확인했다.
- OK: `node --check` 2개 script 통과.
- OK: `git diff --check` 통과.

## 잔여 위험

- ZIP writer는 현재 Store package 규모에 맞춘 ZIP64 미지원 구현이다. Chrome extension artifact가 4GB/65,535 entries에 근접하지 않으므로 현재 범위에서는 문제가 아니다.
- `verify:cws`는 `host_permissions`가 생기면 실패하도록 보수적으로 둔다. 향후 권한 정책이 바뀌면 별도 task에서 manifest 정책과 검증 기준을 함께 갱신해야 한다.
- 실제 Chrome Web Store upload는 이번 Stage에서 수행하지 않았다.

## 다음 단계 영향

- Stage 3 PR CI는 `npm ci`, `npm run build`, `npm run typecheck`, `npm test`, `npm run package:cws`, `npm run verify:cws` 순서로 구성한다.
- Stage 3 release runbook은 Store 제출 ZIP 생성 명령을 #37 one-off 명령이 아니라 `npm run package:cws`/`npm run verify:cws`로 안내한다.
- Stage 3 runbook은 `Submit for review` 전 `/tmp/crop-0.1.0-cws.zip` 재생성/검증을 필수 조건으로 적어야 한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3 PR CI와 release runbook 작성으로 진행한다.
