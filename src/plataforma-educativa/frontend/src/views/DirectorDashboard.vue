<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '../services/authService';
import { dispensaService } from '../services/dispensaService';

const { state } = useAuth();
const DIRECTOR_ID = state.directorId;

const solicitudes = ref<any[]>([]);
const loading = ref(true);
const mensaje = ref({ texto: '', tipo: '' });

const cargarSolicitudes = async () => {
  loading.value = true;
  try {
    const res = await dispensaService.getAllDispensas();
    solicitudes.value = res.filter((s: any) => s.estado === 'PENDIENTE');
  } finally {
    loading.value = false;
  }
};

onMounted(cargarSolicitudes);

const resolverSolicitud = async (id: string, nuevoEstado: 'APROBADA' | 'RECHAZADA') => {
  if (!DIRECTOR_ID) return;
  try {
    await dispensaService.updateStatus(id, {
      estado: nuevoEstado,
      directorId: DIRECTOR_ID
    });
    mensaje.value = { texto: `Resolución registrada: ${nuevoEstado}`, tipo: 'success' };
    await cargarSolicitudes();
  } catch (error) {
    mensaje.value = { texto: 'Error al procesar la resolución', tipo: 'error' };
  } finally {
    setTimeout(() => mensaje.value.texto = '', 3000);
  }
};

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('es-ES');
</script>

<template>
  <div class="container-wide">
    <header class="page-header">
      <div class="header-info">
        <h1>Gestión de Grado</h1>
        <p class="dim">Dictamen de solicitudes de dispensa académica.</p>
      </div>
    </header>

    <div v-if="mensaje.texto" :class="['toast-alert', mensaje.tipo]">{{ mensaje.texto }}</div>

    <main class="card-base">
      <div class="panel-header">
        <h3>Solicitudes Pendientes de Resolución</h3>
      </div>

      <div v-if="loading" class="empty-msg">Sincronizando expedientes...</div>
      <div v-else-if="solicitudes.length === 0" class="empty-msg">No hay trámites pendientes en este momento.</div>

      <table v-else class="table-corp">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Estudiante</th>
            <th>Justificación</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in solicitudes" :key="s.id">
            <td class="dim">{{ formatDate(s.fechaSolicitud) }}</td>
            <td>
              <span class="bold">{{ s.alumno.nombre }}</span>
              <code class="code-sm ml-2">{{ s.alumno.numeroRegistro }}</code>
            </td>
            <td class="motivo-cell">{{ s.motivo }}</td>
            <td class="text-right">
              <div class="btn-group">
                <button @click="resolverSolicitud(s.id, 'APROBADA')" class="btn-outline btn-approve">Aprobar</button>
                <button @click="resolverSolicitud(s.id, 'RECHAZADA')" class="btn-outline btn-reject">Rechazar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 2.5rem; }
.header-info h1 { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text-primary); }

.panel-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
.panel-header h3 { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }

.text-right { text-align: right; }
.ml-2 { margin-left: 0.5rem; }
.motivo-cell { color: var(--text-secondary); font-size: 0.9rem; max-width: 400px; }

.btn-group { display: flex; gap: 0.5rem; justify-content: flex-end; }
.btn-approve { color: var(--success); border-color: rgba(5, 150, 105, 0.3); padding: 0.5rem 1rem; font-size: 0.75rem; }
.btn-approve:hover { background: var(--success-bg); border-color: var(--success); }
.btn-reject { color: var(--error); border-color: rgba(220, 38, 38, 0.3); padding: 0.5rem 1rem; font-size: 0.75rem; }
.btn-reject:hover { background: var(--error-bg); border-color: var(--error); }

.empty-msg { padding: 4rem; text-align: center; color: var(--text-secondary); font-size: 0.95rem; }

.toast-alert { position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 500; box-shadow: var(--shadow-md); z-index: 3000; }
.toast-alert.success { border-left: 4px solid var(--success); }
.toast-alert.error { border-left: 4px solid var(--error); }
</style>
