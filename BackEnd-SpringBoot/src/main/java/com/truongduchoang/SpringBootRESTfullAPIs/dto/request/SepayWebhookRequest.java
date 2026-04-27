package com.truongduchoang.SpringBootRESTfullAPIs.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class SepayWebhookRequest {

    // ID giao dịch duy nhất từ SePay — dùng để chống duplicate
    private Long id;

    // "in" = tiền vào, "out" = tiền ra — chỉ xử lý "in"
    @JsonProperty("transferType")
    private String transferType;

    // Số tiền giao dịch
    @JsonProperty("transferAmount")
    private BigDecimal transferAmount;

    // Nội dung chuyển khoản — chứa ORDER-xxx để parse orderId
    private String content;

    // Số tài khoản nhận
    @JsonProperty("accountNumber")
    private String accountNumber;

    // Thời gian giao dịch
    @JsonProperty("transactionDate")
    private String transactionDate;

    // Mã tham chiếu ngân hàng
    @JsonProperty("referenceCode")
    private String referenceCode;

    // Số dư sau giao dịch
    @JsonProperty("accumulated")
    private BigDecimal accumulated;

    // Mô tả thêm
    private String description;

    public SepayWebhookRequest() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTransferType() { return transferType; }
    public void setTransferType(String transferType) { this.transferType = transferType; }
    public BigDecimal getTransferAmount() { return transferAmount; }
    public void setTransferAmount(BigDecimal transferAmount) { this.transferAmount = transferAmount; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public String getTransactionDate() { return transactionDate; }
    public void setTransactionDate(String transactionDate) { this.transactionDate = transactionDate; }
    public String getReferenceCode() { return referenceCode; }
    public void setReferenceCode(String referenceCode) { this.referenceCode = referenceCode; }
    public BigDecimal getAccumulated() { return accumulated; }
    public void setAccumulated(BigDecimal accumulated) { this.accumulated = accumulated; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
