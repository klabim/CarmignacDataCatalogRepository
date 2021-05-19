package com.carmignac.data.dico.repository;

import com.carmignac.data.dico.domain.SourcePriority;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SourcePriority entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SourcePriorityRepository extends JpaRepository<SourcePriority, Long> {}
