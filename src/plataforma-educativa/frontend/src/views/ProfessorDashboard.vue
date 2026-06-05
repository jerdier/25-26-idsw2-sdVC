<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuth } from '../services/authService';
import academicService from '../services/academicService';
import attendanceService from '../services/attendanceService';
import type { Alumno, SesionDeClase } from '../types';

const { state } = useAuth();
const PROFESOR_ID = state.user?.id; 

const asignaturas = ref<any[]>([]);
const selectedAsignatura = ref<string | null>(null);
const sesiones = ref<SesionDeClase[]>([]);
const selectedSesion = ref<string | null>(null);
const alumnos = ref<Alumno[]>([]);
const asistenciaMap = ref<Record<string, boolean>>({});

const loading = ref(false);
const mensaje = ref({ texto: '', tipo: '' });

onMounted(async () => {
  if (!PROFESOR_ID) return;
  loading.value = true;
  try {
    // CARGA REAL: Solo las asignaturas del profesor logueado
    asignaturas.value = await academicService.getTeacherAsignaturas(PROFESOR_ID);
  } catch (error) {
    console.error('Error cargando asignaturas personalizadas:', error);
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
  if (!selectedSesion.value || !PROFESOR_ID) return;
  
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
        <h1>Panel de {{ state.user?.nombre }}</h1>
        <p class="role-tag">DOCENTE</p>
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
          <p v-if="asignaturas.length === 0" class="empty-msg">No tiene asignaturas asignadas.</p>
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
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Inter', -apple-system, sans-serif;
  color: #1e293b;
}

.header {
  background: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a2a6c;
  letter-spacing: -0.5px;
}

.role-tag {
  display: inline-block;
  background: #f1f5f9;
  color: #475569;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

.grid-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.card h3 {
  margin: 0 0 1.25rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #475569;
}

.asignatura-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.asig-item {
  padding: 1rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.asig-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.asig-item.selected {
  background: #1a2a6c;
  color: white;
  border-color: #1a2a6c;
  box-shadow: 0 10px 15px -3px rgba(26, 42, 108, 0.2);
}

.asig-name {
  display: block;
  font-weight: 700;
  font-size: 1rem;
}

.asig-grado {
  display: block;
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 2px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.btn-new {
  background: #1a2a6c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-new:hover {
  background: #243b55;
  transform: translateY(-1px);
}

.sesiones-scroll {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.sesion-pill {
  padding: 10px 20px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.sesion-pill:hover {
  background: #e2e8f0;
}

.sesion-pill.active {
  background: #f0fdf4;
  color: #166534;
  border-color: #bbf7d0;
}

.attendance-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.attendance-table th {
  text-align: left;
  padding: 1rem;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}

.attendance-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.alumno-name {
  font-weight: 700;
  color: #1e293b;
}

.alumno-id {
  font-size: 0.75rem;
  color: #64748b;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #e2e8f0;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

input:checked + .slider { background-color: #1a2a6c; }
input:checked + .slider:before { transform: translateX(24px); }

.empty-state-card {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 20px;
  color: #94a3b8;
  font-weight: 500;
}

.empty-state-card.full { height: 600px; }

.mini-alert {
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 600;
}

.mini-alert.success { background: #f0fdf4; color: #166534; }
.mini-alert.error { background: #fef2f2; color: #991b1b; }

.loading {
  text-align: center;
  color: #1a2a6c;
  font-weight: 700;
  margin-bottom: 1rem;
}
</style>
