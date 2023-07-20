<script setup>
import { onMounted, ref } from 'vue';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import CourierServices from "../services/CourierServices.js";
import CommonDeleteDialog from '../components/CommonDeleteDialog.vue';
import AddUpdateCourier from '../components/AddUpdateCourier.vue';

const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const router = useRouter();
const userDetails = ref(null);
const showDeletePopup = ref(false);
const totalCouriers = ref([]);
const selectedCourier = ref(null);

const courierDetails = ref({
    pickupAvenvue: null,
    dropAvenvue: null,
    pickupStreet: null,
    dropStreet: null,
    deliveryCost: null,
    customerDetails: null,
});
onMounted(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDetails.value = user;
    if (user != null) {
        getALlCouriers();
    }
});
const openCourierPopup = (id = null, currViewType = "add") => {
    router.push({ name: "addCourier" });
}

async function getALlCouriers() {
    await CourierServices.getCouriers()
        .then((response) => {
            totalCouriers.value = response.data.data;
        })
        .catch((error) => {
            console.log(error);
            snackBar.value = {
                value: true,
                color: "error",
                text: error.response.data.message,
            }
        });
}

const deleteCourier = (courier) => {
    selectedCourier.value = courier;
    showDeletePopup.value = true;
}
async function onConfDelete() {
    await CourierServices.deleteCourier(selectedCourier.value.id)
        .then((response) => {
            if (response.data.status == "Success") {
                getALlCouriers();
                showDeletePopup.value = false;
                snackBar.value = {
                    value: true,
                    color: "green",
                    text: response.data.message,
                }
            }
        })
        .catch((error) => {
            console.log(error);
            snackBar.value = {
                value: true,
                color: "error",
                text: error.response.data.message,
            }
        });
}
const closeDeletePopup = () => {
    showDeletePopup.value = false;
    employee.value = {
        empId: null,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: null,
    }
}

const onEdit = (id) => {
    router.push({ name: 'updateCourier', params: { courierId: id } })
}
</script>
<template>
    <v-container fill-height>
        <v-row align="center">
            <v-col class="d-flex justify-space-between"><v-card-title class="pl-0 text-h4 font-weight-bold">
                    Couriers List
                </v-card-title>
                <v-btn v-if="userDetails?.roleId != 3" class="mt-3" variant="flat" color="deep-purple"
                    @click="() => openCourierPopup()">Add Courier</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card class="rounded-lg elevation-5">
                    <v-row align="center">
                        <v-col cols="12">
                            <v-table>
                                <thead>
                                    <tr v-bind:style="{
                                        backgroundColor: '#b28cf7',
                                    }">
                                        <th class="text-left">Sender</th>
                                        <th class="text-left">Receiver</th>
                                        <th class="text-left">Pickup</th>
                                        <th class="text-left">Drop</th>
                                        <th class="text-left">Fair($)</th>
                                        <th class="text-left">Status</th>
                                        <th class="text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="totalCouriers.length == 0">
                                        <td colspan="6" v-bind:style="{
                                            color: '#707070',
                                            'font-size': '14px',
                                            textAlign: 'center',
                                        }">
                                            No Couriers found...
                                        </td>
                                    </tr>
                                    <tr v-for="courier in totalCouriers" :key="courier.id">
                                        <td>
                                            {{ courier?.senderDetails?.firstName + " " + courier?.senderDetails?.lastName }}
                                        </td>
                                        <td>
                                            {{ courier?.receiverDetails?.firstName + " " +
                                                courier?.receiverDetails?.lastName }}
                                        </td>
                                        <td>
                                            {{ courier?.pickupPoint?.split("/")[1] }}
                                        </td>
                                        <td>
                                            {{ courier?.dropoffPoint?.split("/")[1] }}
                                        </td>
                                        <td>
                                            {{ courier?.quotedPrice }}
                                        </td>
                                        <td>{{ courier?.status.statusName }}</td>
                                        <td>
                                            <v-icon class="mr-3 mt-2" size="large" icon="mdi-pencil"
                                                @click="() => onEdit(courier.id)"></v-icon>
                                            <v-icon class="mt-2" size="large" icon="mdi-delete" @click="() => deleteCourier(courier)"></v-icon>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row></v-card></v-col></v-row>
    </v-container>
    <CommonDeleteDialog :showDeletePopup="showDeletePopup" :onConfDelete="onConfDelete" :closeDeletePopup="closeDeletePopup"
        :textValue="`Are you sure want to delete this item from couriers list.`" />
</template>