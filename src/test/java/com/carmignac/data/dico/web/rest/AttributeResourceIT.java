package com.carmignac.data.dico.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.carmignac.data.dico.IntegrationTest;
import com.carmignac.data.dico.domain.Attribute;
import com.carmignac.data.dico.repository.AttributeRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
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
 * Integration tests for the {@link AttributeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AttributeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_INTERNAL_EXTERNAL = "AAAAAAAAAA";
    private static final String UPDATED_INTERNAL_EXTERNAL = "BBBBBBBBBB";

    private static final String DEFAULT_CARDINALITY = "AAAAAAAAAA";
    private static final String UPDATED_CARDINALITY = "BBBBBBBBBB";

    private static final String DEFAULT_ENUMERATION = "AAAAAAAAAA";
    private static final String UPDATED_ENUMERATION = "BBBBBBBBBB";

    private static final String DEFAULT_L_PATTERN = "AAAAAAAAAA";
    private static final String UPDATED_L_PATTERN = "BBBBBBBBBB";

    private static final String DEFAULT_LONG_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LONG_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DEFINITION = "AAAAAAAAAA";
    private static final String UPDATED_DEFINITION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_UPDATE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_UPDATE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_CREATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/attributes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private AttributeRepository attributeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAttributeMockMvc;

    private Attribute attribute;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Attribute createEntity(EntityManager em) {
        Attribute attribute = new Attribute()
            .name(DEFAULT_NAME)
            .internalExternal(DEFAULT_INTERNAL_EXTERNAL)
            .cardinality(DEFAULT_CARDINALITY)
            .enumeration(DEFAULT_ENUMERATION)
            .lPattern(DEFAULT_L_PATTERN)
            .longName(DEFAULT_LONG_NAME)
            .definition(DEFAULT_DEFINITION)
            .updateDate(DEFAULT_UPDATE_DATE)
            .creationDate(DEFAULT_CREATION_DATE);
        return attribute;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Attribute createUpdatedEntity(EntityManager em) {
        Attribute attribute = new Attribute()
            .name(UPDATED_NAME)
            .internalExternal(UPDATED_INTERNAL_EXTERNAL)
            .cardinality(UPDATED_CARDINALITY)
            .enumeration(UPDATED_ENUMERATION)
            .lPattern(UPDATED_L_PATTERN)
            .longName(UPDATED_LONG_NAME)
            .definition(UPDATED_DEFINITION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);
        return attribute;
    }

    @BeforeEach
    public void initTest() {
        attribute = createEntity(em);
    }

    @Test
    @Transactional
    void createAttribute() throws Exception {
        int databaseSizeBeforeCreate = attributeRepository.findAll().size();
        // Create the Attribute
        restAttributeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(attribute)))
            .andExpect(status().isCreated());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeCreate + 1);
        Attribute testAttribute = attributeList.get(attributeList.size() - 1);
        assertThat(testAttribute.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAttribute.getInternalExternal()).isEqualTo(DEFAULT_INTERNAL_EXTERNAL);
        assertThat(testAttribute.getCardinality()).isEqualTo(DEFAULT_CARDINALITY);
        assertThat(testAttribute.getEnumeration()).isEqualTo(DEFAULT_ENUMERATION);
        assertThat(testAttribute.getlPattern()).isEqualTo(DEFAULT_L_PATTERN);
        assertThat(testAttribute.getLongName()).isEqualTo(DEFAULT_LONG_NAME);
        assertThat(testAttribute.getDefinition()).isEqualTo(DEFAULT_DEFINITION);
        assertThat(testAttribute.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testAttribute.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void createAttributeWithExistingId() throws Exception {
        // Create the Attribute with an existing ID
        attributeRepository.saveAndFlush(attribute);

        int databaseSizeBeforeCreate = attributeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAttributeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(attribute)))
            .andExpect(status().isBadRequest());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAttributes() throws Exception {
        // Initialize the database
        attributeRepository.saveAndFlush(attribute);

        // Get all the attributeList
        restAttributeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(attribute.getId().toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].internalExternal").value(hasItem(DEFAULT_INTERNAL_EXTERNAL)))
            .andExpect(jsonPath("$.[*].cardinality").value(hasItem(DEFAULT_CARDINALITY)))
            .andExpect(jsonPath("$.[*].enumeration").value(hasItem(DEFAULT_ENUMERATION)))
            .andExpect(jsonPath("$.[*].lPattern").value(hasItem(DEFAULT_L_PATTERN)))
            .andExpect(jsonPath("$.[*].longName").value(hasItem(DEFAULT_LONG_NAME)))
            .andExpect(jsonPath("$.[*].definition").value(hasItem(DEFAULT_DEFINITION)))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(DEFAULT_UPDATE_DATE.toString())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())));
    }

    @Test
    @Transactional
    void getAttribute() throws Exception {
        // Initialize the database
        attributeRepository.saveAndFlush(attribute);

        // Get the attribute
        restAttributeMockMvc
            .perform(get(ENTITY_API_URL_ID, attribute.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(attribute.getId().toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.internalExternal").value(DEFAULT_INTERNAL_EXTERNAL))
            .andExpect(jsonPath("$.cardinality").value(DEFAULT_CARDINALITY))
            .andExpect(jsonPath("$.enumeration").value(DEFAULT_ENUMERATION))
            .andExpect(jsonPath("$.lPattern").value(DEFAULT_L_PATTERN))
            .andExpect(jsonPath("$.longName").value(DEFAULT_LONG_NAME))
            .andExpect(jsonPath("$.definition").value(DEFAULT_DEFINITION))
            .andExpect(jsonPath("$.updateDate").value(DEFAULT_UPDATE_DATE.toString()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAttribute() throws Exception {
        // Get the attribute
        restAttributeMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAttribute() throws Exception {
        // Initialize the database
        attributeRepository.saveAndFlush(attribute);

        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();

        // Update the attribute
        Attribute updatedAttribute = attributeRepository.findById(attribute.getId()).get();
        // Disconnect from session so that the updates on updatedAttribute are not directly saved in db
        em.detach(updatedAttribute);
        updatedAttribute
            .name(UPDATED_NAME)
            .internalExternal(UPDATED_INTERNAL_EXTERNAL)
            .cardinality(UPDATED_CARDINALITY)
            .enumeration(UPDATED_ENUMERATION)
            .lPattern(UPDATED_L_PATTERN)
            .longName(UPDATED_LONG_NAME)
            .definition(UPDATED_DEFINITION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);

        restAttributeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAttribute.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAttribute))
            )
            .andExpect(status().isOk());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
        Attribute testAttribute = attributeList.get(attributeList.size() - 1);
        assertThat(testAttribute.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAttribute.getInternalExternal()).isEqualTo(UPDATED_INTERNAL_EXTERNAL);
        assertThat(testAttribute.getCardinality()).isEqualTo(UPDATED_CARDINALITY);
        assertThat(testAttribute.getEnumeration()).isEqualTo(UPDATED_ENUMERATION);
        assertThat(testAttribute.getlPattern()).isEqualTo(UPDATED_L_PATTERN);
        assertThat(testAttribute.getLongName()).isEqualTo(UPDATED_LONG_NAME);
        assertThat(testAttribute.getDefinition()).isEqualTo(UPDATED_DEFINITION);
        assertThat(testAttribute.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testAttribute.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void putNonExistingAttribute() throws Exception {
        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();
        attribute.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttributeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, attribute.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attribute))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAttribute() throws Exception {
        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();
        attribute.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(attribute))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAttribute() throws Exception {
        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();
        attribute.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(attribute)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAttributeWithPatch() throws Exception {
        // Initialize the database
        attributeRepository.saveAndFlush(attribute);

        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();

        // Update the attribute using partial update
        Attribute partialUpdatedAttribute = new Attribute();
        partialUpdatedAttribute.setId(attribute.getId());

        partialUpdatedAttribute.name(UPDATED_NAME).internalExternal(UPDATED_INTERNAL_EXTERNAL).creationDate(UPDATED_CREATION_DATE);

        restAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttribute.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAttribute))
            )
            .andExpect(status().isOk());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
        Attribute testAttribute = attributeList.get(attributeList.size() - 1);
        assertThat(testAttribute.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAttribute.getInternalExternal()).isEqualTo(UPDATED_INTERNAL_EXTERNAL);
        assertThat(testAttribute.getCardinality()).isEqualTo(DEFAULT_CARDINALITY);
        assertThat(testAttribute.getEnumeration()).isEqualTo(DEFAULT_ENUMERATION);
        assertThat(testAttribute.getlPattern()).isEqualTo(DEFAULT_L_PATTERN);
        assertThat(testAttribute.getLongName()).isEqualTo(DEFAULT_LONG_NAME);
        assertThat(testAttribute.getDefinition()).isEqualTo(DEFAULT_DEFINITION);
        assertThat(testAttribute.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testAttribute.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void fullUpdateAttributeWithPatch() throws Exception {
        // Initialize the database
        attributeRepository.saveAndFlush(attribute);

        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();

        // Update the attribute using partial update
        Attribute partialUpdatedAttribute = new Attribute();
        partialUpdatedAttribute.setId(attribute.getId());

        partialUpdatedAttribute
            .name(UPDATED_NAME)
            .internalExternal(UPDATED_INTERNAL_EXTERNAL)
            .cardinality(UPDATED_CARDINALITY)
            .enumeration(UPDATED_ENUMERATION)
            .lPattern(UPDATED_L_PATTERN)
            .longName(UPDATED_LONG_NAME)
            .definition(UPDATED_DEFINITION)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);

        restAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAttribute.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAttribute))
            )
            .andExpect(status().isOk());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
        Attribute testAttribute = attributeList.get(attributeList.size() - 1);
        assertThat(testAttribute.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAttribute.getInternalExternal()).isEqualTo(UPDATED_INTERNAL_EXTERNAL);
        assertThat(testAttribute.getCardinality()).isEqualTo(UPDATED_CARDINALITY);
        assertThat(testAttribute.getEnumeration()).isEqualTo(UPDATED_ENUMERATION);
        assertThat(testAttribute.getlPattern()).isEqualTo(UPDATED_L_PATTERN);
        assertThat(testAttribute.getLongName()).isEqualTo(UPDATED_LONG_NAME);
        assertThat(testAttribute.getDefinition()).isEqualTo(UPDATED_DEFINITION);
        assertThat(testAttribute.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testAttribute.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingAttribute() throws Exception {
        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();
        attribute.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, attribute.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(attribute))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAttribute() throws Exception {
        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();
        attribute.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(attribute))
            )
            .andExpect(status().isBadRequest());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAttribute() throws Exception {
        int databaseSizeBeforeUpdate = attributeRepository.findAll().size();
        attribute.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(attribute))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Attribute in the database
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAttribute() throws Exception {
        // Initialize the database
        attributeRepository.saveAndFlush(attribute);

        int databaseSizeBeforeDelete = attributeRepository.findAll().size();

        // Delete the attribute
        restAttributeMockMvc
            .perform(delete(ENTITY_API_URL_ID, attribute.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Attribute> attributeList = attributeRepository.findAll();
        assertThat(attributeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
