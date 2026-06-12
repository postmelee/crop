# Task #65 Stage 1 완료 보고서 - 사용자 버그 제보 Issue Form 추가

GitHub Issue: [#65](https://github.com/postmelee/crop/issues/65)
구현계획서: [`task_m030_65_impl.md`](../plans/task_m030_65_impl.md)
Stage: 1

## 단계 목적

사용자가 crop 버그를 구조적으로 제보할 수 있도록 `.github/ISSUE_TEMPLATE/bug_report.yml`을 신규 추가한다.

이번 Stage는 구현계획서의 Stage 1에 해당하며, 버그 내용, 재현 절차, 기대 결과, 실제 결과, 사용 환경 및 버전, 스크린샷/녹화 자료 입력 항목과 #65 사용자 제보 맥락을 반영한 placeholder를 구성하는 것이 목적이다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `.github/ISSUE_TEMPLATE/bug_report.yml` | 사용자 버그 제보용 GitHub Issue Form 신규 추가. 기존 `bug` label, `[Bug]` title prefix, 필수 재현 정보, 환경/버전, 스크린샷 선택 항목 포함 |
| `mydocs/orders/20260612.md` | Stage 1 완료 후 승인 대기 상태로 비고 갱신 |
| `mydocs/working/task_m030_65_stage1.md` | Stage 1 완료 보고서 신규 작성 |

## 본문 변경 정도 / 본문 무손실 여부

신규 GitHub 플랫폼 템플릿 추가 작업이다. 기존 내부 작업용 `.github/ISSUE_TEMPLATE/task.yml`과 `.github/ISSUE_TEMPLATE/config.yml` 본문은 수정하지 않았다.

`bug_report.yml`은 사용자-facing 제보 양식으로 새로 작성했으며, #65에 기록된 macOS, Chrome, 복사/다운로드 이미지 오른쪽 흰색 마진 사례를 placeholder 예시로 반영했다.

## 검증 결과

실행 명령:

```bash
ruby -e 'require "yaml"; YAML.load_file(".github/ISSUE_TEMPLATE/bug_report.yml")'
rg -n "Bug Report|버그|재현|기대 결과|실제 결과|macOS|Chrome|흰색 마진|스크린샷|crop 버전" .github/ISSUE_TEMPLATE/bug_report.yml
git diff --check
```

결과:

- OK: `ruby -e 'require "yaml"; YAML.load_file(...)'`가 exit 0으로 완료되어 YAML 구조를 파싱할 수 있음을 확인했다.
- NOTE: Ruby 실행 시 로컬 `ffi-1.13.1` gem 확장 빌드 경고가 1줄 출력됐지만 명령은 성공했다. 이번 YAML 파일 내용 오류는 아니다.
- OK: `rg`가 `Bug Report`, `버그`, `재현`, `기대 결과`, `실제 결과`, `macOS`, `Chrome`, `흰색 마진`, `스크린샷`, `crop 버전`을 모두 확인했다.
- OK: `git diff --check`가 경고 없이 통과했다.

## 잔여 위험

- GitHub 웹 UI에서의 렌더링은 아직 직접 확인하지 않았다. Stage 2에서 기존 `task.yml`, `config.yml`과 함께 구조와 역할 분리를 추가 검토한다.
- `labels: bug` 자동 적용은 기존 repository label에 의존한다. 이 label은 task-register 단계에서 기존 label로 확인된 값이다.

## 다음 단계 영향

- Stage 2에서는 신규 `bug_report.yml`에 내부 하이퍼-워터폴 작업 문구가 섞이지 않았는지 확인한다.
- Stage 2에서는 `.github/ISSUE_TEMPLATE/config.yml`이 사용자 버그 제보 흐름을 방해하지 않는지 확인한다.
- Stage 2에서는 필요할 때만 `bug_report.yml` 또는 `config.yml`을 보정한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2로 진행한다.
