# 放款知識庫 · Git 版本

由 2026-09-21 的私人放款知識庫完整轉換，保留 5 筆知識、來源位置、Requirement、L6 欄位、狀態篩選及搜尋。採寶寶藍配色與側邊導覽。

## 本機執行

```sh
python3 -m http.server 8080
```

開啟 http://localhost:8080 。資料透過 fetch 讀取，請使用 HTTP server。

## 檔案

- index.html：版面
- styles.css：樣式
- app.js：搜尋、篩選、詳細資料與可分享的規則 hash
- data.json：知識資料；原始 5 筆內容未更改
- .nojekyll：GitHub Pages 靜態檔設定

## GitHub Pages

可置於 edanlinn.github.io 專案的 loan/ 目錄，發布路徑為 /loan/。所有資源使用相對路徑，主站無須更動。亦可作為獨立 repository 的根目錄，於 GitHub Pages 選擇對應分支與根目錄。

此版本經使用者確認後發布於公開 GitHub Pages。data.json 含 CTBC 專案業務規則與文件名稱。純靜態 Pages 不提供原 Sites 的本人登入限制。

資料狀態屬 2026-09-21 基準，未宣稱已更新到今日。其他放款主題尚未完成盤點。
