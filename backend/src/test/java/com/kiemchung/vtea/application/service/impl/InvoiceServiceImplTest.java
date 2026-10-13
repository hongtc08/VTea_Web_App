package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.domain.dto.request.CreateInvoiceRequest;
import com.kiemchung.vtea.domain.dto.response.InvoiceResponse;
import com.kiemchung.vtea.domain.entity.*;
import com.kiemchung.vtea.domain.repository.InvoiceRepository;
import com.kiemchung.vtea.domain.repository.ProductRepository;
import com.kiemchung.vtea.domain.repository.ToppingRepository;
import com.kiemchung.vtea.domain.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit test cho nghiệp vụ tạo hóa đơn.
 */
@ExtendWith(MockitoExtension.class)
class InvoiceServiceImplTest {

    @Mock private InvoiceRepository invoiceRepository;
    @Mock private ProductRepository productRepository;
    @Mock private ToppingRepository toppingRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks
    private InvoiceServiceImpl invoiceService;

    private User staff;
    private Product milkTea;
    private Product lemonTea;
    private Topping pearl;
    private Topping pudding;

    @BeforeEach
    void setUp() {
        staff = new User();
        staff.setUserId(1);
        staff.setUsername("staff1");
        staff.setFullName("Nguyen Van A");

        milkTea = product(10, "Trà sữa", "30000", true);
        lemonTea = product(11, "Trà chanh", "25000", null); // null = vẫn bán
        pearl = topping(20, "Trân châu", "5000", true);
        pudding = topping(21, "Pudding", "3000", true);
    }

    // ===================== Helpers =====================

    private Product product(int id, String name, String price, Boolean available) {
        Product p = new Product();
        p.setProductId(id);
        p.setName(name);
        p.setPrice(new BigDecimal(price));
        p.setIsAvailable(available);
        return p;
    }

    private Topping topping(int id, String name, String price, Boolean available) {
        Topping t = new Topping();
        t.setToppingId(id);
        t.setName(name);
        t.setPrice(new BigDecimal(price));
        t.setIsAvailable(available);
        return t;
    }

    private CreateInvoiceRequest.Item item(Integer productId, Integer qty, CreateInvoiceRequest.ToppingItem... toppings) {
        CreateInvoiceRequest.Item i = new CreateInvoiceRequest.Item();
        i.setProductId(productId);
        i.setQuantity(qty);
        i.setToppings(new ArrayList<>(List.of(toppings)));
        return i;
    }

    private CreateInvoiceRequest.ToppingItem toppingItem(Integer toppingId, Integer qty) {
        CreateInvoiceRequest.ToppingItem t = new CreateInvoiceRequest.ToppingItem();
        t.setToppingId(toppingId);
        t.setQuantity(qty);
        return t;
    }

    private CreateInvoiceRequest request(CreateInvoiceRequest.Item... items) {
        CreateInvoiceRequest r = new CreateInvoiceRequest();
        r.setPaymentMethod(PaymentMethod.CASH);
        r.setItems(new ArrayList<>(List.of(items)));
        return r;
    }

