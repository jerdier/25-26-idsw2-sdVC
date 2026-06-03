<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { secretariaService } from '../services/secretariaService';
import { Alumno, Profesor, SecretariaStats } from '../types';

const stats = ref<SecretariaStats>({
  alumnos: 0,
  profesores: 0,
  grados: 0,
  dispensasPendientes: 0
});

const alumnos = ref<Alumno[]>([]);
const profesores = ref<Profesor[]>([]);
const activeTab = ref('overview');
const loading = ref(true);

const nuevoAlumno = ref({ nombre: '', email: '', numeroRegistro: '' });
const mensaje = ref({ texto: '', tipo: '' });

const cargarDatos = async () => {
  loading.value = true;
  try {
    const [s, a, p] = await Promise.all([
      secretariaService.getStats(),
      secretariaService.getAlumnos(),
      secretariaService.getProfesores()
    ]);
    stats.value = s;
    alumnos.value = a;
    profesores.value = p;
  } catch (error) {
    console.error('Error cargando datos de secretaría:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(cargarDatos);

const registrarAlumno = async () => {
  try {
    await secretariaService.createAlumno(nuevoAlumno.value);
    mensaje.value = { texto: 'Alumno registrado con éxito', tipo: 'success' };
    nuevoAlumno.value = { nombre: '', email: '', numeroRegistro: '' };
    await cargarDatos();
  } catch (error) {
    mensaje.value = { texto: 'Error al registrar alumno', tipo: 'error' };
  }
};
</script>

<template>
  <div class="secretaria-dashboard">
    <header class="header">
      <h1>Panel de Secretaría Académica</h1>
      <p>Gestión centralizada de alumnos, profesores y matrículas</p>
    </header>

    <nav class="tabs">
      <button @click="activeTab = 'overview'" :class="{ active: activeTab === 'overview' }">Vista General</button>
      <button @click="activeTab = 'alumnos'" :class="{ active: activeTab === 'alumnos' }">Alumnos</button>
      <button @click="activeTab = 'profesores'" :class="{ active: activeTab === 'profesores' }">Profesores</button>
    </nav>

    <main class="content">
      <!-- VISTA GENERAL -->
      <section v-if="activeTab === 'overview'" class="stats-grid">
        <div class="stat-card">
          <h3>Alumnos</h3>
          <p class="value">{{ stats.alumnos }}</p>
        </div>
        <div class="stat-card">
          <h3>Profesores</h3>
          <p class="value">{{ stats.profesores }}</p>
        </div>
        <div class="stat-card">
          <h3>Grados</h3>
          <p class="value">{{ stats.grados }}</p>
        </div>
        <div class="stat-card warning">
          <h3>Dispensas Pendientes</h3>
          <p class="value">{{ stats.dispensasPendientes }}</p>
        </div>
      </section>

      <!-- GESTIÓN DE ALUMNOS -->
      <section v-if="activeTab === 'alumnos'" class="management-section">
        <div class="card form-card">
          <h2>Registrar Nuevo Alumno</h2>
          <form @submit.prevent="registrarAlumno" class="form">
            <input v-model="nuevoAlumno.nombre" placeholder="Nombre completo" required />
            <input v-model="nuevoAlumno.email" type="email" placeholder="Correo electrónico" required />
            <input v-model="nuevoAlumno.numeroRegistro" placeholder="Número de Registro (Ej: ALU001)" required />
            <button type="submit" class="btn-primary">Registrar Alumno</button>
          </form>
          <div v-if="mensaje.texto" :class="['alert', mensaje.tipo]">{{ mensaje.texto }}</div>
        </div>

        <div class="card list-card">
          <h2>Listado de Alumnos</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th>Registro</th>
                <th>Nombre</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alumno in alumnos" :key="alumno.id">
                <td>{{ alumno.numeroRegistro }}</td>
                <td>{{ alumno.nombre }}</td>
                <td>{{ alumno.email }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- GESTIÓN DE PROFESORES -->
      <section v-if="activeTab === 'profesores'" class="management-section">
        <div class="card list-card">
          <h2>Listado de Profesores</h2>
          <table class="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="profesor in profesores" :key="profesor.id">
                <td>{{ profesor.nombre }}</td>
                <td>{{ profesor.email }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.secretaria-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  border-radius: 4px;
}

.tabs button.active {
  background: #2c3e50;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card.warning {
  border-top: 4px solid #f39c12;
}

.value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 10px 0 0;
}

.management-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-primary {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.alert {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
}

.alert.success { background: #d4edda; color: #155724; }
.alert.error { background: #f8d7da; color: #721c24; }
</style>
