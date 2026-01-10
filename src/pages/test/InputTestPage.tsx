import { useState } from "react";
import { Input } from "@/components/common/Input";
import InputLabel from "@/components/common/InputLabel";

export default function InputTestPage() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-full w-full flex-col bg-[#1f1f1f] p-6 text-white">
      <h1 className="font-bol mb-4 text-xl">Input Component Test</h1>

      {/* TEXT INPUT */}
      <section className="flex flex-col">
        <InputLabel label="팟 제목" isRequired={true} />

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
