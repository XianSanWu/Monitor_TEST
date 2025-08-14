import { LogicOperatorEnum } from "../../enums/logic-operator-enum";

export class BaseConditionModel {
  /** 內部條件(AND/OR/None) */
  InsideLogicOperator: LogicOperatorEnum = LogicOperatorEnum.None;

  /** 外部條件(AND/OR/None) */
  GroupLogicOperator: LogicOperatorEnum = LogicOperatorEnum.None;
}
