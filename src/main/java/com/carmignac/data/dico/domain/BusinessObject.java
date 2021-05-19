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
 * A BusinessObject.
 */
@Entity
@Table(name = "business_object")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BusinessObject implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "id_bo", unique = true)
    private UUID idBo;

    @Column(name = "name")
    private String name;

    @Column(name = "definition")
    private String definition;

    @Column(name = "update_date")
    private LocalDate updateDate;

    @Column(name = "creation_date")
    private LocalDate creationDate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "type", "type", "businessObjects" }, allowSetters = true)
    private Attribute attributeList;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BusinessObject id(Long id) {
        this.id = id;
        return this;
    }

    public UUID getIdBo() {
        return this.idBo;
    }

    public BusinessObject idBo(UUID idBo) {
        this.idBo = idBo;
        return this;
    }

    public void setIdBo(UUID idBo) {
        this.idBo = idBo;
    }

    public String getName() {
        return this.name;
    }

    public BusinessObject name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDefinition() {
        return this.definition;
    }

    public BusinessObject definition(String definition) {
        this.definition = definition;
        return this;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public LocalDate getUpdateDate() {
        return this.updateDate;
    }

    public BusinessObject updateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
        return this;
    }

    public void setUpdateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
    }

    public LocalDate getCreationDate() {
        return this.creationDate;
    }

    public BusinessObject creationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
        return this;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public Attribute getAttributeList() {
        return this.attributeList;
    }

    public BusinessObject attributeList(Attribute attribute) {
        this.setAttributeList(attribute);
        return this;
    }

    public void setAttributeList(Attribute attribute) {
        this.attributeList = attribute;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BusinessObject)) {
            return false;
        }
        return id != null && id.equals(((BusinessObject) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BusinessObject{" +
            "id=" + getId() +
            ", idBo='" + getIdBo() + "'" +
            ", name='" + getName() + "'" +
            ", definition='" + getDefinition() + "'" +
            ", updateDate='" + getUpdateDate() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            "}";
    }
}
