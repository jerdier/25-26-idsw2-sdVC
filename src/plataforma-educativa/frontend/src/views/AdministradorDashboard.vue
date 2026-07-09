<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuth } from '../services/authService';
import usuarioService from '../services/usuarioService';
import academicService from '../services/academicService';

const { state } = useAuth();

// Navegación: 'menu' | 'lista' | 'detalle' | 'editar' | 'crear' | 'asignaturas'
const vista = ref<'menu' | 'lista' | 'detalle' | 'editar' | 'crear' | 'asignaturas'>('menu');
const msg = ref(''); const err = ref('');
const ok = (m: string) => { msg.value = m; err.value = ''; };
const ko = (e: any) => { err.value = e.response?.data?.message ?? e.message; msg.value = ''; };

const usuarios = ref<any[]>([]);
const filtro = ref('');
const sel = ref<any>(null);
const todasAsignaturas = ref<any[]>([]);
const alumnoAsignaturas = ref<any[]>([]);
const asignaturasSeleccionadas = ref<string[]>([]);

const editForm = reactive({ nombre: '', email: '' });
const crearForm = reactive({ nombre: '', email: '', password: 'password123', rol: 'alumno', numeroRegistro: '' });

const rolLabel = (r: string) => ({ alumno: 'Alumno', profesor: 'Profesor', directorDeGrado: 'Director', secretaria: 'Secretaría' }[r] ?? r);

// CU: abrirUsuarios
const cargarUsuarios = async (f?: string) => {
  try { usuarios.value = await usuarioService.consultarUsuario(f); }
  catch (e: any) { ko(e); }
};

onMounted(() => cargarUsuarios());

const irLista = async () => {
  msg.value = ''; err.value = '';
  await cargarUsuarios(filtro.value || undefined);
  vista.value = 'lista';
};

// CU: consultarUsuario
const irDetalle = async (u: any) => {
  msg.value = ''; err.value = '';
  try { sel.value = await usuarioService.getUsuario(u.id); }
  catch { sel.value = u; }
  vista.value = 'detalle';
};

// CU: editarUsuario
const irEditar = () => {
  editForm.nombre = sel.value.nombre;
  editForm.email = sel.value.email;
  vista.value = 'editar';
};

const handleEditar = async () => {
  try {
    await usuarioService.editarUsuario(sel.value.id, editForm);
    ok('Usuario actualizado.');
    sel.value = { ...sel.value, ...editForm };
    vista.value = 'detalle';
    await cargarUsuarios();
  } catch (e: any) { ko(e); }
};

const handleEliminar = async () => {
  if (!confirm(`¿Eliminar usuario "${sel.value.nombre}"? Esta acción no se puede deshacer.`)) return;
  try {
    await usuarioService.deleteUsuario(sel.value.id);
    ok('Usuario eliminado.');
    sel.value = null;
    vista.value = 'lista';
    await cargarUsuarios();
  } catch (e: any) { ko(e); }
};

// CU: asignar asignaturas (solo alumnos)
const irAsignaturas = async () => {
  msg.value = ''; err.value = '';
  try {
    [todasAsignaturas.value, alumnoAsignaturas.value] = await Promise.all([
      academicService.getAllAsignaturas(),
      usuarioService.getAlumnoAsignaturas(sel.value.id)
    ]);
    asignaturasSeleccionadas.value = alumnoAsignaturas.value.map((a: any) => a.id);
    vista.value = 'asignaturas';
  } catch (e: any) { ko(e); }
};

const handleGuardarAsignaturas = async () => {
  try {
    await usuarioService.asignarAsignaturas(sel.value.id, asignaturasSeleccionadas.value);
    ok('Asignaturas actualizadas.');
    vista.value = 'detalle';
  } catch (e: any) { ko(e); }
};

// CU: crearUsuario
const irCrear = () => {
  msg.value = ''; err.value = '';
  Object.assign(crearForm, { nombre: '', email: '', password: 'password123', rol: 'alumno', numeroRegistro: '' });
  vista.value = 'crear';
};

const handleCrear = async () => {
  try {
    await usuarioService.crearUsuario({ ...crearForm, numeroRegistro: crearForm.numeroRegistro || undefined });
    ok('Usuario creado correctamente.');
    await cargarUsuarios();
    vista.value = 'lista';
  } catch (e: any) { ko(e); }
};

