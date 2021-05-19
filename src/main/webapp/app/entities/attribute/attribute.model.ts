import * as dayjs from 'dayjs';
import { ISourcePriority } from 'app/entities/source-priority/source-priority.model';
import { IBusinessObject } from 'app/entities/business-object/business-object.model';

export interface IAttribute {
  id?: string;
  name?: string | null;
  internalExternal?: string | null;
  cardinality?: string | null;
  enumeration?: string | null;
  lPattern?: string | null;
  longName?: string | null;
  definition?: string | null;
  updateDate?: dayjs.Dayjs | null;
  creationDate?: dayjs.Dayjs | null;
  goldenSourcePriority?: ISourcePriority | null;
  linkedType?: IBusinessObject | null;
  businessObjects?: IBusinessObject[] | null;
}

export class Attribute implements IAttribute {
  constructor(
    public id?: string,
    public name?: string | null,
    public internalExternal?: string | null,
    public cardinality?: string | null,
    public enumeration?: string | null,
    public lPattern?: string | null,
    public longName?: string | null,
    public definition?: string | null,
    public updateDate?: dayjs.Dayjs | null,
    public creationDate?: dayjs.Dayjs | null,
    public goldenSourcePriority?: ISourcePriority | null,
    public linkedType?: IBusinessObject | null,
    public businessObjects?: IBusinessObject[] | null
  ) {}
}

export function getAttributeIdentifier(attribute: IAttribute): string | undefined {
  return attribute.id;
}
