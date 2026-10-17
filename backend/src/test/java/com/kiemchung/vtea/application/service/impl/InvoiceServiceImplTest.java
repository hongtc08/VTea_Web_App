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
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Mục đích file: Unit test cho nghiệp vụ tạo hóa đơn và bảo mật API thanh toán
 * (tính toán lại giá từ DB, cộng thuế VAT 10% và chéo check giá tiền từ FE gửi lên).
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
        staff.setStatus(Status.ACTIVE);

        Category activeCategory = new Category();
        activeCategory.setCategoryId(1);
        activeCategory.setName("Trà sữa");
        activeCategory.setIsAvailable(true);

        milkTea = product(10, "Trà sữa", "30000", true);
        milkTea.setCategory(activeCategory);
        lemonTea = product(11, "Trà chanh", "25000", null); // null = vẫn bán
        pearl = topping(20, "Trân châu", "5000", true);
        pudding = topping(21, "Pudding", "3000", true);
    }

    // ===================== Helpers =====================

    private Product product(int id, String name, String price, Boolean available) {
        Product p = new Product();
        p.setProductId(id);
        p.setName(name);
        p.setPrice(price != null ? new BigDecimal(price) : null);
        p.setIsAvailable(available);
        return p;
    }

    private Topping topping(int id, String name, String price, Boolean available) {
        Topping t = new Topping();
        t.setToppingId(id);
        t.setName(name);
        t.setPrice(price != null ? new BigDecimal(price) : null);
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
        assertBadRequest("staff1", req, expectedMessage);
    }

    private void assertBadRequest(String username, CreateInvoiceRequest req, String expectedMessage) {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> invoiceService.createInvoice(username, req));
        assertTrue(ex.getMessage().contains(expectedMessage), "Thông báo thực tế: " + ex.getMessage());
        verify(invoiceRepository, never()).save(any());
    }

    // ===================== Tests =====================

    @Test
    void createInvoice_Success_CalculatesSubtotalVatAndTotalCorrectly() {
        // 2 ly trà sữa, mỗi ly: 1 trân châu (quantity null -> mặc định 1) + 2 pudding
        // => line1 = (30000 + 5000 + 3000*2) * 2 = 82000
        CreateInvoiceRequest.Item item1 = item(10, 2, toppingItem(20, null), toppingItem(21, 2));
        // 1 ly trà chanh không topping (toppings = null) => line2 = 25000
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

        // Tạm tính = 82000 + 25000 = 107000; VAT 10% = 10700; Tổng cộng = 117700
        assertEquals(100, res.getInvoiceId());
        assertEquals(1, res.getUserId());
        assertEquals("Nguyen Van A", res.getStaffName());
        assertEquals(PaymentMethod.TRANSFER, res.getPaymentMethod());
        assertNotNull(res.getCreatedAt());
        assertEquals(0, new BigDecimal("107000").compareTo(res.getSubtotal()));
        assertEquals(0, new BigDecimal("10700").compareTo(res.getVat()));
        assertEquals(0, new BigDecimal("117700").compareTo(res.getTotalAmount()));

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
    void createInvoice_WithMatchingClientPrices_CrossChecksAndSucceeds() {
        // 1 ly trà sữa (30000) + 2 trân châu (5000 * 2 = 10000) => lineTotal = 40000
        // subtotal = 40000, vat = 4000, totalAmount = 44000
        CreateInvoiceRequest.ToppingItem top = toppingItem(20, 2);
        top.setUnitPrice(new BigDecimal("5000"));

        CreateInvoiceRequest.Item item1 = item(10, 1, top);
        item1.setUnitPrice(new BigDecimal("30000"));
        item1.setLineTotal(new BigDecimal("40000"));

        CreateInvoiceRequest req = request(item1);
        req.setSubtotal(new BigDecimal("40000"));
        req.setVat(new BigDecimal("4000"));
        req.setTotalAmount(new BigDecimal("44000"));

        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));
        when(toppingRepository.findById(20)).thenReturn(Optional.of(pearl));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(inv -> {
            Invoice saved = inv.getArgument(0);
            saved.setInvoiceId(101);
            return saved;
        });

        InvoiceResponse res = invoiceService.createInvoice("staff1", req);

        assertEquals(101, res.getInvoiceId());
        assertEquals(0, new BigDecimal("40000").compareTo(res.getSubtotal()));
        assertEquals(0, new BigDecimal("4000").compareTo(res.getVat()));
        assertEquals(0, new BigDecimal("44000").compareTo(res.getTotalAmount()));
        verify(invoiceRepository).save(any(Invoice.class));
    }

    @Test
    void createInvoice_TamperedProductUnitPrice_Throws() {
        CreateInvoiceRequest.Item item1 = item(10, 1);
        item1.setUnitPrice(new BigDecimal("1000")); // Giá thực trong DB là 30000

        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));

        assertBadRequest(request(item1), "Đơn giá món 'Trà sữa' không khớp");
    }

    @Test
    void createInvoice_NegativeClientPrice_Throws() {
        CreateInvoiceRequest.Item item1 = item(10, 1);
        item1.setUnitPrice(new BigDecimal("-5000"));

        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));

        assertBadRequest(request(item1), "không được âm");
    }

    @Test
    void createInvoice_TamperedToppingUnitPrice_Throws() {
        CreateInvoiceRequest.ToppingItem top = toppingItem(20, 1);
        top.setUnitPrice(new BigDecimal("1000")); // Giá thực trong DB là 5000
        CreateInvoiceRequest.Item item1 = item(10, 1, top);

        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));
        when(toppingRepository.findById(20)).thenReturn(Optional.of(pearl));

        assertBadRequest(request(item1), "Đơn giá topping 'Trân châu' không khớp");
    }

    @Test
    void createInvoice_TamperedLineTotal_Throws() {
        CreateInvoiceRequest.Item item1 = item(10, 2); // 30000 * 2 = 60000
        item1.setLineTotal(new BigDecimal("30000"));

        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));

        assertBadRequest(request(item1), "Thành tiền của món 'Trà sữa' không khớp");
    }

    @Test
    void createInvoice_TamperedSubtotal_Throws() {
        CreateInvoiceRequest req = request(item(10, 1)); // subtotal chuẩn = 30000
        req.setSubtotal(new BigDecimal("20000"));

        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));

        assertBadRequest(req, "Tạm tính (subtotal) từ client không khớp");
    }

    @Test
    void createInvoice_TamperedVat_Throws() {
        CreateInvoiceRequest req = request(item(10, 1)); // vat chuẩn = 3000
        req.setSubtotal(new BigDecimal("30000"));
        req.setVat(new BigDecimal("0"));

        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));

        assertBadRequest(req, "Tiền thuế VAT từ client không khớp");
    }

    @Test
    void createInvoice_TamperedTotalAmount_Throws() {
        CreateInvoiceRequest req = request(item(10, 1)); // total chuẩn = 33000
        req.setTotalAmount(new BigDecimal("30000"));

        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));

        assertBadRequest(req, "Tổng tiền thanh toán từ client không khớp");
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
    void createInvoice_NullOrBlankUsername_Throws() {
        assertBadRequest(null, request(item(10, 1)), "Không xác định được nhân viên");
        assertBadRequest("   ", request(item(10, 1)), "Không xác định được nhân viên");
    }

    @Test
    void createInvoice_UserNotFound_Throws() {
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.empty());
        assertBadRequest(request(item(10, 1)), "Không tìm thấy nhân viên");
    }

    @Test
    void createInvoice_DeletedStaff_Throws() {
        staff.setStatus(Status.DELETED);
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        assertBadRequest(request(item(10, 1)), "ngừng hoạt động");
    }

    @Test
    void createInvoice_NullItemInList_Throws() {
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        CreateInvoiceRequest req = new CreateInvoiceRequest();
        req.setPaymentMethod(PaymentMethod.CASH);
        req.setItems(Collections.singletonList(null));
        assertBadRequest(req, "Thiếu productId");
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
    void createInvoice_ProductCategoryUnavailable_Throws() {
        Category disabledCategory = new Category();
        disabledCategory.setCategoryId(2);
        disabledCategory.setName("Món theo mùa");
        disabledCategory.setIsAvailable(false);
        milkTea.setCategory(disabledCategory);

        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));
        assertBadRequest(request(item(10, 1)), "ngừng bán");
    }

    @Test
    void createInvoice_InvalidProductDbPrice_Throws() {
        milkTea.setPrice(null);
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));
        assertBadRequest(request(item(10, 1)), "không hợp lệ");

        milkTea.setPrice(new BigDecimal("-1000"));
        assertBadRequest(request(item(10, 1)), "không hợp lệ");
    }

    @Test
    void createInvoice_NullToppingElement_Throws() {
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));

        CreateInvoiceRequest.Item item1 = item(10, 1);
        item1.setToppings(Collections.singletonList(null));
        assertBadRequest(request(item1), "Thiếu toppingId");
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
    void createInvoice_InvalidToppingDbPrice_Throws() {
        pearl.setPrice(null);
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));
        when(toppingRepository.findById(20)).thenReturn(Optional.of(pearl));
        assertBadRequest(request(item(10, 1, toppingItem(20, 1))), "không hợp lệ");

        pearl.setPrice(new BigDecimal("-500"));
        assertBadRequest(request(item(10, 1, toppingItem(20, 1))), "không hợp lệ");
    }

    @Test
    void createInvoice_DuplicateTopping_Throws() {
        when(userRepository.findByUsername("staff1")).thenReturn(Optional.of(staff));
        when(productRepository.findById(10)).thenReturn(Optional.of(milkTea));
        when(toppingRepository.findById(20)).thenReturn(Optional.of(pearl));
        assertBadRequest(request(item(10, 1, toppingItem(20, 1), toppingItem(20, 2))), "bị trùng");
    }
}

