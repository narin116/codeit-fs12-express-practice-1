/**
 * =============================================
 * Step 3: 쿼리스트링 처리하기
 * =============================================
 *
 * URL 쿼리 파라미터로 데이터를 필터링하는 방법을 배웁니다.
 *
 * 쿼리스트링 = URL의 ? 뒤에 오는 키-값 쌍
 * 예: /api/subscriptions?service=Netflix&minPrice=10000
 *
 * req.query 객체로 접근합니다.
 *
 * 실행 방법: node steps/step3-query.js
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
  {
    id: 4,
    service: "Adobe CC",
    price: 79000,
    cycle: "yearly",
    startDate: "2024-03-01",
  },
  {
    id: 5,
    service: "GitHub Pro",
    price: 4000,
    cycle: "monthly",
    startDate: "2024-03-15",
  },
  {
    id: 6,
    service: "ChatGPT Plus",
    price: 22000,
    cycle: "monthly",
    startDate: "2024-04-01",
  },
  {
    id: 7,
    service: "Disney+",
    price: 9900,
    cycle: "monthly",
    startDate: "2024-04-15",
  },
  {
    id: 8,
    service: "Microsoft 365",
    price: 89000,
    cycle: "yearly",
    startDate: "2024-05-01",
  },
];

// ─────────────────────────────────────────────
// TODO 1: 쿼리 파라미터 읽어보기
// ─────────────────────────────────────────────
// GET /api/debug-query
//
// req.query에서 service, cycle을 꺼내서 아래처럼 응답하세요
// { service: ???, cycle: ???, allParams: req.query }
//
// 테스트: http://localhost:8080/api/debug-query?service=Netflix&cycle=monthly
app.get("/api/debug-query", (req, res) => {
  const { service, cycle } = req.query;
  res.json({
    service,
    cycle,
    allParams: req.query,
  });
});

// ─────────────────────────────────────────────
// TODO 2: 서비스 이름으로 필터링
// ─────────────────────────────────────────────
// GET /api/subscriptions
//
// ?service=netflix 가 있으면 → 서비스 이름에 해당 문자열이 포함된 것만 반환
// 힌트: 대소문자 구분 없이 비교하려면 .toLowerCase() 사용
// 힌트: 부분 일치는 .includes() 사용
//
// 쿼리가 없으면 → 전체 목록 반환
//
// 테스트:
//   http://localhost:8080/api/subscriptions?service=netflix
//   http://localhost:8080/api/subscriptions?service=plus

app.get("/api/subscriptions", (req, res) => {
  const {
    service,
    cycle,
    minPrice,
    maxPrice,
    sort,
    order = "asc",
    page,
    limit,
  } = req.query;

  let results = [...subscriptions]; //원본 배열 손상 방지?

  // TODO 2a: service 필터링
  // service 값이 있으면 results를 필터링하세요
  // const serviceExist = subscriptions.some((s) => s.service === service); //이걸 의미하는게 아닌듯..
  if (service) {
    //쿼리가 있으면 results를 필터링하기
    results = results.filter((s) =>
      s.service.toLowerCase().includes(service.toLowerCase()),
    );
  }
  //아래처럼 하는 게 아닌듯..그냥 가만 냅두면 전체목록이니까.. 반환이 ㄹㅇ 반환하라는게 아니라, 다음 계산시에 원래 값을 보여주라는 뜻인듯.
  //else {
  //   //쿼리가 없으면 전체 목록을 반환. (얘가 필수 쿼리 인가봄)
  //   res.json(subscriptions); //반환이 진짜 이 반환이 맞나? ;;
  // }

  // TODO 2b: cycle 필터링 (정확히 일치)
  // 테스트: ?cycle=yearly
  //Cycle, minprice, maxprice도 선택적으로 넣을 수 있는 것들이니까, if로 존재하는지 체크하고 해주기..
  if (cycle) {
    results = results.filter((s) => s.cycle === cycle);
  }

  // TODO 2c: minPrice 필터링
  // 힌트: 쿼리 파라미터는 항상 문자열이므로 Number()로 변환 필요
  // 테스트: ?minPrice=10000
  if (minPrice) {
    results = results.filter((s) => s.price > Number(minPrice));
  }

  // TODO 2d: maxPrice 필터링
  // 테스트: ?minPrice=10000&maxPrice=20000
  if (maxPrice) {
    results = results.filter((s) => s.price < Number(maxPrice));
  }
  //여기까지 다 잘 작동!

  // ─────────────────────────────────────────
  // TODO 3: 정렬 기능
  // ─────────────────────────────────────────
  // ?sort=price&order=asc   → 가격 오름차순
  // ?sort=price&order=desc  → 가격 내림차순
  // ?sort=service           → 서비스 이름순
  //
  // 힌트: results.sort((a, b) => { ... })
  // 힌트: 문자열 비교 시 .toLowerCase() 사용

  //sort : 정렬의 기준이 될 요소
  //order : 정렬 방법
  switch (sort) {
    case "price":
      switch (order) {
        case "asc":
          results.sort((a, b) => a.price - b.price);
          break;
        case "desc":
          results.sort((a, b) => b.price - a.price);
          break;
      }
      break;
    case "service":
      results.sort(
        (a, b) => (a.service.toLowerCase() > b.service.toLowerCase() ? 1 : -1),
        //조건이 참일때, 조건에 따라 우선순위를 만들고 싶다면 양수를 줘야하고,
        //조건이 거짓일 때, 조건과 반대로 우선순위를 주고 싶다면 음수를 줘야한다.
        //값이 양수면, 조건과 동일한 우선순위를 가지고
        //값이 음수면, 조건과 반대의 우선순위를 가진다.
      );
      break;
  }

  // ─────────────────────────────────────────
  // TODO 4: 페이지네이션
  // ─────────────────────────────────────────
  // ?page=1&limit=3 → 1~3번째 항목
  // ?page=2&limit=3 → 4~6번째 항목
  //
  // 힌트: Array.slice(startIndex, endIndex) 사용
  // startIndex = (page - 1) * limit
  //
  // 응답 형태:
  // {
  //   success: true,
  //   page: 1,
  //   limit: 3,
  //   total: 8,         ← 전체 개수
  //   totalPages: 3,    ← Math.ceil(total / limit)
  //   data: [...]
  // }
  if (page && limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    results = results.slice(startIndex, endIndex);
  }

  // 기본 응답
  res.json({
    success: true,
    count: results.length,
    data: results,
  });
});

// ─────────────────────────────────────────────
// 서버 시작
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
