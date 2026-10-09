package com.kiemchung.vtea.domain.entity;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.assertEquals;

class MenuItemTest {

    @Test
    void testGettersAndSetters() {
        MenuItem item = new MenuItem();
        
        item.setId(1L);
        item.setName("Name");
        item.setDescription("Desc");
        item.setPrice(new BigDecimal("100"));
        item.setImageUrl("Url");
        item.setCategory("Cat");

        assertEquals(1L, item.getId());
        assertEquals("Name", item.getName());
        assertEquals("Desc", item.getDescription());
        assertEquals(new BigDecimal("100"), item.getPrice());
        assertEquals("Url", item.getImageUrl());
        assertEquals("Cat", item.getCategory());
    }
}
