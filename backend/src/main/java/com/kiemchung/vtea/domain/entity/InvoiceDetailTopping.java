package com.kiemchung.vtea.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Topping kèm theo 1 món trong hóa đơn — ánh xạ với bảng 'order_detail_topping'.
 */
@Entity
@Table(name = "order_detail_topping")
public class InvoiceDetailTopping {

    @EmbeddedId
    private InvoiceDetailToppingId id = new InvoiceDetailToppingId();

    // @MapsId: tự lấy detail_id / topping_id từ quan hệ để điền vào khóa chính
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("detailId")
    @JoinColumn(name = "detail_id")
    private InvoiceDetail invoiceDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("toppingId")
    @JoinColumn(name = "topping_id")
    private Topping topping;

    // Số lượng topping cho 1 ly
    @Column(nullable = false)
    private Integer quantity;

    // Giá topping tại thời điểm bán
    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    // ===================== Getters & Setters =====================

    public InvoiceDetailToppingId getId() { return id; }
    public void setId(InvoiceDetailToppingId id) { this.id = id; }

    public InvoiceDetail getInvoiceDetail() { return invoiceDetail; }
    public void setInvoiceDetail(InvoiceDetail invoiceDetail) { this.invoiceDetail = invoiceDetail; }

    public Topping getTopping() { return topping; }
    public void setTopping(Topping topping) { this.topping = topping; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
}
