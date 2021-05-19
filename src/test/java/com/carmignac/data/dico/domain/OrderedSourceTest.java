package com.carmignac.data.dico.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.carmignac.data.dico.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrderedSourceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderedSource.class);
        OrderedSource orderedSource1 = new OrderedSource();
        orderedSource1.setId(1L);
        OrderedSource orderedSource2 = new OrderedSource();
        orderedSource2.setId(orderedSource1.getId());
        assertThat(orderedSource1).isEqualTo(orderedSource2);
        orderedSource2.setId(2L);
        assertThat(orderedSource1).isNotEqualTo(orderedSource2);
        orderedSource1.setId(null);
        assertThat(orderedSource1).isNotEqualTo(orderedSource2);
    }
}
