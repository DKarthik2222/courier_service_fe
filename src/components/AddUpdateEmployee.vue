<script setup>
import { ref } from 'vue';

const roles = ref(['CLERK', 'DELIVERY AGENT']);
const props = defineProps({
    showEmployeePopup: false,
    viewType: 'add',
    employee: null,
    updateEmployee: Function,
    closeEmployeePopup: Function,
});
</script>
<template>
    <v-dialog persistent v-model:modelValue="props.showEmployeePopup" @update:modelValue="props.showEmployeePopup = $event"
        width="1080">
        <v-card class="rounded-lg elevation-5 mb-8">
            <v-card-title class="headline">
                {{ props.viewType == 'add' ? 'Add' : 'Update' }} Employee
            </v-card-title>
            <v-card-text class="body-1">
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.employee.firstName"
                            @update:modelValue="props.employee.firstName = $event" label="First Name"
                            required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.employee.lastName"
                            @update:modelValue="props.employee.lastName = $event" label="Last Name" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.employee.email"
                            @update:modelValue="props.employee.email = $event" label="Email" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.employee.phone"
                            @update:modelValue="props.employee.phone = $event" label="Phone" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-select v-model:modelValue="props.employee.role" @update:modelValue="props.employee.role = $event"
                            :items="roles" density="comfortable" label="Role"></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model:modelValue="props.employee.password"
                            @update:modelValue="props.employee.password = $event" label="Password" required
                            type="password"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-row>
                    <v-col class="d-flex justify-end">
                        <div>
                            <v-btn class="mr-3" variant="flat" color="secondary"
                                @click="props.closeEmployeePopup">Cancel</v-btn>
                            <v-btn v-if="props.viewType == 'add'" variant="flat" color="primary"
                                @click="props.updateEmployee()" :disabled="!props.employee?.firstName ||
                                    !props.employee?.lastName ||
                                    !props.employee?.email ||
                                    !props.employee?.phone ||
                                    !props.employee?.role ||
                                    !props.employee?.password
                                    ">Enroll Employee</v-btn>
                            <v-btn v-else variant="flat" color="primary" @click="props.updateEmployee()" :disabled="!props.employee?.firstName ||
                                !props.employee?.lastName ||
                                !props.employee?.email ||
                                !props.employee?.phone ||
                                !props.employee?.role
                                ">Update Employee</v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>