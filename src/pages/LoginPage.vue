<template>
  <div class="row window-height">
    <!-- Left Panel - Branding -->
    <div class="branding-panel col-12 col-md-5" :class="$q.screen.gt.sm ? 'd-flex' : 'hidden'">
      <div class="brand-content">
        <div class="brand-text">
          <h1 class="brand-title">Sistema Perforaciones</h1>
          <p class="brand-subtitle">Gestión integral de operaciones de perforacion</p>
        </div>

        <div class="brand-features">
          <div class="feature-item">
            <q-icon name="inventory" class="feature-icon" />
            <span>Control de Proyectos</span>
          </div>
          <div class="feature-item">
            <q-icon name="precision_manufacturing" class="feature-icon" />
            <span>Gestión de Perforaciones</span>
          </div>
          <div class="feature-item">
            <q-icon name="analytics" class="feature-icon" />
            <span>Reportes y Análisis</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="form-panel col-12 col-md-7">
      <q-card class="login-card" flat>
        <q-card-section class="form-header">
          <div class="logo-section">
            <q-img
              src="/logo-torcar.png"
              alt="Torcar Logo"
              class="brand-logo"
              @error="logoError = true"
            />
            <div v-if="logoError" class="logo-fallback">
              <q-icon name="local_gas_station" class="fallback-icon" />
            </div>
          </div>
          <p class="form-subtitle">Accede al panel de administración</p>
        </q-card-section>

        <q-card-section class="form-content">
          <q-form @submit.prevent="handleLogin" class="login-form">
            <div class="input-group">
              <q-input
                v-model="formLogin.username"
                label="Nombre de usuario"
                type="text"
                :rules="[(val: string) => !!val || 'El nombre de usuario es requerido']"
                outlined
                class="custom-input"
                hide-bottom-space
              >
                <template v-slot:prepend>
                  <q-icon name="person" class="input-icon" />
                </template>
              </q-input>
            </div>

            <div class="input-group">
              <q-input
                v-model="formLogin.password"
                :label="'Contraseña'"
                :type="isPwd ? 'password' : 'text'"
                :rules="[(val: string) => !!val || 'La contraseña es requerida']"
                outlined
                class="custom-input"
                hide-bottom-space
              >
                <template v-slot:prepend>
                  <q-icon name="lock" class="input-icon" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer toggle-icon"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>

            <div class="button-container">
              <q-btn
                type="submit"
                class="login-btn"
                :loading="loading"
                :disable="!formLogin.username || !formLogin.password"
                no-caps
                unelevated
                size="lg"
              >
                <template v-slot:loading>
                  <q-spinner-dots class="on-left" />
                  Verificando...
                </template>
                <template v-slot:default>
                  <q-icon name="login" class="on-left" />
                  Iniciar Sesión
                </template>
              </q-btn>
            </div>

            <transition name="error-fade">
              <q-banner v-if="error" class="error-banner" rounded>
                <template v-slot:avatar>
                  <q-icon name="error" color="white" />
                </template>
                {{ error }}
              </q-banner>
            </transition>
          </q-form>
        </q-card-section>

        <q-card-section class="form-footer">
          <div class="security-info">
            <q-icon name="security" class="security-icon" />
            <span class="security-text">Conexión segura SSL</span>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from 'src/composables/useAuth';

const { login, isAuthenticated } = useAuth();

interface LoginForm {
  username: string;
  password: string;
}

const formLogin = ref<LoginForm>({
  username: '',
  password: '',
});

const isPwd = ref<boolean>(true);
const loading = ref<boolean>(false);
const error = ref<string>('');
const logoError = ref<boolean>(false);

const checkAuthentication = () => {
  if (isAuthenticated.value) {
    console.log('User is already authenticated');
  }
};

onMounted(() => {
  checkAuthentication();
});

const handleLogin = async (): Promise<void> => {
  loading.value = true;
  error.value = '';

  try {
    await login(formLogin.value.username, formLogin.value.password);
  } catch (err: any) {
    error.value = err.message || 'Error al iniciar sesión';
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: white;
}

.branding-panel {
  background: $primary;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.brand-content {
  text-align: center;
  color: white;
  z-index: 1;
  position: relative;
  padding: 2rem;
}

.logo-section {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.brand-logo {
  width: 250px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.logo-fallback {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.fallback-icon {
  font-size: 4rem;
  color: white;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 1.2rem;
  margin: 0 0 3rem 0;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-start;
  max-width: 300px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 50%;
  backdrop-filter: blur(10px);
}

// Right Form Panel
.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  padding: 2rem 2rem 1rem 2rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: $dark;
  margin: 0 0 0.5rem 0;
}

.form-subtitle {
  font-size: 1rem;
  color: lighten($dark, 20%);
  margin: 0;
}

.form-content {
  padding: 1rem 2rem 2rem 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  position: relative;
}

.custom-input {
  :deep(.q-field__control) {
    border-radius: 12px;
    height: 56px;
    background: white;
    border: 2px solid #e5e7eb;
    transition: all 0.3s ease;
  }

  :deep(.q-field__outlined) {
    border: none;
  }

  :deep(.q-field--focused .q-field__control) {
    border-color: $secondary;
    box-shadow: 0 0 0 3px rgba($secondary, 0.1);
  }

  :deep(.q-field__label) {
    color: lighten($dark, 20%);
    font-weight: 500;
  }
}

.input-icon {
  color: $secondary;
  font-size: 1.25rem;
}

.toggle-icon {
  color: lighten($dark, 30%);
  transition: all 0.3s ease;
  font-size: 1.25rem;

  &:hover {
    color: $secondary;
  }
}

.button-container {
  margin-top: 1rem;
}

.login-btn {
  width: 100%;
  height: 56px;
  border-radius: 12px;
  background: $primary;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba($secondary, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba($secondary, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    background: #9ca3af;
    box-shadow: none;
  }
}

.error-banner {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.form-footer {
  padding: 1rem 2rem 2rem 2rem;
  text-align: center;
}

.security-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: lighten($dark, 30%);
  font-size: 0.875rem;
}

.security-icon {
  color: $secondary;
  font-size: 1rem;
}

// Responsive Design
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
    height: auto;
    width: 100vw;
    min-height: 100vh;
  }

  .branding-panel {
    flex: none;
    min-height: 40vh;
  }

  .brand-features {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .feature-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
  }

  .login-container {
    max-width: 100%;
    width: 100vw;
    margin: 0;
  }

  .form-panel {
    padding: 1rem;
  }

  .brand-title {
    font-size: 2rem;
  }

  .brand-subtitle {
    font-size: 1rem;
  }

  .form-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .form-content {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .branding-panel {
    min-height: 30vh;
  }

  .brand-content {
    padding: 1rem;
  }

  .brand-logo,
  .logo-fallback {
    width: 80px;
    height: 80px;
  }

  .fallback-icon {
    font-size: 2.5rem;
  }

  .brand-title {
    font-size: 1.5rem;
  }

  .brand-features {
    gap: 0.5rem;
  }

  .feature-item {
    font-size: 0.75rem;
  }
}
</style>
