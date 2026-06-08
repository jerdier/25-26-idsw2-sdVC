<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuth } from '../services/authService';
import academicService from '../services/academicService';
import attendanceService from '../services/attendanceService';
import dispensaService from '../services/dispensaService';
import type { Alumno, SesionDeClase } from '../types';

const { state } = useAuth();
const PROFESOR_ID = state.user?.id; 

const asignaturas = ref<any[]>([]);
const selectedAsignatura = ref<string | null>(null);
const sesiones = ref<SesionDeClase[]>([]);
const selectedSesion = ref<string | null>(null);
const alumnos = ref<Alumno[]>([]);
const asistenciaMap = ref<Record<string, boolean>>({});
const dispensasProfesor = ref<any[]>([]);

const loading = ref(false);
const mensaje = ref({ texto: '', tipo: '' });

onMounted(async () => {
  if (!PROFESOR_ID) return;
  loading.value = true;
  try {
    const [asig, disp] = await Promise.all([
      academicService.getTeacherAsignaturas(PROFESOR_ID),
      dispensaService.getDispensasByProfesor(PROFESOR_ID)
    ]);
    asignaturas.value = asig;
    dispensasProfesor.value = disp;
  } catch (error) {
    console.error('Error cargando datos iniciales:', error);
  } finally {
    loading.value = false;
  }
});

watch(selectedAsignatura, async (newVal) => {
  if (newVal) {
    loading.value = true;
    try {
      sesiones.value = await academicService.getSessions(newVal);
      alumnos.value = await academicService.getAsignaturaAlumnos(newVal);
      selectedSesion.value = null;
      asistenciaMap.value = {};
    } finally {
      loading.value = false;
    }
  }
});

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
    const newSession = await academicService.createSession(selectedAsignatura.value, fecha, 'Aula Virtual', 90);
    sesiones.value.unshift(newSession);
    selectedSesion.value = newSession.id;
    mensaje.value = { texto: 'Sesión creada correctamente', tipo: 'success' };
  } catch (error) {
    mensaje.value = { texto: 'Error al crear sesión', tipo: 'error' };
  }
};

const closeSession = async (sesionId: string) => {
  if (!confirm('¿Estás seguro de cerrar esta sesión?')) return;
  try {
    await academicService.closeSession(sesionId);
    const sesion = sesiones.value.find(s => s.id === sesionId);
    if (sesion) sesion.estado = 'CERRADA';
    mensaje.value = { texto: 'Sesión cerrada', tipo: 'success' };
  } catch (error) {
    mensaje.value = { texto: 'Error al cerrar sesión', tipo: 'error' };
  }
};

