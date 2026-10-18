package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.application.service.InvoiceService;
import com.kiemchung.vtea.domain.dto.request.CreateInvoiceRequest;
import com.kiemchung.vtea.domain.dto.response.InvoiceResponse;
import com.kiemchung.vtea.domain.entity.*;
import com.kiemchung.vtea.domain.repository.InvoiceRepository;
import com.kiemchung.vtea.domain.repository.ProductRepository;
import com.kiemchung.vtea.domain.repository.ToppingRepository;
import com.kiemchung.vtea.domain.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Thực thi nghiệp vụ hóa đơn: tạo hóa đơn, xem danh sách và chi tiết lịch sử hóa đơn theo phân quyền.
 */
@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ProductRepository productRepository;
    private final ToppingRepository toppingRepository;
    private final UserRepository userRepository;

    public InvoiceServiceImpl(InvoiceRepository invoiceRepository,
                              ProductRepository productRepository,
                              ToppingRepository toppingRepository,
                              UserRepository userRepository) {
        this.invoiceRepository = invoiceRepository;
        this.productRepository = productRepository;
        this.toppingRepository = toppingRepository;
        this.userRepository = userRepository;
    }

    /**
     * Tạo hóa đơn. @Transactional: lỗi ở bất kỳ bước nào sẽ rollback toàn bộ.
     */
    @Override
    @Transactional
    public InvoiceResponse createInvoice(String username, CreateInvoiceRequest request) {
        validateRequest(request);

        User staff = findUserByUsername(username);

        Invoice invoice = new Invoice();
        invoice.setUser(staff);
        invoice.setPaymentMethod(request.getPaymentMethod());
        invoice.setCreatedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        for (CreateInvoiceRequest.Item item : request.getItems()) {
            InvoiceDetail detail = buildDetail(item);
            invoice.addDetail(detail);
            total = total.add(calculateLineTotal(detail));
        }
        invoice.setTotalAmount(total);

        return mapToResponse(invoiceRepository.save(invoice));
    }

    /**
     * Lấy danh sách lịch sử hóa đơn theo phân quyền:
     * - ADMIN: Xem toàn bộ hóa đơn trong hệ thống.
     * - STAFF: Chỉ xem các hóa đơn do chính mình tạo.
     */
    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoices(String username) {
        User currentUser = findUserByUsername(username);

        List<Invoice> invoices = (currentUser.getRole() == Role.ADMIN)
                ? invoiceRepository.findAllByOrderByCreatedAtDesc()
                : invoiceRepository.findByUser_UserIdOrderByCreatedAtDesc(currentUser.getUserId());

        return invoices.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Xem chi tiết 1 hóa đơn theo ID:
     * - ADMIN: Xem được mọi hóa đơn.
     * - STAFF: Chỉ xem được hóa đơn do chính mình tạo (nếu xem của người khác sẽ ném AccessDeniedException).
     */
    @Override
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Integer invoiceId, String username) {
        User currentUser = findUserByUsername(username);

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hóa đơn với ID: " + invoiceId));

        if (currentUser.getRole() != Role.ADMIN
                && !currentUser.getUserId().equals(invoice.getUser().getUserId())) {
            throw new AccessDeniedException("Bạn không có quyền xem hóa đơn của nhân viên khác!");
        }

        return mapToResponse(invoice);
    }

    private User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên: " + username));
    }

    /** Kiểm tra payload tổng quát. */
    private void validateRequest(CreateInvoiceRequest request) {
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Hóa đơn phải có ít nhất 1 món!");
        }
        if (request.getPaymentMethod() == null) {
            throw new IllegalArgumentException("Vui lòng chọn phương thức thanh toán!");
        }
    }

    /** Tạo 1 dòng chi tiết từ 1 món trong request (giá lấy từ DB). */
    private InvoiceDetail buildDetail(CreateInvoiceRequest.Item item) {
        if (item.getProductId() == null) {
            throw new IllegalArgumentException("Thiếu productId cho món!");
        }
        requirePositive(item.getQuantity(), "Số lượng món phải lớn hơn 0!");

        Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy món với ID: " + item.getProductId()));
        if (Boolean.FALSE.equals(product.getIsAvailable())) {
            throw new IllegalArgumentException("Món '" + product.getName() + "' hiện đã ngừng bán!");
        }

        InvoiceDetail detail = new InvoiceDetail();
        detail.setProduct(product);
        detail.setQuantity(item.getQuantity());
        detail.setUnitPrice(product.getPrice());

        List<CreateInvoiceRequest.ToppingItem> toppings = item.getToppings();
        if (toppings != null) {
            Set<Integer> seen = new HashSet<>();
            for (CreateInvoiceRequest.ToppingItem t : toppings) {
                // Bảng có khóa chính (detail_id, topping_id) nên 1 món không được trùng topping
                if (!seen.add(t.getToppingId())) {
                    throw new IllegalArgumentException("Topping ID " + t.getToppingId() + " bị trùng trong cùng 1 món!");
                }
                detail.addTopping(buildTopping(t));
            }
        }
        return detail;
    }

    /** Tạo 1 dòng topping (mặc định số lượng = 1 nếu không gửi). */
    private InvoiceDetailTopping buildTopping(CreateInvoiceRequest.ToppingItem item) {
        if (item.getToppingId() == null) {
            throw new IllegalArgumentException("Thiếu toppingId!");
        }
        int quantity = item.getQuantity() == null ? 1 : item.getQuantity();
        requirePositive(quantity, "Số lượng topping phải lớn hơn 0!");

        Topping topping = toppingRepository.findById(item.getToppingId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy topping với ID: " + item.getToppingId()));
        if (Boolean.FALSE.equals(topping.getIsAvailable())) {
            throw new IllegalArgumentException("Topping '" + topping.getName() + "' hiện đã ngừng bán!");
        }

        InvoiceDetailTopping detailTopping = new InvoiceDetailTopping();
        detailTopping.setTopping(topping);
        detailTopping.setQuantity(quantity);
        detailTopping.setUnitPrice(topping.getPrice());
        return detailTopping;
    }

    /** Thành tiền 1 dòng = (giá món + tổng tiền topping của 1 ly) × số ly. */
    private BigDecimal calculateLineTotal(InvoiceDetail detail) {
        BigDecimal perCup = detail.getUnitPrice();
        for (InvoiceDetailTopping t : detail.getToppings()) {
            perCup = perCup.add(t.getUnitPrice().multiply(BigDecimal.valueOf(t.getQuantity())));
        }
        return perCup.multiply(BigDecimal.valueOf(detail.getQuantity()));
    }

    private void requirePositive(Integer value, String message) {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException(message);
        }
    }

    /** Chuyển Entity -> DTO. */
    private InvoiceResponse mapToResponse(Invoice invoice) {
        InvoiceResponse response = new InvoiceResponse();
        response.setInvoiceId(invoice.getInvoiceId());
        response.setUserId(invoice.getUser().getUserId());
        response.setStaffName(invoice.getUser().getFullName());
        response.setPaymentMethod(invoice.getPaymentMethod());
        response.setTotalAmount(invoice.getTotalAmount());
        response.setCreatedAt(invoice.getCreatedAt());

        for (InvoiceDetail detail : invoice.getDetails()) {
            InvoiceResponse.Item item = new InvoiceResponse.Item();
            item.setProductId(detail.getProduct().getProductId());
            item.setProductName(detail.getProduct().getName());
            item.setQuantity(detail.getQuantity());
            item.setUnitPrice(detail.getUnitPrice());
            item.setLineTotal(calculateLineTotal(detail));

            for (InvoiceDetailTopping t : detail.getToppings()) {
                InvoiceResponse.ToppingItem toppingItem = new InvoiceResponse.ToppingItem();
                toppingItem.setToppingId(t.getTopping().getToppingId());
                toppingItem.setToppingName(t.getTopping().getName());
                toppingItem.setQuantity(t.getQuantity());
                toppingItem.setUnitPrice(t.getUnitPrice());
                item.getToppings().add(toppingItem);
            }
            response.getItems().add(item);
        }
        return response;
    }
}
