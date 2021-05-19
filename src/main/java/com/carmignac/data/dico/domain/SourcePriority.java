package com.carmignac.data.dico.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SourcePriority.
 */
@Entity
@Table(name = "source_priority")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SourcePriority implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "id_source_priority", unique = true)
    private UUID idSourcePriority;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "update_date")
    private LocalDate updateDate;

    @Column(name = "creation_date")
    private LocalDate creationDate;

    @OneToMany(mappedBy = "sourcePriority")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "type", "sourcePriority" }, allowSetters = true)
    private Set<OrderedSource> attributeLists = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SourcePriority id(Long id) {
        this.id = id;
        return this;
    }

    public UUID getIdSourcePriority() {
        return this.idSourcePriority;
    }

    public SourcePriority idSourcePriority(UUID idSourcePriority) {
        this.idSourcePriority = idSourcePriority;
        return this;
    }

    public void setIdSourcePriority(UUID idSourcePriority) {
        this.idSourcePriority = idSourcePriority;
    }

    public String getName() {
        return this.name;
    }

    public SourcePriority name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public SourcePriority description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getUpdateDate() {
        return this.updateDate;
    }

    public SourcePriority updateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
        return this;
    }

    public void setUpdateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
    }

    public LocalDate getCreationDate() {
        return this.creationDate;
    }

    public SourcePriority creationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
        return this;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public Set<OrderedSource> getAttributeLists() {
        return this.attributeLists;
    }

    public SourcePriority attributeLists(Set<OrderedSource> orderedSources) {
        this.setAttributeLists(orderedSources);
        return this;
    }

    public SourcePriority addAttributeList(OrderedSource orderedSource) {
        this.attributeLists.add(orderedSource);
        orderedSource.setSourcePriority(this);
        return this;
    }

    public SourcePriority removeAttributeList(OrderedSource orderedSource) {
        this.attributeLists.remove(orderedSource);
        orderedSource.setSourcePriority(null);
        return this;
    }

    public void setAttributeLists(Set<OrderedSource> orderedSources) {
        if (this.attributeLists != null) {
            this.attributeLists.forEach(i -> i.setSourcePriority(null));
        }
        if (orderedSources != null) {
            orderedSources.forEach(i -> i.setSourcePriority(this));
        }
        this.attributeLists = orderedSources;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SourcePriority)) {
            return false;
        }
        return id != null && id.equals(((SourcePriority) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SourcePriority{" +
            "id=" + getId() +
            ", idSourcePriority='" + getIdSourcePriority() + "'" +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", updateDate='" + getUpdateDate() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            "}";
    }
}
