package com.carmignac.data.dico.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.carmignac.data.dico.IntegrationTest;
import com.carmignac.data.dico.domain.DataService;
import com.carmignac.data.dico.repository.DataServiceRepository;
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
 * Integration tests for the {@link DataServiceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DataServiceResourceIT {

    private static final UUID DEFAULT_ID_SERVICE = UUID.randomUUID();
    private static final UUID UPDATED_ID_SERVICE = UUID.randomUUID();

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_UPDATE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_UPDATE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_CREATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/data-services";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DataServiceRepository dataServiceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDataServiceMockMvc;

    private DataService dataService;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DataService createEntity(EntityManager em) {
        DataService dataService = new DataService()
            .idService(DEFAULT_ID_SERVICE)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .updateDate(DEFAULT_UPDATE_DATE)
            .creationDate(DEFAULT_CREATION_DATE);
        return dataService;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DataService createUpdatedEntity(EntityManager em) {
        DataService dataService = new DataService()
            .idService(UPDATED_ID_SERVICE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);
        return dataService;
    }

    @BeforeEach
    public void initTest() {
        dataService = createEntity(em);
    }

    @Test
    @Transactional
    void createDataService() throws Exception {
        int databaseSizeBeforeCreate = dataServiceRepository.findAll().size();
        // Create the DataService
        restDataServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dataService)))
            .andExpect(status().isCreated());

        // Validate the DataService in the database
        List<DataService> dataServiceList = dataServiceRepository.findAll();
        assertThat(dataServiceList).hasSize(databaseSizeBeforeCreate + 1);
        DataService testDataService = dataServiceList.get(dataServiceList.size() - 1);
        assertThat(testDataService.getIdService()).isEqualTo(DEFAULT_ID_SERVICE);
        assertThat(testDataService.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testDataService.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDataService.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testDataService.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void createDataServiceWithExistingId() throws Exception {
        // Create the DataService with an existing ID
        dataService.setId(1L);

        int databaseSizeBeforeCreate = dataServiceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDataServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dataService)))
            .andExpect(status().isBadRequest());

        // Validate the DataService in the database
        List<DataService> dataServiceList = dataServiceRepository.findAll();
        assertThat(dataServiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDataServices() throws Exception {
        // Initialize the database
        dataServiceRepository.saveAndFlush(dataService);

        // Get all the dataServiceList
        restDataServiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dataService.getId().intValue())))
            .andExpect(jsonPath("$.[*].idService").value(hasItem(DEFAULT_ID_SERVICE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(DEFAULT_UPDATE_DATE.toString())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())));
    }

    @Test
    @Transactional
    void getDataService() throws Exception {
        // Initialize the database
        dataServiceRepository.saveAndFlush(dataService);

        // Get the dataService
        restDataServiceMockMvc
            .perform(get(ENTITY_API_URL_ID, dataService.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dataService.getId().intValue()))
            .andExpect(jsonPath("$.idService").value(DEFAULT_ID_SERVICE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.updateDate").value(DEFAULT_UPDATE_DATE.toString()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingDataService() throws Exception {
        // Get the dataService
        restDataServiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDataService() throws Exception {
        // Initialize the database
        dataServiceRepository.saveAndFlush(dataService);

        int databaseSizeBeforeUpdate = dataServiceRepository.findAll().size();

        // Update the dataService
        DataService updatedDataService = dataServiceRepository.findById(dataService.getId()).get();
        // Disconnect from session so that the updates on updatedDataService are not directly saved in db
        em.detach(updatedDataService);
        updatedDataService
            .idService(UPDATED_ID_SERVICE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);

        restDataServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDataService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDataService))
            )
            .andExpect(status().isOk());

        // Validate the DataService in the database
        List<DataService> dataServiceList = dataServiceRepository.findAll();
        assertThat(dataServiceList).hasSize(databaseSizeBeforeUpdate);
        DataService testDataService = dataServiceList.get(dataServiceList.size() - 1);
        assertThat(testDataService.getIdService()).isEqualTo(UPDATED_ID_SERVICE);
        assertThat(testDataService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDataService.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDataService.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testDataService.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void putNonExistingDataService() throws Exception {
        int databaseSizeBeforeUpdate = dataServiceRepository.findAll().size();
        dataService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDataServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, dataService.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dataService))
            )
            .andExpect(status().isBadRequest());

        // Validate the DataService in the database
        List<DataService> dataServiceList = dataServiceRepository.findAll();
        assertThat(dataServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDataService() throws Exception {
        int databaseSizeBeforeUpdate = dataServiceRepository.findAll().size();
        dataService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDataServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(dataService))
            )
            .andExpect(status().isBadRequest());

        // Validate the DataService in the database
        List<DataService> dataServiceList = dataServiceRepository.findAll();
        assertThat(dataServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDataService() throws Exception {
        int databaseSizeBeforeUpdate = dataServiceRepository.findAll().size();
        dataService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDataServiceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dataService)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the DataService in the database
        List<DataService> dataServiceList = dataServiceRepository.findAll();
        assertThat(dataServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDataServiceWithPatch() throws Exception {
        // Initialize the database
        dataServiceRepository.saveAndFlush(dataService);

        int databaseSizeBeforeUpdate = dataServiceRepository.findAll().size();

        // Update the dataService using partial update
        DataService partialUpdatedDataService = new DataService();
        partialUpdatedDataService.setId(dataService.getId());

        partialUpdatedDataService.name(UPDATED_NAME).updateDate(UPDATED_UPDATE_DATE);

        restDataServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDataService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDataService))
            )
            .andExpect(status().isOk());

        // Validate the DataService in the database
        List<DataService> dataServiceList = dataServiceRepository.findAll();
        assertThat(dataServiceList).hasSize(databaseSizeBeforeUpdate);
        DataService testDataService = dataServiceList.get(dataServiceList.size() - 1);
        assertThat(testDataService.getIdService()).isEqualTo(DEFAULT_ID_SERVICE);
        assertThat(testDataService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDataService.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDataService.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testDataService.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void fullUpdateDataServiceWithPatch() throws Exception {
        // Initialize the database
        dataServiceRepository.saveAndFlush(dataService);

        int databaseSizeBeforeUpdate = dataServiceRepository.findAll().size();

        // Update the dataService using partial update
        DataService partialUpdatedDataService = new DataService();
        partialUpdatedDataService.setId(dataService.getId());

        partialUpdatedDataService
            .idService(UPDATED_ID_SERVICE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);

        restDataServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDataService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDataService))
            )
            .andExpect(status().isOk());

        // Validate the DataService in the database
        List<DataService> dataServiceList = dataServiceRepository.findAll();
        assertThat(dataServiceList).hasSize(databaseSizeBeforeUpdate);
        DataService testDataService = dataServiceList.get(dataServiceList.size() - 1);
        assertThat(testDataService.getIdService()).isEqualTo(UPDATED_ID_SERVICE);
        assertThat(testDataService.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testDataService.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDataService.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testDataService.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingDataService() throws Exception {
        int databaseSizeBeforeUpdate = dataServiceRepository.findAll().size();
        dataService.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDataServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dataService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dataService))
            )
            .andExpect(status().isBadRequest());

        // Validate the DataService in the database
        List<DataService> dataServiceList = dataServiceRepository.findAll();
        assertThat(dataServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDataService() throws Exception {
        int databaseSizeBeforeUpdate = dataServiceRepository.findAll().size();
        dataService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDataServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(dataService))
            )
            .andExpect(status().isBadRequest());

        // Validate the DataService in the database
        List<DataService> dataServiceList = dataServiceRepository.findAll();
        assertThat(dataServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDataService() throws Exception {
        int databaseSizeBeforeUpdate = dataServiceRepository.findAll().size();
        dataService.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDataServiceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(dataService))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the DataService in the database
        List<DataService> dataServiceList = dataServiceRepository.findAll();
        assertThat(dataServiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDataService() throws Exception {
        // Initialize the database
        dataServiceRepository.saveAndFlush(dataService);

        int databaseSizeBeforeDelete = dataServiceRepository.findAll().size();

        // Delete the dataService
        restDataServiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, dataService.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DataService> dataServiceList = dataServiceRepository.findAll();
        assertThat(dataServiceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
