package com.carmignac.data.dico.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DataRole.
 */
@Entity
@Table(name = "data_role")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class DataRole implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "id_data_role", unique = true)
    private UUID idDataRole;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "update_date")
    private LocalDate updateDate;

    @Column(name = "creation_date")
    private LocalDate creationDate;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DataRole id(Long id) {
        this.id = id;
        return this;
    }

    public UUID getIdDataRole() {
        return this.idDataRole;
    }

    public DataRole idDataRole(UUID idDataRole) {
        this.idDataRole = idDataRole;
        return this;
    }

    public void setIdDataRole(UUID idDataRole) {
        this.idDataRole = idDataRole;
    }

    public String getName() {
        return this.name;
    }

    public DataRole name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public DataRole description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getUpdateDate() {
        return this.updateDate;
    }

    public DataRole updateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
        return this;
    }

    public void setUpdateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
    }

    public LocalDate getCreationDate() {
        return this.creationDate;
    }

    public DataRole creationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
        return this;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DataRole)) {
            return false;
        }
        return id != null && id.equals(((DataRole) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DataRole{" +
            "id=" + getId() +
            ", idDataRole='" + getIdDataRole() + "'" +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", updateDate='" + getUpdateDate() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            "}";
    }
}
