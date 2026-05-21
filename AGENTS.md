# AGENTS.md

이 저장소에서는 멀티 에이전트 오케스트레이션 대시보드 작업을 할 때 아래 에이전트 파일을 기준으로 역할을 나눈다.

## 에이전트 정의

- `.opencode/agents/orchestrator.md`
  - 전체 작업 분해, 라우팅, 상태 집계 담당
- `.opencode/agents/pm.md`
  - 요구사항, 일정, 마일스톤, 티켓 관리 담당
- `.opencode/agents/ui-ux-designer.md`
  - 화면 구조, 와이어프레임, 시각 규칙 담당
- `.opencode/agents/frontend-dev.md`
  - 대시보드 UI 구현 담당
- `.opencode/agents/backend-dev.md`
  - API, 데이터, 서버 로직 담당
- `.opencode/agents/tdd.md`
  - 기능 검증용 테스트 초안 담당
- `.opencode/agents/code-reviewer.md`
  - 코드 품질, 리스크, 일관성 리뷰 담당
- `.opencode/agents/qa.md`
  - 실제 동작 검증, 재현, 결함 보고 담당
- `.opencode/agents/ops.md`
  - 배포, 실행 환경, 운영 안정성 담당

## 사용 지침

0. OpenCode 작업에서는 먼저 `.opencode/agents/*.md`와 `.opencode/oh-my-openagent.jsonc`의 역할 정의를 확인한다.
1. 작업을 시작할 때는 먼저 `orchestrator`로 분해한다.
2. 범위와 우선순위는 `pm`이 정리한다.
3. 화면 설계는 `ui-ux-designer`, 구현은 `frontend-dev`가 맡는다.
4. API와 데이터는 `backend-dev`가 맡는다.
5. 기능 검증은 `tdd`, 결과 검토는 `code-reviewer`, 실제 실행 검증은 `qa`가 맡는다.
6. 배포와 실행 안정성은 `ops`가 담당한다.
7. 한 에이전트가 여러 책임을 동시에 대신하지 않도록 한다.

## 운영 원칙

- 구현과 검토를 분리한다.
- UI/UX, 코드, 테스트, 운영 판단을 섞지 않는다.
- 승인 지점은 반드시 남긴다.
- 역할이 애매하면 `orchestrator`와 `pm`으로 먼저 정리한다.
