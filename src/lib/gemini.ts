export interface DiagnosisResult {
  visitDiag: string;
  visitImprove: string;
  aiReply: string;
  blogDiag: string;
  blogImprove: string;
  profitPredict: string;
  conclusion: string;
}

export async function generateDiagnosis(data: {
  placeName: string;
  category: string;
  visitReviews: number;
  blogReviews: number;
}): Promise<DiagnosisResult> {
  const response = await fetch("/api/diagnosis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "서버 분석 중 오류가 발생했습니다.");
  }

  return await response.json();
}
