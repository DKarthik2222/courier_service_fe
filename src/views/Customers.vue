<script setup>
import { onMounted, ref } from 'vue';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import AddUpdateCustomer from '../components/AddUpdateCustomer.vue';
import CustomerServices from "../services/CustomerServices.js";
import CommonDeleteDialog from '../components/CommonDeleteDialog.vue';

const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const router = useRouter();
const showCustomerPopup = ref(false);
const showDeletePopup = ref(false);
const totalCustomers = ref([])
const viewType = ref('add')
const customer = ref({
    phone: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
})
onMounted(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user != null && user.roleId == 1) {
        // getALlCustomers();
    } else if (user != null && (user.roleId != 1 || user.roleId != 2)) {
        router.push({ name: "dashboard" });
    }
});
const openCustomerPopup = (id = null, currViewType = "add") => {
    viewType.value = currViewType;
    showCustomerPopup.value = true;
    if (id) {
        // getCustomerById(id);
    }
}
const closeCustomerPopup = () => {
    showCustomerPopup.value = false;
    customer.value = {
        phone: "",
        firstName: "",
        lastName: "",
        email: "",
        address: "",
    }
}
async function getCustomerById(id) {
    await CustomerServices.getCustomerByCustomerId(id)
        .then((response) => {
            customer.value = {
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

async function getALlCustomers() {
    await CustomerServices.getCustomers()
        .then((response) => {
            totalCustomers.value = response.data.data;
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
async function updateCustomer() {
    let payload = {
        empId: customer.value.empId,
        firstName: customer.value.firstName,
        lastName: customer.value.lastName,
        email: customer.value.email,
        password: customer.value.password,
        phone: customer.value.phone,
        roleId: customer.value.role == "CLERK" ? 2 : 3,
    };
    if (viewType.value == "edit") {
        await CustomerServices.updateCustomer(customer.value.empId, payload)
            .then((response) => {
                if (response.data.status == "Success") {
                    getALlCustomers();
                    closeCustomerPopup();
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
    } else {
        await CustomerServices.addCustomer(payload)
            .then((response) => {
                if (response.data.status == "Success") {
                    getALlCustomers();
                    closeCustomerPopup();
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
}

const deleteCustomer = (emp) => {
    customer.value = emp;
    showDeletePopup.value = true;
}
async function onConfDelete() {
    await CustomerServices.deleteCustomer(customer.value.empId)
        .then((response) => {
            if (response.data.status == "Success") {
                getALlCustomers();
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
    customer.value = {
        phone: "",
        firstName: "",
        lastName: "",
        email: "",
        address: "",
    }
}
const onPhoneChange = () => {
    var cleaned = ('' + customer.value.phone).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        var intlCode = (match[1] ? '+1 ' : '');
        customer.value.phone = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
}
</script>
<template>
    <v-container fill-height>
        <v-row align="center">
            <v-col class="d-flex justify-space-between"><v-card-title class="pl-0 text-h4 font-weight-bold">
                    Customers List
                </v-card-title>
                <v-btn class="mt-3" variant="flat" color="deep-purple" @click="() => openCustomerPopup()">Add
                    Customer</v-btn>
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
                                        <th class="text-left">First Name</th>
                                        <th class="text-left">Last Name</th>
                                        <th class="text-left">Email</th>
                                        <th class="text-left">Phone</th>
                                        <th class="text-left">Address</th>
                                        <th class="text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="totalCustomers.length == 0">
                                        <td colspan="6" v-bind:style="{
                                            color: '#707070',
                                            'font-size': '14px',
                                            textAlign: 'center',
                                        }">
                                            No customers found...
                                        </td>
                                    </tr>
                                    <tr v-for="customer in totalCustomers" :key="customer.customerId">
                                        <td>
                                            {{ customer.firstName }}
                                        </td>
                                        <td>
                                            {{ customer.lastName }}
                                        </td>
                                        <td>
                                            {{ customer.email }}
                                        </td>
                                        <td>
                                            {{ customer?.phone }}
                                        </td>
                                        <td>
                                            {{ customer?.address }}
                                        </td>
                                        <td>
                                            <v-icon class="mr-3 mt-2" size="large" icon="mdi-pencil"
                                                @click="() => openCustomerPopup(customer.customerId, 'edit')"></v-icon>
                                            <v-icon class="mt-2" size="large" icon="mdi-delete"
                                                @click="() => deleteCustomer(customer)"></v-icon>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-col>
                    </v-row></v-card></v-col></v-row>
    </v-container>
    <AddUpdateCustomer :showCustomerPopup="showCustomerPopup" :customer="customer" :onPhoneChange="onPhoneChange"
        :closeCustomerPopup="closeCustomerPopup" :updateCustomer="updateCustomer" :viewType="viewType" />
    <CommonDeleteDialog :showDeletePopup="showDeletePopup" :onConfDelete="onConfDelete" :closeDeletePopup="closeDeletePopup"
        :textValue="`Are you sure want to delete ${customer.firstName} ${customer.lastName} from customers list.`" />
</template>