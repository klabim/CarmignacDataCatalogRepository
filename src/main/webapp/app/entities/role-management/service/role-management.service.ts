import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRoleManagement, getRoleManagementIdentifier } from '../role-management.model';

export type EntityResponseType = HttpResponse<IRoleManagement>;
export type EntityArrayResponseType = HttpResponse<IRoleManagement[]>;

@Injectable({ providedIn: 'root' })
export class RoleManagementService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/role-managements');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(roleManagement: IRoleManagement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(roleManagement);
    return this.http
      .post<IRoleManagement>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(roleManagement: IRoleManagement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(roleManagement);
    return this.http
      .put<IRoleManagement>(`${this.resourceUrl}/${getRoleManagementIdentifier(roleManagement) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(roleManagement: IRoleManagement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(roleManagement);
    return this.http
      .patch<IRoleManagement>(`${this.resourceUrl}/${getRoleManagementIdentifier(roleManagement) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRoleManagement>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRoleManagement[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRoleManagementToCollectionIfMissing(
    roleManagementCollection: IRoleManagement[],
    ...roleManagementsToCheck: (IRoleManagement | null | undefined)[]
  ): IRoleManagement[] {
    const roleManagements: IRoleManagement[] = roleManagementsToCheck.filter(isPresent);
    if (roleManagements.length > 0) {
      const roleManagementCollectionIdentifiers = roleManagementCollection.map(
        roleManagementItem => getRoleManagementIdentifier(roleManagementItem)!
      );
      const roleManagementsToAdd = roleManagements.filter(roleManagementItem => {
        const roleManagementIdentifier = getRoleManagementIdentifier(roleManagementItem);
        if (roleManagementIdentifier == null || roleManagementCollectionIdentifiers.includes(roleManagementIdentifier)) {
          return false;
        }
        roleManagementCollectionIdentifiers.push(roleManagementIdentifier);
        return true;
      });
      return [...roleManagementsToAdd, ...roleManagementCollection];
    }
    return roleManagementCollection;
  }

  protected convertDateFromClient(roleManagement: IRoleManagement): IRoleManagement {
    return Object.assign({}, roleManagement, {
      updateDate: roleManagement.updateDate?.isValid() ? roleManagement.updateDate.format(DATE_FORMAT) : undefined,
      creationDate: roleManagement.creationDate?.isValid() ? roleManagement.creationDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((roleManagement: IRoleManagement) => {
        roleManagement.updateDate = roleManagement.updateDate ? dayjs(roleManagement.updateDate) : undefined;
        roleManagement.creationDate = roleManagement.creationDate ? dayjs(roleManagement.creationDate) : undefined;
      });
    }
    return res;
  }
}
