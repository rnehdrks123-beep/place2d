export interface DiagnosisResult {
  visitDiag: string;
  visitImprove: string;
  aiReply: string;
  blogDiag: string;
  blogImprove: string;
  profitPredict: string;
  conclusion: string;
  isSimulated?: boolean; // 로컬 시뮬레이션 결과인지 여부 표시
  isDirectApi?: boolean;  // 사용자 API 키 직접 호출 결과인지 여부
}

// 업종별 맞춤형 추천 답글 생성기
function generateLocalReplies(placeName: string, category: string): string {
  const cat = category.toLowerCase();
  
  if (cat.includes("고기") || cat.includes("육류") || cat.includes("한우") || cat.includes("삼겹살") || cat.includes("갈비")) {
    return `
      <strong>[답글 안 1 - 맛과 정성 강조형]</strong><br/>
      "안녕하세요, <span class="text-emerald-600 font-bold">${placeName}</span> 사장입니다! 소중한 첫 발걸음에 정성스러운 리뷰까지 남겨주셔서 깊이 감사드립니다. 저희는 매일 엄선한 최고급 육류만을 고집하여 사장님과 가족분들이 안심하고 가장 맛있는 상태로 즐기실 수 있도록 온 힘을 다하고 있습니다. 만족스럽게 드셨다니 고생한 보람이 느껴져 큰 보람을 느낍니다. 다음 방문 시에는 더 완벽한 그릴링과 친절로 정성을 다해 모시겠습니다. 늘 건강하시고 행복 가득하시길 바랍니다!"
      <br/><br/><br/>
      <strong>[답글 안 2 - 재방문 유도 및 감성 교감형]</strong><br/>
      "방문해주셔서 진심으로 감사드립니다, 고객님! <span class="text-emerald-600 font-bold">${placeName}</span>에서의 시간이 따뜻하고 맛있는 기억으로 남으셨다니 정말 기쁩니다. 저희 매장은 고기 한 점에도 진심을 담아 대접하고자 하는 철학을 가지고 있습니다. 항상 이 초심을 잃지 않고 언제 오시더라도 늘 한결같은 맛과 따뜻한 정을 느끼실 수 있도록 세심하게 준비하고 있겠습니다. 조만간 다시 뵙기를 설레는 마음으로 기다리겠습니다. 감사합니다!"
    `.trim();
  } else if (cat.includes("카페") || cat.includes("커피") || cat.includes("디저트") || cat.includes("베이커리")) {
    return `
      <strong>[답글 안 1 - 바리스타의 진심 전달형]</strong><br/>
      "안녕하세요, 고객님! <span class="text-emerald-600 font-bold">${placeName}</span>입니다. 귀한 시간 내어 방문해주시고 정성 가득한 리뷰를 남겨주셔서 정말 감사드립니다. 저희는 생두 엄선부터 원두 로스팅, 정밀한 브루잉까지 커피 한 잔에 특별한 가치를 담고자 끊임없이 연구하고 있습니다. 디저트와 음료가 입맛에 잘 맞으셨다니 바리스타로서 더없이 기쁘고 보람찬 하루입니다. 지친 일상 속에서 저희 공간이 따뜻한 쉼표가 되셨기를 바라며, 항상 정성스러운 한 잔으로 보답하겠습니다."
      <br/><br/><br/>
      <strong>[답글 안 2 - 공간의 감성과 따뜻함 강조형]</strong><br/>
      "소중한 발걸음 해주셔서 진심으로 감사드립니다! <span class="text-emerald-600 font-bold">${placeName}</span>에서 보낸 시간이 행복하고 편안한 기억으로 남으셨길 바랍니다. 매일 아침 구워내는 신선한 베이커리와 향긋한 커피 향으로 고객님들의 소중한 일상을 채워드릴 수 있어 언제나 기쁜 마음입니다. 앞으로도 머무시는 동안 기분 좋은 에너지를 얻어가실 수 있도록 공간 위생부터 서비스까지 꼼꼼히 살피겠습니다. 늘 향기로운 하루 보내세요!"
    `.trim();
  } else if (cat.includes("미용") || cat.includes("헤어") || cat.includes("네일") || cat.includes("뷰티") || cat.includes("살롱")) {
    return `
      <strong>[답글 안 1 - 디자인 만족도 및 스타일 케어형]</strong><br/>
      "안녕하세요! <span class="text-emerald-600 font-bold">${placeName}</span> 대표 원장입니다. 소중한 스타일 변신을 저희에게 믿고 맡겨주시고, 마음에 쏙 드신다는 따뜻한 말씀까지 전해주셔서 가슴 깊이 감사드립니다. 고객님의 고유한 두상과 모질, 이미지에 맞춰 가장 빛나는 시그니처 스타일을 선물해 드리고 싶었는데, 그 진심이 통한 것 같아 디자이너로서 정말 뿌듯합니다. 알려드린 홈케어 팁을 활용하시면 한층 더 오랫동안 예쁜 스타일 유지가 가능합니다. 다음 스타일 체인지 때 더 발전된 기술로 맞이하겠습니다!"
      <br/><br/><br/>
      <strong>[답글 안 2 - 세심한 밀착 케어 및 신뢰 구축형]</strong><br/>
      "소중한 리뷰 진심으로 감사드립니다, 고객님! <span class="text-emerald-600 font-bold">${placeName}</span>에서의 시간이 편안하고 힐링되는 순간이셨기를 바랍니다. 저희는 시술 시 손상을 최소화하고 건강한 아름다움을 지속할 수 있도록 프리미엄 약제와 세련된 기술만을 엄선해 사용하고 있습니다. 늘 한결같이 친절하고 기분 좋은 공간이 되도록 전 직원이 정성을 아끼지 않겠습니다. 머릿결이나 스타일에 고민이 생기시면 언제든 편하게 문의해 주세요. 감사합니다!"
    `.trim();
  } else {
    return `
      <strong>[답글 안 1 - 환대와 장인정신 강조형]</strong><br/>
      "안녕하세요, 고객님! 저희 <span class="text-emerald-600 font-bold">${placeName}</span>을 찾아주시고 힘이 되는 소중한 평판을 남겨주셔서 머리 숙여 감사드립니다. 저희는 찾아주시는 모든 분들께 내 가족이 드신다는 마음으로 재료 선정부터 조리, 서비스 과정 하나하나에 정직함과 진심을 가득 담고 있습니다. 보내주신 아낌없는 성원에 힘입어 오늘보다 내일 더 발전하고 깊은 맛을 내는 매장이 되도록 부단히 노력하겠습니다. 다음 방문 시 더 편안하고 완성도 높은 서비스를 약속드립니다."
      <br/><br/><br/>
      <strong>[답글 안 2 - 세심한 피드백 반영 및 단골 관계 형성형]</strong><br/>
      "방문해주셔서 진심으로 감사드립니다! 고객님의 따뜻한 리뷰 한 줄이 고생하는 저희 직원 모두에게 가장 큰 에너지가 됩니다. <span class="text-emerald-600 font-bold">${placeName}</span>은 맛뿐만 아니라 매장의 청결도, 친절함까지 고객님들의 오감이 모두 즐거운 공간을 지향하고 있습니다. 늘 편안한 분위기 속에서 완벽한 시간을 만끽하실 수 있도록 보이지 않는 곳에서도 세심히 가꾸겠습니다. 행복한 날만 가득하시길 바라며 다음에도 기분 좋은 미소로 맞이하겠습니다!"
    `.trim();
  }
}

