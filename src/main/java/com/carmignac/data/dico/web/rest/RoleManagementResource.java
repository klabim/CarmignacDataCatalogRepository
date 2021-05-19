package com.carmignac.data.dico.web.rest;

import com.carmignac.data.dico.domain.RoleManagement;
import com.carmignac.data.dico.repository.RoleManagementRepository;
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
 * REST controller for managing {@link com.carmignac.data.dico.domain.RoleManagement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RoleManagementResource {

    private final Logger log = LoggerFactory.getLogger(RoleManagementResource.class);

    private static final String ENTITY_NAME = "roleManagement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RoleManagementRepository roleManagementRepository;

    public RoleManagementResource(RoleManagementRepository roleManagementRepository) {
        this.roleManagementRepository = roleManagementRepository;
    }

    /**
     * {@code POST  /role-managements} : Create a new roleManagement.
     *
     * @param roleManagement the roleManagement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new roleManagement, or with status {@code 400 (Bad Request)} if the roleManagement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/role-managements")
    public ResponseEntity<RoleManagement> createRoleManagement(@Valid @RequestBody RoleManagement roleManagement)
        throws URISyntaxException {
        log.debug("REST request to save RoleManagement : {}", roleManagement);
        if (roleManagement.getId() != null) {
            throw new BadRequestAlertException("A new roleManagement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RoleManagement result = roleManagementRepository.save(roleManagement);
        return ResponseEntity
            .created(new URI("/api/role-managements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /role-managements/:id} : Updates an existing roleManagement.
     *
     * @param id the id of the roleManagement to save.
     * @param roleManagement the roleManagement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated roleManagement,
     * or with status {@code 400 (Bad Request)} if the roleManagement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the roleManagement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/role-managements/{id}")
    public ResponseEntity<RoleManagement> updateRoleManagement(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody RoleManagement roleManagement
    ) throws URISyntaxException {
        log.debug("REST request to update RoleManagement : {}, {}", id, roleManagement);
        if (roleManagement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, roleManagement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roleManagementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RoleManagement result = roleManagementRepository.save(roleManagement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, roleManagement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /role-managements/:id} : Partial updates given fields of an existing roleManagement, field will ignore if it is null
     *
     * @param id the id of the roleManagement to save.
     * @param roleManagement the roleManagement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated roleManagement,
     * or with status {@code 400 (Bad Request)} if the roleManagement is not valid,
     * or with status {@code 404 (Not Found)} if the roleManagement is not found,
     * or with status {@code 500 (Internal Server Error)} if the roleManagement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/role-managements/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<RoleManagement> partialUpdateRoleManagement(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody RoleManagement roleManagement
    ) throws URISyntaxException {
        log.debug("REST request to partial update RoleManagement partially : {}, {}", id, roleManagement);
        if (roleManagement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, roleManagement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!roleManagementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RoleManagement> result = roleManagementRepository
            .findById(roleManagement.getId())
            .map(
                existingRoleManagement -> {
                    if (roleManagement.getIdDataRole() != null) {
                        existingRoleManagement.setIdDataRole(roleManagement.getIdDataRole());
                    }
                    if (roleManagement.getUpdateDate() != null) {
                        existingRoleManagement.setUpdateDate(roleManagement.getUpdateDate());
                    }
                    if (roleManagement.getCreationDate() != null) {
                        existingRoleManagement.setCreationDate(roleManagement.getCreationDate());
                    }

                    return existingRoleManagement;
                }
            )
            .map(roleManagementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, roleManagement.getId().toString())
        );
    }

    /**
     * {@code GET  /role-managements} : get all the roleManagements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of roleManagements in body.
     */
    @GetMapping("/role-managements")
    public List<RoleManagement> getAllRoleManagements() {
        log.debug("REST request to get all RoleManagements");
        return roleManagementRepository.findAll();
    }

    /**
     * {@code GET  /role-managements/:id} : get the "id" roleManagement.
     *
     * @param id the id of the roleManagement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the roleManagement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/role-managements/{id}")
    public ResponseEntity<RoleManagement> getRoleManagement(@PathVariable Long id) {
        log.debug("REST request to get RoleManagement : {}", id);
        Optional<RoleManagement> roleManagement = roleManagementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(roleManagement);
    }

    /**
     * {@code DELETE  /role-managements/:id} : delete the "id" roleManagement.
     *
     * @param id the id of the roleManagement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/role-managements/{id}")
    public ResponseEntity<Void> deleteRoleManagement(@PathVariable Long id) {
        log.debug("REST request to delete RoleManagement : {}", id);
        roleManagementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
