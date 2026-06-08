# crop v{version}

<!--
GitHub Release note 템플릿.

사용 위치:
- 실제 입력 파일: release 작업별 임시 notes 파일 또는 승인된 release 작업 산출물
- 원본 템플릿: mydocs/_templates/github_release_note.md
- 게시 명령 예: gh release create v{version} {asset_path} --notes-file {filled_notes_file}

작성 규칙:
- `{placeholder}`는 게시 전에 실제 값으로 바꾸거나 해당 항목을 `해당 없음`으로 명시한다.
- 사용자에게 보이면 안 되는 내부 승인 로그, 작업자 메모, 미확인 추정은 게시 전에 삭제한다.
- user 안내와 developer 검증 기록의 책임을 섞지 않는다.
- Chrome Web Store 상태, privacy URL, asset checksum, verification 결과는 비워 두지 않는다.
-->

## user 안내

### 설치 / 업데이트

- Chrome Web Store: {published | pending review | staged rollout | not submitted}
- 설치 URL: {Chrome Web Store URL}
- 업데이트 방식: {자동 업데이트 | 수동 재설치 | 신규 설치만 해당}
- 대상 버전: `v{version}`

### 주요 변경점

- {사용자가 체감하는 변경점 1}
- {사용자가 체감하는 변경점 2}
- {사용자가 체감하는 변경점 3}

### 권한과 privacy

- 권한 변화: {없음 | 변경 내용}
- privacy URL: {main 또는 tag 기준 PRIVACY.md URL}
- 데이터 처리: {local processing / no server upload / no telemetry 등 release 기준 설명}

### known limitations

- {알려진 제한 1}
- {알려진 제한 2}

### Chrome Web Store 상태

- Store 상태: {published | submitted for review | draft only | not submitted}
- Store package: `{asset_name}`
- 확인일: {YYYY-MM-DD}

## developer 검증 기록

### release 기준

| 항목 | 값 |
|---|---|
| Tag | `v{version}` |
| Release commit | `{commit_sha}` |
| Base branch | `{branch}` |
| 포함 PR | {PR 목록 또는 GitHub generated notes 참조} |
| 포함 Issue | {Issue 목록} |

### package asset

| 항목 | 값 |
|---|---|
| asset 이름 | `{asset_name}` |
| asset URL | `{asset_url}` |
| asset size | `{bytes} bytes` |
| SHA-256 checksum | `{sha256}` |
| 생성 명령 | `npm run build && npm run package:cws` |
| 검증 명령 | `npm run verify:cws` |

### verification 결과

| 검증 | 결과 |
|---|---|
| `npm run build` | {OK/MISS, 핵심 결과} |
| `npm run typecheck` | {OK/MISS, 핵심 결과} |
| `npm test` | {OK/MISS, 핵심 결과} |
| `npm run package:cws` | {OK/MISS, asset 경로와 size} |
| `npm run verify:cws` | {OK/MISS, manifest/permission/package 결과} |
| ZIP contents 확인 | {OK/MISS, forbidden entry 없음 여부} |
| privacy URL 확인 | {OK/MISS, URL 기준} |

### rollback / follow-up

- Rollback 기준: {문제 발생 시 이전 release 유지, Store review 취소, 새 patch release 등}
- 후속 작업: {후속 Issue/PR 또는 해당 없음}
- 자동 release notes: {사용 안 함 | `--generate-notes` 보조 사용 | `.github/release.yml` 기준 사용}

## notes-file 작성 체크

- [ ] 모든 `{placeholder}`를 실제 값 또는 `해당 없음`으로 바꿨다.
- [ ] user 안내에 내부 검증 로그나 미확인 추정이 남아 있지 않다.
- [ ] developer 검증 기록에 asset, checksum, privacy, Chrome Web Store, verification 결과가 있다.
- [ ] 기존 `v0.1.0` 등 과거 release body를 수정하지 않았다.
- [ ] `gh release create v{version} {asset_path} --notes-file {filled_notes_file}`에 전달할 파일을 최종 확인했다.
