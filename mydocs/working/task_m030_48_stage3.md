# Task #48 Stage 3 보고서 - GitHub Release와 제출 URL 동기화

GitHub Issue: [#48](https://github.com/postmelee/crop/issues/48)
구현계획서: [`task_m030_48_impl.md`](../plans/task_m030_48_impl.md)
Stage: 3

## 단계 목적

이번 Stage는 Stage 2에서 검증한 Chrome Web Store 제출 후보 ZIP을 GitHub Release asset으로 업로드하고, `main` 또는 release tag 기준 `PRIVACY.md` URL이 실제 Dashboard 제출 후보로 접근 가능한지 확인하는 단계다.

Stage 1에서 확인한 대로 원격 `main`이 없었으므로, 승인된 bootstrap 예외에 따라 `main`을 PR #47 merge commit `53808a2147c120e67f7bb93b737b2f6d0526d6f4`에서 최초 생성했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/working/task_m030_48_stage3.md` | 원격 `main`, `v0.1.0` tag/Release, Release asset, privacy URL 확인 결과 기록 |
| GitHub branch `main` | `53808a2147c120e67f7bb93b737b2f6d0526d6f4` 기준으로 최초 생성 |
| GitHub tag `v0.1.0` | `53808a2147c120e67f7bb93b737b2f6d0526d6f4` 기준으로 생성 |
| GitHub Release `v0.1.0` | `crop v0.1.0` Release 생성 |
| Release asset `crop-0.1.0-cws.zip` | Stage 2 ZIP과 동일 checksum으로 업로드 |

## 본문 변경 정도 / 본문 무손실 여부

이번 Stage는 소스 코드, manifest, privacy policy, release manual을 수정하지 않았다. 원격 GitHub branch/tag/Release/asset 상태를 변경했고, 그 결과를 `mydocs/working/`에 신규 기록했다.

## 원격 release 결과

| 항목 | 값 |
|---|---|
| release 기준 commit | `53808a2147c120e67f7bb93b737b2f6d0526d6f4` |
| 원격 `devel` | `53808a2147c120e67f7bb93b737b2f6d0526d6f4` |
| 원격 `main` | `53808a2147c120e67f7bb93b737b2f6d0526d6f4` |
| 원격 tag | `v0.1.0` -> `53808a2147c120e67f7bb93b737b2f6d0526d6f4` |
| Release URL | `https://github.com/postmelee/crop/releases/tag/v0.1.0` |
| Release name | `crop v0.1.0` |
| Release draft/prerelease | `false` / `false` |
| Asset URL | `https://github.com/postmelee/crop/releases/download/v0.1.0/crop-0.1.0-cws.zip` |
| Asset size | `438,474` bytes |
| Asset digest | `sha256:84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15` |

## privacy policy URL 확인

| 후보 | 결과 | GitHub contents SHA |
|---|---|---|
| `https://github.com/postmelee/crop/blob/main/PRIVACY.md` | 접근 확인 | `29f580ed98e124904268a7d9225b2cc8cfda6722` |
| `https://github.com/postmelee/crop/blob/v0.1.0/PRIVACY.md` | 접근 확인 | `29f580ed98e124904268a7d9225b2cc8cfda6722` |

두 URL 모두 같은 `PRIVACY.md` blob을 가리킨다. Dashboard 제출값은 tag 고정성이 더 강한 `https://github.com/postmelee/crop/blob/v0.1.0/PRIVACY.md`를 1차 후보로 두고, `main` URL은 동일 내용의 stable branch 후보로 남긴다.

## Release asset 동일성 확인

| 파일 | SHA-256 | 크기 |
|---|---|---|
| `/tmp/crop-0.1.0-cws.zip` | `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15` | `438,474` bytes |
| `/tmp/crop-release-check-48-stage3/crop-0.1.0-cws.zip` | `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15` | `438,474` bytes |

GitHub Release metadata의 asset digest도 같은 `sha256:84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15`다.

## 검증 결과

실행 명령:

```bash
git status --short --branch
shasum -a 256 /tmp/crop-0.1.0-cws.zip
wc -c /tmp/crop-0.1.0-cws.zip
git ls-remote --heads origin main devel
git ls-remote --tags origin v0.1.0
gh release view v0.1.0 --repo postmelee/crop --json tagName,name,isDraft,isPrerelease,url,assets
git push origin 53808a2147c120e67f7bb93b737b2f6d0526d6f4:refs/heads/main
gh release create v0.1.0 /tmp/crop-0.1.0-cws.zip --repo postmelee/crop --target main --title "crop v0.1.0" --notes "..."
git fetch origin --tags
gh api 'repos/postmelee/crop/contents/PRIVACY.md?ref=main' --jq '.html_url, .sha'
gh api 'repos/postmelee/crop/contents/PRIVACY.md?ref=v0.1.0' --jq '.html_url, .sha'
mkdir -p /tmp/crop-release-check-48-stage3
gh release download v0.1.0 --repo postmelee/crop --pattern 'crop-0.1.0-cws.zip' --dir /tmp/crop-release-check-48-stage3
shasum -a 256 /tmp/crop-0.1.0-cws.zip /tmp/crop-release-check-48-stage3/crop-0.1.0-cws.zip
wc -c /tmp/crop-0.1.0-cws.zip /tmp/crop-release-check-48-stage3/crop-0.1.0-cws.zip
git tag --list 'v0.1.0'
git show --no-patch --oneline v0.1.0
git diff --check
```

결과:

- OK: Stage 3 시작 전 `/tmp/crop-0.1.0-cws.zip` SHA-256은 Stage 2와 동일한 `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15`.
- OK: Stage 3 시작 전 원격 `main`, `v0.1.0` tag, `v0.1.0` Release는 없었다.
- OK: `git push origin 53808a2...:refs/heads/main`으로 원격 `main` 최초 생성 완료.
- OK: `gh release create v0.1.0 ...`으로 GitHub Release 생성 완료.
- OK: `git fetch origin --tags`가 `v0.1.0` tag를 가져왔다.
- OK: `git ls-remote --heads origin main devel`에서 `main`과 `devel` 모두 `53808a2...`를 가리킨다.
- OK: `git ls-remote --tags origin v0.1.0`에서 tag가 `53808a2...`를 가리킨다.
- OK: `gh release view v0.1.0`에서 asset `crop-0.1.0-cws.zip`, size `438474`, digest `sha256:84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15` 확인.
- OK: `main` 기준 `PRIVACY.md` URL과 `v0.1.0` 기준 `PRIVACY.md` URL 모두 접근 확인.
- OK: Release asset 다운로드 후 로컬 ZIP과 SHA-256 및 file size가 동일함을 확인.
- OK: `git tag --list 'v0.1.0'` 결과는 `v0.1.0`.
- OK: `git show --no-patch --oneline v0.1.0` 결과는 `53808a2 Merge pull request #47 from postmelee/publish/task46`.
- OK: `git diff --check` 통과.

## 잔여 위험

- GitHub default branch는 아직 `devel`이다. 이번 task 범위에는 default branch 변경을 포함하지 않았다.
- Chrome Web Store Dashboard에는 아직 ZIP을 업로드하지 않았고, `Submit for review`도 수행하지 않았다.
- Dashboard 입력 시 privacy policy URL은 tag URL을 1차 후보로 권장하지만, 실제 Dashboard 필드 저장과 최종 제출 버튼 클릭은 작업지시자 직접 확인 및 별도 승인 대상이다.
- Release asset은 GitHub에 업로드됐지만, Store Dashboard가 표시하는 package 권한은 실제 upload 후 다시 확인해야 한다.

## 다음 단계 영향

- Stage 4 최종 보고서에는 `v0.1.0` Release URL, asset URL, SHA-256, privacy policy tag URL을 Dashboard 제출 기준으로 정리한다.
- Chrome Web Store Dashboard upload 후보는 `/tmp/crop-0.1.0-cws.zip` 또는 Release asset `crop-0.1.0-cws.zip`이며, 둘은 동일 checksum이다.
- Store 제출 전 최종 중단 조건은 #37 Dashboard guide와 #46 release pipeline guide 기준으로 다시 확인해야 한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4로 진행한다.
- Stage 4에서는 최종 보고서와 오늘할일 완료 후보를 작성하고, Chrome Web Store Dashboard 제출 직전 상태를 정리한다.
