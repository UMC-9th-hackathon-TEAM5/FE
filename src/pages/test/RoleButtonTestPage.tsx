import { RoleButton } from "@/components/common/RoleButton";
import { useState } from "react";
// 실제 RoleButton 컴포넌트 경로로 수정해주세요

export default function RoleButtonTestPage() {
  // 1. 라디오 버튼용 상태 (하나만 선택 가능)
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // 2. 토글 버튼용 상태 (여러 개 선택 가능)
  const [activeStates, setActiveStates] = useState({
    police: false,
    thief: false,
    random: false,
  });

  const toggleMulti = (role: "police" | "thief" | "random") => {
    setActiveStates((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  return (
    <div className="flex min-h-screen flex-col gap-12 bg-[#111] p-10 text-white">
      {/* --- 섹션 1: 단순 비주얼 테스트 (Static) --- */}
      <section>
        <h2 className="mb-4 border-b border-gray-700 pb-2 text-xl font-bold">
          1. 스타일 갤러리 (Static Check)
        </h2>
        <div className="flex flex-col items-start gap-8">
          {/* Default 상태 모음 */}
          <div className="flex flex-col items-center gap-2">
            <h3 className="mb-2 text-sm text-gray-400">Default State</h3>
            <div className="flex gap-2">
              <RoleButton roleType="police" state="default" />
              <RoleButton roleType="thief" state="default" />
              <RoleButton roleType="random" state="default" />
            </div>
          </div>

          {/* Active 상태 모음 */}
          <div className="flex flex-col items-center gap-2">
            <h3 className="mb-2 text-sm text-gray-400">Active State</h3>
            <div className="flex gap-2">
              <RoleButton roleType="police" state="active" />
              <RoleButton roleType="thief" state="active" />
              <RoleButton roleType="random" state="active" />
            </div>
          </div>
        </div>
      </section>

      {/* --- 섹션 2: 하나만 선택하기 (Radio Logic) --- */}
      <section>
        <h2 className="mb-4 border-b border-gray-700 pb-2 text-xl font-bold">
          2. 하나만 선택 (Radio Logic)
        </h2>
        <p className="mb-4 text-sm text-gray-400">
          현재 선택된 역할:{" "}
          <span className="font-bold text-green-400">
            {selectedRole || "없음"}
          </span>
        </p>

        <div className="flex gap-3">
          <RoleButton
            roleType="police"
            state={selectedRole === "police" ? "active" : "default"}
            onClick={() => setSelectedRole("police")}
          />
          <RoleButton
            roleType="thief"
            state={selectedRole === "thief" ? "active" : "default"}
            onClick={() => setSelectedRole("thief")}
          />
          <RoleButton
            roleType="random"
            state={selectedRole === "random" ? "active" : "default"}
            onClick={() => setSelectedRole("random")}
          />
        </div>
      </section>

      {/* --- 섹션 3: 다중 선택 (Checkbox Logic) --- */}
      <section>
        <h2 className="mb-4 border-b border-gray-700 pb-2 text-xl font-bold">
          3. 다중 선택 (Toggle Logic)
        </h2>
        <p className="mb-4 text-sm text-gray-400">
          각각의 버튼이 독립적으로 켜지고 꺼집니다.
        </p>

        <div className="flex gap-3">
          <RoleButton
            roleType="police"
            state={activeStates.police ? "active" : "default"}
            onClick={() => toggleMulti("police")}
          />
          <RoleButton
            roleType="thief"
            state={activeStates.thief ? "active" : "default"}
            onClick={() => toggleMulti("thief")}
          />
          <RoleButton
            roleType="random"
            state={activeStates.random ? "active" : "default"}
            onClick={() => toggleMulti("random")}
          />
        </div>
      </section>
    </div>
  );
}
