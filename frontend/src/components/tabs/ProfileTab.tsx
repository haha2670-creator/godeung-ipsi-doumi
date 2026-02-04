"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { authApi } from "@/lib/api";
import { Save } from "lucide-react";

export function ProfileTab() {
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    grade: user?.grade || "",
    school: user?.school || "",
    track: user?.track || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await authApi.updateProfile(formData);
      updateUser(res.data);
      setMessage("✅ 프로필이 저장되었습니다!");
    } catch (error) {
      setMessage("❌ 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
        👤 기본 정보 설정
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">이름</label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="이름을 입력하세요"
            />
          </div>

          <div>
            <label className="label">학년</label>
            <select
              className="input"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            >
              <option value="">선택하세요</option>
              <option value="예비고1">예비고1</option>
              <option value="고1">고1</option>
              <option value="고2">고2</option>
              <option value="고3">고3</option>
            </select>
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

          <div>
            <label className="label">계열</label>
            <select
              className="input"
              value={formData.track}
              onChange={(e) => setFormData({ ...formData, track: e.target.value })}
            >
              <option value="">선택하세요</option>
              <option value="자연">자연계열</option>
              <option value="인문">인문계열</option>
              <option value="예체능">예체능계열</option>
            </select>
          </div>
        </div>

        {message && (
          <p className="mt-4 text-center font-medium">{message}</p>
        )}

        <div className="mt-6 text-center">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save className="inline mr-2" size={18} />
            {loading ? "저장 중..." : "프로필 저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
