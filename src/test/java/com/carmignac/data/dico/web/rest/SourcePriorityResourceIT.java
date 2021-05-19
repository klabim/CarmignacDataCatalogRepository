package com.carmignac.data.dico.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.carmignac.data.dico.IntegrationTest;
import com.carmignac.data.dico.domain.SourcePriority;
import com.carmignac.data.dico.repository.SourcePriorityRepository;
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
 * Integration tests for the {@link SourcePriorityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SourcePriorityResourceIT {

    private static final UUID DEFAULT_ID_SOURCE_PRIORITY = UUID.randomUUID();
    private static final UUID UPDATED_ID_SOURCE_PRIORITY = UUID.randomUUID();

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_UPDATE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_UPDATE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_CREATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/source-priorities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SourcePriorityRepository sourcePriorityRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSourcePriorityMockMvc;

    private SourcePriority sourcePriority;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SourcePriority createEntity(EntityManager em) {
        SourcePriority sourcePriority = new SourcePriority()
            .idSourcePriority(DEFAULT_ID_SOURCE_PRIORITY)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .updateDate(DEFAULT_UPDATE_DATE)
            .creationDate(DEFAULT_CREATION_DATE);
        return sourcePriority;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SourcePriority createUpdatedEntity(EntityManager em) {
        SourcePriority sourcePriority = new SourcePriority()
            .idSourcePriority(UPDATED_ID_SOURCE_PRIORITY)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);
        return sourcePriority;
    }

    @BeforeEach
    public void initTest() {
        sourcePriority = createEntity(em);
    }

    @Test
    @Transactional
    void createSourcePriority() throws Exception {
        int databaseSizeBeforeCreate = sourcePriorityRepository.findAll().size();
        // Create the SourcePriority
        restSourcePriorityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sourcePriority))
            )
            .andExpect(status().isCreated());

        // Validate the SourcePriority in the database
        List<SourcePriority> sourcePriorityList = sourcePriorityRepository.findAll();
        assertThat(sourcePriorityList).hasSize(databaseSizeBeforeCreate + 1);
        SourcePriority testSourcePriority = sourcePriorityList.get(sourcePriorityList.size() - 1);
        assertThat(testSourcePriority.getIdSourcePriority()).isEqualTo(DEFAULT_ID_SOURCE_PRIORITY);
        assertThat(testSourcePriority.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSourcePriority.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSourcePriority.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testSourcePriority.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void createSourcePriorityWithExistingId() throws Exception {
        // Create the SourcePriority with an existing ID
        sourcePriority.setId(1L);

        int databaseSizeBeforeCreate = sourcePriorityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSourcePriorityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sourcePriority))
            )
            .andExpect(status().isBadRequest());

        // Validate the SourcePriority in the database
        List<SourcePriority> sourcePriorityList = sourcePriorityRepository.findAll();
        assertThat(sourcePriorityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSourcePriorities() throws Exception {
        // Initialize the database
        sourcePriorityRepository.saveAndFlush(sourcePriority);

        // Get all the sourcePriorityList
        restSourcePriorityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sourcePriority.getId().intValue())))
            .andExpect(jsonPath("$.[*].idSourcePriority").value(hasItem(DEFAULT_ID_SOURCE_PRIORITY.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(DEFAULT_UPDATE_DATE.toString())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())));
    }

    @Test
    @Transactional
    void getSourcePriority() throws Exception {
        // Initialize the database
        sourcePriorityRepository.saveAndFlush(sourcePriority);

        // Get the sourcePriority
        restSourcePriorityMockMvc
            .perform(get(ENTITY_API_URL_ID, sourcePriority.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sourcePriority.getId().intValue()))
            .andExpect(jsonPath("$.idSourcePriority").value(DEFAULT_ID_SOURCE_PRIORITY.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.updateDate").value(DEFAULT_UPDATE_DATE.toString()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSourcePriority() throws Exception {
        // Get the sourcePriority
        restSourcePriorityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSourcePriority() throws Exception {
        // Initialize the database
        sourcePriorityRepository.saveAndFlush(sourcePriority);

        int databaseSizeBeforeUpdate = sourcePriorityRepository.findAll().size();

        // Update the sourcePriority
        SourcePriority updatedSourcePriority = sourcePriorityRepository.findById(sourcePriority.getId()).get();
        // Disconnect from session so that the updates on updatedSourcePriority are not directly saved in db
        em.detach(updatedSourcePriority);
        updatedSourcePriority
            .idSourcePriority(UPDATED_ID_SOURCE_PRIORITY)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);

        restSourcePriorityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSourcePriority.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSourcePriority))
            )
            .andExpect(status().isOk());

        // Validate the SourcePriority in the database
        List<SourcePriority> sourcePriorityList = sourcePriorityRepository.findAll();
        assertThat(sourcePriorityList).hasSize(databaseSizeBeforeUpdate);
        SourcePriority testSourcePriority = sourcePriorityList.get(sourcePriorityList.size() - 1);
        assertThat(testSourcePriority.getIdSourcePriority()).isEqualTo(UPDATED_ID_SOURCE_PRIORITY);
        assertThat(testSourcePriority.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSourcePriority.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSourcePriority.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testSourcePriority.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void putNonExistingSourcePriority() throws Exception {
        int databaseSizeBeforeUpdate = sourcePriorityRepository.findAll().size();
        sourcePriority.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSourcePriorityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sourcePriority.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sourcePriority))
            )
            .andExpect(status().isBadRequest());

        // Validate the SourcePriority in the database
        List<SourcePriority> sourcePriorityList = sourcePriorityRepository.findAll();
        assertThat(sourcePriorityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSourcePriority() throws Exception {
        int databaseSizeBeforeUpdate = sourcePriorityRepository.findAll().size();
        sourcePriority.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSourcePriorityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sourcePriority))
            )
            .andExpect(status().isBadRequest());

        // Validate the SourcePriority in the database
        List<SourcePriority> sourcePriorityList = sourcePriorityRepository.findAll();
        assertThat(sourcePriorityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSourcePriority() throws Exception {
        int databaseSizeBeforeUpdate = sourcePriorityRepository.findAll().size();
        sourcePriority.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSourcePriorityMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sourcePriority)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SourcePriority in the database
        List<SourcePriority> sourcePriorityList = sourcePriorityRepository.findAll();
        assertThat(sourcePriorityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSourcePriorityWithPatch() throws Exception {
        // Initialize the database
        sourcePriorityRepository.saveAndFlush(sourcePriority);

        int databaseSizeBeforeUpdate = sourcePriorityRepository.findAll().size();

        // Update the sourcePriority using partial update
        SourcePriority partialUpdatedSourcePriority = new SourcePriority();
        partialUpdatedSourcePriority.setId(sourcePriority.getId());

        partialUpdatedSourcePriority.description(UPDATED_DESCRIPTION);

        restSourcePriorityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSourcePriority.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSourcePriority))
            )
            .andExpect(status().isOk());

        // Validate the SourcePriority in the database
        List<SourcePriority> sourcePriorityList = sourcePriorityRepository.findAll();
        assertThat(sourcePriorityList).hasSize(databaseSizeBeforeUpdate);
        SourcePriority testSourcePriority = sourcePriorityList.get(sourcePriorityList.size() - 1);
        assertThat(testSourcePriority.getIdSourcePriority()).isEqualTo(DEFAULT_ID_SOURCE_PRIORITY);
        assertThat(testSourcePriority.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSourcePriority.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSourcePriority.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testSourcePriority.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void fullUpdateSourcePriorityWithPatch() throws Exception {
        // Initialize the database
        sourcePriorityRepository.saveAndFlush(sourcePriority);

        int databaseSizeBeforeUpdate = sourcePriorityRepository.findAll().size();

        // Update the sourcePriority using partial update
        SourcePriority partialUpdatedSourcePriority = new SourcePriority();
        partialUpdatedSourcePriority.setId(sourcePriority.getId());

        partialUpdatedSourcePriority
            .idSourcePriority(UPDATED_ID_SOURCE_PRIORITY)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);

        restSourcePriorityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSourcePriority.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSourcePriority))
            )
            .andExpect(status().isOk());

        // Validate the SourcePriority in the database
        List<SourcePriority> sourcePriorityList = sourcePriorityRepository.findAll();
        assertThat(sourcePriorityList).hasSize(databaseSizeBeforeUpdate);
        SourcePriority testSourcePriority = sourcePriorityList.get(sourcePriorityList.size() - 1);
        assertThat(testSourcePriority.getIdSourcePriority()).isEqualTo(UPDATED_ID_SOURCE_PRIORITY);
        assertThat(testSourcePriority.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSourcePriority.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSourcePriority.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testSourcePriority.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingSourcePriority() throws Exception {
        int databaseSizeBeforeUpdate = sourcePriorityRepository.findAll().size();
        sourcePriority.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSourcePriorityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sourcePriority.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sourcePriority))
            )
            .andExpect(status().isBadRequest());

        // Validate the SourcePriority in the database
        List<SourcePriority> sourcePriorityList = sourcePriorityRepository.findAll();
        assertThat(sourcePriorityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSourcePriority() throws Exception {
        int databaseSizeBeforeUpdate = sourcePriorityRepository.findAll().size();
        sourcePriority.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSourcePriorityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sourcePriority))
            )
            .andExpect(status().isBadRequest());

        // Validate the SourcePriority in the database
        List<SourcePriority> sourcePriorityList = sourcePriorityRepository.findAll();
        assertThat(sourcePriorityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSourcePriority() throws Exception {
        int databaseSizeBeforeUpdate = sourcePriorityRepository.findAll().size();
        sourcePriority.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSourcePriorityMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sourcePriority))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SourcePriority in the database
        List<SourcePriority> sourcePriorityList = sourcePriorityRepository.findAll();
        assertThat(sourcePriorityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSourcePriority() throws Exception {
        // Initialize the database
        sourcePriorityRepository.saveAndFlush(sourcePriority);

        int databaseSizeBeforeDelete = sourcePriorityRepository.findAll().size();

        // Delete the sourcePriority
        restSourcePriorityMockMvc
            .perform(delete(ENTITY_API_URL_ID, sourcePriority.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SourcePriority> sourcePriorityList = sourcePriorityRepository.findAll();
        assertThat(sourcePriorityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
