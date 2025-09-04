<template>
  <q-dialog
    v-model="dialogValue"
    persistent
    transition-show="scale"
    transition-hide="scale"
    maximized-mobile
  >
    <q-card class="users-form-card" style="min-width: 450px; max-width: 500px">
      <!-- Header mejorado -->
      <q-card-section class="bg-primary text-white q-pa-lg">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h5 text-weight-bold">
              <q-icon :name="isEdit ? 'edit' : 'person_add'" class="q-mr-sm" size="md" />
              {{ isEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario' }}
            </div>
            <div class="text-subtitle2 text-blue-2 q-mt-xs">
              {{
                isEdit
                  ? 'Modifique los datos del usuario'
                  : 'Complete la información del nuevo usuario'
              }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn flat round dense icon="close" color="white" @click="closeDialog" size="md">
              <q-tooltip>Cerrar</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <!-- Contenido del formulario -->
      <q-card-section class="q-pa-lg">
        <q-form @submit.prevent="submit" class="q-gutter-md">
          <!-- Campo Username -->
          <div class="form-field">
            <q-input
              v-model="form.username"
              label="Nombre de Usuario"
              outlined
              :rules="usernameRules"
              autofocus
              clearable
              :loading="loading"
              class="full-width"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="primary" />
              </template>
              <template v-slot:hint> Ingrese un nombre de usuario único </template>
            </q-input>
          </div>

          <!-- Campo Password -->
          <div class="form-field">
            <q-input
              v-model="form.password"
              :label="isEdit ? 'Nueva Contraseña (Opcional)' : 'Contraseña'"
              :type="showPassword ? 'text' : 'password'"
              outlined
              :rules="passwordRules"
              clearable
              :loading="loading"
              class="full-width"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  dense
                  :icon="showPassword ? 'visibility_off' : 'visibility'"
                  @click="showPassword = !showPassword"
                  color="grey-6"
                  size="sm"
                >
                  <q-tooltip>{{ showPassword ? 'Ocultar' : 'Mostrar' }} contraseña</q-tooltip>
                </q-btn>
              </template>
              <template v-slot:hint>
                {{
                  isEdit
                    ? 'Dejar en blanco para mantener la contraseña actual'
                    : 'Mínimo 8 caracteres'
                }}
              </template>
            </q-input>
          </div>

          <!-- Campo Rol (opcional - puedes agregarlo si lo necesitas) -->
          <div class="form-field">
            <q-select
              v-model="form.role"
              :options="roleOptions"
              label="Rol del Usuario"
              outlined
              emit-value
              map-options
              clearable
              class="full-width"
            >
              <template v-slot:prepend>
                <q-icon name="admin_panel_settings" color="primary" />
              </template>
              <template v-slot:hint> Seleccione el rol para el usuario </template>
            </q-select>
          </div>

          <!-- Información adicional para edición -->
          <div v-if="isEdit" class="q-mt-md">
            <q-banner class="bg-blue-1 text-primary" rounded>
              <template v-slot:avatar>
                <q-icon name="info" color="primary" />
              </template>
              <div class="text-body2">
                <strong>Usuario:</strong> {{ originalUsername }}<br />
                <strong>Última modificación:</strong> {{ formatDate(new Date()) }}
              </div>
            </q-banner>
          </div>
        </q-form>
      </q-card-section>

      <!-- Acciones mejoradas -->
      <q-card-actions class="q-pa-lg bg-grey-1">
        <div class="full-width row q-col-gutter-sm">
          <div class="col-12 col-sm-6">
            <q-btn
              flat
              label="Cancelar"
              color="grey-7"
              @click="closeDialog"
              class="full-width"
              size="md"
              icon="close"
              :disable="loading"
            />
          </div>
          <div class="col-12 col-sm-6">
            <q-btn
              unelevated
              :label="isEdit ? 'Actualizar Usuario' : 'Crear Usuario'"
              :color="isEdit ? 'secondary' : 'primary'"
              @click="submit"
              :loading="loading"
              :disable="!isFormValid"
              class="full-width text-weight-bold"
              size="md"
              :icon="isEdit ? 'save' : 'person_add'"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                {{ isEdit ? 'Actualizando...' : 'Creando...' }}
              </template>
            </q-btn>
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useUsers } from 'src/composables/useUsers';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const props = defineProps<{ modelValue: boolean; userId?: string | number | null }>();
const emit = defineEmits(['update:modelValue', 'refresh']);

const dialogValue = ref(props.modelValue);
const isEdit = ref(false);
const showPassword = ref(false);
const originalUsername = ref('');
const { createUser, updateUser, getUserById, form } = useUsers();
const loading = ref(false);

// Opciones de roles
const roleOptions = [
  { label: 'Usuario', value: 'USER', icon: 'person' },
  { label: 'Supervisor', value: 'SUPERVISOR', icon: 'supervisor_account' },
];

// Reglas de validación
const usernameRules = [
  (val: string) => !!val || 'El nombre de usuario es requerido',
  (val: string) => val.length >= 3 || 'Mínimo 3 caracteres',
  (val: string) => /^[a-zA-Z0-9_]+$/.test(val) || 'Solo letras, números y guiones bajos',
];

const passwordRules = computed(() => {
  if (isEdit.value) {
    // En edición: campo opcional, pero si se especifica debe tener mínimo 8 caracteres
    return [(val: string) => !val || val.length >= 8 || 'Mínimo 8 caracteres'];
  }
  // Creación: requerido y mínimo 8 caracteres
  return [(val: string) => (val && val.length >= 8) || 'Mínimo 8 caracteres'];
});

// Validación del formulario
const isFormValid = computed(() => {
  if (!form.value.username || form.value.username.length < 3) return false;
  if (!isEdit.value && (!form.value.password || form.value.password.length < 8)) return false;
  return true;
});

// Función para formatear fecha
const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

watch(dialogValue, (val) => {
  emit('update:modelValue', val);
});

watch(
  () => props.modelValue,
  async (val) => {
    dialogValue.value = val;
    if (val) {
      if (props.userId) {
        isEdit.value = true;
        try {
          const user = await getUserById(props.userId);
          form.value.username = user.username;
          form.value.password = '';
          form.value.role = user.role || 'user';
          form.value.userId = user.id || user._id;
          originalUsername.value = user.username;
        } catch (error) {
          console.error('Error al cargar el usuario:', error);
          $q.notify({
            type: 'negative',
            message: 'Error al cargar los datos del usuario',
            position: 'top',
          });
        }
      } else {
        isEdit.value = false;
        form.value.username = '';
        form.value.password = '';
        form.value.role = 'USER';
        form.value.userId = undefined;
        originalUsername.value = '';
      }
      showPassword.value = false;
    }
  },
  { immediate: true },
);

const closeDialog = () => {
  dialogValue.value = false;
  emit('update:modelValue', false);
};

const submit = async () => {
  if (!isFormValid.value) {
    $q.notify({
      type: 'warning',
      message: 'Por favor complete todos los campos requeridos',
      position: 'top',
    });
    return;
  }

  loading.value = true;

  try {
    if (isEdit.value) {
      const params: any = {
        username: form.value.username,
        role: form.value.role,
      };
      if (form.value.password) {
        params.password = form.value.password;
      }
      await updateUser(params, form.value.userId);

      $q.notify({
        type: 'positive',
        message: 'Usuario actualizado correctamente',
        position: 'top',
        icon: 'check_circle',
      });
    } else {
      await createUser({
        username: form.value.username,
        password: form.value.password,
        role: form.value.role || 'user',
      });

      $q.notify({
        type: 'positive',
        message: 'Usuario creado correctamente',
        position: 'top',
        icon: 'person_add',
      });
    }

    closeDialog();
    emit('refresh');
  } catch (error) {
    console.log(error);
    $q.notify({
      type: 'negative',
      message: `Error al ${isEdit.value ? 'actualizar' : 'crear'} el usuario`,
      position: 'top',
      icon: 'error',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.users-form-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-field {
  margin-bottom: 8px;
}

/* Animaciones suaves */
.q-dialog__inner {
  padding: 16px;
}

.q-card {
  transition: all 0.3s ease;
}

.q-btn {
  transition: all 0.2s ease;
}

.q-btn:hover {
  transform: translateY(-1px);
}

/* Mejoras para dispositivos móviles */
@media (max-width: 768px) {
  .users-form-card {
    margin: 0;
    border-radius: 0;
    min-height: 100vh;
  }

  .q-btn:hover {
    transform: none;
  }
}

/* Estilos para campos de formulario */
.q-field--outlined .q-field__control {
  border-radius: 8px;
}

.q-field--outlined .q-field__control:hover {
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

/* Banner de información */
.q-banner {
  border-left: 4px solid var(--q-primary);
}
</style>
