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
 * A Attribute.
 */
@Entity
@Table(name = "attribute")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Attribute implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "internal_external")
    private String internalExternal;

    @Column(name = "cardinality")
    private String cardinality;

    @Column(name = "enumeration")
    private String enumeration;

    @Column(name = "l_pattern")
    private String lPattern;

    @Column(name = "long_name")
    private String longName;

    @Column(name = "definition")
    private String definition;

    @Column(name = "update_date")
    private LocalDate updateDate;

    @Column(name = "creation_date")
    private LocalDate creationDate;

    @JsonIgnoreProperties(value = { "attributeLists" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private SourcePriority goldenSourcePriority;

    @JsonIgnoreProperties(value = { "attributeList" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private BusinessObject linkedType;

    @OneToMany(mappedBy = "attributeList")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "attributeList" }, allowSetters = true)
    private Set<BusinessObject> businessObjects = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Attribute id(UUID id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Attribute name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInternalExternal() {
        return this.internalExternal;
    }

    public Attribute internalExternal(String internalExternal) {
        this.internalExternal = internalExternal;
        return this;
    }

    public void setInternalExternal(String internalExternal) {
        this.internalExternal = internalExternal;
    }

    public String getCardinality() {
        return this.cardinality;
    }

    public Attribute cardinality(String cardinality) {
        this.cardinality = cardinality;
        return this;
    }

    public void setCardinality(String cardinality) {
        this.cardinality = cardinality;
    }

    public String getEnumeration() {
        return this.enumeration;
    }

    public Attribute enumeration(String enumeration) {
        this.enumeration = enumeration;
        return this;
    }

    public void setEnumeration(String enumeration) {
        this.enumeration = enumeration;
    }

    public String getlPattern() {
        return this.lPattern;
    }

    public Attribute lPattern(String lPattern) {
        this.lPattern = lPattern;
        return this;
    }

    public void setlPattern(String lPattern) {
        this.lPattern = lPattern;
    }

    public String getLongName() {
        return this.longName;
    }

    public Attribute longName(String longName) {
        this.longName = longName;
        return this;
    }

    public void setLongName(String longName) {
        this.longName = longName;
    }

    public String getDefinition() {
        return this.definition;
    }

    public Attribute definition(String definition) {
        this.definition = definition;
        return this;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public LocalDate getUpdateDate() {
        return this.updateDate;
    }

    public Attribute updateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
        return this;
    }

    public void setUpdateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
    }

    public LocalDate getCreationDate() {
        return this.creationDate;
    }

    public Attribute creationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
        return this;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public SourcePriority getGoldenSourcePriority() {
        return this.goldenSourcePriority;
    }

    public Attribute goldenSourcePriority(SourcePriority sourcePriority) {
        this.setGoldenSourcePriority(sourcePriority);
        return this;
    }

    public void setGoldenSourcePriority(SourcePriority sourcePriority) {
        this.goldenSourcePriority = sourcePriority;
    }

    public BusinessObject getLinkedType() {
        return this.linkedType;
    }

    public Attribute linkedType(BusinessObject businessObject) {
        this.setLinkedType(businessObject);
        return this;
    }

    public void setLinkedType(BusinessObject businessObject) {
        this.linkedType = businessObject;
    }

    public Set<BusinessObject> getBusinessObjects() {
        return this.businessObjects;
    }

    public Attribute businessObjects(Set<BusinessObject> businessObjects) {
        this.setBusinessObjects(businessObjects);
        return this;
    }

    public Attribute addBusinessObject(BusinessObject businessObject) {
        this.businessObjects.add(businessObject);
        businessObject.setAttributeList(this);
        return this;
    }

    public Attribute removeBusinessObject(BusinessObject businessObject) {
        this.businessObjects.remove(businessObject);
        businessObject.setAttributeList(null);
        return this;
    }

    public void setBusinessObjects(Set<BusinessObject> businessObjects) {
        if (this.businessObjects != null) {
            this.businessObjects.forEach(i -> i.setAttributeList(null));
        }
        if (businessObjects != null) {
            businessObjects.forEach(i -> i.setAttributeList(this));
        }
        this.businessObjects = businessObjects;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Attribute)) {
            return false;
        }
        return id != null && id.equals(((Attribute) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Attribute{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", internalExternal='" + getInternalExternal() + "'" +
            ", cardinality='" + getCardinality() + "'" +
            ", enumeration='" + getEnumeration() + "'" +
            ", lPattern='" + getlPattern() + "'" +
            ", longName='" + getLongName() + "'" +
            ", definition='" + getDefinition() + "'" +
            ", updateDate='" + getUpdateDate() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            "}";
    }
}
