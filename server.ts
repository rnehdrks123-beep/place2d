import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize server-side Gemini client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
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

      const prompt = `
        너는 대한민국 최고의 소상공인 마케팅 전략가야.
        아래 데이터를 바탕으로 사장님께 드리는 '리뷰 평판 진단 리포트'를 작성해.
        모든 문장은 핵심만 간결하게 한두 문단으로 작성해.
        HTML 태그(span, br 등)를 사용하여 중요 수치를 강조해줘.

        [입력 데이터]
        - 매장명: ${placeName} (${category})
        - 방문자 리뷰: ${visitReviews}개
        - 블로그 리뷰: ${blogReviews}개

        주의 사항: 
        - 방문자 리뷰 수를 언급할 때는 반드시 <span class="text-rose-600 font-bold">${visitReviews}개</span> 로 작성해라.
        - 블로그 리뷰 수를 언급할 때는 반드시 <span class="text-rose-600 font-bold">${blogReviews}개</span> 로 작성해라.
        - 매장명(${placeName}) 부분은 <span class="text-rose-600 font-bold">${placeName}</span> 로 처리해라.

        ###VISIT_DIAG###
        방문자 리뷰 수에 대한 객관적 진단과 문제점. 

        ###VISIT_IMPROVE###
        방문자 리뷰에 꾸준히 답글을 달았을 때 얻을 수 있는 개선점 및 기대효과.

        ###AI_REPLY###
        사장님이 실제 사용할 수 있는 방문자 리뷰 답글 예시 2개. 1번 예시와 2번 예시 사이에 <br/><br/><br/>를 넣어라.

        ###BLOG_DIAG###
        블로그 리뷰 데이터의 문제점 분석.

        ###BLOG_IMPROVE###
        블로그 리뷰 수가 증가하고 퀄리티가 높아졌을 때 얻을 수 있는 개선점 및 기대효과.

        ###PROFIT_PREDICT###
        Dy Month의 12가지 마케팅 솔루션 적용 시 3개월 후 예상 매출 상승 범위를 "OO% ~ OO%" 형태의 퍼센트 수치만 출력해. (다른 설명 절대 금지)

        ###CONCLUSION###
        본 마케팅 패키지는 ${placeName}의 낮은 온라인 인지도를 극복하고 <br/> 압도적인 경쟁력을 확보하기 위한 필수적인 성공 전략입니다.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const responseText = response.text || "";

      const cut = (tag: string, nextTag?: string) => {
        try {
          const parts = responseText.split(tag);
          if (parts.length < 2) return "데이터 생성 중...";
          const content = parts[1];
          return nextTag ? content.split(nextTag)[0].trim() : content.trim();
        } catch {
          return "분석 중...";
        }
      };

      res.json({
        visitDiag: cut("###VISIT_DIAG###", "###VISIT_IMPROVE###"),
        visitImprove: cut("###VISIT_IMPROVE###", "###AI_REPLY###"),
        aiReply: cut("###AI_REPLY###", "###BLOG_DIAG###"),
        blogDiag: cut("###BLOG_DIAG###", "###BLOG_IMPROVE###"),
        blogImprove: cut("###BLOG_IMPROVE###", "###PROFIT_PREDICT###"),
        profitPredict: cut("###PROFIT_PREDICT###", "###CONCLUSION###"),
        conclusion: cut("###CONCLUSION###"),
      });
    } catch (error: any) {
      console.error("Gemini server-side error:", error);
      res.status(500).json({ error: error.message || "서버 분석 오류가 발생했습니다." });
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
