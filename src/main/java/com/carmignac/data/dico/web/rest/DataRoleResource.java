package com.carmignac.data.dico.web.rest;

import com.carmignac.data.dico.domain.DataRole;
import com.carmignac.data.dico.repository.DataRoleRepository;
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
 * REST controller for managing {@link com.carmignac.data.dico.domain.DataRole}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DataRoleResource {

    private final Logger log = LoggerFactory.getLogger(DataRoleResource.class);

    private static final String ENTITY_NAME = "dataRole";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DataRoleRepository dataRoleRepository;

    public DataRoleResource(DataRoleRepository dataRoleRepository) {
        this.dataRoleRepository = dataRoleRepository;
    }

    /**
     * {@code POST  /data-roles} : Create a new dataRole.
     *
     * @param dataRole the dataRole to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dataRole, or with status {@code 400 (Bad Request)} if the dataRole has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/data-roles")
    public ResponseEntity<DataRole> createDataRole(@Valid @RequestBody DataRole dataRole) throws URISyntaxException {
        log.debug("REST request to save DataRole : {}", dataRole);
        if (dataRole.getId() != null) {
            throw new BadRequestAlertException("A new dataRole cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DataRole result = dataRoleRepository.save(dataRole);
        return ResponseEntity
            .created(new URI("/api/data-roles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /data-roles/:id} : Updates an existing dataRole.
     *
     * @param id the id of the dataRole to save.
     * @param dataRole the dataRole to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dataRole,
     * or with status {@code 400 (Bad Request)} if the dataRole is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dataRole couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/data-roles/{id}")
    public ResponseEntity<DataRole> updateDataRole(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DataRole dataRole
    ) throws URISyntaxException {
        log.debug("REST request to update DataRole : {}, {}", id, dataRole);
        if (dataRole.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dataRole.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dataRoleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DataRole result = dataRoleRepository.save(dataRole);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dataRole.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /data-roles/:id} : Partial updates given fields of an existing dataRole, field will ignore if it is null
     *
     * @param id the id of the dataRole to save.
     * @param dataRole the dataRole to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dataRole,
     * or with status {@code 400 (Bad Request)} if the dataRole is not valid,
     * or with status {@code 404 (Not Found)} if the dataRole is not found,
     * or with status {@code 500 (Internal Server Error)} if the dataRole couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/data-roles/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<DataRole> partialUpdateDataRole(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DataRole dataRole
    ) throws URISyntaxException {
        log.debug("REST request to partial update DataRole partially : {}, {}", id, dataRole);
        if (dataRole.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dataRole.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dataRoleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DataRole> result = dataRoleRepository
            .findById(dataRole.getId())
            .map(
                existingDataRole -> {
                    if (dataRole.getIdDataRole() != null) {
                        existingDataRole.setIdDataRole(dataRole.getIdDataRole());
                    }
                    if (dataRole.getName() != null) {
                        existingDataRole.setName(dataRole.getName());
                    }
                    if (dataRole.getDescription() != null) {
                        existingDataRole.setDescription(dataRole.getDescription());
                    }
                    if (dataRole.getUpdateDate() != null) {
                        existingDataRole.setUpdateDate(dataRole.getUpdateDate());
                    }
                    if (dataRole.getCreationDate() != null) {
                        existingDataRole.setCreationDate(dataRole.getCreationDate());
                    }

                    return existingDataRole;
                }
            )
            .map(dataRoleRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dataRole.getId().toString())
        );
    }

    /**
     * {@code GET  /data-roles} : get all the dataRoles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dataRoles in body.
     */
    @GetMapping("/data-roles")
    public List<DataRole> getAllDataRoles() {
        log.debug("REST request to get all DataRoles");
        return dataRoleRepository.findAll();
    }

    /**
     * {@code GET  /data-roles/:id} : get the "id" dataRole.
     *
     * @param id the id of the dataRole to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dataRole, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/data-roles/{id}")
    public ResponseEntity<DataRole> getDataRole(@PathVariable Long id) {
        log.debug("REST request to get DataRole : {}", id);
        Optional<DataRole> dataRole = dataRoleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(dataRole);
    }

    /**
     * {@code DELETE  /data-roles/:id} : delete the "id" dataRole.
     *
     * @param id the id of the dataRole to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/data-roles/{id}")
    public ResponseEntity<Void> deleteDataRole(@PathVariable Long id) {
        log.debug("REST request to delete DataRole : {}", id);
        dataRoleRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
