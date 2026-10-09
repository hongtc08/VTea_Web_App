package com.kiemchung.vtea.application.service;

import com.kiemchung.vtea.domain.dto.response.MenuItemResponse;
import java.util.List;

public interface MenuItemService {
    List<MenuItemResponse> getAllMenuItems();
}
