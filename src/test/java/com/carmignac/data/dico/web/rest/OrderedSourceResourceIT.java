package com.carmignac.data.dico.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.carmignac.data.dico.IntegrationTest;
import com.carmignac.data.dico.domain.OrderedSource;
import com.carmignac.data.dico.repository.OrderedSourceRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
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
 * Integration tests for the {@link OrderedSourceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrderedSourceResourceIT {

    private static final Integer DEFAULT_ORDER_SOURCE = 1;
    private static final Integer UPDATED_ORDER_SOURCE = 2;

    private static final LocalDate DEFAULT_UPDATE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_UPDATE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_CREATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATION_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/ordered-sources";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OrderedSourceRepository orderedSourceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderedSourceMockMvc;

    private OrderedSource orderedSource;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderedSource createEntity(EntityManager em) {
        OrderedSource orderedSource = new OrderedSource()
            .orderSource(DEFAULT_ORDER_SOURCE)
            .updateDate(DEFAULT_UPDATE_DATE)
            .creationDate(DEFAULT_CREATION_DATE);
        return orderedSource;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderedSource createUpdatedEntity(EntityManager em) {
        OrderedSource orderedSource = new OrderedSource()
            .orderSource(UPDATED_ORDER_SOURCE)
            .updateDate(UPDATED_UPDATE_DATE)
            .creationDate(UPDATED_CREATION_DATE);
        return orderedSource;
    }

    @BeforeEach
    public void initTest() {
        orderedSource = createEntity(em);
    }

    @Test
    @Transactional
    void createOrderedSource() throws Exception {
        int databaseSizeBeforeCreate = orderedSourceRepository.findAll().size();
        // Create the OrderedSource
        restOrderedSourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderedSource)))
            .andExpect(status().isCreated());

        // Validate the OrderedSource in the database
        List<OrderedSource> orderedSourceList = orderedSourceRepository.findAll();
        assertThat(orderedSourceList).hasSize(databaseSizeBeforeCreate + 1);
        OrderedSource testOrderedSource = orderedSourceList.get(orderedSourceList.size() - 1);
        assertThat(testOrderedSource.getOrderSource()).isEqualTo(DEFAULT_ORDER_SOURCE);
        assertThat(testOrderedSource.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testOrderedSource.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void createOrderedSourceWithExistingId() throws Exception {
        // Create the OrderedSource with an existing ID
        orderedSource.setId(1L);

        int databaseSizeBeforeCreate = orderedSourceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderedSourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderedSource)))
            .andExpect(status().isBadRequest());

        // Validate the OrderedSource in the database
        List<OrderedSource> orderedSourceList = orderedSourceRepository.findAll();
        assertThat(orderedSourceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkOrderSourceIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderedSourceRepository.findAll().size();
        // set the field null
        orderedSource.setOrderSource(null);

        // Create the OrderedSource, which fails.

        restOrderedSourceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderedSource)))
            .andExpect(status().isBadRequest());

        List<OrderedSource> orderedSourceList = orderedSourceRepository.findAll();
        assertThat(orderedSourceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOrderedSources() throws Exception {
        // Initialize the database
        orderedSourceRepository.saveAndFlush(orderedSource);

        // Get all the orderedSourceList
        restOrderedSourceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderedSource.getId().intValue())))
            .andExpect(jsonPath("$.[*].orderSource").value(hasItem(DEFAULT_ORDER_SOURCE)))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(DEFAULT_UPDATE_DATE.toString())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())));
    }

    @Test
    @Transactional
    void getOrderedSource() throws Exception {
        // Initialize the database
        orderedSourceRepository.saveAndFlush(orderedSource);

        // Get the orderedSource
        restOrderedSourceMockMvc
            .perform(get(ENTITY_API_URL_ID, orderedSource.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orderedSource.getId().intValue()))
            .andExpect(jsonPath("$.orderSource").value(DEFAULT_ORDER_SOURCE))
            .andExpect(jsonPath("$.updateDate").value(DEFAULT_UPDATE_DATE.toString()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingOrderedSource() throws Exception {
        // Get the orderedSource
        restOrderedSourceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOrderedSource() throws Exception {
        // Initialize the database
        orderedSourceRepository.saveAndFlush(orderedSource);

        int databaseSizeBeforeUpdate = orderedSourceRepository.findAll().size();

        // Update the orderedSource
        OrderedSource updatedOrderedSource = orderedSourceRepository.findById(orderedSource.getId()).get();
        // Disconnect from session so that the updates on updatedOrderedSource are not directly saved in db
        em.detach(updatedOrderedSource);
        updatedOrderedSource.orderSource(UPDATED_ORDER_SOURCE).updateDate(UPDATED_UPDATE_DATE).creationDate(UPDATED_CREATION_DATE);

        restOrderedSourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrderedSource.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrderedSource))
            )
            .andExpect(status().isOk());

        // Validate the OrderedSource in the database
        List<OrderedSource> orderedSourceList = orderedSourceRepository.findAll();
        assertThat(orderedSourceList).hasSize(databaseSizeBeforeUpdate);
        OrderedSource testOrderedSource = orderedSourceList.get(orderedSourceList.size() - 1);
        assertThat(testOrderedSource.getOrderSource()).isEqualTo(UPDATED_ORDER_SOURCE);
        assertThat(testOrderedSource.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testOrderedSource.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void putNonExistingOrderedSource() throws Exception {
        int databaseSizeBeforeUpdate = orderedSourceRepository.findAll().size();
        orderedSource.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderedSourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orderedSource.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderedSource))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderedSource in the database
        List<OrderedSource> orderedSourceList = orderedSourceRepository.findAll();
        assertThat(orderedSourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrderedSource() throws Exception {
        int databaseSizeBeforeUpdate = orderedSourceRepository.findAll().size();
        orderedSource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderedSourceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(orderedSource))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderedSource in the database
        List<OrderedSource> orderedSourceList = orderedSourceRepository.findAll();
        assertThat(orderedSourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrderedSource() throws Exception {
        int databaseSizeBeforeUpdate = orderedSourceRepository.findAll().size();
        orderedSource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderedSourceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(orderedSource)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderedSource in the database
        List<OrderedSource> orderedSourceList = orderedSourceRepository.findAll();
        assertThat(orderedSourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOrderedSourceWithPatch() throws Exception {
        // Initialize the database
        orderedSourceRepository.saveAndFlush(orderedSource);

        int databaseSizeBeforeUpdate = orderedSourceRepository.findAll().size();

        // Update the orderedSource using partial update
        OrderedSource partialUpdatedOrderedSource = new OrderedSource();
        partialUpdatedOrderedSource.setId(orderedSource.getId());

        restOrderedSourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderedSource.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrderedSource))
            )
            .andExpect(status().isOk());

        // Validate the OrderedSource in the database
        List<OrderedSource> orderedSourceList = orderedSourceRepository.findAll();
        assertThat(orderedSourceList).hasSize(databaseSizeBeforeUpdate);
        OrderedSource testOrderedSource = orderedSourceList.get(orderedSourceList.size() - 1);
        assertThat(testOrderedSource.getOrderSource()).isEqualTo(DEFAULT_ORDER_SOURCE);
        assertThat(testOrderedSource.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testOrderedSource.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    void fullUpdateOrderedSourceWithPatch() throws Exception {
        // Initialize the database
        orderedSourceRepository.saveAndFlush(orderedSource);

        int databaseSizeBeforeUpdate = orderedSourceRepository.findAll().size();

        // Update the orderedSource using partial update
        OrderedSource partialUpdatedOrderedSource = new OrderedSource();
        partialUpdatedOrderedSource.setId(orderedSource.getId());

        partialUpdatedOrderedSource.orderSource(UPDATED_ORDER_SOURCE).updateDate(UPDATED_UPDATE_DATE).creationDate(UPDATED_CREATION_DATE);

        restOrderedSourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderedSource.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrderedSource))
            )
            .andExpect(status().isOk());

        // Validate the OrderedSource in the database
        List<OrderedSource> orderedSourceList = orderedSourceRepository.findAll();
        assertThat(orderedSourceList).hasSize(databaseSizeBeforeUpdate);
        OrderedSource testOrderedSource = orderedSourceList.get(orderedSourceList.size() - 1);
        assertThat(testOrderedSource.getOrderSource()).isEqualTo(UPDATED_ORDER_SOURCE);
        assertThat(testOrderedSource.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testOrderedSource.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingOrderedSource() throws Exception {
        int databaseSizeBeforeUpdate = orderedSourceRepository.findAll().size();
        orderedSource.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderedSourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, orderedSource.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orderedSource))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderedSource in the database
        List<OrderedSource> orderedSourceList = orderedSourceRepository.findAll();
        assertThat(orderedSourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrderedSource() throws Exception {
        int databaseSizeBeforeUpdate = orderedSourceRepository.findAll().size();
        orderedSource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderedSourceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(orderedSource))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderedSource in the database
        List<OrderedSource> orderedSourceList = orderedSourceRepository.findAll();
        assertThat(orderedSourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrderedSource() throws Exception {
        int databaseSizeBeforeUpdate = orderedSourceRepository.findAll().size();
        orderedSource.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderedSourceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(orderedSource))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderedSource in the database
        List<OrderedSource> orderedSourceList = orderedSourceRepository.findAll();
        assertThat(orderedSourceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrderedSource() throws Exception {
        // Initialize the database
        orderedSourceRepository.saveAndFlush(orderedSource);

        int databaseSizeBeforeDelete = orderedSourceRepository.findAll().size();

        // Delete the orderedSource
        restOrderedSourceMockMvc
            .perform(delete(ENTITY_API_URL_ID, orderedSource.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<OrderedSource> orderedSourceList = orderedSourceRepository.findAll();
        assertThat(orderedSourceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
