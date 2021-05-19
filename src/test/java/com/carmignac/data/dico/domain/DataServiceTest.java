package com.carmignac.data.dico.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.carmignac.data.dico.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DataServiceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DataService.class);
        DataService dataService1 = new DataService();
        dataService1.setId(1L);
        DataService dataService2 = new DataService();
        dataService2.setId(dataService1.getId());
        assertThat(dataService1).isEqualTo(dataService2);
        dataService2.setId(2L);
        assertThat(dataService1).isNotEqualTo(dataService2);
        dataService1.setId(null);
        assertThat(dataService1).isNotEqualTo(dataService2);
    }
}
