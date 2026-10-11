package com.kiemchung.vtea.domain.dto.response;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.assertEquals;

class MenuItemResponseTest {

    @Test
    void testGettersAndSetters() {
        MenuItemResponse res = new MenuItemResponse();
        
        res.setId(1L);
        res.setName("Name");
        res.setDescription("Desc");
        res.setPrice(new BigDecimal("100"));
        res.setImageUrl("Url");
        res.setCategory("Cat");

        assertEquals(1L, res.getId());
        assertEquals("Name", res.getName());
        assertEquals("Desc", res.getDescription());
        assertEquals(new BigDecimal("100"), res.getPrice());
        assertEquals("Url", res.getImageUrl());
        assertEquals("Cat", res.getCategory());
    }

    @Test
    void testAllArgsConstructor() {
        MenuItemResponse res = new MenuItemResponse(2L, "Name2", "Desc2", new BigDecimal("200"), "Url2", "Cat2");

        assertEquals(2L, res.getId());
        assertEquals("Name2", res.getName());
        assertEquals("Desc2", res.getDescription());
        assertEquals(new BigDecimal("200"), res.getPrice());
        assertEquals("Url2", res.getImageUrl());
        assertEquals("Cat2", res.getCategory());
    }
}
