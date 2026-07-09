<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuth } from '../services/authService';
import dispensaService from '../services/dispensaService';
import academicService from '../services/academicService';

const { state } = useAuth();
const uid = state.user?.id ?? '';

// Navegación: 'menu' | 'lista' | 'detalle' | 'crear' | 'editar'
const vista = ref<'menu' | 'lista' | 'detalle' | 'crear' | 'editar'>('menu');
const msg = ref(''); const err = ref('');
const ok = (m: string) => { msg.value = m; err.value = ''; };
const ko = (e: any) => { err.value = e.response?.data?.message ?? e.message; msg.value = ''; };

const dispensas = ref<any[]>([]);
const sel = ref<any>(null);
const asignaturas = ref<any[]>([]);

const asignaturasDisponibles = computed(() => {
  const dispensadas = new Set(dispensas.value.flatMap(d => d.asignaturas?.map((a:any)=>a.id) || []));
  return asignaturas.value.filter(a => !dispensadas.has(a.id));
});

onMounted(async () => {
  try {
    const alumno = await academicService.getAlumno(uid);
    asignaturas.value = alumno.asignaturas || [];
  } catch {}
});

const cargarDispensas = async () => {
  try { dispensas.value = await dispensaService.consultarSolicitudDispensa({ alumnoId: uid }); }
  catch (e: any) { ko(e); }
};

const irLista = async () => {
  msg.value = ''; err.value = '';
  await cargarDispensas();
  vista.value = 'lista';
};

const irDetalle = async (d: any) => {
  msg.value = ''; err.value = '';
  try { sel.value = await dispensaService.getDispensa(d.id); }
  catch { sel.value = d; }
  vista.value = 'detalle';
};

// CU: crearSolicitudDispensa
const crearForm = reactive({ motivo: '', asignaturasIds: [] as string[] });
const handleCrear = async () => {
  try {
    await dispensaService.crearSolicitudDispensa({ alumnoId: uid, motivo: crearForm.motivo, secretariaId: '', sesionesIds: [], asignaturasIds: crearForm.asignaturasIds });
    ok('Solicitud enviada correctamente.');
    crearForm.motivo = ''; crearForm.asignaturasIds = [];
    await cargarDispensas();
    vista.value = 'lista';
  } catch (e: any) { ko(e); }
};

// CU: editarSolicitudDispensa
const editForm = reactive({ motivo: '' });
const irEditar = () => {
  editForm.motivo = sel.value.motivo;
  vista.value = 'editar';
};
const handleEditar = async () => {
  try {
    await dispensaService.editarSolicitudDispensa(sel.value.id, { motivo: editForm.motivo });
    ok('Solicitud actualizada.');
    sel.value = { ...sel.value, motivo: editForm.motivo };
    vista.value = 'detalle';
    await cargarDispensas();
  } catch (e: any) { ko(e); }
};

const volver = () => {
  msg.value = ''; err.value = '';
  if (vista.value === 'editar') vista.value = 'detalle';
  else if (vista.value === 'detalle') vista.value = 'lista';
  else vista.value = 'menu';
};

const estadoClass = (e: string) => e === 'APROBADA' ? 'tag-ok' : e === 'RECHAZADA' ? 'tag-ko' : 'tag-pend';
</script>

