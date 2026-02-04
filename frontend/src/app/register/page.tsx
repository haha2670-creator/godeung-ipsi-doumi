"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { UserPlus, Eye, EyeOff } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
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
                  className="input pr-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="6자 이상"
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

            <div>
              <label className="label">비밀번호 확인 *</label>
              <input
                type="password"
                className="input"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                placeholder="비밀번호 다시 입력"
                required
              />
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
