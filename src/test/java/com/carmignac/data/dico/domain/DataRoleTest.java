package com.carmignac.data.dico.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.carmignac.data.dico.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DataRoleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DataRole.class);
        DataRole dataRole1 = new DataRole();
        dataRole1.setId(1L);
        DataRole dataRole2 = new DataRole();
        dataRole2.setId(dataRole1.getId());
        assertThat(dataRole1).isEqualTo(dataRole2);
        dataRole2.setId(2L);
        assertThat(dataRole1).isNotEqualTo(dataRole2);
        dataRole1.setId(null);
        assertThat(dataRole1).isNotEqualTo(dataRole2);
    }
}
