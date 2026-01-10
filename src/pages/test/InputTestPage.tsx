import { useState } from "react";
import { Input } from "@/components/common/Input";

export default function InputTestPage() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-full w-full flex-col gap-6 bg-[#1f1f1f] p-6 text-white">
      <h1 className="text-xl font-bold">Input Component Test</h1>

      {/* TEXT INPUT */}
      <section className="flex flex-col gap-3">
        <h2 className="text-main-variant text-sm font-semibold">Text Input</h2>

        <Input
          placeholder="기본 텍스트 입력"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <Input
          width="sm"
          placeholder="width=sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </section>

      {/* PASSWORD INPUT */}
      <section className="flex flex-col gap-3">
        <h2 className="text-main-variant text-sm font-semibold">
          Password Input
        </h2>

        <Input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </section>
      <section>
        <h2 className="text-main-variant text-sm font-semibold">Date Input</h2>
        <Input type="date" required />
      </section>
    </div>
  );
}
