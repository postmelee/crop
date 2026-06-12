# Task #65 Stage 3 완료 보고서 - 버그 제보 템플릿 검증

GitHub Issue: [#65](https://github.com/postmelee/crop/issues/65)
구현계획서: [`task_m030_65_impl.md`](../plans/task_m030_65_impl.md)
Stage: 3

## 단계 목적

#65 수용 기준과 제외 범위를 최종 대조하고, 사용자 버그 제보용 Issue Form이 재현 정보와 환경 정보를 충분히 받는지 통합 검증한다.

이번 Stage는 구현계획서의 Stage 3에 해당하며, `bug_report.yml`의 YAML 구조, 필수 입력 항목, placeholder, 기존 `bug` label 사용, 내부 task 템플릿과의 역할 분리를 최종 확인하고 최종 보고서를 작성했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `.github/ISSUE_TEMPLATE/bug_report.yml` | Stage 3에서 본문 변경 없음. 사용자 버그 제보용 Issue Form 최종 검증 대상 |
| `mydocs/working/task_m030_65_stage3.md` | Stage 3 통합 검증 결과 기록 |
| `mydocs/report/task_m030_65_report.md` | #65 최종 결과 보고서 작성 |
| `mydocs/orders/20260612.md` | 완료 상태와 완료 시각 기록 |

## 본문 변경 정도 / 본문 무손실 여부

Stage 3에서는 Issue Form 본문을 변경하지 않았다. Stage 1에서 추가된 `bug_report.yml`을 기준으로 최종 검증과 보고서만 작성했다.

기존 `.github/ISSUE_TEMPLATE/task.yml`, `.github/ISSUE_TEMPLATE/config.yml`은 수정하지 않았고, 내부 Hyper-Waterfall task 템플릿과 사용자 버그 제보 템플릿은 별도 파일로 유지된다.

## 검증 결과

실행 명령:

```bash
ruby -e 'require "yaml"; %w[.github/ISSUE_TEMPLATE/task.yml .github/ISSUE_TEMPLATE/bug_report.yml .github/ISSUE_TEMPLATE/config.yml].each { |path| YAML.load_file(path) }'
rg -n "버그 내용|재현 절차|기대 결과|실제 결과|사용 환경|버전|스크린샷|macOS|Chrome|흰색 마진" .github/ISSUE_TEMPLATE/bug_report.yml mydocs/working/task_m030_65_stage3.md mydocs/report/task_m030_65_report.md
rg -n "흰색 마진 버그 수정|캡처 백엔드.*변경|오버레이.*변경|새 label|새 milestone|제외" mydocs/working/task_m030_65_stage3.md mydocs/report/task_m030_65_report.md
git diff --check
git status --short
```

결과:

- OK: Ruby YAML 파싱이 exit 0으로 완료되어 `task.yml`, `bug_report.yml`, `config.yml` 모두 YAML로 읽을 수 있음을 확인했다.
- NOTE: Ruby 실행 시 로컬 `ffi-1.13.1` gem 확장 빌드 경고가 1줄 출력됐지만 명령은 성공했다. 이번 YAML 파일 내용 오류는 아니다.
- OK: `버그 내용`, `재현 절차`, `기대 결과`, `실제 결과`, `사용 환경`, `버전`, `스크린샷`, `macOS`, `Chrome`, `흰색 마진` 문구를 최종 산출물에서 확인했다.
- OK: `흰색 마진 버그 수정`, `캡처 백엔드 변경`, `오버레이 UI 변경`, `새 label`, `새 milestone`이 이번 task 제외 범위로 보고서에 기록됐음을 확인했다.
- OK: `git diff --check`가 경고 없이 통과했다.
- OK: 커밋 전 `git status --short`는 Stage 3 산출물인 `mydocs/orders/20260612.md`, `mydocs/working/task_m030_65_stage3.md`, `mydocs/report/task_m030_65_report.md`만 표시했다.

## 잔여 위험

- GitHub 웹 UI에서 실제 Issue Form 렌더링은 로컬 검증만으로 직접 확인할 수 없었다. YAML 파싱과 구조 검토로 형식 오류 위험을 낮췄다.
- 실제 사용자 제보의 흰색 마진 버그 수정은 이번 task 제외 범위다.

## 다음 단계 영향

- 최종 보고서 승인 후 PR 게시 절차로 진행한다.
- PR 게시 전 최종 커밋 이후 `git status --short`가 빈 출력인지 다시 확인한다.
- 실제 흰색 마진 버그 수정이 필요하면 별도 이슈로 등록한다.

## 승인 요청

- Stage 3 산출물과 최종 보고서를 승인하면 PR 게시 절차로 진행한다.
