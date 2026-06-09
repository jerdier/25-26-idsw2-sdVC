<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { secretariaService } from '../services/secretariaService';
import { dispensaService } from '../services/dispensaService';
import { useAuth } from '../services/authService';
import type { Alumno, SecretariaStats } from '../types';

const { state } = useAuth();
const stats = ref<SecretariaStats>({ alumnos: 0, profesores: 0, grados: 0, dispensasPendientes: 0 });
const alumnos = ref<Alumno[]>([]);
const dispensas = ref<any[]>([]);
const activeTab = ref('dispensas');
const loading = ref(true);
const mensaje = ref({ texto: '', tipo: '' });

const busquedaAlumnoId = ref('');
const detalleMatricula = ref<any>(null);

const detalleDispensa = ref<any>(null);

const verDispensa = (d: any) => { detalleDispensa.value = d; };

const eliminarDispensa = async () => {
  if (!detalleDispensa.value) return;
  if (!confirm('¿Eliminar esta dispensa? La acción no se puede deshacer.')) return;
  try {
    await dispensaService.deleteDispensa(detalleDispensa.value.id);
    detalleDispensa.value = null;
    mensaje.value = { texto: 'Dispensa eliminada', tipo: 'success' };
    await cargarDatos();
  } catch {
    mensaje.value = { texto: 'Error al eliminar la dispensa', tipo: 'error' };
  } finally {
    setTimeout(() => mensaje.value.texto = '', 3000);
  }
};

const cargarDatos = async () => {
  loading.value = true;
  try {
    const [s, a, d] = await Promise.all([
      secretariaService.getStats(),
      secretariaService.getAlumnos(),
      dispensaService.getAllDispensas()
    ]);
    stats.value = s;
    alumnos.value = a;
    dispensas.value = d;
  } finally {
    loading.value = false;
  }
};

onMounted(cargarDatos);

const buscarMatricula = async () => {
  if (!busquedaAlumnoId.value) return;
  const res = await secretariaService.getAlumnos();
  const alu = res.find((a: any) => a.numeroRegistro === busquedaAlumnoId.value || a.id === busquedaAlumnoId.value);
  if (alu) {
    detalleMatricula.value = {
      alumno: alu,
      estado: 'EXPEDIENTE ACTIVO',
      grados: ['TEST GRADO SOFTWARE'],
      fechaIngreso: '2026-02-01'
    };
  } else {
    mensaje.value = { texto: 'REGISTRO NO ENCONTRADO.', tipo: 'error' };
    detalleMatricula.value = null;
    setTimeout(() => mensaje.value.texto = '', 3000);
  }
};

const exportarDispensas = () => {
  const csv = "data:text/csv;charset=utf-8,Fecha,Alumno,Motivo,Estado\n" + 
    dispensas.value.map((d: any) => `${d.fechaSolicitud},${d.alumno.nombre},${d.motivo},${d.estado}`).join("\n");
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", "cat_dispensas.csv");
  link.click();
};

const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('es-ES');
</script>

