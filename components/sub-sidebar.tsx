import { Card } from '@material-tailwind/react';

export default function SubSidebar({ isSubSidebarOpen, setIsSubSidebarOpen }) {
  return (
    <Card
      className={`h-[90vh] w-[100vw] max-w-[24rem] p-2 transition-transform duration-500 ease-in-out transform static left-0 ${
        isSubSidebarOpen ? 'translate-x-[2rem]' : 'translate-x-0 opacity-0'
      } z-1`}
    >
      {isSubSidebarOpen && (
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">상세 정보</h2>
          <button
            onClick={() => setIsSubSidebarOpen(false)}
            className="bg-main text-white px-2"
          >
            X
          </button>
        </div>
      )}
    </Card>
  );
}
