<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { dispensaService } from '../services/dispensaService';
import type { Dispensa } from '../types';

const MOCK_DIRECTOR_ID = 'mock-director-id';

const dispensas = ref<Dispensa[]>([]);
const cargando = ref(true);
const mensaje = ref({ texto: '', tipo: '' });

const cargarDispensas = async () => {
  cargando.value = true;
  try {
    dispensas.value = await dispensaService.getAllDispensas();
  } catch (error) {
    console.error('Error al cargar dispensas:', error);
    mensaje.value = { texto: 'Error al cargar las solicitudes.', tipo: 'error' };
  } finally {
    cargando.value = false;
  }
};

onMounted(cargarDispensas);

const actualizarEstado = async (id: string, nuevoEstado: 'APROBADA' | 'RECHAZADA') => {
  try {
    await dispensaService.updateDispensaStatus(id, nuevoEstado, MOCK_DIRECTOR_ID);
    mensaje.value = { texto: `Solicitud ${nuevoEstado.toLowerCase()} correctamente.`, tipo: 'success' };
    await cargarDispensas(); // Recargar lista
  } catch (error) {
    mensaje.value = { texto: 'Error al actualizar la solicitud.', tipo: 'error' };
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
</script>

<template>
  <div class="director-dashboard">
    <header class="header">
      <h1>Panel del Director de Grado</h1>
      <p>Revisión y aprobación de dispensas académicas</p>
    </header>

    <main class="content">
      <div v-if="mensaje.texto" :class="['alert', mensaje.tipo]">
        {{ mensaje.texto }}
      </div>

      <section class="card">
        <h2>Solicitudes Pendientes</h2>
        
        <div v-if="cargando" class="loading">Cargando solicitudes...</div>
        
        <div v-else-if="dispensas.length === 0" class="empty-state">
          No hay solicitudes de dispensa registradas.
        </div>

        <table v-else class="dispensas-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Alumno</th>
              <th>Motivo</th>
              <th>Sesiones</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dispensa in dispensas" :key="dispensa.id">
              <td>{{ formatDate(dispensa.fechaSolicitud) }}</td>
              <td>{{ dispensa.alumno?.nombre }}</td>
              <td>{{ dispensa.motivo }}</td>
              <td>
                <ul class="sesiones-mini">
                  <li v-for="s in dispensa.sesionesEximidas" :key="s.id">
                    {{ s.asignatura?.nombre }} ({{ formatDate(s.fecha) }})
                  </li>
                </ul>
              </td>
              <td>
                <span :class="['status-badge', dispensa.estado.toLowerCase()]">
                  {{ dispensa.estado }}
                </span>
              </td>
              <td>
                <div v-if="dispensa.estado === 'PENDIENTE'" class="actions-btns">
                  <button @click="actualizarEstado(dispensa.id, 'APROBADA')" class="btn-approve">Aprobar</button>
                  <button @click="actualizarEstado(dispensa.id, 'RECHAZADA')" class="btn-reject">Rechazar</button>
                </div>
                <span v-else>-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<style scoped>
.director-dashboard {
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

.header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.card h2 {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.dispensas-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.dispensas-table th {
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

.dispensas-table td {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
}

.alumno-info .name {
  display: block;
  font-weight: 700;
  color: #1e293b;
}

.sesiones-mini {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sesiones-mini li {
  font-size: 0.8rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
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

.actions-btns {
  display: flex;
  gap: 8px;
}

.btn-approve {
  background: #166534;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reject {
  background: #991b1b;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-approve:hover, .btn-reject:hover {
  opacity: 0.9;
  transform: translateY(-1px);
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

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 4rem;
  font-weight: 500;
}

.loading {
  text-align: center;
  color: #1a2a6c;
  padding: 4rem;
  font-weight: 700;
}
</style>