package com.kiemchung.vtea.domain.dto.response;

/**
 * DTO trả về thông tin danh mục món nước.
 */
public class CategoryResponse {

    private Integer categoryId;
    private String name;
    private Boolean isAvailable;

    public CategoryResponse() {}

    public CategoryResponse(Integer categoryId, String name, Boolean isAvailable) {
        this.categoryId = categoryId;
        this.name = name;
        this.isAvailable = isAvailable;
    }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}