// 오프라인 / 정적 배포본 대응용 정밀 시뮬레이터 엔진
export function generateSimulatedDiagnosis(data: {
  placeName: string;
  category: string;
  visitReviews: number;
  blogReviews: number;
}): DiagnosisResult {
  const { placeName, category, visitReviews, blogReviews } = data;
  const displayCategory = category || "대표 메뉴 미정";

  // 1. 방문자 리뷰 진단 계산
  let visitDiag = "";
  let visitImprove = "";
  if (visitReviews === 0) {
    visitDiag = `현재 등록된 방문자 리뷰가 <span class="text-rose-600 font-bold">0개</span>인 상태입니다. 이는 네이버 플레이스 알고리즘 상 <span class="text-rose-600 font-bold">비활성 신규 점포</span>로 분류되어 스마트플레이스 검색 엔진 노출 가중치를 전혀 받지 못하는 최상위 위기 경보 단계입니다. 잠재 고객이 검색하더라도 신뢰도 결여로 이탈율이 99%에 달합니다.`;
    visitImprove = `첫 방문자 리뷰 10개를 신속히 확보하고 사장님의 세심한 환대 답글을 즉시 작성해야 합니다. 답글 매치율 100% 달성 시, 네이버 AI 로봇이 <span class="text-emerald-600 font-bold">소통 활성화 매장</span>으로 분류하여 플레이스 노출 지수를 기본 가중치 대비 최소 150% 이상 즉각적으로 상향하게 됩니다.`;
  } else if (visitReviews <= 30) {
    visitDiag = `현재 등록된 방문자 리뷰는 <span class="text-rose-600 font-bold">${visitReviews}개</span>로 로컬 상권 평균 대비 절대적으로 부족한 초기 진입 상태입니다. 최근 플레이스 로직은 리뷰의 '누적 개수' 뿐 아니라 '최신 등록 주기(최신성)'와 '리뷰당 답글 반영 비율'에 압도적인 가중치를 부여합니다. 미비한 소통으로 인해 경쟁 매장 대비 검색 결과 하단에 고착되어 있습니다.`;
    visitImprove = `일주일에 최소 3~5개의 정성스러운 신규 방문자 리뷰 유기적 유치와 함께 사장님의 감동 답글을 적용하십시오. 사장님이 직접 쓴 고유한 답글은 로컬 검색 봇이 텍스트 정보를 수집해 가중치에 적극 반영하므로, 세부 핵심 키워드를 답글에 녹여 작성하는 것만으로 상위 노출 기회를 2.5배 높입니다.`;
  } else if (visitReviews <= 150) {
    visitDiag = `현재 등록된 방문자 리뷰는 <span class="text-emerald-600 font-bold">${visitReviews}개</span>로 기본적인 상권 내 인지도는 확보된 견고한 상태입니다. 그러나 리뷰 갱신 주기가 일정하지 않고, 누적 속도가 정체되어 있어 최근 활성화 점수가 상대적으로 감점되고 있습니다. 또한 답글 관리가 누락되었거나 일방적인 매크로 답변일 경우 고객 이탈 저항선이 쉽게 무너질 수 있습니다.`;
    visitImprove = `단골 고객 대상의 가중치 높은 영수증 인증 리뷰를 일평균 1~2개 수준으로 꾸준히 유도하시고, 리뷰 하나하나에 고객의 특징이나 당일 에피소드를 녹여 차별화된 맞춤 답글을 게시하십시오. 이는 신규 유입 고객에게 폭발적인 평판 신뢰도를 주는 최고의 무기가 되며 체류 시간을 획기적으로 향상시킵니다.`;
  } else {
    visitDiag = `현재 등록된 방문자 리뷰가 <span class="text-emerald-600 font-bold">${visitReviews}개</span>로 상위권 매장의 안정적인 신뢰 기준을 충족하고 계십니다. 다만 리뷰의 양이 많아짐에 따라 부정 리뷰나 불만 리뷰가 등록되었을 때의 방어 평판 전략과, 지속적인 상위 랭크를 유지하기 위한 플레이스 점수 최적화 소통 관리(답글의 밀도 및 고유 키워드 적용)가 누락된 상황이 가장 큰 잠재 리스크입니다.`;
    visitImprove = `누적된 고해상도 리뷰 평판의 가치를 극대화하기 위해, 리뷰 답글에 전략적인 업종 핵심 타깃 키워드(예: ${displayCategory})를 적극 배치하여 스마트플레이스 로직 연관도 점수를 획기적으로 향상시키십시오. 이는 1페이지 최상단 고정을 장기화하는 핵심 유지 비결입니다.`;
  }

  // 2. 블로그 리뷰 진단 계산
  let blogDiag = "";
  let blogImprove = "";
  if (blogReviews === 0) {
    blogDiag = `현재 블로그 리뷰가 <span class="text-rose-600 font-bold">0개</span>로 웹상에서 매장의 입소문(바이럴) 콘텐츠가 전무한 완벽한 고립 상태입니다. 잠재 고객이 플레이스에서 상호를 클릭한 후 추가 탐색을 위해 검색할 때, 신뢰할 만한 방문 정보가 없어 신뢰 결여로 최종 예약 및 방문을 주저하고 다른 매장으로 발길을 돌리게 되는 핵심 유출 지점입니다.`;
    blogImprove = `우선적으로 진성 블로거 및 체험단을 활용해 15장 이상의 고해상도 이미지와 1,000자 이상의 상세 글이 담긴 로컬 리뷰 5개를 신속 배포하십시오. 네이버는 블로그 콘텐츠 유입 속도와 검색 체류 시간을 종합 점수화하여 플레이스 검색 정확도 순위를 대폭 끌어올립니다.`;
  } else if (blogReviews <= 15) {
    blogDiag = `현재 블로그 리뷰는 <span class="text-rose-600 font-bold">${blogReviews}개</span>로 기초적인 정보 검색만 지원되는 아쉬운 단계입니다. 네이버 스마트플레이스 순위 알고리즘의 35% 이상은 '외부 바이럴 인지도 및 신뢰 연계 신호'에서 창출됩니다. 블로그 콘텐츠의 양과 최신 주기가 약해, 검색 노출 점유율이 경쟁 매장 대비 20% 미만으로 크게 밀려 있습니다.`;
    blogImprove = `핵심 타깃 키워드로 상위 노출을 노릴 수 있는 준최적화 블로거 마케팅 패키지를 정기 가동하십시오. 잘 작성된 리뷰 1개가 수십 명의 신규 고객을 견인하며, 지속적인 블로그 글 누적은 매장 신뢰도를 강화하고 브랜드 검색량 자체를 증폭시키는 연쇄 시너지를 제공합니다.`;
  } else if (blogReviews <= 80) {
    blogDiag = `현재 블로그 리뷰는 <span class="text-emerald-600 font-bold">${blogReviews}개</span>로 우수한 평판 신호를 발신하고 있습니다. 하지만 메인 키워드(지역명 + 업종) 검색 시 뷰(VIEW) 탭이나 블로그 영역 상단에 노출되는 고퀄리티 핵심 포스팅 비율이 정체되어 있으며, 인플루언서 점유율이 다소 낮아 실제 대량의 트래픽을 몰고 오기에는 전환 효율이 분산되어 있습니다.`;
    blogImprove = `이제는 양적인 확보를 넘어 특정 고효율 메인 키워드 장악 및 타겟팅 노출에 중심을 두어야 합니다. 진성 인플루언서 및 고화질 체험단을 통해 세부 키워드 다각화(예: 분위기 좋은 곳, 단체 모임 전문 등)를 설계하면 네이버 로봇이 고품질 로컬 정보 매장으로 판정하여 상위 노출 앵커링을 확정합니다.`;
  } else {
    blogDiag = `현재 블로그 리뷰가 <span class="text-emerald-600 font-bold">${blogReviews}개</span>로 지역 내 손꼽히는 인지도와 굳건한 평판 신뢰도를 다져오셨습니다. 하지만 오래된 포스팅의 노출 수명이 다해가고 있으며, 새로운 바이럴 트렌드나 매주 변경되는 네이버의 검색 로직 변화에 맞춘 세련된 고품질 신규 배포 공급망이 뒷받침되지 않을 경우, 유입률이 점진적으로 하락할 위험이 있습니다.`;
    blogImprove = `고정 단골 확보와 동시에, 유입 가치가 매우 높은 강력한 메인 황금 키워드들을 완벽히 독점 및 지속 롤링해야 합니다. 월간 단위의 정교한 키워드 선점형 기자단/체험단을 정기 배치하여 지역 독점 1위 브랜드 이미지를 철옹성처럼 방어할 수 있습니다.`;
  }

  // 3. 예상 매출 성장 범위 예측 계산
  const totalReviews = visitReviews + blogReviews;
  let profitPredict = "";
  if (totalReviews === 0) {
    profitPredict = "45% ~ 85%";
  } else if (totalReviews <= 20) {
    profitPredict = "35% ~ 65%";
  } else if (totalReviews <= 100) {
    profitPredict = "25% ~ 45%";
  } else {
    profitPredict = "15% ~ 30%";
  }

  // 4. AI 답글 2종 생성
  const aiReply = generateLocalReplies(placeName, category);

  // 5. 결론 문장
  const conclusion = `저희 Dy Month의 12가지 전방위 통합 마케팅 패키지는 <span class="text-emerald-600 font-bold">${placeName}</span>의 잠재력을 온전히 깨우고, <br class="hidden md:block"/> 상권 내 압도적인 네이버 로컬 상위 노출 및 평판 경쟁력을 확보하기 위한 가장 확실하고 신속한 성공 전략입니다!`;

  return {
    visitDiag,
    visitImprove,
    aiReply,
    blogDiag,
    blogImprove,
    profitPredict,
    conclusion,
    isSimulated: true
  };
}

