// 用於稽核紀錄、路由標識、或行為追蹤的名稱定義
export namespace AuditNameEnum {
  // 授權
  export enum Auth {
    Login = '登入',
    ContinueLogin = '繼續登入',
    Logout = '登出',
    SystemLogout = '系統登出',
    VerificationFailed = '驗證失敗登出',
  }

  // 首頁
  export enum Home {
    Main = '首頁_主頁',
  }

  // 稽核軌跡管理
  export enum Audit {
    Main = '稽核軌跡_主頁',
    Btn_Search = '稽核軌跡_主頁_搜尋',
    Btn_First_Page = '稽核軌跡_主頁_第一頁',
    Btn_Previous = '稽核軌跡_主頁_上一頁',
    Btn_Next = '稽核軌跡_主頁_下一頁',
    Btn_Last_Page = '稽核軌跡_主頁_最後一頁',
  }

  // 權限管理
  export enum Permission {
    // 主頁
    Main = '權限管理_主頁',
    Btn_Main_Setting = '權限管理_設定_新增 & 修改功能',
    Btn_Main_Create_Copy = '權限管理_主頁_新增&複製權限',
    Btn_Main_Type = '權限管理_主頁_查看類型',

    Btn_Main_Read = '權限管理_主頁_查看權限',
    Btn_Main_Update = '權限管理_主頁_修改權限',
    Btn_Main_Enable = '權限管理_主頁_啟用帳號',
    Btn_Main_Disable = '權限管理_主頁_停用帳號',

    Btn_Main_First_Page = '權限管理_主頁_第一頁',
    Btn_Main_Previous = '權限管理_主頁_上一頁',
    Btn_Main_Next = '權限管理_主頁_下一頁',
    Btn_Main_Last_Page = '權限管理_主頁_最後一頁',

    // 明細 讀取
    Detail_Read = '權限管理_詳細頁_讀取',

    // 明細 新增
    Detail_Create = '權限管理_詳細頁_新增&複製',
    Detail_Copy_User = '權限管理_詳細頁_新增&複製_可複製啟用帳號',
    Detail_Create_Copy_Save = '權限管理_詳細頁_新增&複製_儲存',

    // 明細 更新
    Detail_Update = '權限管理_詳細頁_更新',
    Detail_Update_Copy_User = '權限管理_詳細頁_更新_可複製啟用帳號',
    Detail_Update_Save = '權限管理_詳細頁_更新_儲存',

    // 設定
    Setting = '權限管理_設定_新增&修改功能',
    Btn_Setting_Save = '權限管理_設定_新增&修改功能_儲存',
  }

  // CDP
  export namespace CDP {
    export enum EDM {
      // 主頁
      Main = 'EDM_主頁',
      Btn_Main_Search = 'EDM_主頁_搜尋',
      Btn_Main_First_Page = 'EDM_主頁_第一頁',
      Btn_Main_Previous = 'EDM_主頁_上一頁',
      Btn_Main_Next = 'EDM_主頁_下一頁',
      Btn_Main_Last_Page = 'EDM_主頁_最後一頁',

      // 明細
      Detail = 'EDM_明細',
      Btn_Detail_First_Page = 'EDM_明細_第一頁',
      Btn_Detail_Previous = 'EDM_明細_上一頁',
      Btn_Detail_Next = 'EDM_明細_下一頁',
      Btn_Detail_Last_Page = 'EDM_明細_最後一頁',
    }

    export enum SMS {
      // 主頁
      Main = 'SMS_主頁',
      Btn_Main_Search = 'SMS_主頁_搜尋',
      Btn_Main_First_Page = 'SMS_主頁_第一頁',
      Btn_Main_Previous = 'SMS_主頁_上一頁',
      Btn_Main_Next = 'SMS_主頁_下一頁',
      Btn_Main_Last_Page = 'SMS_主頁_最後一頁',

      // 明細
      Detail = 'SMS_明細',
      Btn_Detail_First_Page = 'SMS_明細_第一頁',
      Btn_Detail_Previous = 'SMS_明細_上一頁',
      Btn_Detail_Next = 'SMS_明細_下一頁',
      Btn_Detail_Last_Page = 'SMS_明細_最後一頁',
    }

    export enum App_Push {
      // 主頁
      Main = 'App_Push_主頁',
      Btn_Main_Search = 'App_Push_主頁_搜尋',
      Btn_Main_First_Page = 'App_Push_主頁_第一頁',
      Btn_Main_Previous = 'App_Push_主頁_上一頁',
      Btn_Main_Next = 'App_Push_主頁_下一頁',
      Btn_Main_Last_Page = 'App_Push_主頁_最後一頁',

      // 明細
      Detail = 'App_Push_明細',
      Btn_Detail_First_Page = 'App_Push_明細_第一頁',
      Btn_Detail_Previous = 'App_Push_明細_上一頁',
      Btn_Detail_Next = 'App_Push_明細_下一頁',
      Btn_Detail_Last_Page = 'App_Push_明細_最後一頁',
    }
  }

  // MailHunter
  export namespace MailHunter {
    // feedback_marked
    export namespace FeedbackMarked {
      export enum ILRC {
        // 主頁
        Main = 'ILRC_主頁',

        // 日期查詢
        Btn_Main_Date = 'ILRC_主頁_日期查詢',
        Btn_Main_Date_Search = 'ILRC_主頁_日期查詢_搜尋',
        Btn_Main_Date_Export = 'ILRC_主頁_日期查詢_匯出',
        Btn_Main_Date_First_Page = 'ILRC_主頁_日期查詢_第一頁',
        Btn_Main_Date_Previous = 'ILRC_主頁_日期查詢_上一頁',
        Btn_Main_Date_Next = 'ILRC_主頁_日期查詢_下一頁',
        Btn_Main_Date_Last_Page = 'ILRC_主頁_日期查詢_最後一頁',

