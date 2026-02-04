"use client";

import { useState, useEffect } from "react";
import { recordsApi, aiApi } from "@/lib/api";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";

interface Record {
  id: string;
  semester: string;
  category: string;
  title: string;
  content: string;
}

export function RecordTab() {
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    semester: "고1-1",
    category: "세특",
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadRecords();
  }, [selectedCategory]);

  const loadRecords = async () => {
    try {
      const res = await recordsApi.list(selectedCategory || undefined);
      setRecords(res.data);
    } catch (error) {
      console.error("생기부 로드 실패:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await recordsApi.create(formData);
      await loadRecords();
      setShowForm(false);
      setFormData({ semester: "고1-1", category: "세특", title: "", content: "" });
    } catch (error) {
      console.error("생기부 추가 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await recordsApi.delete(id);
      await loadRecords();
    } catch (error) {
      console.error("생기부 삭제 실패:", error);
    }
  };

  const handleAIGenerate = async () => {
    if (!formData.title || !formData.content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    setAiLoading(true);

    try {
      const res = await aiApi.generateSetech({
        category: formData.category,
        title: formData.title,
        content: formData.content,
      });
      setFormData({ ...formData, content: res.data.setech });
    } catch (error) {
      console.error("AI 생성 실패:", error);
      alert("AI 생성 중 오류가 발생했습니다.");
    } finally {
      setAiLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "세특": return "bg-purple-100 text-purple-700";
      case "독서": return "bg-green-100 text-green-700";
      case "동아리": return "bg-blue-100 text-blue-700";
      case "봉사": return "bg-yellow-100 text-yellow-700";
      case "수상": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-primary-500 mb-6 pb-3 border-b-2 border-primary-500">
        📚 생기부 관리
      </h2>

      {/* 필터 */}
      <div className="mb-6">
        <label className="label">카테고리 필터</label>
        <select
          className="input max-w-xs"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">전체</option>
          <option value="세특">세특</option>
          <option value="독서">독서</option>
          <option value="동아리">동아리</option>
          <option value="봉사">봉사</option>
          <option value="수상">수상</option>
        </select>
      </div>

      {/* 기록 목록 */}
      <div className="space-y-4 mb-6">
        {records.map((record) => (
          <div key={record.id} className="p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{record.semester}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(record.category)}`}>
                  {record.category}
                </span>
              </div>
              <button
                onClick={() => handleDelete(record.id)}
                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <h3 className="font-bold text-lg mb-2">{record.title}</h3>
            {["세특", "독서", "동아리", "봉사"].includes(record.category) && (
              <span className={`text-xs mb-2 inline-block ${record.content.length > 500 ? "text-red-600" : "text-gray-500"}`}>
                {record.content.length}자 {record.content.length > 500 && "(500자 초과)"}
              </span>
            )}
            <p className="text-gray-600 whitespace-pre-wrap">{record.content}</p>
          </div>
        ))}

        {records.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            등록된 생기부 기록이 없습니다.
          </p>
        )}
      </div>

      {/* 추가 폼 */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">학기</label>
              <select
                className="input"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              >
                <option value="고1-1">고1-1</option>
                <option value="고1-2">고1-2</option>
                <option value="고2-1">고2-1</option>
                <option value="고2-2">고2-2</option>
                <option value="고3-1">고3-1</option>
              </select>
            </div>
            <div>
              <label className="label">카테고리</label>
              <select
                className="input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="세특">세특</option>
                <option value="독서">독서</option>
                <option value="동아리">동아리</option>
                <option value="봉사">봉사</option>
                <option value="수상">수상</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">제목</label>
            <input
              type="text"
              className="input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예: 물리학 탐구 활동"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
              <label className="label mb-0">내용</label>
              <div className="flex items-center gap-2">
                {["세특", "독서", "동아리", "봉사"].includes(formData.category) && (
                  <span className={`text-xs ${formData.content.length > 500 ? "text-red-600 font-medium" : "text-gray-500"}`}>
                    {formData.content.length}자 / 500자
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={aiLoading}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  {aiLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  AI 세특 생성
                </button>
              </div>
            </div>
            <p className="text-xs text-amber-700 mb-2">
              💡 세특·독서·동아리·봉사는 생활기록부 기준 <strong>500자 이내</strong>로 작성됩니다.
            </p>
            <textarea
              className="input min-h-[150px]"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="활동 내용을 입력하세요. AI 버튼을 누르면 전문적인 세특 문구로 변환됩니다."
              required
            />
          </div>

          <div className="flex gap-2 justify-center">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "추가 중..." : "추가"}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <Plus className="inline mr-2" size={18} />
            생기부 추가
          </button>
        </div>
      )}
    </div>
  );
}
