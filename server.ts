import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Check if GEMINI_API_KEY is available and log warning if not
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("⚠️ Warning: GEMINI_API_KEY is not defined or is using the default placeholder. Please make sure secrets are configured in AI Studio Settings.");
  }

  // Initialize server-side Gemini client
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for diagnosis
  app.post("/api/diagnosis", async (req, res) => {
    try {
      const { placeName, category, visitReviews, blogReviews } = req.body;
      if (!placeName) {
        return res.status(400).json({ error: "매장명을 입력해주세요." });
      }

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        return res.status(401).json({
          error: "API 키 설정 확인 필요",
          details: "Gemini API 키가 아직 설정되지 않았거나 기본 자리표시자 상태입니다. 오른쪽 위의 Settings > Secrets 메뉴에서 GEMINI_API_KEY 값을 등록한 후 다시 시도해 주세요."
        });
      }

      const prompt = `
        대한민국 최고의 소상공인 마케팅 전략가 관점에서 매장 리뷰 상태를 분석하고 솔루션을 제공하는 정밀 진단 리포트를 작성해 주세요.
        모든 답변글은 사장님께 친근하면서도 고도로 전문적인 맞춤형 어조(하십시오체, 해요체 권장)로 작성해 주세요.
        각 섹션별 결과는 핵심만 임팩트 있게 한두 문단 내외로 간결하고 일목요연하게 작성해 주십시오.
        더욱 세련된 리포트를 위해 자연스러운 설명 중간마다 중요 지표, 핵심 키워드, 수치 부분을 HTML 태그(예시: <span class="text-rose-600 font-bold">강조할텍스트</span> 또는 <span class="text-emerald-600 font-bold">강조할텍스트</span>)로 감싸서 시각적으로 아름답게 스타일이 적용되도록 처리해 주십시오.

        [분석 대상 매장 데이터]
        - 매장명: ${placeName} (${category || "미지정 업종"})
        - 방문자 리뷰: ${visitReviews}개
        - 블로그 리뷰: ${blogReviews}개

        [작성 규칙]
        1. visitDiag (방문자 리뷰 진단):
           - 현재 등록된 방문자 리뷰 수(${visitReviews}개)를 객관적으로 분석하십시오.
           - 경쟁 매장 대비 고객 반응 속도나 피드백 노출 지속성에 대한 잠재적 위험/문제점을 짚어주십시오.
           - 문맥에 맞춰서 수치나 매장명 근처에 <span class="text-rose-600 font-bold">${visitReviews}개</span> 및 <span class="text-rose-600 font-bold">${placeName}</span> 와 같은 HTML 구문으로 감싸 주십시오.

        2. visitImprove (방문자 리뷰 개선 가이드):
           - 사장님이 직접 수동으로 적극적이고 정성스러운 답글을 남기기 시작할 때 생기는 평판 가중치 변화 및 로컬 플레이스 순위 상승 등 마케팅적 이점과 장기적인 단골 유치 기대효과를 설득력 있게 제시해 주십시오.

        3. aiReply (리뷰 대표 답글 예시):
           - 이 매장의 분위기(${category})에 완전히 맞춤화되어 사장님이 직접 복사해 바로 쓸 수 있는 감동적인 실제 답글 시안을 정확히 2개 창작해 주십시오.
           - 1번 시안과 2번 시안 사이에는 분리를 위해 반드시 <br/><br/><br/> 태그를 삽입해 주십시오.

        4. blogDiag (블로그 리뷰 진단):
           - 블로그 리뷰 수(${blogReviews}개)에 대한 노출 가중치 상태를 분석하십시오.
           - 네이버 플레이스 순위 로직 상 블로그 체험단 또는 진성 인플루언서 리뷰 수가 미치는 영향과 현재 상태의 문제점을 강조해 주십시오.

        5. blogImprove (블로그 개선 기대효과):
           - 블로그 리뷰 수가 폭발적으로 증가하고 긍정적인 입소문(바이럴) 퀄리티가 고착화되었을 때 얻게 되는 유입 증대 및 예상 노출 최적화 시너지 장점에 대해 설명해 주십시오.

        6. profitPredict (솔루션 적용 시 예상 매출 상승률):
           - Dy Month의 플레이스 가중치 최적화 12가지 마케팅 솔루션 토탈 적용 시, 3개월 후 예상되는 현실적인 매출 성장 범위를 "OO% ~ OO%" 와 같이 퍼센트 범위 형태로 수치만 명확히 반환해 주십시오 (예: "25% ~ 45%", "35% ~ 60%"). 다른 부가 멘트 없이 해당 형식만 깔끔하게 작성해 주십시오.

        7. conclusion (종합 결론 한줄 평):
           - 이 매장이 성공하기 위해 온라인 인지도를 돌파하는 동기부여 성격의 힘 있는 격려와 종합적 제언을 한 문장으로 힘있게 남겨 주십시오.
      `;

      let response;
      let lastError: any = null;
      // 503 및 트래픽 과부하 시 유연하게 대처하기 위한 모델 다중 백업 리스트
      const modelsToTry = ["gemini-3.5-flash", "gemini-2.5-flash"];

      for (const modelToUse of modelsToTry) {
        try {
          console.log(`🚀 [Gemini] ${modelToUse} 모델 분석 시도 중...`);
          response = await ai.models.generateContent({
            model: modelToUse,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  visitDiag: {
                    type: Type.STRING,
                    description: "방문자 리뷰에 대한 객관적 진단 결과글 (HTML span 강조 효과 포함 가능)"
                  },
                  visitImprove: {
                    type: Type.STRING,
                    description: "방문자 리뷰 지속적인 소통 시의 개선 이익 분석 글 (HTML span 강조 효과 포함 가능)"
                  },
                  aiReply: {
                    type: Type.STRING,
                    description: "매장에 적합한 사장님 맞춤형 실전 답글 2건 시안 (1번과 2번 사이 <br/><br/><br/> 필수 적용)"
                  },
                  blogDiag: {
                    type: Type.STRING,
                    description: "블로그 리뷰 및 로컬 노출 가중치 결함 진단 글 (HTML span 강조 효과 포함 가능)"
                  },
                  blogImprove: {
                    type: Type.STRING,
                    description: "블로그 체험 마케팅 시너지 확대 시 유입 증가 이익 분석 글 (HTML span 강조 효과 포함 가능)"
                  },
                  profitPredict: {
                    type: Type.STRING,
                    description: "3개월 내 기대 예상 매출 증가 범위. 오직 '숫자% ~ 숫자%' 형식만 (예: 25% ~ 45%)"
                  },
                  conclusion: {
                    type: Type.STRING,
                    description: "매장의 비전을 완성하기 위한 강력하고 전문적인 마케팅 패키지 도입에 관한 종합 동기부여 결론글"
                  }
                },
                required: [
                  "visitDiag",
                  "visitImprove",
                  "aiReply",
                  "blogDiag",
                  "blogImprove",
                  "profitPredict",
                  "conclusion"
                ]
              }
            }
          });

          if (response && response.text) {
            console.log(`✅ [Gemini] ${modelToUse} 호출에 성공하였습니다.`);
            break; // 성공하면 루프 탈출
          }
        } catch (err: any) {
          console.warn(`⚠️ [Gemini] ${modelToUse} 호출 실패:`, err.message || err);
          lastError = err;
          // 다음 우선순위 백업 모델로 재작동 시도
          continue;
        }
      }

      if (!response || !response.text) {
        throw lastError || new Error("Gemini AI API가 응답을 반환할 수 없습니다.");
      }

      const responseText = response.text;
      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error("Gemini server-side error:", error);
      
      // Attempt to parse any JSON from Gemini inside text if the raw parse failed
      try {
        if (error instanceof SyntaxError && error.message.includes("JSON")) {
          return res.status(500).json({
            error: "데이터 포맷 변환 실패",
            details: "서비스 분석 결과는 원활하게 반환되었으나 JSON 포맷 해석에 일시적인 장애가 발생했습니다. 다시 시도해 주십시오."
          });
        }
      } catch (innerErr) {}

      res.status(500).json({
        error: error.message || "서버 분석 중 오류가 발생했습니다.",
        details: error.stack || String(error)
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

