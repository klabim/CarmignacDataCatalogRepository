import * as dayjs from 'dayjs';

export interface IDataRole {
  id?: number;
  idDataRole?: string | null;
  name?: string | null;
  description?: string | null;
  updateDate?: dayjs.Dayjs | null;
  creationDate?: dayjs.Dayjs | null;
}

export class DataRole implements IDataRole {
  constructor(
    public id?: number,
    public idDataRole?: string | null,
    public name?: string | null,
    public description?: string | null,
    public updateDate?: dayjs.Dayjs | null,
    public creationDate?: dayjs.Dayjs | null
  ) {}
}

export function getDataRoleIdentifier(dataRole: IDataRole): number | undefined {
  return dataRole.id;
}
