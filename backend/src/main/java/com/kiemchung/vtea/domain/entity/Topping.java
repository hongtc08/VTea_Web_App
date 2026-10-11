package com.kiemchung.vtea.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Lớp Entity ánh xạ với bảng 'topping' trong cơ sở dữ liệu.
 * Chứa thông tin về các loại topping (Tên, giá, hình ảnh, trạng thái bán...).
 */
@Entity
@Table(name = "topping")
public class Topping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "topping_id")
    private Integer toppingId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_available")
    private Boolean isAvailable;

    // ===================== Getters & Setters =====================

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