<template>
  <div class="page">
    <div class="topbar">
      <div class="breadcrumb">
        <span class="bc-root" @click="vista = 'menu'; sel = null">completarGestionDispensas</span>
        <template v-if="vista === 'lista' || vista === 'crear'">
          <span class="bc-sep">›</span>
          <span class="bc-item">{{ vista === 'crear' ? 'crearSolicitudDispensa' : 'abrirDispensas' }}</span>
        </template>
        <template v-if="vista === 'detalle' || vista === 'editar'">
          <span class="bc-sep">›</span>
          <span class="bc-root" @click="vista = 'lista'">abrirDispensas</span>
          <span class="bc-sep">›</span>
          <span class="bc-item">{{ vista === 'editar' ? 'editarSolicitudDispensa' : 'consultarSolicitudDispensa' }}</span>
        </template>
      </div>
      <div class="user-chip">
        <span class="role-pill">Alumno</span>
        <span class="uname">{{ state.user?.nombre }}</span>
      </div>
    </div>

    <div v-if="msg" class="fb-ok">{{ msg }}</div>
    <div v-if="err" class="fb-ko">{{ err }}</div>

    <!-- MENÚ PRINCIPAL -->
    <template v-if="vista === 'menu'">
      <h2 class="section-title">SISTEMA_DISPONIBLE</h2>
      <div class="menu-grid">
        <button class="menu-card" @click="irLista">
          <div>
            <p class="menu-card-title">abrirDispensas</p>
            <p class="menu-card-desc">Consulta el estado de tus solicitudes</p>
          </div>
        </button>
      </div>
    </template>

    <!-- LISTA DE DISPENSAS (Abrir dispensas) -->
    <template v-else-if="vista === 'lista'">
      <div class="section-header">
        <h2 class="section-title">DISPENSAS_ABIERTO</h2>
        <button class="btn-outline btn-sm" @click="vista = 'crear'">crearSolicitudDispensa</button>
      </div>
      <div v-if="dispensas.length" class="disp-list">
        <div v-for="d in dispensas" :key="d.id" class="disp-card" @click="irDetalle(d)">
          <div class="disp-card-main">
            <p class="disp-motivo">{{ d.motivo.slice(0, 90) }}{{ d.motivo.length > 90 ? '…' : '' }}</p>
          </div>
          <div class="disp-card-meta">
            <span :class="estadoClass(d.estado)">{{ d.estado }}</span>
            <span class="disp-fecha">{{ new Date(d.fechaSolicitud).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
      <div v-else class="empty-state"><p>Aún no tienes solicitudes de dispensa.</p></div>
    </template>

    <!-- DETALLE (Consultar estado de dispensa) -->
    <template v-else-if="vista === 'detalle'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← abrirDispensas</button>
          <button v-if="sel?.estado === 'PENDIENTE'" class="btn-primary btn-sm" @click="irEditar">editarSolicitudDispensa</button>
        </div>
        <div class="detail-kv-grid">
          <div class="kv"><p class="kv-label">Estado</p><span :class="estadoClass(sel?.estado)">{{ sel?.estado }}</span></div>
          <div class="kv"><p class="kv-label">Fecha solicitud</p><p class="kv-val">{{ sel ? new Date(sel.fechaSolicitud).toLocaleDateString() : '' }}</p></div>
        </div>
        <div class="kv full"><p class="kv-label">Motivo</p><p class="kv-val">{{ sel?.motivo }}</p></div>
        <div v-if="sel?.observaciones" class="kv full obs-block">
          <p class="kv-label">Observaciones del director</p>
          <p class="kv-val">{{ sel.observaciones }}</p>
        </div>
        <div v-if="sel?.asignaturas?.length" class="kv full">
          <p class="kv-label">Asignaturas afectadas</p>
          <div class="tag-list">
            <span v-for="a in sel.asignaturas" :key="a.id" class="asig-tag">{{ a.nombre }}</span>
          </div>
        </div>
        <p v-if="sel?.estado === 'PENDIENTE'" class="help-text">Solo puedes editar solicitudes en estado Pendiente.</p>
      </div>
    </template>

    <!-- CREAR SOLICITUD -->
    <template v-else-if="vista === 'crear'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← Cancelar</button>
          <button class="btn-primary" @click="handleCrear" :disabled="!crearForm.motivo.trim()">Enviar solicitud</button>
        </div>
        <div class="frow">
          <label class="form-label">Motivo de la dispensa</label>
          <textarea class="form-input" v-model="crearForm.motivo" rows="4" placeholder="Describe el motivo por el que solicitas la dispensa…" />
        </div>
        <div v-if="asignaturasDisponibles.length" class="frow">
          <label class="form-label">Asignaturas afectadas</label>
          <div class="check-list">
            <label v-for="a in asignaturasDisponibles" :key="a.id" class="check-row">
              <input type="checkbox" :value="a.id" v-model="crearForm.asignaturasIds" />
              <span>{{ a.nombre }}</span>
            </label>
          </div>
        </div>
        <div v-else class="empty-state" style="padding: 1rem 0;">
          <p>No tienes asignaturas disponibles para solicitar dispensa.</p>
        </div>
      </div>
    </template>

    <!-- EDITAR SOLICITUD -->
    <template v-else-if="vista === 'editar'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← Cancelar</button>
          <button class="btn-primary" @click="handleEditar" :disabled="!editForm.motivo.trim()">Guardar cambios</button>
        </div>
        <div class="frow">
          <label class="form-label">Motivo</label>
          <textarea class="form-input" v-model="editForm.motivo" rows="4" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page { max-width: 780px; margin: 0 auto; padding: 1.5rem 2rem 3rem; display: flex; flex-direction: column; gap: 1.25rem; }
.topbar { display: flex; justify-content: space-between; align-items: center; }
.breadcrumb { display: flex; align-items: center; gap: .4rem; font-size: .85rem; }
.bc-root { color: var(--text-primary); font-weight: 600; cursor: pointer; }
.bc-root:hover { text-decoration: underline; }
.bc-sep { color: var(--text-dim); }
.bc-item { color: var(--text-secondary); }
.user-chip { display: flex; align-items: center; gap: .6rem; }
.role-pill { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; background: var(--bg-input); color: var(--text-secondary); padding: 3px 8px; border-radius: 99px; }
.uname { font-size: .82rem; font-weight: 600; }
.section-header { display: flex; justify-content: space-between; align-items: center; }
.section-title { font-size: 1.15rem; font-weight: 700; letter-spacing: -.01em; }
.menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: .85rem; margin-top: .25rem; }
.menu-card { display: flex; align-items: center; gap: 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; cursor: pointer; text-align: left; transition: all .15s; box-shadow: var(--shadow-sm); font-family: inherit; }
.menu-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.menu-card-icon { font-size: 1.5rem; flex-shrink: 0; }
.menu-card-title { font-size: .9rem; font-weight: 600; margin-bottom: 3px; }
.menu-card-desc { font-size: .78rem; color: var(--text-secondary); }
.disp-list { display: flex; flex-direction: column; gap: .6rem; }
.disp-card { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; padding: 1rem 1.25rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: all .15s; box-shadow: var(--shadow-sm); }
.disp-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.disp-card-main { flex: 1; min-width: 0; }
.disp-motivo { font-size: .88rem; }
.disp-card-meta { display: flex; flex-direction: column; align-items: flex-end; gap: .4rem; flex-shrink: 0; }
.disp-fecha { font-size: .72rem; color: var(--text-dim); }
.detail-card { padding: 1.75rem 2rem; display: flex; flex-direction: column; gap: 1rem; }
.detail-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
.back-btn { background: none; border: none; color: var(--text-secondary); font-size: .85rem; cursor: pointer; font-family: inherit; padding: 0; }
.back-btn:hover { color: var(--text-primary); }
.detail-kv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.kv { background: var(--bg-main); padding: .7rem .9rem; border-radius: var(--radius-sm); }
.kv.full { grid-column: 1/-1; }
.obs-block { border-left: 3px solid var(--border-hover); }
.kv-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-dim); margin-bottom: 4px; }
.kv-val { font-size: .9rem; }
.tag-list { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: .35rem; }
.asig-tag { font-size: .75rem; padding: 3px 9px; background: var(--bg-input); border-radius: 99px; color: var(--text-secondary); }
.frow { display: flex; flex-direction: column; gap: .4rem; }
.check-list { display: flex; flex-direction: column; gap: .4rem; }
.check-row { display: flex; align-items: center; gap: .6rem; font-size: .9rem; cursor: pointer; }
.help-text { font-size: .78rem; color: var(--text-dim); font-style: italic; }
.tag-pend { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--bg-input); color: var(--text-secondary); text-transform: uppercase; }
.tag-ok { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--success-bg); color: var(--success); text-transform: uppercase; }
.tag-ko { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--error-bg); color: var(--error); text-transform: uppercase; }
.btn-sm { font-size: .78rem; padding: .35rem .75rem; }
.empty-state { text-align: center; padding: 3rem 2rem; color: var(--text-secondary); font-size: .9rem; }
.fb-ok { padding: .75rem 1rem; background: var(--success-bg); color: var(--success); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
.fb-ko { padding: .75rem 1rem; background: var(--error-bg); color: var(--error); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
textarea.form-input { resize: vertical; min-height: 90px; }
button:disabled { opacity: .45; cursor: not-allowed; }
</style>
