import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAttribute, getAttributeIdentifier } from '../attribute.model';

export type EntityResponseType = HttpResponse<IAttribute>;
export type EntityArrayResponseType = HttpResponse<IAttribute[]>;

@Injectable({ providedIn: 'root' })
export class AttributeService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/attributes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(attribute: IAttribute): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attribute);
    return this.http
      .post<IAttribute>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(attribute: IAttribute): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attribute);
    return this.http
      .put<IAttribute>(`${this.resourceUrl}/${getAttributeIdentifier(attribute) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(attribute: IAttribute): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attribute);
    return this.http
      .patch<IAttribute>(`${this.resourceUrl}/${getAttributeIdentifier(attribute) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IAttribute>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAttribute[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAttributeToCollectionIfMissing(
    attributeCollection: IAttribute[],
    ...attributesToCheck: (IAttribute | null | undefined)[]
  ): IAttribute[] {
    const attributes: IAttribute[] = attributesToCheck.filter(isPresent);
    if (attributes.length > 0) {
      const attributeCollectionIdentifiers = attributeCollection.map(attributeItem => getAttributeIdentifier(attributeItem)!);
      const attributesToAdd = attributes.filter(attributeItem => {
        const attributeIdentifier = getAttributeIdentifier(attributeItem);
        if (attributeIdentifier == null || attributeCollectionIdentifiers.includes(attributeIdentifier)) {
          return false;
        }
        attributeCollectionIdentifiers.push(attributeIdentifier);
        return true;
      });
      return [...attributesToAdd, ...attributeCollection];
    }
    return attributeCollection;
  }

  protected convertDateFromClient(attribute: IAttribute): IAttribute {
    return Object.assign({}, attribute, {
      updateDate: attribute.updateDate?.isValid() ? attribute.updateDate.format(DATE_FORMAT) : undefined,
      creationDate: attribute.creationDate?.isValid() ? attribute.creationDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((attribute: IAttribute) => {
        attribute.updateDate = attribute.updateDate ? dayjs(attribute.updateDate) : undefined;
        attribute.creationDate = attribute.creationDate ? dayjs(attribute.creationDate) : undefined;
      });
    }
    return res;
  }
}
