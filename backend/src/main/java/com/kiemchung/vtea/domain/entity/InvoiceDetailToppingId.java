package com.kiemchung.vtea.domain.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Khóa chính kép (detail_id + topping_id) của bảng 'order_detail_topping'.
 */
@Embeddable
public class InvoiceDetailToppingId implements Serializable {

    private Integer detailId;
    private Integer toppingId;

    public InvoiceDetailToppingId() {
    }

    public InvoiceDetailToppingId(Integer detailId, Integer toppingId) {
        this.detailId = detailId;
        this.toppingId = toppingId;
    }

    public Integer getDetailId() { return detailId; }
    public void setDetailId(Integer detailId) { this.detailId = detailId; }

    public Integer getToppingId() { return toppingId; }
    public void setToppingId(Integer toppingId) { this.toppingId = toppingId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof InvoiceDetailToppingId that)) return false;
        return Objects.equals(detailId, that.detailId) && Objects.equals(toppingId, that.toppingId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(detailId, toppingId);
    }
}
