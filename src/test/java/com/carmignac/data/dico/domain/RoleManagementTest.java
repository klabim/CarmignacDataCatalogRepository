package com.carmignac.data.dico.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.carmignac.data.dico.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RoleManagementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RoleManagement.class);
        RoleManagement roleManagement1 = new RoleManagement();
        roleManagement1.setId(1L);
        RoleManagement roleManagement2 = new RoleManagement();
        roleManagement2.setId(roleManagement1.getId());
        assertThat(roleManagement1).isEqualTo(roleManagement2);
        roleManagement2.setId(2L);
        assertThat(roleManagement1).isNotEqualTo(roleManagement2);
        roleManagement1.setId(null);
        assertThat(roleManagement1).isNotEqualTo(roleManagement2);
    }
}
