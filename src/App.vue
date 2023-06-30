<script setup>
import { onMounted, ref } from 'vue';


const user = ref(null);
const drawer = ref(true);
const rail = ref(false);
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});
</script>

<template>
  <v-app>
    <!-- <MenuBar :key="$route.fullPath" /> -->
    <v-main>
      <template v-if="!user">
        <router-view />
      </template>
      <template v-else>
        <v-card>
          <v-layout>
            <v-navigation-drawer class="bg-deep-purple" theme="dark" permanent v-model="drawer" :rail="rail"
              @click="rail = false">
              <template v-slot:prepend>
                <v-list-item title="John Leider" nav subtitle="Admin">
                  <template v-slot:prepend>
                    <v-avatar color="#7952C0">
                      <span class="white-text text-h5">AB</span>
                    </v-avatar>
                  </template>
                  <template v-slot:append>
                    <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
                  </template>
                </v-list-item>
              </template>

              <v-divider></v-divider>
              <v-list density="compact" nav>
                <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard"
                  :to="'/Dashboard'"></v-list-item>
                <v-list-item prepend-icon="mdi-account-multiple" title="Employees" value="employees"
                  :to="'/Employees'"></v-list-item>
                <v-list-item prepend-icon="mdi-truck-delivery" title="Couriers" value="couriers" :to="'/Couriers'"></v-list-item>
              </v-list>

              <template v-slot:append>
                <!-- <div class="pa-2">
                  <v-btn block>
                    Logout
                  </v-btn>
                </div> -->
                <v-list density="compact" nav>
                  <v-list-item color="#00000" prepend-icon="mdi-logout-variant" title="Logout"
                    value="logout"></v-list-item>
                </v-list>
              </template>
            </v-navigation-drawer>
            <v-main style="min-height: 100vh"><router-view /></v-main>
          </v-layout>
        </v-card>
      </template>
    </v-main>
  </v-app>
</template>
