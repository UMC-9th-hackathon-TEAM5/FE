<<<<<<< HEAD
import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input/Input";
=======
import { Button } from "@/components/common/Button"
import Input from "@/components/common/Input/Input"
>>>>>>> 583fb23 (feat : 로그인 페이지 구현)
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // 닉네임 유효성 검사
  const nicknameError = useMemo(() => {
    if (nickname.length === 0) return null;
<<<<<<< HEAD

    // 한글, 영문, 공백만 허용
    const regex = /^[가-힣a-zA-Z\s]+$/;

    if (!regex.test(nickname)) {
      return "한글, 영문, 공백만 입력 가능합니다.";
    }

    return null;
  }, [nickname]);

  const isFormValid = useMemo(() => {
    return (
      nickname.length > 0 &&
      nicknameError === null &&
=======
    
    // 한글, 영문, 공백만 허용
    const regex = /^[가-힣a-zA-Z\s]+$/;
    
    if (!regex.test(nickname)) {
      return "한글, 영문, 공백만 입력 가능합니다.";
    }
    
    return null; 
  }, [nickname]);


  const isFormValid = useMemo(() => {
    return (
      nickname.length > 0 && 
      nicknameError === null && 
>>>>>>> 583fb23 (feat : 로그인 페이지 구현)
      password.trim().length === 4
    );
  }, [nickname, nicknameError, password]);

  return (
<<<<<<< HEAD
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <h1 className="text-main absolute top-68 left-39.75 flex h-9.75 w-18 justify-center text-[28px] leading-[140%] font-bold tracking-[-0.7px] whitespace-nowrap">
        경도팟
      </h1>

      {/* 입력 영역 */}
      <div className="flex w-full flex-col items-center gap-3 pb-8">
=======
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <h1 className="
        absolute top-68 left-39.75
        w-18 h-9.75
        text-main text-[28px] font-bold leading-[140%] tracking-[-0.7px]
        whitespace-nowrap
        flex justify-center
        ">경도팟</h1>
      
      {/* 입력 영역 */}
      <div className="flex flex-col gap-3 pb-8 w-full items-center">
>>>>>>> 583fb23 (feat : 로그인 페이지 구현)
        <div className="flex flex-col gap-1">
          <Input
            width="md"
            type="text"
            placeholder="닉네임 입력 (한글, 영문 공백 포함 최대 8자)"
            required
            maxLength={8}
<<<<<<< HEAD
            className={`placeholder:text-main-variant placeholder:text-[14px] placeholder:tracking-[-0.35px] ${nicknameError ? "border-red-500 focus:border-red-500" : ""} `}
=======
            className={`placeholder:text-main-variant placeholder:text-[14px] placeholder:tracking-[-0.35px] 
              ${nicknameError ? "border-red-500 focus:border-red-500" : ""} 
            `}
>>>>>>> 583fb23 (feat : 로그인 페이지 구현)
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          {nicknameError && (
<<<<<<< HEAD
            <p className="pl-1 text-xs text-red-500">* {nicknameError}</p>
=======
            <p className="text-red-500 text-xs pl-1">
              * {nicknameError}
            </p>
>>>>>>> 583fb23 (feat : 로그인 페이지 구현)
          )}
        </div>
        <Input
          type="password"
          width="md"
          placeholder="비밀번호 입력(4자리)"
          required
          maxLength={4}
          className="placeholder:text-main-variant"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
<<<<<<< HEAD
      <Button
        className={`w-32.25 rounded-none ${isFormValid ? "bg-main text-black shadow-[2px_2px_0_0_#008E58]" : "border-main-dark1 border text-white"}`}
        onClick={() => navigate("/home")}
        disabled={!isFormValid}
      >
        START
      </Button>
    </div>
  );
};

export default LoginPage;
=======
      <Button 
        className={`w-32.25 rounded-none ${isFormValid ? "bg-main text-black shadow-[2px_2px_0_0_#008E58]" : "border border-main-dark1 text-white"}`} 
        onClick={() => navigate('/home')}
        disabled={!isFormValid}
      >START</Button>
    </div>
  )
}

export default LoginPage
>>>>>>> 583fb23 (feat : 로그인 페이지 구현)
