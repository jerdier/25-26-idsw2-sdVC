<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import academicService from '../services/academicService';
import attendanceService from '../services/attendanceService';

// Mock del ID del profesor (esto vendría del login/auth en el futuro)
const PROFESOR_ID = 'mock-profesor-id'; 

const asignaturas = ref<any[]>([]);
const selectedAsignatura = ref<string | null>(null);
const sesiones = ref<any[]>([]);
const selectedSesion = ref<string | null>(null);
const alumnos = ref<any[]>([]);
const asistenciaMap = ref<Record<string, boolean>>({});

const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    // En una app real, PROFESOR_ID vendría de un store de Auth
    asignaturas.value = await academicService.getTeacherAsignaturas(PROFESOR_ID);
  } catch (error) {
    console.error('Error cargando asignaturas:', error);
  } finally {
    loading.value = false;
  }
});

// Al cambiar la asignatura, cargamos sus sesiones y alumnos
watch(selectedAsignatura, async (newVal) => {
  if (newVal) {
    loading.value = true;
    try {
      sesiones.value = await academicService.getSessions(newVal);
      alumnos.value = await academicService.getAsignaturaAlumnos(newVal);
      selectedSesion.value = null;
      asistenciaMap.value = {};
    } catch (error) {
      console.error('Error cargando datos de asignatura:', error);
    } finally {
      loading.value = false;
    }
  }
});

// Al cambiar la sesión, cargamos la asistencia ya registrada
watch(selectedSesion, async (newVal) => {
  if (newVal) {
    try {
      const records = await attendanceService.getAttendanceBySession(newVal);
      // Inicializamos el mapa con los registros existentes
      asistenciaMap.value = {};
      records.forEach(r => {
        asistenciaMap.value[r.alumno.id] = r.presente;
      });
    } catch (error) {
      console.error('Error cargando asistencia:', error);
    }
  }
});

const createSession = async () => {
  if (!selectedAsignatura.value) return;
  try {
    const fecha = new Date().toISOString();
    const newSession = await academicService.createSession(selectedAsignatura.value, fecha);
    sesiones.value.unshift(newSession);
    selectedSesion.value = newSession.id;
  } catch (error) {
    alert('Error al crear sesión');
  }
};

const toggleAsistencia = async (alumnoId: string) => {
  if (!selectedSesion.value) return;
  
  const nuevoEstado = !asistenciaMap.value[alumnoId];
  try {
    await attendanceService.recordAttendance({
      sesionId: selectedSesion.value,
      alumnoId: alumnoId,
      profesorId: PROFESOR_ID,
      presente: nuevoEstado
    });
    asistenciaMap.value[alumnoId] = nuevoEstado;
  } catch (error) {
    alert('Error al guardar asistencia');
  }
};
</script>

<template>
  <div class="dashboard p-6">
    <h1 class="text-2xl font-bold mb-6">Panel del Profesor</h1>

    <div v-if="loading" class="text-blue-600">Cargando datos...</div>

    <section class="mb-8">
      <label class="block mb-2 font-semibold">Seleccionar Asignatura:</label>
      <select v-model="selectedAsignatura" class="border p-2 rounded w-full max-w-md">
        <option :value="null" disabled>Elija una asignatura</option>
        <option v-for="asig in asignaturas" :key="asig.id" :value="asig.id">
          {{ asig.nombre }} ({{ asig.grado?.nombre }})
        </option>
      </select>
    </section>

    <div v-if="selectedAsignatura" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Gestión de Sesiones -->
      <section class="border p-4 rounded bg-gray-50">
        <h2 class="text-xl font-semibold mb-4">Sesiones de Clase</h2>
        <button 
          @click="createSession" 
          class="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700"
        >
          Nueva Sesión Hoy
        </button>
        
        <ul class="space-y-2">
          <li 
            v-for="sesion in sesiones" 
            :key="sesion.id"
            @click="selectedSesion = sesion.id"
            :class="['p-2 border rounded cursor-pointer', selectedSesion === sesion.id ? 'bg-blue-100 border-blue-500' : 'bg-white']"
          >
            {{ new Date(sesion.fecha).toLocaleString() }}
          </li>
        </ul>
      </section>

      <!-- Toma de Asistencia -->
      <section v-if="selectedSesion" class="border p-4 rounded bg-white shadow">
        <h2 class="text-xl font-semibold mb-4">Registro de Asistencia</h2>
        <table class="w-full text-left">
          <thead>
            <tr class="border-b">
              <th class="py-2">Alumno</th>
              <th class="py-2 text-center">Presente</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alumno in alumnos" :key="alumno.id" class="border-b hover:bg-gray-50">
              <td class="py-2">
                <div class="font-medium">{{ alumno.nombre }}</div>
                <div class="text-xs text-gray-500">{{ alumno.numeroRegistro }}</div>
              </td>
              <td class="py-2 text-center">
                <input 
                  type="checkbox" 
                  :checked="asistenciaMap[alumno.id]" 
                  @change="toggleAsistencia(alumno.id)"
                  class="w-5 h-5 cursor-pointer"
                >
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section v-else class="flex items-center justify-center border p-4 rounded bg-gray-100 text-gray-500">
        Seleccione una sesión para pasar lista
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
