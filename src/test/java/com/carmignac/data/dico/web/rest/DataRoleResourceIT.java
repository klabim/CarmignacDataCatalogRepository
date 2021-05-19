package com.carmignac.data.dico.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.carmignac.data.dico.IntegrationTest;
import com.carmignac.data.dico.domain.DataRole;
import com.carmignac.data.dico.repository.DataRoleRepository;
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
 * Integration tests for the {@link DataRoleResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DataRoleResourceIT {

    private static final UUID DEFAULT_ID_DATA_ROLE = UUID.randomUUID();
    private static final UUID UPDATED_ID_DATA_ROLE = UUID.randomUUID();

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_UPDATE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_UPDATE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_CREATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/data-roles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DataRoleRepository dataRoleRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDataRoleMockMvc;

    private DataRole dataRole;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DataRole createEntity(EntityManager em) {
        DataRole dataRole = new DataRole()
            .idDataRole(DEFAULT_ID_DATA_ROLE)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .updateDate(DEFAULT_UPDATE_DATE)
            .creationDate(DEFAULT_CREATION_DATE);
        return dataRole;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DataRole createUpdatedEntity(EntityManager em) {
        DataRole dataRole = new DataRole()
            .idDataRole(UPDATED_ID_DATA_ROLE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);
        return dataRole;
    }

    @BeforeEach
    public void initTest() {
        dataRole = createEntity(em);
    }

    @Test
    @Transactional
    void createDataRole() throws Exception {
        int databaseSizeBeforeCreate = dataRoleRepository.findAll().size();
        // Create the DataRole
        restDataRoleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dataRole)))
            .andExpect(status().isCreated());

        // Validate the DataRole in the database
        List<DataRole> dataRoleList = dataRoleRepository.findAll();
        assertThat(dataRoleList).hasSize(databaseSizeBeforeCreate + 1);
        DataRole testDataRole = dataRoleList.get(dataRoleList.size() - 1);
        assertThat(testDataRole.getIdDataRole()).isEqualTo(DEFAULT_ID_DATA_ROLE);
        assertThat(testDataRole.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDataRole.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDataRole.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testDataRole.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void createDataRoleWithExistingId() throws Exception {
        // Create the DataRole with an existing ID
        dataRole.setId(1L);

        int databaseSizeBeforeCreate = dataRoleRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDataRoleMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dataRole)))
            .andExpect(status().isBadRequest());

        // Validate the DataRole in the database
        List<DataRole> dataRoleList = dataRoleRepository.findAll();
        assertThat(dataRoleList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDataRoles() throws Exception {
        // Initialize the database
        dataRoleRepository.saveAndFlush(dataRole);

        // Get all the dataRoleList
        restDataRoleMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dataRole.getId().intValue())))
            .andExpect(jsonPath("$.[*].idDataRole").value(hasItem(DEFAULT_ID_DATA_ROLE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(DEFAULT_UPDATE_DATE.toString())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())));
    }

    @Test
    @Transactional
    void getDataRole() throws Exception {
        // Initialize the database
        dataRoleRepository.saveAndFlush(dataRole);

        // Get the dataRole
        restDataRoleMockMvc
            .perform(get(ENTITY_API_URL_ID, dataRole.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dataRole.getId().intValue()))
            .andExpect(jsonPath("$.idDataRole").value(DEFAULT_ID_DATA_ROLE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.updateDate").value(DEFAULT_UPDATE_DATE.toString()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDataRole() throws Exception {
        // Get the dataRole
        restDataRoleMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDataRole() throws Exception {
        // Initialize the database
        dataRoleRepository.saveAndFlush(dataRole);

        int databaseSizeBeforeUpdate = dataRoleRepository.findAll().size();

        // Update the dataRole
        DataRole updatedDataRole = dataRoleRepository.findById(dataRole.getId()).get();
        // Disconnect from session so that the updates on updatedDataRole are not directly saved in db
        em.detach(updatedDataRole);
        updatedDataRole
            .idDataRole(UPDATED_ID_DATA_ROLE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);

        restDataRoleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDataRole.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDataRole))
            )
            .andExpect(status().isOk());

        // Validate the DataRole in the database
        List<DataRole> dataRoleList = dataRoleRepository.findAll();
        assertThat(dataRoleList).hasSize(databaseSizeBeforeUpdate);
        DataRole testDataRole = dataRoleList.get(dataRoleList.size() - 1);
        assertThat(testDataRole.getIdDataRole()).isEqualTo(UPDATED_ID_DATA_ROLE);
        assertThat(testDataRole.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDataRole.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDataRole.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testDataRole.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void putNonExistingDataRole() throws Exception {
        int databaseSizeBeforeUpdate = dataRoleRepository.findAll().size();
        dataRole.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDataRoleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dataRole.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dataRole))
            )
            .andExpect(status().isBadRequest());

        // Validate the DataRole in the database
        List<DataRole> dataRoleList = dataRoleRepository.findAll();
        assertThat(dataRoleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDataRole() throws Exception {
        int databaseSizeBeforeUpdate = dataRoleRepository.findAll().size();
        dataRole.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDataRoleMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dataRole))
            )
            .andExpect(status().isBadRequest());

        // Validate the DataRole in the database
        List<DataRole> dataRoleList = dataRoleRepository.findAll();
        assertThat(dataRoleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDataRole() throws Exception {
        int databaseSizeBeforeUpdate = dataRoleRepository.findAll().size();
        dataRole.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDataRoleMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dataRole)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DataRole in the database
        List<DataRole> dataRoleList = dataRoleRepository.findAll();
        assertThat(dataRoleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDataRoleWithPatch() throws Exception {
        // Initialize the database
        dataRoleRepository.saveAndFlush(dataRole);

        int databaseSizeBeforeUpdate = dataRoleRepository.findAll().size();

        // Update the dataRole using partial update
        DataRole partialUpdatedDataRole = new DataRole();
        partialUpdatedDataRole.setId(dataRole.getId());

        partialUpdatedDataRole
            .idDataRole(UPDATED_ID_DATA_ROLE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);

        restDataRoleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDataRole.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDataRole))
            )
            .andExpect(status().isOk());

        // Validate the DataRole in the database
        List<DataRole> dataRoleList = dataRoleRepository.findAll();
        assertThat(dataRoleList).hasSize(databaseSizeBeforeUpdate);
        DataRole testDataRole = dataRoleList.get(dataRoleList.size() - 1);
        assertThat(testDataRole.getIdDataRole()).isEqualTo(UPDATED_ID_DATA_ROLE);
        assertThat(testDataRole.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDataRole.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDataRole.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testDataRole.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void fullUpdateDataRoleWithPatch() throws Exception {
        // Initialize the database
        dataRoleRepository.saveAndFlush(dataRole);

        int databaseSizeBeforeUpdate = dataRoleRepository.findAll().size();

        // Update the dataRole using partial update
        DataRole partialUpdatedDataRole = new DataRole();
        partialUpdatedDataRole.setId(dataRole.getId());

        partialUpdatedDataRole
            .idDataRole(UPDATED_ID_DATA_ROLE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);

        restDataRoleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDataRole.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDataRole))
            )
            .andExpect(status().isOk());

        // Validate the DataRole in the database
        List<DataRole> dataRoleList = dataRoleRepository.findAll();
        assertThat(dataRoleList).hasSize(databaseSizeBeforeUpdate);
        DataRole testDataRole = dataRoleList.get(dataRoleList.size() - 1);
        assertThat(testDataRole.getIdDataRole()).isEqualTo(UPDATED_ID_DATA_ROLE);
        assertThat(testDataRole.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDataRole.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDataRole.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testDataRole.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingDataRole() throws Exception {
        int databaseSizeBeforeUpdate = dataRoleRepository.findAll().size();
        dataRole.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDataRoleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dataRole.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dataRole))
            )
            .andExpect(status().isBadRequest());

        // Validate the DataRole in the database
        List<DataRole> dataRoleList = dataRoleRepository.findAll();
        assertThat(dataRoleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDataRole() throws Exception {
        int databaseSizeBeforeUpdate = dataRoleRepository.findAll().size();
        dataRole.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDataRoleMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dataRole))
            )
            .andExpect(status().isBadRequest());

        // Validate the DataRole in the database
        List<DataRole> dataRoleList = dataRoleRepository.findAll();
        assertThat(dataRoleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDataRole() throws Exception {
        int databaseSizeBeforeUpdate = dataRoleRepository.findAll().size();
        dataRole.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDataRoleMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(dataRole)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DataRole in the database
        List<DataRole> dataRoleList = dataRoleRepository.findAll();
        assertThat(dataRoleList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDataRole() throws Exception {
        // Initialize the database
        dataRoleRepository.saveAndFlush(dataRole);

        int databaseSizeBeforeDelete = dataRoleRepository.findAll().size();

        // Delete the dataRole
        restDataRoleMockMvc
            .perform(delete(ENTITY_API_URL_ID, dataRole.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DataRole> dataRoleList = dataRoleRepository.findAll();
        assertThat(dataRoleList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
