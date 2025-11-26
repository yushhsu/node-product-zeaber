const http = require("http");
const url = require("url");

// 先準備 5 個 3C 產品
const products = [
  { id: 1, name: "手機", price: 12900 },
  { id: 2, name: "筆電", price: 32900 },
  { id: 3, name: "平板", price: 15900 },
  { id: 4, name: "耳機", price: 2990 },
  { id: 5, name: "螢幕", price: 6990 },
];

const server = http.createServer(function (req, res) {
  // 統一回應都是 JSON
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  // Health API
  if (req.url === "/api/health" && req.method === "GET") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        status: "OK",
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  // 首頁：列出簡單的 API 介紹
  if (req.url === "/" && req.method === "GET") {
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        message: "歡迎使用 API 服務",
        description: "這是一個示範用的 3C 產品查詢 API。",
        endpoints: {
          health: {
            path: "/api/health",
            method: "GET",
            description: "檢查 API 是否正常運作",
          },
          products: {
            path: "/api/products?min=5000&max=20000",
            method: "GET",
            description: "用價格區間篩選產品（min / max 都是選填）",
          },
        },
      })
    );
    return;
  }

  // 其他路徑用 url.parse 來處理（例如 /api/products?min=...&max=...）
  const parsedUrl = url.parse(req.url, true);

  // 只處理 /api/products 這個路徑
  if (parsedUrl.pathname === "/api/products" && req.method === "GET") {
    // 取得 query 參數：?min=5000&max=20000
    const min = Number(parsedUrl.query.min) || 0;
    const max = Number(parsedUrl.query.max) || Infinity;

    // 篩選出在區間內的產品
    const matched = products.filter(function (p) {
      return p.price >= min && p.price <= max;
    });

    // 準備要回傳的 JSON
    const result = {
      min,
      max,
      totalProducts: products.length,
      matchedCount: matched.length,
      matchedProducts: matched, // 如果只想教「數量」，這行也可以先拿掉
    };

    res.statusCode = 200;
    res.end(JSON.stringify(result));
    return;
  }

  // 其他沒對到的路徑
  res.statusCode = 404;
  res.end(JSON.stringify({ message: "找不到路徑" }));
});

server.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
