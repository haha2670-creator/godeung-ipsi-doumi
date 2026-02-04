"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { LogIn, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

const SAVED_EMAIL_KEY = "admission_toolkit_saved_email";
const REMEMBER_EMAIL_KEY = "admission_toolkit_remember_email";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberEmail, setRememberEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState<"password" | "email" | "general" | "">("");

  // 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);
    const shouldRemember = localStorage.getItem(REMEMBER_EMAIL_KEY) === "true";
    
    if (shouldRemember && savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberEmail(true);
    }
  }, []);

  // 아이디 저장 토글
  const handleRememberChange = (checked: boolean) => {
    setRememberEmail(checked);
    if (!checked) {
      localStorage.removeItem(SAVED_EMAIL_KEY);
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrorType("");

    try {
      const res = await authApi.login(formData);
      
      // 아이디 저장 처리
      if (rememberEmail) {
        localStorage.setItem(SAVED_EMAIL_KEY, formData.email);
        localStorage.setItem(REMEMBER_EMAIL_KEY, "true");
      }
      
      login(res.data.user, res.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "로그인에 실패했습니다.";
      
      // 에러 유형 판별
      if (errorMessage.includes("비밀번호") || errorMessage.includes("password")) {
        setErrorType("password");
        setError("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      } else if (errorMessage.includes("이메일") || errorMessage.includes("email") || errorMessage.includes("존재하지")) {
        setErrorType("email");
        setError("등록되지 않은 이메일입니다.");
      } else {
        setErrorType("general");
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">🎓 고등 입시 도우미</h1>
          <p className="text-lg opacity-90">로그인</p>
        </div>

        {/* 폼 */}
        <div className="card">
          {/* 에러 메시지 */}
          {error && (
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
              errorType === "password" 
                ? "bg-red-50 border border-red-200" 
                : errorType === "email"
                ? "bg-orange-50 border border-orange-200"
                : "bg-red-50 border border-red-200"
            }`}>
              <AlertCircle className={`flex-shrink-0 mt-0.5 ${
                errorType === "password" ? "text-red-500" : 
                errorType === "email" ? "text-orange-500" : "text-red-500"
              }`} size={20} />
              <div>
                <p className={`font-semibold ${
                  errorType === "password" ? "text-red-700" : 
                  errorType === "email" ? "text-orange-700" : "text-red-700"
                }`}>
                  {errorType === "password" && "⚠️ 비밀번호 오류"}
                  {errorType === "email" && "⚠️ 이메일 오류"}
                  {errorType === "general" && "⚠️ 로그인 실패"}
                </p>
                <p className={`text-sm mt-1 ${
                  errorType === "password" ? "text-red-600" : 
                  errorType === "email" ? "text-orange-600" : "text-red-600"
                }`}>
                  {error}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">이메일</label>
              <input
                type="email"
                className={`input ${errorType === "email" ? "border-orange-400 focus:border-orange-500" : ""}`}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errorType === "email") setError("");
                }}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="label">비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input pr-12 ${errorType === "password" ? "border-red-400 focus:border-red-500" : ""}`}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errorType === "password") setError("");
                  }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* 아이디 저장 체크박스 */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(e) => handleRememberChange(e.target.checked)}
                  className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  {rememberEmail && <CheckCircle2 size={14} className="text-green-500" />}
                  아이디 저장
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                "로그인 중..."
              ) : (
                <>
                  <LogIn className="inline mr-2" size={18} />
                  로그인
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              계정이 없으신가요?{" "}
              <Link href="/register" className="text-primary-500 font-semibold hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
