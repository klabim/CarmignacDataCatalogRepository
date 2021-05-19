import * as dayjs from 'dayjs';
import { IAttribute } from 'app/entities/attribute/attribute.model';
import { IBusinessObject } from 'app/entities/business-object/business-object.model';
import { IDataRole } from 'app/entities/data-role/data-role.model';
import { IDataService } from 'app/entities/data-service/data-service.model';

export interface IRoleManagement {
  id?: number;
  idDataRole?: string | null;
  updateDate?: dayjs.Dayjs | null;
  creationDate?: dayjs.Dayjs | null;
  respByException?: IAttribute | null;
  responsible?: IBusinessObject | null;
  dataRole?: IDataRole | null;
  dataService?: IDataService | null;
}

export class RoleManagement implements IRoleManagement {
  constructor(
    public id?: number,
    public idDataRole?: string | null,
    public updateDate?: dayjs.Dayjs | null,
    public creationDate?: dayjs.Dayjs | null,
    public respByException?: IAttribute | null,
    public responsible?: IBusinessObject | null,
    public dataRole?: IDataRole | null,
    public dataService?: IDataService | null
  ) {}
}

export function getRoleManagementIdentifier(roleManagement: IRoleManagement): number | undefined {
  return roleManagement.id;
}
