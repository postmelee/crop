# Task #9 Stage 5.1 보고서 - 사용자 제공 아이콘 기반 asset 재생성

GitHub Issue: [#9](https://github.com/postmelee/crop/issues/9)
구현계획서: [`task_m030_9_impl.md`](../plans/task_m030_9_impl.md)
Stage: 5.1

## 단계 목적

작업지시자가 제공한 `/Users/melee/Documents/projects/Icon-iOS-Default-128x128@2x.png`를 기준으로 기존 `crop` icon asset set을 다시 생성한다. Manifest path는 유지하고, Chrome Web Store 제출 후보 icon의 시각 결과만 사용자 제공 아이콘으로 교체한다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `public/icons/crop-16.png` | 사용자 제공 256x256 PNG에서 16x16 PNG를 재생성했다. |
| `public/icons/crop-32.png` | 사용자 제공 256x256 PNG에서 32x32 PNG를 재생성했다. |
| `public/icons/crop-48.png` | 사용자 제공 256x256 PNG에서 48x48 PNG를 재생성했다. |
| `public/icons/crop-128.png` | 사용자 제공 256x256 PNG에서 128x128 PNG를 재생성했다. |
| `public/icons/crop.svg` | 더 이상 실제 원본과 일치하지 않는 Stage 5 SVG를 제거했다. |
| `mydocs/plans/task_m030_9_impl.md` | Stage 5 asset 설명을 사용자 제공 PNG 기반으로 보정했다. |
| `mydocs/tech/task_m030_9_chrome_web_store.md` | 최신 icon asset 상태와 SVG 제거 결과를 반영했다. |
| `mydocs/working/task_m030_9_stage5.md` | Stage 5 보고서의 SVG와 zip contents 설명을 최신 asset 구성에 맞췄다. |
| `mydocs/orders/20260604.md` | #9 상태 비고를 Stage 5.1 진행으로 갱신했다. |
| `mydocs/working/task_m030_9_stage5_1.md` | Stage 5.1 완료 보고서와 검증 결과를 기록했다. |

## 본문 변경 정도 / 본문 무손실 여부

Manifest path와 extension 권한은 변경하지 않았다. 기존 문서의 Stage 1~4 내용은 유지하고, Stage 5의 asset 원천과 package 포함 파일 수만 최신 상태에 맞게 보정했다.

## 검증 결과

실행 명령:

```bash
file public/icons/crop-16.png public/icons/crop-32.png public/icons/crop-48.png public/icons/crop-128.png
npm run typecheck
npm test
npm run build
find dist -maxdepth 3 -type f | sort
sed -n '1,240p' dist/manifest.json
python3 - <<'PY'
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path("dist")
with ZipFile("/tmp/crop-0.1.0-cws.zip", "w", ZIP_DEFLATED) as zf:
    for path in sorted(root.rglob("*")):
        if path.is_file():
            zf.write(path, path.relative_to(root).as_posix())
PY
unzip -l /tmp/crop-0.1.0-cws.zip
git diff --check
git status --short
```

결과:

- OK: `file` 확인에서 16/32/48/128 PNG는 각 크기의 8-bit RGBA PNG로 식별됐다.
- OK: `npm run typecheck` 통과.
- OK: `npm test` 통과. 17 files, 202 tests passed.
- OK: `npm run build` 통과.
- OK: `find dist -maxdepth 3 -type f | sort`에서 13개 파일을 확인했고 `dist/icons/crop-{16,32,48,128}.png`만 포함됐다.
- OK: `dist/manifest.json`에 `icons`와 `action.default_icon`이 모두 `icons/crop-{16,32,48,128}.png`를 가리키는 것을 확인했다.
- OK: fresh write 방식으로 `/tmp/crop-0.1.0-cws.zip`를 재생성했다.
- OK: `unzip -l /tmp/crop-0.1.0-cws.zip`에서 13 files, uncompressed total 411,869 bytes를 확인했고, `icons/crop.svg` 없이 PNG icon 4개만 포함됐다.
- OK: `git diff --check`가 경고 없이 통과했다.
- OK: `git status --short`는 커밋 전 예상 변경인 docs, `public/icons/*` PNG 변경, `public/icons/crop.svg` 삭제, Stage 5.1 보고서만 표시했다.

## 잔여 위험

- Store screenshot은 아직 없다. 실제 제출 전 1280x800 또는 640x400 screenshot 제작이 필요하다.
- Small promotional image는 아직 없다. 실제 제출 전 440x280 PNG/JPEG 제작이 필요하다.
- Store Dashboard 입력, upload, review submit, category/Homepage/Support URL/privacy policy URL 확정은 여전히 별도 승인 대상이다.
- 사용자 제공 아이콘의 최종 Store preview는 Chrome Web Store Dashboard에서 제출 전 확인해야 한다.

## 다음 단계 영향

- manifest icon과 Store icon blocker는 사용자 제공 아이콘 기준으로 해소 상태를 유지한다.
- 최종 보고서에는 Stage 5.1 아이콘 교체와 남은 screenshot/small promo image blocker를 반영해야 한다.

## 승인 요청

- Stage 5.1 산출물과 검증 결과를 승인하면 `task-final-report` 절차로 최종 보고서 작성과 PR 준비를 진행한다.
