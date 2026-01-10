import { useState } from "react";
import Input from "@/components/common/Input/Input";
import InputLabel from "@/components/common/Input/InputLabel";

export default function InputTestPage() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-full w-full flex-col items-center gap-6 bg-[#1f1f1f] p-6 text-white">
      <h1 className="font-bol mb-4 text-xl">Input Component Test</h1>

      {/* TEXT INPUT */}
      <section className="flex flex-col">
        <InputLabel label="팟 제목" isRequired={true} className="mb-3.5" />
        <Input
          placeholder="기본 텍스트 입력"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </section>

      {/* 모임시간 INPUT */}
      <section className="flex flex-col">
        <InputLabel label="모임 시간" isRequired={true} className="mb-3.5" />
        <Input type="datetime-local" required />
      </section>

      <section className="flex flex-col">
        <InputLabel label="모집 인원" className="mb-2" />
        <div className="flex h-fit justify-center gap-3">
          <div className="flex flex-col">
            <InputLabel label="경찰" className="mb-1" />
            <Input width="sm" />
          </div>
          <div className="flex flex-col">
            <InputLabel label="도둑" className="mb-1" />
            <Input width="sm" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <Input
          width="md"
          type="text"
          placeholder="아이디 입력"
          className="placeholder:text-main-variant"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          width="md"
          placeholder="비밀번호 입력"
          className="placeholder:text-main-variant"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </section>
    </div>
  );
}
