import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDataService, getDataServiceIdentifier } from '../data-service.model';

export type EntityResponseType = HttpResponse<IDataService>;
export type EntityArrayResponseType = HttpResponse<IDataService[]>;

@Injectable({ providedIn: 'root' })
export class DataServiceService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/data-services');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(dataService: IDataService): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dataService);
    return this.http
      .post<IDataService>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(dataService: IDataService): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dataService);
    return this.http
      .put<IDataService>(`${this.resourceUrl}/${getDataServiceIdentifier(dataService) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(dataService: IDataService): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(dataService);
    return this.http
      .patch<IDataService>(`${this.resourceUrl}/${getDataServiceIdentifier(dataService) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDataService>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDataService[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDataServiceToCollectionIfMissing(
    dataServiceCollection: IDataService[],
    ...dataServicesToCheck: (IDataService | null | undefined)[]
  ): IDataService[] {
    const dataServices: IDataService[] = dataServicesToCheck.filter(isPresent);
    if (dataServices.length > 0) {
      const dataServiceCollectionIdentifiers = dataServiceCollection.map(dataServiceItem => getDataServiceIdentifier(dataServiceItem)!);
      const dataServicesToAdd = dataServices.filter(dataServiceItem => {
        const dataServiceIdentifier = getDataServiceIdentifier(dataServiceItem);
        if (dataServiceIdentifier == null || dataServiceCollectionIdentifiers.includes(dataServiceIdentifier)) {
          return false;
        }
        dataServiceCollectionIdentifiers.push(dataServiceIdentifier);
        return true;
      });
      return [...dataServicesToAdd, ...dataServiceCollection];
    }
    return dataServiceCollection;
  }

  protected convertDateFromClient(dataService: IDataService): IDataService {
    return Object.assign({}, dataService, {
      updateDate: dataService.updateDate?.isValid() ? dataService.updateDate.format(DATE_FORMAT) : undefined,
      creationDate: dataService.creationDate?.isValid() ? dataService.creationDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((dataService: IDataService) => {
        dataService.updateDate = dataService.updateDate ? dayjs(dataService.updateDate) : undefined;
        dataService.creationDate = dataService.creationDate ? dayjs(dataService.creationDate) : undefined;
      });
    }
    return res;
  }
}
