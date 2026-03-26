/**
 * =============================================
 * Step 4: URL 파라미터 처리하기
 * =============================================
 *
 * 동적 URL로 특정 데이터를 조회하는 방법을 배웁니다.
 *
 * 쿼리스트링 vs URL 파라미터:
 *   쿼리스트링:   /api/subscriptions?id=1  → 필터링, 옵션 (선택값)
 *   URL 파라미터: /api/subscriptions/1     → 리소스 식별 (필수값)
 *
 * :id → req.params.id 로 접근 (항상 문자열!)
 *
 * 실행 방법: node steps/step4-params.js
 */

import express from "express";

const app = express();
const PORT = 8080;

// 임시 데이터
const subscriptions = [
  {
    id: 1,
    service: "Netflix",
    price: 9900,
    cycle: "monthly",
    startDate: "2024-01-01",
  },
  {
    id: 2,
    service: "YouTube Premium",
    price: 14900,
    cycle: "monthly",
    startDate: "2024-01-15",
  },
  {
    id: 3,
    service: "Spotify",
    price: 10900,
    cycle: "monthly",
    startDate: "2024-02-01",
  },
];

// 전체 목록 조회 (이건 완성되어 있습니다)
app.get("/api/subscriptions", (req, res) => {
  res.json({
    success: true,
    count: subscriptions.length,
    data: subscriptions,
  });
});

// ─────────────────────────────────────────────
// TODO 1: 특정 구독 조회
// ─────────────────────────────────────────────
// GET /api/subscriptions/:id
//
// 1) req.params.id를 가져오세요 (문자열입니다!)
// 2) isNaN()으로 숫자인지 검증하세요
//    - 숫자가 아니면 → 400 + { success: false, message: 'ID는 숫자여야 합니다' }
// 3) Number()로 변환 후 양수인지 검증하세요
//    - 0 이하면 → 400 + { success: false, message: 'ID는 양수여야 합니다' }
// 4) subscriptions.find()로 해당 ID의 구독을 찾으세요
//    - 없으면 → 404 + { success: false, message: '구독을 찾을 수 없습니다' }
//    - 있으면 → { success: true, data: subscription }
//
// 테스트:
//   http://localhost:8080/api/subscriptions/1    → Netflix
//   http://localhost:8080/api/subscriptions/999  → 404
//   http://localhost:8080/api/subscriptions/abc  → 400
//   http://localhost:8080/api/subscriptions/-1   → 400
app.get("/api/subscriptions/:id", (req, res) => {
  const id = Number(req.params.id);
  //id가 NaN이 아닌지 검사
  if (isNaN(id)) {
    //isNaN : NaN이면 true, 아니면 false
    return res
      .status(400)
      .json({ success: false, message: "ID는 숫자여야 합니다" });
  }
  //id가 양수인지 검사
  if (id < 0) {
    return res
      .status(400)
      .json({ success: false, message: "ID는 양수여야 합니다" });
  }
  //해당 id의 구독정보 가져오기
  const subscription = subscriptions.find((sub) => sub.id === id); //id는 단 1개니까 find로 찾아도 괜찮다.(인듯)
  if (subscription) {
    return res.json({ success: true, data: subscription });
  } else {
    return res
      .status(404)
      .json({ success: false, message: "구독을 찾을 수 없습니다" });
  }
});

// ─────────────────────────────────────────────
// TODO 2: 여러 URL 파라미터
// ─────────────────────────────────────────────
// GET /api/users/:userId/subscriptions/:subId
//
// req.params에서 userId, subId를 꺼내서 응답하세요:
// {
//   userId: Number(userId),
//   subscriptionId: Number(subId),
//   message: '유저 ??의 구독 ??번 조회'
// }
//
// 테스트: http://localhost:8080/api/users/10/subscriptions/5

app.get("/api/users/:userId/subscriptions/:subId", (req, res) => {
  const { userId, subId } = req.params;
  return res.json({
    userId: Number(userId),
    subscriptionId: Number(subId),
    message: `유저 ${userId}의 구독 ${subId} 조회`,
  });
});

// ─────────────────────────────────────────────
// 서버 시작
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
