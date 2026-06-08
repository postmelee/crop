# crop 기여 안내

`crop`에 관심을 가져 주셔서 감사합니다. 이 문서는 공개 저장소에서 이슈와 풀 리퀘스트를 열 때의 기본 기대사항을 정리합니다.

이 저장소의 내부 작업은 Hyper-Waterfall 절차로 관리됩니다. 외부 기여자가 내부 작업 문서나 단계 보고서를 직접 작성할 필요는 없습니다. 다만 maintainer는 제안이나 PR을 검토한 뒤 필요한 경우 별도 GitHub Issue, 작업 브랜치, 계획 문서로 전환할 수 있습니다.

## 기여 전에 확인할 것

- 이미 열린 GitHub Issues와 Pull Requests를 먼저 검색합니다.
- 새 기능, 버그 수정, 문서 변경은 가능한 한 작은 범위로 나눕니다.
- 사용자에게 보이는 제품명과 브랜딩은 `crop`만 사용합니다.
- Mozilla, Firefox, Screenshots 명칭은 출처, 라이선스, 기술 참고 맥락에서만 사용하고 제휴, 보증, 공식 제품처럼 보이게 쓰지 않습니다.
- Chrome MV3 권한은 좁게 유지합니다. `debugger`, `<all_urls>`, broad host permission, `tabs` 권한은 maintainer와 사전 논의 없이 추가하지 않습니다.
- Firefox 유래 코드나 MPL 2.0 적용 파일을 다룰 때는 `src/firefox-derived/`, `NOTICE`, `THIRD_PARTY.md`, `LICENSE-MPL-2.0`의 출처와 라이선스 경계를 유지합니다.

## 이슈 열기

새 작업은 가능하면 먼저 Issue로 논의합니다.

좋은 Issue에는 다음 내용이 들어갑니다.

- 문제나 제안의 배경
- 기대하는 결과
- 포함 범위와 제외 범위
- 재현 절차 또는 확인 방법
- 관련 페이지, 브라우저 버전, 운영체제, 스크린샷 등 필요한 맥락

보안 취약점이나 개인 정보가 포함된 내용은 공개 Issue에 자세히 적지 마세요. 공개 범위로 다룰 수 있는 최소 설명만 남기고, maintainer가 비공개로 이어갈 수 있는 연락 방법을 조율합니다.

## 풀 리퀘스트 열기

Pull Request는 작고 검토 가능한 단위로 유지합니다.

기본 기대사항:

- PR template을 채웁니다.
- 변경 이유와 변경 범위를 명확히 적습니다.
- 사용자에게 보이는 동작, 권한, privacy, 브랜딩, 라이선스에 영향을 주는 변경은 별도로 표시합니다.
- 관련 Issue가 있으면 연결합니다.
- 실행한 검증 명령과 결과를 적습니다.
- unrelated formatting, 대규모 리팩터링, 기능 변경을 한 PR에 섞지 않습니다.

권장 검증:

```bash
npm run build
npm run typecheck
npm test
git diff --check
```

문서만 바꾼 PR은 소스 build/test가 필요하지 않을 수 있습니다. 이 경우 실행하지 않은 이유를 PR에 적어 주세요.

## 코드와 문서 기준

- 현재 구현과 다른 기능을 문서에서 약속하지 않습니다.
- 스크린샷 처리는 기본적으로 브라우저 안에서 로컬로 수행된다는 privacy stance를 유지합니다.
- 서버 업로드, telemetry, 계정 동기화처럼 구현되지 않은 기능을 암시하지 않습니다.
- overlay, highlight, button이 최종 PNG에 포함되지 않는 동작은 중요한 사용자 경험 기준입니다.
- Chrome 제한 페이지, cross-origin iframe, closed shadow DOM, canvas 크기 제한 같은 제약은 숨기지 않습니다.

## Maintainer workflow와 외부 기여

Maintainer 작업은 GitHub Issue 기준으로 추적되고, 필요 시 다음 흐름을 따릅니다.

```text
Issue -> branch -> daily order -> plan -> implementation plan -> stage report -> final report -> pull request
```

이 흐름은 maintainer와 작업 에이전트가 변경을 추적하기 위한 내부 운영 절차입니다. 외부 기여자는 일반적인 Issue와 Pull Request로 제안해도 됩니다. maintainer가 필요하다고 판단하면 해당 제안은 별도 task로 등록되어 위 절차에 맞게 진행됩니다.

## 리뷰와 merge

- 모든 PR은 maintainer review를 거칩니다.
- CI와 필요한 수동 검증이 통과해야 merge할 수 있습니다.
- 범위가 커지거나 정책 판단이 필요한 경우 maintainer가 PR을 닫지 않고 Issue로 되돌려 계획부터 다시 잡을 수 있습니다.
- Issue close는 maintainer가 승인하거나 PR merge 후 처리합니다.

## 질문과 논의

질문, 사용 후기, 기능 아이디어는 GitHub Issues 또는 Discussions를 사용합니다. 버그와 구체적인 작업 요청은 Issues가 더 적합하고, 사용 경험 공유나 넓은 제안은 Discussions가 더 적합합니다.
