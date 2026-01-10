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
          navigate("/");
        }}
      />
    </div>
  );
}
