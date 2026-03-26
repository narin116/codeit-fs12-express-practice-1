/**
 * =============================================
 * Step 1: Express 기초와 첫 라우트
 * =============================================
 *
 * 실행 방법: node steps/step1-basics.js
 * 테스트: 브라우저에서 http://localhost:8080 접속
 *
 * TODO를 찾아서 코드를 완성하세요!
 */

import express from "express";

// TODO 1: Express 앱을 생성하세요
const app = express(); //app 객체 생성 (백엔드 라우팅 작업을 위해 필요)
const PORT = 8080; //백엔드 PORT 값 설정

// ─────────────────────────────────────────────
// TODO 2: 기본 라우트 만들기
// ─────────────────────────────────────────────
// GET / 요청이 오면 'Hello Express!'를 응답하세요
// 힌트: app.get(경로, (req, res) => { ... })
app.get("/", function (req, res) {
  res.send("Hello Express!");
});

// ─────────────────────────────────────────────
// TODO 3: 여러 라우트 만들기
// ─────────────────────────────────────────────
// GET /users  → '사용자 목록' 응답
// GET /products → '상품 목록' 응답
// GET /about → 'About 페이지' 응답
app.get("/users", (req, res) => {
  res.send("사용자 목록");
});
app.get("/products", (req, res) => {
  res.send("상품 목록");
});
app.get("/about", (req, res) => {
  res.send("About 페이지");
});

// ─────────────────────────────────────────────
// TODO 4: JSON 응답 보내기
// ─────────────────────────────────────────────
// GET /api/users 요청이 오면 아래 데이터를 JSON으로 응답하세요
// 힌트: res.json()을 사용합니다
//
// 데이터:
// [
//   { id: 1, name: 'Alice' },
//   { id: 2, name: 'Bob' }
// ]
app.get("/api/users", (req, res) => {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  res.json(users);
});

// ─────────────────────────────────────────────
// TODO 5: 상태 코드와 함께 응답하기
// ─────────────────────────────────────────────
// 힌트: res.status(코드).json({ ... })
//
// GET /success → 200 상태코드 + { message: 'Success' }
// GET /error   → 404 상태코드 + { message: 'Not Found' }
app.get("/success", (req, res) => {
  res.status(200).json({ message: "Success" });
});
app.get("/error", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// ─────────────────────────────────────────────
// TODO 6: 서버 시작하기
// ─────────────────────────────────────────────
// 힌트: app.listen(포트, 콜백함수)
// 콜백에서 console.log로 서버 시작 메시지를 출력하세요
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
