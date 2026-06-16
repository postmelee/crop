# Task #77 Stage 1 보고서 - 현재 게시 상태 재검증과 보정안 확정

GitHub Issue: [#77](https://github.com/postmelee/crop/issues/77)
구현계획서: [`task_m030_77_impl.md`](../plans/task_m030_77_impl.md)
Stage: 1

## 단계 목적

Stage 1은 `crop` v0.1.1의 현재 공개 상태를 다시 확인하고, Stage 2에서 적용할 GitHub Release body와 배포 문서 보정안을 확정하는 단계다.

이번 단계에서는 GitHub Release `v0.1.1`, Chrome Web Store listing, README/PRIVACY, release 관련 내부 문서를 검증했다. 실제 GitHub Release body, `release_pipeline_guide.md`, #37/#72 기술 노트는 아직 수정하지 않았다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/working/task_m030_77_stage1.md` | 현재 게시 상태 검증 결과와 Stage 2 보정안 기록 |
| `mydocs/orders/20260616.md` | #77 비고를 Stage 1 완료 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

저장소 본문 문서는 아직 보정하지 않았다. Stage 1 보고서와 오늘할일 상태만 추가/갱신했으므로 README, PRIVACY, release pipeline guide, #37/#72 기술 노트 원문은 무손실이다.

GitHub Release 원격 body도 아직 수정하지 않았다. Stage 2에서 승인된 보정안을 notes file로 적용한다.

## 검증 결과

실행 명령:

```bash
gh release view v0.1.1 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,publishedAt,targetCommitish,assets,body
curl -L -I https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki
curl -L -o /tmp/crop-cws-task77-stage1.html https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki
rg -n "Release status|Chrome Web Store에서 설치|Chrome Web Store からインストール|从 Chrome Web Store 安装|v0.1.1|2026년 6월 14일|2026年6月14日" README*.md PRIVACY.md
rg -n "not submitted|crop-0.1.0-cws.zip|crop-\\{version\\}-cws.zip|/tmp/crop-\\{version\\}-cws.zip" mydocs/manual/release_pipeline_guide.md mydocs/tech/task_m030_37_chrome_web_store_dashboard.md mydocs/tech/task_m030_72_release_candidate.md
git diff --check
rg -o '"0\\.1\\.1",\\[[0-9]+,[0-9]+\\],"[^"]+",\\[[^\\]]+\\]' /tmp/crop-cws-task77-stage1.html
rg -o 'https://github\\.com/postmelee/crop/blob/main/PRIVACY\\.md' /tmp/crop-cws-task77-stage1.html
rg -o '<title>crop - Chrome Web Store</title>|<meta name="description" content="[^"]+"|<meta property="og:title" content="[^"]+"|<meta property="og:description" content="[^"]+"' /tmp/crop-cws-task77-stage1.html
```

결과:

- OK: GitHub Release `v0.1.1`은 `isDraft=false`, `isPrerelease=false`, `name="crop v0.1.1"`, `targetCommitish="main"` 상태다.
- OK: Release asset은 `crop-0.1.1-cws.zip`, 451,909 bytes, SHA-256 `57ab12022f97f7b90d91d258434bf5f0010f562c03328e6d7d23df3ae4f59aa3`, state `uploaded`로 확인됐다.
- MISS: Release body 사용자 안내에는 아직 `Chrome Web Store: not submitted for v0.1.1`, `Store 상태: not submitted`, `Chrome Web Store 제출과 review 완료 후 자동 업데이트 후보`가 남아 있다.
- MISS: Release body follow-up에는 아직 `Chrome Web Store package upload와 Submit for review는 작업지시자가 직접 진행한다`가 남아 있어 게시 완료 상태와 충돌한다.
- OK: Chrome Web Store listing URL은 HTTP/2 200을 반환했다.
- OK: Web Store HTML에서 `<title>crop - Chrome Web Store</title>`, description `Capture visible elements on the current page.`, version `0.1.1`, size `121KiB`, locale `English`, `中文（中国）`, `日本語`, `한국어`, privacy URL `https://github.com/postmelee/crop/blob/main/PRIVACY.md`를 확인했다.
- OK: README 4개 언어는 Chrome Web Store 설치 안내 또는 published release status를 포함한다.
- OK: `PRIVACY.md`는 `v0.1.1 and later` 의미의 적용 문구와 2026-06-14 날짜를 포함한다.
- MISS: `mydocs/manual/release_pipeline_guide.md`에는 반복 release 절차에 `/tmp/crop-0.1.0-cws.zip`가 남아 있다.
- 확인: `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md`의 `/tmp/crop-0.1.0-cws.zip`는 #37 당시 `v0.1.0` 제출 스냅샷으로 보존하되 최신 상태 주석이 필요하다.
- 확인: `mydocs/tech/task_m030_72_release_candidate.md`의 `not submitted` 문구는 #72 후보 기록으로 보존하되 게시 후 확인 섹션이 필요하다.
- OK: `git diff --check` 통과.

## Stage 2 보정안

### GitHub Release `v0.1.1` body

Stage 2에서는 기존 body 구조를 유지하고 다음 문구만 보정한다.

| 위치 | 현재 문구 | 보정안 |
|---|---|---|
| 설치 / 업데이트 | `Chrome Web Store: not submitted for v0.1.1` | `Chrome Web Store: published for v0.1.1` |
| 설치 / 업데이트 | `업데이트 방식: Chrome Web Store 제출과 review 완료 후 자동 업데이트 후보` | `업데이트 방식: Chrome Web Store에서 신규 설치 가능하며 기존 설치는 Chrome Web Store 자동 업데이트 기준을 따른다.` |
| Chrome Web Store 상태 | `Store 상태: not submitted` | `Store 상태: published` |
| Chrome Web Store 상태 | `확인일: 2026-06-14` | `확인일: 2026-06-16` |
| rollback / follow-up | `Chrome Web Store 제출 전 문제가 발견되면 v0.1.0 공개 release를 유지...` | `Chrome Web Store 게시 후 문제가 발견되면 별도 issue-backed 보정 task 또는 후속 version 제출로 처리한다.` |
| rollback / follow-up | `후속 작업: Chrome Web Store package upload와 Submit for review는 작업지시자가 직접 진행한다.` | `후속 작업: 해당 없음. v0.1.1 Chrome Web Store review 통과와 게시를 확인했다.` |

변경하지 않을 항목:

- tag `v0.1.1`
- release title/name `crop v0.1.1`
- draft/prerelease 상태
- release commit `ee985a55d6de65e896c65ac84bf1d5b44de5c71e`
- asset `crop-0.1.1-cws.zip`
- asset URL, size, SHA-256 checksum
- verification 결과 표
- 권한/privacy 문구

### `release_pipeline_guide.md`

Stage 2에서는 반복 release 절차에 남은 `/tmp/crop-0.1.0-cws.zip` 하드코딩을 version 기반 예시로 바꾼다.

- Release PR 전 확인 command 예시: `/tmp/crop-{version}-cws.zip`
- Release PR 전 확인 bullet: `/tmp/crop-{version}-cws.zip`
- GitHub Release/tag 전 확인 bullet: `/tmp/crop-{version}-cws.zip`
- Chrome Web Store Dashboard 가능 조건: `/tmp/crop-{version}-cws.zip`

기존 `gh release create v{version} /tmp/crop-{version}-cws.zip ...` 예시는 이미 version 일반화되어 있으므로 유지한다.

### #37 Dashboard 기술 노트

`mydocs/tech/task_m030_37_chrome_web_store_dashboard.md`는 #37 당시 v0.1.0 Dashboard 제출 준비 스냅샷이므로 기존 `/tmp/crop-0.1.0-cws.zip` 문구를 직접 바꾸지 않는다.

Stage 2에서는 상단에 짧은 보정 주석을 추가한다.

```md
## 최신 상태 주석

이 문서는 #37 당시 `v0.1.0` Chrome Web Store Dashboard 입력값과 제출 준비 상태를 기록한 스냅샷이다. 이후 release의 실제 package path, version, 제출 상태는 `mydocs/manual/release_pipeline_guide.md`와 해당 release의 GitHub Release body를 우선 기준으로 삼는다.
```

### #72 release candidate 기술 노트

`mydocs/tech/task_m030_72_release_candidate.md`의 `not submitted` 문구는 #72 시점 후보 body와 승인 대기 상태 기록이므로 기존 문장을 덮어쓰지 않는다.

Stage 2에서는 문서 하단에 게시 후 확인 섹션을 추가한다.

```md
## 게시 후 확인

기준일: 2026-06-16

`v0.1.1`은 GitHub Release 생성과 Chrome Web Store review 통과 후 published 상태로 확인됐다. 이 문서의 `not submitted` 문구는 Stage 2~4 당시 release candidate body 후보와 제출 전 상태를 보존한 기록이다. 사용자-facing 최신 release note는 GitHub Release `v0.1.1` body를 기준으로 한다.
```

## 잔여 위험

- GitHub Release body는 원격 객체라 저장소 커밋만으로 변경 이력을 완전히 담지 못한다. Stage 2 보고서에 수정 전후 핵심 문구와 원격 조회 결과를 기록해야 한다.
- Chrome Web Store는 동적 페이지라 CLI HTTP 200과 HTML 단서만으로 Dashboard 내부 상태를 완전히 대체할 수 없다. 작업지시자의 게시 완료 통지와 listing 공개 단서를 함께 근거로 삼는다.
- #37/#72 문서는 이력 문서다. Stage 2에서 기존 문장을 최신 상태처럼 덮어쓰지 않도록 주의한다.

## 다음 단계 영향

- Stage 2는 위 보정안만 적용한다.
- GitHub Release body 수정 시 승인된 notes file을 사용하고, `gh release edit` 전후 tag/title/asset/draft/prerelease 상태를 비교한다.
- `release_pipeline_guide.md`는 version path 일반화만 수행한다.
- README/PRIVACY는 수정하지 않는다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2로 진행한다.
- Stage 2에서 위 보정안대로 GitHub Release `v0.1.1` body, `release_pipeline_guide.md`, #37/#72 기술 노트를 보정하는 범위를 승인해 달라.
