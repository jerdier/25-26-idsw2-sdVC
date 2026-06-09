<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { secretariaService } from '../services/secretariaService';
import { usuarioService } from '../services/usuarioService';
import { academicService } from '../services/academicService';
import type { Alumno, Profesor } from '../types';

const profesores = ref<Profesor[]>([]);
const directores = ref<any[]>([]);
const secretarias = ref<any[]>([]);
const alumnos = ref<Alumno[]>([]);
const loading = ref(true);
const mensaje = ref({ texto: '', tipo: '' });

const todasAsignaturas = ref<any[]>([]);
const loadingAsignaturas = ref(false);

// Formulario Alta
const nuevoUsuario = ref({ nombre: '', email: '', rol: 'PROFESOR', numeroRegistro: '', password: '' });
const showEditModal = ref(false);
const editingUser = ref<any>(null);
const editFormData = ref({ nombre: '', email: '', numeroRegistro: '', password: '' });

const fetchSystemDirectory = async () => {
  loading.value = true;
  try {
    const [a, p, d, s] = await Promise.all([
      secretariaService.getAlumnos(),
      secretariaService.getProfesores(),
      secretariaService.getDirectores(),
      secretariaService.getSecretarias()
    ]);
    alumnos.value = a;
    profesores.value = p;
    directores.value = d;
    secretarias.value = s;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSystemDirectory);

const executeUserProvisioning = async () => {
  try {
    const password = nuevoUsuario.value.password || 'password123';
    if (nuevoUsuario.value.rol === 'ALUMNO') {
      await secretariaService.createAlumno({
        nombre: nuevoUsuario.value.nombre,
        email: nuevoUsuario.value.email,
        password,
        numeroRegistro: nuevoUsuario.value.numeroRegistro || `REG-${Date.now()}`
      } as any);
    } else if (nuevoUsuario.value.rol === 'DIRECTOR') {
      await secretariaService.createDirector({
        nombre: nuevoUsuario.value.nombre,
        email: nuevoUsuario.value.email,
        password
      });
    } else if (nuevoUsuario.value.rol === 'SECRETARIA') {
      await secretariaService.createSecretaria({
        nombre: nuevoUsuario.value.nombre,
        email: nuevoUsuario.value.email,
        password
      });
    } else {
      await secretariaService.createProfesor({
        nombre: nuevoUsuario.value.nombre,
        email: nuevoUsuario.value.email,
        password
      } as any);
    }
    mensaje.value = { texto: 'Usuario registrado correctamente.', tipo: 'success' };
    await fetchSystemDirectory();
    nuevoUsuario.value = { nombre: '', email: '', rol: 'PROFESOR', numeroRegistro: '', password: '' };
  } catch (e) {
    mensaje.value = { texto: 'Error al registrar el usuario.', tipo: 'error' };
  } finally {
    setTimeout(() => mensaje.value.texto = '', 3000);
  }
};

const inspectUser = async (id: string) => {
  try {
    const user = await usuarioService.getUsuario(id);
    editingUser.value = user;
    editFormData.value = {
      nombre: user.nombre,
      email: user.email,
      numeroRegistro: user.numeroRegistro || '',
      password: ''
    };
    if (user.role === 'professor' || user.role === 'student') {
      loadingAsignaturas.value = true;
      todasAsignaturas.value = await academicService.getAllAsignaturas();
      loadingAsignaturas.value = false;
    }
    showEditModal.value = true;
  } catch (e) {
    alert('Fallo al recuperar registro.');
  }
};

const isAsignaturaAsignada = (asig: any): boolean => {
  if (editingUser.value?.role === 'professor') {
    return asig.profesorId === editingUser.value.id;
  }
  if (editingUser.value?.role === 'student') {
    return asig.alumnos?.some((a: any) => a.id === editingUser.value.id) ?? false;
  }
  return false;
};

const toggleAsignatura = async (asig: any) => {
  if (!editingUser.value) return;
  const asignada = isAsignaturaAsignada(asig);
  try {
    if (editingUser.value.role === 'professor') {
      if (asignada) {
        await academicService.unassignProfesorFromAsignatura(asig.id);
        const idx = todasAsignaturas.value.findIndex(a => a.id === asig.id);
        if (idx !== -1) todasAsignaturas.value[idx] = { ...todasAsignaturas.value[idx], profesorId: null };
      } else {
        await academicService.assignProfesorToAsignatura(asig.id, editingUser.value.id);
        const idx = todasAsignaturas.value.findIndex(a => a.id === asig.id);
        if (idx !== -1) todasAsignaturas.value[idx] = { ...todasAsignaturas.value[idx], profesorId: editingUser.value.id };
      }
    } else if (editingUser.value.role === 'student') {
      if (asignada) {
        await academicService.removeAlumnoFromAsignatura(asig.id, editingUser.value.id);
        const a = todasAsignaturas.value.find(a => a.id === asig.id);
        if (a) a.alumnos = a.alumnos.filter((al: any) => al.id !== editingUser.value.id);
      } else {
        await academicService.addAlumnoToAsignatura(asig.id, editingUser.value.id);
        const a = todasAsignaturas.value.find(a => a.id === asig.id);
        if (a) a.alumnos = [...(a.alumnos || []), { id: editingUser.value.id, nombre: editingUser.value.nombre }];
      }
    }
    mensaje.value = { texto: asignada ? 'Asignatura desasignada.' : 'Asignatura asignada.', tipo: 'success' };
    setTimeout(() => mensaje.value.texto = '', 2000);
  } catch (e) {
    mensaje.value = { texto: 'Error al actualizar asignatura.', tipo: 'error' };
  }
};

const commitUserUpdates = async () => {
  try {
    const payload = { ...editFormData.value };
    if (!payload.password) delete (payload as any).password;

    await usuarioService.updateUsuario(editingUser.value.id, payload);
    mensaje.value = { texto: 'Registro sincronizado.', tipo: 'success' };
    showEditModal.value = false;
    await fetchSystemDirectory();
  } catch (e) {
    mensaje.value = { texto: 'Error en la actualización.', tipo: 'error' };
  } finally {
    setTimeout(() => mensaje.value.texto = '', 3000);
  }
};

const eliminarUsuario = async () => {
  if (!confirm(`¿Está seguro que desea eliminar al usuario ${editingUser.value.nombre}? Esta acción no se puede deshacer.`)) return;

  try {
    await usuarioService.deleteUsuario(editingUser.value.id);
    mensaje.value = { texto: 'Usuario eliminado correctamente.', tipo: 'success' };
    showEditModal.value = false;
    await fetchSystemDirectory();
  } catch (e) {
    mensaje.value = { texto: 'Error al eliminar el usuario.', tipo: 'error' };
  } finally {
    setTimeout(() => mensaje.value.texto = '', 3000);
  }
};
</script>

<template>
  <div class="container-wide">
    <header class="page-header">
      <div class="header-info">
        <h1>Administrador</h1>
        <p class="dim">Gestión central de identidades y privilegios del sistema.</p>
      </div>
    </header>

    <div v-if="mensaje.texto" :class="['toast-alert', mensaje.tipo]">{{ mensaje.texto }}</div>

    <main class="dashboard-grid">
      <!-- Columna Izquierda: Formulario -->
      <aside>
        <section class="card-base">
          <div class="panel-header"><h3>Alta de Nueva Cuenta</h3></div>
          <form @submit.prevent="executeUserProvisioning" class="form-layout">
            <div>
              <label class="form-label">Nombre Completo</label>
              <input v-model="nuevoUsuario.nombre" class="form-input" placeholder="Ej. Ana García" required />
            </div>
            <div>
              <label class="form-label">Correo Institucional</label>
              <input v-model="nuevoUsuario.email" type="email" class="form-input" placeholder="ana@universidad.edu" required />
            </div>
            <div>
              <label class="form-label">Contraseña</label>
              <input v-model="nuevoUsuario.password" type="password" class="form-input" placeholder="Por defecto: password123" />
            </div>
            <div>
              <label class="form-label">Rol del Sistema</label>
              <select v-model="nuevoUsuario.rol" class="form-input">
                <option value="PROFESOR">Profesor</option>
                <option value="DIRECTOR">Director de Grado</option>
                <option value="SECRETARIA">Secretaría Académica</option>
                <option value="ALUMNO">Alumno</option>
              </select>
            </div>
            <div v-if="nuevoUsuario.rol === 'ALUMNO'">
              <label class="form-label">Nº de Registro (Opcional)</label>
              <input v-model="nuevoUsuario.numeroRegistro" class="form-input" placeholder="Dejar en blanco para autogenerar" />
            </div>
            <button type="submit" class="btn-primary mt-2">Crear Cuenta</button>
          </form>
        </section>
      </aside>

      <!-- Columna Derecha: Catálogos -->
      <div class="lists-panel">
        <section class="card-base">
          <div class="panel-header"><h3>Directorio de Profesores</h3></div>
          <table class="table-corp">
            <thead><tr><th>Nombre</th><th>Email Institucional</th><th class="text-right">Acciones</th></tr></thead>
            <tbody>
              <tr v-for="p in profesores" :key="p.id">
                <td class="bold">{{ p.nombre }}</td>
                <td class="dim">{{ p.email }}</td>
                <td class="text-right"><button @click="inspectUser(p.id)" class="btn-icon">Editar</button></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="card-base">
          <div class="panel-header"><h3>Directorio de Directores de Grado</h3></div>
          <table class="table-corp">
            <thead><tr><th>Nombre</th><th>Email Institucional</th><th class="text-right">Acciones</th></tr></thead>
            <tbody>
              <tr v-for="d in directores" :key="d.id">
                <td class="bold">{{ d.nombre }}</td>
                <td class="dim">{{ d.email }}</td>
                <td class="text-right"><button @click="inspectUser(d.id)" class="btn-icon">Editar</button></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="card-base">
          <div class="panel-header">
            <h3>Directorio de Secretaría</h3>
          </div>
          <table class="table-corp">
            <thead><tr><th>Nombre</th><th>Email Institucional</th><th class="text-right">Acciones</th></tr></thead>
            <tbody>
              <tr v-for="s in secretarias" :key="s.id">
                <td class="bold">{{ s.nombre }}</td>
                <td class="dim">{{ s.email }}</td>
                <td class="text-right"><button @click="inspectUser(s.id)" class="btn-icon">Editar</button></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="card-base">
          <div class="panel-header">
            <h3>Directorio de Alumnos</h3></div>
          <table class="table-corp">
            <thead><tr><th>Registro</th><th>Nombre</th><th class="text-right">Acciones</th></tr></thead>
            <tbody>
              <tr v-for="a in alumnos" :key="a.id">
                <td><code class="code-sm">{{ a.numeroRegistro }}</code></td>
                <td class="bold">{{ a.nombre }}</td>
                <td class="text-right"><button @click="inspectUser(a.id)" class="btn-icon">Editar</button></td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </main>

    <!-- Modal Edición -->
    <div v-if="showEditModal" class="modal-backdrop">
      <div class="card-base modal-content">
        <header class="modal-header">
          <h3>Editar Perfil de Usuario</h3>
          <button @click="showEditModal = false" class="btn-close">×</button>
        </header>
        <div class="modal-body form-layout">
          <div><label class="form-label">Nombre</label><input v-model="editFormData.nombre" class="form-input" /></div>
          <div><label class="form-label">Email</label><input v-model="editFormData.email" class="form-input" type="email" /></div>
          <div v-if="editingUser?.role === 'student'"><label class="form-label">Nº Registro</label><input v-model="editFormData.numeroRegistro" class="form-input" /></div>
          <div><label class="form-label">Nueva Contraseña</label><input v-model="editFormData.password" type="password" class="form-input" placeholder="Dejar en blanco para no cambiar" /></div>
          <div v-if="editingUser?.role === 'professor' || editingUser?.role === 'student'" class="asig-section">
            <label class="form-label">Asignaturas Asignadas</label>
            <div v-if="loadingAsignaturas" class="dim-sm">Cargando asignaturas...</div>
            <div v-else class="asig-chips-wrap">
              <div
                v-for="asig in todasAsignaturas"
                :key="asig.id"
                :class="['asig-chip', { 'asig-chip--on': isAsignaturaAsignada(asig) }]"
                @click="toggleAsignatura(asig)"
                :title="editingUser?.role === 'professor' ? 'Asignar como profesor' : 'Matricular/desmatricular alumno'"
              >
                <span class="asig-chip-name">{{ asig.nombre }}</span>
                <span class="asig-chip-grado">{{ asig.grado?.nombre }}</span>
              </div>
              <p v-if="todasAsignaturas.length === 0" class="dim-sm">No hay asignaturas creadas.</p>
            </div>
          </div>
        </div>
        <footer class="modal-footer">
          <button @click="eliminarUsuario" class="btn-danger mr-auto">Eliminar</button>
          <button @click="showEditModal = false" class="btn-outline">Cancelar</button>
          <button @click="commitUserUpdates" class="btn-primary">Guardar Cambios</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 2.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
.header-info h1 { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary); }

