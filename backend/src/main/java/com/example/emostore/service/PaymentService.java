package com.example.emostore.service;

import com.example.emostore.model.Order;
import com.example.emostore.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PaymentService {

    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    private final OrderRepository orderRepository;

    public PaymentService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public String createRazorpayOrder(Order order) throws RazorpayException {
        RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);

        JSONObject orderRequest = new JSONObject();
        // Razorpay accepts amount in paise (multiply by 100)
        orderRequest.put("amount", order.getTotalAmount().multiply(new BigDecimal("100")).intValue());
        orderRequest.put("currency", "INR"); // Or USD
        orderRequest.put("receipt", "txn_" + order.getId());

        com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);
        String razorpayOrderId = razorpayOrder.get("id");

        order.setRazorpayOrderId(razorpayOrderId);
        order.setPaymentStatus("CREATED");
        orderRepository.save(order);

        return razorpayOrderId;
    }

    public boolean verifyPaymentSignature(String rzpOrderId, String rzpPaymentId, String signature) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", rzpOrderId);
            options.put("razorpay_payment_id", rzpPaymentId);
            options.put("razorpay_signature", signature);

            boolean status = Utils.verifyPaymentSignature(options, apiSecret);
            if (status) {
                Order order = orderRepository.findByRazorpayOrderId(rzpOrderId).orElse(null);
                if (order != null) {
                    order.setPaymentStatus("SUCCESS");
                    order.setStatus("PAID");
                    order.setRazorpayPaymentId(rzpPaymentId);
                    order.setRazorpaySignature(signature);
                    orderRepository.save(order);
                }
                return true;
            }
        } catch (RazorpayException e) {
            e.printStackTrace();
        }
        return false;
    }
}
