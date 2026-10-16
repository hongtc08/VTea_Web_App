package com.kiemchung.vtea.domain.dto.request;

public class CategoryRequest {

    private String name;
    private Boolean isAvailable;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}
