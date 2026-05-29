# Task #8 Stage 1 완료 보고서

GitHub Issue: [#8](https://github.com/postmelee/crop/issues/8)  
구현계획서: [`task_m020_8_impl.md`](../plans/task_m020_8_impl.md)  
Stage: 1

## 단계 목적

Phase 6 품질 검증을 반복 가능한 기준으로 수행하기 위해 edge case fixture와 품질 매트릭스의 뼈대를 작성했다. 이번 Stage는 실제 Chrome smoke 실행 전, 검증 대상과 기대 동작, 상태/후속 분류 기준을 고정하는 단계다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `tests/fixtures/phase6_edge_cases.html` | 외부 네트워크 의존 없는 정적 HTML fixture 추가. 일반 문서, 카드, 버튼/아이콘, code block, 긴 table, sticky header, transform/scale, `srcdoc` iframe, open shadow DOM, viewport 밖 큰 요소와 안정적인 `data-crop-fixture` selector 포함. |
| `mydocs/tech/task_m020_8_quality_matrix.md` | Phase 6 대상별 품질 매트릭스 추가. 환경 기록, 상태 값, 후속 분류 기준, Copy/Save, zoom 80/100/125/150%, HiDPI/비HiDPI, iframe/shadow/viewport 밖 요소 항목 포함. |
| `mydocs/working/task_m020_8_stage1.md` | Stage 1 완료 보고서 추가. |

## 본문 변경 정도 / 본문 무손실 여부

기존 소스와 공식 사용자 문서는 수정하지 않았다. Stage 1은 신규 fixture와 신규 task-specific QA 문서만 추가했으므로 기존 본문 손실은 없다. README 변경은 구현계획서대로 Stage 5까지 보류했다.

## 검증 결과

실행 명령:

```bash
rg "sticky|transform|iframe|shadow|zoom|Copy|Save|data-crop-fixture" tests/fixtures mydocs/tech
git diff --check
```

결과:

- OK: `rg`에서 fixture와 quality matrix 양쪽 모두 Stage 1 필수 키워드가 확인됐다.
- OK: `git diff --check`가 출력 없이 종료되어 whitespace 오류가 없었다.
- 참고: 파일 라인 수는 `tests/fixtures/phase6_edge_cases.html` 456줄, `mydocs/tech/task_m020_8_quality_matrix.md` 93줄이다.

## 잔여 위험

- fixture는 정적 대표 구조이며, 실제 웹 사이트의 모든 DOM 구조를 대체하지 않는다.
- Chrome manual smoke, zoom별 Copy/Save, HiDPI/비HiDPI 확인은 Stage 3에서 수행한다.
- iframe 내부 깊은 선택, closed shadow DOM, viewport 밖 capture 범위는 Stage 3/4에서 MVP 제한 또는 후속 이슈로 분류해야 한다.

## 다음 단계 영향

- Stage 2에서는 이 fixture와 matrix 기준을 바탕으로 자동 회귀 테스트로 고정 가능한 항목을 추가한다.
- Stage 3에서는 `data-crop-fixture` selector를 기준으로 수동 smoke 결과를 matrix에 채운다.
- Stage 4에서는 `MISS`, `제한`, `후속` 항목을 README 문구 또는 후속 이슈로 분류한다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 Stage 2 자동 회귀 검증 확장으로 진행한다.
