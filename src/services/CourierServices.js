import apiClient from "./services";

export default {
  getCouriers() {
    return apiClient.get("orders");
  },
  getCourierByCourierId(orderId) {
    return apiClient.get(`order/${orderId}`);
  },
  addCourier(payload) {
    return apiClient.post(`order`, payload);
  },
  updateCourier(orderId, payload) {
    return apiClient.put(`order/${orderId}`, payload);
  },
  deleteCourier(orderId) {
    return apiClient.delete(`order/${orderId}`);
  },
};
