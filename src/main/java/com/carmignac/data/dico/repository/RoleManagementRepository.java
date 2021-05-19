package com.carmignac.data.dico.repository;

import com.carmignac.data.dico.domain.RoleManagement;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the RoleManagement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RoleManagementRepository extends JpaRepository<RoleManagement, Long> {}
