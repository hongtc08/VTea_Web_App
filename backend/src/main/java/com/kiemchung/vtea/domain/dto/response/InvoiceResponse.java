package com.kiemchung.vtea.domain.dto.response;

import com.kiemchung.vtea.domain.entity.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Dữ liệu hóa đơn trả về cho client sau khi tạo thành công.
 */
public class InvoiceResponse {

    private Integer invoiceId;
    private Integer userId;
    private String staffName;
    private PaymentMethod paymentMethod;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private List<Item> items = new ArrayList<>();

    public Integer getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Integer invoiceId) { this.invoiceId = invoiceId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }

    /** 1 món trong hóa đơn. */
    public static class Item {
        private Integer productId;
        private String productName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;
        private List<ToppingItem> toppings = new ArrayList<>();

        public Integer getProductId() { return productId; }
        public void setProductId(Integer productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

        public BigDecimal getLineTotal() { return lineTotal; }
        public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }

        public List<ToppingItem> getToppings() { return toppings; }
        public void setToppings(List<ToppingItem> toppings) { this.toppings = toppings; }
    }

    /** 1 topping kèm theo món. */
    public static class ToppingItem {
        private Integer toppingId;
        private String toppingName;
        private Integer quantity;
        private BigDecimal unitPrice;

        public Integer getToppingId() { return toppingId; }
        public void setToppingId(Integer toppingId) { this.toppingId = toppingId; }

        public String getToppingName() { return toppingName; }
        public void setToppingName(String toppingName) { this.toppingName = toppingName; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    }
}
