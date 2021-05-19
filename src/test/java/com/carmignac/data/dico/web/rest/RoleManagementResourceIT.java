package com.carmignac.data.dico.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.carmignac.data.dico.IntegrationTest;
import com.carmignac.data.dico.domain.RoleManagement;
import com.carmignac.data.dico.repository.RoleManagementRepository;
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
 * Integration tests for the {@link RoleManagementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RoleManagementResourceIT {

    private static final UUID DEFAULT_ID_DATA_ROLE = UUID.randomUUID();
    private static final UUID UPDATED_ID_DATA_ROLE = UUID.randomUUID();

    private static final LocalDate DEFAULT_UPDATE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_UPDATE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_CREATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/role-managements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RoleManagementRepository roleManagementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRoleManagementMockMvc;

    private RoleManagement roleManagement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RoleManagement createEntity(EntityManager em) {
        RoleManagement roleManagement = new RoleManagement()
            .idDataRole(DEFAULT_ID_DATA_ROLE)
            .updateDate(DEFAULT_UPDATE_DATE)
            .creationDate(DEFAULT_CREATION_DATE);
        return roleManagement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RoleManagement createUpdatedEntity(EntityManager em) {
        RoleManagement roleManagement = new RoleManagement()
            .idDataRole(UPDATED_ID_DATA_ROLE)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);
        return roleManagement;
    }

    @BeforeEach
    public void initTest() {
        roleManagement = createEntity(em);
    }

    @Test
    @Transactional
    void createRoleManagement() throws Exception {
        int databaseSizeBeforeCreate = roleManagementRepository.findAll().size();
        // Create the RoleManagement
        restRoleManagementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(roleManagement))
            )
            .andExpect(status().isCreated());

        // Validate the RoleManagement in the database
        List<RoleManagement> roleManagementList = roleManagementRepository.findAll();
        assertThat(roleManagementList).hasSize(databaseSizeBeforeCreate + 1);
        RoleManagement testRoleManagement = roleManagementList.get(roleManagementList.size() - 1);
        assertThat(testRoleManagement.getIdDataRole()).isEqualTo(DEFAULT_ID_DATA_ROLE);
        assertThat(testRoleManagement.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testRoleManagement.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void createRoleManagementWithExistingId() throws Exception {
        // Create the RoleManagement with an existing ID
        roleManagement.setId(1L);

        int databaseSizeBeforeCreate = roleManagementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRoleManagementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(roleManagement))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoleManagement in the database
        List<RoleManagement> roleManagementList = roleManagementRepository.findAll();
        assertThat(roleManagementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRoleManagements() throws Exception {
        // Initialize the database
        roleManagementRepository.saveAndFlush(roleManagement);

        // Get all the roleManagementList
        restRoleManagementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(roleManagement.getId().intValue())))
            .andExpect(jsonPath("$.[*].idDataRole").value(hasItem(DEFAULT_ID_DATA_ROLE.toString())))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(DEFAULT_UPDATE_DATE.toString())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())));
    }

    @Test
    @Transactional
    void getRoleManagement() throws Exception {
        // Initialize the database
        roleManagementRepository.saveAndFlush(roleManagement);

        // Get the roleManagement
        restRoleManagementMockMvc
            .perform(get(ENTITY_API_URL_ID, roleManagement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(roleManagement.getId().intValue()))
            .andExpect(jsonPath("$.idDataRole").value(DEFAULT_ID_DATA_ROLE.toString()))
            .andExpect(jsonPath("$.updateDate").value(DEFAULT_UPDATE_DATE.toString()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingRoleManagement() throws Exception {
        // Get the roleManagement
        restRoleManagementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRoleManagement() throws Exception {
        // Initialize the database
        roleManagementRepository.saveAndFlush(roleManagement);

        int databaseSizeBeforeUpdate = roleManagementRepository.findAll().size();

        // Update the roleManagement
        RoleManagement updatedRoleManagement = roleManagementRepository.findById(roleManagement.getId()).get();
        // Disconnect from session so that the updates on updatedRoleManagement are not directly saved in db
        em.detach(updatedRoleManagement);
        updatedRoleManagement.idDataRole(UPDATED_ID_DATA_ROLE).updateDate(UPDATED_UPDATE_DATE).creationDate(UPDATED_CREATION_DATE);

        restRoleManagementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRoleManagement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRoleManagement))
            )
            .andExpect(status().isOk());

        // Validate the RoleManagement in the database
        List<RoleManagement> roleManagementList = roleManagementRepository.findAll();
        assertThat(roleManagementList).hasSize(databaseSizeBeforeUpdate);
        RoleManagement testRoleManagement = roleManagementList.get(roleManagementList.size() - 1);
        assertThat(testRoleManagement.getIdDataRole()).isEqualTo(UPDATED_ID_DATA_ROLE);
        assertThat(testRoleManagement.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testRoleManagement.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void putNonExistingRoleManagement() throws Exception {
        int databaseSizeBeforeUpdate = roleManagementRepository.findAll().size();
        roleManagement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoleManagementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, roleManagement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roleManagement))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoleManagement in the database
        List<RoleManagement> roleManagementList = roleManagementRepository.findAll();
        assertThat(roleManagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRoleManagement() throws Exception {
        int databaseSizeBeforeUpdate = roleManagementRepository.findAll().size();
        roleManagement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoleManagementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(roleManagement))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoleManagement in the database
        List<RoleManagement> roleManagementList = roleManagementRepository.findAll();
        assertThat(roleManagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRoleManagement() throws Exception {
        int databaseSizeBeforeUpdate = roleManagementRepository.findAll().size();
        roleManagement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoleManagementMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(roleManagement)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RoleManagement in the database
        List<RoleManagement> roleManagementList = roleManagementRepository.findAll();
        assertThat(roleManagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRoleManagementWithPatch() throws Exception {
        // Initialize the database
        roleManagementRepository.saveAndFlush(roleManagement);

        int databaseSizeBeforeUpdate = roleManagementRepository.findAll().size();

        // Update the roleManagement using partial update
        RoleManagement partialUpdatedRoleManagement = new RoleManagement();
        partialUpdatedRoleManagement.setId(roleManagement.getId());

        restRoleManagementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoleManagement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoleManagement))
            )
            .andExpect(status().isOk());

        // Validate the RoleManagement in the database
        List<RoleManagement> roleManagementList = roleManagementRepository.findAll();
        assertThat(roleManagementList).hasSize(databaseSizeBeforeUpdate);
        RoleManagement testRoleManagement = roleManagementList.get(roleManagementList.size() - 1);
        assertThat(testRoleManagement.getIdDataRole()).isEqualTo(DEFAULT_ID_DATA_ROLE);
        assertThat(testRoleManagement.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testRoleManagement.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void fullUpdateRoleManagementWithPatch() throws Exception {
        // Initialize the database
        roleManagementRepository.saveAndFlush(roleManagement);

        int databaseSizeBeforeUpdate = roleManagementRepository.findAll().size();

        // Update the roleManagement using partial update
        RoleManagement partialUpdatedRoleManagement = new RoleManagement();
        partialUpdatedRoleManagement.setId(roleManagement.getId());

        partialUpdatedRoleManagement.idDataRole(UPDATED_ID_DATA_ROLE).updateDate(UPDATED_UPDATE_DATE).creationDate(UPDATED_CREATION_DATE);

        restRoleManagementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRoleManagement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRoleManagement))
            )
            .andExpect(status().isOk());

        // Validate the RoleManagement in the database
        List<RoleManagement> roleManagementList = roleManagementRepository.findAll();
        assertThat(roleManagementList).hasSize(databaseSizeBeforeUpdate);
        RoleManagement testRoleManagement = roleManagementList.get(roleManagementList.size() - 1);
        assertThat(testRoleManagement.getIdDataRole()).isEqualTo(UPDATED_ID_DATA_ROLE);
        assertThat(testRoleManagement.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testRoleManagement.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingRoleManagement() throws Exception {
        int databaseSizeBeforeUpdate = roleManagementRepository.findAll().size();
        roleManagement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRoleManagementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, roleManagement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(roleManagement))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoleManagement in the database
        List<RoleManagement> roleManagementList = roleManagementRepository.findAll();
        assertThat(roleManagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRoleManagement() throws Exception {
        int databaseSizeBeforeUpdate = roleManagementRepository.findAll().size();
        roleManagement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoleManagementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(roleManagement))
            )
            .andExpect(status().isBadRequest());

        // Validate the RoleManagement in the database
        List<RoleManagement> roleManagementList = roleManagementRepository.findAll();
        assertThat(roleManagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRoleManagement() throws Exception {
        int databaseSizeBeforeUpdate = roleManagementRepository.findAll().size();
        roleManagement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRoleManagementMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(roleManagement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RoleManagement in the database
        List<RoleManagement> roleManagementList = roleManagementRepository.findAll();
        assertThat(roleManagementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRoleManagement() throws Exception {
        // Initialize the database
        roleManagementRepository.saveAndFlush(roleManagement);

        int databaseSizeBeforeDelete = roleManagementRepository.findAll().size();

        // Delete the roleManagement
        restRoleManagementMockMvc
            .perform(delete(ENTITY_API_URL_ID, roleManagement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RoleManagement> roleManagementList = roleManagementRepository.findAll();
        assertThat(roleManagementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
