package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.application.service.ToppingService;
import com.kiemchung.vtea.domain.dto.request.CreateToppingRequest;
import com.kiemchung.vtea.domain.dto.request.UpdateToppingRequest;
import com.kiemchung.vtea.domain.dto.response.ToppingResponse;
import com.kiemchung.vtea.domain.entity.Topping;
import com.kiemchung.vtea.domain.repository.ToppingRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Lớp thực thi các nghiệp vụ quản lý Topping (CRUD topping).
 */
@Service
public class ToppingServiceImpl implements ToppingService {

    private final ToppingRepository toppingRepository;

    public ToppingServiceImpl(ToppingRepository toppingRepository) {
        this.toppingRepository = toppingRepository;
    }

    /**
     * Lấy danh sách các topping đang mở bán (isAvailable = true) và chuyển đổi sang DTO.
     */
    @Override
    public List<ToppingResponse> getAllToppings() {
        return toppingRepository.findByIsAvailableTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thông tin chi tiết 1 topping đang mở bán theo ID.
     */
    @Override
    public ToppingResponse getToppingById(Integer id) {
        Topping topping = toppingRepository.findById(id)
                .filter(t -> Boolean.TRUE.equals(t.getIsAvailable()))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy topping với ID: " + id));
        return mapToResponse(topping);
    }

    /**
     * Thêm mới một loại topping.
     */
    @Override
    public ToppingResponse createTopping(CreateToppingRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Tên topping không được để trống!");
        }
        if (request.getPrice() == null || request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Giá bán topping phải lớn hơn 0!");
        }

        String trimmedName = request.getName().trim();
        if (toppingRepository.existsByName(trimmedName)) {
            throw new RuntimeException("Tên topping đã tồn tại!");
        }

        Topping topping = new Topping();
        topping.setName(trimmedName);
        topping.setPrice(request.getPrice());
        topping.setImageUrl(request.getImageUrl());
        topping.setIsAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true);

        Topping savedTopping = toppingRepository.save(topping);
        return mapToResponse(savedTopping);
    }

    /**
     * Cập nhật thông tin topping theo ID.
     */
    @Override
    public ToppingResponse updateTopping(Integer id, UpdateToppingRequest request) {
        Topping topping = toppingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy topping với ID: " + id));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            String newName = request.getName().trim();
            if (!newName.equalsIgnoreCase(topping.getName()) && toppingRepository.existsByName(newName)) {
                throw new RuntimeException("Tên topping đã tồn tại!");
            }
            topping.setName(newName);
        }

        if (request.getPrice() != null) {
            if (request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Giá bán topping phải lớn hơn 0!");
            }
            topping.setPrice(request.getPrice());
        }

        if (request.getImageUrl() != null) topping.setImageUrl(request.getImageUrl());
        if (request.getIsAvailable() != null) topping.setIsAvailable(request.getIsAvailable());

        Topping updatedTopping = toppingRepository.save(topping);
        return mapToResponse(updatedTopping);
    }

    /**
     * Xóa topping (Soft Delete: đặt isAvailable = false để tránh lỗi khóa ngoại với đơn hàng cũ).
     */
    @Override
    public void deleteTopping(Integer id) {
        Topping topping = toppingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy topping với ID: " + id));

        topping.setIsAvailable(false);
        toppingRepository.save(topping);
    }

    /**
     * Hàm hỗ trợ chuyển đổi từ Entity -> DTO.
     */
    private ToppingResponse mapToResponse(Topping topping) {
        return new ToppingResponse(
                topping.getToppingId(),
                topping.getName(),
                topping.getPrice(),
                topping.getImageUrl(),
                topping.getIsAvailable()
        );
    }
}
