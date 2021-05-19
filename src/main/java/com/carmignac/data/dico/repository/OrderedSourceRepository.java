package com.carmignac.data.dico.repository;

import com.carmignac.data.dico.domain.OrderedSource;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the OrderedSource entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderedSourceRepository extends JpaRepository<OrderedSource, Long> {}
