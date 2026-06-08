# Task #51 Stage 2 보고서 - README 설치 안내 갱신

GitHub Issue: [#51](https://github.com/postmelee/crop/issues/51)
구현계획서: [`task_m030_51_impl.md`](../plans/task_m030_51_impl.md)
Stage: 2

## 단계 목적

Chrome Web Store 게시 완료 상태에 맞춰 README 4개 언어 파일의 첫 사용자 설치 안내를 공식 Store 설치 경로 중심으로 갱신했다. source build/load unpacked 안내는 삭제하지 않고 개발자용 경로로 재배치했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `README.md` | release status를 게시 완료 상태로 갱신하고, Chrome Web Store 설치 섹션을 상단에 추가했다. 기존 source loading 절차는 `Load from source for development`로 유지했다. |
| `README.ko.md` | 한국어 release status와 Store 설치 섹션을 추가하고, 기존 source loading 절차를 `개발용 소스 로드`로 유지했다. |
| `README.ja.md` | 일본어 release status와 Store 설치 섹션을 추가하고, 기존 source loading 절차를 `開発用にソースから読み込む`로 유지했다. |
| `README.zh-CN.md` | 중국어 간체 release status와 Store 설치 섹션을 추가하고, 기존 source loading 절차를 `开发用源码加载`으로 유지했다. |
| `mydocs/working/task_m030_51_stage2.md` | Stage 2 변경 내용과 검증 결과 기록 |
| `mydocs/orders/20260608.md` | #51 상태 비고를 Stage 2 완료 보고 후 승인 대기로 갱신 |

## 본문 변경 정도 / 본문 무손실 여부

README 4개 언어 파일의 상단 release/install 구조를 변경했다. 기존 기능 목록, 기본 사용법, source build/load unpacked 절차, 권한 표, privacy 설명, current limits 설명은 내용상 보존했다.

변경한 내용:

- 게시 전 release status를 게시 완료 상태로 교체했다.
- Store URL `https://chromewebstore.google.com/detail/crop/pdmniipgbjdcpnhbkkppodechbehagki`를 첫 설치 경로로 추가했다.
- 기본 사용법을 source loading 안내보다 앞에 배치했다.
- source loading 섹션명을 개발자용 경로로 바꾸고 기존 절차를 유지했다.
- 단축키 충돌 안내를 source loading 절차 아래에서 설치 직후 안내로 옮겼다.

변경하지 않은 내용:

- `manifest.json`
- permissions 표의 권한 목록과 설명
- privacy policy 본문 및 링크
- current limits의 제한사항 설명
- Store listing copy
- extension 기능과 권한

## 검증 결과

실행 명령:

```bash
git status --short --branch
rg -n "Chrome Web Store|pdmniipgbjdcpnhbkkppodechbehagki|load unpacked|Load unpacked|Privacy Policy|Permissions|Current Limits|debugger|<all_urls>|host_permissions" README.md README.ko.md README.ja.md README.zh-CN.md
rg -n "release preparation|not listed|등록되어 있지|배포 준비 중|公開準備中|掲載されていません|尚未上架|准备 Chrome Web Store" README.md README.ko.md README.ja.md README.zh-CN.md
git diff -- README.md README.ko.md README.ja.md README.zh-CN.md
git diff --check
```

결과:

- `git status --short --branch`: `local/task51`에서 README 4개 언어 파일 수정 상태 확인
- Store URL grep: README 4개 언어 파일 모두 extension id `pdmniipgbjdcpnhbkkppodechbehagki` 포함
- source loading grep: README 4개 언어 파일 모두 `Load unpacked` 또는 해당 개발용 source loading 절차 유지
- permissions/privacy/current limits grep: README의 기존 권한, privacy, 제한 문구 유지 확인
- forbidden permission 설명: README 4개 언어 파일 모두 `debugger`, `<all_urls>`, `host_permissions` 미요청 설명 유지
- 게시 전 문구 grep: exit code `1`, 게시 전 표현 남지 않음
- `git diff -- README.md README.ko.md README.ja.md README.zh-CN.md`: Store 설치 섹션 추가와 source loading 섹션 재배치만 확인
- `git diff --check`: 통과

## 잔여 위험

- 다국어 README 문구는 의미를 맞췄지만 전문 번역 검수는 별도로 수행하지 않았다.
- Chrome Web Store 동적 UI의 실제 버튼 상태는 Stage 1의 HTTP/HTML 확인 범위 밖이며, 이번 Stage에서도 README 문서 변경만 검증했다.

## 다음 단계 영향

- Stage 3에서는 README 4개 언어 파일과 Stage 1~2 보고서를 대상으로 최종 grep과 diff check를 수행한다.
- 최종 보고서에는 README 4개 언어 파일을 모두 변경한 근거와 변경하지 않은 범위를 명시한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3에서 최종 검증과 보고서를 작성한다.
