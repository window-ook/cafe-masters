/** E2E 테스트가 브라우저에 심는 전역 값. 앱 코드는 테스트 모드를 판별할 때만 읽습니다 */
interface Window {
  __PLAYWRIGHT_TEST__?: boolean;
  __MOCK_SESSION__?: { user: { id: string; email: string } };
}
