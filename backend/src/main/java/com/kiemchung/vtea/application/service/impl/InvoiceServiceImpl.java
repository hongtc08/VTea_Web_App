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
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Thực thi nghiệp vụ tạo hóa đơn, bảo mật API thanh toán và tra cứu lịch sử hóa đơn theo phân quyền.
 * Toàn bộ đơn giá món, topping, tạm tính, VAT (10%) và tổng tiền luôn được tính toán lại
 * từ Database dưới Backend và đối chiếu (chéo check) với dữ liệu giá từ Frontend gửi lên.
 */
@Service
public class InvoiceServiceImpl implements InvoiceService {

    private static final BigDecimal VAT_RATE = new BigDecimal("0.10");

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
     * Tạo hóa đơn thanh toán bảo mật:
     * 1. Xác thực nhân viên từ JWT và kiểm tra tính hợp lệ của payload.
     * 2. Truy vấn giá thực tế của từng món & topping từ DB, chéo check với giá FE gửi lên.
     * 3. Tính lại tạm tính (subtotal), thuế VAT 10% và tổng tiền (totalAmount), đối chiếu với FE.
     * 4. Lưu hóa đơn vào DB trong 1 transaction
     */
    @Override
    @Transactional
    public InvoiceResponse createInvoice(String username, CreateInvoiceRequest request) {
        validateRequest(request);
        User staff = resolveAuthenticatedStaff(username);

        Invoice invoice = new Invoice();
        invoice.setUser(staff);
        invoice.setPaymentMethod(request.getPaymentMethod());
        invoice.setCreatedAt(LocalDateTime.now());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CreateInvoiceRequest.Item item : request.getItems()) {
            InvoiceDetail detail = buildDetail(item);
            BigDecimal lineTotal = calculateLineTotal(detail);

            // Chéo check thành tiền của từng dòng món nếu FE có gửi lên
            verifyPriceMatch(
                    item.getLineTotal(),
                    lineTotal,
                    "Thành tiền của món '" + detail.getProduct().getName() + "' không khớp với hệ thống!"
            );

            invoice.addDetail(detail);
            subtotal = subtotal.add(lineTotal);
        }

        // Tính thuế VAT 10% và tổng tiền thanh toán cuối cùng
        BigDecimal vat = calculateVat(subtotal);
        BigDecimal totalAmount = subtotal.add(vat);

        // Chéo check tổng tiền tạm tính, VAT và tổng thanh toán giữa FE và BE
        verifyInvoiceTotals(request, subtotal, vat, totalAmount);

        invoice.setTotalAmount(totalAmount);
        Invoice savedInvoice = invoiceRepository.save(invoice);

