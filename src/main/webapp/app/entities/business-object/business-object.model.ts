import * as dayjs from 'dayjs';
import { IAttribute } from 'app/entities/attribute/attribute.model';

export interface IBusinessObject {
  id?: number;
  idBo?: string | null;
  name?: string | null;
  definition?: string | null;
  updateDate?: dayjs.Dayjs | null;
  creationDate?: dayjs.Dayjs | null;
  attributeList?: IAttribute | null;
}

export class BusinessObject implements IBusinessObject {
  constructor(
    public id?: number,
    public idBo?: string | null,
    public name?: string | null,
    public definition?: string | null,
    public updateDate?: dayjs.Dayjs | null,
    public creationDate?: dayjs.Dayjs | null,
    public attributeList?: IAttribute | null
  ) {}
}

export function getBusinessObjectIdentifier(businessObject: IBusinessObject): number | undefined {
  return businessObject.id;
}
