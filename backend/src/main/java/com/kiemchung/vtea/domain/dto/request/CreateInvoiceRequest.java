package com.kiemchung.vtea.domain.dto.request;

import com.kiemchung.vtea.domain.entity.PaymentMethod;

import java.util.ArrayList;
import java.util.List;

/**
 * Payload tạo hóa đơn: danh sách món (kèm topping, số lượng) + phương thức thanh toán.
 * Không nhận giá từ client — giá luôn lấy từ DB.
 */
public class CreateInvoiceRequest {

    private PaymentMethod paymentMethod;
    private List<Item> items = new ArrayList<>();

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }

    /** 1 món trong hóa đơn. */
    public static class Item {
        private Integer productId;
        private Integer quantity;
        private List<ToppingItem> toppings = new ArrayList<>();

        public Integer getProductId() { return productId; }
        public void setProductId(Integer productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public List<ToppingItem> getToppings() { return toppings; }
        public void setToppings(List<ToppingItem> toppings) { this.toppings = toppings; }
    }

    /** 1 topping kèm theo món (số lượng tính cho 1 ly). */
    public static class ToppingItem {
        private Integer toppingId;
        private Integer quantity;

        public Integer getToppingId() { return toppingId; }
        public void setToppingId(Integer toppingId) { this.toppingId = toppingId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
