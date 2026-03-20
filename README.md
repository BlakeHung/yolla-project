# UWow Technical Interview - Homework

## 題目

- **Q1b**: Vue3 優缺點分析 → [Q1b-vue3-analysis.md](Q1b-vue3-analysis.md)
- **Q2**: 資料管理系統（CRUD、Search、Sort、Pagination、Virtual Scroll）
  - 優化策略 → [Q2-optimization-strategy.md](Q2-optimization-strategy.md)
- **Q3**: Blog 後台管理 Wireframe → [Q3-wireframe-design.pdf](Q3-wireframe-design.pdf)

## 啟動方式

```bash
npm install
npm run dev
```

## 專案結構

```
src/
├── main.js                          # Entry point
├── App.vue                          # Root component
├── style.css                        # Global styles
├── router/index.js                  # Vue Router
├── stores/userData.js               # Pinia store
├── composables/useDataApi.js        # API layer (CRUD composable)
├── components/Q2/
│   ├── SearchBar.vue                # 搜尋（debounce）
│   ├── DataTable.vue                # 資料表格（排序）
│   ├── DataForm.vue                 # 新增/編輯表單
│   ├── Pagination.vue               # 分頁
│   └── VirtualScrollTable.vue       # Virtual Scroll
└── views/Q2/
    └── DataManagement.vue           # Q2 主頁面
```
