package com.carmignac.data.dico.repository;

import com.carmignac.data.dico.domain.Attribute;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Attribute entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AttributeRepository extends JpaRepository<Attribute, UUID> {}
