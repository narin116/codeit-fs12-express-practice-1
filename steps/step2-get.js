/**
 * =============================================
 * Step 2: GET 요청 처리하기
 * =============================================
 *
 * GET 요청으로 데이터를 조회하는 방법을 배웁니다.
 *
 * 실행 방법: node steps/step2-get.js
 * 테스트: http://localhost:8080/api/subscriptions
 */

import express from "express";

const app = express();
const PORT = 8080;

// ─────────────────────────────────────────────
// 임시 데이터 (메모리 DB 역할)
// ─────────────────────────────────────────────
// 서버를 재시작하면 데이터가 초기화됩니다.

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

// ─────────────────────────────────────────────np
// TODO 1: 전체 목록 조회 (배열 그대로 반환)
// ─────────────────────────────────────────────
// GET /api/subscriptions → subscriptions 배열을 JSON으로 응답
app.get("/api/subscriptions", (req, res) => {
  res.json(subscriptions);
});

// ─────────────────────────────────────────────
// TODO 2: 전체 목록 조회 (메타 정보 포함) ★ 권장 방식
// ─────────────────────────────────────────────
// GET /api/subscriptions-v2 → 아래 형태로 응답하세요
//
// {
//   success: true,
//   count: 3,          ← 배열의 길이
//   data: [...]        ← subscriptions 배열
// }
app.get("/api/subscriptions-v2", (req, res) => {
  const count = subscriptions.length;
  res.json({
    success: true, //전송이 잘 됐으니까 이 배열이 보일테니, 항상 true. (맞지?)
    count,
    data: subscriptions,
  });
});

// ─────────────────────────────────────────────
// TODO 3: 에러 처리가 포함된 조회
// ─────────────────────────────────────────────
// GET /api/subscriptions-safe
//
// try-catch로 감싸세요:
// - subscriptions가 비어있으면 → 404 + { success: false, message: '구독 내역이 없습니다' }
// - 정상이면 → { success: true, data: subscriptions }
// - 에러 발생 시 → 500 + { success: false, message: '서버 오류가 발생했습니다' }
app.get("/api/subscriptions-safe", (req, res) => {
  try {
    if (subscriptions.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "구독 내역이 없습니다" });
    }
    return res.json({ success: true, data: subscriptions });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다" });
  }
});

// ─────────────────────────────────────────────
// 서버 시작
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
