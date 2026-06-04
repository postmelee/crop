# Task #9 Stage 3 보고서 - Release package와 source availability 정리

GitHub Issue: [#9](https://github.com/postmelee/crop/issues/9)
구현계획서: [`task_m030_9_impl.md`](../plans/task_m030_9_impl.md)
Stage: 3

## 단계 목적

Chrome Web Store upload 후보 package를 실제 `npm run build` 산출물 기준으로 검증하고, zip root, locale 포함, source map 포함 정책, MPL/source availability 점검 결과를 `mydocs/tech`에 확정한다. 이번 Stage는 package 절차와 source availability checklist를 문서화하는 단계이며, Store upload나 asset 제작은 수행하지 않는다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/tech/task_m030_9_chrome_web_store.md` | Stage 3 release package checklist, zip contents, source map 포함 정책, source availability checklist, runtime package와 public repository source availability 분리 판단을 추가했다. |
| `mydocs/working/task_m030_9_stage3.md` | Stage 3 완료 보고서와 검증 결과를 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

기존 Store 정책/Store copy 초안 본문은 보존하고 Stage 3 섹션을 추가·갱신했다. `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0`, README 본문은 검토 결과 보강이 필요하지 않아 변경하지 않았다. 코드와 build 설정도 변경하지 않았다.

## 검증 결과

실행 명령:

```bash
npm run build
find dist -maxdepth 3 -type f | sort
sed -n '1,220p' dist/manifest.json
(cd dist && zip -qr /tmp/crop-0.1.0-cws.zip .)
unzip -l /tmp/crop-0.1.0-cws.zip
rg -n "MPL|Mozilla|Firefox|source|LICENSE-MPL-2.0|NOTICE|THIRD_PARTY|affiliated|endorsed|sponsored" README.md PRIVACY.md NOTICE THIRD_PARTY.md mydocs/tech/task_m030_9_chrome_web_store.md
git diff --check
```

결과:

- OK: `npm run build` 통과. Vite가 21 modules를 transform했고 `dist/manifest.json`, `dist/background/service-worker.js`, `dist/content/inject.js`, source maps, `_locales/*/messages.json`를 생성했다.
- OK: `find dist -maxdepth 3 -type f | sort`에서 9개 파일을 확인했다.
- OK: `dist/manifest.json` root manifest는 MV3, version `0.1.0`, `default_locale: en`, 권한 `activeTab`, `scripting`, `clipboardWrite`, `downloads`를 유지했다.
- OK: `(cd dist && zip -qr /tmp/crop-0.1.0-cws.zip .)` 통과.
- OK: `unzip -l /tmp/crop-0.1.0-cws.zip`에서 `manifest.json`이 zip root에 있고 `_locales/en`, `_locales/ko`, `_locales/ja`, `_locales/zh_CN` 메시지가 포함됨을 확인했다.
- OK: zip contents는 16 entries, uncompressed total 393,343 bytes, zip file size 95,172 bytes다.
- OK: zip에는 `node_modules/`, `mydocs/`, repository root 개발 파일이 포함되지 않았다.
- OK: source availability grep에서 README, `PRIVACY.md`, `NOTICE`, `THIRD_PARTY.md`, 기술 노트가 MPL/source/non-affiliation 문맥을 유지함을 확인했다.
- OK: Firefox-derived TypeScript 파일 4개가 MPL header를 유지함을 별도 확인했다.
- OK: `git diff --check`가 경고 없이 통과했다.

## 잔여 위험

- 현재 upload 후보 zip에는 source map이 포함된다. public source repository를 전제로 Store review/readability에는 유리하지만 bundled source 노출면은 넓어진다. source map 제외가 필요하면 별도 승인된 build policy 변경이 필요하다.
- Chrome Web Store upload zip에는 runtime files만 포함하고 `NOTICE`, `THIRD_PARTY.md`, `LICENSE*`, `PRIVACY.md`는 포함하지 않는다. 사용자/reviewer 접근은 Store listing URL과 public repository로 제공하는 판단이다.
- Store icon, screenshot, small promo image blocker는 여전히 남아 있다.

## 다음 단계 영향

- Stage 4는 Stage 3의 zip contents와 source map 포함 정책을 최종 blocker/제출 전 승인 항목에 반영한다.
- Stage 4는 Store listing Homepage/Support URL을 public repository로 두는 판단이 source availability 제공과 맞는지 다시 점검한다.
- Stage 4는 typecheck/test/build와 통합 grep을 재실행해 Stage 1~3 문서가 서로 충돌하지 않는지 확인한다.

## 승인 요청

- Stage 3 산출물과 검증 결과를 승인하면 Stage 4 `통합 검증과 제출 전 blocker 정리`로 진행한다.
