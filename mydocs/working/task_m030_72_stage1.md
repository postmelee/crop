# Task #72 Stage 1 보고서 - release 후보 범위와 version 판단

GitHub Issue: [#72](https://github.com/postmelee/crop/issues/72)
구현계획서: [`task_m030_72_impl.md`](../plans/task_m030_72_impl.md)
Stage: 1

## 단계 목적

Stage 1은 다음 release 후보 범위를 고정하기 위해 원격 branch/tag 상태, `v0.1.0` 이후 변경, 현재 version 값, package 산출물 이름 기준, 권한 경계를 확인하는 단계다. 이 단계에서는 version 파일, release body, package artifact, GitHub 원격 release 상태를 수정하지 않는다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/tech/task_m030_72_release_candidate.md` | `v0.1.0` 이후 `origin/main`/`origin/devel` 변경, branch 간 차이, 권한 경계, `v0.1.1` version 후보, Stage 2 입력값 정리 |
| `mydocs/working/task_m030_72_stage1.md` | Stage 1 검증 결과와 승인 요청 기록 |
| `mydocs/orders/20260613.md` | #72 상태를 Stage 1 완료 보고 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

신규 기술 노트와 단계 보고서를 작성했다. 기존 제품 코드, `package.json`, `manifest.json`, release template, GitHub Release 원격 body는 수정하지 않았다. 오늘할일은 #72 비고만 현재 단계에 맞게 갱신했다.

## 검증 결과

실행 명령:

```bash
git fetch --all --tags --prune
git status --short --branch
git tag --sort=-creatordate
git log --oneline v0.1.0..origin/main
git log --oneline v0.1.0..origin/devel
git log --merges --first-parent --oneline v0.1.0..origin/devel
git diff --name-status origin/main..origin/devel
node -p "require('./package.json').version"
rg -n '"version"|debugger|<all_urls>|host_permissions|tabs' package.json manifest.json src tests
```

결과:

- OK: `git fetch --all --tags --prune` 성공.
- OK: `git status --short --branch` 결과는 `## local/task72`.
- OK: `git tag --sort=-creatordate` 결과 최신 tag는 `v0.1.0` 하나다.
- OK: `v0.1.0..origin/main`에는 #48, #51, #50, #54, #29, #65와 main 전용 README/asset 보강이 포함되어 있음을 확인했다.
- OK: `v0.1.0..origin/devel`에는 #48, #51, #50, #54, #29, #65에 더해 #66, #68 캡처 안정화 보정이 포함되어 있음을 확인했다.
- OK: `origin/main..origin/devel` tree diff에서 main 전용 README asset이 삭제처럼 표시되는 이유를 branch 간 tree 차이로 해석했고, release PR의 삭제 의도로 보지 않기로 기록했다.
- OK: `node -p "require('./package.json').version"` 결과는 `0.1.0`.
- OK: `manifest.json` version도 `0.1.0`이며 manifest permission은 `activeTab`, `scripting`, `clipboardWrite`, `downloads`, host permission 없음이다.
- OK: 권한 grep에서 `debugger`, `<all_urls>`, broad `host_permissions`, manifest `tabs` permission 추가는 확인되지 않았다. `tabs` 출력은 코드의 API namespace와 test fixture type이다.
- OK: Stage 2 version 후보를 `0.1.1`로 정리했다.

추가 확인:

```bash
node -e "const fs=require('fs'); const m=JSON.parse(fs.readFileSync('manifest.json','utf8')); console.log(m.version); console.log(JSON.stringify({permissions:m.permissions,host_permissions:m.host_permissions||[]}));"
git log --oneline origin/devel..origin/main
git log --oneline origin/main..origin/devel
git diff --stat v0.1.0..origin/main
git diff --stat v0.1.0..origin/devel
git diff --stat origin/main..origin/devel
sed -n '1,260p' scripts/package-cws.mjs
```

결과:

- OK: `scripts/package-cws.mjs`가 `package.json` version으로 `/tmp/crop-{version}-cws.zip`를 생성함을 확인했다.
- OK: Stage 2에서 `0.1.1`로 bump하면 package 후보 경로가 `/tmp/crop-0.1.1-cws.zip`가 됨을 확인했다.
- OK: #66/#68 보고서를 대조해 두 변경이 bug fix/stabilization 성격이며 새 권한이나 새 공개 기능 확장이 아님을 확인했다.

## 잔여 위험

- `origin/main..origin/devel` tree diff만 보면 main 전용 README image asset이 삭제되는 것처럼 보인다. 실제 `devel -> main` release PR 생성 전에는 PR diff 또는 merge result에서 main 전용 asset 보존 여부를 다시 확인해야 한다.
- `v0.1.1`은 Stage 1 추천 후보이며 아직 승인된 version은 아니다. Stage 2에서 version 파일을 바꾸려면 이 보고서 승인이 필요하다.
- Chrome Web Store 상태 표현은 작업지시자가 직접 제출한다는 전제와 맞춰 Stage 2에서 다시 고정해야 한다.

## 다음 단계 영향

- Stage 2는 release version `0.1.1`, tag `v0.1.1`, asset `crop-0.1.1-cws.zip`를 기본 후보로 사용한다.
- Stage 2에서 `package.json`과 `manifest.json` version을 `0.1.1`로 bump한다.
- Stage 2에서 release body 후보와 release PR 본문 후보는 `mydocs/tech/task_m030_72_release_candidate.md`에 이어서 작성한다.
- Stage 2에서도 GitHub Release, tag, release PR은 생성하지 않는다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2로 진행한다.
- Stage 2에서 release version을 `0.1.1`, tag 후보를 `v0.1.1`로 두고 `package.json`과 `manifest.json` version bump를 진행하는 것을 승인해 달라.