const volver = () => {
  msg.value = ''; err.value = '';
  if (vista.value === 'editar' || vista.value === 'asignaturas') vista.value = 'detalle';
  else if (vista.value === 'detalle') vista.value = 'lista';
  else vista.value = 'menu';
};

// Agrupar asignaturas por grado
const asignaturasPorGrado = () => {
  const grupos: Record<string, any[]> = {};
  for (const a of todasAsignaturas.value) {
    const g = a.grado?.nombre ?? 'Sin grado';
    if (!grupos[g]) grupos[g] = [];
    grupos[g].push(a);
  }
  return grupos;
};
</script>

<template>
  <div class="page">
    <div class="topbar">
      <div class="breadcrumb">
        <span class="bc-root" @click="vista = 'menu'">completarGestionUsuarios</span>
        <template v-if="vista === 'lista' || vista === 'crear'">
          <span class="bc-sep">›</span>
          <span class="bc-item">{{ vista === 'crear' ? 'crearUsuario' : 'abrirUsuarios' }}</span>
        </template>
        <template v-if="vista === 'detalle' || vista === 'editar' || vista === 'asignaturas'">
          <span class="bc-sep">›</span>
          <span class="bc-root" @click="vista = 'lista'">abrirUsuarios</span>
          <span class="bc-sep">›</span>
          <span :class="vista !== 'detalle' ? 'bc-root' : 'bc-item'" @click="vista !== 'detalle' ? volver() : null">{{ sel?.nombre }}</span>
          <template v-if="vista === 'editar'"><span class="bc-sep">›</span><span class="bc-item">Editar</span></template>
          <template v-if="vista === 'asignaturas'"><span class="bc-sep">›</span><span class="bc-item">Asignaturas</span></template>
        </template>
      </div>
      <div class="user-chip">
        <span class="role-pill">Administrador</span>
        <span class="uname">{{ state.user?.nombre }}</span>
      </div>
    </div>

    <div v-if="msg" class="fb-ok">{{ msg }}</div>
    <div v-if="err" class="fb-ko">{{ err }}</div>

    <!-- MENÚ PRINCIPAL -->
    <template v-if="vista === 'menu'">
      <h2 class="section-title">Gestión de usuarios</h2>
      <div class="menu-grid">
        <button class="menu-card" @click="irLista">
          <div><p class="menu-card-title">abrirUsuarios</p><p class="menu-card-desc">Ver y gestionar todos los usuarios</p></div>
        </button>
      </div>
    </template>

    <!-- LISTA DE USUARIOS (Abrir usuarios) -->
    <template v-else-if="vista === 'lista'">
      <div class="section-header">
        <h2 class="section-title">abrirUsuarios</h2>
        <div class="row-h">
          <input class="form-input search-input" v-model="filtro" placeholder="Buscar…" @keyup.enter="cargarUsuarios(filtro || undefined)" />
          <button class="btn-outline btn-sm" @click="cargarUsuarios(filtro || undefined)">Buscar</button>
          <button class="btn-primary btn-sm" @click="irCrear">crearUsuario</button>
        </div>
      </div>
      <div v-if="usuarios.length" class="user-list">
        <div v-for="u in usuarios" :key="u.id" class="user-card" @click="irDetalle(u)">
          <div class="user-avatar">{{ u.nombre.charAt(0).toUpperCase() }}</div>
          <div class="user-info">
            <p class="user-name">{{ u.nombre }}</p>
            <p class="user-email">{{ u.email }}</p>
          </div>
          <span class="role-badge" :class="'role-' + u.rol">{{ rolLabel(u.rol) }}</span>
        </div>
      </div>
      <div v-else class="empty-state"><p>No hay usuarios que coincidan.</p></div>
    </template>

    <!-- DETALLE USUARIO (Consultar usuario) -->
    <template v-else-if="vista === 'detalle'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← abrirUsuarios</button>
          <div class="row-h">
            <button v-if="sel?.rol === 'alumno'" class="btn-outline btn-sm" @click="irAsignaturas">Asignaturas</button>
            <button class="btn-primary btn-sm" @click="irEditar">editarUsuario</button>
          </div>
        </div>
        <div class="avatar-row">
          <div class="avatar-lg">{{ sel?.nombre?.charAt(0).toUpperCase() }}</div>
          <div>
            <p class="user-name-lg">{{ sel?.nombre }}</p>
            <span class="role-badge" :class="'role-' + sel?.rol">{{ rolLabel(sel?.rol) }}</span>
          </div>
        </div>
        <div class="detail-kv-grid">
          <div class="kv"><p class="kv-label">Email</p><p class="kv-val">{{ sel?.email }}</p></div>
          <div class="kv" v-if="sel?.numeroRegistro"><p class="kv-label">Nº Registro</p><p class="kv-val">{{ sel.numeroRegistro }}</p></div>
          <div class="kv" v-if="sel?.dni"><p class="kv-label">DNI</p><p class="kv-val">{{ sel.dni }}</p></div>
        </div>
        <button class="btn-del" @click="handleEliminar">Eliminar usuario</button>
      </div>
    </template>

    <!-- EDITAR USUARIO -->
    <template v-else-if="vista === 'editar'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← Cancelar</button>
          <button class="btn-primary" @click="handleEditar">Guardar</button>
        </div>
        <div class="frow"><label class="form-label">Nombre</label><input class="form-input" v-model="editForm.nombre" /></div>
        <div class="frow"><label class="form-label">Email</label><input class="form-input" type="email" v-model="editForm.email" /></div>
      </div>
    </template>

    <!-- ASIGNATURAS DE ALUMNO -->
    <template v-else-if="vista === 'asignaturas'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← Cancelar</button>
          <button class="btn-primary" @click="handleGuardarAsignaturas">Guardar asignaturas</button>
        </div>
        <p class="section-sub">Asignaturas matriculadas de <strong>{{ sel?.nombre }}</strong></p>
        <div v-for="(asigs, grado) in asignaturasPorGrado()" :key="grado" class="grado-group">
          <p class="grado-label">{{ grado }}</p>
          <div class="check-list">
            <label v-for="a in asigs" :key="a.id" class="check-row">
              <input type="checkbox" :value="a.id" v-model="asignaturasSeleccionadas" />
              <span class="check-nombre">{{ a.nombre }}</span>
              <span v-if="a.profesor" class="check-prof">{{ a.profesor.nombre }}</span>
            </label>
          </div>
        </div>
        <p v-if="!todasAsignaturas.length" class="empty-state">No hay asignaturas en el sistema.</p>
      </div>
    </template>

    <!-- CREAR USUARIO -->
    <template v-else-if="vista === 'crear'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← Cancelar</button>
          <button class="btn-primary" @click="handleCrear" :disabled="!crearForm.nombre || !crearForm.email">Crear</button>
        </div>
        <div class="frow"><label class="form-label">Nombre</label><input class="form-input" v-model="crearForm.nombre" placeholder="Nombre completo" /></div>
        <div class="frow"><label class="form-label">Email</label><input class="form-input" type="email" v-model="crearForm.email" placeholder="email@cgu.es" /></div>
        <div class="frow"><label class="form-label">Contraseña</label><input class="form-input" v-model="crearForm.password" /></div>
        <div class="frow">
          <label class="form-label">Rol</label>
          <select class="form-input" v-model="crearForm.rol">
            <option value="alumno">Alumno</option>
            <option value="profesor">Profesor</option>
            <option value="directorDeGrado">Director de Grado</option>
            <option value="secretaria">Secretaría Académica</option>
          </select>
        </div>
        <div class="frow" v-if="crearForm.rol === 'alumno'">
          <label class="form-label">Nº Registro <span class="dim">(opcional, se genera automáticamente)</span></label>
          <input class="form-input" v-model="crearForm.numeroRegistro" placeholder="REG-XXXXX" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page { max-width: 860px; margin: 0 auto; padding: 1.5rem 2rem 3rem; display: flex; flex-direction: column; gap: 1.25rem; }
