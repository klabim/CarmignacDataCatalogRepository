package com.carmignac.data.dico.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.carmignac.data.dico.IntegrationTest;
import com.carmignac.data.dico.domain.BusinessObject;
import com.carmignac.data.dico.repository.BusinessObjectRepository;
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
 * Integration tests for the {@link BusinessObjectResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BusinessObjectResourceIT {

    private static final UUID DEFAULT_ID_BO = UUID.randomUUID();
    private static final UUID UPDATED_ID_BO = UUID.randomUUID();

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DEFINITION = "AAAAAAAAAA";
    private static final String UPDATED_DEFINITION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_UPDATE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_UPDATE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_CREATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/business-objects";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BusinessObjectRepository businessObjectRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBusinessObjectMockMvc;

    private BusinessObject businessObject;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessObject createEntity(EntityManager em) {
        BusinessObject businessObject = new BusinessObject()
            .idBo(DEFAULT_ID_BO)
            .name(DEFAULT_NAME)
            .definition(DEFAULT_DEFINITION)
            .updateDate(DEFAULT_UPDATE_DATE)
            .creationDate(DEFAULT_CREATION_DATE);
        return businessObject;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BusinessObject createUpdatedEntity(EntityManager em) {
        BusinessObject businessObject = new BusinessObject()
            .idBo(UPDATED_ID_BO)
            .name(UPDATED_NAME)
            .definition(UPDATED_DEFINITION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);
        return businessObject;
    }

    @BeforeEach
    public void initTest() {
        businessObject = createEntity(em);
    }

    @Test
    @Transactional
    void createBusinessObject() throws Exception {
        int databaseSizeBeforeCreate = businessObjectRepository.findAll().size();
        // Create the BusinessObject
        restBusinessObjectMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(businessObject))
            )
            .andExpect(status().isCreated());

        // Validate the BusinessObject in the database
        List<BusinessObject> businessObjectList = businessObjectRepository.findAll();
        assertThat(businessObjectList).hasSize(databaseSizeBeforeCreate + 1);
        BusinessObject testBusinessObject = businessObjectList.get(businessObjectList.size() - 1);
        assertThat(testBusinessObject.getIdBo()).isEqualTo(DEFAULT_ID_BO);
        assertThat(testBusinessObject.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBusinessObject.getDefinition()).isEqualTo(DEFAULT_DEFINITION);
        assertThat(testBusinessObject.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testBusinessObject.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void createBusinessObjectWithExistingId() throws Exception {
        // Create the BusinessObject with an existing ID
        businessObject.setId(1L);

        int databaseSizeBeforeCreate = businessObjectRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBusinessObjectMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(businessObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessObject in the database
        List<BusinessObject> businessObjectList = businessObjectRepository.findAll();
        assertThat(businessObjectList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBusinessObjects() throws Exception {
        // Initialize the database
        businessObjectRepository.saveAndFlush(businessObject);

        // Get all the businessObjectList
        restBusinessObjectMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(businessObject.getId().intValue())))
            .andExpect(jsonPath("$.[*].idBo").value(hasItem(DEFAULT_ID_BO.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].definition").value(hasItem(DEFAULT_DEFINITION)))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(DEFAULT_UPDATE_DATE.toString())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())));
    }

    @Test
    @Transactional
    void getBusinessObject() throws Exception {
        // Initialize the database
        businessObjectRepository.saveAndFlush(businessObject);

        // Get the businessObject
        restBusinessObjectMockMvc
            .perform(get(ENTITY_API_URL_ID, businessObject.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(businessObject.getId().intValue()))
            .andExpect(jsonPath("$.idBo").value(DEFAULT_ID_BO.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.definition").value(DEFAULT_DEFINITION))
            .andExpect(jsonPath("$.updateDate").value(DEFAULT_UPDATE_DATE.toString()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBusinessObject() throws Exception {
        // Get the businessObject
        restBusinessObjectMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBusinessObject() throws Exception {
        // Initialize the database
        businessObjectRepository.saveAndFlush(businessObject);

        int databaseSizeBeforeUpdate = businessObjectRepository.findAll().size();

        // Update the businessObject
        BusinessObject updatedBusinessObject = businessObjectRepository.findById(businessObject.getId()).get();
        // Disconnect from session so that the updates on updatedBusinessObject are not directly saved in db
        em.detach(updatedBusinessObject);
        updatedBusinessObject
            .idBo(UPDATED_ID_BO)
            .name(UPDATED_NAME)
            .definition(UPDATED_DEFINITION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);

        restBusinessObjectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBusinessObject.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBusinessObject))
            )
            .andExpect(status().isOk());

        // Validate the BusinessObject in the database
        List<BusinessObject> businessObjectList = businessObjectRepository.findAll();
        assertThat(businessObjectList).hasSize(databaseSizeBeforeUpdate);
        BusinessObject testBusinessObject = businessObjectList.get(businessObjectList.size() - 1);
        assertThat(testBusinessObject.getIdBo()).isEqualTo(UPDATED_ID_BO);
        assertThat(testBusinessObject.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBusinessObject.getDefinition()).isEqualTo(UPDATED_DEFINITION);
        assertThat(testBusinessObject.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testBusinessObject.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void putNonExistingBusinessObject() throws Exception {
        int databaseSizeBeforeUpdate = businessObjectRepository.findAll().size();
        businessObject.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusinessObjectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, businessObject.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(businessObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessObject in the database
        List<BusinessObject> businessObjectList = businessObjectRepository.findAll();
        assertThat(businessObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBusinessObject() throws Exception {
        int databaseSizeBeforeUpdate = businessObjectRepository.findAll().size();
        businessObject.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessObjectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(businessObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessObject in the database
        List<BusinessObject> businessObjectList = businessObjectRepository.findAll();
        assertThat(businessObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBusinessObject() throws Exception {
        int databaseSizeBeforeUpdate = businessObjectRepository.findAll().size();
        businessObject.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessObjectMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(businessObject)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BusinessObject in the database
        List<BusinessObject> businessObjectList = businessObjectRepository.findAll();
        assertThat(businessObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBusinessObjectWithPatch() throws Exception {
        // Initialize the database
        businessObjectRepository.saveAndFlush(businessObject);

        int databaseSizeBeforeUpdate = businessObjectRepository.findAll().size();

        // Update the businessObject using partial update
        BusinessObject partialUpdatedBusinessObject = new BusinessObject();
        partialUpdatedBusinessObject.setId(businessObject.getId());

        partialUpdatedBusinessObject.name(UPDATED_NAME).definition(UPDATED_DEFINITION);

        restBusinessObjectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBusinessObject.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessObject))
            )
            .andExpect(status().isOk());

        // Validate the BusinessObject in the database
        List<BusinessObject> businessObjectList = businessObjectRepository.findAll();
        assertThat(businessObjectList).hasSize(databaseSizeBeforeUpdate);
        BusinessObject testBusinessObject = businessObjectList.get(businessObjectList.size() - 1);
        assertThat(testBusinessObject.getIdBo()).isEqualTo(DEFAULT_ID_BO);
        assertThat(testBusinessObject.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBusinessObject.getDefinition()).isEqualTo(UPDATED_DEFINITION);
        assertThat(testBusinessObject.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testBusinessObject.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void fullUpdateBusinessObjectWithPatch() throws Exception {
        // Initialize the database
        businessObjectRepository.saveAndFlush(businessObject);

        int databaseSizeBeforeUpdate = businessObjectRepository.findAll().size();

        // Update the businessObject using partial update
        BusinessObject partialUpdatedBusinessObject = new BusinessObject();
        partialUpdatedBusinessObject.setId(businessObject.getId());

        partialUpdatedBusinessObject
            .idBo(UPDATED_ID_BO)
            .name(UPDATED_NAME)
            .definition(UPDATED_DEFINITION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);

        restBusinessObjectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBusinessObject.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBusinessObject))
            )
            .andExpect(status().isOk());

        // Validate the BusinessObject in the database
        List<BusinessObject> businessObjectList = businessObjectRepository.findAll();
        assertThat(businessObjectList).hasSize(databaseSizeBeforeUpdate);
        BusinessObject testBusinessObject = businessObjectList.get(businessObjectList.size() - 1);
        assertThat(testBusinessObject.getIdBo()).isEqualTo(UPDATED_ID_BO);
        assertThat(testBusinessObject.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBusinessObject.getDefinition()).isEqualTo(UPDATED_DEFINITION);
        assertThat(testBusinessObject.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testBusinessObject.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingBusinessObject() throws Exception {
        int databaseSizeBeforeUpdate = businessObjectRepository.findAll().size();
        businessObject.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBusinessObjectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, businessObject.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(businessObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessObject in the database
        List<BusinessObject> businessObjectList = businessObjectRepository.findAll();
        assertThat(businessObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBusinessObject() throws Exception {
        int databaseSizeBeforeUpdate = businessObjectRepository.findAll().size();
        businessObject.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessObjectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(businessObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the BusinessObject in the database
        List<BusinessObject> businessObjectList = businessObjectRepository.findAll();
        assertThat(businessObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBusinessObject() throws Exception {
        int databaseSizeBeforeUpdate = businessObjectRepository.findAll().size();
        businessObject.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBusinessObjectMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(businessObject))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BusinessObject in the database
        List<BusinessObject> businessObjectList = businessObjectRepository.findAll();
        assertThat(businessObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBusinessObject() throws Exception {
        // Initialize the database
        businessObjectRepository.saveAndFlush(businessObject);

        int databaseSizeBeforeDelete = businessObjectRepository.findAll().size();

        // Delete the businessObject
        restBusinessObjectMockMvc
            .perform(delete(ENTITY_API_URL_ID, businessObject.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BusinessObject> businessObjectList = businessObjectRepository.findAll();
        assertThat(businessObjectList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
