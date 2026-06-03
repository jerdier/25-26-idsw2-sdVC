<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { secretariaService } from '../services/secretariaService';
import type { Alumno, Profesor, SecretariaStats, CreateAlumnoDTO } from '../types';

// Estado del Dashboard
const stats = ref<SecretariaStats>({
  alumnos: 0,
  profesores: 0,
  grados: 0,
  dispensasPendientes: 0
});

const alumnos = ref<Alumno[]>([]);
const profesores = ref<Profesor[]>([]);
const grados = ref<any[]>([]);
const activeTab = ref('overview');
const loading = ref(true);

// Formularios
const nuevoAlumno = ref<CreateAlumnoDTO>({ nombre: '', email: '', numeroRegistro: '' });
const mensaje = ref({ texto: '', tipo: '' });

// Datos para Matrículas (Simulados o cargados de la DB)
const selectedAlumno = ref('');
const selectedGrado = ref('');
const MOCK_SECRETARIA_ID = 'mock-secretaria-id';

const cargarDatos = async () => {
  loading.value = true;
  try {
    const [s, a, p] = await Promise.all([
      secretariaService.getStats(),
      secretariaService.getAlumnos(),
      secretariaService.getProfesores()
    ]);
    stats.value = s;
    alumnos.value = a;
    profesores.value = p;
    
    // Grados de ejemplo (En una app real vendrían del servicio)
    grados.value = [
      { id: '1', nombre: 'Ingeniería de Software' },
      { id: '2', nombre: 'Administración de Empresas' }
    ];
  } catch (error) {
    console.error('Error cargando datos de secretaría:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(cargarDatos);

const registrarAlumno = async () => {
  try {
    await secretariaService.createAlumno(nuevoAlumno.value);
    mensaje.value = { texto: 'Alumno registrado con éxito', tipo: 'success' };
    nuevoAlumno.value = { nombre: '', email: '', numeroRegistro: '' };
    await cargarDatos();
  } catch (error) {
    mensaje.value = { texto: 'Error al registrar alumno', tipo: 'error' };
  }
};

const matricular = async () => {
  if (!selectedAlumno.value || !selectedGrado.value) return;
  try {
    await secretariaService.createMatricula({
      alumnoId: selectedAlumno.value,
      gradoId: selectedGrado.value,
      secretariaId: MOCK_SECRETARIA_ID
    });
    mensaje.value = { texto: 'Matrícula realizada correctamente', tipo: 'success' };
    await cargarDatos();
  } catch (error) {
    mensaje.value = { texto: 'Error al matricular', tipo: 'error' };
  }
};

const handleImport = () => {
  alert('Funcionalidad de importación masiva: Seleccionando archivo CSV/Excel...');
};
</script>

<template>
  <div class="secretaria-dashboard">
    <header class="header">
      <div class="header-content">
        <h1>Centro de Gestión Universitaria</h1>
        <p class="role-badge">SECRETARÍA ACADÉMICA</p>
      </div>
      <div class="actions">
        <button @click="handleImport" class="btn-secondary">Importar Alumnos (CSV)</button>
        <button @click="cargarDatos" class="btn-refresh">Actualizar</button>
      </div>
    </header>

    <nav class="tabs">
      <button @click="activeTab = 'overview'" :class="{ active: activeTab === 'overview' }">Vista General</button>
      <button @click="activeTab = 'alumnos'" :class="{ active: activeTab === 'alumnos' }">Gestión de Alumnos</button>
      <button @click="activeTab = 'matriculas'" :class="{ active: activeTab === 'matriculas' }">Matriculaciones</button>
      <button @click="activeTab = 'profesores'" :class="{ active: activeTab === 'profesores' }">Docentes</button>
    </nav>

    <main class="content">
      <div v-if="loading" class="loading-overlay">Cargando información del sistema...</div>

      <!-- VISTA GENERAL (PROTOTIPO DASHBOARD) -->
      <section v-if="activeTab === 'overview'" class="stats-grid">
        <div class="stat-card">
          <div class="icon">👥</div>
          <div class="info">
            <span class="label">Alumnos Totales</span>
            <span class="value">{{ stats.alumnos }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon">👨‍🏫</div>
          <div class="info">
            <span class="label">Cuerpo Docente</span>
            <span class="value">{{ stats.profesores }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon">🎓</div>
          <div class="info">
            <span class="label">Grados Activos</span>
            <span class="value">{{ stats.grados }}</span>
          </div>
        </div>
        <div class="stat-card alert-stat" :class="{ 'has-pending': stats.dispensasPendientes > 0 }">
          <div class="icon">📝</div>
          <div class="info">
            <span class="label">Dispensas Pendientes</span>
            <span class="value">{{ stats.dispensasPendientes }}</span>
          </div>
        </div>
      </section>

      <!-- GESTIÓN DE ALUMNOS (RegistroMatriculaView parcial) -->
      <section v-if="activeTab === 'alumnos'" class="management-grid">
        <div class="card form-card">
          <h3>Registro de Identidad</h3>
          <p class="form-desc">Alta de nuevos estudiantes en la base de datos central.</p>
          <form @submit.prevent="registrarAlumno" class="form-vertical">
            <div class="field">
              <label>Nombre Completo</label>
              <input v-model="nuevoAlumno.nombre" placeholder="Ej: Juan Pérez" required />
            </div>
            <div class="field">
              <label>Email Académico</label>
              <input v-model="nuevoAlumno.email" type="email" placeholder="email@universidad.edu" required />
            </div>
            <div class="field">
              <label>Número de Registro</label>
              <input v-model="nuevoAlumno.numeroRegistro" placeholder="ALUXXXX" required />
            </div>
            <button type="submit" class="btn-primary">Añadir a Base de Datos</button>
          </form>
          <div v-if="mensaje.texto" :class="['alert', mensaje.tipo]">{{ mensaje.texto }}</div>
        </div>

        <div class="card table-card">
          <h3>Registros Recientes</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alumno in alumnos" :key="alumno.id">
                <td class="code">{{ alumno.numeroRegistro }}</td>
                <td>{{ alumno.nombre }}</td>
                <td>{{ alumno.email }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- MATRICULACIONES (GestionarMatriculas logic) -->
      <section v-if="activeTab === 'matriculas'" class="matriculas-section">
        <div class="card wide-card">
          <h3>Vincular Alumno a Grado (Matriculación)</h3>
          <div class="matricula-controls">
            <div class="field">
              <label>Seleccionar Estudiante</label>
              <select v-model="selectedAlumno">
                <option value="">Seleccione un alumno...</option>
                <option v-for="a in alumnos" :key="a.id" :value="a.id">{{ a.nombre }} ({{ a.numeroRegistro }})</option>
              </select>
            </div>
            <div class="field">
              <label>Grado Académico</label>
              <select v-model="selectedGrado">
                <option value="">Seleccione un grado...</option>
                <option v-for="g in grados" :key="g.id" :value="g.id">{{ g.nombre }}</option>
              </select>
            </div>
            <button @click="matricular" class="btn-action" :disabled="!selectedAlumno || !selectedGrado">
              Confirmar Matrícula
            </button>
          </div>
          <div v-if="mensaje.texto" :class="['alert', mensaje.tipo]">{{ mensaje.texto }}</div>
        </div>
      </section>

      <!-- DOCENTES -->
      <section v-if="activeTab === 'profesores'" class="card">
        <h3>Listado del Cuerpo Docente</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="profesor in profesores" :key="profesor.id">
              <td>{{ profesor.nombre }}</td>
              <td>{{ profesor.email }}</td>
              <td><span class="status-active">Activo</span></td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<style scoped>
.secretaria-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  color: #2c3e50;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 0;
  border-bottom: 2px solid #eee;
  margin-bottom: 2rem;
}

.header h1 { margin: 0; font-size: 1.8rem; font-weight: 800; color: #1a2a6c; }
.role-badge { 
  margin: 5px 0 0; 
  background: #34495e; 
  color: white; 
  display: inline-block; 
  padding: 2px 10px; 
  border-radius: 4px; 
  font-size: 0.75rem; 
  font-weight: bold;
  letter-spacing: 1px;
}

.tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 2rem;
}

.tabs button {
  padding: 12px 24px;
  border: none;
  background: #f8f9fa;
  color: #7f8c8d;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tabs button.active {
  background: #1a2a6c;
  color: white;
  box-shadow: 0 4px 15px rgba(26, 42, 108, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border: 1px solid #eee;
}

.stat-card .icon { font-size: 2.5rem; }
.stat-card .label { display: block; color: #7f8c8d; font-size: 0.9rem; }
.stat-card .value { font-size: 2rem; font-weight: 800; color: #2c3e50; }

.alert-stat.has-pending {
  border-left: 5px solid #e74c3c;
  background: #fff5f5;
}

.management-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 25px;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.form-desc { color: #95a5a6; font-size: 0.9rem; margin-bottom: 20px; }

.form-vertical .field { margin-bottom: 15px; }
.field label { display: block; font-weight: bold; font-size: 0.85rem; margin-bottom: 5px; color: #34495e; }
.field input, .field select {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdde1;
  border-radius: 6px;
  font-size: 1rem;
}

.btn-primary {
  width: 100%;
  background: #3498db;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.btn-secondary {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 10px;
}

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; padding: 12px; border-bottom: 2px solid #eee; color: #7f8c8d; font-size: 0.85rem; }
.data-table td { padding: 12px; border-bottom: 1px solid #f1f2f6; }
.code { font-family: monospace; font-weight: bold; color: #e67e22; }

.status-active { background: #e3fcef; color: #00875a; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }

.matricula-controls {
  display: flex;
  gap: 20px;
  align-items: flex-end;
}

.btn-action {
  background: #1a2a6c;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-action:disabled { background: #bdc3c7; cursor: not-allowed; }

.alert { margin-top: 20px; padding: 15px; border-radius: 6px; font-weight: bold; }
.alert.success { background: #dff9fb; color: #130f40; border-left: 5px solid #2ecc71; }
.alert.error { background: #fab1a0; color: #d63031; border-left: 5px solid #ff7675; }

.loading-overlay { text-align: center; padding: 50px; color: #7f8c8d; font-style: italic; }
</style>
