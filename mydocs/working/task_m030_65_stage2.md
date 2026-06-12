# Task #65 Stage 2 완료 보고서 - Issue Form 역할 분리 검증

GitHub Issue: [#65](https://github.com/postmelee/crop/issues/65)
구현계획서: [`task_m030_65_impl.md`](../plans/task_m030_65_impl.md)
Stage: 2

## 단계 목적

Stage 1에서 추가한 `.github/ISSUE_TEMPLATE/bug_report.yml`이 내부 하이퍼-워터폴 작업용 `.github/ISSUE_TEMPLATE/task.yml`과 역할이 섞이지 않는지 확인한다.

이번 Stage는 구현계획서의 Stage 2에 해당하며, `bug_report.yml`에 내부 작업 절차 문구가 포함되지 않았는지, `.github/ISSUE_TEMPLATE/config.yml`이 사용자 버그 제보 흐름을 방해하지 않는지, 기존 `bug` label만 사용하는지 검증했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `.github/ISSUE_TEMPLATE/bug_report.yml` | Stage 2 검증 결과 추가 보정 없음. 사용자 버그 제보 항목과 기존 `bug` label 유지 |
| `.github/ISSUE_TEMPLATE/config.yml` | 검토 결과 변경 없음. blank issue와 Discussions contact link가 버그 제보 템플릿 선택을 방해하지 않음 |
| `mydocs/orders/20260612.md` | Stage 2 완료 후 승인 대기 상태로 비고 갱신 |
| `mydocs/working/task_m030_65_stage2.md` | Stage 2 완료 보고서 신규 작성 |

## 본문 변경 정도 / 본문 무손실 여부

검증 중심 단계다. `.github/ISSUE_TEMPLATE/bug_report.yml`과 `.github/ISSUE_TEMPLATE/config.yml` 본문은 Stage 2에서 변경하지 않았다.

기존 내부 작업용 `.github/ISSUE_TEMPLATE/task.yml`도 수정하지 않았다. 사용자 버그 제보 템플릿은 내부 작업 추적용 템플릿과 별도 파일로 유지된다.

## 검증 결과

실행 명령:

```bash
ruby -e 'require "yaml"; %w[.github/ISSUE_TEMPLATE/task.yml .github/ISSUE_TEMPLATE/bug_report.yml .github/ISSUE_TEMPLATE/config.yml].each { |path| YAML.load_file(path) }'
rg -n "Hyper-Waterfall|수행계획서|마일스톤 후보|label 후보|작업지시자" .github/ISSUE_TEMPLATE/bug_report.yml
rg -n "bug|Bug Report|사용 환경|스크린샷|재현" .github/ISSUE_TEMPLATE/bug_report.yml .github/ISSUE_TEMPLATE/config.yml
git diff --check
```

결과:

- OK: Ruby YAML 파싱이 exit 0으로 완료되어 `task.yml`, `bug_report.yml`, `config.yml` 모두 YAML로 읽을 수 있음을 확인했다.
- NOTE: Ruby 실행 시 로컬 `ffi-1.13.1` gem 확장 빌드 경고가 1줄 출력됐지만 명령은 성공했다. 이번 YAML 파일 내용 오류는 아니다.
- OK: 내부 작업 절차 문구 검색 명령은 출력 없이 exit 1로 종료했다. 이는 `bug_report.yml`에 `Hyper-Waterfall`, `수행계획서`, `마일스톤 후보`, `label 후보`, `작업지시자` 문구가 없다는 기대 결과와 일치한다.
- OK: 사용자-facing 핵심 문구 검색에서 `bug`, `Bug Report`, `사용 환경`, `스크린샷`, `재현`을 확인했다.
- OK: `git diff --check`가 경고 없이 통과했다.

## 잔여 위험

- GitHub 웹 UI에서 실제 Issue Form 렌더링은 아직 확인하지 않았다. Stage 3 통합 검증에서 최종 YAML 구조와 수용 기준을 한 번 더 대조한다.

## 다음 단계 영향

- Stage 3에서는 최종 보고서와 함께 #65 수용 기준과 제외 범위를 통합 검증한다.
- Stage 3에서는 `bug_report.yml`의 필수 항목, placeholder, 기존 `bug` label 사용을 최종 확인한다.

## 승인 요청

- Stage 2 산출물과 검증 결과를 승인하면 Stage 3으로 진행한다.
