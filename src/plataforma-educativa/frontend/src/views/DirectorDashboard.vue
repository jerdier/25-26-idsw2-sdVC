<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { dispensaService } from '../services/dispensaService';
import { Dispensa } from '../types';

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
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

.dispensas-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.dispensas-table th, .dispensas-table td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.dispensas-table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.sesiones-mini {
  margin: 0;
  padding-left: 15px;
  font-size: 0.85em;
  color: #666;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.pendiente { background-color: #ffeaa7; color: #d6a316; }
.status-badge.aprobada { background-color: #55efc4; color: #00b894; }
.status-badge.rechazada { background-color: #ff7675; color: #d63031; }

.actions-btns {
  display: flex;
  gap: 8px;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.2s;
}

button:hover { opacity: 0.8; }

.btn-approve { background-color: #2ecc71; color: white; }
.btn-reject { background-color: #e74c3c; color: white; }

.alert {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.alert.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
.alert.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }

.empty-state, .loading {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>