"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { UserPlus, Eye, EyeOff, Check, X } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    grade: "",
    school: "",
    track: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 비밀번호 유효성 검사
  const passwordValidation = useMemo(() => {
    const password = formData.password;
    const checks = {
      length: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      noSpace: !/\s/.test(password),
    };
    const isValid = Object.values(checks).every(Boolean);
    return { ...checks, isValid };
  }, [formData.password]);

  // 비밀번호 강도 평가
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    if (password.length === 0) return null;
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) return { level: 'weak', label: '약함', color: 'bg-red-500' };
    if (score <= 4) return { level: 'medium', label: '보통', color: 'bg-yellow-500' };
    return { level: 'strong', label: '강함', color: 'bg-green-500' };
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setError("비밀번호 규칙을 확인해주세요.");
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        grade: formData.grade,
        school: formData.school,
        track: formData.track,
      });
      login(res.data.user, res.data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">🎓 고등 입시 도우미</h1>
          <p className="text-lg opacity-90">회원가입</p>
        </div>

        {/* 폼 */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">이메일 *</label>
              <input
                type="email"
                className="input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="label">비밀번호 *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input pr-12 ${
                    formData.password && !passwordValidation.isValid ? "border-red-300" : ""
                  }`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="8자 이상, 영문+숫자 조합"
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
              
              {/* 비밀번호 규칙 안내 */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    {passwordValidation.length ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <X size={14} className="text-red-500" />
                    )}
                    <span className={passwordValidation.length ? "text-gray-600" : "text-red-500"}>
                      8자 이상
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {passwordValidation.hasLetter ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <X size={14} className="text-red-500" />
                    )}
                    <span className={passwordValidation.hasLetter ? "text-gray-600" : "text-red-500"}>
                      영문자 포함
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {passwordValidation.hasNumber ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <X size={14} className="text-red-500" />
                    )}
                    <span className={passwordValidation.hasNumber ? "text-gray-600" : "text-red-500"}>
                      숫자 포함
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {passwordValidation.noSpace ? (
                      <Check size={14} className="text-green-500" />
                    ) : (
                      <X size={14} className="text-red-500" />
                    )}
                    <span className={passwordValidation.noSpace ? "text-gray-600" : "text-red-500"}>
                      공백 없음
                    </span>
                  </div>
                  
                  {/* 비밀번호 강도 표시 */}
                  {passwordStrength && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-600">강도:</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.color} transition-all`}
                            style={{
                              width: passwordStrength.level === 'weak' ? '33%' : passwordStrength.level === 'medium' ? '66%' : '100%'
                            }}
                          />
                        </div>
                        <span className={`text-xs font-semibold ${
                          passwordStrength.level === 'weak' ? 'text-red-500' :
                          passwordStrength.level === 'medium' ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="label">비밀번호 확인 *</label>
              <div className="relative">
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  className={`input pr-12 ${
                    formData.passwordConfirm && formData.password !== formData.passwordConfirm
                      ? "border-red-300"
                      : formData.passwordConfirm && formData.password === formData.passwordConfirm
                      ? "border-green-300"
                      : ""
                  }`}
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  placeholder="비밀번호 다시 입력"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.passwordConfirm && (
                <div className="mt-1">
                  {formData.password === formData.passwordConfirm ? (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Check size={14} />
                      <span>비밀번호가 일치합니다</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-red-500">
                      <X size={14} />
                      <span>비밀번호가 일치하지 않습니다</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="label">이름 *</label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="홍길동"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">학년</label>
                <select
                  className="input"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                >
                  <option value="">선택</option>
                  <option value="예비고1">예비고1</option>
                  <option value="고1">고1</option>
                  <option value="고2">고2</option>
                  <option value="고3">고3</option>
                </select>
              </div>

              <div>
                <label className="label">계열</label>
                <select
                  className="input"
                  value={formData.track}
                  onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                >
                  <option value="">선택</option>
                  <option value="자연">자연계열</option>
                  <option value="인문">인문계열</option>
                  <option value="예체능">예체능계열</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">학교</label>
              <select
                className="input"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              >
                <option value="">선택하세요</option>
                <option value="위례고등학교">위례고등학교</option>
                <option value="감일고등학교">감일고등학교</option>
                <option value="한빛고등학교">한빛고등학교</option>
                <option value="덕수고등학교">덕수고등학교</option>
                <option value="효성고등학교">효성고등학교</option>
              </select>
              <p className="mt-1.5 text-xs text-gray-500">
                ※ 위 학교들은 위례 지역에서 다닐 수 있는 고등학교로 구성되었습니다.
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                "가입 중..."
              ) : (
                <>
                  <UserPlus className="inline mr-2" size={18} />
                  회원가입
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-primary-500 font-semibold hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