// 브라우저에서 직접 CORS 없이 구글 API 호출하기 (REST방식)
async function generateDirectDiagnosis(
  apiKey: string,
  data: {
    placeName: string;
    category: string;
    visitReviews: number;
    blogReviews: number;
  }
): Promise<DiagnosisResult> {
  const { placeName, category, visitReviews, blogReviews } = data;
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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          visitDiag: { type: "STRING" },
          visitImprove: { type: "STRING" },
          aiReply: { type: "STRING" },
          blogDiag: { type: "STRING" },
          blogImprove: { type: "STRING" },
          profitPredict: { type: "STRING" },
          conclusion: { type: "STRING" }
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
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini 직접 호출 에러: ${errorText}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini에서 유효한 텍스트 응답을 받지 못했습니다.");
  }

  const result: DiagnosisResult = JSON.parse(text.trim());
  return {
    ...result,
    isDirectApi: true
  };
}

export async function generateDiagnosis(data: {
  placeName: string;
  category: string;
  visitReviews: number;
  blogReviews: number;
}): Promise<DiagnosisResult> {
  
  // 1. 유저가 직접 입력해 저장해둔 개인용 API Key가 있을 경우 브라우저 직접 호출 실행 (우선순위 1)
  const userStoredApiKey = localStorage.getItem("USER_GEMINI_API_KEY");
  if (userStoredApiKey && userStoredApiKey.trim().length > 10) {
    try {
      console.log("🔑 [Gemini] 사용자 직접 설정 API Key로 분석을 개시합니다.");
      return await generateDirectDiagnosis(userStoredApiKey.trim(), data);
    } catch (directErr: any) {
      console.warn("⚠️ [Gemini] 사용자 API 키로 호출에 실패했습니다. 로컬 시뮬레이션으로 대체 작동합니다.", directErr);
      return generateSimulatedDiagnosis(data);
    }
  }

  // 2. 서버 사이드 API 호출 시도 (우선순위 2)
  try {
    const response = await fetch("/api/diagnosis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch(() => {
      throw new Error("SERVER_OFFLINE");
    });

    if (!response || !response.ok) {
      console.warn("⚠️ API server offline or return error. Fallback to Local Smart Diagnosis Engine.");
      return generateSimulatedDiagnosis(data);
    }

    return await response.json();
  } catch (err) {
    console.warn("⚠️ Client-side error or offline. Switch to Smart Diagnosis Simulator.", err);
    // Vercel, Netlify, GitHub Pages 등 서버리스 정적 배포 상태에서 100% 에러 없이 정상 작동하도록 정교한 진단 시뮬레이터를 즉각 제공합니다.
    return generateSimulatedDiagnosis(data);
  }
}
