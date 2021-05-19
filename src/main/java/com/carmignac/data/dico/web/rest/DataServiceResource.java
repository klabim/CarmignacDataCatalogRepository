package com.carmignac.data.dico.web.rest;

import com.carmignac.data.dico.domain.DataService;
import com.carmignac.data.dico.repository.DataServiceRepository;
import com.carmignac.data.dico.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.carmignac.data.dico.domain.DataService}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DataServiceResource {

    private final Logger log = LoggerFactory.getLogger(DataServiceResource.class);

    private static final String ENTITY_NAME = "dataService";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DataServiceRepository dataServiceRepository;

    public DataServiceResource(DataServiceRepository dataServiceRepository) {
        this.dataServiceRepository = dataServiceRepository;
    }

    /**
     * {@code POST  /data-services} : Create a new dataService.
     *
     * @param dataService the dataService to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dataService, or with status {@code 400 (Bad Request)} if the dataService has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/data-services")
    public ResponseEntity<DataService> createDataService(@Valid @RequestBody DataService dataService) throws URISyntaxException {
        log.debug("REST request to save DataService : {}", dataService);
        if (dataService.getId() != null) {
            throw new BadRequestAlertException("A new dataService cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DataService result = dataServiceRepository.save(dataService);
        return ResponseEntity
            .created(new URI("/api/data-services/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /data-services/:id} : Updates an existing dataService.
     *
     * @param id the id of the dataService to save.
     * @param dataService the dataService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dataService,
     * or with status {@code 400 (Bad Request)} if the dataService is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dataService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/data-services/{id}")
    public ResponseEntity<DataService> updateDataService(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DataService dataService
    ) throws URISyntaxException {
        log.debug("REST request to update DataService : {}, {}", id, dataService);
        if (dataService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dataService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dataServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DataService result = dataServiceRepository.save(dataService);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dataService.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /data-services/:id} : Partial updates given fields of an existing dataService, field will ignore if it is null
     *
     * @param id the id of the dataService to save.
     * @param dataService the dataService to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dataService,
     * or with status {@code 400 (Bad Request)} if the dataService is not valid,
     * or with status {@code 404 (Not Found)} if the dataService is not found,
     * or with status {@code 500 (Internal Server Error)} if the dataService couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/data-services/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<DataService> partialUpdateDataService(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DataService dataService
    ) throws URISyntaxException {
        log.debug("REST request to partial update DataService partially : {}, {}", id, dataService);
        if (dataService.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dataService.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dataServiceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DataService> result = dataServiceRepository
            .findById(dataService.getId())
            .map(
                existingDataService -> {
                    if (dataService.getIdService() != null) {
                        existingDataService.setIdService(dataService.getIdService());
                    }
                    if (dataService.getName() != null) {
                        existingDataService.setName(dataService.getName());
                    }
                    if (dataService.getDescription() != null) {
                        existingDataService.setDescription(dataService.getDescription());
                    }
                    if (dataService.getUpdateDate() != null) {
                        existingDataService.setUpdateDate(dataService.getUpdateDate());
                    }
                    if (dataService.getCreationDate() != null) {
                        existingDataService.setCreationDate(dataService.getCreationDate());
                    }

                    return existingDataService;
                }
            )
            .map(dataServiceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dataService.getId().toString())
        );
    }

    /**
     * {@code GET  /data-services} : get all the dataServices.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dataServices in body.
     */
    @GetMapping("/data-services")
    public List<DataService> getAllDataServices() {
        log.debug("REST request to get all DataServices");
        return dataServiceRepository.findAll();
    }

    /**
     * {@code GET  /data-services/:id} : get the "id" dataService.
     *
     * @param id the id of the dataService to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dataService, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/data-services/{id}")
    public ResponseEntity<DataService> getDataService(@PathVariable Long id) {
        log.debug("REST request to get DataService : {}", id);
        Optional<DataService> dataService = dataServiceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(dataService);
    }

    /**
     * {@code DELETE  /data-services/:id} : delete the "id" dataService.
     *
     * @param id the id of the dataService to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/data-services/{id}")
    public ResponseEntity<Void> deleteDataService(@PathVariable Long id) {
        log.debug("REST request to delete DataService : {}", id);
        dataServiceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
