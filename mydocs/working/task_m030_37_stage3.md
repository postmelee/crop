# Task #37 Stage 3 보고서 - Package/Upload와 제출 전 smoke checklist 확정

GitHub Issue: [#37](https://github.com/postmelee/crop/issues/37)
구현계획서: [`task_m030_37_impl.md`](../plans/task_m030_37_impl.md)
Stage: 3

## 단계 목적

Stage 3은 Chrome Web Store upload package 절차와 제출 전 수동 smoke checklist를 확정하는 단계다. 최신 `local/task37` 기준으로 fresh build와 fresh ZIP을 생성하고, ZIP root contents, `dist/manifest.json`, locale/icon 포함 여부, 제외 항목, asset blocker, Dashboard 직접 입력 타이밍을 정리했다.

실제 Chrome Web Store Dashboard upload, 저장, review submit은 수행하지 않았다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/tech/task_m030_37_chrome_web_store_dashboard.md` | Stage 3 Package/Upload checklist, ZIP contents, manifest review, source map policy, asset/listing checklist, Dashboard 직접 입력 타이밍, reviewer smoke text, 제출 전 수동 smoke checklist 추가 |
| `mydocs/orders/20260606.md` | #37 비고를 Stage 3 package/upload checklist 확정 후 승인 대기 상태로 갱신 |
| `mydocs/working/task_m030_37_stage3.md` | Stage 3 산출물, 검증 결과, 잔여 위험, 다음 단계 영향을 기록 |

## 본문 변경 정도 / 본문 무손실 여부

`mydocs/tech/task_m030_37_chrome_web_store_dashboard.md`는 Stage 2 결론 아래에 Stage 3 section을 추가했다. Stage 1/2의 조사 내용과 Dashboard 입력값 표는 보존했다.

오늘할일은 #37 행 비고만 Stage 3 승인 대기 상태로 갱신했다. source code, manifest source, README family, `PRIVACY.md`, `_locales`는 수정하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run build
python3 -c 'from pathlib import Path; from zipfile import ZipFile, ZIP_DEFLATED; root=Path("dist"); z=ZipFile("/tmp/crop-0.1.0-cws.zip","w",ZIP_DEFLATED); [z.write(p,p.relative_to(root).as_posix()) for p in sorted(root.rglob("*")) if p.is_file()]; z.close()'
unzip -l /tmp/crop-0.1.0-cws.zip
sed -n '1,240p' dist/manifest.json
rg -n "Store screenshot|Small promotional image|small promo|1280x800|640x400|440x280|localized|marquee|video|review submit|upload" mydocs/tech/task_m030_37_chrome_web_store_dashboard.md
git diff --check
```

보조 확인:

```bash
find dist -maxdepth 4 -type f | sort
file dist/icons/crop-16.png dist/icons/crop-32.png dist/icons/crop-48.png dist/icons/crop-128.png
unzip -Z1 /tmp/crop-0.1.0-cws.zip
rg -n "node_modules|mydocs|README|PRIVACY|NOTICE|THIRD_PARTY|LICENSE|package.json|vite.config|tsconfig" <(unzip -Z1 /tmp/crop-0.1.0-cws.zip)
```

결과:

- OK: `npm run build` 통과. `dist/manifest.json`, `_locales/*/messages.json`, `background/service-worker.js`, `content/inject.js`, source maps가 생성됐다.
- OK: `/tmp/crop-0.1.0-cws.zip` fresh 생성 통과.
- OK: `unzip -l` 기준 ZIP은 13 files이며 root에 `manifest.json`이 있다.
- OK: ZIP에는 `_locales/en`, `_locales/ko`, `_locales/ja`, `_locales/zh_CN` 메시지 파일이 포함된다.
- OK: ZIP에는 `icons/crop-16.png`, `icons/crop-32.png`, `icons/crop-48.png`, `icons/crop-128.png`가 포함되고 각 PNG dimension은 16/32/48/128과 일치한다.
- OK: `dist/manifest.json` 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads`만 포함한다.
- OK: `dist/manifest.json`에는 `host_permissions`, `debugger`, `<all_urls>`, `tabs`가 없다.
- OK: ZIP contents grep에서 `node_modules`, `mydocs`, README/PRIVACY/NOTICE/LICENSE/package/config 파일은 매칭되지 않았다.
- OK: asset/checklist grep에서 Store screenshot, small promotional image, 1280x800/640x400, 440x280, localized, marquee, video, review submit, upload 항목이 Stage 3 기술 노트에 모두 포함됐다.
- OK: `git diff --check` 경고 없음.

## 잔여 위험

- 실제 Chrome Web Store Developer Dashboard upload는 수행하지 않았다. Dashboard의 field 필수 여부, YouTube video blocker 여부, Official URL dropdown, deferred publishing UI는 실제 화면에서 확인해야 한다.
- global small promotional image 1개는 계속 제출 전 blocker다. small/marquee promo는 locale별 입력이 불가능하다.
- English/Korean screenshots와 promo video는 작업지시자가 준비했지만, 파일명/URL/화면 품질 자체는 이 저장소에서 검증하지 않았다.
- Japanese/Simplified Chinese localized screenshots/video는 준비 여부가 확인되지 않아 global fallback 또는 후속 asset 제작 후보로 남는다.
- source map 포함 정책은 유지했다. source map 제외가 필요하면 별도 build policy 변경이 필요하다.

## 다음 단계 영향

- Stage 4는 build/typecheck/test와 권한/privacy/branding/downscale/upload grep을 통합 검증으로 다시 실행한다.
- Stage 4 최종 보고서에는 Dashboard 직접 입력 타이밍을 반영한다: Stage 3 승인 후 draft 입력 가능, 실제 ZIP upload/review submit은 Stage 4 최종 검증 승인 후.
- Stage 4는 실제 Dashboard upload/review submit을 계속 수행하지 않았음을 명시하고, 작업지시자 승인 필요 항목을 최종 분리한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4 `통합 검증과 최종 보고`로 진행한다.
