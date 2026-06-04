# Task #37 Chrome Web Store Dashboard 입력값 재대조 노트

GitHub Issue: [#37](https://github.com/postmelee/crop/issues/37)
마일스톤: M030
확인일: 2026-06-04 KST
기준 브랜치: `local/task37`
기준 커밋: `5fd786f`

## 조사 배경

#9는 Chrome Web Store 배포 준비 문서, `PRIVACY.md`, Store listing/privacy/permission draft, release package checklist, manifest/Store icon asset을 정리했다. #9 PR #36은 `devel`에 merge됐고, 이후 로컬 검증 중 발견된 full-page oversized canvas failure는 #35 PR #38에서 downscale fallback으로 보정되어 `devel`에 반영됐다.

이번 Stage 1의 목적은 Dashboard 입력값을 바로 확정하는 것이 아니라, 최신 공식 문서와 현재 저장소 산출물의 기준선을 다시 세우고 Stage 2에서 확정해야 할 gap을 분리하는 것이다.

## 확인 대상

공식 문서:

- Chrome Web Store Program Policies: <https://developer.chrome.com/docs/webstore/program-policies/policies>
- Prepare your extension: <https://developer.chrome.com/docs/webstore/prepare>
- Publish in the Chrome Web Store: <https://developer.chrome.com/docs/webstore/publish>
- Complete your listing information: <https://developer.chrome.com/docs/webstore/cws-dashboard-listing/>
- Fill out the privacy fields: <https://developer.chrome.com/docs/webstore/cws-dashboard-privacy/>
- Prepare to publish: set up distribution: <https://developer.chrome.com/docs/webstore/cws-dashboard-distribution>
- Provide test instructions: <https://developer.chrome.com/docs/webstore/cws-dashboard-test-instructions>
- Chrome Web Store review process: <https://developer.chrome.com/docs/webstore/review-process>
- Supplying Images: <https://developer.chrome.com/docs/webstore/images>
- Best Practices / category guidance: <https://developer.chrome.com/docs/webstore/best-practices>

저장소 산출물:

- `manifest.json`
- `README.md`, `README.ko.md`, `README.zh-CN.md`, `README.ja.md`
- `PRIVACY.md`
- `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0`
- `mydocs/tech/task_m030_9_chrome_web_store.md`
- `mydocs/report/task_m030_9_report.md`
- `mydocs/report/task_m020_35_report.md`
- `mydocs/tech/task_m020_8_quality_matrix.md`

GitHub 상태:

- #37: open, milestone `M030 — Release Preparation`, labels `documentation`, `enhancement`
- PR #38: merged, base `devel`, head `publish/task35`, merged at `2026-06-04T06:00:34Z`

## 실제 Dashboard 확인 상태

이 Stage에서는 로그인된 Chrome Web Store Developer Dashboard 실제 화면을 직접 확인하지 않았다. 공식 문서 기준으로 항목명을 정리하되, 실제 Dashboard UI에서 필수 여부나 dropdown 값이 문서와 다르게 보이는 항목은 Stage 2에서 `작업지시자 확인 필요`로 분리한다.

현재 실제 화면 확인 필요 후보:

- Store Listing의 YouTube video field가 실제 submit blocker인지 여부
- category dropdown의 현재 값과 최종 선택 가능 label
- distribution visibility와 region 기본값
- privacy policy URL 입력 위치와 developer account page URL 상태
- upload 후 review submit dialog의 deferred publishing checkbox 상태

## 공식 문서 재대조 요약

| 영역 | 공식 기준 요약 | #37 적용 판단 |
|---|---|---|
| Program policies | metadata와 Dashboard 입력값은 최신·정확해야 하고, single purpose를 자세히 적어야 한다. user data를 다루면 privacy policy를 제공하고 Limited Use와 최소 권한 원칙을 지켜야 한다. | #9 privacy/permission draft를 유지하되, PR #38 이후 full-page limitation 문구를 갱신해야 한다. |
| Package | upload ZIP은 extension files를 포함하고 `manifest.json`이 ZIP root에 있어야 한다. | Stage 3에서 fresh zip 절차와 root contents를 재확인한다. |
| Store Listing | detailed description, primary category, item language, graphic assets를 입력한다. | Stage 2에서 English listing copy와 category를 확정한다. locale별 listing은 후속으로 분리한다. |
| Privacy fields | single purpose, permission justification, remote code 여부, data usage certification, privacy policy URL을 정리한다. | `crop`은 remote code를 쓰지 않는 방향으로 선언하고, local processing/no telemetry/no server upload 기준을 유지한다. |
| Distribution | Public/Unlisted/Private visibility와 region을 선택한다. 모든 visibility는 같은 policy review를 거친다. | 기본 후보는 Public + all regions로 보되 Stage 2에서 작업지시자 의도 확인 항목으로 둔다. |
| Test instructions | publishing 필수는 아니며, reviewer가 제한 credential이나 paid account 없이 기능을 확인하기 어렵다면 제공한다. | `crop`은 account/paid feature가 없으므로 필수 입력 후보는 아니다. 수동 smoke 절차는 Stage 3 checklist에 둔다. |
| Review | broad host permissions와 sensitive permissions는 review time을 늘릴 수 있고, `<all_urls>` 같은 broad host access는 위험하게 취급된다. | 현재 `activeTab` 기반으로 broad host permission을 피하는 점을 permission justification에 유지한다. |
| Images | Store icon, screenshot, small promo image가 핵심 준비 항목이다. screenshot은 1280x800 또는 640x400, small promo는 440x280이다. | icon은 #9 Stage 5.2에서 해소, screenshot과 small promo는 제출 전 blocker로 유지한다. |

## Category 재대조

#9 기술 노트에는 category 후보가 `Productivity 또는 Tools 계열`로 남아 있다. 공식 Best Practices 문서 기준으로 2023년 중 category 체계가 바뀌었고, 기존 Productivity는 여러 category로 분리됐다. Screenshot/image capture 관련 설명은 `Art & Design`이 이미지·사진 보기/편집/정리/공유와 screenshot capture를 포함한다고 설명한다.

Stage 2 후보:

| 후보 | 판단 |
|---|---|
| `Art & Design` | 1차 후보. screenshot capture와 image output 기능 설명에 가장 직접적으로 맞는다. |
| `Tools` | fallback 후보. `crop`을 범용 utility로 볼 때 가능하지만 공식 설명상 "다른 category에 맞지 않는 tools"라 1차 후보로는 약하다. |
| `Workflow & Planning` | 생산성 계열 후속 후보. screenshot capture 자체와 직접성이 약하다. |
| `Productivity` | 현재 category label로 직접 선택 가능하다고 가정하지 않는다. 실제 Dashboard에 남아 있는지 확인 필요. |

## PR #38 반영 필요점

PR #38은 oversized full-page capture가 계획 단계에서 실패하지 않고 stitching 단계에서 output downscale을 적용해 단일 PNG를 만들도록 보정했다. 따라서 Store copy와 privacy/limitation 문구는 다음 기준으로 맞춰야 한다.

- "large canvas가 있으면 explicit size error로 실패"가 기본 설명이면 outdated다.
- "browser canvas limit을 넘는 경우 단일 PNG 유지를 위해 자동 downscale할 수 있음"이 최신 설명이다.
- "downscale 때문에 원본 DPR 해상도보다 낮아질 수 있음"을 tradeoff로 남긴다.
- lazy loading, animation, layout shift, sticky/fixed 변화 같은 stitched capture 품질 한계는 계속 유효하다.
- 실제 oversized full-page PNG dimension smoke는 아직 수동 후보로 남아 있다.

현행 grep 결과:

| 파일 | 상태 | Stage 2 조치 |
|---|---|---|
| `README.md`, `README.ko.md`, `README.zh-CN.md`, `README.ja.md` | PR #38 기준 downscale fallback 문구 반영됨 | Store copy와 충돌하지 않는지 유지 검토 |
| `PRIVACY.md` | `explicit size errors` 표현이 남아 있음 | browser limitation 문구를 downscale fallback 기준으로 최소 보정 필요 |
| `mydocs/tech/task_m030_9_chrome_web_store.md` | Stage 2 Store detailed description 초안에 `explicit size errors` 표현이 남아 있음 | #9 문서를 덮어쓰기보다 #37 기술 노트의 최종 Dashboard copy에서 최신 문구로 대체 |
| `mydocs/tech/task_m020_8_quality_matrix.md` | P6-40 downscale fallback 기준 반영됨 | Stage 3 smoke checklist에서 참조 |
| `mydocs/report/task_m020_35_report.md` | PR #38 최종 근거 문서 | Stage 2 copy 판단 근거로 유지 |

## 권한과 privacy 기준선

현재 `manifest.json` 권한:

```json
["activeTab", "scripting", "clipboardWrite", "downloads"]
```

요청하지 않는 권한:

- `debugger`
- `<all_urls>`
- broad `host_permissions`
- `tabs`

Stage 2 permission justification 기준:

| 권한 | 현재 사용처 | Dashboard justification 방향 |
|---|---|---|
| `activeTab` | 사용자가 action icon 또는 shortcut으로 실행한 현재 tab에 overlay injection과 visible-tab capture를 수행 | user gesture 후 현재 tab에서 screenshot selection/capture를 제공하기 위한 임시 접근 |
| `scripting` | `chrome.scripting.executeScript()`로 content overlay 주입 | 사용자가 실행한 active tab에 screenshot selection overlay를 주입하기 위해 필요 |
| `clipboardWrite` | Copy action에서 generated PNG를 clipboard에 write | 사용자가 Copy를 누를 때만 generated PNG를 system clipboard에 쓰기 위해 필요 |
| `downloads` | Save action에서 generated PNG download | 사용자가 Save를 누를 때만 generated PNG를 downloaded file로 저장하기 위해 필요 |

Stage 2 privacy 기준:

- screenshot pixels, page geometry, generated PNG는 screenshot selection/capture라는 single purpose 제공을 위해 browser local context에서 처리한다.
- 서버 upload, telemetry, analytics, advertising, account, payment 기능은 없다.
- Copy/Save는 사용자의 명시 action으로 clipboard/download 위치에 image를 내보낸다.
- Limited Use statement는 `PRIVACY.md`의 현재 문구를 유지하되, limitation 문구만 PR #38 기준으로 보정한다.

## #9 산출물과 현재 gap

| 항목 | #9 상태 | 현재 판단 |
|---|---|---|
| `PRIVACY.md` | Store privacy policy 후보 작성 완료 | PR #38 반영으로 limitation 문구 1곳 보정 필요 |
| Store copy 초안 | #9 기술 노트에 English short/detailed/single purpose 초안 존재 | Stage 2에서 #37 최종 copy로 재작성하고 old large canvas 표현 제거 |
| Permission justification | 4개 권한 draft 존재 | 현재 manifest와 일치, Stage 2에서 Dashboard 입력값 표로 확정 |
| Manifest icon / Store icon | #9 Stage 5.2에서 dark icon 기반 해소 | Stage 3 package contents에서 재확인 |
| Store screenshot | 없음 | 제출 전 blocker |
| Small promotional image | 없음 | 제출 전 blocker |
| Homepage URL | GitHub repository 후보 | Stage 2에서 최종 후보로 정리, 실제 입력은 승인 필요 |
| Support URL | GitHub Issues 후보 | Stage 2에서 최종 후보로 정리, 실제 입력은 승인 필요 |
| Privacy policy URL | PR merge 후 stable GitHub URL 후보 | Stage 2에서 `devel` 기준 URL 후보 정리 |
| Source map 포함 | #9에서 포함 정책 문서화 | Stage 3 package review에서 재확인 |

## Stage 2로 넘길 결정 항목

| 항목 | Stage 1 판단 | Stage 2 작업 |
|---|---|---|
| Detailed description | #9 초안을 그대로 쓰면 PR #38 이후 outdated 문구가 남음 | downscale fallback과 제한사항을 반영해 최종 copy 작성 |
| Category | `Art & Design` 1차 후보, `Tools` fallback | 실제 Dashboard 후보값과 작업지시자 의도를 반영해 최종 선택안 작성 |
| Privacy limitation copy | `PRIVACY.md`의 explicit size error 표현 outdated | 최소 문구 보정 |
| YouTube video | listing guide는 graphic assets에 video를 포함하지만 image guide mandatory set과 차이가 있음 | 실제 Dashboard 필수 여부를 `작업지시자 확인 필요`로 분리 |
| Distribution | Public + all regions 후보 | Stage 2에서 승인 필요 항목으로 명시 |
| Test instructions | account/paid gate가 없어 필수 아님 | reviewer용 간단 smoke instruction 필요 여부 결정 |

## Stage 1 결론

- #37은 #9의 Store 준비 산출물을 재사용할 수 있지만, PR #38 이후 large canvas/downscale 설명은 Stage 2에서 반드시 최신화해야 한다.
- README family와 Phase 6 품질 매트릭스는 PR #38 기준으로 이미 갱신되어 있다.
- `PRIVACY.md`는 browser/page limitation 문구 중 `explicit size errors` 표현을 downscale fallback 기준으로 보정해야 한다.
- #9 기술 노트는 선행 이력으로 유지하고, 최종 Dashboard 입력값은 새 #37 기술 노트에서 확정한다.
- Store icon/manifest icon은 해소됐지만 Store screenshot과 small promotional image는 제출 전 blocker로 계속 남는다.
- 실제 Dashboard 화면은 아직 직접 확인하지 않았으므로, Stage 2에서는 공식 문서 기준값과 `작업지시자 확인 필요` 값을 분리해야 한다.
