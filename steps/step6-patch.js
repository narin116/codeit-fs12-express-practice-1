/**
 * =============================================
 * Step 6: PATCH 요청 처리하기
 * =============================================
 *
 * PATCH 요청으로 데이터를 부분 수정하는 방법을 배웁니다.
 *
 * PUT vs PATCH:
 *   PUT   → 전체 교체 (모든 필드 필요)
 *   PATCH → 일부 수정 (변경할 필드만 전송) ★ 실무에서 더 많이 사용
 *
 * 실행 방법: node steps/step6-patch.js
 *
 * 테스트 (터미널에서):
 *   curl -X PATCH http://localhost:8080/api/subscriptions/1 \
 *     -H "Content-Type: application/json" \
 *     -d '{"price": 12900}'
 */

import express from "express";

const app = express();
const PORT = 8080;

app.use(express.json());

// 임시 데이터
let subscriptions = [
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

// 목록 조회 (완성됨)
app.get("/api/subscriptions", (req, res) => {
  res.json({ success: true, count: subscriptions.length, data: subscriptions });
});

// 단일 조회 (완성됨)
app.get("/api/subscriptions/:id", (req, res) => {
  const id = Number(req.params.id);
  const subscription = subscriptions.find((sub) => sub.id === id);

  if (!subscription) {
    return res
      .status(404)
      .json({ success: false, message: "구독을 찾을 수 없습니다" });
  }
  res.json({ success: true, data: subscription });
});

// ─────────────────────────────────────────────
// TODO: PATCH 라우트 만들기
// ─────────────────────────────────────────────
// PATCH /api/subscriptions/:id
//
// 순서:
// 1) req.params.id → Number로 변환
// 2) req.body → updates 변수에 저장
//
// 3) 빈 요청 확인
//    - Object.keys(updates).length === 0 이면
//    → 400 + { success: false, message: '수정할 내용이 없습니다' }
//
// 4) 수정 가능한 필드 제한
//    - 허용 필드: ['service', 'price', 'cycle', 'startDate']
//    - Object.keys(updates)에 허용되지 않은 필드가 있으면
//    → 400 + { success: false, message: '수정할 수 없는 필드입니다: ...' }
//
// 5) 부분 검증 (보낸 필드만 검증)
//    - price가 있으면 → 숫자인지, 양수인지 확인
//    - cycle이 있으면 → 유효한 값인지 확인
//
// 6) subscriptions.findIndex()로 해당 ID 찾기
//    - 없으면 → 404
//
// 7) 스프레드 연산자로 데이터 병합
//    subscriptions[index] = {
//      ...subscriptions[index],  ← 기존 데이터
//      ...updates,               ← 새 데이터로 덮어쓰기
//      id,                       ← ID는 변경 불가
//      updatedAt: new Date().toISOString()
//    }
//
// 8) 응답: { success: true, message: '구독이 수정되었습니다', data: 수정된데이터 }
app.patch("/api/subscriptions/:id", (req, res) => {
  //1,2) id, body 꺼내오기
  const id = Number(req.params.id);
  const updates = req.body;

  //3)빈 배열인지 검사하기
  if (Object.keys(updates).length === 0)
    return res.status(400).json({
      success: false,
      message: "수정할 내용이 없습니다",
    });

  //4) 수정이 가능한 필드들인지 검사 (허용되지 않은 필드가 있으면 patch 불가)
  //허용되지 않은 필드 검사
  //허용되지 않은 필드가 있다면, 걔네만 모아서 배열을 만들고, 이걸로 오류메세지를 출력
  const allowFields = ["service", "price", "cycle", "startDate"];
  const notAllowFields = Object.keys(updates).filter(
    (field) => !allowFields.includes(field),
  );
  if (notAllowFields.length > 0)
    return res.status(400).json({
      success: false,
      message: `수정할 수 없는 필드입니다: ${notAllowFields}`,
    });

  //5) 부분 검증
  if (updates.price) {
    if (isNaN(Number(updates.price)))
      return res
        .status(400)
        .json({ success: false, message: "price는 숫자여야 합니다" });
    if (Number(updates.price) <= 0)
      return res
        .status(400)
        .json({ success: false, message: "price는 양수여야 합니다" });
  }
  const cycles = ["daily", "weekly", "monthly", "yearly"];
  if (updates.cycle) {
    if (!cycles.some((c) => c === updates.cycle))
      return res.status(400).json({
        success: false,
        message:
          'cycle은 "daily", "weekly", "monthly", "yearly" 중 하나여야 합니다',
      });
  }

  //6) 해당하는 id 찾기
  const targetIndex = subscriptions.findIndex((sub) => sub.id === id); //여기서 id는 updates 내 id가 아님!! 거기엔 id가 없을 수도 있음..
  if (targetIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "존재하지 않는 id입니다" });
  }

  //7) 기존 데이터 + 신규 데이터
  subscriptions[targetIndex] = {
    ...subscriptions[targetIndex],
    ...updates,
    id, //params로 받아온 id값이 들어감!!!
    updatedAt: new Date().toISOString(),
  };

  //8) 응답
  return res.json({
    success: true,
    message: "구독이 수정되었습니다",
    data: subscriptions[targetIndex],
  });
});

// ─────────────────────────────────────────────
// 서버 시작
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
