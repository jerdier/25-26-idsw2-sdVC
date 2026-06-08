<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '../services/authService';
import { academicService } from '../services/academicService';
import { dispensaService } from '../services/dispensaService';
import type { SesionDeClase, CreateDispensaDTO } from '../types';

const { state } = useAuth();
const ALUMNO_ID = state.user?.id;
const SECRETARIA_ID = 'test-secretaria-id';

const sesiones = ref<SesionDeClase[]>([]);
const motivo = ref('');
const sesionesSeleccionadas = ref<string[]>([]);
const enviando = ref(false);
const mensaje = ref({ texto: '', tipo: '' });
const misDispensas = ref<any[]>([]);
const editandoId = ref<string | null>(null);

const cargarDispensas = async () => {
  if (!ALUMNO_ID) return;
  try {
    misDispensas.value = await dispensaService.getDispensasByAlumno(ALUMNO_ID);
  } catch (error) {
    console.error('Error al cargar mis dispensas:', error);
  }
};

onMounted(async () => {
  if (!ALUMNO_ID) return;
  try {
    sesiones.value = await academicService.getSessionsForAlumno(ALUMNO_ID); 
    await cargarDispensas();
  } catch (error) {
    console.error('Error al cargar sesiones:', error);
  }
});

const enviarSolicitud = async () => {
  if (!ALUMNO_ID) return;
  if (sesionesSeleccionadas.value.length === 0 || !motivo.value) {
    mensaje.value = { texto: 'Por favor, selecciona sesiones y escribe un motivo.', tipo: 'error' };
    return;
  }

  enviando.value = true;
  try {
    if (editandoId.value) {
      await dispensaService.updateDispensa(editandoId.value, {
        motivo: motivo.value,
        sesionesIds: sesionesSeleccionadas.value
      });
      mensaje.value = { texto: 'Solicitud actualizada correctamente.', tipo: 'success' };
      editandoId.value = null;
    } else {
      const nuevaDispensa: CreateDispensaDTO = {
        alumnoId: ALUMNO_ID,
        secretariaId: SECRETARIA_ID,
        motivo: motivo.value,
        sesionesIds: sesionesSeleccionadas.value
      };
      await dispensaService.createDispensa(nuevaDispensa);
      mensaje.value = { texto: 'Solicitud enviada correctamente.', tipo: 'success' };
    }
    
    motivo.value = '';
    sesionesSeleccionadas.value = [];
    await cargarDispensas();
  } catch (error) {
    mensaje.value = { texto: 'Error al procesar la solicitud.', tipo: 'error' };
  } finally {
    enviando.value = false;
    setTimeout(() => mensaje.value.texto = '', 3000);
  }
};