.dashboard-grid { display: grid; grid-template-columns: 340px 1fr; gap: 2rem; align-items: start; }
.lists-panel { display: flex; flex-direction: column; gap: 2rem; }

.panel-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); background: var(--bg-main); border-radius: var(--radius-md) var(--radius-md) 0 0; }
.panel-header h3 { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }

.form-layout { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
.mt-2 { margin-top: 0.5rem; }

.text-right { text-align: right; }
.btn-icon { background: none; border: none; font-size: 0.8rem; font-weight: 700; color: var(--accent-primary); cursor: pointer; }
.btn-icon:hover { color: var(--accent-hover); text-decoration: underline; }

.btn-danger { background: var(--error); color: white; border: none; padding: 0.8rem 1.5rem; font-weight: 700; font-size: 0.75rem; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s ease;}
.btn-danger:hover { background: #991b1b; }
.mr-auto { margin-right: auto; }

/* Modal */
.modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
.modal-content { width: 100%; max-width: 480px; box-shadow: var(--shadow-lg); }
.modal-header { padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { font-size: 1.1rem; font-weight: 700; }
.modal-body { padding: 1.5rem; }
.modal-footer { padding: 1.25rem 1.5rem; background: var(--bg-main); border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 1rem; border-radius: 0 0 var(--radius-md) var(--radius-md); }
.btn-close { background: none; border: none; font-size: 1.5rem; line-height: 1; color: var(--text-secondary); cursor: pointer; }
.btn-close:hover { color: var(--text-primary); }

.toast-alert { position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; box-shadow: var(--shadow-md); z-index: 3000; }
.toast-alert.success { border-left: 4px solid var(--success); }
.toast-alert.error { border-left: 4px solid var(--error); }

@media (max-width: 1024px) { .dashboard-grid { grid-template-columns: 1fr; } }

.asig-section { display: flex; flex-direction: column; gap: 0.75rem; }
.asig-chips-wrap { display: flex; flex-wrap: wrap; gap: 0.5rem; max-height: 180px; overflow-y: auto; padding: 0.5rem; background: var(--bg-main); border: 1px solid var(--border); border-radius: var(--radius-sm); }
.asig-chip { display: flex; flex-direction: column; padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; transition: all 0.15s ease; background: var(--bg-card); min-width: 120px; }
.asig-chip:hover { border-color: var(--accent-primary); }
.asig-chip--on { border-color: var(--accent-primary); background: var(--accent-surface); }
.asig-chip-name { font-size: 0.8rem; font-weight: 600; color: var(--text-primary); }
.asig-chip-grado { font-size: 0.7rem; color: var(--text-secondary); margin-top: 2px; }
.asig-chip--on .asig-chip-name { color: var(--accent-primary); }
.dim-sm { font-size: 0.8rem; color: var(--text-secondary); font-style: italic; }
</style>