        return mapToResponse(savedInvoice);
    }

    /**
     * Lấy danh sách lịch sử hóa đơn theo phân quyền:
     * - ADMIN: Xem toàn bộ hóa đơn trong hệ thống.
     * - STAFF: Chỉ xem các hóa đơn do chính mình tạo.
     */
    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoices(String username) {
        User currentUser = resolveAuthenticatedStaff(username);

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
        User currentUser = resolveAuthenticatedStaff(username);

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy hóa đơn với ID: " + invoiceId));

        if (currentUser.getRole() != Role.ADMIN
                && !currentUser.getUserId().equals(invoice.getUser().getUserId())) {
            throw new AccessDeniedException("Bạn không có quyền xem hóa đơn của nhân viên khác!");
        }

        return mapToResponse(invoice);
    }

    /** Kiểm tra tính hợp lệ cơ bản của payload tạo hóa đơn. */
    private void validateRequest(CreateInvoiceRequest request) {
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Hóa đơn phải có ít nhất 1 món!");
        }
        if (request.getPaymentMethod() == null) {
            throw new IllegalArgumentException("Vui lòng chọn phương thức thanh toán!");
        }
    }

    /** Xác thực nhân viên tạo hóa đơn */
    private User resolveAuthenticatedStaff(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Không xác định được nhân viên thực hiện thanh toán!");
        }
        User staff = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhân viên: " + username));
        if (staff.getStatus() == Status.DELETED) {
            throw new IllegalArgumentException("Tài khoản nhân viên đã bị khóa hoặc ngừng hoạt động!");
        }
        return staff;
    }

    /**
     * Xây dựng chi tiết 1 dòng món: lấy giá gốc từ DB và đối chiếu với đơn giá món từ FE.
     */
    private InvoiceDetail buildDetail(CreateInvoiceRequest.Item item) {
        if (item == null || item.getProductId() == null) {
            throw new IllegalArgumentException("Thiếu productId cho món!");
        }
        requirePositive(item.getQuantity(), "Số lượng món phải lớn hơn 0!");

        Product product = productRepository.findById(item.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy món với ID: " + item.getProductId()));
        if (Boolean.FALSE.equals(product.getIsAvailable())
                || (product.getCategory() != null && Boolean.FALSE.equals(product.getCategory().getIsAvailable()))) {
            throw new IllegalArgumentException("Món '" + product.getName() + "' hiện đã ngừng bán!");
        }
        requireValidDbPrice(product.getPrice(), product.getName());

        // Chéo check đơn giá món từ FE (nếu có) với giá thực tế trong DB
        verifyPriceMatch(
                item.getUnitPrice(),
                product.getPrice(),
                "Đơn giá món '" + product.getName() + "' không khớp với giá hệ thống!"
        );

        InvoiceDetail detail = new InvoiceDetail();
        detail.setProduct(product);
        detail.setQuantity(item.getQuantity());
        detail.setUnitPrice(product.getPrice());

        List<CreateInvoiceRequest.ToppingItem> toppings = item.getToppings();
        if (toppings != null) {
            Set<Integer> seen = new HashSet<>();
            for (CreateInvoiceRequest.ToppingItem t : toppings) {
                if (t == null || t.getToppingId() == null) {
                    throw new IllegalArgumentException("Thiếu toppingId!");
                }
                // Bảng có khóa chính (detail_id, topping_id) nên 1 món không được trùng topping
                if (!seen.add(t.getToppingId())) {
                    throw new IllegalArgumentException("Topping ID " + t.getToppingId() + " bị trùng trong cùng 1 món!");
                }
                detail.addTopping(buildTopping(t));
            }
        }
        return detail;
    }

    /**
     * Xây dựng chi tiết 1 topping: lấy giá gốc từ DB và đối chiếu với đơn giá topping từ FE.
     */
    private InvoiceDetailTopping buildTopping(CreateInvoiceRequest.ToppingItem item) {
        int quantity = item.getQuantity() == null ? 1 : item.getQuantity();
        requirePositive(quantity, "Số lượng topping phải lớn hơn 0!");

        Topping topping = toppingRepository.findById(item.getToppingId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy topping với ID: " + item.getToppingId()));
        if (Boolean.FALSE.equals(topping.getIsAvailable())) {
            throw new IllegalArgumentException("Topping '" + topping.getName() + "' hiện đã ngừng bán!");
        }
        requireValidDbPrice(topping.getPrice(), topping.getName());

        // Chéo check đơn giá topping từ FE (nếu có) với giá thực tế trong DB
        verifyPriceMatch(
                item.getUnitPrice(),
                topping.getPrice(),
                "Đơn giá topping '" + topping.getName() + "' không khớp với giá hệ thống!"
        );

        InvoiceDetailTopping detailTopping = new InvoiceDetailTopping();
        detailTopping.setTopping(topping);
        detailTopping.setQuantity(quantity);
        detailTopping.setUnitPrice(topping.getPrice());
        return detailTopping;
    }

    /** Tính thành tiền 1 dòng món = (đơn giá món + tổng tiền topping của 1 ly) × số lượng ly. */
    private BigDecimal calculateLineTotal(InvoiceDetail detail) {
        BigDecimal perCup = detail.getUnitPrice();
        for (InvoiceDetailTopping t : detail.getToppings()) {
            perCup = perCup.add(t.getUnitPrice().multiply(BigDecimal.valueOf(t.getQuantity())));
        }
        return perCup.multiply(BigDecimal.valueOf(detail.getQuantity()));
    }

    /** Tính tiền thuế VAT 10% từ tạm tính */
    private BigDecimal calculateVat(BigDecimal subtotal) {
        return subtotal.multiply(VAT_RATE).setScale(0, RoundingMode.HALF_UP);
    }

    /** Đối chiếu các khoản tổng (subtotal, vat, totalAmount) từ FE gửi lên với kết quả BE tính lại. */
    private void verifyInvoiceTotals(CreateInvoiceRequest request,
                                     BigDecimal serverSubtotal,
                                     BigDecimal serverVat,
                                     BigDecimal serverTotalAmount) {
        verifyPriceMatch(
                request.getSubtotal(),
                serverSubtotal,
                "Tạm tính (subtotal) từ client không khớp với giá tính toán tại hệ thống!"
        );
        verifyPriceMatch(
                request.getVat(),
                serverVat,
                "Tiền thuế VAT từ client không khớp với giá tính toán tại hệ thống!"
        );
        verifyPriceMatch(
                request.getTotalAmount(),
                serverTotalAmount,
                "Tổng tiền thanh toán từ client không khớp với giá tính toán tại hệ thống!"
        );
    }

    /**
     * Hàm chéo check giá tiền
     */
    private void verifyPriceMatch(BigDecimal clientPrice, BigDecimal serverPrice, String errorMessage) {
        if (clientPrice == null) {
            return;
        }
        if (clientPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Giá tiền gửi lên không được âm!");
        }
        if (clientPrice.compareTo(serverPrice) != 0) {
            throw new IllegalArgumentException(
                    errorMessage + " (Client: " + clientPrice.toPlainString()
                            + ", Hệ thống: " + serverPrice.toPlainString() + ")"
            );
        }
    }

    /** Đảm bảo giá lưu trong Database luôn tồn tại và không âm trước khi tính toán. */
    private void requireValidDbPrice(BigDecimal dbPrice, String itemName) {
        if (dbPrice == null || dbPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Giá của '" + itemName + "' trong hệ thống không hợp lệ!");
        }
    }

    /** Kiểm tra số lượng phải là số nguyên dương (> 0). */
    private void requirePositive(Integer value, String message) {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException(message);
        }
    }

    /** Chuyển đổi Entity hóa đơn cùng chi tiết giá đã tính sang DTO phản hồi cho client. */
    private InvoiceResponse mapToResponse(Invoice invoice) {
        InvoiceResponse response = new InvoiceResponse();
        response.setInvoiceId(invoice.getInvoiceId());
        response.setUserId(invoice.getUser().getUserId());
        response.setStaffName(invoice.getUser().getFullName());
        response.setPaymentMethod(invoice.getPaymentMethod());
        response.setTotalAmount(invoice.getTotalAmount());
        response.setCreatedAt(invoice.getCreatedAt());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (InvoiceDetail detail : invoice.getDetails()) {
            BigDecimal lineTotal = calculateLineTotal(detail);
            subtotal = subtotal.add(lineTotal);

            InvoiceResponse.Item item = new InvoiceResponse.Item();
            item.setProductId(detail.getProduct().getProductId());
            item.setProductName(detail.getProduct().getName());
            item.setQuantity(detail.getQuantity());
            item.setUnitPrice(detail.getUnitPrice());
            item.setLineTotal(lineTotal);

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

        response.setSubtotal(subtotal);
        response.setVat(calculateVat(subtotal));
        return response;
    }
}

