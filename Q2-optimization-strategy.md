# Q2: 優化策略 & RAM 問題

## 50,000 人同時使用，1~2 天能做什麼

### 我會選的方案：Redis Cache + DB Index

**Redis Cache（半天~一天）**
- API 跟 DB 之間加一層 Redis
- 快取熱門查詢（前幾頁、常見排序），TTL 設 5 分鐘
- 寫入時 invalidate 對應的 cache key
- 大部分查詢都是重複的，cache hit rate 會很高

**DB Index 優化（半天）**
- 確認 age、birthdate、name 等排序欄位都有 index
- 常見的 sort + filter 組合加 composite index
- 跑 `EXPLAIN ANALYZE` 抓慢查詢

選這組合是因為改動範圍小、風險低、一天半內做得完，效果也最明顯。

其他考慮過但沒選的：
- gzip 壓縮 + CDN → 有幫助但對 DB 瓶頸沒用
- 水平擴展 API server → 要一天，而且根本問題在 DB 層

---

## Infinite Scroll 吃太多 RAM 怎麼辦

### 問題

Infinite scroll 一直把 DOM 節點往下加，滾越多 DOM 越肥：
- 500 筆/頁 × 20 頁 = 10,000 個 `<tr>`
- 瀏覽器要維護所有節點的 layout 跟 event listener
- 手機容易卡頓甚至 crash

### 解法：Virtual Scrolling

只渲染畫面上看得到的那幾列，上下各留一點 buffer：

```
[ Buffer 5 rows    ]  ← 快進入畫面的
[ Visible ~15 rows ]  ← 使用者看到的，實際有 DOM
[ Buffer 5 rows    ]  ← 剛離開畫面的
[ 其餘全部不渲染    ]  ← 用 CSS transform 撐高度就好
```

做法：
1. 用 spacer div 撐出總高度（`rows × rowHeight`）
2. 監聽 scroll event，算出目前可視範圍的 start/end index
3. 只渲染那段資料，用 `translateY` 定位

| | DOM 節點數 | 記憶體 |
|---|---|---|
| Infinite Scroll（20 頁）| ~10,000 | 50~100MB+ |
| Virtual Scroll | ~25（固定）| ~2MB（固定）|

實作參考：`src/components/Q2/VirtualScrollTable.vue`

實務上大型專案可以直接用 `@tanstack/vue-virtual` 或 `vue-virtual-scroller`，不用自己刻。
