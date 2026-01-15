import { postUser } from "@/apis/user";
import { Button } from "@/components/common/Button";
import Input from "@/components/common/Input/Input";
import axios from "axios";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Coordinates = {
  lat: number;
  lng: number;
};

const LoginPage = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // 닉네임 유효성 검사
  const nicknameError = useMemo(() => {
    if (nickname.length === 0) return null;

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
      password.trim().length === 4
    );
  }, [nickname, nicknameError, password]);

  const getCurrentPosition = (): Promise<Coordinates> =>
    new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: 0, lng: 0 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => resolve({ lat: 0, lng: 0 }),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    });

  const handleLogin = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const { lat, lng } = await getCurrentPosition();

    try {
      const response = await postUser({
        nickname,
        password,
        lat,
        lng,
      });
      const { userId, accessToken, tokenType } = response.data;

      localStorage.setItem("userId", String(userId));
      localStorage.setItem("nickname", nickname);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("tokenType", tokenType);

      navigate("/home");
    } catch (error) {
      let message = "로그인에 실패했습니다.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-full w-full flex-col items-center justify-center px-6">
      <div className="flex w-full flex-col items-center gap-8">
        <h1 className="text-main text-[28px] leading-[140%] font-bold tracking-[-0.7px] whitespace-nowrap">
          경도팟
        </h1>

        {/* 입력 영역 */}
        <div className="flex w-full flex-col items-center gap-3">
          <div className="flex flex-col gap-1">
            <Input
              width="md"
              type="text"
              placeholder="닉네임 입력 (한글, 영문 공백 포함 최대 8자)"
              required
              maxLength={8}
              className={`placeholder:text-main-variant placeholder:text-[14px] placeholder:tracking-[-0.35px] ${nicknameError ? "border-red-500 focus:border-red-500" : ""} `}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            {nicknameError && (
              <p className="pl-1 text-xs text-red-500">* {nicknameError}</p>
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
          {errorMessage && (
            <p className="pl-1 text-xs text-red-500">* {errorMessage}</p>
          )}
        </div>
        <Button
          className={`w-32.25 rounded-none ${isFormValid ? "bg-main text-black shadow-[2px_2px_0_0_#008E58]" : "border-main-dark1 border text-white"}`}
          onClick={handleLogin}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? "LOADING..." : "START"}
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
