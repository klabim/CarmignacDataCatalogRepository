import * as dayjs from 'dayjs';

export interface ISource {
  id?: number;
  idGloden?: string | null;
  name?: string | null;
  description?: string | null;
  updateDate?: dayjs.Dayjs | null;
  creationDate?: dayjs.Dayjs | null;
}

export class Source implements ISource {
  constructor(
    public id?: number,
    public idGloden?: string | null,
    public name?: string | null,
    public description?: string | null,
    public updateDate?: dayjs.Dayjs | null,
    public creationDate?: dayjs.Dayjs | null
  ) {}
}

export function getSourceIdentifier(source: ISource): number | undefined {
  return source.id;
}
