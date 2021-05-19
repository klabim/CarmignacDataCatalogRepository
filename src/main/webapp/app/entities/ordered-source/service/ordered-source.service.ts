import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOrderedSource, getOrderedSourceIdentifier } from '../ordered-source.model';

export type EntityResponseType = HttpResponse<IOrderedSource>;
export type EntityArrayResponseType = HttpResponse<IOrderedSource[]>;

@Injectable({ providedIn: 'root' })
export class OrderedSourceService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/ordered-sources');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(orderedSource: IOrderedSource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderedSource);
    return this.http
      .post<IOrderedSource>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(orderedSource: IOrderedSource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderedSource);
    return this.http
      .put<IOrderedSource>(`${this.resourceUrl}/${getOrderedSourceIdentifier(orderedSource) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(orderedSource: IOrderedSource): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(orderedSource);
    return this.http
      .patch<IOrderedSource>(`${this.resourceUrl}/${getOrderedSourceIdentifier(orderedSource) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IOrderedSource>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IOrderedSource[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addOrderedSourceToCollectionIfMissing(
    orderedSourceCollection: IOrderedSource[],
    ...orderedSourcesToCheck: (IOrderedSource | null | undefined)[]
  ): IOrderedSource[] {
    const orderedSources: IOrderedSource[] = orderedSourcesToCheck.filter(isPresent);
    if (orderedSources.length > 0) {
      const orderedSourceCollectionIdentifiers = orderedSourceCollection.map(
        orderedSourceItem => getOrderedSourceIdentifier(orderedSourceItem)!
      );
      const orderedSourcesToAdd = orderedSources.filter(orderedSourceItem => {
        const orderedSourceIdentifier = getOrderedSourceIdentifier(orderedSourceItem);
        if (orderedSourceIdentifier == null || orderedSourceCollectionIdentifiers.includes(orderedSourceIdentifier)) {
          return false;
        }
        orderedSourceCollectionIdentifiers.push(orderedSourceIdentifier);
        return true;
      });
      return [...orderedSourcesToAdd, ...orderedSourceCollection];
    }
    return orderedSourceCollection;
  }

  protected convertDateFromClient(orderedSource: IOrderedSource): IOrderedSource {
    return Object.assign({}, orderedSource, {
      updateDate: orderedSource.updateDate?.isValid() ? orderedSource.updateDate.format(DATE_FORMAT) : undefined,
      creationDate: orderedSource.creationDate?.isValid() ? orderedSource.creationDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((orderedSource: IOrderedSource) => {
        orderedSource.updateDate = orderedSource.updateDate ? dayjs(orderedSource.updateDate) : undefined;
        orderedSource.creationDate = orderedSource.creationDate ? dayjs(orderedSource.creationDate) : undefined;
      });
    }
    return res;
  }
}
