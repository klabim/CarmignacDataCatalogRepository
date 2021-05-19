package com.carmignac.data.dico.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.carmignac.data.dico.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class AttributeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Attribute.class);
        Attribute attribute1 = new Attribute();
        attribute1.setId(UUID.randomUUID());
        Attribute attribute2 = new Attribute();
        attribute2.setId(attribute1.getId());
        assertThat(attribute1).isEqualTo(attribute2);
        attribute2.setId(UUID.randomUUID());
        assertThat(attribute1).isNotEqualTo(attribute2);
        attribute1.setId(null);
        assertThat(attribute1).isNotEqualTo(attribute2);
    }
}
