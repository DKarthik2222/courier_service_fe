<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import VueSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import RouteMapView from './RouteMapView.vue';
import { useGlobalStore } from '../stores/globalStore';
import { storeToRefs } from 'pinia';
import FairCalculatorService from '../services/FairCalculatorService';

const routeDirections = ref([]);
const panel = ref([0]);
const globalStore = useGlobalStore();
const { snackBar } = storeToRefs(globalStore);
const router = useRouter();

const availableBlocks = ref({
    pickup: [],
    drop: [],
});
const courierDetails = ref({
    pickupAvenue: null,
    dropAvenue: null,
    pickupStreet: null,
    dropStreet: null,
    pickupBlock: null,
    dropBlock: null,
    deliveryCost: null,
    customerDetails: null,
});

async function updateCourier() {
    let payload = {
        empId: employee.value.empId,
        firstName: employee.value.firstName,
        lastName: employee.value.lastName,
        email: employee.value.email,
        password: employee.value.password,
        phone: employee.value.phone,
        roleId: employee.value.role == "CLERK" ? 2 : 3,
    };
    if (viewType.value == "edit") {
        await CourierServices.updateCourier(employee.value.empId, payload)
            .then((response) => {
                if (response.data.status == "Success") {
                    getALlCouriers();
                    closeCourierPopup();
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
        await CourierServices.addCourier(payload)
            .then((response) => {
                if (response.data.status == "Success") {
                    getALlCouriers();
                    closeCourierPopup();
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

const onCancel = () => {
    router.push({ name: "couriers" });
}

const onSaveUpdate = () => {
    // updateCourier();
}

const getAvailableBlocks = (point, pointType) => {
    let filteredBlocks = [];
    FairCalculatorService.BLOCKS.map(item => {
        if (item.leftRoutes.includes(point) || item.rightRoutes.includes(point) || item.topRoutes.includes(point) || item.bottomRoutes.includes(point)) {
            filteredBlocks.push(item.label);
        }
    })
    pointType == 'pick' ? availableBlocks.value.pickup = filteredBlocks : availableBlocks.value.drop = filteredBlocks;
}

const onLocationChange = (changeType) => {
    if (changeType == 'pickAvenue' || changeType == 'pickStreet') {
        courierDetails.value.pickupBlock = null;
        availableBlocks.value.pickup = [];
    }
    else if (changeType == 'dropAvenue' || changeType == 'dropStreet') {
        courierDetails.value.dropBlock = null;
        availableBlocks.value.drop = [];
    }
    let pickupPoint = null;
    let dropPoint = null;
    if (courierDetails.value.pickupAvenue?.avenueKey && courierDetails.value.pickupStreet?.streetKey) {
        pickupPoint = courierDetails.value.pickupAvenue?.avenueKey + courierDetails.value.pickupStreet?.streetKey;
        getAvailableBlocks(pickupPoint, 'pick');
    }
    if (courierDetails.value.dropAvenue?.avenueKey && courierDetails.value.dropStreet?.streetKey) {
        dropPoint = courierDetails.value.dropAvenue?.avenueKey + courierDetails.value.dropStreet?.streetKey;
        getAvailableBlocks(dropPoint, 'drop');
    }
    if (pickupPoint && dropPoint && courierDetails.value.pickupBlock && courierDetails.value.dropBlock) {
        let shortestRoute = FairCalculatorService.findShortRoute(pickupPoint, dropPoint);
        console.log(shortestRoute);
        if (pickupPoint == dropPoint) {
            snackBar.value = {
                value: true,
                color: "error",
                text: "Pickup and Drop points must be different...",
            }
        } else if (shortestRoute?.length <= 1) {
            snackBar.value = {
                value: true,
                color: "error",
                text: "No route found for selected points. Please choose different pickup/drop points.",
            }
        } else {
            routeDirections.value = shortestRoute;
        }
    } else if (routeDirections.value.length != 0) {
        routeDirections.value = [];
    }
}

</script>
<template>
    <v-container fill-height>
        <v-row align="center">
            <v-col class="d-flex justify-space-between"><v-card-title class="pl-0 text-h4 font-weight-bold">
                    Add Courier
                </v-card-title>
                <v-btn class="mt-3" variant="outlined" color="secondary" @click="$router.go(-1)">Back</v-btn>
            </v-col>
        </v-row>
        <v-row align="center">
            <v-col>
                <v-card class="rounded-lg elevation-5" :style="{
                    'max-height': '85vh',
                    'overflow': 'auto',
                    'overflow-x': 'hidden'
                }">
                    <v-card-text>
                        <v-expansion-panels v-model="panel">
                            <v-expansion-panel>
                                <v-expansion-panel-title mandatory>
                                    <template v-slot:default="{ expanded }">
                                        <v-row no-gutters>
                                            <v-col class="d-flex justify-start"><b v-bind:style="{
                                                'font-size': '24px',
                                            }">Customer Details</b></v-col>
                                            <v-col cols="8" class="text--secondary"> </v-col>
                                        </v-row>
                                    </template>
                                </v-expansion-panel-title>

                                <v-expansion-panel-text class="pl-15 pr-15">

                                </v-expansion-panel-text>
                            </v-expansion-panel>
                            <v-expansion-panel>
                                <v-expansion-panel-title mandatory>
                                    <template v-slot:default="{ expanded }">
                                        <v-row no-gutters>
                                            <v-col class="d-flex justify-start"><b v-bind:style="{
                                                'font-size': '24px',
                                            }">Delivery Details</b></v-col>
                                            <v-col cols="8" class="text--secondary"> </v-col>
                                        </v-row>
                                    </template>
                                </v-expansion-panel-title>

                                <v-expansion-panel-text class="pl-15 pr-15">
                                    <v-row>
                                        <v-col cols="12">
                                            <h3>Pickup Location</h3>
                                        </v-col>
                                        <v-col cols="12" sm="4">
                                            <VueSelect v-model="courierDetails.pickupAvenue"
                                                @update:modelValue="() => onLocationChange('pickAvenue')"
                                                :options="FairCalculatorService.TOTAL_AVENUES" label="avenueName"
                                                value="avenueKey" placeholder="Select Avenue*">
                                            </VueSelect>
                                        </v-col>
                                        <v-col cols="12" sm="4">
                                            <VueSelect v-model:modelValue="courierDetails.pickupStreet"
                                                @update:modelValue="() => onLocationChange('pickStreet')"
                                                :options="FairCalculatorService.TOTAL_STREETS" label="streetName"
                                                value="streetKey" placeholder="Select Street*">
                                            </VueSelect>
                                        </v-col>
                                        <v-col cols="12" sm="4">
                                            <VueSelect v-model:modelValue="courierDetails.pickupBlock"
                                                @update:modelValue="onLocationChange" :options="availableBlocks.pickup"
                                                label="blockName" value="streetKey" placeholder="Select Block*">
                                            </VueSelect>
                                        </v-col><v-col cols="12">
                                            <h3>Drop Location</h3>
                                        </v-col>
                                        <v-col cols="12" sm="4">
                                            <VueSelect v-model:modelValue="courierDetails.dropAvenue"
                                                @update:modelValue="() => onLocationChange('dropAvenue')"
                                                :options="FairCalculatorService.TOTAL_AVENUES" label="avenueName"
                                                value="avenueKey" placeholder="Select Avenue*">
                                            </VueSelect>
                                        </v-col>
                                        <v-col cols="12" sm="4">
                                            <VueSelect v-model:modelValue="courierDetails.dropStreet"
                                                @update:modelValue="() => onLocationChange('dropStreet')"
                                                :options="FairCalculatorService.TOTAL_STREETS" label="streetName"
                                                value="streetKey" placeholder="Select Street*">
                                            </VueSelect>
                                        </v-col>
                                        <v-col cols="12" sm="4">
                                            <VueSelect v-model:modelValue="courierDetails.dropBlock"
                                                @update:modelValue="onLocationChange" :options="availableBlocks.drop"
                                                label="blockName" value="streetKey" placeholder="Select Block*">
                                            </VueSelect>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <h3>Route Map</h3>
                                        </v-col>
                                        <v-col cols="12">
                                            <RouteMapView :routeDirections="routeDirections"
                                                :courierDetails="courierDetails" />
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-card-text>
                    <v-card-actions>
                        <v-row>
                            <v-col class="d-flex justify-end">
                                <div>
                                    <v-btn class="mr-3" variant="flat" color="secondary" @click="onCancel">Cancel</v-btn>
                                    <v-btn v-if="viewType == 'add'" variant="flat" color="primary" @click="onSaveUpdate">Add
                                        Courier</v-btn>
                                    <v-btn v-else variant="flat" color="primary" @click="onSaveUpdate">Update
                                        Courier</v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-actions>
                </v-card>
            </v-col></v-row>
    </v-container>
</template>