import * as dayjs from 'dayjs';
import { IOrderedSource } from 'app/entities/ordered-source/ordered-source.model';

export interface ISourcePriority {
  id?: number;
  idSourcePriority?: string | null;
  name?: string | null;
  description?: string | null;
  updateDate?: dayjs.Dayjs | null;
  creationDate?: dayjs.Dayjs | null;
  attributeLists?: IOrderedSource[] | null;
}

export class SourcePriority implements ISourcePriority {
  constructor(
    public id?: number,
    public idSourcePriority?: string | null,
    public name?: string | null,
    public description?: string | null,
    public updateDate?: dayjs.Dayjs | null,
    public creationDate?: dayjs.Dayjs | null,
    public attributeLists?: IOrderedSource[] | null
  ) {}
}

export function getSourcePriorityIdentifier(sourcePriority: ISourcePriority): number | undefined {
  return sourcePriority.id;
}
