# DDD Copilot Instructions（強制）

本文件定義此專案唯一合法的 DDD 實作方式。
任何偏離視為錯誤實作，必須修正。

----------------------------------------------------------------

## 一、分層責任（不可混用）

### application
- 定義系統「能做什麼」
- 唯一允許業務行為入口：use-cases
- 不包含 UI、不直接呼叫 Firebase

### domain
- 定義「是什麼」
- 僅包含：
  - Value Object
  - Entity
  - Aggregate
  - Domain Service
- 不得依賴 application / infrastructure

### infrastructure
- 技術實作層
- Repository / Firebase / DTO / Mapper
- 不包含業務判斷

### presentation
- UI 與互動
- Component 不得包含業務邏輯
- 不得判斷登入、流程、狀態轉移

### shared
- 純工具與跨層通用物件
- 不包含業務語意

----------------------------------------------------------------

## 二、Use Case 強制規範

- 所有業務行為必須存在於 use-cases
- 每個 use-case：
  - 只負責一個意圖
  - 明確輸入與輸出
  - 推進 domain 狀態或 application 狀態

- 禁止：
  - 空 use-case
  - 僅包裝 service
  - 未被呼叫的 use-case

----------------------------------------------------------------

## 三、狀態轉移規則

- 狀態只能由 use-case 推進
- Facade 僅反映結果
- Guard 僅判斷，不決策
- Component 不得補流程

----------------------------------------------------------------

## 四、違規判定（零容忍）

以下任一情況即為違規：

- Component 直接呼叫 repository
- Facade 直接 set 業務狀態
- Guard 超過純判斷
- Use Case 被繞過
- 為「未來可能」預留未使用 abstraction

----------------------------------------------------------------

## 五、Copilot 行為限制

- 禁止 workaround
- 禁止 hack
- 禁止「先能跑再說」
- 若無法符合規範，必須停下並說明原因
