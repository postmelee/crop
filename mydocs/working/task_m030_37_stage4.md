# Task #37 Stage 4 보고서 - 통합 검증과 최종 보고

GitHub Issue: [#37](https://github.com/postmelee/crop/issues/37)
구현계획서: [`task_m030_37_impl.md`](../plans/task_m030_37_impl.md)
Stage: 4

## 단계 목적

Stage 4는 Stage 1~3 산출물을 통합 검증하고, 최종 보고서와 작업지시자용 Chrome Web Store Developer Dashboard 직접 입력 가이드를 작성하는 단계다. build/typecheck/test, fresh package, 권한/privacy/branding/downscale/upload grep을 다시 실행해 제출 체크리스트가 현재 `local/task37` 상태와 맞는지 확인했다.

실제 Chrome Web Store Dashboard upload, 저장, review submit은 수행하지 않았다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md` | Stage 4 통합 검증 결론과 Dashboard 직접 입력 가이드 추가 |
| `mydocs/report/task_m030_37_report.md` | Task #37 최종 보고서 작성 |
| `mydocs/orders/20260606.md` | #37 완료 처리 |
| `mydocs/working/task_m030_37_stage4.md` | Stage 4 산출물, 검증 결과, 잔여 위험, 다음 단계 영향을 기록 |

## 본문 변경 정도 / 본문 무손실 여부

`mydocs/tech/task_m030_37_chrome_web_store_dashboard.md`는 기존 Stage 1~3 기록을 보존하고 Stage 4 section을 하단에 추가했다. Dashboard 입력 가이드는 Stage 2/3에서 확정한 값을 실제 Dashboard 순서에 맞춰 재배열한 문서 산출물이며, extension source behavior를 변경하지 않는다.

source code, manifest source, README family, `PRIVACY.md`, `_locales`는 수정하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run build
npm run typecheck
npm test
python3 -c 'from pathlib import Path; from zipfile import ZipFile, ZIP_DEFLATED; root=Path("dist"); z=ZipFile("/tmp/crop-0.1.0-cws.zip","w",ZIP_DEFLATED); [z.write(p,p.relative_to(root).as_posix()) for p in sorted(root.rglob("*")) if p.is_file()]; z.close()'
sed -n '1,240p' dist/manifest.json
unzip -l /tmp/crop-0.1.0-cws.zip
rg -n "activeTab|scripting|clipboardWrite|downloads|debugger|<all_urls>|host_permissions" manifest.json dist/manifest.json README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md mydocs/tech
rg -n "server|telemetry|analytics|local|privacy|clipboard|download|Mozilla|Firefox|affiliated|endorsed|sponsored" README.md README.ko.md README.zh-CN.md README.ja.md PRIVACY.md NOTICE THIRD_PARTY.md mydocs/tech
rg -n "downscale|maximum canvas|large canvas|full-page|full page|전체 페이지|upload|review submit|Store screenshot|Small promotional" README*.md PRIVACY.md mydocs/tech mydocs/report/task_m030_37_report.md
git diff --check
git status --short
```

결과:

- OK: `npm run build` 통과. Vite build에서 21 modules transformed, `dist/manifest.json`, `_locales/*`, background/content bundles와 source maps가 생성됐다.
- OK: `npm run typecheck` 통과. `tsc --noEmit` 오류 없음.
- OK: `npm test` 통과. 17 files, 213 tests passed.
- OK: `/tmp/crop-0.1.0-cws.zip` fresh 생성 통과.
- OK: `dist/manifest.json`은 MV3, version `0.1.0`, `default_locale: en`, icon 16/32/48/128, 권한 4개를 포함한다.
- OK: ZIP은 13 files, uncompressed total 436,898 bytes이며 root에 `manifest.json`이 있다.
- OK: ZIP에는 `_locales/en`, `_locales/ko`, `_locales/ja`, `_locales/zh_CN`과 `icons/crop-16/32/48/128.png`가 포함된다.
- OK: 권한 grep에서 `manifest.json`과 `dist/manifest.json` 요청 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads`만 확인된다.
- OK: `debugger`, `<all_urls>`, broad `host_permissions`는 요청 권한으로 추가되지 않았다.
- OK: privacy/branding grep에서 local processing, no server upload, no telemetry/analytics, Copy/Save explicit action이 유지된다. Mozilla/Firefox 표현은 README/NOTICE/THIRD_PARTY와 과거 기술 노트의 출처·비제휴 맥락이며 Stage 2/4 Store copy에는 사용하지 않았다.
- OK: downscale/upload grep에서 PR #38 downscale fallback, Store screenshot/small promotional image, upload/review submit 보류, Dashboard 입력 가이드가 최종 보고서와 기술 노트에 반영됐다. 최종 보고서 작성 전에는 대상 파일이 없어 같은 grep이 한 번 실패했지만, 보고서 작성 후 재실행해 통과했다.
- OK: `git diff --check` 경고 없음.
- OK: `git status --short`는 Stage 4 산출 파일 변경만 표시한다.

## 잔여 위험

- 실제 Chrome Web Store Developer Dashboard upload, 저장, review submit은 수행하지 않았다.
- Dashboard 실제 UI의 YouTube video 필수 여부, Official URL dropdown, deferred publishing option은 작업지시자가 화면에서 확인해야 한다.
- global small promotional image 440x280 1개는 계속 제출 전 blocker다.
- English/Korean screenshots와 promo video는 준비됐지만 파일 품질과 YouTube URL 자체는 저장소에서 검증하지 않았다.
- privacy policy URL은 PR merge 후 `devel` 또는 release tag 기준 stable URL로 최종 확인해야 한다.

## 다음 단계 영향

- Stage 4 산출물 승인 후 `task-final-report` 절차로 publish branch push와 `devel` 대상 PR 생성을 진행한다.
- 실제 Chrome Web Store Dashboard 입력은 최종 보고서와 기술 노트의 입력 가이드를 따라 작업지시자가 직접 수행한다.
- `Submit for review`는 PR merge, stable privacy URL, global small promo, 제출 직전 smoke, deferred publishing 선택 확인 후 진행한다.

## 승인 요청

- Stage 4 산출물과 최종 보고서를 승인하면 PR 게시 절차로 진행한다.
