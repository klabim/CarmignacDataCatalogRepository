package com.carmignac.data.dico.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OrderedSource.
 */
@Entity
@Table(name = "ordered_source")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OrderedSource implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "order_source", nullable = false)
    private Integer orderSource;

    @Column(name = "update_date")
    private LocalDate updateDate;

    @Column(name = "creation_date")
    private LocalDate creationDate;

    @OneToOne
    @JoinColumn(unique = true)
    private Source linkedSource;

    @ManyToOne
    @JsonIgnoreProperties(value = { "attributeLists" }, allowSetters = true)
    private SourcePriority sourcePriority;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OrderedSource id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getOrderSource() {
        return this.orderSource;
    }

    public OrderedSource orderSource(Integer orderSource) {
        this.orderSource = orderSource;
        return this;
    }

    public void setOrderSource(Integer orderSource) {
        this.orderSource = orderSource;
    }

    public LocalDate getUpdateDate() {
        return this.updateDate;
    }

    public OrderedSource updateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
        return this;
    }

    public void setUpdateDate(LocalDate updateDate) {
        this.updateDate = updateDate;
    }

    public LocalDate getCreationDate() {
        return this.creationDate;
    }

    public OrderedSource creationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
        return this;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public Source getLinkedSource() {
        return this.linkedSource;
    }

    public OrderedSource linkedSource(Source source) {
        this.setLinkedSource(source);
        return this;
    }

    public void setLinkedSource(Source source) {
        this.linkedSource = source;
    }

    public SourcePriority getSourcePriority() {
        return this.sourcePriority;
    }

    public OrderedSource sourcePriority(SourcePriority sourcePriority) {
        this.setSourcePriority(sourcePriority);
        return this;
    }

    public void setSourcePriority(SourcePriority sourcePriority) {
        this.sourcePriority = sourcePriority;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrderedSource)) {
            return false;
        }
        return id != null && id.equals(((OrderedSource) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrderedSource{" +
            "id=" + getId() +
            ", orderSource=" + getOrderSource() +
            ", updateDate='" + getUpdateDate() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            "}";
    }
}
