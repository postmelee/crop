# Task #9 Stage 4 보고서 - 제출 전 blocker와 통합 검증 정리

GitHub Issue: [#9](https://github.com/postmelee/crop/issues/9)
구현계획서: [`task_m030_9_impl.md`](../plans/task_m030_9_impl.md)
Stage: 4

## 단계 목적

Stage 1~3 산출물을 통합 검토하고, Chrome Web Store 제출 전 blocker, 승인 필요 항목, 후속 개선 후보, 수동 smoke checklist를 최종 정리한다. 이번 Stage는 실제 Store 제출이나 asset 제작이 아니라, 제출 가능성 판단과 최종 자동 검증을 끝내는 단계다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/tech/task_m030_9_chrome_web_store.md` | 제출 차단 blocker, 제출 전 승인 필요 항목, 후속 개선 후보, 수동 smoke checklist, Stage 4 통합 결론을 추가했다. |
| `mydocs/working/task_m030_9_stage4.md` | Stage 4 완료 보고서와 통합 검증 결과를 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

기존 Stage 1~3 기술 노트 본문은 보존하고 Stage 4 결론을 추가했다. `PRIVACY.md`, README family, `NOTICE`, `THIRD_PARTY.md`, source, build 설정은 변경하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run typecheck
npm test
npm run build
find dist -maxdepth 3 -type f | sort
sed -n '1,220p' dist/manifest.json
(cd dist && zip -qr /tmp/crop-0.1.0-cws.zip .)
unzip -l /tmp/crop-0.1.0-cws.zip
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" manifest.json dist/manifest.json README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md mydocs/tech/task_m030_9_chrome_web_store.md src tests
rg -n "server|telemetry|analytics|local|privacy|clipboard|download|Mozilla|Firefox|official|affiliated|endorsed|sponsored" README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md NOTICE THIRD_PARTY.md mydocs/tech/task_m030_9_chrome_web_store.md
git diff --check
git status --short
```

결과:

- OK: `npm run typecheck` 통과.
- OK: `npm test` 통과. 17 files, 201 tests passed.
- OK: `npm run build` 통과. Vite build가 `dist/manifest.json`, background/content bundle, source maps, `_locales/*/messages.json`를 생성했다.
- OK: `find dist -maxdepth 3 -type f | sort`에서 9개 runtime files를 확인했다.
- OK: `dist/manifest.json`은 MV3, version `0.1.0`, `default_locale: en`, 권한 `activeTab`, `scripting`, `clipboardWrite`, `downloads`를 유지했다.
- OK: `/tmp/crop-0.1.0-cws.zip` 생성 명령 통과.
- OK: `unzip -l /tmp/crop-0.1.0-cws.zip`에서 zip root `manifest.json`, `_locales/en`, `_locales/ko`, `_locales/ja`, `_locales/zh_CN` 포함을 확인했다. Zip contents는 16 entries, uncompressed total 393,343 bytes.
- OK: 권한 grep에서 manifest와 dist manifest의 요청 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads`이며, `debugger`, `<all_urls>`, broad `host_permissions`는 요청 권한으로 추가되지 않았다.
- OK: privacy/branding grep에서 no server upload, no telemetry/analytics, local processing, clipboard/download user action, Mozilla/Firefox non-affiliation/source attribution 문맥을 확인했다.
- OK: `git diff --check`가 경고 없이 통과했다.
- OK: `git status --short`는 커밋 전 예상 변경인 `M mydocs/tech/task_m030_9_chrome_web_store.md`만 표시했다. Stage 4 보고서 작성 후 이 보고서와 함께 커밋한다.

## 잔여 위험

- 제출 차단 blocker: manifest icon, Store icon, Store screenshot, small promotional image가 아직 없다.
- 제출 전 승인 필요: Dashboard 입력, upload package 선택, review submit, privacy policy stable URL, category, Homepage/Support URL, source map 포함 최종 판단.
- 수동 smoke는 Stage 4에서 실행하지 않았다. 제출 전 `dist/` unpacked load, action/shortcut, selected/visible/full-page Copy/Save, restricted page/cross-origin iframe 제한을 수동 확인해야 한다.
- Promo video, localized Store listing copy, localized screenshots, marquee promotional image는 후속 개선 후보로 남겼다.

## 다음 단계 영향

- 모든 Stage가 끝났으므로 다음 단계는 `task-final-report` 절차다.
- 최종 보고서에는 Stage 4 blocker 표, zip/package 검증 결과, Store submit 제외 범위, 수동 smoke 미실행 범위를 그대로 반영해야 한다.
- 최종 보고서 승인 후에만 PR 게시 절차로 진행한다.

## 승인 요청

- Stage 4 산출물과 검증 결과를 승인하면 `task-final-report` 절차로 최종 보고서 작성과 PR 준비를 진행한다.
