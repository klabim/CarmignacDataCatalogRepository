package com.carmignac.data.dico.web.rest;

import com.carmignac.data.dico.domain.SourcePriority;
import com.carmignac.data.dico.repository.SourcePriorityRepository;
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
 * REST controller for managing {@link com.carmignac.data.dico.domain.SourcePriority}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SourcePriorityResource {

    private final Logger log = LoggerFactory.getLogger(SourcePriorityResource.class);

    private static final String ENTITY_NAME = "sourcePriority";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SourcePriorityRepository sourcePriorityRepository;

    public SourcePriorityResource(SourcePriorityRepository sourcePriorityRepository) {
        this.sourcePriorityRepository = sourcePriorityRepository;
    }

    /**
     * {@code POST  /source-priorities} : Create a new sourcePriority.
     *
     * @param sourcePriority the sourcePriority to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sourcePriority, or with status {@code 400 (Bad Request)} if the sourcePriority has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/source-priorities")
    public ResponseEntity<SourcePriority> createSourcePriority(@Valid @RequestBody SourcePriority sourcePriority)
        throws URISyntaxException {
        log.debug("REST request to save SourcePriority : {}", sourcePriority);
        if (sourcePriority.getId() != null) {
            throw new BadRequestAlertException("A new sourcePriority cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SourcePriority result = sourcePriorityRepository.save(sourcePriority);
        return ResponseEntity
            .created(new URI("/api/source-priorities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /source-priorities/:id} : Updates an existing sourcePriority.
     *
     * @param id the id of the sourcePriority to save.
     * @param sourcePriority the sourcePriority to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sourcePriority,
     * or with status {@code 400 (Bad Request)} if the sourcePriority is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sourcePriority couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/source-priorities/{id}")
    public ResponseEntity<SourcePriority> updateSourcePriority(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SourcePriority sourcePriority
    ) throws URISyntaxException {
        log.debug("REST request to update SourcePriority : {}, {}", id, sourcePriority);
        if (sourcePriority.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sourcePriority.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sourcePriorityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SourcePriority result = sourcePriorityRepository.save(sourcePriority);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sourcePriority.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /source-priorities/:id} : Partial updates given fields of an existing sourcePriority, field will ignore if it is null
     *
     * @param id the id of the sourcePriority to save.
     * @param sourcePriority the sourcePriority to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sourcePriority,
     * or with status {@code 400 (Bad Request)} if the sourcePriority is not valid,
     * or with status {@code 404 (Not Found)} if the sourcePriority is not found,
     * or with status {@code 500 (Internal Server Error)} if the sourcePriority couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/source-priorities/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<SourcePriority> partialUpdateSourcePriority(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SourcePriority sourcePriority
    ) throws URISyntaxException {
        log.debug("REST request to partial update SourcePriority partially : {}, {}", id, sourcePriority);
        if (sourcePriority.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sourcePriority.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sourcePriorityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SourcePriority> result = sourcePriorityRepository
            .findById(sourcePriority.getId())
            .map(
                existingSourcePriority -> {
                    if (sourcePriority.getIdSourcePriority() != null) {
                        existingSourcePriority.setIdSourcePriority(sourcePriority.getIdSourcePriority());
                    }
                    if (sourcePriority.getName() != null) {
                        existingSourcePriority.setName(sourcePriority.getName());
                    }
                    if (sourcePriority.getDescription() != null) {
                        existingSourcePriority.setDescription(sourcePriority.getDescription());
                    }
                    if (sourcePriority.getUpdateDate() != null) {
                        existingSourcePriority.setUpdateDate(sourcePriority.getUpdateDate());
                    }
                    if (sourcePriority.getCreationDate() != null) {
                        existingSourcePriority.setCreationDate(sourcePriority.getCreationDate());
                    }

                    return existingSourcePriority;
                }
            )
            .map(sourcePriorityRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sourcePriority.getId().toString())
        );
    }

    /**
     * {@code GET  /source-priorities} : get all the sourcePriorities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sourcePriorities in body.
     */
    @GetMapping("/source-priorities")
    public List<SourcePriority> getAllSourcePriorities() {
        log.debug("REST request to get all SourcePriorities");
        return sourcePriorityRepository.findAll();
    }

    /**
     * {@code GET  /source-priorities/:id} : get the "id" sourcePriority.
     *
     * @param id the id of the sourcePriority to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sourcePriority, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/source-priorities/{id}")
    public ResponseEntity<SourcePriority> getSourcePriority(@PathVariable Long id) {
        log.debug("REST request to get SourcePriority : {}", id);
        Optional<SourcePriority> sourcePriority = sourcePriorityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sourcePriority);
    }

    /**
     * {@code DELETE  /source-priorities/:id} : delete the "id" sourcePriority.
     *
     * @param id the id of the sourcePriority to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/source-priorities/{id}")
    public ResponseEntity<Void> deleteSourcePriority(@PathVariable Long id) {
        log.debug("REST request to delete SourcePriority : {}", id);
        sourcePriorityRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
