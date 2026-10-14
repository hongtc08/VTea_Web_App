package com.kiemchung.vtea.domain.dto.response;

import java.math.BigDecimal;

/**
 * DTO trả về thông tin món nước (Product) kèm thông tin danh mục cho màn hình POS.
 */
public class PosProductResponse {

    private Integer productId;
    private String name;
    private BigDecimal price;
    private String imageUrl;
    private Integer categoryId;
    private String categoryName;

    public PosProductResponse() {}

    public PosProductResponse(Integer productId, String name, BigDecimal price, String imageUrl, Integer categoryId, String categoryName) {
        this.productId = productId;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
}
