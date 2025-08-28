<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="q-mr-sm"
        />

        <q-toolbar-title class="text-weight-bold"> Sistema Perforaciones </q-toolbar-title>

        <q-space />

        <!-- Usuario info -->
        <q-btn flat dense round @click="profileMenu = true" class="q-mr-sm">
          <q-avatar size="32px" color="white" text-color="primary" icon="account_circle" />
        </q-btn>
        <div class="text-body2 gt-xs q-mr-md">
          {{ user?.username || 'Usuario' }}
        </div>
        <q-menu v-model="profileMenu" anchor="bottom right" self="top right">
          <q-list style="min-width: 180px">
            <q-item clickable v-close-popup @click="openProfileDialog()">
              <q-item-section avatar><q-icon name="person" /></q-item-section>
              <q-item-section>Editar perfil</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="logout">
              <q-item-section avatar><q-icon name="logout" /></q-item-section>
              <q-item-section>Cerrar sesión</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="280" class="bg-grey-1">
      <!-- Header del drawer -->
      <div class="bg-primary text-white q-pa-md">
        <div class="text-h6 text-weight-bold">
          <q-icon name="dashboard" class="q-mr-sm" />
          Menú Principal
        </div>
      </div>

      <!-- Separador -->
      <q-separator />

      <!-- Lista de opciones mejorada -->
      <q-list class="q-pt-md">
        <q-item
          v-for="item in filteredMenuOptions"
          :key="item.path"
          clickable
          v-ripple
          :active="$route.path.startsWith(item.path)"
          active-class="bg-primary text-white"
          @click="navigateTo(item.path)"
          class="menu-item q-ma-xs rounded-borders"
        >
          <q-item-section avatar>
            <q-icon
              :name="item.icon"
              :color="$route.path.startsWith(item.path) ? 'white' : 'primary'"
              size="md"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-medium">
              {{ item.label }}
            </q-item-label>
            <q-item-label
              caption
              :class="$route.path.startsWith(item.path) ? 'text-grey-3' : 'text-grey-6'"
            >
              {{ item.description }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon
              name="chevron_right"
              :color="$route.path.startsWith(item.path) ? 'white' : 'grey-5'"
              size="sm"
            />
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Separador -->
      <q-separator class="q-my-md" />

      <!-- Footer del drawer -->
      <!-- <div class="absolute-bottom q-pa-md">
        <q-btn
          flat
          dense
          icon="help_outline"
          label="Ayuda"
          color="grey-7"
          class="full-width"
          size="sm"
        />
      </div> -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <!-- Dialogo para editar perfil -->
  <q-dialog v-model="showProfileDialog">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Editar perfil</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="profileForm.name" label="Nombre" outlined dense autofocus />
        <q-input
          v-model="profileForm.password"
          label="Nueva contraseña"
          type="password"
          outlined
          dense
          class="q-mt-md"
        />
        <div class="text-caption text-grey-7 q-mt-xs">
          Deja la contraseña vacía si no deseas cambiarla.
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup :disable="profileFormLoading" />
        <q-btn color="primary" label="Guardar" :loading="profileFormLoading" @click="saveProfile" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from 'src/composables/useAuth';

const router = useRouter();
const { user, logout, updateProfile } = useAuth();

const leftDrawerOpen = ref(false);
const profileMenu = ref(false);
const showProfileDialog = ref(false);

const menuOptions = [
  {
    label: 'Usuarios',
    path: '/users',
    icon: 'people',
    description: 'Gestión de usuarios del sistema',
    roles: ['ADMIN'], // Solo estos roles pueden ver
  },
  {
    label: 'Proyectos',
    path: '/projects',
    icon: 'work',
    description: 'Administrar proyectos de perforación',
    roles: ['ADMIN', 'SUPERVISOR', 'USER'], // Todos pueden ver
  },
];

const filteredMenuOptions = computed(() =>
  menuOptions.filter((item) => item.roles.includes(user.value?.role ?? '')),
);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const navigateTo = async (path: string) => {
  await router.push(path);
  if (window.innerWidth < 1024) {
    leftDrawerOpen.value = false;
  }
};

// Perfil dialog state
const profileForm = reactive({
  name: '',
  password: '',
});
const profileFormLoading = ref(false);

function openProfileDialog() {
  profileForm.name = user.value?.username || '';
  profileForm.password = '';
  showProfileDialog.value = true;
}

async function saveProfile() {
  profileFormLoading.value = true;
  try {
    const payload: { username: string; password?: string } = { username: profileForm.name };
    if (profileForm.password) payload.password = profileForm.password;
    await updateProfile(payload);
    showProfileDialog.value = false;
  } finally {
    profileFormLoading.value = false;
  }
}
</script>

<style scoped>
.menu-item {
  transition: all 0.3s ease;
  margin: 4px 8px;
}

.menu-item:hover {
  background-color: rgba(25, 118, 210, 0.1) !important;
  transform: translateX(4px);
}

.menu-item.q-item--active {
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

.opacity-70 {
  opacity: 0.7;
}

/* Animación suave para el drawer */
.q-drawer {
  transition: all 0.3s ease;
}

/* Mejora para dispositivos móviles */
@media (max-width: 1023px) {
  .menu-item:hover {
    transform: none;
  }
}
</style>
