# Q1b: 我對 Vue3 的看法

## 優點

### 1. Composition API 讓程式碼更好整理
Vue2 的 Options API 把 data、methods、computed 拆開放，元件一大就很難追邏輯。Vue3 的 Composition API 可以把相關的邏輯放在一起，搭配 composables 做邏輯複用，比 Vue2 的 mixins 乾淨很多，不會有命名衝突的問題。

### 2. TypeScript 支援變好了
Vue3 本身就是用 TypeScript 寫的，`defineProps`、`defineEmits` 可以直接用型別定義，IDE 的 autocomplete 和型別檢查都很到位。在多人協作的專案中，這點很實用。

### 3. 效能有感提升
- 用 `Proxy` 取代 `Object.defineProperty`，不再有 Vue2 偵測不到物件新屬性的問題
- 靜態提升和 patch flags 讓重新渲染更快
- Tree-shaking 做得好，沒用到的功能不會進 bundle

### 4. `<script setup>` 寫起來簡潔
少了 `export default`、`return` 那些樣板程式碼，寫起來比較快，讀起來也清楚。

### 5. Pinia 比 Vuex 好用
拿掉了 mutations，直接改 state 就好。API 簡單，TypeScript 支援完整，上手門檻低。

### 6. Fragment 和 Teleport
不用再包多餘的根節點，Teleport 處理 modal、tooltip 的 z-index 問題也方便。

---

## 缺點

### 1. 從 Vue2 升上來成本不低
部分 Vue2 的套件不支援 Vue3，一些 API 也拿掉了（`$on`/`$off`、filter 等）。如果是既有專案要升級，要評估一下改動範圍。

### 2. `ref` 和 `reactive` 容易搞混
什麼時候用 `ref`、什麼時候用 `reactive`，還有 `.value` 的問題，剛開始確實需要適應。`reactive` 解構會失去響應性這點也踩過坑。

### 3. 兩種寫法並存
Options API 和 Composition API 都能用，社群的範例和教學混在一起，團隊需要先統一規範，不然程式碼風格會不一致。

### 4. 搜尋資料偶爾會踩到 Vue2 的舊內容
Google 搜出來的結果有時候還是 Vue2 的寫法，如果沒注意到版本差異，容易被誤導。

### 5. SSR 生態相對 React 還是少一些
Nuxt 3 已經很成熟了，但跟 Next.js 比起來，社群資源和進階功能的選擇還是少一點。

---

## 小結

整體來說，Vue3 改進的方向都很務實。Composition API 和 TypeScript 支援讓大型專案的維護變容易，效能也確實有提升。缺點主要是遷移和學習成本，但適應之後開發效率是有明顯改善的。新專案的話我會直接選 Vue3。
