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
const nuevoProfesor = ref({ nombre: '', email: '' });
const mensaje = ref({ texto: '', tipo: '' });

// ... (other refs)

const registrarProfesor = async () => {
  try {
    await secretariaService.createProfesor(nuevoProfesor.value);
    mensaje.value = { texto: 'Docente registrado con éxito', tipo: 'success' };
    nuevoProfesor.value = { nombre: '', email: '' };
    await cargarDatos();
  } catch (error) {
    mensaje.value = { texto: 'Error al registrar docente', tipo: 'error' };
  }
};

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

const handleImport = async () => {
  // Simulación de parseo de un CSV/Excel para el prototipo
  const alumnosSimulados: CreateAlumnoDTO[] = [
    { nombre: 'Test Alumno A', email: 'test.alumno.a@example.com', numeroRegistro: 'ALU_A' },
    { nombre: 'Test Alumno B', email: 'test.alumno.b@example.com', numeroRegistro: 'ALU_B' },
    { nombre: 'Test Alumno C', email: 'test.alumno.c@example.com', numeroRegistro: 'ALU_C' }
  ];

  if (grados.value.length === 0) {
    mensaje.value = { texto: 'No hay grados disponibles para matricular', tipo: 'error' };
    return;
  }

  const gradoId = grados.value[0].id; // Matriculamos al primer grado por defecto en la simulación

  try {
    loading.value = true;
    const result = await secretariaService.importAlumnos({
      alumnos: alumnosSimulados,
      gradoId: gradoId,
      secretariaId: MOCK_SECRETARIA_ID
    });
    mensaje.value = { 
      texto: `Importación exitosa: ${result.count} alumnos creados y matriculados.`, 
      tipo: 'success' 
    };
    await cargarDatos();
  } catch (error) {
    mensaje.value = { texto: 'Error en la importación masiva', tipo: 'error' };
  } finally {
    loading.value = false;
  }
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
      <section v-if="activeTab === 'profesores'" class="management-grid">
        <div class="card form-card">
          <h3>Alta de Docentes</h3>
          <p class="form-desc">Registrar un nuevo profesor en el sistema.</p>
          <form @submit.prevent="registrarProfesor" class="form-vertical">
            <div class="field">
              <label>Nombre del Docente</label>
              <input v-model="nuevoProfesor.nombre" placeholder="Ej: Dr. García" required />
            </div>
            <div class="field">
              <label>Email Académico</label>
              <input v-model="nuevoProfesor.email" type="email" placeholder="prof@universidad.edu" required />
            </div>
            <button type="submit" class="btn-primary">Registrar Profesor</button>
          </form>
          <div v-if="mensaje.texto" :class="['alert', mensaje.tipo]">{{ mensaje.texto }}</div>
        </div>

        <div class="card table-card">
          <h3>Cuerpo Docente</h3>
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
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.secretaria-dashboard {
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Inter', -apple-system, sans-serif;
  color: #1e293b;
}

.header {
  background: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a2a6c;
  letter-spacing: -0.5px;
}

.role-badge {
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

.actions {
  display: flex;
  gap: 12px;
}

.btn-secondary {
  background: white;
  color: #1a2a6c;
  border: 2px solid #1a2a6c;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f8fafc;
  transform: translateY(-1px);
}

.btn-refresh {
  background: #1a2a6c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tabs {
  background: white;
  padding: 0 2rem;
  display: flex;
  gap: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.tabs button {
  padding: 1rem 0;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tabs button:hover {
  color: #1a2a6c;
}

.tabs button.active {
  color: #1a2a6c;
}

.tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 3px;
  background: #1a2a6c;
  border-radius: 3px 3px 0 0;
}

.content {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card .icon {
  width: 56px;
  height: 56px;
  background: #f1f5f9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-card .label {
  display: block;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-card .value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
}

.alert-stat.has-pending {
  border: 2px solid #fee2e2;
  background: #fffcfc;
}

.alert-stat.has-pending .icon { background: #fee2e2; }
.alert-stat.has-pending .value { color: #b91c1c; }

.management-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 2rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}

.card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.form-desc {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 2rem;
}

.field {
  margin-bottom: 1.25rem;
}

.field label {
  display: block;
  font-weight: 600;
  font-size: 0.8rem;
  color: #475569;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.field input, .field select {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  background: #f8fafc;
  transition: all 0.2s;
}

.field input:focus, .field select:focus {
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
  padding: 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #243b55;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table th {
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

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.95rem;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.code {
  font-family: 'JetBrains Mono', monospace;
  background: #f1f5f9;
  color: #1e293b;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85rem;
}

.matricula-controls {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1.5rem;
  align-items: flex-end;
}

.btn-action {
  background: #1a2a6c;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.alert {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
}

.alert.success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
.alert.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }

.loading-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #64748b;
  font-weight: 500;
}
</style>
