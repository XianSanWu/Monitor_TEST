import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  finalize,
  forkJoin,
  Observable,
  of,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { ValidatorsUtil } from '../../../common/utils/validators-util';
import { BasicInputComponent } from '../../../component/form/basic-input/basic-input.component';
import { CollapsibleSectionComponent } from '../../../component/form/collapsible-section/collapsible-section.component';
import { SearchSelectComponent } from '../../../component/form/search-select/search-select.component';
import { LoadingIndicatorComponent } from '../../../component/loading/loading-indicator/loading-indicator.component';
import { SmartAuditDirective } from '../../../core/directivies/smart-audit-directive';
import { LogicOperatorEnum } from '../../../core/enums/logic-operator-enum';
import { MathSymbolEnum } from '../../../core/enums/math-symbol-enum';
import { PermissionActionEnum } from '../../../core/enums/permission-enum';
import { ResponseModel } from '../../../core/models/base.model';
import { Option, PageBase } from '../../../core/models/common/base.model';
import { PermissionRequest } from '../../../core/models/requests/permission-model';
import {
  FieldModel,
  UserRequest,
  UserUpdateRequest,
} from '../../../core/models/requests/user-model';
import {
  FeaturePermission,
  GroupedPermissions,
} from '../../../core/models/responses/permission.model';
import { DialogService } from '../../../core/services/dialog.service';
import { LoadingService } from '../../../core/services/loading.service';
import { BaseComponent } from '../../base.component';
import { PermissionManageService } from '../permission-manage.service';

