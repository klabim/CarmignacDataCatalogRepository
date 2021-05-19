package com.carmignac.data.dico.web.rest;

import com.carmignac.data.dico.domain.OrderedSource;
import com.carmignac.data.dico.repository.OrderedSourceRepository;
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
 * REST controller for managing {@link com.carmignac.data.dico.domain.OrderedSource}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrderedSourceResource {

    private final Logger log = LoggerFactory.getLogger(OrderedSourceResource.class);

    private static final String ENTITY_NAME = "orderedSource";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderedSourceRepository orderedSourceRepository;

    public OrderedSourceResource(OrderedSourceRepository orderedSourceRepository) {
        this.orderedSourceRepository = orderedSourceRepository;
    }

    /**
     * {@code POST  /ordered-sources} : Create a new orderedSource.
     *
     * @param orderedSource the orderedSource to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderedSource, or with status {@code 400 (Bad Request)} if the orderedSource has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ordered-sources")
    public ResponseEntity<OrderedSource> createOrderedSource(@Valid @RequestBody OrderedSource orderedSource) throws URISyntaxException {
        log.debug("REST request to save OrderedSource : {}", orderedSource);
        if (orderedSource.getId() != null) {
            throw new BadRequestAlertException("A new orderedSource cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OrderedSource result = orderedSourceRepository.save(orderedSource);
        return ResponseEntity
            .created(new URI("/api/ordered-sources/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ordered-sources/:id} : Updates an existing orderedSource.
     *
     * @param id the id of the orderedSource to save.
     * @param orderedSource the orderedSource to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderedSource,
     * or with status {@code 400 (Bad Request)} if the orderedSource is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderedSource couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ordered-sources/{id}")
    public ResponseEntity<OrderedSource> updateOrderedSource(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody OrderedSource orderedSource
    ) throws URISyntaxException {
        log.debug("REST request to update OrderedSource : {}, {}", id, orderedSource);
        if (orderedSource.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderedSource.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderedSourceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        OrderedSource result = orderedSourceRepository.save(orderedSource);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderedSource.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ordered-sources/:id} : Partial updates given fields of an existing orderedSource, field will ignore if it is null
     *
     * @param id the id of the orderedSource to save.
     * @param orderedSource the orderedSource to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderedSource,
     * or with status {@code 400 (Bad Request)} if the orderedSource is not valid,
     * or with status {@code 404 (Not Found)} if the orderedSource is not found,
     * or with status {@code 500 (Internal Server Error)} if the orderedSource couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ordered-sources/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<OrderedSource> partialUpdateOrderedSource(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody OrderedSource orderedSource
    ) throws URISyntaxException {
        log.debug("REST request to partial update OrderedSource partially : {}, {}", id, orderedSource);
        if (orderedSource.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, orderedSource.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!orderedSourceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<OrderedSource> result = orderedSourceRepository
            .findById(orderedSource.getId())
            .map(
                existingOrderedSource -> {
                    if (orderedSource.getOrderSource() != null) {
                        existingOrderedSource.setOrderSource(orderedSource.getOrderSource());
                    }
                    if (orderedSource.getUpdateDate() != null) {
                        existingOrderedSource.setUpdateDate(orderedSource.getUpdateDate());
                    }
                    if (orderedSource.getCreationDate() != null) {
                        existingOrderedSource.setCreationDate(orderedSource.getCreationDate());
                    }

                    return existingOrderedSource;
                }
            )
            .map(orderedSourceRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderedSource.getId().toString())
        );
    }

    /**
     * {@code GET  /ordered-sources} : get all the orderedSources.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderedSources in body.
     */
    @GetMapping("/ordered-sources")
    public List<OrderedSource> getAllOrderedSources() {
        log.debug("REST request to get all OrderedSources");
        return orderedSourceRepository.findAll();
    }

    /**
     * {@code GET  /ordered-sources/:id} : get the "id" orderedSource.
     *
     * @param id the id of the orderedSource to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderedSource, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ordered-sources/{id}")
    public ResponseEntity<OrderedSource> getOrderedSource(@PathVariable Long id) {
        log.debug("REST request to get OrderedSource : {}", id);
        Optional<OrderedSource> orderedSource = orderedSourceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(orderedSource);
    }

    /**
     * {@code DELETE  /ordered-sources/:id} : delete the "id" orderedSource.
     *
     * @param id the id of the orderedSource to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ordered-sources/{id}")
    public ResponseEntity<Void> deleteOrderedSource(@PathVariable Long id) {
        log.debug("REST request to delete OrderedSource : {}", id);
        orderedSourceRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
