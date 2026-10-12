package com.kiemchung.vtea.domain.dto.request;

import java.math.BigDecimal;

/**
 * DTO nhận dữ liệu từ Frontend khi gọi API cập nhật thông tin topping.
 */
public class UpdateToppingRequest {

    private String name;
    private BigDecimal price;
    private String imageUrl;
    private Boolean isAvailable;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}