.topbar { display: flex; justify-content: space-between; align-items: center; }
.breadcrumb { display: flex; align-items: center; gap: .4rem; font-size: .85rem; }
.bc-root { color: var(--text-primary); font-weight: 600; cursor: pointer; }
.bc-root:hover { text-decoration: underline; }
.bc-sep { color: var(--text-dim); }
.bc-item { color: var(--text-secondary); }
.user-chip { display: flex; align-items: center; gap: .6rem; }
.role-pill { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; background: var(--bg-input); color: var(--text-secondary); padding: 3px 8px; border-radius: 99px; }
.uname { font-size: .82rem; font-weight: 600; }
.section-title { font-size: 1.15rem; font-weight: 700; letter-spacing: -.01em; }
.section-sub { font-size: .88rem; color: var(--text-secondary); }
.section-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
.row-h { display: flex; gap: .6rem; align-items: center; }
.search-input { min-width: 200px; }
.menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: .85rem; }
.menu-card { display: flex; align-items: center; gap: 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; cursor: pointer; text-align: left; transition: all .15s; box-shadow: var(--shadow-sm); font-family: inherit; }
.menu-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.menu-card-icon { font-size: 1.5rem; flex-shrink: 0; }
.menu-card-title { font-size: .9rem; font-weight: 600; margin-bottom: 3px; }
.menu-card-desc { font-size: .78rem; color: var(--text-secondary); }
.user-list { display: flex; flex-direction: column; gap: .5rem; }
.user-card { display: flex; align-items: center; gap: .9rem; padding: .9rem 1.1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: all .15s; box-shadow: var(--shadow-sm); }
.user-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.user-avatar { width: 36px; height: 36px; border-radius: 99px; background: var(--bg-input); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: .9rem; color: var(--text-secondary); flex-shrink: 0; }
.user-info { flex: 1; min-width: 0; }
.user-name { font-size: .88rem; font-weight: 600; }
.user-email { font-size: .78rem; color: var(--text-secondary); }
.role-badge { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; padding: 3px 8px; border-radius: 99px; }
.role-alumno { background: #e8f4fd; color: #1a6fa8; }
.role-profesor { background: #fef3e8; color: #a06020; }
.role-directorDeGrado { background: #f0e8fe; color: #7020a0; }
.role-secretaria { background: #e8fef0; color: #208040; }
.avatar-row { display: flex; align-items: center; gap: 1rem; }
.avatar-lg { width: 52px; height: 52px; border-radius: 99px; background: var(--bg-input); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.3rem; color: var(--text-secondary); flex-shrink: 0; }
.user-name-lg { font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
.detail-card { padding: 1.75rem 2rem; display: flex; flex-direction: column; gap: 1rem; }
.detail-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
.back-btn { background: none; border: none; color: var(--text-secondary); font-size: .85rem; cursor: pointer; font-family: inherit; padding: 0; }
.back-btn:hover { color: var(--text-primary); }
.detail-kv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.kv { background: var(--bg-main); padding: .7rem .9rem; border-radius: var(--radius-sm); }
.kv-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-dim); margin-bottom: 4px; }
.kv-val { font-size: .9rem; }
.grado-group { display: flex; flex-direction: column; gap: .5rem; }
.grado-label { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-dim); border-bottom: 1px solid var(--border); padding-bottom: .4rem; }
.check-list { display: flex; flex-direction: column; gap: .4rem; }
.check-row { display: flex; align-items: center; gap: .6rem; padding: .5rem .75rem; border-radius: var(--radius-sm); cursor: pointer; transition: background .1s; }
.check-row:hover { background: var(--bg-main); }
.check-nombre { font-size: .88rem; flex: 1; }
.check-prof { font-size: .75rem; color: var(--text-secondary); }
.frow { display: flex; flex-direction: column; gap: .4rem; }
.dim { color: var(--text-secondary); font-size: .82rem; }
.btn-sm { font-size: .78rem; padding: .35rem .75rem; }
.btn-del { background: none; border: 1px solid var(--error); color: var(--error); padding: .5rem 1rem; border-radius: var(--radius-sm); cursor: pointer; font-size: .82rem; font-weight: 600; font-family: inherit; align-self: flex-start; margin-top: .5rem; }
.btn-del:hover { background: var(--error); color: #fff; }
.empty-state { text-align: center; padding: 3rem 2rem; color: var(--text-secondary); font-size: .9rem; }
.fb-ok { padding: .75rem 1rem; background: var(--success-bg); color: var(--success); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
.fb-ko { padding: .75rem 1rem; background: var(--error-bg); color: var(--error); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
button:disabled { opacity: .45; cursor: not-allowed; }
</style>
