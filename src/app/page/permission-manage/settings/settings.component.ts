import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { catchError, finalize, forkJoin, of, takeUntil, tap } from 'rxjs';
import { CollapsibleSectionComponent } from '../../../component/form/collapsible-section/collapsible-section.component';
import { LoadingIndicatorComponent } from '../../../component/loading/loading-indicator/loading-indicator.component';
import { Option, PageBase } from '../../../core/models/common/base.model';
import { ConfirmDialogOption } from '../../../core/models/common/dialog.model';
import {
  PermissionRequest,
  PermissionUpdateFieldRequest,
  PermissionUpdateRequest,
} from '../../../core/models/requests/permission-model';
import {
  FeaturePermission,
  GroupedPermissions,
} from '../../../core/models/responses/permission.model';
import { DialogService } from '../../../core/services/dialog.service';
import { LoadingService } from '../../../core/services/loading.service';
import { BaseComponent } from '../../base.component';
import { PermissionManageService } from '../permission-manage.service';

@Component({
  selector: 'settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingIndicatorComponent,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    CollapsibleSectionComponent,
  ],
  providers: [PermissionManageService],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export default class SettingsComponent extends BaseComponent implements OnInit {
  fieldErrors: {
    [groupUuid: string]: {
      module?: {
        ModuleName?: boolean;
        Title?: boolean;
        Icon?: boolean;
        Sort?: boolean;
        Link?: boolean;
      };
      items: {
        [itemUuid: string]: {
          FeatureName?: boolean;
          Title?: boolean;
          Sort?: boolean;
          Action?: boolean;
        };
      };
    };
  } = {};

  copyUserNameList: Option[] = [];
  // 原始資料
  originalGroupedPermissions: GroupedPermissions[] = [];
  // 新資料
  groupedPermissions: GroupedPermissions[] = [];
  allActions = ['Read', 'Create', 'Update', 'Delete', 'Export'];
  allPermissions: FeaturePermission[] = [];
  showButton: boolean = false;
  userName = '';
  userUuid = '';

  constructor(
    private dialogService: DialogService,
    private permissionManageService: PermissionManageService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadPermissions();
  }

  // 重製錯誤
  initFieldErrors() {
    this.groupedPermissions.forEach((group) => {
      if (!this.fieldErrors[group.header.Uuid]) {
        this.fieldErrors[group.header.Uuid] = { module: {}, items: {} };
      }
      group.items.forEach((item) => {
        if (!this.fieldErrors[group.header.Uuid].items[item.Uuid]) {
          this.fieldErrors[group.header.Uuid].items[item.Uuid] = {};
        }
      });
    });
  }

  // 載入資料
  loadPermissions() {
    this.loadingService.show();

    const pageBaseBig = new PageBase({
      pageSize: 2147483647,
      pageIndex: 1,
      totalCount: 0,
    });

    // 組裝請求資料
    const reqData1: PermissionRequest = {
      page: pageBaseBig,
      sortModel: undefined,
      filterModel: undefined,
      fieldModel: undefined,
    };

    const observables: any = {
      list1: this.permissionManageService.GetPermissionListAsync(reqData1).pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: '錯誤在API：GetPermissionListAsync。' + err.message,
          });
          console.error(
            '[list1] 錯誤在API：GetPermissionListAsync。API error:',
            err
          );
          return of(null);
        })
      ),
    };

    forkJoin(observables)
      .pipe(
        takeUntil(this.destroy$),
        tap((result: any) => {
          if (result.list1) {
            this.allPermissions = result.list1.Data;
            this.groupedPermissions = this.groupPermissions(result.list1.Data);
            // 深拷貝存原始資料
            this.originalGroupedPermissions = this.groupPermissions(
              result.list1.Data
            ).map((g) => ({
              header: { ...g.header },
              items: g.items.map((i) => ({
                ...i,
                ActionMap: { ...i.ActionMap },
              })),
            }));
            this.initFieldErrors();
          }
        }),
        finalize(() => {
          this.showButton = true;
          this.loadingService.hide();
        })
      )
      .subscribe();
  }

  // 整理資料為UI可視化
  groupPermissions(data: FeaturePermission[]): GroupedPermissions[] {
    // 先挑出所有 header，並依 Sort 排序
    const headers = data
      .filter((x) => !x.ParentUuid || x.BitValue === 0)
      .sort((a, b) => (a.Sort ?? 0) - (b.Sort ?? 0));

    const groups: GroupedPermissions[] = [];

    headers.forEach((header) => {
      // 每個 header 下的 items 依 Sort 排序
      const items = data
        .filter((x) => x.ParentUuid === header.Uuid)
        .sort((a, b) => (a.Sort ?? 0) - (b.Sort ?? 0))
        .map((item) => {
          const map: { [actionName: string]: boolean } = {};
          this.allActions.forEach((action) => {
            map[action] =
              item.Action?.toLocaleLowerCase() === action?.toLocaleLowerCase();
          });
          return { ...item, ActionMap: map };
        });

      groups.push({ header, items });
    });

    return groups;
  }

  // 添加模組
  addModule() {
    this.loadingService.show();

    const newUuid =
      crypto.randomUUID?.() ?? Math.random().toString(36).substring(2);
    const maxSort =
      this.groupedPermissions.length > 0
        ? Math.max(...this.groupedPermissions.map((m) => m.header.Sort ?? 0)) +
          1
        : 1;

    const newGroup: GroupedPermissions = {
      header: {
        Id: 0,
        Uuid: newUuid,
        ParentUuid: null,
        FeatureName: null,
        ModuleName: '',
        Title: '',
        Icon: 'bi bi-list',
        Link: null,
        Action: null,
        IsUse: true,
        IsVisible: true,
        BitValue: 0,
        Sort: maxSort,
        ActionMap: {},
      },
      items: [],
    };
    this.groupedPermissions.unshift(newGroup);
    this.fieldErrors[newUuid] = { module: {}, items: {} };
    this.addFeature(newGroup);

    this.loadingService.hide();
  }

  // 刪除模組
  removeModule(group: GroupedPermissions) {
    const dialogData: ConfirmDialogOption = {
      title: '確認操作',
      content: `確定刪除模組${group.header.ModuleName}嗎？`,
      leftButtonName: 'Cancel',
      rightButtonName: 'OK',
      isCloseBtn: true,
      rightCallback: () => {
        const index = this.groupedPermissions.indexOf(group);
        if (index > -1) this.groupedPermissions.splice(index, 1);
      },
    };
    this.dialogService.openConfirmDialog(dialogData).subscribe();
  }

  // 添加功能
  addFeature(group: GroupedPermissions) {
    const newUuid =
      crypto.randomUUID?.() ?? Math.random().toString(36).substring(2);
    const maxSort =
      group.items.length > 0
        ? Math.max(...group.items.map((x) => x.Sort ?? 0)) + 1
        : 1;

    const newItem: FeaturePermission = {
      Id: 0,
      Uuid: newUuid,
      ParentUuid: group.header.Uuid,
      FeatureName: null,
      ModuleName: group.header.ModuleName,
      Title: '',
      Icon: null,
      Link: null,
      Action: null,
      IsUse: true,
      IsVisible: true,
      BitValue: 0,
      Sort: maxSort,
      ActionMap: {},
    };
    this.allActions.forEach((action) => (newItem.ActionMap[action] = false));
    group.items.push(newItem);
    this.fieldErrors[group.header.Uuid].items[newUuid] = {};
  }

  // 刪除功能
  removeFeature(group: GroupedPermissions, item: FeaturePermission) {
    const dialogData: ConfirmDialogOption = {
      title: '確認操作',
      content: `確定刪除功能${item.FeatureName}嗎？`,
      leftButtonName: 'Cancel',
      rightButtonName: 'OK',
      isCloseBtn: true,
      rightCallback: () => {
        const index = group.items.indexOf(item);
        if (index > -1) group.items.splice(index, 1);
      },
    };
    this.dialogService.openConfirmDialog(dialogData).subscribe();
  }

  // isActionEnabled(item: FeaturePermission, action: string): boolean {
  //   return item.Action === action && item.IsUse;
  // }

  // 比較陣列是否一致
  areGroupedPermissionsEqual(
    a: GroupedPermissions[],
    b: GroupedPermissions[]
  ): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      const headerA = a[i].header;
      const headerB = b[i].header;

      // 比 header 屬性
      if (
        headerA.Uuid !== headerB.Uuid ||
        headerA.ModuleName !== headerB.ModuleName ||
        headerA.Title !== headerB.Title ||
        headerA.Icon !== headerB.Icon ||
        headerA.Link !== headerB.Link ||
        headerA.Sort !== headerB.Sort ||
        headerA.IsUse !== headerB.IsUse ||
        headerA.IsVisible !== headerB.IsVisible
      ) {
        return false;
      }

      const itemsA = a[i].items;
      const itemsB = b[i].items;

      if (itemsA.length !== itemsB.length) return false;

      for (let j = 0; j < itemsA.length; j++) {
        const itemA = itemsA[j];
        const itemB = itemsB[j];

        if (
          itemA.Uuid !== itemB.Uuid ||
          itemA.FeatureName !== itemB.FeatureName ||
          itemA.Title !== itemB.Title ||
          itemA.Icon !== itemB.Icon ||
          itemA.Link !== itemB.Link ||
          itemA.Sort !== itemB.Sort ||
          itemA.IsUse !== itemB.IsUse ||
          itemA.IsVisible !== itemB.IsVisible
        ) {
          return false;
        }

        // 比 ActionMap
        for (const key of Object.keys(itemA.ActionMap)) {
          if (itemA.ActionMap[key] !== itemB.ActionMap[key]) return false;
        }
      }
    }

    return true;
  }

  // 還原
  reply() {
    this.loadingService.show();
    // 從原始資料深拷貝還原
    this.groupedPermissions = this.originalGroupedPermissions.map((g) => ({
      header: { ...g.header },
      items: g.items.map((i) => ({ ...i, ActionMap: { ...i.ActionMap } })),
    }));

    // 重置錯誤
    this.initFieldErrors();

    // 消除紅框
    // 重置錯誤提示
    this.groupedPermissions.forEach((group) => {
      // 模組欄位
      this.fieldErrors[group.header.Uuid] = {
        module: {
          ModuleName: false,
          Title: false,
          Icon: false,
          Sort: false,
          Link: false,
        },
        items: {},
      };

      // 功能欄位
      group.items.forEach((item) => {
        this.fieldErrors[group.header.Uuid].items[item.Uuid] = {
          FeatureName: false,
          Title: false,
          Sort: false,
          Action: false,
        };
      });
    });

    // 捲動到第一個欄位並 focus
    setTimeout(() => {
      const firstInput: HTMLElement | null = document.querySelector(
        '.permission-form input'
      );
      if (firstInput) {
        firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (firstInput as HTMLInputElement).focus();
      }
    }, 0); // 等 Angular 更新 DOM 再 focus

    this.dialogService.openCustomSnackbar({
      title: '提醒',
      message: '已成功還原',
    });

    this.loadingService.hide();
  }

  // 功能checkbox檢核
  onActionChange(
    group: GroupedPermissions,
    item: FeaturePermission,
    action: string,
    checked: boolean
  ) {
    if (checked) {
      // 勾選時 → 強制單選
      this.allActions.forEach((a) => {
        item.ActionMap[a] = a === action;
      });
    } else {
      // 取消時 → 全部取消
      item.ActionMap[action] = false;
    }

    // 更新紅框狀態
    this.updateActionError(group, item);
  }

  updateActionError(group: GroupedPermissions, item: FeaturePermission) {
    const checkedActions = this.allActions.filter((a) => !!item.ActionMap[a]);
    // 只能勾選一個 → 沒勾或多勾都紅框
    this.fieldErrors[group.header.Uuid].items[item.Uuid].Action =
      checkedActions.length !== 1;
  }

  // 清掉模組欄位錯誤
  clearModuleError(
    groupUuid: string,
    field: 'ModuleName' | 'Title' | 'Icon' | 'Sort' | 'Link',
    value: any
  ) {
    if (!this.fieldErrors[groupUuid]?.module) return;

    switch (field) {
      case 'ModuleName':
      case 'Title':
      case 'Icon':
        if (value?.toString().trim())
          this.fieldErrors[groupUuid].module[field] = false;
        break;
      case 'Sort':
        if (value != null && value >= 0)
          this.fieldErrors[groupUuid].module.Sort = false;
        break;
      case 'Link':
        if (value?.toString().trim())
          this.fieldErrors[groupUuid].module.Link = false;
        break;
    }
  }

  // 清掉功能欄位錯誤
  clearItemError(
    groupUuid: string,
    itemUuid: string,
    field: 'FeatureName' | 'Title' | 'Sort' | 'Action',
    value: any
  ) {
    if (!this.fieldErrors[groupUuid]?.items[itemUuid]) return;

    switch (field) {
      case 'FeatureName':
      case 'Title':
        if (value?.toString().trim())
          this.fieldErrors[groupUuid].items[itemUuid][field] = false;
        break;
      case 'Sort':
        if (value != null && value >= 0)
          this.fieldErrors[groupUuid].items[itemUuid].Sort = false;
        break;
      case 'Action':
        if (
          this.allActions.some(
            (a) =>
              this.groupedPermissions
                .find((g) => g.header.Uuid === groupUuid)
                ?.items.find((i) => i.Uuid === itemUuid)?.ActionMap[a]
          )
        ) {
          this.fieldErrors[groupUuid].items[itemUuid].Action = false;
        }
        break;
    }
  }

  // 按下儲存
  onSave() {
    this.loadingService.show();
    if (this.checkData()) {
      this.loadingService.hide();
      return;
    }

    this.SaveFeaturePermission();
    // console.log('驗證通過，送出資料', this.processData());
    this.loadingService.hide();
  }

  SaveFeaturePermission() {
    const reqData: PermissionUpdateRequest = {
      FieldRequest: this.processData(),
      // ConditionRequest: this.processCondition(),
    };
    this.permissionManageService
      .SaveFeaturePermissionsAsync(reqData)
      .pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: err.message || '執行失敗',
          });
          throw Error(err.message);
        }),
        tap((res) => {
          const isSuccess = !!res.Data && res.Data;
          this.dialogService.openCustomSnackbar({
            title: '提示訊息',
            message: `執行${isSuccess ? '成功' : '失敗'}`,
          });
        }),
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadPermissions();
          // 捲動到第一個欄位並 focus
          setTimeout(() => {
            const firstInput: HTMLElement | null = document.querySelector(
              '.permission-form input'
            );
            if (firstInput) {
              firstInput.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
              (firstInput as HTMLInputElement).focus();
            }
          }, 0); // 等 Angular 更新 DOM 再 focus
          this.loadingService.hide();
        })
      )
      .subscribe();
  }

  // 處理資料給後端
  processData() {
    const flatData: PermissionUpdateFieldRequest[] = [];
    const usedBitValues = new Set<number>();

    // 先收集所有已有 BitValue
    this.groupedPermissions.forEach((group) => {
      group.items.forEach((item) => {
        if (item.BitValue && item.BitValue > 0) {
          usedBitValues.add(item.BitValue);
        }
      });
    });

    let nextBit = 1; // 從 1 開始找新的 2 的冪次方

    this.groupedPermissions.forEach((group) => {
      // header 固定 BitValue = 0
      flatData.push({
        Uuid: group.header.Uuid,
        ParentUuid: group.header.ParentUuid,
        Icon: group.header.Icon,
        ModuleName: group.header.ModuleName,
        FeatureName: group.header.FeatureName,
        Title: group.header.Title,
        Action: null,
        Link: group.header.Link,
        BitValue: 0,
        Sort: group.header.Sort,
        IsUse: group.header.IsUse,
        IsVisible: group.header.IsVisible,
      });

      group.items.forEach((item) => {
        let assignedBitValue = item.BitValue ?? 0;

        if (!assignedBitValue || assignedBitValue === 0) {
          // 找下一個未使用的 2 的冪次方
          while (usedBitValues.has(nextBit)) {
            nextBit *= 2;
          }
          assignedBitValue = nextBit;
          usedBitValues.add(assignedBitValue);
          nextBit *= 2; // 下一次分配
        }

        flatData.push({
          Uuid: item.Uuid,
          ParentUuid: item.ParentUuid,
          Icon: item.Icon,
          ModuleName: item.ModuleName,
          FeatureName: item.FeatureName,
          Title: item.Title,
          Action: this.pickAction(item.ActionMap), // 從物件挑出 true 的 key
          Link: item.Link,
          BitValue: assignedBitValue,
          Sort: item.Sort,
          IsUse: item.IsUse,
          IsVisible: item.IsVisible,
        });
      });
    });

    return flatData;
  }

  /** 從物件挑出 value 為 true 的 key */
  private pickAction(
    actionMap: Record<string, boolean> | undefined
  ): string | null {
    if (!actionMap) return null;
    const key = Object.keys(actionMap).find((k) => actionMap[k] === true);
    return key ?? null;
  }

  // 處理更新條件
  // processCondition() {
  //   const conditions: PermissionUpdateConditionRequest[] = [];

  //   this.groupedPermissions.forEach((group) => {
  //     // header
  //     conditions.push({
  //       Uuid: {
  //         Key: 'Uuid',
  //         MathSymbol: MathSymbolEnum.Equal,
  //         Value: group.header.Uuid,
  //       },
  //       InsideLogicOperator: LogicOperatorEnum.None,
  //       GroupLogicOperator: LogicOperatorEnum.None,
  //     });

  //     // items
  //     group.items.forEach((item) => {
  //       conditions.push({
  //         Uuid: {
  //           Key: 'Uuid',
  //           MathSymbol: MathSymbolEnum.Equal,
  //           Value: item.Uuid,
  //         },
  //         InsideLogicOperator: LogicOperatorEnum.None,
  //         GroupLogicOperator: LogicOperatorEnum.None,
  //       });
  //     });
  //   });

  //   return conditions;
  // }

  // 檢查資料
  checkData() {
    let hasError = false;

    // 先檢查模組 Sort 是否重複
    const moduleSorts = this.groupedPermissions.map((g) => g.header.Sort);
    const duplicateModuleSorts = moduleSorts.filter(
      (s, i) => moduleSorts.indexOf(s) !== i
    );

    this.groupedPermissions.forEach((group) => {
      const gErrors: any = { module: {}, items: {} };

      // 模組欄位驗證
      gErrors.module.ModuleName = !group.header.ModuleName?.trim();
      gErrors.module.Title = !group.header.Title?.trim();
      gErrors.module.Icon = !group.header.Icon?.trim();
      gErrors.module.Sort =
        group.header.Sort == null ||
        group.header.Sort <= 0 ||
        duplicateModuleSorts.includes(group.header.Sort);
      gErrors.module.Link = !group.header.Link?.trim();

      if (
        gErrors.module.ModuleName ||
        gErrors.module.Title ||
        gErrors.module.Icon ||
        gErrors.module.Sort
      ) {
        hasError = true;
      }

      // 功能欄位驗證：如果該模組沒有功能，直接跳過
      if (!group.items || group.items.length === 0) {
        this.fieldErrors[group.header.Uuid] = gErrors;
        return; // ⬅️ 直接跳過，不進 item 驗證
      }

      // 功能欄位驗證
      const itemSorts = group.items.map((i) => i.Sort);
      const duplicateItemSorts = itemSorts.filter(
        (s, i) => itemSorts.indexOf(s) !== i
      );

      group.items.forEach((item) => {
        const iErrors: any = {};
        iErrors.FeatureName = !item.FeatureName?.trim();
        iErrors.Title = !item.Title?.trim();
        iErrors.Sort =
          item.Sort == null ||
          item.Sort <= 0 ||
          duplicateItemSorts.includes(item.Sort);

        // Action 驗證：只能勾選一個
        const checkedActions = this.allActions.filter((a) => item.ActionMap[a]);
        iErrors.Action = checkedActions.length !== 1;

        if (
          iErrors.FeatureName ||
          iErrors.Title ||
          iErrors.Sort ||
          iErrors.Action
        ) {
          hasError = true;
        }

        gErrors.items[item.Uuid] = iErrors;
      });

      this.fieldErrors[group.header.Uuid] = gErrors;
    });

    if (hasError) {
      this.dialogService.openCustomSnackbar({
        message:
          '請修正表單中的紅框欄位後再儲存（排序需 > 0 且不可重複，每個功能只能勾選一個 Action）',
      });

      setTimeout(() => {
        const firstInvalid: HTMLElement | null =
          document.querySelector('.is-invalid');

        if (firstInvalid) {
          // 如果是 checkbox
          if (firstInvalid.tagName.toLowerCase() === 'mat-checkbox') {
            // 方式一：捲到它的位置
            firstInvalid.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });

            // 方式二：找裡面的 input 聚焦
            const input = firstInvalid.querySelector(
              'input[type="checkbox"]'
            ) as HTMLElement;
            input?.focus();
          } else {
            // 其他輸入框可以直接 focus
            firstInvalid.focus();
          }
        }
      });

      return hasError;
    }
    return hasError;
  }
}
