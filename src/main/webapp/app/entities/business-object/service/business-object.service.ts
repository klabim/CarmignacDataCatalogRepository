import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBusinessObject, getBusinessObjectIdentifier } from '../business-object.model';

export type EntityResponseType = HttpResponse<IBusinessObject>;
export type EntityArrayResponseType = HttpResponse<IBusinessObject[]>;

@Injectable({ providedIn: 'root' })
export class BusinessObjectService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/business-objects');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(businessObject: IBusinessObject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(businessObject);
    return this.http
      .post<IBusinessObject>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(businessObject: IBusinessObject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(businessObject);
    return this.http
      .put<IBusinessObject>(`${this.resourceUrl}/${getBusinessObjectIdentifier(businessObject) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(businessObject: IBusinessObject): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(businessObject);
    return this.http
      .patch<IBusinessObject>(`${this.resourceUrl}/${getBusinessObjectIdentifier(businessObject) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBusinessObject>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBusinessObject[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBusinessObjectToCollectionIfMissing(
    businessObjectCollection: IBusinessObject[],
    ...businessObjectsToCheck: (IBusinessObject | null | undefined)[]
  ): IBusinessObject[] {
    const businessObjects: IBusinessObject[] = businessObjectsToCheck.filter(isPresent);
    if (businessObjects.length > 0) {
      const businessObjectCollectionIdentifiers = businessObjectCollection.map(
        businessObjectItem => getBusinessObjectIdentifier(businessObjectItem)!
      );
      const businessObjectsToAdd = businessObjects.filter(businessObjectItem => {
        const businessObjectIdentifier = getBusinessObjectIdentifier(businessObjectItem);
        if (businessObjectIdentifier == null || businessObjectCollectionIdentifiers.includes(businessObjectIdentifier)) {
          return false;
        }
        businessObjectCollectionIdentifiers.push(businessObjectIdentifier);
        return true;
      });
      return [...businessObjectsToAdd, ...businessObjectCollection];
    }
    return businessObjectCollection;
  }

  protected convertDateFromClient(businessObject: IBusinessObject): IBusinessObject {
    return Object.assign({}, businessObject, {
      updateDate: businessObject.updateDate?.isValid() ? businessObject.updateDate.format(DATE_FORMAT) : undefined,
      creationDate: businessObject.creationDate?.isValid() ? businessObject.creationDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.updateDate = res.body.updateDate ? dayjs(res.body.updateDate) : undefined;
      res.body.creationDate = res.body.creationDate ? dayjs(res.body.creationDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((businessObject: IBusinessObject) => {
        businessObject.updateDate = businessObject.updateDate ? dayjs(businessObject.updateDate) : undefined;
        businessObject.creationDate = businessObject.creationDate ? dayjs(businessObject.creationDate) : undefined;
      });
    }
    return res;
  }
}
