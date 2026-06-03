<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import academicService from '../services/academicService';
import attendanceService from '../services/attendanceService';
import type { Alumno, SesionDeClase } from '../types';

// Mock del ID del profesor (esto vendría del login/auth en el futuro)
const PROFESOR_ID = 'mock-profesor-id'; 

const asignaturas = ref<any[]>([]);
const selectedAsignatura = ref<string | null>(null);
const sesiones = ref<SesionDeClase[]>([]);
const selectedSesion = ref<string | null>(null);
const alumnos = ref<Alumno[]>([]);
const asistenciaMap = ref<Record<string, boolean>>({});

const loading = ref(false);
const mensaje = ref({ texto: '', tipo: '' });

onMounted(async () => {
  loading.value = true;
  try {
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
      asistenciaMap.value = {};
      records.forEach((r: any) => {
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
    mensaje.value = { texto: 'Sesión creada para hoy', tipo: 'success' };
  } catch (error) {
    mensaje.value = { texto: 'Error al crear sesión', tipo: 'error' };
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
    mensaje.value = { texto: 'Error al guardar asistencia', tipo: 'error' };
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="professor-dashboard">
    <header class="header">
      <div class="header-info">
        <h1>Panel Docente</h1>
        <p class="role-tag">PROFESORADO</p>
      </div>
    </header>

    <div v-if="loading" class="loading">Sincronizando con el servidor...</div>

    <main class="grid-layout">
      <!-- Selector de Asignatura -->
      <section class="card selector-card">
        <h3>Mis Asignaturas</h3>
        <div class="asignatura-list">
          <div 
            v-for="asig in asignaturas" 
            :key="asig.id" 
            :class="['asig-item', { selected: selectedAsignatura === asig.id }]"
            @click="selectedAsignatura = asig.id"
          >
            <span class="asig-name">{{ asig.nombre }}</span>
            <span class="asig-grado">{{ asig.grado?.nombre }}</span>
          </div>
        </div>
      </section>

      <div v-if="selectedAsignatura" class="main-content">
        <!-- Listado de Sesiones -->
        <section class="card sesiones-card">
          <div class="card-header">
            <h3>Sesiones de Clase</h3>
            <button @click="createSession" class="btn-new">Nueva Sesión</button>
          </div>
          
          <div class="sesiones-scroll">
            <div 
              v-for="sesion in sesiones" 
              :key="sesion.id"
              @click="selectedSesion = sesion.id"
              :class="['sesion-pill', { active: selectedSesion === sesion.id }]"
            >
              {{ formatDate(sesion.fecha) }}
            </div>
            <p v-if="sesiones.length === 0" class="empty-msg">No hay sesiones registradas</p>
          </div>
        </section>

        <!-- Registro de Asistencia -->
        <section v-if="selectedSesion" class="card attendance-card">
          <div class="card-header">
            <h3>Control de Asistencia</h3>
            <div v-if="mensaje.texto" :class="['mini-alert', mensaje.tipo]">{{ mensaje.texto }}</div>
          </div>
          
          <table class="attendance-table">
            <thead>
              <tr>
                <th>Alumno</th>
                <th class="text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alumno in alumnos" :key="alumno.id">
                <td>
                  <div class="alumno-name">{{ alumno.nombre }}</div>
                  <div class="alumno-id">{{ alumno.numeroRegistro }}</div>
                </td>
                <td class="text-center">
                  <label class="switch">
                    <input 
                      type="checkbox" 
                      :checked="asistenciaMap[alumno.id]" 
                      @change="toggleAsistencia(alumno.id)"
                    >
                    <span class="slider"></span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section v-else class="empty-state-card">
          <p>Seleccione una sesión para registrar la asistencia de los alumnos.</p>
        </section>
      </div>
      <div v-else class="empty-state-card full">
        <p>Seleccione una asignatura del panel izquierdo para comenzar.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.professor-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', system-ui, sans-serif;
}

.header {
  margin-bottom: 30px;
  border-bottom: 2px solid #f1f2f6;
  padding-bottom: 15px;
}

.header h1 { font-size: 1.5rem; margin: 0; color: #2f3542; }
.role-tag { 
  display: inline-block; 
  background: #747d8c; 
  color: white; 
  padding: 2px 8px; 
  border-radius: 4px; 
  font-size: 0.7rem; 
  font-weight: bold;
}

.grid-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 25px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border: 1px solid #f1f2f6;
}

.card h3 { margin-top: 0; font-size: 1.1rem; color: #57606f; }

.asignatura-list { display: flex; flex-direction: column; gap: 10px; }
.asig-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.asig-item:hover { background: #f1f2f6; }
.asig-item.selected { 
  background: #1e90ff; 
  color: white; 
  border-color: #1e90ff;
  box-shadow: 0 4px 10px rgba(30, 144, 255, 0.3);
}
.asig-name { display: block; font-weight: bold; }
.asig-grado { font-size: 0.8rem; opacity: 0.8; }

.main-content { display: flex; flex-direction: column; gap: 25px; }

.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }

.btn-new {
  background: #2ed573;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.sesiones-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}
.sesion-pill {
  padding: 8px 15px;
  background: #f1f2f6;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
  border: 2px solid transparent;
}
.sesion-pill.active {
  background: #e1f5fe;
  color: #0288d1;
  border-color: #0288d1;
}

.attendance-table { width: 100%; border-collapse: collapse; }
.attendance-table th { text-align: left; border-bottom: 2px solid #eee; padding: 10px; }
.attendance-table td { padding: 12px 10px; border-bottom: 1px solid #f1f2f6; }

.alumno-name { font-weight: 600; color: #2f3542; }
.alumno-id { font-size: 0.75rem; color: #a4b0be; }

/* Switch Toggle CSS */
.switch { position: relative; display: inline-block; width: 46px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc; transition: .4s; border-radius: 24px;
}
.slider:before {
  position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
  background-color: white; transition: .4s; border-radius: 50%;
}
input:checked + .slider { background-color: #2ed573; }
input:checked + .slider:before { transform: translateX(22px); }

.empty-state-card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 2px dashed #eee;
  border-radius: 12px;
  color: #a4b0be;
  padding: 40px;
  text-align: center;
}

.mini-alert { font-size: 0.8rem; padding: 4px 10px; border-radius: 4px; }
.mini-alert.success { background: #e3fcef; color: #00875a; }
.mini-alert.error { background: #ffebe6; color: #bf2600; }

.loading { text-align: center; color: #1e90ff; font-weight: bold; margin-bottom: 20px; }
</style>
