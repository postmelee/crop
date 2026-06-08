# Task #51 Stage 1 보고서 - README 게시 상태 기준 확인

GitHub Issue: [#51](https://github.com/postmelee/crop/issues/51)
구현계획서: [`task_m030_51_impl.md`](../plans/task_m030_51_impl.md)
Stage: 1

## 단계 목적

Chrome Web Store 게시 완료 후 README 갱신 전에, 공개 listing URL 접근 가능 여부와 README 4개 언어 파일의 현재 release/install 문구를 확인했다. 이번 Stage는 README 본문을 수정하지 않고 Stage 2에서 적용할 변경 방향과 제외 항목을 고정하는 단계다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `mydocs/working/task_m030_51_stage1.md` | Store URL 접근 결과, README 현황, 권한/제한 문구 대조, Stage 2 반영 방향 기록 |
| `mydocs/orders/20260608.md` | #51 상태 비고를 Stage 1 완료 보고 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

README 본문과 manifest는 수정하지 않았다. 원문은 무손실 상태이며, 이번 Stage의 변경은 하이퍼-워터폴 작업 산출물과 오늘할일 상태 문구에 한정된다.

## 확인 결과

### Chrome Web Store URL

- 확인 URL: `https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki`
- `curl -I -L --max-time 20` 결과: `HTTP/2 200`
- `curl -L --max-time 20` 결과: `200`, 최종 URL 동일, 다운로드 크기 `694992` bytes
- HTML 메타 추출:
  - title: `crop - Chrome Web Store`
  - canonical: `https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki`
  - description: `Capture visible elements on the current page.`
  - og:title: `crop - Chrome Web Store`
  - og:url: `https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki`
- Store HTML에서 privacy URL `https://github.com/postmelee/crop/blob/main/PRIVACY.md`와 support URL `https://github.com/postmelee/crop/issues`가 확인됐다.

주의: Chrome Web Store는 동적 페이지이므로 브라우저 UI의 버튼 상태까지는 Stage 1 명령으로 검증하지 않았다. 다만 공개 URL은 HTTP 200으로 접근 가능하고, canonical/title/description/extension id가 작업지시자가 제공한 listing과 일치한다.

### README 현황

- `README.md`: `Release status`가 "Chrome Web Store release preparation"과 "not listed yet"를 포함하고, `Load from source`가 첫 설치 경로로 배치돼 있다.
- `README.ko.md`: `배포 상태`가 "배포 준비 중"과 "아직 Chrome Web Store에 등록되어 있지 않음"을 포함하고, `소스에서 로드`가 첫 설치 경로로 배치돼 있다.
- `README.ja.md`: `リリース状況`이 "公開準備中"과 "まだ Chrome Web Store には掲載されていません"를 포함하고, `ソースから読み込む`가 첫 설치 경로로 배치돼 있다.
- `README.zh-CN.md`: `发布状态`가 "准备 Chrome Web Store 发布"과 "尚未上架 Chrome Web Store"를 포함하고, `从源码加载`이 첫 설치 경로로 배치돼 있다.

### 권한과 제한 문구

- `manifest.json` 권한은 `activeTab`, `scripting`, `clipboardWrite`, `downloads`다.
- README 4개 언어 파일의 권한 표도 같은 4개 권한을 설명한다.
- README 4개 언어 파일 모두 `debugger`, `<all_urls>`, broad host permissions 또는 `host_permissions`를 요청하지 않는다고 설명한다.
- Current Limits의 "Chrome Web Store pages에서는 확장 주입이 막힌다"는 문구는 Store 설치 링크와 충돌하지 않는다. Stage 2에서는 이 제한이 설치 페이지 접근 제한이 아니라 확장 실행/주입 제한임을 유지하면 된다.

## Stage 2 반영 방향

- README 4개 언어 파일 모두 release status를 "Chrome Web Store에서 설치 가능"한 상태로 갱신한다.
- 첫 사용자 설치 경로로 Chrome Web Store URL을 배치한다.
- 기존 source build/load unpacked 안내는 개발자용 경로로 유지하되, 첫 설치 경로에서는 내린다.
- 권한 표, privacy policy 본문 링크, current limits의 핵심 경계는 변경하지 않는다.
- Store listing copy, extension 기능, 권한, privacy policy 본문은 이번 task에서 변경하지 않는다.

## 검증 결과

실행 명령:

```bash
git status --short --branch
rg -n "Release status|배포 상태|リリース状況|发布状态|Chrome Web Store|listed|Load from source|소스에서 로드|ソースから読み込む|从源码加载|Privacy Policy|Permissions|Current Limits|권한|개인정보|現在の制限|当前限制" README.md README.ko.md README.ja.md README.zh-CN.md
rg -n "debugger|<all_urls>|host_permissions|downloads|activeTab|scripting|clipboardWrite" manifest.json README.md README.ko.md README.ja.md README.zh-CN.md
curl -I -L --max-time 20 https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki
curl -L --max-time 20 -o /tmp/cws_crop_task51.html -w "%{http_code} %{url_effective} %{size_download}\n" https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki
perl -0777 -ne 'print "title=$1\n" if /<title>([^<]+)<\/title>/; print "canonical=$1\n" if /<link rel="canonical" href="([^"]+)"/; print "description=$1\n" if /<meta name="description" content="([^"]+)"/; print "og_title=$1\n" if /<meta property="og:title" content="([^"]+)"/; print "og_url=$1\n" if /<meta property="og:url" content="([^"]+)"/' /tmp/cws_crop_task51.html
git diff --check
```

결과:

- `git status --short --branch`: `## local/task51`
- README grep: 4개 언어 파일 모두 게시 전 release status와 source loading 섹션 존재 확인
- 권한 grep: manifest와 README 4개 언어 파일 모두 `activeTab`, `scripting`, `clipboardWrite`, `downloads` 확인
- forbidden permission grep: README 4개 언어 파일 모두 `debugger`, `<all_urls>`, `host_permissions` 미요청 설명 확인
- Store URL HEAD/GET: `HTTP 200`, canonical/title/description/og URL이 `crop` listing과 일치
- `git diff --check`: 통과

## 잔여 위험

- Chrome Web Store는 동적 페이지라 CLI HTML 확인만으로 사용자의 Chrome UI에서 보이는 `Add to Chrome` 버튼 상태까지 보장하지 않는다.
- Stage 2에서 다국어 README 4개를 동시에 수정하므로 언어별 release status 표현이 어긋날 수 있다.

## 다음 단계 영향

- Stage 2에서는 README 4개 언어 파일을 모두 수정 대상으로 삼는다.
- Store URL은 `https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki`로 고정한다.
- source loading 안내는 삭제하지 않고 개발자용 경로로 유지한다.
- 권한/Privacy/Current Limits 섹션은 문구 충돌이 없으므로 핵심 내용 변경 없이 유지한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2에서 README 4개 언어 파일의 설치 안내를 갱신한다.
