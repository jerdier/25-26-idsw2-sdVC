<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '../services/authService';
import { academicService } from '../services/academicService';
import { dispensaService } from '../services/dispensaService';
import type { SesionDeClase, CreateDispensaDTO } from '../types';

const { state } = useAuth();
const ALUMNO_ID = state.user?.id;
const SECRETARIA_ID = 'mock-secretaria-id'; // En un sistema real se buscaría dinámicamente

const sesiones = ref<SesionDeClase[]>([]);
const motivo = ref('');
const sesionesSeleccionadas = ref<string[]>([]);
const enviando = ref(false);
const mensaje = ref({ texto: '', tipo: '' });
const misDispensas = ref<any[]>([]);

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
    // CARGA REAL: Solo sesiones de las asignaturas del alumno logueado
    sesiones.value = await academicService.getSessionsForAlumno(ALUMNO_ID); 
    await cargarDispensas();
  } catch (error) {
    console.error('Error al cargar sesiones personalizadas:', error);
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
    const nuevaDispensa: CreateDispensaDTO = {
      alumnoId: ALUMNO_ID,
      secretariaId: SECRETARIA_ID,
      motivo: motivo.value,
      sesionesIds: sesionesSeleccionadas.value
    };

    await dispensaService.createDispensa(nuevaDispensa);
    
    mensaje.value = { texto: 'Solicitud enviada correctamente.', tipo: 'success' };
    motivo.value = '';
    sesionesSeleccionadas.value = [];
    await cargarDispensas();
  } catch (error) {
    mensaje.value = { texto: 'Error al enviar la solicitud.', tipo: 'error' };
  } finally {
    enviando.value = false;
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="student-dashboard">
    <header class="header">
      <h1>Panel de {{ state.user?.nombre }}</h1>
      <p class="role-badge">ALUMNO MATRICULADO</p>
    </header>

    <main class="content">
      <section class="card">
        <h2>Solicitar Nueva Dispensa</h2>
        <p class="description">Selecciona las sesiones de tus asignaturas a las que no pudiste asistir.</p>

        <form @submit.prevent="enviarSolicitud" class="dispensa-form">
          <div class="form-group">
            <label>1. Sesiones disponibles de tus asignaturas:</label>
            <div class="sesiones-list">
              <div v-for="sesion in sesiones" :key="sesion.id" class="sesion-item">
                <input 
                  type="checkbox" 
                  :id="sesion.id" 
                  :value="sesion.id" 
                  v-model="sesionesSeleccionadas"
                >
                <label :for="sesion.id">
                  <span class="subject-tag">{{ sesion.asignatura?.nombre }}</span>
                  <span class="session-date">{{ formatDate(sesion.fecha) }}</span>
                </label>
              </div>
              <p v-if="sesiones.length === 0" class="empty-state">No tienes sesiones de clase registradas aún.</p>
            </div>
          </div>

          <div class="form-group">
            <label for="motivo">2. Justificación / Motivo:</label>
            <textarea 
              id="motivo" 
              v-model="motivo" 
              placeholder="Describa el motivo de la falta..."
              rows="4"
            ></textarea>
          </div>

          <div v-if="mensaje.texto" :class="['alert', mensaje.tipo]">
            {{ mensaje.texto }}
          </div>

          <button type="submit" :disabled="enviando" class="btn-primary">
            {{ enviando ? 'Procesando...' : 'Enviar Solicitud Oficial' }}
          </button>
        </form>
      </section>

      <section class="card history-card">
        <h2>Historial de Solicitudes</h2>
        <div v-if="misDispensas.length === 0" class="empty-state">
          No has solicitado ninguna dispensa aún.
        </div>
        <table v-else class="history-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in misDispensas" :key="d.id">
              <td>{{ formatDate(d.fechaSolicitud) }}</td>
              <td>
                <span :class="['status-badge', d.estado.toLowerCase()]">
                  {{ d.estado }}
                </span>
              </td>
              <td class="motivo-cell">{{ d.motivo }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<style scoped>
.student-dashboard {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a2a6c;
  letter-spacing: -0.5px;
}

.role-badge {
  display: inline-block;
  background: #f0fdf4;
  color: #166534;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

.content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.card h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.description {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.sesiones-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.sesion-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.sesion-item:hover { background: white; }
.sesion-item:last-child { border-bottom: none; }

.subject-tag {
  background: #e1f5fe;
  color: #0288d1;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.session-date {
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-family: inherit;
  font-size: 1rem;
  background: #f8fafc;
  transition: all 0.2s;
  resize: vertical;
}

textarea:focus {
  background: white;
  border-color: #1a2a6c;
  outline: none;
  box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1);
}

.btn-primary {
  width: 100%;
  background: #1a2a6c;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #243b55;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
}

.alert {
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.alert.success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
.alert.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

.history-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.history-table th {
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

.history-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.pendiente { background: #fef9c3; color: #713f12; }
.status-badge.aprobada { background: #dcfce7; color: #166534; }
.status-badge.rechazada { background: #fee2e2; color: #991b1b; }

.motivo-cell {
  color: #64748b;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 3rem;
  font-weight: 500;
}
</style>
