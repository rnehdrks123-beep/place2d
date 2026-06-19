import React, { useState } from "react";
import { Search, Loader2, ClipboardList, Store, Utensils, MessageSquare, BookOpen, ChevronRight } from "lucide-react";
import { generateDiagnosis, DiagnosisResult } from "./lib/gemini";
import { ReviewReport } from "./components/ReviewReport";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { cn } from "./lib/utils";

export default function App() {
  const [formData, setFormData] = useState({
    placeName: "",
    category: "",
    visitReviews: 0,
    blogReviews: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.placeName) {
      setError("매장명을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const diagnosis = await generateDiagnosis(formData);
      setResult(diagnosis);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#059669", "#d97706"],
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 py-7 px-6 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/10">
              <ClipboardList className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                📝 Dy Month <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 font-black">플레이스 진단시스템</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-sm">실시간 네이버 플레이스 가중치 계산 및 평판 최적화 도구</p>
            </div>
          </div>
          {result && (
            <button 
              onClick={() => {
                setResult(null);
                setFormData({ placeName: "", category: "", visitReviews: 0, blogReviews: 0 });
              }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-5 py-2.5 rounded-full transition-all flex items-center gap-2 border border-emerald-250/30 shadow-sm shadow-emerald-500/5 cursor-pointer"
            >
              새로 분석하기
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-10 px-6">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-emerald-600" /> 매장 기본 정보 입력
                </h2>
                <p className="text-slate-500 text-xs mt-1">네이버 스마트플레이스 연계용 매장 기본 데이터를 바탕으로 인지도를 산출합니다.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-2 tracking-wider">
                      <Store className="w-4 h-4 text-emerald-600/70" /> 매장명
                    </label>
                    <input
                      type="text"
                      placeholder="예: 화로구이 만수점"
                      value={formData.placeName}
                      onChange={(e) => setFormData({ ...formData, placeName: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-55 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium placeholder:text-slate-400 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-2 tracking-wider">
                      <Utensils className="w-4 h-4 text-emerald-600/70" /> 업종 / 대표 메뉴
                    </label>
                    <input
                      type="text"
                      placeholder="예: 육류, 고기요리"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-55 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium placeholder:text-slate-400 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-2 tracking-wider">
                      <MessageSquare className="w-4 h-4 text-sky-600/70" /> 현재 방문자 리뷰 수
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.visitReviews}
                      onChange={(e) => setFormData({ ...formData, visitReviews: parseInt(e.target.value) || 0 })}
                      className="w-full px-5 py-4 bg-slate-55 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-550 outline-none transition-all font-black text-sky-600 text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-2 tracking-wider">
                      <BookOpen className="w-4 h-4 text-emerald-600/70" /> 현재 블로그 리뷰 수
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.blogReviews}
                      onChange={(e) => setFormData({ ...formData, blogReviews: parseInt(e.target.value) || 0 })}
                      className="w-full px-5 py-4 bg-slate-55 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-black text-emerald-600 text-lg"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-5 md:p-6 bg-rose-50 border border-rose-100/80 text-rose-750 rounded-2xl text-xs md:text-sm font-semibold whitespace-pre-line text-left leading-relaxed shadow-sm">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  id="submit-diagnosis-btn"
                  className={cn(
                    "w-full py-5 rounded-2xl font-black text-base md:text-lg shadow-xl shadow-emerald-500/5 transition-all flex items-center justify-center gap-3 cursor-pointer",
                    isLoading 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-emerald-500/10 active:scale-[0.98]"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                      AI 분석 및 성장 데이터 계산 시뮬레이션 중...
                    </>
                  ) : (
                    <>
                      🚀 정밀 평판 진단 및 매출 예측 실행
                      <ChevronRight className="w-5 h-5 text-white" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="result-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <ReviewReport data={result} placeName={formData.placeName} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-16 text-center text-slate-400 font-medium text-xs border-t border-slate-200/60 mt-12 bg-slate-100/50">
        <p>© 2026 Dy Month Marketing Group. All rights reserved.</p>
        <p className="mt-1 text-slate-400">본 시스템의 연계 데이터는 스마트플레이스 최적화 마케팅 로직을 기반으로 산출된 시뮬레이션 결과물입니다.</p>
      </footer>
    </div>
  );
}