<template>
  <div class="container-wide">
    <header class="page-header">
      <div class="header-info">
        <h1>Gestión Académica</h1>
        <p class="dim">Administración de dispensas, matrículas y listados oficiales.</p>
      </div>
    </header>

    <nav class="nav-tabs">
      <button @click="activeTab = 'dispensas'" :class="{ active: activeTab === 'dispensas' }">Control de Dispensas</button>
      <button @click="activeTab = 'alumnos'" :class="{ active: activeTab === 'alumnos' }">Base de Alumnos</button>
      <button @click="activeTab = 'matriculas'" :class="{ active: activeTab === 'matriculas' }">Expedientes Matrícula</button>
    </nav>

    <div v-if="mensaje.texto" :class="['toast-alert', mensaje.tipo]">{{ mensaje.texto }}</div>

    <main class="tab-content">
      <!-- SECCIÓN DISPENSAS -->
      <section v-if="activeTab === 'dispensas'" class="card-base">
        <div class="panel-header flex-between">
          <h3>Catálogo de Dispensas</h3>
          <button @click="exportarDispensas" class="btn-outline btn-sm">Exportar CSV</button>
        </div>
        <table class="table-corp">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Estudiante</th>
              <th>Asignatura</th>
              <th>Estado</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in dispensas" :key="d.id">
              <td class="dim">{{ formatDate(d.fechaSolicitud) }}</td>
              <td>
                <span class="bold">{{ d.alumno.nombre }}</span>
                <code class="code-sm ml-2">{{ d.alumno.numeroRegistro }}</code>
              </td>
              <td>
                <span v-if="d.asignaturas?.length" class="asig-tag">{{ d.asignaturas.map((a: any) => a.nombre).join(', ') }}</span>
                <span v-else class="dim">—</span>
              </td>
              <td><span :class="['status-badge', d.estado.toLowerCase()]">{{ d.estado }}</span></td>
              <td class="text-right">
                <button @click="verDispensa(d)" class="btn-icon">Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- SECCIÓN ALUMNOS -->
      <section v-if="activeTab === 'alumnos'" class="card-base">
        <div class="panel-header"><h3>Listado General de Alumnos</h3></div>
        <table class="table-corp">
          <thead><tr><th>Nº Registro</th><th>Nombre Completo</th><th>Email Académico</th></tr></thead>
          <tbody>
            <tr v-for="a in alumnos" :key="a.id">
              <td><code class="code-sm">{{ a.numeroRegistro }}</code></td>
              <td class="bold">{{ a.nombre }}</td>
              <td class="dim">{{ a.email }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- SECCIÓN MATRÍCULAS -->
      <section v-if="activeTab === 'matriculas'" class="card-base">
        <div class="panel-header"><h3>Consulta de Expedientes</h3></div>
        <div class="search-panel">
          <div class="input-row">
            <input v-model="busquedaAlumnoId" class="form-input" placeholder="ID o Número de Registro..." @keyup.enter="buscarMatricula" />
            <button @click="buscarMatricula" class="btn-primary">Buscar Expediente</button>
          </div>
          
          <div v-if="detalleMatricula" class="expediente-box">
            <div class="expediente-header">
              <h4>{{ detalleMatricula.alumno.nombre }}</h4>
              <span class="status-badge aprobada">{{ detalleMatricula.estado }}</span>
            </div>
            <div class="expediente-grid">
              <div class="e-item"><label class="form-label">Registro</label><span>{{ detalleMatricula.alumno.numeroRegistro }}</span></div>
              <div class="e-item"><label class="form-label">Email</label><span>{{ detalleMatricula.alumno.email }}</span></div>
              <div class="e-item"><label class="form-label">Fecha Ingreso</label><span>{{ detalleMatricula.fechaIngreso }}</span></div>
              <div class="e-item full"><label class="form-label">Grados Adscritos</label><span>{{ detalleMatricula.grados.join(', ') }}</span></div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal Detalle Dispensa -->
    <div v-if="detalleDispensa" class="modal-backdrop">
      <div class="card-base modal-content">
        <header class="modal-header">
          <h3>Detalle de Dispensa</h3>
          <button @click="detalleDispensa = null" class="btn-close">×</button>
        </header>
        <div class="modal-body detail-grid">
          <div class="detail-item">
            <label class="form-label">Estudiante</label>
            <span class="bold">{{ detalleDispensa.alumno.nombre }}</span>
            <code class="code-sm ml-2">{{ detalleDispensa.alumno.numeroRegistro }}</code>
          </div>
          <div class="detail-item">
            <label class="form-label">Estado</label>
            <span :class="['status-badge', detalleDispensa.estado.toLowerCase()]">{{ detalleDispensa.estado }}</span>
          </div>
          <div class="detail-item full">
            <label class="form-label">Asignatura(s)</label>
            <span v-if="detalleDispensa.asignaturas?.length">
              <span v-for="a in detalleDispensa.asignaturas" :key="a.id" class="asig-tag mr-1">{{ a.nombre }}</span>
            </span>
            <span v-else class="dim">Sin asignaturas registradas</span>
          </div>
          <div class="detail-item full">
            <label class="form-label">Motivo</label>
            <p class="motivo-text">{{ detalleDispensa.motivo }}</p>
          </div>
          <div class="detail-item">
            <label class="form-label">Fecha Solicitud</label>
            <span>{{ formatDate(detalleDispensa.fechaSolicitud) }}</span>
          </div>
        </div>
        <footer class="modal-footer">
          <button @click="eliminarDispensa" class="btn-outline btn-danger-outline">Eliminar Dispensa</button>
          <button @click="detalleDispensa = null" class="btn-primary">Cerrar</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
.header-info h1 { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text-primary); }

