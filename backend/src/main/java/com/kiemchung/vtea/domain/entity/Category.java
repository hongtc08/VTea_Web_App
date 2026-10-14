package com.kiemchung.vtea.domain.entity;

import jakarta.persistence.*;

/**
 * Lớp Entity ánh xạ với bảng 'category' (danh mục món nước) trong cơ sở dữ liệu.
 */
@Entity
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;

    @Column(nullable = false)
    private String name;

    @Column(name = "is_available")
    private Boolean isAvailable;

    // ===================== Getters & Setters =====================

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}
