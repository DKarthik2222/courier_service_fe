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
const showDeletePopup = ref(false);
const totalCouriers = ref([]);
const viewType = ref('add');

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
    if (user != null && (user.roleId == 1 || user.roleId == 2)) {
        // getALlCouriers();
    } else if (user != null && user.roleId != 1 && user.roleId != 2) {
        router.push({ name: "dashboard" });
    }
});
const openCourierPopup = (id = null, currViewType = "add") => {
    router.push({ name: "addCourier" });
    // viewType.value = currViewType;
    // showCourierPopup.value = true;
    // if (id) {
    //     getCourierById(id);
    // }
}
async function getCourierById(id) {
    await CourierServices.getCourierByCourierId(id)
        .then((response) => {
            employee.value = {
                empId: response.data.data.empId,
                firstName: response.data.data.firstName,
                lastName: response.data.data.lastName,
                email: response.data.data.email,
                phone: response.data.data.phone,
                password: "",
                role: response.data.data.role.roleName,
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

const deleteCourier = (emp) => {
    employee.value = emp;
    showDeletePopup.value = true;
}
async function onConfDelete() {
    await CourierServices.deleteCourier(employee.value.empId)
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
</script>
<template>
    <v-container fill-height>
        <v-row align="center">
            <v-col class="d-flex justify-space-between"><v-card-title class="pl-0 text-h4 font-weight-bold">
                    Couriers List
                </v-card-title>
                <v-btn class="mt-3" variant="flat" color="deep-purple" @click="() => openCourierPopup()">Add Courier</v-btn>
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
                                        <th class="text-left">User</th>
                                        <th class="text-left">Email</th>
                                        <th class="text-left">Phone</th>
                                        <th class="text-left">Pickup</th>
                                        <th class="text-left">Drop</th>
                                        <th class="text-left">Fair($)</th>
                                        <th class="text-left">Status</th>
                                        <th class="text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            Satheesh Kumar
                                        </td>
                                        <td>
                                            satheesh@gmail.com
                                        </td>
                                        <td>
                                            +1827267234
                                        </td>
                                        <td>
                                            Block 1
                                        </td>
                                        <td>
                                            Block 12
                                        </td>
                                        <td>35</td>
                                        <td>Initiated</td>
                                        <td>
                                            <v-icon class="mr-3 mt-2" size="large" icon="mdi-pencil"></v-icon>
                                            <v-icon class="mt-2" size="large" icon="mdi-delete"></v-icon>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Vamshi Dhagad
                                        </td>
                                        <td>
                                            vamshi@gmail.com
                                        </td>
                                        <td>
                                            +9282882822
                                        </td>
                                        <td>
                                            Block 24
                                        </td>
                                        <td>
                                            Block 3
                                        </td>
                                        <td>78</td>
                                        <td>Delivered</td>
                                        <td>
                                            -
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row></v-card></v-col></v-row>
    </v-container>
    <CommonDeleteDialog :showDeletePopup="showDeletePopup" :onConfDelete="onConfDelete" :closeDeletePopup="closeDeletePopup"
        :textValue="`Are you sure want to delet from employees list.`" />
</template>