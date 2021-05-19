import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDataRole, getDataRoleIdentifier } from '../data-role.model';

export type EntityResponseType = HttpResponse<IDataRole>;
export type EntityArrayResponseType = HttpResponse<IDataRole[]>;

@Injectable({ providedIn: 'root' })
export class DataRoleService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/data-roles');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(dataRole: IDataRole): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dataRole);
    return this.http
      .post<IDataRole>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(dataRole: IDataRole): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dataRole);
    return this.http
      .put<IDataRole>(`${this.resourceUrl}/${getDataRoleIdentifier(dataRole) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(dataRole: IDataRole): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dataRole);
    return this.http
      .patch<IDataRole>(`${this.resourceUrl}/${getDataRoleIdentifier(dataRole) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDataRole>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDataRole[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDataRoleToCollectionIfMissing(dataRoleCollection: IDataRole[], ...dataRolesToCheck: (IDataRole | null | undefined)[]): IDataRole[] {
    const dataRoles: IDataRole[] = dataRolesToCheck.filter(isPresent);
    if (dataRoles.length > 0) {
      const dataRoleCollectionIdentifiers = dataRoleCollection.map(dataRoleItem => getDataRoleIdentifier(dataRoleItem)!);
      const dataRolesToAdd = dataRoles.filter(dataRoleItem => {
        const dataRoleIdentifier = getDataRoleIdentifier(dataRoleItem);
        if (dataRoleIdentifier == null || dataRoleCollectionIdentifiers.includes(dataRoleIdentifier)) {
          return false;
        }
        dataRoleCollectionIdentifiers.push(dataRoleIdentifier);
        return true;
      });
      return [...dataRolesToAdd, ...dataRoleCollection];
    }
    return dataRoleCollection;
  }

  protected convertDateFromClient(dataRole: IDataRole): IDataRole {
    return Object.assign({}, dataRole, {
      updateDate: dataRole.updateDate?.isValid() ? dataRole.updateDate.format(DATE_FORMAT) : undefined,
      creationDate: dataRole.creationDate?.isValid() ? dataRole.creationDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((dataRole: IDataRole) => {
        dataRole.updateDate = dataRole.updateDate ? dayjs(dataRole.updateDate) : undefined;
        dataRole.creationDate = dataRole.creationDate ? dayjs(dataRole.creationDate) : undefined;
      });
    }
    return res;
  }
}
