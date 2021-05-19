import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISourcePriority, getSourcePriorityIdentifier } from '../source-priority.model';

export type EntityResponseType = HttpResponse<ISourcePriority>;
export type EntityArrayResponseType = HttpResponse<ISourcePriority[]>;

@Injectable({ providedIn: 'root' })
export class SourcePriorityService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/source-priorities');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(sourcePriority: ISourcePriority): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sourcePriority);
    return this.http
      .post<ISourcePriority>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(sourcePriority: ISourcePriority): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sourcePriority);
    return this.http
      .put<ISourcePriority>(`${this.resourceUrl}/${getSourcePriorityIdentifier(sourcePriority) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(sourcePriority: ISourcePriority): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(sourcePriority);
    return this.http
      .patch<ISourcePriority>(`${this.resourceUrl}/${getSourcePriorityIdentifier(sourcePriority) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISourcePriority>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISourcePriority[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSourcePriorityToCollectionIfMissing(
    sourcePriorityCollection: ISourcePriority[],
    ...sourcePrioritiesToCheck: (ISourcePriority | null | undefined)[]
  ): ISourcePriority[] {
    const sourcePriorities: ISourcePriority[] = sourcePrioritiesToCheck.filter(isPresent);
    if (sourcePriorities.length > 0) {
      const sourcePriorityCollectionIdentifiers = sourcePriorityCollection.map(
        sourcePriorityItem => getSourcePriorityIdentifier(sourcePriorityItem)!
      );
      const sourcePrioritiesToAdd = sourcePriorities.filter(sourcePriorityItem => {
        const sourcePriorityIdentifier = getSourcePriorityIdentifier(sourcePriorityItem);
        if (sourcePriorityIdentifier == null || sourcePriorityCollectionIdentifiers.includes(sourcePriorityIdentifier)) {
          return false;
        }
        sourcePriorityCollectionIdentifiers.push(sourcePriorityIdentifier);
        return true;
      });
      return [...sourcePrioritiesToAdd, ...sourcePriorityCollection];
    }
    return sourcePriorityCollection;
  }

  protected convertDateFromClient(sourcePriority: ISourcePriority): ISourcePriority {
    return Object.assign({}, sourcePriority, {
      updateDate: sourcePriority.updateDate?.isValid() ? sourcePriority.updateDate.format(DATE_FORMAT) : undefined,
      creationDate: sourcePriority.creationDate?.isValid() ? sourcePriority.creationDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((sourcePriority: ISourcePriority) => {
        sourcePriority.updateDate = sourcePriority.updateDate ? dayjs(sourcePriority.updateDate) : undefined;
        sourcePriority.creationDate = sourcePriority.creationDate ? dayjs(sourcePriority.creationDate) : undefined;
      });
    }
    return res;
  }
}
