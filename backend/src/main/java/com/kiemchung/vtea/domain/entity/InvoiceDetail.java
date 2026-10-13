package com.kiemchung.vtea.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Chi tiết hóa đơn (1 món trong hóa đơn) — ánh xạ với bảng 'order_detail'.
 */
@Entity
@Table(name = "order_detail")
public class InvoiceDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Integer detailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    // Giá món tại thời điểm bán (không đổi dù sau này món tăng giá)
    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @OneToMany(mappedBy = "invoiceDetail", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceDetailTopping> toppings = new ArrayList<>();

    /** Thêm topping cho món và gắn ngược quan hệ 2 chiều. */
    public void addTopping(InvoiceDetailTopping topping) {
        toppings.add(topping);
        topping.setInvoiceDetail(this);
    }

    // ===================== Getters & Setters =====================

    public Integer getDetailId() { return detailId; }
    public void setDetailId(Integer detailId) { this.detailId = detailId; }

    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public List<InvoiceDetailTopping> getToppings() { return toppings; }
    public void setToppings(List<InvoiceDetailTopping> toppings) { this.toppings = toppings; }
}
