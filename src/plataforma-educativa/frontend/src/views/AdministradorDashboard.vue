<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useAuth } from '../services/authService';
import usuarioService from '../services/usuarioService';

const { state } = useAuth();
const panel = ref<string | null>(null);
const toggle = (c: string) => { panel.value = panel.value === c ? null : c; };
const msg = ref(''); const err = ref('');
const feedback = (ok: string) => { msg.value = ok; err.value = ''; };
const ferr = (e: any) => { err.value = e.response?.data?.message ?? e.message; msg.value = ''; };

// Crear Usuario
const crearForm = reactive({ nombre: '', email: '', password: 'password1', rol: 'alumno' });
const handleCrear = async () => {
  try { await usuarioService.crearUsuario({ ...crearForm }); feedback('Usuario creado correctamente.'); Object.assign(crearForm, { nombre: '', email: '', password: 'password1', rol: 'alumno' }); }
  catch (e: any) { ferr(e); }
};

// Consultar Usuario
const filtro = ref(''); const usuarios = ref<any[]>([]);
const handleConsultar = async () => {
  try { usuarios.value = await usuarioService.consultarUsuario(filtro.value || undefined); }
  catch (e: any) { ferr(e); }
};

// Editar Usuario
const editSearch = ref(''); const editLista = ref<any[]>([]); const editSel = ref<any>(null);
const editForm = reactive({ nombre: '', email: '' });
const buscarParaEditar = async () => {
  try { editLista.value = await usuarioService.consultarUsuario(editSearch.value || undefined); }
  catch (e: any) { ferr(e); }
};
watch(panel, async (v) => { if (v === 'editar') { try { editLista.value = await usuarioService.consultarUsuario(); } catch {} } });
const selEditar = (u: any) => { editSel.value = u; editForm.nombre = u.nombre; editForm.email = u.email; };
const handleEditar = async () => {
  if (!editSel.value) return;
  try { await usuarioService.editarUsuario(editSel.value.id, editForm); feedback('Usuario actualizado.'); editSel.value = null; editLista.value = await usuarioService.consultarUsuario(); }
  catch (e: any) { ferr(e); }
};
const handleEliminar = async () => {
  if (!editSel.value) return;
  try { await usuarioService.deleteUsuario(editSel.value.id); feedback('Usuario eliminado.'); editSel.value = null; editLista.value = await usuarioService.consultarUsuario(); }
  catch (e: any) { ferr(e); }
};
</script>

<template>
  <div class="page">
    <div class="hero card-base">
      <p class="role-label">Administrador</p>
      <h1>{{ state.user?.nombre }}</h1>
    </div>

    <p class="section-lbl">Casos de uso</p>

    <div class="grid">
      <button :class="['cu-btn', { active: panel === 'crear' }]" @click="toggle('crear')">Crear Usuario</button>
      <button :class="['cu-btn', { active: panel === 'consultar' }]" @click="toggle('consultar')">Consultar Usuario</button>
      <button :class="['cu-btn', { active: panel === 'editar' }]" @click="toggle('editar')">Editar Usuario</button>
    </div>

    <div v-if="msg" class="ok">{{ msg }}</div>
    <div v-if="err" class="ko">{{ err }}</div>

    <!-- Crear Usuario -->
    <div v-if="panel === 'crear'" class="panel card-base">
      <h2 class="panel-h">Crear Usuario</h2>
      <div class="frow"><label class="form-label">Nombre</label><input class="form-input" v-model="crearForm.nombre" placeholder="Nombre" /></div>
      <div class="frow"><label class="form-label">Email</label><input class="form-input" v-model="crearForm.email" type="email" placeholder="email@cgu.es" /></div>
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
      <button class="btn-primary" @click="handleCrear">Crear</button>
    </div>

    <!-- Consultar Usuario -->
    <div v-if="panel === 'consultar'" class="panel card-base">
      <h2 class="panel-h">Consultar Usuario</h2>
      <div class="row-h">
        <input class="form-input" v-model="filtro" placeholder="Buscar por nombre o email..." @keyup.enter="handleConsultar" />
        <button class="btn-primary" @click="handleConsultar">Buscar</button>
      </div>
      <table v-if="usuarios.length" class="table-corp">
        <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th></tr></thead>
        <tbody>
          <tr v-for="u in usuarios" :key="u.id">
            <td>{{ u.nombre }}</td><td>{{ u.email }}</td><td>{{ u.rol }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else-if="usuarios.length === 0 && filtro" class="dim">Sin resultados.</p>
    </div>

    <!-- Editar Usuario -->
    <div v-if="panel === 'editar'" class="panel card-base">
      <h2 class="panel-h">Editar Usuario</h2>
      <div class="row-h">
        <input class="form-input" v-model="editSearch" placeholder="Buscar usuario..." @keyup.enter="buscarParaEditar" />
        <button class="btn-primary" @click="buscarParaEditar">Buscar</button>
      </div>
      <div v-if="editLista.length && !editSel" class="lista">
        <div v-for="u in editLista" :key="u.id" class="list-item" @click="selEditar(u)">
          <span>{{ u.nombre }}</span><span class="dim">{{ u.rol }}</span>
        </div>
      </div>
      <template v-if="editSel">
        <div class="frow"><label class="form-label">Nombre</label><input class="form-input" v-model="editForm.nombre" /></div>
        <div class="frow"><label class="form-label">Email</label><input class="form-input" v-model="editForm.email" type="email" /></div>
        <div class="row-h">
          <button class="btn-primary" @click="handleEditar">Guardar</button>
          <button class="btn-outline" @click="editSel = null">Cancelar</button>
          <button class="btn-del" @click="handleEliminar">Eliminar</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 860px; margin: 0 auto; padding: 2.5rem 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
.hero { padding: 2rem 2.5rem; }
.role-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-secondary); margin-bottom: 4px; }
h1 { font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; }
.section-lbl { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--text-dim); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: .75rem; }
.cu-btn { background: var(--bg-card); border: 1px solid var(--border); color: var(--text-primary); padding: 1rem 1.4rem; font-size: .88rem; font-weight: 500; border-radius: var(--radius-md); cursor: pointer; text-align: left; transition: all .15s; box-shadow: var(--shadow-sm); font-family: inherit; }
.cu-btn:hover { background: var(--bg-main); border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.cu-btn.active { border-color: var(--text-primary); background: var(--bg-main); }
.panel { padding: 1.75rem 2rem; display: flex; flex-direction: column; gap: 1rem; }
.panel-h { font-size: 1rem; font-weight: 700; color: var(--text-primary); border-bottom: 1px solid var(--border); padding-bottom: .75rem; }
.frow { display: flex; flex-direction: column; gap: .35rem; }
.row-h { display: flex; gap: .75rem; align-items: flex-end; }
.lista { display: flex; flex-direction: column; gap: .5rem; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: .75rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; transition: background .1s; }
.list-item:hover { background: var(--bg-main); }
.dim { color: var(--text-secondary); font-size: .82rem; }
.ok { padding: .75rem 1rem; background: var(--success-bg); color: var(--success); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
.ko { padding: .75rem 1rem; background: var(--error-bg); color: var(--error); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
.btn-del { background: var(--error-bg); border: 1px solid var(--error); color: var(--error); padding: .5rem 1rem; border-radius: var(--radius-sm); cursor: pointer; font-size: .82rem; font-weight: 600; font-family: inherit; margin-left: auto; }
.btn-del:hover { background: var(--error); color: #fff; }
</style>
