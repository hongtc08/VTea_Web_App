package com.kiemchung.vtea.application.service;

import com.kiemchung.vtea.domain.dto.request.CreateToppingRequest;
import com.kiemchung.vtea.domain.dto.request.UpdateToppingRequest;
import com.kiemchung.vtea.domain.dto.response.ToppingResponse;

import java.util.List;

/**
 * Interface định nghĩa các nghiệp vụ quản lý Topping.
 */
public interface ToppingService {
    List<ToppingResponse> getAllToppings();
    ToppingResponse getToppingById(Integer id);
    ToppingResponse createTopping(CreateToppingRequest request);
    ToppingResponse updateTopping(Integer id, UpdateToppingRequest request);
    void deleteTopping(Integer id);
}
