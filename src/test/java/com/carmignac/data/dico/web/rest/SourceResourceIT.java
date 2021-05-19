package com.carmignac.data.dico.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.carmignac.data.dico.IntegrationTest;
import com.carmignac.data.dico.domain.Source;
import com.carmignac.data.dico.repository.SourceRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SourceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SourceResourceIT {

    private static final UUID DEFAULT_ID_GLODEN = UUID.randomUUID();
    private static final UUID UPDATED_ID_GLODEN = UUID.randomUUID();

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_UPDATE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_UPDATE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_CREATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/sources";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SourceRepository sourceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSourceMockMvc;

    private Source source;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Source createEntity(EntityManager em) {
        Source source = new Source()
            .idGloden(DEFAULT_ID_GLODEN)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .updateDate(DEFAULT_UPDATE_DATE)
            .creationDate(DEFAULT_CREATION_DATE);
        return source;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Source createUpdatedEntity(EntityManager em) {
        Source source = new Source()
            .idGloden(UPDATED_ID_GLODEN)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);
        return source;
    }

    @BeforeEach
    public void initTest() {
        source = createEntity(em);
    }

    @Test
    @Transactional
    void createSource() throws Exception {
        int databaseSizeBeforeCreate = sourceRepository.findAll().size();
        // Create the Source
        restSourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(source)))
            .andExpect(status().isCreated());

        // Validate the Source in the database
        List<Source> sourceList = sourceRepository.findAll();
        assertThat(sourceList).hasSize(databaseSizeBeforeCreate + 1);
        Source testSource = sourceList.get(sourceList.size() - 1);
        assertThat(testSource.getIdGloden()).isEqualTo(DEFAULT_ID_GLODEN);
        assertThat(testSource.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSource.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSource.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testSource.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void createSourceWithExistingId() throws Exception {
        // Create the Source with an existing ID
        source.setId(1L);

        int databaseSizeBeforeCreate = sourceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(source)))
            .andExpect(status().isBadRequest());

        // Validate the Source in the database
        List<Source> sourceList = sourceRepository.findAll();
        assertThat(sourceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSources() throws Exception {
        // Initialize the database
        sourceRepository.saveAndFlush(source);

        // Get all the sourceList
        restSourceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(source.getId().intValue())))
            .andExpect(jsonPath("$.[*].idGloden").value(hasItem(DEFAULT_ID_GLODEN.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(DEFAULT_UPDATE_DATE.toString())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())));
    }

    @Test
    @Transactional
    void getSource() throws Exception {
        // Initialize the database
        sourceRepository.saveAndFlush(source);

        // Get the source
        restSourceMockMvc
            .perform(get(ENTITY_API_URL_ID, source.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(source.getId().intValue()))
            .andExpect(jsonPath("$.idGloden").value(DEFAULT_ID_GLODEN.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.updateDate").value(DEFAULT_UPDATE_DATE.toString()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSource() throws Exception {
        // Get the source
        restSourceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSource() throws Exception {
        // Initialize the database
        sourceRepository.saveAndFlush(source);

        int databaseSizeBeforeUpdate = sourceRepository.findAll().size();

        // Update the source
        Source updatedSource = sourceRepository.findById(source.getId()).get();
        // Disconnect from session so that the updates on updatedSource are not directly saved in db
        em.detach(updatedSource);
        updatedSource
            .idGloden(UPDATED_ID_GLODEN)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);

        restSourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSource.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSource))
            )
            .andExpect(status().isOk());

        // Validate the Source in the database
        List<Source> sourceList = sourceRepository.findAll();
        assertThat(sourceList).hasSize(databaseSizeBeforeUpdate);
        Source testSource = sourceList.get(sourceList.size() - 1);
        assertThat(testSource.getIdGloden()).isEqualTo(UPDATED_ID_GLODEN);
        assertThat(testSource.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSource.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSource.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testSource.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void putNonExistingSource() throws Exception {
        int databaseSizeBeforeUpdate = sourceRepository.findAll().size();
        source.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, source.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(source))
            )
            .andExpect(status().isBadRequest());

        // Validate the Source in the database
        List<Source> sourceList = sourceRepository.findAll();
        assertThat(sourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSource() throws Exception {
        int databaseSizeBeforeUpdate = sourceRepository.findAll().size();
        source.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(source))
            )
            .andExpect(status().isBadRequest());

        // Validate the Source in the database
        List<Source> sourceList = sourceRepository.findAll();
        assertThat(sourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSource() throws Exception {
        int databaseSizeBeforeUpdate = sourceRepository.findAll().size();
        source.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSourceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(source)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Source in the database
        List<Source> sourceList = sourceRepository.findAll();
        assertThat(sourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSourceWithPatch() throws Exception {
        // Initialize the database
        sourceRepository.saveAndFlush(source);

        int databaseSizeBeforeUpdate = sourceRepository.findAll().size();

        // Update the source using partial update
        Source partialUpdatedSource = new Source();
        partialUpdatedSource.setId(source.getId());

        partialUpdatedSource.updateDate(UPDATED_UPDATE_DATE);

        restSourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSource.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSource))
            )
            .andExpect(status().isOk());

        // Validate the Source in the database
        List<Source> sourceList = sourceRepository.findAll();
        assertThat(sourceList).hasSize(databaseSizeBeforeUpdate);
        Source testSource = sourceList.get(sourceList.size() - 1);
        assertThat(testSource.getIdGloden()).isEqualTo(DEFAULT_ID_GLODEN);
        assertThat(testSource.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSource.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSource.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testSource.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void fullUpdateSourceWithPatch() throws Exception {
        // Initialize the database
        sourceRepository.saveAndFlush(source);

        int databaseSizeBeforeUpdate = sourceRepository.findAll().size();

        // Update the source using partial update
        Source partialUpdatedSource = new Source();
        partialUpdatedSource.setId(source.getId());

        partialUpdatedSource
            .idGloden(UPDATED_ID_GLODEN)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);

        restSourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSource.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSource))
            )
            .andExpect(status().isOk());

        // Validate the Source in the database
        List<Source> sourceList = sourceRepository.findAll();
        assertThat(sourceList).hasSize(databaseSizeBeforeUpdate);
        Source testSource = sourceList.get(sourceList.size() - 1);
        assertThat(testSource.getIdGloden()).isEqualTo(UPDATED_ID_GLODEN);
        assertThat(testSource.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSource.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSource.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testSource.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingSource() throws Exception {
        int databaseSizeBeforeUpdate = sourceRepository.findAll().size();
        source.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, source.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(source))
            )
            .andExpect(status().isBadRequest());

        // Validate the Source in the database
        List<Source> sourceList = sourceRepository.findAll();
        assertThat(sourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSource() throws Exception {
        int databaseSizeBeforeUpdate = sourceRepository.findAll().size();
        source.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(source))
            )
            .andExpect(status().isBadRequest());

        // Validate the Source in the database
        List<Source> sourceList = sourceRepository.findAll();
        assertThat(sourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSource() throws Exception {
        int databaseSizeBeforeUpdate = sourceRepository.findAll().size();
        source.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSourceMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(source)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Source in the database
        List<Source> sourceList = sourceRepository.findAll();
        assertThat(sourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSource() throws Exception {
        // Initialize the database
        sourceRepository.saveAndFlush(source);

        int databaseSizeBeforeDelete = sourceRepository.findAll().size();

        // Delete the source
        restSourceMockMvc
            .perform(delete(ENTITY_API_URL_ID, source.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Source> sourceList = sourceRepository.findAll();
        assertThat(sourceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