const toggleAsistencia = async (alumnoId: string) => {
  const currentSesion = sesiones.value.find(s => s.id === selectedSesion.value);
  if (currentSesion?.estado === 'CERRADA') return;
  
  if (!selectedSesion.value || !PROFESOR_ID) return;
  
  const nuevoEstado = !asistenciaMap.value[alumnoId];
  try {
    await attendanceService.recordAttendance({
      sesionId: selectedSesion.value,
      alumnoId,
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
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  });
};
</script>

<template>
  <div class="professor-dashboard">
    <div v-if="loading" class="loading-overlay">Sincronizando...</div>

    <aside class="sidebar">
      <div class="sidebar-header">
        <h3>Mis Asignaturas</h3>
      </div>
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

      <div class="dispensas-section">
        <h4>Dispensas Activas</h4>
        <div class="dispensas-list">
          <div v-for="d in dispensasProfesor" :key="d.id" class="dispensa-mini-card">
            <span class="dispensa-alumno">{{ d.alumno.nombre }}</span>
            <span class="dispensa-motivo">{{ d.motivo }}</span>
          </div>
          <p v-if="dispensasProfesor.length === 0" class="empty-msg-small">No hay dispensas activas</p>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <div v-if="selectedAsignatura" class="content-container">
        <header class="toolbar">
          <h2>{{ asignaturas.find(a => a.id === selectedAsignatura)?.nombre }}</h2>
          <div class="toolbar-actions">
            <button @click="createSession" class="btn-primary">Nueva Sesión</button>
          </div>
        </header>

        <section class="sesiones-nav">
          <div 
            v-for="sesion in sesiones" 
            :key="sesion.id"
            @click="selectedSesion = sesion.id"
            :class="['sesion-pill', { active: selectedSesion === sesion.id, closed: sesion.estado === 'CERRADA' }]"
          >
            {{ formatDate(sesion.fecha) }}
            <span v-if="sesion.estado === 'CERRADA'">🔒</span>
          </div>
        </section>

        <section v-if="selectedSesion" class="card-base attendance-card">
          <div class="panel-header flex-between">
            <h3>Control de Asistencia</h3>
            <button 
              v-if="sesiones.find(s => s.id === selectedSesion)?.estado === 'ACTIVA'"
              @click="closeSession(selectedSesion)"
              class="btn-outline btn-danger"
            >
              Cerrar Sesión
            </button>
          </div>
          
          <table class="table-corp">
            <thead>
              <tr>
                <th>Alumno</th>
                <th class="text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alumno in alumnos" :key="alumno.id">
                <td>
                  <div class="bold">{{ alumno.nombre }}</div>
                  <div class="code-sm inline-block mt-1">{{ alumno.numeroRegistro }}</div>
                </td>
                <td class="text-center">
                  <label class="switch" :class="{ disabled: sesiones.find(s => s.id === selectedSesion)?.estado === 'CERRADA' }">
                    <input 
                      type="checkbox" 
                      :checked="asistenciaMap[alumno.id]" 
                      @change="toggleAsistencia(alumno.id)"
                      :disabled="sesiones.find(s => s.id === selectedSesion)?.estado === 'CERRADA'"
                    >
                    <span class="slider"></span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <div v-else class="empty-state-card">
          <p>Seleccione una sesión para registrar la asistencia.</p>
        </div>
      </div>
      <div v-else class="empty-state-card full">
        <p>Seleccione una asignatura para comenzar.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.professor-dashboard { display: flex; height: calc(100vh - 64px); background-color: var(--bg-main); }

.sidebar {
  width: 350px;
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-header h3 { font-size: 0.75rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }

.asignatura-list { display: flex; flex-direction: column; gap: 0.5rem; }
.asig-item {
  padding: 1rem;
  border-radius: var(--radius-sm);
  background: var(--bg-main);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.asig-item:hover { border-color: var(--accent-primary); }
.asig-item.selected { border-color: var(--accent-primary); box-shadow: 0 0 0 2px var(--accent-surface); }
.asig-name { display: block; font-weight: 600; font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.25rem; }
.asig-grado { display: block; font-size: 0.75rem; color: var(--text-secondary); }

.dispensas-section h4 { font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); letter-spacing: 0.05em; margin-bottom: 1rem; }
.dispensa-mini-card { background: var(--warning-bg); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 0.5rem; border: 1px solid rgba(217, 119, 6, 0.2); border-left: 4px solid var(--warning); }
.dispensa-alumno { display: block; font-weight: 600; font-size: 0.85rem; color: var(--warning); margin-bottom: 0.25rem; }
.dispensa-motivo { display: block; font-size: 0.8rem; color: var(--text-secondary); }

.main-content { flex: 1; padding: 2rem; overflow-y: auto; }
.content-container { display: flex; flex-direction: column; gap: 2rem; max-width: 1000px; margin: 0 auto; }

.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.toolbar h2 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; }

.sesiones-nav { display: flex; gap: 0.75rem; overflow-x: auto; padding-bottom: 0.5rem; }
.sesion-pill {
  padding: 0.75rem 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}
.sesion-pill:hover { border-color: var(--border-hover); color: var(--text-primary); }
.sesion-pill.active { border-color: var(--accent-primary); color: var(--accent-primary); background: var(--accent-surface); }
.sesion-pill.closed { opacity: 0.6; }

.panel-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
.panel-header h3 { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
.flex-between { display: flex; justify-content: space-between; align-items: center; }

.text-center { text-align: center; }
.inline-block { display: inline-block; }
.mt-1 { margin-top: 0.25rem; }

.switch { position: relative; display: inline-block; width: 40px; height: 20px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--border); transition: .4s; border-radius: 20px; }
.slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: var(--shadow-sm); }
input:checked + .slider { background-color: var(--success); }
input:checked + .slider:before { transform: translateX(20px); }
.switch.disabled { opacity: 0.5; cursor: not-allowed; }

.btn-danger { color: var(--error); border-color: var(--error); }
.btn-danger:hover { background: var(--error-bg); }

.empty-state-card { height: 300px; display: flex; align-items: center; justify-content: center; background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-hover); color: var(--text-secondary); font-size: 0.95rem; }
.empty-state-card.full { height: calc(100vh - 4rem); max-height: 800px; }

.loading-overlay { position: fixed; top: 64px; left: 0; right: 0; padding: 0.5rem; text-align: center; color: var(--accent-primary); font-weight: 600; font-size: 0.85rem; background: var(--accent-surface); border-bottom: 1px solid var(--border); z-index: 100; }
.empty-msg-small { font-size: 0.85rem; color: var(--text-dim); font-style: italic; }
</style>