.nav-tabs { display: flex; gap: 2rem; border-bottom: 1px solid var(--border); margin-bottom: 2rem; }
.nav-tabs button { background: none; border: none; padding: 1rem 0; color: var(--text-secondary); font-weight: 600; cursor: pointer; position: relative; font-size: 0.9rem; }
.nav-tabs button.active { color: var(--accent-primary); }
.nav-tabs button.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 3px; background: var(--accent-primary); border-radius: 3px 3px 0 0; }

.panel-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
.panel-header h3 { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
.flex-between { display: flex; justify-content: space-between; align-items: center; }

.btn-sm { padding: 0.4rem 0.8rem; font-size: 0.7rem; }
.text-right { text-align: right; }
.ml-2 { margin-left: 0.5rem; }
.btn-icon { background: none; border: none; font-size: 0.8rem; font-weight: 600; color: var(--accent-primary); cursor: pointer; }
.btn-icon:hover { color: var(--accent-hover); text-decoration: underline; }

.status-badge.pendiente { background: var(--warning-bg); color: var(--warning); border: 1px solid rgba(217, 119, 6, 0.2); }
.status-badge.aprobada { background: var(--success-bg); color: var(--success); border: 1px solid rgba(5, 150, 105, 0.2); }

.truncate { max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: middle; }

/* Search Panel */
.search-panel { padding: 2rem; }
.input-row { display: flex; gap: 1rem; margin-bottom: 2rem; }
.input-row input { flex: 1; }

.expediente-box { background: var(--bg-main); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1.5rem; }
.expediente-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
.expediente-header h4 { font-size: 1.1rem; font-weight: 600; }

.expediente-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.e-item span { font-weight: 500; font-size: 0.95rem; }
.e-item.full { grid-column: span 3; }

/* Modal */
.modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(2px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal-content { width: 100%; max-width: 540px; box-shadow: var(--shadow-lg); }
.modal-header { padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { font-size: 1.1rem; font-weight: 600; }
.modal-body { padding: 1.5rem; }
.form-layout { display: flex; flex-direction: column; gap: 1.25rem; }
.sessions-list-check { max-height: 150px; overflow-y: auto; background: var(--bg-main); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1rem; }
.session-row { display: flex; align-items: center; margin-bottom: 0.5rem; font-size: 0.85rem; }
.custom-checkbox { width: 1rem; height: 1rem; cursor: pointer; }
.modal-footer { padding: 1.25rem 1.5rem; background: var(--bg-main); border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 1rem; border-radius: 0 0 var(--radius-md) var(--radius-md); }
.btn-close { background: none; border: none; font-size: 1.5rem; line-height: 1; color: var(--text-secondary); cursor: pointer; }
.btn-close:hover { color: var(--text-primary); }

.asig-tag { display: inline-block; padding: 0.15rem 0.5rem; background: var(--accent-surface); color: var(--accent-primary); font-size: 0.75rem; font-weight: 600; border-radius: 999px; border: 1px solid var(--accent-primary); white-space: nowrap; }
.mr-1 { margin-right: 0.25rem; }

.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; padding: 1.5rem; }
.detail-item { display: flex; flex-direction: column; gap: 0.25rem; }
.detail-item.full { grid-column: span 2; }
.motivo-text { font-size: 0.9rem; color: var(--text-primary); margin: 0; line-height: 1.5; }

.btn-danger-outline { color: var(--error); border-color: var(--error); }
.btn-danger-outline:hover { background: var(--error-bg); }

.toast-alert { position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 500; box-shadow: var(--shadow-md); z-index: 3000; }
.toast-alert.success { border-left: 4px solid var(--success); }
.toast-alert.error { border-left: 4px solid var(--error); }
</style>
