export default function NotFound() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">잘못된 경로</h1>
        <p className="text-xl text-gray-600 mb-6">
          <span>요청하신 페이지를 찾을 수 없습니다.</span>
          <br />
          <span>메뉴 페이지로 이동합니다.</span>
        </p>
      </div>
    </div>
  );
}