@Component({
  selector: 'permission-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BasicInputComponent,
    LoadingIndicatorComponent,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    CollapsibleSectionComponent,
    SearchSelectComponent,
    SmartAuditDirective,
  ],
  providers: [PermissionManageService],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export default class DetailComponent extends BaseComponent implements OnInit {
  validateForm: FormGroup;
  showButtons = false; // 控制按鈕是否顯示

  // 假資料
  copyUserNameList: Option[] = [];

  groupedPermissions: GroupedPermissions[] = [];

  allActions = ['Read', 'Create', 'Update', 'Delete', 'Export'];
  allPermissions: FeaturePermission[] = [];
  action: string = '';
  userName: string = '';
  userUuid: string = '';

  constructor(
    private dialogService: DialogService,
    private permissionManageService: PermissionManageService,
    // private configService: ConfigService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    // 初始化表單
    this.validateForm = new FormGroup({
      userName: new FormControl('', [
        Validators.required,
        ValidatorsUtil.blank,
        ValidatorsUtil.intSymbolsEnglishNumbers,
      ]),
      copyUserName: new FormControl('', []),
    });
    this.action = this.route.snapshot.paramMap.get('Action')?.trim() ?? '';
    this.userName = this.route.snapshot.paramMap.get('UserName')?.trim() ?? '';
    this.userUuid = this.route.snapshot.paramMap.get('UserUuid')?.trim() ?? '';

    console.log('this.action', this.action);
    console.log('this.userName', this.userName);
    console.log('this.userUuid', this.userUuid);

    // this.configService.configData$.subscribe((data) => {});
  }

  ngOnInit(): void {
    const isInvalidAction = !Object.values(PermissionActionEnum).includes(
      this.action as PermissionActionEnum
    );

    if (isInvalidAction) {
      this.dialogService.openCustomSnackbar({
        title: '提示訊息',
        message: `無此網址功能`,
      });
      this.router.navigate(['/permission/permission_main']);
    }
    this.loadPermissions();
    this.valueChanges();
  }

  valueChanges() {
    this.validateForm.get('copyUserName')?.valueChanges.subscribe((value) => {
      const copyUserNameUuid = value;
      if (
        copyUserNameUuid &&
        this.copyUserNameList.some((opt) => opt.key === copyUserNameUuid)
      ) {
        this.loadingService.show();

        const pageBase = new PageBase({
          pageSize: 2147483647,
          pageIndex: 1,
          totalCount: 0,
        });

        // 組裝請求資料
        const reqData: UserRequest = {
          page: pageBase,
          sortModel: undefined,
          filterModel: undefined,
          fieldModel: new FieldModel({ UserId: copyUserNameUuid, IsUse: true }),
        };

        // 取得該使用者資料
        this.permissionManageService
          .GetUserPermissionsAsync(reqData)
          .pipe(
            catchError((err) => {
              this.dialogService.openCustomSnackbar({
                message: err.message || '查詢列表失敗',
              });
              throw Error(err.message);
            }),
            tap((res) => {
              this.groupedPermissions = this.groupPermissions(
                this.allPermissions,
                res.Data
              );
            }),
            takeUntil(this.destroy$),
            finalize(() => {
              this.loadingService.hide();
            })
          )
          .subscribe();
      }
    });
  }

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
      fieldModel: new FieldModel({ IsUse: true }),
    };

    // 組裝請求資料
    const reqData2: UserRequest = {
      page: pageBaseBig,
      sortModel: undefined,
      filterModel: undefined,
      fieldModel: new FieldModel({ IsUse: true }),
    };

    // 組裝請求資料
    const reqData3: UserRequest = {
      page: pageBaseBig,
      sortModel: undefined,
      filterModel: undefined,
      fieldModel: new FieldModel({ UserId: this.userUuid, IsUse: true }),
    };

    const observables: any = {
      // 取得全部權限
      list1: this.permissionManageService.GetPermissionListAsync(reqData1).pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: '錯誤在API：GetPermissionListAsync。' + err.message,
          });
          console.error(
            '[list1] 錯誤在API：GetPermissionListAsync。API error:',
            err
          );
          return of(null); // 不要 throw，讓流程繼續
        })
      ),
      // 取得可複製的以啟用帳號
      list2: this.permissionManageService.GetUserListAsync(reqData2).pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: '錯誤在API：GetUserListAsync。' + err.message,
          });
          console.error('[list2] 錯誤在API：GetUserListAsync。API error:', err);
          return of(null); // 不要 throw，讓流程繼續
        })
      ),
    };

    // 如果條件成立，加入額外 API
    if (
      this.action.toLocaleLowerCase() ===
        PermissionActionEnum.Read.toLocaleLowerCase() ||
      this.action.toLocaleLowerCase() ===
        PermissionActionEnum.Update.toLocaleLowerCase()
    ) {
      // 取得該使用者資料
      observables.list3 = this.permissionManageService
        .GetUserPermissionsAsync(reqData3)
        .pipe(
          catchError((err) => {
            this.dialogService.openCustomSnackbar({
              message: '錯誤在API：GetUserPermissionsAsync。' + err.message,
            });
            console.error(
              '[list3] 錯誤在API：GetUserPermissionsAsync。API error:',
              err
            );
            return of(null);
          })
        );
    }

    forkJoin(observables)
      .pipe(
        takeUntil(this.destroy$),
        tap((result: any) => {
          if (result.list1) {
            this.allPermissions = result.list1.Data;
            this.groupedPermissions = this.groupPermissions(
              result.list1.Data,
              []
            );
          }

          if (result.list2) {
            const respData2 = result.list2.Data.SearchItem;
            if (!!respData2 && respData2.length > 0) {
              this.copyUserNameList = respData2.map(
                (f: any) => new Option({ key: f.Uuid, value: f.UserName })
              );
            }
          }

          if (result.list3) {
            this.groupedPermissions = this.groupPermissions(
              this.allPermissions,
              result.list3.Data
            );
          }
        }),
        finalize(() => {
          this.showButtons = true;
          if (
            this.action.toLocaleLowerCase() ===
              PermissionActionEnum.Read.toLocaleLowerCase() ||
            this.action.toLocaleLowerCase() ===
              PermissionActionEnum.Update.toLocaleLowerCase()
          ) {
            // disable 帳號(員編)
            this.validateForm.patchValue({ userName: this.userName });
            this.validateForm.get('userName')?.disable();
          }

          if (
            this.action.toLocaleLowerCase() ===
            PermissionActionEnum.Read.toLocaleLowerCase()
          ) {
            // disable 可複製啟用帳號
            this.validateForm.get('copyUserName')?.disable();
            this.showButtons = false;
          }

          this.loadingService.hide();
        })
      )
      .subscribe();

    //原有寫法
    // forkJoin({
    //   // 取得全部權限
    //   list1: this.permissionManageService.GetPermissionListAsync().pipe(
    //     catchError((err) => {
    //       this.dialogService.openCustomSnackbar({
    //         message:
    //           '錯誤在API：GetPermissionListAsync。' + err.message ||
    //           '錯誤在API：GetPermissionListAsync',
    //       });
    //       console.error(
    //         '[list1] 錯誤在API：GetPermissionListAsync。API error:',
    //         err
    //       );
    //       return of(null); // 不要 throw，讓流程繼續
    //     })
    //   ),
    //   // 取得可複製的以啟用帳號
    //   list2: this.permissionManageService.GetUserListAsync(reqData).pipe(
    //     catchError((err) => {
    //       this.dialogService.openCustomSnackbar({
    //         message:
    //           '錯誤在API：GetUserListAsync。' + err.message ||
    //           '錯誤在API：GetUserListAsync',
    //       });
    //       console.error('[list2] 錯誤在API：GetUserListAsync。API error:', err);
    //       return of(null); // 不要 throw，讓流程繼續
    //     })
    //   ),
    // })
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     tap((result) => {
    //       // 同時取得多個 API 的回傳結果
    //       if (result.list1) {
    //         const respData1 = result.list1.Data;
    //         this.allPermissions = respData1;
    //         this.groupedPermissions = this.groupPermissions(respData1, []);
    //         // console.log('list1 成功', respData1);
    //       }
    //       if (result.list2) {
    //         const respData2 = result.list2.Data.SearchItem;
    //         if (!!respData2 && respData2.length > 0) {
    //           this.copyUserNameList = respData2.map(
    //             (f: any) =>
    //               new Option({
    //                 key: f.Uuid,
    //                 value: f.UserName,
    //               })
    //           );
    //         }
    //         // console.log('list2 成功', respData2);
    //         // console.log('list2 成功', this.copyUserNameList);
    //       }
    //     }),
    //     finalize(() => {
    //       this.showButtons = true;
    //       this.loadingService.hide();
    //     })
    //   )
    //   .subscribe();
  }

  groupPermissions(
    data: FeaturePermission[],
    checkData: FeaturePermission[]
  ): GroupedPermissions[] {
    const groups: GroupedPermissions[] = [];

    // 先把 header 排序
    const headers = data
      .filter((x) => !x.ParentUuid || x.BitValue === 0)
      .sort((a, b) => (a.Sort ?? 0) - (b.Sort ?? 0));

    headers.forEach((header) => {
      // 取出該 header 的 items 並依 Sort 排序
      const items = data
        .filter((x) => x.ParentUuid === header.Uuid)
        .sort((a, b) => (a.Sort ?? 0) - (b.Sort ?? 0))
        .map((item) => {
          const map: { [actionName: string]: boolean } = {};

          this.allActions.forEach((action) => {
            const hasPermission = checkData.some(
              (cd) =>
                cd.Uuid === item.Uuid &&
                cd.Action?.toLocaleLowerCase() === action?.toLocaleLowerCase()
            );

            map[action] = hasPermission;
          });

          return { ...item, ActionMap: map };
        });

      groups.push({ header, items });
    });

    return groups;
  }

  isActionEnabled(item: FeaturePermission, action: string): boolean {
    return (
      item.Action === action &&
      item.IsUse === true &&
      this.action.toLocaleLowerCase() !==
        PermissionActionEnum.Read.toLocaleLowerCase()
    );
  }

  clearAll() {
    this.validateForm.patchValue({ copyUserName: '' });

    this.groupedPermissions.forEach((group) => {
      group.items.forEach((item) => {
        this.allActions.forEach((action) => {
          item.ActionMap[action] = false;
        });
      });
    });
  }

  selectAll() {
    this.groupedPermissions.forEach((group) => {
      group.items.forEach((item) => {
        this.allActions.forEach((action) => {
          // 僅在該 item 原本有定義 Action 時才設 true
          if (
            item.Action &&
            item.Action.toLocaleLowerCase() === action.toLocaleLowerCase()
          ) {
            item.ActionMap[action] = true;
          }
        });
      });
    });
  }

  onSave() {
    this.loadingService.show();
    console.log('this.groupedPermissions', this.groupedPermissions);

    const totalBitValue = this.groupedPermissions
      .flatMap((group) => group.items) // 把每組的 items 攤平成一維陣列
      .filter(
        (item) =>
          item.IsUse &&
          item.ParentUuid !== null &&
          item.Action &&
          item.ActionMap[item.Action] === true
      ) // 過濾符合條件
      .reduce((sum, item) => sum + item.BitValue, 0); // 加總 BitValue

    // console.log('totalBitValue', totalBitValue);

    const reqData: UserUpdateRequest = {
      FieldRequest: {
        FeatureMask: totalBitValue,
        IsUse: true,
        UserName: this.validateForm.get('userName')?.value,
      },
      ConditionRequest: [
        {
          Uuid: {
            Key: 'Uuid',
            MathSymbol: MathSymbolEnum.Equal,
            Value: this.userUuid,
          },
          InsideLogicOperator: LogicOperatorEnum.None,
          GroupLogicOperator: LogicOperatorEnum.None,
        },
      ],
    };

    //Call 更新 API
    if (
      this.action.toLocaleLowerCase() ===
      PermissionActionEnum.Create.toLocaleLowerCase()
    ) {
      this.handleSaveUser(reqData, true);
    } else {
      this.handleSaveUser(reqData);
    }
  }

  handleSaveUser(reqData: any, checkBeforeSave: boolean = false) {
    let save$: Observable<ResponseModel<any>>;

    if (checkBeforeSave) {
      // 先檢查再儲存
      save$ = this.permissionManageService.CheckUpdateUserAsync(reqData).pipe(
        switchMap((res) => {
          const isCheckSuccess = !!res.Data && res.Data;
          this.dialogService.openCustomSnackbar({
            title: '提示訊息',
            message: `執行${isCheckSuccess ? '成功' : '失敗' + res.Message}`,
          });

          if (isCheckSuccess) {
            return this.permissionManageService.SaveUserAsync(reqData);
          } else {
            return throwError(() => new Error(res.Message || '檢查失敗'));
          }
        })
      );
    } else {
      // 直接儲存
      save$ = this.permissionManageService.SaveUserAsync(reqData);
    }

    save$
      .pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: err.message || '執行失敗',
          });
          return throwError(() => err);
        }),
        tap((res) => {
          const isSuccess = !!res.Data && res.Data;
          this.dialogService.openCustomSnackbar({
            title: '提示訊息',
            message: `執行${isSuccess ? '成功' : '失敗' + res.Message}`,
          });

          if (isSuccess) {
            this.router.navigate(['/permission/permission_main']);
          }
        }),
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe();
  }
}
