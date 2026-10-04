package com.kiemchung.vtea.domain.dto.response;

import java.math.BigDecimal;

/**
 * Lớp DTO (Data Transfer Object) dùng để bọc dữ liệu Món nước trước khi trả về cho Frontend.
 * Giúp giấu đi các trường nhạy cảm trong Entity hoặc định dạng lại dữ liệu nếu cần.
 */
public class MenuItemResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private String category;

    public MenuItemResponse() {}

    public MenuItemResponse(Long id, String name, String description, BigDecimal price, String imageUrl, String category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
