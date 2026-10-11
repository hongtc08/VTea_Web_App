package com.kiemchung.vtea.domain.dto.response;

import java.math.BigDecimal;

/**
 * Lớp DTO (Data Transfer Object) dùng để bọc dữ liệu Món nước trước khi trả về cho Frontend.
 */
public class MenuItemResponse {
    private String category;
    private String imageUrl;
    private BigDecimal price;
    private String description;
    private String name;
    private Long id;

    public MenuItemResponse() {}

    public MenuItemResponse(Long id, String name, String description, BigDecimal price, String imageUrl, String category) {
        this.category = category;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this.name = name;
        this.id = id;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}
