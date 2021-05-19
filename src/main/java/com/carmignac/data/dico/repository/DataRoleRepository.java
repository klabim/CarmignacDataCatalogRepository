package com.carmignac.data.dico.repository;

import com.carmignac.data.dico.domain.DataRole;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the DataRole entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DataRoleRepository extends JpaRepository<DataRole, Long> {}
