# Task #1 Stage 1 보고서

GitHub Issue: [#1](https://github.com/postmelee/crop/issues/1)
구현계획서: [`task_m010_1_impl.md`](../plans/task_m010_1_impl.md)
Stage: 1

## 단계 목적

Stage 1은 Phase 0 기반 세팅 중 라이선스와 출처 고지 파일을 추가하는 단계다. 프로젝트 주 라이선스 기본안, Mozilla Firefox Screenshots 유래 코드 고지 정책, 상표 비제휴 문구를 저장소 루트 문서로 고정했다.

## 산출물

| 파일 | 변경 요약 |
|---|---|
| `README.md` | 프로젝트 목적, MVP 포함/제외 범위, Hyper-Waterfall 운영 방식, Phase 0 상태, 브랜딩/라이선스 안내 추가 |
| `LICENSE` | 프로젝트 주 라이선스 기본안으로 MIT License 추가 |
| `LICENSE-MPL-2.0` | Mozilla Public License 2.0 원문 추가 |
| `NOTICE` | Mozilla/Firefox 비제휴 고지와 Firefox-derived 코드 고지 정책 추가 |
| `THIRD_PARTY.md` | 예정된 Mozilla Firefox Screenshots upstream 참조, MPL 2.0 적용 범위, 향후 기록 항목 추가 |

## 본문 변경 정도 / 본문 무손실 여부

신규 문서 작성 단계이므로 보존해야 할 기존 본문은 없었다. MPL 2.0과 MIT License는 공식 라이선스 텍스트를 기준으로 추가했고, `NOTICE`와 `THIRD_PARTY.md`는 현재 Phase 0 상태를 명시해 아직 Firefox 원본 파일을 복사하지 않았음을 분리했다.

## 검증 결과

실행 명령:

```bash
test -f README.md
test -f LICENSE
test -f LICENSE-MPL-2.0
test -f NOTICE
test -f THIRD_PARTY.md
rg "MPL|Mozilla|Firefox|crop" README.md NOTICE THIRD_PARTY.md
rg "MIT License|Mozilla Public License" LICENSE LICENSE-MPL-2.0
git diff --check
```

결과:

- OK: Stage 1 필수 파일 5개가 모두 존재한다.
- OK: `README.md`, `NOTICE`, `THIRD_PARTY.md`에서 `crop`, Mozilla/Firefox 출처, MPL 문구가 확인됐다.
- OK: `LICENSE`에서 `MIT License`, `LICENSE-MPL-2.0`에서 `Mozilla Public License`가 확인됐다.
- OK: `git diff --check`가 경고 없이 통과했다.

## 잔여 위험

- `LICENSE`는 MIT 기본안을 사용했다. 프로젝트 주 라이선스를 바꾸려면 후속 피드백 또는 별도 변경으로 조정해야 한다.
- 실제 Firefox 유래 코드가 아직 들어오지 않았으므로, import 시점에 `THIRD_PARTY.md`에 정확한 upstream commit과 local path를 추가해야 한다.

## 다음 단계 영향

- Stage 2는 npm + TypeScript + Vite 기반을 추가한다.
- Stage 2에서 `README.md`에 실제 설치/빌드 명령을 보강할 수 있다.

## 승인 요청

- Stage 1 산출물과 검증 결과를 승인하면 다음 단계로 진행한다.
