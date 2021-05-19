package com.carmignac.data.dico.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.carmignac.data.dico.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SourcePriorityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SourcePriority.class);
        SourcePriority sourcePriority1 = new SourcePriority();
        sourcePriority1.setId(1L);
        SourcePriority sourcePriority2 = new SourcePriority();
        sourcePriority2.setId(sourcePriority1.getId());
        assertThat(sourcePriority1).isEqualTo(sourcePriority2);
        sourcePriority2.setId(2L);
        assertThat(sourcePriority1).isNotEqualTo(sourcePriority2);
        sourcePriority1.setId(null);
        assertThat(sourcePriority1).isNotEqualTo(sourcePriority2);
    }
}
