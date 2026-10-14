package com.kiemchung.vtea.domain.dto.response;

import java.util.List;

/**
 * DTO tổng hợp dữ liệu (Danh mục, Món nước, Topping) tối ưu cho màn hình bán hàng POS.
 */
public class PosMenuResponse {

    private List<CategoryResponse> categories;
    private List<PosProductResponse> products;
    private List<ToppingResponse> toppings;

    public PosMenuResponse() {}

    public PosMenuResponse(List<CategoryResponse> categories, List<PosProductResponse> products, List<ToppingResponse> toppings) {
        this.categories = categories;
        this.products = products;
        this.toppings = toppings;
    }

    public List<CategoryResponse> getCategories() { return categories; }
    public void setCategories(List<CategoryResponse> categories) { this.categories = categories; }

    public List<PosProductResponse> getProducts() { return products; }
    public void setProducts(List<PosProductResponse> products) { this.products = products; }

    public List<ToppingResponse> getToppings() { return toppings; }
    public void setToppings(List<ToppingResponse> toppings) { this.toppings = toppings; }
}
