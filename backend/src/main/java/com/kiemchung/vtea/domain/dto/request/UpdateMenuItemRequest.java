package com.kiemchung.vtea.domain.dto.request;

import java.math.BigDecimal;

/**
 * DTO nhận dữ liệu từ Frontend khi gọi API cập nhật thông tin món trong menu.
 */
public class UpdateMenuItemRequest {

    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String category;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