const prepararEdicion = (dispensa: any) => {
  if (dispensa.estado !== 'PENDIENTE') return;
  editandoId.value = dispensa.id;
  motivo.value = dispensa.motivo;
  sesionesSeleccionadas.value = dispensa.sesionesEximidas.map((s: any) => s.id);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelarEdicion = () => {
  editandoId.value = null;
  motivo.value = '';
  sesionesSeleccionadas.value = [];
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};
</script>

<template>
  <div class="container-wide">
    <header class="page-header">
      <div class="header-info">
        <h1>Panel de {{ state.user?.nombre }}</h1>
        <p class="dim">Autogestión de solicitudes de dispensa académica.</p>
      </div>
    </header>

    <div v-if="mensaje.texto" :class="['toast-alert', mensaje.tipo]">{{ mensaje.texto }}</div>

    <div class="dashboard-grid">
      <!-- Columna Izquierda: Formulario -->
      <aside>
        <section class="card-base form-panel">
          <div class="panel-header">
            <h3>{{ editandoId ? 'Editar Solicitud' : 'Nueva Dispensa' }}</h3>
          </div>
          <form @submit.prevent="enviarSolicitud" class="form-layout">
            <div>
              <label class="form-label">Sesiones Disponibles</label>
              <div class="sessions-list-check">
                <div v-for="sesion in sesiones" :key="sesion.id" class="session-row">
                  <input type="checkbox" :id="sesion.id" :value="sesion.id" v-model="sesionesSeleccionadas" class="custom-checkbox">
                  <label :for="sesion.id" class="ml-2">
                    <strong>{{ sesion.asignatura?.nombre }}</strong> - {{ formatDate(sesion.fecha) }}
                  </label>
                </div>
                <div v-if="sesiones.length === 0" class="empty-list">No hay sesiones activas.</div>
              </div>
            </div>

            <div>
              <label class="form-label">Justificación Oficial</label>
              <textarea v-model="motivo" class="form-input" placeholder="Describa el motivo de la falta..." rows="4"></textarea>
            </div>

            <div class="form-actions mt-2">
              <button type="submit" :disabled="enviando" class="btn-primary w-full">
                {{ enviando ? 'PROCESANDO...' : (editandoId ? 'GUARDAR CAMBIOS' : 'ENVIAR SOLICITUD') }}
              </button>
              <button v-if="editandoId" type="button" @click="cancelarEdicion" class="btn-outline w-full mt-2">CANCELAR EDICIÓN</button>
            </div>
          </form>
        </section>
      </aside>

      <!-- Columna Derecha: Historial -->
      <main class="lists-panel">
        <section class="card-base">
          <div class="panel-header">
            <h3>Historial Académico</h3>
          </div>

          <div v-if="misDispensas.length === 0" class="empty-state">No se han registrado trámites.</div>
          <table v-else class="table-corp">
            <thead>
              <tr>
                <th>Solicitado</th>
                <th>Estado</th>
                <th>Concepto</th>
                <th class="text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in misDispensas" :key="d.id">
                <td class="dim">{{ formatDate(d.fechaSolicitud) }}</td>
                <td><span :class="['status-badge', d.estado.toLowerCase()]">{{ d.estado }}</span></td>
                <td class="truncate" :title="d.motivo">{{ d.motivo }}</td>
                <td class="text-right">
                  <button v-if="d.estado === 'PENDIENTE'" @click="prepararEdicion(d)" class="btn-icon">Editar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 2.5rem; }
.header-info h1 { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text-primary); }

.dashboard-grid { display: grid; grid-template-columns: 380px 1fr; gap: 2rem; align-items: start; }
.lists-panel { display: flex; flex-direction: column; gap: 2rem; }

.panel-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
.panel-header h3 { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }

.form-layout { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
.w-full { width: 100%; }
.mt-2 { margin-top: 0.5rem; }

.sessions-list-check { max-height: 250px; overflow-y: auto; background: var(--bg-main); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1rem; }
.session-row { display: flex; align-items: center; margin-bottom: 0.5rem; font-size: 0.85rem; }
.custom-checkbox { width: 1rem; height: 1rem; cursor: pointer; }
.empty-list { font-size: 0.85rem; color: var(--text-secondary); text-align: center; padding: 1rem; }

.text-right { text-align: right; }
.ml-2 { margin-left: 0.5rem; }
.btn-icon { background: none; border: none; font-size: 0.8rem; font-weight: 600; color: var(--accent-primary); cursor: pointer; }
.btn-icon:hover { color: var(--accent-hover); text-decoration: underline; }

.status-badge.pendiente { background: var(--warning-bg); color: var(--warning); border: 1px solid rgba(217, 119, 6, 0.2); }
.status-badge.aprobada { background: var(--success-bg); color: var(--success); border: 1px solid rgba(5, 150, 105, 0.2); }
.status-badge.rechazada { background: var(--error-bg); color: var(--error); border: 1px solid rgba(220, 38, 38, 0.2); }

.truncate { max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: middle; }
.empty-state { text-align: center; padding: 3rem; color: var(--text-secondary); font-size: 0.9rem; }

.toast-alert { position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 500; box-shadow: var(--shadow-md); z-index: 3000; }
.toast-alert.success { border-left: 4px solid var(--success); }
.toast-alert.error { border-left: 4px solid var(--error); }

@media (max-width: 1024px) { .dashboard-grid { grid-template-columns: 1fr; } }
</style>
