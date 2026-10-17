package com.kiemchung.vtea.domain.dto.request;

import com.kiemchung.vtea.domain.entity.PaymentMethod;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO nhận dữ liệu yêu cầu tạo hóa đơn thanh toán từ Frontend.
 * Hỗ trợ nhận kèm các trường giá từ FE (unitPrice, lineTotal, subtotal, vat, totalAmount)
 * để Backend tính toán lại từ Database và đối chiếu (chéo check) bảo mật giá tiền.
 */
public class CreateInvoiceRequest {

    private PaymentMethod paymentMethod;
    private List<Item> items = new ArrayList<>();
    private BigDecimal subtotal;
    private BigDecimal vat;
    private BigDecimal totalAmount;

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getVat() { return vat; }
    public void setVat(BigDecimal vat) { this.vat = vat; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    /** Thông tin 1 dòng món nước trong hóa đơn. */
    public static class Item {
        private Integer productId;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;
        private List<ToppingItem> toppings = new ArrayList<>();

        public Integer getProductId() { return productId; }
        public void setProductId(Integer productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

        public BigDecimal getLineTotal() { return lineTotal; }
        public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }

        public List<ToppingItem> getToppings() { return toppings; }
        public void setToppings(List<ToppingItem> toppings) { this.toppings = toppings; }
    }

    /** Thông tin 1 topping đi kèm trên mỗi ly nước. */
    public static class ToppingItem {
        private Integer toppingId;
        private Integer quantity;
        private BigDecimal unitPrice;

        public Integer getToppingId() { return toppingId; }
        public void setToppingId(Integer toppingId) { this.toppingId = toppingId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    }
}