        // 專案查詢
        Btn_Main_Project = 'ILRC_主頁_專案查詢',
        Btn_Main_Project_Search = 'ILRC_主頁_專案查詢_搜尋',
        Btn_Main_Project_Export = 'ILRC_主頁_專案查詢_匯出',
        Btn_Main_Project_First_Page = 'ILRC_主頁_專案查詢_第一頁',
        Btn_Main_Project_Previous = 'ILRC_主頁_專案查詢_上一頁',
        Btn_Main_Project_Next = 'ILRC_主頁_專案查詢_下一頁',
        Btn_Main_Project_Last_Page = 'ILRC_主頁_專案查詢_最後一頁',

        // 明細
        // 日期查詢
        Detail_Date = 'ILRC_明細_日期查詢',
        Btn_Detail_Date_Export = 'ILRC_明細_日期查詢_匯出',
        Btn_Detail_Date_First_Page = 'ILRC_明細_日期查詢_第一頁',
        Btn_Detail_Date_Previous = 'ILRC_明細_日期查詢_上一頁',
        Btn_Detail_Date_Next = 'ILRC_明細_日期查詢_下一頁',
        Btn_Detail_Date_Last_Page = 'ILRC_明細_日期查詢_最後一頁',

        // 專案查詢
        Detail_Project = 'ILRC_明細_專案查詢',
        Btn_Detail_Project_Export = 'ILRC_明細_專案查詢_匯出',
        Btn_Detail_Project_First_Page = 'ILRC_明細_專案查詢_第一頁',
        Btn_Detail_Project_Previous = 'ILRC_明細_專案查詢_上一頁',
        Btn_Detail_Project_Next = 'ILRC_明細_專案查詢_下一頁',
        Btn_Detail_Project_Last_Page = 'ILRC_明細_專案查詢_最後一頁',
      }

      export enum CDP {
        // 主頁
        Main = 'CDP_主頁',

        // 日期查詢
        Btn_Main_Date = 'CDP_主頁_日期查詢',
        Btn_Main_Date_Search = 'CDP_主頁_日期查詢_搜尋',
        Btn_Main_Date_Export = 'CDP_主頁_日期查詢_匯出',
        Btn_Main_Date_First_Page = 'CDP_主頁_日期查詢_第一頁',
        Btn_Main_Date_Previous = 'CDP_主頁_日期查詢_上一頁',
        Btn_Main_Date_Next = 'CDP_主頁_日期查詢_下一頁',
        Btn_Main_Date_Last_Page = 'CDP_主頁_日期查詢_最後一頁',

        // 專案查詢
        Btn_Main_Project = 'CDP_主頁_專案查詢',
        Btn_Main_Project_Search = 'CDP_主頁_專案查詢_搜尋',
        Btn_Main_Project_Export = 'CDP_主頁_專案查詢_匯出',
        Btn_Main_Project_First_Page = 'CDP_主頁_專案查詢_第一頁',
        Btn_Main_Project_Previous = 'CDP_主頁_專案查詢_上一頁',
        Btn_Main_Project_Next = 'CDP_主頁_專案查詢_下一頁',
        Btn_Main_Project_Last_Page = 'CDP_主頁_專案查詢_最後一頁',

        // 明細
        // 日期查詢
        Detail_Date = 'CDP_明細_日期查詢',
        Btn_Detail_Date_Export = 'CDP_明細_日期查詢_匯出',
        Btn_Detail_Date_First_Page = 'CDP_明細_日期查詢_第一頁',
        Btn_Detail_Date_Previous = 'CDP_明細_日期查詢_上一頁',
        Btn_Detail_Date_Next = 'CDP_明細_日期查詢_下一頁',
        Btn_Detail_Date_Last_Page = 'CDP_明細_日期查詢_最後一頁',

        // 專案查詢
        Detail_Project = 'CDP_明細_專案查詢',
        Btn_Detail_Project_Export = 'CDP_明細_專案查詢_匯出',
        Btn_Detail_Project_First_Page = 'CDP_明細_專案查詢_第一頁',
        Btn_Detail_Project_Previous = 'CDP_明細_專案查詢_上一頁',
        Btn_Detail_Project_Next = 'CDP_明細_專案查詢_下一頁',
        Btn_Detail_Project_Last_Page = 'CDP_明細_專案查詢_最後一頁',
      }
    }

    // project-mail-count
    // export namespace ProjectMailCount {
    export enum ProjectMailCount {
      // 主頁
      Main = 'ProjectMailCount_主頁',
      Btn_Main_Export = 'ProjectMailCount_主頁_匯出',
      Btn_Main_Search = 'ProjectMailCount_主頁_搜尋',
      Btn_Main_First_Page = 'ProjectMailCount_主頁_第一頁',
      Btn_Main_Previous = 'ProjectMailCount_主頁_上一頁',
      Btn_Main_Next = 'ProjectMailCount_主頁_下一頁',
      Btn_Main_Last_Page = 'ProjectMailCount_主頁_最後一頁',
    }
  }

  // MSMQ
  export namespace MSMQ {
    export enum Queue {
      Main = 'Queue_主頁',
      Btn_Main_Search = 'Queue_主頁_搜尋',
    }
  }

  // 測試頁
  export enum Test {
    Main_1 = '測試頁_1_主頁',
    Main_2 = '測試頁_2_主頁',
  }
}
