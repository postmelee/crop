# Task #54 Stage 1 보고서 - v0.1.0 release 기준값 확인

GitHub Issue: [#54](https://github.com/postmelee/crop/issues/54)
구현계획서: [`task_m030_54_impl.md`](../plans/task_m030_54_impl.md)
Stage: 1

## 단계 목적

기존 GitHub Release `v0.1.0` body를 수정하기 전에 현재 원격 Release metadata, body, asset, checksum, privacy URL, Chrome Web Store 상태 근거를 확인한다. 이번 Stage는 읽기 전용 기준값 확인 단계이며, 원격 GitHub Release body는 변경하지 않는다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/tech/task_m030_54_v010_release_body.md` | 현재 Release body, metadata, asset checksum, privacy URL, Chrome Web Store 상태 근거, #48/#50 대조, Stage 2 gap을 기록했다. |
| `mydocs/working/task_m030_54_stage1.md` | Stage 1 검증 결과와 다음 단계 승인 요청을 정리했다. |

## 본문 변경 정도 / 본문 무손실 여부

원격 GitHub Release body는 수정하지 않았다. 현재 body는 기술 노트에 원문 그대로 보존했다. 저장소 문서는 신규 기술 노트와 Stage 1 보고서만 추가했으며, 기존 README, release pipeline guide, 템플릿, privacy policy, manifest, source code는 변경하지 않았다.

## 검증 결과

실행 명령:

```bash
gh release view v0.1.0 --repo postmelee/crop --json tagName,name,url,isDraft,isPrerelease,assets,body
gh release download v0.1.0 --repo postmelee/crop --pattern 'crop-0.1.0-cws.zip' --dir /tmp/crop-task54-release-check-stage1
shasum -a 256 /tmp/crop-task54-release-check-stage1/crop-0.1.0-cws.zip
wc -c /tmp/crop-task54-release-check-stage1/crop-0.1.0-cws.zip
gh api 'repos/postmelee/crop/contents/PRIVACY.md?ref=v0.1.0' --jq '.html_url, .sha'
git ls-remote --tags origin v0.1.0
curl -L -s -o /dev/null -w '%{http_code} %{url_effective}\n' https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki
rg -n "v0.1.0|crop-0.1.0-cws.zip|SHA-256|privacy|Chrome Web Store|현재 body|변경하지" mydocs/tech/task_m030_54_v010_release_body.md mydocs/working/task_m030_54_stage1.md
git diff --check
```

결과:

- OK: `gh release view`에서 `v0.1.0`, `crop v0.1.0`, draft `false`, prerelease `false`, Release URL, current body, asset metadata를 확인했다.
- OK: 현재 body는 단일 문단이며 release commit, build/package/verify 요약, asset SHA-256만 포함한다.
- OK: Release asset `crop-0.1.0-cws.zip`은 `438474 bytes`, SHA-256 `84c69f31e40667fdda97cf5af045ed8e770769b135dd72656dedb8dd0f9f4c15`로 확인됐다.
- OK: 원격 `v0.1.0` tag는 `53808a2147c120e67f7bb93b737b2f6d0526d6f4`를 가리킨다.
- OK: `https://github.com/postmelee/crop/blob/v0.1.0/PRIVACY.md`와 contents SHA `29f580ed98e124904268a7d9225b2cc8cfda6722`를 확인했다.
- OK: Chrome Web Store URL `https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki`가 HTTP 200으로 접근됐다.
- OK: README와 #51 최종 보고서가 Store 게시 완료 및 공식 Store 설치 경로 반영 상태를 기록한다.
- OK: Stage 1에서는 원격 GitHub Release body, asset, tag, title, draft/prerelease 상태를 변경하지 않았다.

## 잔여 위험

- Chrome Web Store는 동적 페이지이므로 CLI HTTP 200 확인만으로 브라우저 UI의 `Add to Chrome` 버튼 상태까지 보장하지 않는다.
- `downloadCount`는 시간이 지나면 변할 수 있는 통계값이므로 Stage 2 body의 안정 기준값으로 사용하지 않는다.
- 현재 Release body가 짧은 단일 문단이므로 Stage 2에서 공개 body 초안을 새 구조로 재작성해야 한다.

## 다음 단계 영향

- Stage 2는 `mydocs/_templates/github_release_note.md` 구조를 기준으로 `v0.1.0`용 공개 body 초안을 작성한다.
- Stage 2 초안에는 Chrome Web Store `published` 상태, Store URL, privacy URL, asset URL/size/checksum, verification 결과, rollback/follow-up을 포함한다.
- 공개 body에는 템플릿 주석, notes-file 작성 체크박스, 내부 승인 로그, 미확인 추정을 남기지 않는다.
- Stage 2 완료 후 원격 GitHub Release body update 승인 요청을 별도로 한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2로 진행한다.
