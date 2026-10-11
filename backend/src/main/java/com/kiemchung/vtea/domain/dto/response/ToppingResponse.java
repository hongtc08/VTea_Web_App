package com.kiemchung.vtea.domain.dto.response;

import java.math.BigDecimal;

/**
 * Lớp DTO dùng để bọc dữ liệu Topping trước khi trả về cho Frontend.
 */
public class ToppingResponse {

    private Integer toppingId;
    private String name;
    private BigDecimal price;
    private String imageUrl;
    private Boolean isAvailable;

    public ToppingResponse() {}

    public ToppingResponse(Integer toppingId, String name, BigDecimal price, String imageUrl, Boolean isAvailable) {
        this.toppingId = toppingId;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.isAvailable = isAvailable;
    }

    public Integer getToppingId() { return toppingId; }
    public void setToppingId(Integer toppingId) { this.toppingId = toppingId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}
