# Task #65 구현계획서 - 사용자 버그 제보용 Issue Form 추가

수행계획서: [`task_m030_65.md`](task_m030_65.md)
GitHub Issue: [#65](https://github.com/postmelee/crop/issues/65)
마일스톤: M030

## 단계 개요

| Stage | 제목 | 주요 산출 | 검증 |
|---|---|---|---|
| 1 | 사용자 버그 제보 Issue Form 추가 | `.github/ISSUE_TEMPLATE/bug_report.yml`, `mydocs/working/task_m030_65_stage1.md` | YAML 파싱, 필수 입력/placeholder grep, `git diff --check` |
| 2 | 템플릿 역할 분리와 config 확인 | `.github/ISSUE_TEMPLATE/bug_report.yml`, 필요 시 `.github/ISSUE_TEMPLATE/config.yml`, `mydocs/working/task_m030_65_stage2.md` | 기존 `task.yml`과 역할 중복 여부, 사용자-facing 문구 검토 |
| 3 | 통합 검증과 최종 보고 | `mydocs/working/task_m030_65_stage3.md`, `mydocs/report/task_m030_65_report.md`, `mydocs/orders/20260612.md` | 최종 YAML 파싱, 수용 기준 grep, `git status --short`, `git diff --check` |

## 문서 위치 확인

수행계획서의 "문서 위치 판단"과 실제 Stage 산출물 경로를 다음과 같이 일치시킨다. 이번 task는 GitHub 플랫폼 템플릿을 추가하며, 제품 공식 문서 루트는 새로 만들지 않는다.

| 파일 | 수행계획서상 선택 위치 | Stage 산출물 경로 | 일치 여부 | 비고 |
|---|---|---|---|---|
| `.github/ISSUE_TEMPLATE/bug_report.yml` | `.github/ISSUE_TEMPLATE/bug_report.yml` | `.github/ISSUE_TEMPLATE/bug_report.yml` | OK | 사용자 버그 제보용 GitHub Issue Form |
| `.github/ISSUE_TEMPLATE/config.yml` | 필요 시 검토 | `.github/ISSUE_TEMPLATE/config.yml` | OK | 변경 필요성이 확인될 때만 수정 |
| `mydocs/plans/task_m030_65_impl.md` | `mydocs/plans/` | `mydocs/plans/task_m030_65_impl.md` | OK | 구현계획서 |
| `mydocs/working/task_m030_65_stage{N}.md` | `mydocs/working/` | `mydocs/working/task_m030_65_stage{N}.md` | OK | 단계별 완료 보고서 |
| `mydocs/report/task_m030_65_report.md` | `mydocs/report/` | `mydocs/report/task_m030_65_report.md` | OK | 최종 보고서 |

## 수용 기준 고정

- GitHub Issue 생성 화면에서 사용자 버그 제보 템플릿을 선택할 수 있다.
- 템플릿은 사용자에게 버그 제보 목적이 드러나는 `name`, `description`, `title`을 가진다.
- 입력 항목에는 버그 내용, 재현 절차, 기대 결과, 실제 결과, 사용 환경 및 버전, 스크린샷/녹화 자료가 포함된다.
- 사용 환경에는 OS, 브라우저, crop 버전, 설치 경로 또는 빌드 출처를 남길 수 있다.
- placeholder에는 macOS, Chrome, 복사/다운로드 이미지 오른쪽 흰색 마진 사례가 예시로 포함된다.
- 내부 Hyper-Waterfall 작업용 `task.yml`과 사용자 버그 제보용 `bug_report.yml`의 역할이 혼동되지 않는다.
- 실제 흰색 마진 버그 수정, 캡처 백엔드 변경, 오버레이 UI 변경, 새 label/milestone 생성은 수행하지 않는다.

## Stage 1 — 사용자 버그 제보 Issue Form 추가

### 산출물

신규:

- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `mydocs/working/task_m030_65_stage1.md`

수정:

- 필요 시 `mydocs/orders/20260612.md`

### 변경 내용

- GitHub Issue Form YAML 형식으로 사용자 버그 제보 템플릿을 추가한다.
- 템플릿 metadata는 다음 의도를 따른다.
  - `name`: 사용자가 버그 제보용임을 즉시 알 수 있는 이름
  - `description`: 오작동, 재현 정보, 환경 정보를 받는 템플릿임을 설명
  - `title`: 사용자 버그 제보 이슈임을 구분하는 prefix
  - `labels`: 기존 label인 `bug` 사용
- 입력 항목은 다음 구조로 둔다.
  - 버그 내용: 필수 textarea
  - 재현 절차: 필수 textarea
  - 기대 결과: 필수 textarea
  - 실제 결과: 필수 textarea
  - 사용 환경 및 버전: 필수 textarea 또는 input 묶음
  - 스크린샷/녹화 자료: 선택 textarea
  - 추가 정보: 선택 textarea
  - 확인 체크박스: 최신 버전/중복 확인/민감정보 제외 확인
- placeholder에는 #65의 실제 제보 맥락인 macOS, Chrome, 복사/다운로드 이미지 오른쪽 흰색 마진 사례를 예시로 넣는다.

### 검증

```bash
ruby -e 'require "yaml"; YAML.load_file(".github/ISSUE_TEMPLATE/bug_report.yml")'
rg -n "Bug Report|버그|재현|기대 결과|실제 결과|macOS|Chrome|흰색 마진|스크린샷|crop 버전" .github/ISSUE_TEMPLATE/bug_report.yml
git diff --check
```

### 커밋

```text
Task #65 Stage 1: 사용자 버그 제보 Issue Form 추가
```

## Stage 2 — 템플릿 역할 분리와 config 확인

### 산출물

신규:

- `mydocs/working/task_m030_65_stage2.md`

수정:

- `.github/ISSUE_TEMPLATE/bug_report.yml`
- 필요 시 `.github/ISSUE_TEMPLATE/config.yml`
- 필요 시 `mydocs/orders/20260612.md`

### 변경 내용

- 기존 `.github/ISSUE_TEMPLATE/task.yml`이 내부 하이퍼-워터폴 작업 이슈용이고, 신규 `bug_report.yml`이 사용자 버그 제보용임을 비교 검토한다.
- `config.yml`의 `blank_issues_enabled`와 `contact_links`가 사용자 버그 제보 흐름을 방해하지 않는지 확인한다.
- `bug_report.yml`에 불필요하게 내부 작업 절차, 수행계획서, 마일스톤 후보 같은 내부 항목이 섞여 있으면 제거한다.
- `labels`는 기존 `bug` label만 사용하고 새 label은 만들지 않는다.

### 검증

```bash
ruby -e 'require "yaml"; %w[.github/ISSUE_TEMPLATE/task.yml .github/ISSUE_TEMPLATE/bug_report.yml .github/ISSUE_TEMPLATE/config.yml].each { |path| YAML.load_file(path) }'
rg -n "Hyper-Waterfall|수행계획서|마일스톤 후보|label 후보|작업지시자" .github/ISSUE_TEMPLATE/bug_report.yml
rg -n "bug|Bug Report|사용 환경|스크린샷|재현" .github/ISSUE_TEMPLATE/bug_report.yml .github/ISSUE_TEMPLATE/config.yml
git diff --check
```

첫 번째 `rg`는 출력이 없어야 한다. 내부 task 절차 문구가 사용자 버그 제보 템플릿에 남아 있으면 실패로 본다.

### 커밋

```text
Task #65 Stage 2: Issue Form 역할 분리 검증
```

## Stage 3 — 통합 검증과 최종 보고

### 산출물

신규:

- `mydocs/working/task_m030_65_stage3.md`
- `mydocs/report/task_m030_65_report.md`

수정:

- `mydocs/orders/20260612.md`
- 필요 시 `.github/ISSUE_TEMPLATE/bug_report.yml`

### 변경 내용

- #65 수용 기준과 제외 범위를 최종 대조한다.
- GitHub Issue Form YAML 파싱, 필수 항목, placeholder, label 사용을 최종 검증한다.
- 오늘할일 상태를 완료 후보로 갱신한다.
- 최종 보고서에 변경 파일, 검증 결과, 남은 리스크, 후속 작업 후보를 정리한다.

### 검증

```bash
ruby -e 'require "yaml"; %w[.github/ISSUE_TEMPLATE/task.yml .github/ISSUE_TEMPLATE/bug_report.yml .github/ISSUE_TEMPLATE/config.yml].each { |path| YAML.load_file(path) }'
rg -n "버그 내용|재현 절차|기대 결과|실제 결과|사용 환경|버전|스크린샷|macOS|Chrome|흰색 마진" .github/ISSUE_TEMPLATE/bug_report.yml mydocs/working/task_m030_65_stage3.md mydocs/report/task_m030_65_report.md
rg -n "흰색 마진 버그 수정|캡처 백엔드.*변경|오버레이.*변경|새 label|새 milestone|제외" mydocs/working/task_m030_65_stage3.md mydocs/report/task_m030_65_report.md
git diff --check
git status --short
```

### 커밋

```text
Task #65 Stage 3: 버그 제보 템플릿 검증
```

## 검증

- 각 Stage 검증 명령은 단계 보고서 작성 전에 실행한다.
- 실패한 검증은 단계 완료로 처리하지 않는다.
- 계획 변경이 필요하면 구현계획서를 먼저 갱신하고 작업지시자 승인을 받는다.
- 문서 위치가 수행계획서 판단과 달라지면 구현 전에 수행계획서 또는 구현계획서를 갱신하고 작업지시자 승인을 받는다.

## 커밋

- 단계 커밋은 단계 산출물과 `mydocs/working/task_m030_65_stage{N}.md`를 함께 묶는다.
- 커밋 메시지는 `Task #65 Stage {N}: {핵심 내용 요약}` 형식을 따른다.
- 구현계획서 작성 커밋은 `Task #65: 구현계획서 작성과 오늘할일 갱신`을 사용한다.

## 단계 의존성

- Stage 2는 Stage 1의 `bug_report.yml` 초안과 Stage 1 보고서 승인 후 진행한다.
- Stage 3은 Stage 2의 역할 분리 검증과 보고서 승인 후 진행한다.
- PR 게시와 이슈 close는 최종 보고서 승인 및 별도 PR 절차 이후에만 수행한다.

## 위험과 대응

- **Issue Form 문법 오류**: Ruby YAML 파싱으로 구조 오류를 먼저 잡는다.
- **사용자 입력 과다**: 필수 항목은 재현과 triage에 필요한 최소 항목으로 제한하고, 스크린샷/추가 정보는 선택 항목으로 둔다.
- **내부 절차 노출**: Stage 2에서 `task.yml`과 대조하고 내부 하이퍼-워터폴 문구가 섞이지 않았는지 grep으로 확인한다.
- **라벨 자동 부여 실패**: 신규 label을 만들지 않고 기존 `bug` label만 사용한다.

## 승인 요청 사항

- 위 3단계 Stage 분할 승인
- `.github/ISSUE_TEMPLATE/bug_report.yml`에 기존 `bug` label을 지정하는 방향 승인
- Stage 1의 입력 항목 구성과 placeholder 예시 사용 승인
- Stage별 검증 명령과 커밋 메시지 승인
