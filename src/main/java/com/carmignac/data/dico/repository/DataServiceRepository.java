package com.carmignac.data.dico.repository;

import com.carmignac.data.dico.domain.DataService;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the DataService entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DataServiceRepository extends JpaRepository<DataService, Long> {}
