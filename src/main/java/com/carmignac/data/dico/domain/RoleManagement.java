package com.carmignac.data.dico.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RoleManagement.
 */
@Entity
@Table(name = "role_management")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class RoleManagement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "id_data_role", unique = true)
    private UUID idDataRole;

    @Column(name = "update_date")
    private LocalDate updateDate;

    @Column(name = "creation_date")
    private LocalDate creationDate;

    @JsonIgnoreProperties(value = { "type", "type", "businessObjects" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Attribute respByException;

    @JsonIgnoreProperties(value = { "attributeList" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private BusinessObject responsible;

    @OneToOne
    @JoinColumn(unique = true)
    private DataRole dataRole;

    @OneToOne
    @JoinColumn(unique = true)
    private DataService dataService;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RoleManagement id(Long id) {
        this.id = id;
        return this;
    }

    public UUID getIdDataRole() {
        return this.idDataRole;
    }

    public RoleManagement idDataRole(UUID idDataRole) {
        this.idDataRole = idDataRole;
        return this;
    }

    public void setIdDataRole(UUID idDataRole) {
        this.idDataRole = idDataRole;
    }

    public LocalDate getUpdateDate() {
        return this.updateDate;
    }

    public RoleManagement updateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
        return this;
    }

    public void setUpdateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
    }

    public LocalDate getCreationDate() {
        return this.creationDate;
    }

    public RoleManagement creationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
        return this;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public Attribute getRespByException() {
        return this.respByException;
    }

    public RoleManagement respByException(Attribute attribute) {
        this.setRespByException(attribute);
        return this;
    }

    public void setRespByException(Attribute attribute) {
        this.respByException = attribute;
    }

    public BusinessObject getResponsible() {
        return this.responsible;
    }

    public RoleManagement responsible(BusinessObject businessObject) {
        this.setResponsible(businessObject);
        return this;
    }

    public void setResponsible(BusinessObject businessObject) {
        this.responsible = businessObject;
    }

    public DataRole getDataRole() {
        return this.dataRole;
    }

    public RoleManagement dataRole(DataRole dataRole) {
        this.setDataRole(dataRole);
        return this;
    }

    public void setDataRole(DataRole dataRole) {
        this.dataRole = dataRole;
    }

    public DataService getDataService() {
        return this.dataService;
    }

    public RoleManagement dataService(DataService dataService) {
        this.setDataService(dataService);
        return this;
    }

    public void setDataService(DataService dataService) {
        this.dataService = dataService;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RoleManagement)) {
            return false;
        }
        return id != null && id.equals(((RoleManagement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RoleManagement{" +
            "id=" + getId() +
            ", idDataRole='" + getIdDataRole() + "'" +
            ", updateDate='" + getUpdateDate() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            "}";
    }
}
