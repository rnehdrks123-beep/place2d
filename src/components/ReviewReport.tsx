import React, { useRef, useState } from "react";
import { Download, Sparkles, TrendingUp, Info, CheckCircle2, FileText, Loader2, AlertCircle } from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { DiagnosisResult } from "../lib/gemini";
import { motion } from "motion/react";

interface ReviewReportProps {
  data: DiagnosisResult;
  placeName: string;
}

export const ReviewReport: React.FC<ReviewReportProps> = ({ data, placeName }) => {
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPng1, setIsExportingPng1] = useState(false);
  const [isExportingPng2, setIsExportingPng2] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 고해상도 이미지 변환을 위한 공통 세팅
  const getHighQualityImage = async (element: HTMLDivElement): Promise<string> => {
    // 모바일 기기 대응을 위해 캡처 중 일시적으로 고정 넓이 스타일을 유지
    const originalWidth = element.style.width;
    const originalMinHeight = element.style.minHeight;
    const originalTransform = element.style.transform;

    try {
      // 캡처 최적화 스타일 주입 (모바일에서도 가로가 잘리지 않도록 강제 세팅)
      element.style.width = "800px";
      element.style.minHeight = "1120px";
      element.style.transform = "none";

      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2, // 고해상도 선명도 보장
        backgroundColor: "#ffffff",
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        }
      });

      // 복구
      element.style.width = originalWidth;
      element.style.minHeight = originalMinHeight;
      element.style.transform = originalTransform;

      return dataUrl;
    } catch (err) {
      // 에러 발생 시 원래 상태 복구 후 throw
      element.style.width = originalWidth;
      element.style.minHeight = originalMinHeight;
      element.style.transform = originalTransform;
      throw err;
    }
  };

  // 개별 PNG 이미지 다운로드 기능
  const downloadPng = async (ref: React.RefObject<HTMLDivElement | null>, pageNum: number) => {
    if (!ref || !ref.current) return;
    setErrorMessage(null);
    
    if (pageNum === 1) setIsExportingPng1(true);
    else setIsExportingPng2(true);

    try {
      const dataUrl = await getHighQualityImage(ref.current);
      const link = document.createElement("a");
      link.download = `${placeName}_플레이스_진단리포트_page${pageNum}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error("PNG 내보내기 오류 발생:", err);
      setErrorMessage(`이미지 다운로드 중 오류가 발생했습니다. (원인: ${err.message || "브라우저 호환성 제약"})`);
    } finally {
      if (pageNum === 1) setIsExportingPng1(false);
      else setIsExportingPng2(false);
    }
  };

  // 통합 PDF 고해상도 생성 기능 (A4 규격, 2개 페이지 일체화)
  const downloadPdf = async () => {
    if (!page1Ref.current || !page2Ref.current) return;
    setIsExportingPdf(true);
    setErrorMessage(null);

    try {
      // 1페이지 고화질 캡처 진행
      const imgData1 = await getHighQualityImage(page1Ref.current);
      
      // 2페이지 고화질 캡처 진행
      const imgData2 = await getHighQualityImage(page2Ref.current);

      // jsPDF 생성: p(portrait), mm(밀리미터), a4 규격
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4"
      });

      // A4 가로세로 규격: 210mm x 297mm
      pdf.addImage(imgData1, "PNG", 0, 0, 210, 297, undefined, "FAST");
      
      pdf.addPage();
      pdf.addImage(imgData2, "PNG", 0, 0, 210, 297, undefined, "FAST");

      // 파일명 공백 및 특수문자 제거 후 안전한 이름으로 저장
      const safePlaceName = placeName.replace(/[^a-zA-Z0-9가-힣]/g, "_");
      pdf.save(`${safePlaceName}_네이버플레이스_진단보고서_DyMonth.pdf`);
    } catch (err: any) {
      console.error("PDF 생성 오류 발생:", err);
      setErrorMessage(`PDF 통합 보고서 생성 중 오류가 발생했습니다. (원인: ${err.message || "메모리 부족 또는 디바이스 미지원"})`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const marketingSolutions = [
    "네이버 플레이스 셋팅 및 관리 (SEO 최적화)",
    "네이버 플레이스 방문자 리뷰 월 10건",
    "카카오맵 리뷰 작성 월 10건",
    "AI 블로그 기자단 작성 월 10건",
    "블로그 체험단 모집 솔루션 제공 (무제한)",
    "고퀄리티 블로그 생성 (사진 15장, 1,000자 이상)",
    "광고 운영 결과에 대한 월간 리포트 제공",
    "플레이스 순위/노출 변화 모니터링 및 유지",
    "월 3회 기본 수정 (사진, 정보, 새소식)",
    "마케팅 관련 자문 및 컨설팅 지원",
    "Google Business Profile 신규 등록 및 리뷰 작성 월 10건",
    "매장 또는 업체 홍보용 영상 콘텐츠 제작",
  ];

  const renderHTML = (html: string) => {
    // 오프라인 / 백엔드 상관없이 span 태그가 정상 렌더링되도록 가드
    if (!html) return <span>분석 진행 중입니다...</span>;
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="flex flex-col items-center gap-10 py-6 w-full max-w-4xl mx-auto px-4 select-none">
      
      {/* 알림 배너 */}
      {data.isSimulated && (
        <div className="w-full bg-amber-50 border-2 border-amber-200/80 rounded-2xl p-5 flex items-start gap-3.5 shadow-sm">
          <Info className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-amber-900 font-extrabold text-sm">실시간 초고속 진단 모드 작동 중</h4>
            <p className="text-amber-800 text-xs mt-1 font-semibold leading-relaxed">
              현재 정적 호스팅 배포(Netlify/Vercel) 또는 서버 대기 상태입니다. 입력하신 플레이스 수치 가중치를 분석하여 지능형 알고리즘 기반 맞춤 보고서를 즉각 생성하였습니다.
            </p>
          </div>
        </div>
      )}

      {/* 에러 발생 안내 */}
      {errorMessage && (
        <div className="w-full bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 flex items-center gap-3.5 shadow-sm text-rose-800 font-semibold text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="flex-1">
            <span className="font-extrabold block">내보내기 장애 해결 가이드</span>
            <span className="text-xs text-rose-700 font-medium leading-relaxed mt-0.5 block">{errorMessage}</span>
          </div>
          <button 
            onClick={() => setErrorMessage(null)}
            className="text-xs bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-lg text-rose-800 font-bold transition-all"
          >
            닫기
          </button>
        </div>
      )}

      {/* 🌟 최상단 통합 PDF 내보내기 마스터 컨트롤 바 */}
      <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 p-5 rounded-3xl shadow-xl shadow-emerald-600/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-white text-center md:text-left">
          <h3 className="text-lg font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" /> 사장님 보고서 저장 센터
          </h3>
          <p className="text-emerald-100 text-xs mt-1 font-medium">A4 최적 규격으로 완벽하게 조율된 PDF 및 PNG를 원클릭으로 출력하세요.</p>
        </div>

        <button
          onClick={downloadPdf}
          disabled={isExportingPdf || isExportingPng1 || isExportingPng2}
          className="w-full md:w-auto bg-white hover:bg-emerald-50 text-emerald-800 font-black text-sm md:text-base px-7 py-3.5 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExportingPdf ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
              A4 통합 PDF 빌드 중...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5 text-emerald-700" />
              📄 PDF 종합 리포트 한번에 다운로드
            </>
          )}
        </button>
      </div>

      {/* Page 1: Diagnosis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div 
          ref={page1Ref}
          className="bg-white border-2 border-slate-200/80 rounded-3xl shadow-xl p-10 font-sans text-slate-800 overflow-hidden relative"
          style={{ minHeight: "1120px" }}
        >
          {/* Top Elegant Border Ornament */}
          <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
          
          <header className="text-center mb-10 pt-4">
            <span className="text-xs font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 inline-block mb-3">
              NAVER PLACE DIAGNOSIS REPORT
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">📈 맞춤형 평판 진단 리포트 (1/2)</h1>
            <p className="text-slate-500 font-semibold text-base">대상 매장: <span className="text-[#101827] font-black border-b-2 border-emerald-500 pb-0.5">{placeName}</span></p>
          </header>

          <section className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl mb-10 shadow-sm">
            <h4 className="text-emerald-950 font-black text-base flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-emerald-600" /> 📌 플레이스 상위 노출 결정적 4대 지표
            </h4>
            <p className="text-slate-600 font-semibold mb-4 text-xs leading-relaxed">네이버 플레이스 인덱스 검색 결과에 가중치가 가장 높게 부여되는 4가지 핵심 인공지능 지표입니다.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {["① 리뷰 활성도", "② 키워드 적합도", "③ 최신성 지수", "④ 체류 시간"].map((tag) => (
                <span key={tag} className="bg-white py-2 px-3 rounded-lg border border-slate-100 text-emerald-800 font-bold text-xs shadow-sm text-center">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <div className="space-y-8">
            <div className="border-l-4 border-emerald-500 pl-5">
              <h3 className="text-slate-900 font-black text-lg md:text-xl mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" />
                1. 방문자 리뷰 진단 및 문제점
              </h3>
              <div className="text-slate-600 leading-relaxed text-sm md:text-base font-medium">{renderHTML(data.visitDiag)}</div>
            </div>

            <div className="bg-emerald-50/40 border-l-4 border-emerald-500 p-6 rounded-r-2xl">
              <h4 className="text-slate-900 font-black text-base flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-emerald-500" /> ✨ 꾸준한 답글 관리 시 개선점
              </h4>
              <div className="text-[#065f46] font-medium text-sm leading-relaxed">{renderHTML(data.visitImprove)}</div>
            </div>

            <div className="bg-slate-55/80 border border-slate-200/60 p-6 rounded-2xl shadow-inner">
              <h4 className="text-emerald-700 font-bold text-sm tracking-wide mb-4 uppercase">🤖 AI 추천 고객 감동 답글 예시</h4>
              <div className="text-slate-700 leading-relaxed text-sm font-medium">{renderHTML(data.aiReply)}</div>
            </div>

            <div className="border-l-4 border-teal-600 pl-5 pt-4">
              <h3 className="text-teal-950 font-black text-lg md:text-xl mb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-teal-600 rounded-full inline-block" />
                2. 블로그 리뷰 분석 및 문제점
              </h3>
              <div className="text-slate-600 leading-relaxed text-sm md:text-base font-medium">{renderHTML(data.blogDiag)}</div>
            </div>

            <div className="bg-emerald-50/30 border-l-4 border-teal-500 p-6 rounded-r-2xl">
              <h4 className="text-teal-950 font-black text-base flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-teal-600" /> ✨ 양질의 블로그 리뷰 증가 시 개선점
              </h4>
              <div className="text-teal-900 font-medium text-sm leading-relaxed">{renderHTML(data.blogImprove)}</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => downloadPng(page1Ref, 1)}
          disabled={isExportingPdf || isExportingPng1}
          className="mt-4 w-full flex items-center justify-center gap-2.5 px-6 py-4.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-450 hover:to-emerald-555 text-white font-black rounded-2xl shadow-lg transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
        >
          {isExportingPng1 ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              이미지 변환 및 다운로드 중...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 text-white" /> 📸 1. 진단 리포트 다운로드 (PNG)
            </>
          )}
        </button>
      </motion.div>

      {/* Page 2: Marketing Solution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <div 
          ref={page2Ref}
          className="bg-white border-2 border-slate-200/80 rounded-3xl shadow-xl p-10 font-sans text-slate-800 overflow-hidden relative"
          style={{ minHeight: "1120px" }}
        >
          {/* Top Elegant Border Ornament */}
          <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

          <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-200 pb-6 mb-10 pt-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">💡 마케팅 솔루션 제안서 (2/2)</h2>
              <p className="text-slate-400 text-xs font-semibold mt-1">NAVER PLACE CAMPAIGN GUIDE</p>
            </div>
            <p className="text-slate-500 text-sm font-semibold mt-2 md:mt-0">대상 매장: <span className="text-slate-900 font-black">{placeName}</span></p>
          </div>

          <div className="bg-emerald-50/40 p-8 rounded-3xl border border-emerald-100/85 mb-10 shadow-sm">
            <h3 className="text-emerald-800 text-lg font-black mb-6 text-center tracking-wider flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              💎 Dy Month 마케팅 솔루션 {marketingSolutions.length}가지 핵심 패키지
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {marketingSolutions.map((solution, idx) => (
                <li key={idx} className="bg-white p-4 px-5 rounded-xl text-slate-800 font-bold text-xs md:text-sm border border-slate-100 flex items-center gap-3 shadow-sm hover:border-emerald-500/30 transition-all">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-600 mr-1.5 min-w-4 text-xs font-black">{idx + 1}.</span>
                  {solution}
                </li>
              ))}
            </ul>

            <div className="mt-8 bg-white p-6 rounded-2xl border border-dashed border-rose-300 text-center shadow-lg relative overflow-hidden group">
              <span className="text-slate-400 font-bold line-through text-base mr-3">400만원 (정상가)</span>
              <strong className="text-rose-600 text-3xl font-black mr-2">➔ 180만원</strong>
              <span className="text-rose-500 font-bold text-sm bg-rose-50 px-3 py-1 rounded-full border border-rose-100 inline-block">(실천 약속 멤버십가)</span>
            </div>
          </div>

          <div className="bg-slate-55/60 p-10 rounded-3xl border border-slate-200/80 shadow-inner flex flex-col items-center text-center relative overflow-hidden">
            <h3 className="text-slate-900 font-black text-xl mb-6 flex items-center gap-2 relative z-10">
              <TrendingUp className="w-6 h-6 text-emerald-600" /> 🚀 솔루션 적용 시 3개월 후 예상 매출
            </h3>

            <div className="text-lg md:text-xl font-bold text-slate-700 mb-10 leading-relaxed relative z-10">
              Dy Month의 {marketingSolutions.length}가지 전방위 솔루션 적용 시 3개월 후 <br/>
              현재 대비 약 <span className="text-[#03c75a] font-black text-4xl mx-1.5">{data.profitPredict}</span> 상승 예상
            </div>

            <div className="w-full pt-8 border-t border-dashed border-slate-200 font-semibold text-slate-600 text-sm md:text-base leading-loose relative z-10">
              {renderHTML(data.conclusion)}
            </div>
          </div>
        </div>

        <button
          onClick={() => downloadPng(page2Ref, 2)}
          disabled={isExportingPdf || isExportingPng2}
          className="mt-4 w-full flex items-center justify-center gap-2.5 px-6 py-4.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl shadow-md border border-slate-200 cursor-pointer transition-all hover:scale-[1.01] disabled:opacity-50"
        >
          {isExportingPng2 ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-emerald-650" />
              이미지 변환 및 다운로드 중...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 text-emerald-600" /> 📸 2. 마케팅 제안서 다운로드 (PNG)
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};
