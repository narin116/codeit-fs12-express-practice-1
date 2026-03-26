/**
 * =============================================
 * Step 5: POST 요청 처리하기
 * =============================================
 *
 * POST 요청으로 새 데이터를 생성하는 방법을 배웁니다.
 *
 * 핵심:
 * - express.json() 미들웨어 → req.body 사용 가능
 * - req.body에서 전송된 데이터를 꺼냄
 * - 검증 후 배열에 push
 * - 201 Created 상태 코드로 응답
 *
 * 실행 방법: node steps/step5-post.js
 *
 * 테스트 (터미널에서):
 *   curl -X POST http://localhost:8080/api/subscriptions \
 *     -H "Content-Type: application/json" \
 *     -d '{"service":"Disney+","price":9900,"cycle":"monthly","startDate":"2024-03-01"}'
 */

import express from "express";

const app = express();
const PORT = 8080;

// ─────────────────────────────────────────────
// TODO 1: JSON 파싱 미들웨어 등록
// ─────────────────────────────────────────────
// 이게 없으면 req.body가 undefined입니다!
// 힌트: app.use(express.???());
app.use(express.json());

// 임시 데이터 (let으로 선언 - push로 추가할 것이므로)
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

// ─────────────────────────────────────────────
// TODO 2: 검증 함수 만들기
// ─────────────────────────────────────────────
// validateSubscription(data) → 에러 메시지 배열을 반환
//
// 검증 항목:
// - service가 없으면 → '서비스 이름은 필수입니다'
// - price가 없으면 → '가격은 필수입니다'
// - price가 숫자가 아니거나 0 이하면 → '가격은 양수여야 합니다'
// - cycle이 ['daily','weekly','monthly','yearly'] 중 하나가 아니면 → '올바른 구독 주기가 아닙니다'
// - startDate가 없으면 → '시작일은 필수입니다'
//
// 사용 예: const errors = validateSubscription(req.body);

function validateSubscription(data) {
  //프론트에서 추가하고자 보낸 객체를 받음. data에 body가 전달됨.
  const errors = [];

  // 여기에 검증 로직을 작성하세요
  if (!data.service) errors.push("서비스 이름은 필수입니다");
  if (!data.price) errors.push("가격은 필수입니다");
  else if (isNaN(data.price) || data.price < 0)
    errors.push("가격은 양수여야 합니다");
  if (
    !["daily", "weekly", "monthly", "yearly"].some(
      //!이 연산자 우선순위상 가장 마지막에 실행됨! 그래서 의도한대로 잘 실행됨.
      (cycle) => cycle === data.cycle,
    )
  )
    errors.push("올바른 구독 주기가 아닙니다");
  if (!data.startDate) errors.push("시작일은 필수입니다");

  return errors;
}

// ─────────────────────────────────────────────
// TODO 3: POST 라우트 만들기
// ─────────────────────────────────────────────
// POST /api/subscriptions
//
// 순서:
// 1) req.body에서 service, price, cycle, startDate를 꺼내세요
// 2) validateSubscription()으로 검증하세요
//    - 에러가 있으면 → 400 + { success: false, errors }
// 3) 중복 검사: 같은 service 이름이 이미 있는지 확인
//    - 중복이면 → 409 + { success: false, message: '이미 존재하는 구독입니다' }
// 4) 새 ID 생성: Math.max(...subscriptions.map(s => s.id)) + 1
// 5) 새 객체를 만들어서 subscriptions에 push
// 6) 201 상태코드 + { success: true, data: 새로만든객체 }
app.post("/api/subscriptions", (req, res) => {
  const { service, price, cycle, startDate } = req.body;
  const errors = validateSubscription(req.body);
  if (errors.length > 0)
    return res.status(400).json({ success: false, errors });
  if (subscriptions.some((sub) => sub.service === service))
    return res
      .status(409)
      .json({ success: false, message: "이미 존재하는 구독입니다" });
  //새 ID 생성
  const newId = Math.max(...subscriptions.map((s) => s.id)) + 1; //Math.max : 인수로 전달된 숫자들 중, 가장 큰 숫자를 반환하는 메서드. (여기에선 가장 큰 id값을 반환하게 된다.)
  const newSubscription = {
    id: newId,
    service,
    price,
    cycle,
    startDate,
  };
  subscriptions.push(newSubscription);
  return res.status(201).json(newSubscription);
});

// ─────────────────────────────────────────────
// 서버 시작
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
