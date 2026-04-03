package com.example.emostore.service;

import com.example.emostore.model.Order;
import com.example.emostore.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    private final OrderRepository orderRepository;

    public String createRazorpayOrder(Order order) throws RazorpayException {
        log.info("Creating Razorpay order for order id: {}", order.getId());
        RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", order.getTotalAmount().multiply(new BigDecimal("100")).intValue());
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + order.getId());

        com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);
        String razorpayOrderId = razorpayOrder.get("id");

        order.setRazorpayOrderId(razorpayOrderId);
        order.setPaymentStatus("CREATED");
        orderRepository.save(order);

        return razorpayOrderId;
    }

    public boolean verifyPaymentSignature(String rzpOrderId, String rzpPaymentId, String signature) {
        log.info("Verifying signature for Razorpay order: {}", rzpOrderId);
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", rzpOrderId);
            options.put("razorpay_payment_id", rzpPaymentId);
            options.put("razorpay_signature", signature);

            boolean status = Utils.verifyPaymentSignature(options, apiSecret);
            if (status) {
                orderRepository.findByRazorpayOrderId(rzpOrderId).ifPresent(order -> {
                    order.setPaymentStatus("SUCCESS");
                    order.setStatus("PAID");
                    order.setRazorpayPaymentId(rzpPaymentId);
                    order.setRazorpaySignature(signature);
                    orderRepository.save(order);
                });
                return true;
            }
        } catch (RazorpayException e) {
            log.error("Error verifying signature: {}", e.getMessage());
        }
        return false;
    }
}
