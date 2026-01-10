import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";

export default function HeaderTestPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col bg-gray-900">
      <Header
        title="Header Test Page"
        onLeftClick={() => {
          console.log("back clicked");
          navigate(-1);
        }}
      />

      <main className="flex flex-1 flex-col gap-4 p-4 text-white">
        <section className="rounded bg-gray-800 p-4">
          <h2 className="mb-2 text-lg font-semibold">테스트 항목</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>좌측 SVG 아이콘 렌더링</li>
            <li>title 중앙 정렬</li>
            <li>onLeftClick 이벤트</li>
            <li>레이아웃/height 깨짐 여부</li>
          </ul>
        </section>

        <section className="rounded bg-gray-800 p-4">
          <p className="text-sm text-gray-300">
            콘솔에 <code>back clicked</code>가 찍히면 클릭 이벤트 정상입니다.
          </p>
        </section>
      </main>
    </div>
  );
}