    private void assertBadRequest(CreateInvoiceRequest req, String expectedMessage) {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> invoiceService.createInvoice("staff1", req));
        assertTrue(ex.getMessage().contains(expectedMessage), "Thông báo thực tế: " + ex.getMessage());
        verify(invoiceRepository, never()).save(any());
    }

    // ===================== Tests =====================

    @Test
    void createInvoice_Success_CalculatesTotalCorrectly() {
        // 2 ly trà sữa, mỗi ly: 1 trân châu (quantity null -> mặc định 1) + 2 pudding
        // => (30000 + 5000 + 3000*2) * 2 = 82000
        CreateInvoiceRequest.Item item1 = item(10, 2, toppingItem(20, null), toppingItem(21, 2));
        // 1 ly trà chanh không topping (toppings = null) => 25000
        CreateInvoiceRequest.Item item2 = item(11, 1);
        item2.setToppings(null);
        CreateInvoiceRequest req = request(item1, item2);
        req.setPaymentMethod(PaymentMethod.TRANSFER);

        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));
        when(productRepository.findById(11)).thenReturn(Optional.of(lemonTea));
        when(toppingRepository.findById(20)).thenReturn(Optional.of(pearl));
        when(toppingRepository.findById(21)).thenReturn(Optional.of(pudding));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> {
            Invoice saved = inv.getArgument(0);
            saved.setInvoiceId(100);
            return saved;
        });

        InvoiceResponse res = invoiceService.createInvoice("staff1", req);

        assertEquals(100, res.getInvoiceId());
        assertEquals(1, res.getUserId());
        assertEquals("Nguyen Van A", res.getStaffName());
        assertEquals(PaymentMethod.TRANSFER, res.getPaymentMethod());
        assertNotNull(res.getCreatedAt());
        assertEquals(0, new BigDecimal("107000").compareTo(res.getTotalAmount()));

        assertEquals(2, res.getItems().size());
        InvoiceResponse.Item first = res.getItems().get(0);
        assertEquals("Trà sữa", first.getProductName());
        assertEquals(0, new BigDecimal("82000").compareTo(first.getLineTotal()));
        assertEquals(2, first.getToppings().size());
        assertEquals(1, first.getToppings().get(0).getQuantity());
        assertEquals("Trân châu", first.getToppings().get(0).getToppingName());
        assertEquals(0, new BigDecimal("25000").compareTo(res.getItems().get(1).getLineTotal()));
        assertTrue(res.getItems().get(1).getToppings().isEmpty());

        verify(invoiceRepository).save(any(Invoice.class));
    }

    @Test
    void createInvoice_NullRequest_Throws() {
        assertBadRequest(null, "ít nhất 1 món");
    }

    @Test
    void createInvoice_NullItems_Throws() {
        CreateInvoiceRequest req = request();
        req.setItems(null);
        assertBadRequest(req, "ít nhất 1 món");
    }

    @Test
    void createInvoice_EmptyItems_Throws() {
        assertBadRequest(request(), "ít nhất 1 món");
    }

    @Test
    void createInvoice_MissingPaymentMethod_Throws() {
        CreateInvoiceRequest req = request(item(10, 1));
        req.setPaymentMethod(null);
        assertBadRequest(req, "phương thức thanh toán");
    }

    @Test
    void createInvoice_UserNotFound_Throws() {
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.empty());
        assertBadRequest(request(item(10, 1)), "Không tìm thấy nhân viên");
    }

    @Test
    void createInvoice_MissingProductId_Throws() {
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        assertBadRequest(request(item(null, 1)), "Thiếu productId");
    }

    @Test
    void createInvoice_NullQuantity_Throws() {
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        assertBadRequest(request(item(10, null)), "Số lượng món");
    }

    @Test
    void createInvoice_ZeroQuantity_Throws() {
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        assertBadRequest(request(item(10, 0)), "Số lượng món");
    }

    @Test
    void createInvoice_ProductNotFound_Throws() {
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(99)).thenReturn(Optional.empty());
        assertBadRequest(request(item(99, 1)), "Không tìm thấy món");
    }

    @Test
    void createInvoice_ProductUnavailable_Throws() {
        milkTea.setIsAvailable(false);
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));
        assertBadRequest(request(item(10, 1)), "ngừng bán");
    }

    @Test
    void createInvoice_MissingToppingId_Throws() {
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));
        assertBadRequest(request(item(10, 1, toppingItem(null, 1))), "Thiếu toppingId");
    }

    @Test
    void createInvoice_ToppingZeroQuantity_Throws() {
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));
        assertBadRequest(request(item(10, 1, toppingItem(20, 0))), "Số lượng topping");
    }

    @Test
    void createInvoice_ToppingNotFound_Throws() {
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));
        when(toppingRepository.findById(99)).thenReturn(Optional.empty());
        assertBadRequest(request(item(10, 1, toppingItem(99, 1))), "Không tìm thấy topping");
    }

    @Test
    void createInvoice_ToppingUnavailable_Throws() {
        pearl.setIsAvailable(false);
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));
        when(toppingRepository.findById(20)).thenReturn(Optional.of(pearl));
        assertBadRequest(request(item(10, 1, toppingItem(20, 1))), "ngừng bán");
    }

    @Test
    void createInvoice_DuplicateTopping_Throws() {
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));
        when(toppingRepository.findById(20)).thenReturn(Optional.of(pearl));
        assertBadRequest(request(item(10, 1, toppingItem(20, 1), toppingItem(20, 2))), "bị trùng");
    }
}
