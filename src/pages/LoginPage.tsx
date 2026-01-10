import { postUser } from "@/apis/user";
import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input/Input";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  const navigate = useNavigate();

  // 닉네임 유효성 검사
  const nicknameError = useMemo(() => {
    if (nickname.length === 0) return null;
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
      password.trim().length === 4
    );
  }, [nickname, nicknameError, password]);

  // [추가] 현재 위치 가져오는 함수 (Promise 래핑)
  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("GPS 미지원"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          reject(err);
        },
        { enableHighAccuracy: true } // 정확도 높임
      );
    });
  };

  // [추가] 로그인 핸들러
  const handleLogin = async () => {
    if (!isFormValid || isLoading) return;
    
    try {
      setIsLoading(true);

      // 1. 위치 정보 수집
      let location = { lat: 37.5665, lng: 126.9780 }; // 기본값 (서울 시청)
      
      try {
        location = await getCurrentLocation();
      } catch (error) {
        console.warn("위치 정보를 가져올 수 없어 기본값으로 진행합니다.", error);
        // 필요 시: alert("위치 권한을 허용해주세요.");
      }

      // 2. API 호출
      const response = await postUser({
        nickname,
        password,
        lat: location.lat,
        lng: location.lng,
      });

      console.log("로그인 응답:", response);

      // 3. (중요) 세션ID 또는 토큰 저장 로직
      // 응답 data가 문자열(식별자)이라면 저장해야 합니다.
      if (response.data) {
        localStorage.setItem("authToken", response.data);
        localStorage.setItem("nickname", nickname); 
        // 혹은 세션 스토리지: sessionStorage.setItem("authToken", response.data);
      }
      // LoginPage.tsx의 handleLogin 함수 내부
      // 4. 페이지 이동
      navigate('/home');

    } catch (error) {
      console.error("로그인 에러:", error);
      alert("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        <div className="flex flex-col gap-1">
          <Input
            width="md"
            type="text"
            placeholder="닉네임 입력 (한글, 영문 공백 포함 최대 8자)"
            required
            maxLength={8}
            className={`placeholder:text-main-variant placeholder:text-[14px] placeholder:tracking-[-0.35px] 
              ${nicknameError ? "border-red-500 focus:border-red-500" : ""} 
            `}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          {nicknameError && (
            <p className="text-red-500 text-xs pl-1">
              * {nicknameError}
            </p>
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
      
      {/* 버튼에 onClick 연결 */}
      <Button 
        className={`w-32.25 rounded-none ${isFormValid ? "bg-main text-black shadow-[2px_2px_0_0_#008E58]" : "border border-main-dark1 text-white"}`} 
        onClick={handleLogin}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? "..." : "START"}
      </Button>
    </div>
  )
}

export default LoginPage;