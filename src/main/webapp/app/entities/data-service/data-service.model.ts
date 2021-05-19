import * as dayjs from 'dayjs';

export interface IDataService {
  id?: number;
  idService?: string | null;
  name?: string | null;
  description?: string | null;
  updateDate?: dayjs.Dayjs | null;
  creationDate?: dayjs.Dayjs | null;
}

export class DataService implements IDataService {
  constructor(
    public id?: number,
    public idService?: string | null,
    public name?: string | null,
    public description?: string | null,
    public updateDate?: dayjs.Dayjs | null,
    public creationDate?: dayjs.Dayjs | null
  ) {}
}

export function getDataServiceIdentifier(dataService: IDataService): number | undefined {
  return dataService.id;
}
