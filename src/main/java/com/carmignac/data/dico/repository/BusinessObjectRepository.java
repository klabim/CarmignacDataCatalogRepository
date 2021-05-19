package com.carmignac.data.dico.repository;

import com.carmignac.data.dico.domain.BusinessObject;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the BusinessObject entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BusinessObjectRepository extends JpaRepository<BusinessObject, Long> {}
