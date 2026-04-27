package com.truongduchoang.SpringBootRESTfullAPIs.dto.response;

public class SendEventEmailResponse {

    private Long campaignId;
    private Integer recipientCount;
    private String message;

    public SendEventEmailResponse() {
    }

    public SendEventEmailResponse(Long campaignId, Integer recipientCount, String message) {
        this.campaignId = campaignId;
        this.recipientCount = recipientCount;
        this.message = message;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public Integer getRecipientCount() {
        return recipientCount;
    }

    public void setRecipientCount(Integer recipientCount) {
        this.recipientCount = recipientCount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
