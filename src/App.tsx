import React, { useState, useEffect } from "react";
import { Search, Loader2, ClipboardList, Store, Utensils, MessageSquare, BookOpen, ChevronRight, Key, ShieldCheck, Check, Trash2, HelpCircle } from "lucide-react";
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

  // 개인 API Key 설정 관련 상태
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);

  // 마운트 시 localStorage에서 사용자 지정 키 로드
  useEffect(() => {
    const savedKey = localStorage.getItem("USER_GEMINI_API_KEY") || "";
    if (savedKey) {
      setCustomApiKey(savedKey);
      setIsKeySaved(true);
    }
  }, []);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (customApiKey.trim()) {
        localStorage.setItem("USER_GEMINI_API_KEY", customApiKey.trim());
        setIsKeySaved(true);
        setError(null);
        // 저장 성공 알림 효과 (세련되게 설정 영역 접기)
        setTimeout(() => {
          setShowApiSettings(false);
        }, 800);
      } else {
        handleDeleteApiKey();
      }
    } catch (err) {
      console.error("API Key 저장 실패:", err);
    }
  };

  const handleDeleteApiKey = () => {
    localStorage.removeItem("USER_GEMINI_API_KEY");
    setCustomApiKey("");
    setIsKeySaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.placeName.trim()) {
      setError("매장명을 정확하게 입력해 주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const diagnosis = await generateDiagnosis(formData);
      setResult(diagnosis);
      
      // 기분 좋은 축하 콘페티 연출
      confetti({
        particleCount: 150,
        spread: 75,
        origin: { y: 0.65 },
        colors: ["#10b981", "#059669", "#3b82f6", "#f59e0b"],
      });
    } catch (err: any) {
      console.error("진단 도중 장애 발생:", err);
      setError(
        err.message || "분석 실행 도중 문제가 생겼습니다. 입력 정보를 다시 확인하시거나 잠시 후 재시도해 주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 py-6 px-6 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/15">
              <ClipboardList className="text-white w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                📝 Dy Month <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 font-black">플레이스 진단시스템</span>
              </h1>
              <p className="text-slate-500 font-bold text-xs md:text-sm">실시간 네이버 플레이스 가중치 계산 및 평판 최적화 도구</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 설정 관리 버튼 */}
            {!result && (
              <button
                id="toggle-api-settings-btn"
                onClick={() => setShowApiSettings(!showApiSettings)}
                className={cn(
                  "text-xs font-bold px-4 py-2.5 rounded-full transition-all flex items-center gap-2 border cursor-pointer",
                  isKeySaved 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100/80" 
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                )}
              >
                <Key className="w-3.5 h-3.5" />
                {isKeySaved ? "API 연동 완료" : "API 설정 (선택)"}
              </button>
            )}

            {result && (
              <button 
                id="reset-diagnosis-btn"
                onClick={() => {
                  setResult(null);
                  setFormData({ placeName: "", category: "", visitReviews: 0, blogReviews: 0 });
                }}
                className="text-xs font-black text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-5 py-2.5 rounded-full transition-all flex items-center gap-2 border border-emerald-200/40 shadow-sm cursor-pointer"
              >
                새로 분석하기
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-10 px-6">
        <AnimatePresence mode="wait">
          {!result ? (
            <div className="space-y-8">
              
              {/* 고급 설정 아코디언 패널 */}
              <AnimatePresence>
                {showApiSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl p-6 md:p-8 overflow-hidden"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                      <h3 className="text-base font-black flex items-center gap-2.5 text-emerald-400">
                        <Key className="w-5 h-5 text-emerald-400" /> 고급 호스팅 배포 설정 (Gemini API Key)
                      </h3>
                      <button 
                        onClick={() => setShowApiSettings(false)}
                        className="text-slate-400 hover:text-slate-200 text-xs font-bold"
                      >
                        닫기
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-medium mb-5">
                      이 프로젝트를 Vercel, Netlify, GitHub Pages 등 외부 정적인 호스팅에 개별 배포하여 사용할 때 적용됩니다. 
                      본인의 <span className="text-emerald-400 font-bold">Gemini API Key</span>를 연동해 두면, 서버 호스팅 없이 브라우저 단독 환경에서도 완벽한 실시간 AI 분석 결과를 받아보실 수 있습니다.
                    </p>

                    <form onSubmit={handleSaveApiKey} className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-3">
                        <input
                          type="password"
                          id="custom-api-key-input"
                          placeholder="AI Studio 또는 Google Cloud에서 발급받은 GEMINI_API_KEY 입력"
                          value={customApiKey}
                          onChange={(e) => setCustomApiKey(e.target.value)}
                          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 text-xs font-mono"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            id="save-api-key-btn"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                          >
                            <Check className="w-4 h-4" />
                            저장
                          </button>
                          {isKeySaved && (
                            <button
                              type="button"
                              id="delete-api-key-btn"
                              onClick={handleDeleteApiKey}
                              className="bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                              삭제
                            </button>
                          )}
                        </div>
                      </div>
                    </form>

                    <div className="mt-5 pt-4 border-t border-slate-850 flex items-start gap-2.5 text-[11px] text-slate-400 font-semibold leading-relaxed">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>
                        입력된 API Key는 오직 사용자 본인의 브라우저 안전 저장소(<span className="font-mono text-emerald-400">localStorage</span>)에만 국한 보관되며, 
                        타 서비스나 외부 네트워크 서버에 전송되지 않으므로 보안상 100% 안전합니다.
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 매장 정보 입력 폼 */}
              <motion.div
                key="form-container"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 overflow-hidden"
              >
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Search className="w-5 h-5 text-emerald-600 animate-pulse" /> 매장 기본 정보 입력
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
                        id="place-name-input"
                        required
                        placeholder="예: 화로구이 만수점"
                        value={formData.placeName}
                        onChange={(e) => setFormData({ ...formData, placeName: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium placeholder:text-slate-400 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-2 tracking-wider">
                        <Utensils className="w-4 h-4 text-emerald-600/70" /> 업종 / 대표 메뉴
                      </label>
                      <input
                        type="text"
                        id="category-input"
                        placeholder="예: 육류, 고기요리"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium placeholder:text-slate-400 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-2 tracking-wider">
                        <MessageSquare className="w-4 h-4 text-sky-600/70" /> 현재 방문자 리뷰 수
                      </label>
                      <input
                        type="number"
                        id="visit-reviews-input"
                        min={0}
                        placeholder="0"
                        value={formData.visitReviews === 0 ? "" : formData.visitReviews}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                          const cleanVal = isNaN(val) || val < 0 ? 0 : val;
                          setFormData({ ...formData, visitReviews: cleanVal });
                        }}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium placeholder:text-slate-400 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-2 tracking-wider">
                        <BookOpen className="w-4 h-4 text-emerald-600/70" /> 현재 블로그 리뷰 수
                      </label>
                      <input
                        type="number"
                        id="blog-reviews-input"
                        min={0}
                        placeholder="0"
                        value={formData.blogReviews === 0 ? "" : formData.blogReviews}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                          const cleanVal = isNaN(val) || val < 0 ? 0 : val;
                          setFormData({ ...formData, blogReviews: cleanVal });
                        }}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium placeholder:text-slate-400 text-sm"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-5 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-xs md:text-sm font-semibold whitespace-pre-line leading-relaxed shadow-inner">
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
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                        AI 평판 지표 분석 및 마케팅 설계 데이터 연산 중...
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
            </div>
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
