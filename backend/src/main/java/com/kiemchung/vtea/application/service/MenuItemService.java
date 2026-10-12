package com.kiemchung.vtea.application.service;

import com.kiemchung.vtea.domain.dto.request.CreateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.request.UpdateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.response.MenuItemResponse;

import java.util.List;

/**
 * Interface định nghĩa các nghiệp vụ quản lý món trong Menu.
 */
public interface MenuItemService {
    List<MenuItemResponse> getAllMenuItems();
    MenuItemResponse getMenuItemById(Long id);
    MenuItemResponse createMenuItem(CreateMenuItemRequest request);
    MenuItemResponse updateMenuItem(Long id, UpdateMenuItemRequest request);
    void deleteMenuItem(Long id);
}
