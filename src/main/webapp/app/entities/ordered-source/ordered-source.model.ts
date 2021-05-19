import * as dayjs from 'dayjs';
import { ISource } from 'app/entities/source/source.model';
import { ISourcePriority } from 'app/entities/source-priority/source-priority.model';

export interface IOrderedSource {
  id?: number;
  orderSource?: number;
  updateDate?: dayjs.Dayjs | null;
  creationDate?: dayjs.Dayjs | null;
  linkedSource?: ISource | null;
  sourcePriority?: ISourcePriority | null;
}

export class OrderedSource implements IOrderedSource {
  constructor(
    public id?: number,
    public orderSource?: number,
    public updateDate?: dayjs.Dayjs | null,
    public creationDate?: dayjs.Dayjs | null,
    public linkedSource?: ISource | null,
    public sourcePriority?: ISourcePriority | null
  ) {}
}

export function getOrderedSourceIdentifier(orderedSource: IOrderedSource): number | undefined {
  return orderedSource.id;
}
