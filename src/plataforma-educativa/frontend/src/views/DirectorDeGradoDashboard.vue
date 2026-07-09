<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuth } from '../services/authService';
import dispensaService from '../services/dispensaService';

const { state } = useAuth();
const uid = state.user?.id ?? '';

// Navegación: 'menu' | 'lista' | 'detalle' | 'editar'
const vista = ref<'menu' | 'lista' | 'detalle' | 'editar'>('menu');
const msg = ref(''); const err = ref('');
const ok = (m: string) => { msg.value = m; err.value = ''; };
const ko = (e: any) => { err.value = e.response?.data?.message ?? e.message; msg.value = ''; };

const dispensas = ref<any[]>([]);
const sel = ref<any>(null);
const editForm = reactive({ estado: 'APROBADA' as 'APROBADA' | 'RECHAZADA', observaciones: '' });

const cargarDispensas = async () => {
  try { dispensas.value = await dispensaService.consultarSolicitudDispensa({}); }
  catch (e: any) { ko(e); }
};

onMounted(cargarDispensas);

const irLista = () => {
  vista.value = 'lista';
};

const irDetalle = async (d: any) => {
  msg.value = ''; err.value = '';
  try { sel.value = await dispensaService.getDispensa(d.id); }
  catch { sel.value = d; }
  vista.value = 'detalle';
};

const irEditar = () => {
  editForm.estado = sel.value.estado === 'RECHAZADA' ? 'RECHAZADA' : 'APROBADA';
  editForm.observaciones = sel.value.observaciones ?? '';
  vista.value = 'editar';
};

const guardar = async () => {
  try {
    await dispensaService.guardarSolicitudDispensa(sel.value.id, { estado: editForm.estado, directorId: uid, observaciones: editForm.observaciones });
    ok(`Dispensa ${editForm.estado === 'APROBADA' ? 'aprobada' : 'rechazada'}.`);
    sel.value = { ...sel.value, estado: editForm.estado, observaciones: editForm.observaciones };
    vista.value = 'detalle';
    await cargarDispensas();
  } catch (e: any) { ko(e); }
};

const volver = () => { msg.value = ''; err.value = ''; vista.value = vista.value === 'editar' ? 'detalle' : vista.value === 'detalle' ? 'lista' : 'menu'; };
const estadoClass = (e: string) => e === 'APROBADA' ? 'tag-ok' : e === 'RECHAZADA' ? 'tag-ko' : 'tag-pend';
</script>

<template>
  <div class="page">
    <!-- Cabecera con breadcrumb -->
    <div class="topbar">
      <div class="breadcrumb">
        <span class="bc-root" @click="vista = 'menu'; sel = null">SISTEMA_DISPONIBLE</span>
        <template v-if="vista !== 'menu'">
          <span class="bc-sep">›</span>
          <span class="bc-item" :class="{ 'bc-root': vista === 'lista' }" @click="vista = 'lista'; sel = null">abrirDispensas</span>
        </template>
        <template v-if="vista === 'detalle' || vista === 'editar'">
          <span class="bc-sep">›</span>
          <span class="bc-item" :class="{ 'bc-root': vista === 'editar' }" @click="vista === 'editar' ? volver() : null">
            consultarSolicitudDispensa
          </span>
        </template>
        <template v-if="vista === 'editar'">
          <span class="bc-sep">›</span>
          <span class="bc-item">resolverSolicitudDispensa</span>
        </template>
      </div>
      <div class="user-chip">
        <span class="role-pill">Director de Grado</span>
        <span class="uname">{{ state.user?.nombre }}</span>
      </div>
    </div>

    <div v-if="msg" class="fb-ok">{{ msg }}</div>
    <div v-if="err" class="fb-ko">{{ err }}</div>

    <!-- VISTA: SISTEMA_DISPONIBLE -->
    <template v-if="vista === 'menu'">
      <h2 class="section-title">SISTEMA_DISPONIBLE</h2>
      <div class="menu-grid">
        <button class="menu-card" @click="irLista">
          <div><p class="menu-card-title">abrirDispensas</p><p class="menu-card-desc">Consultar y resolver las solicitudes de dispensa de los alumnos.</p></div>
        </button>
      </div>
    </template>

    <!-- VISTA: lista de dispensas (Abrir dispensas) -->
    <template v-else-if="vista === 'lista'">
      <div class="section-header">
        <button class="back-btn" @click="volver">← Volver</button>
        <h2 class="section-title">DISPENSAS_ABIERTO</h2>
        <span class="count-badge">{{ dispensas.length }}</span>
      </div>
      <div v-if="dispensas.length" class="disp-list">
        <div v-for="d in dispensas" :key="d.id" class="disp-card" @click="irDetalle(d)">
          <div class="disp-card-main">
            <p class="disp-alumno">{{ d.alumno?.nombre ?? '—' }}</p>
            <p class="disp-motivo">{{ d.motivo.slice(0, 80) }}{{ d.motivo.length > 80 ? '…' : '' }}</p>
          </div>
          <div class="disp-card-meta">
            <span :class="estadoClass(d.estado)">{{ d.estado }}</span>
            <span class="disp-fecha">{{ new Date(d.fechaSolicitud).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
      <p v-else class="dim">No hay solicitudes de dispensa.</p>
    </template>

    <!-- VISTA: detalle de dispensa (Consultar solicitud de dispensa) -->
    <template v-else-if="vista === 'detalle'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← abrirDispensas</button>
          <button class="btn-primary" @click="irEditar">resolverSolicitudDispensa</button>
        </div>
        <div class="detail-kv-grid">
          <div class="kv"><p class="kv-label">Alumno</p><p class="kv-val">{{ sel?.alumno?.nombre ?? '—' }}</p></div>
          <div class="kv"><p class="kv-label">Nº Registro</p><p class="kv-val">{{ sel?.alumno?.numeroRegistro ?? '—' }}</p></div>
          <div class="kv"><p class="kv-label">Estado</p><span :class="estadoClass(sel?.estado)">{{ sel?.estado }}</span></div>
          <div class="kv"><p class="kv-label">Fecha</p><p class="kv-val">{{ sel ? new Date(sel.fechaSolicitud).toLocaleDateString() : '' }}</p></div>
        </div>
        <div class="kv full"><p class="kv-label">Motivo</p><p class="kv-val">{{ sel?.motivo }}</p></div>
        <div v-if="sel?.observaciones" class="kv full"><p class="kv-label">Observaciones</p><p class="kv-val">{{ sel.observaciones }}</p></div>
        <div v-if="sel?.asignaturas?.length" class="kv full">
          <p class="kv-label">Asignaturas afectadas</p>
          <div class="tag-list">
            <span v-for="a in sel.asignaturas" :key="a.id" class="asig-tag">{{ a.nombre }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- VISTA: editar dispensa (Editar solicitud de dispensa) -->
    <template v-else-if="vista === 'editar'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← consultarSolicitudDispensa</button>
          <button class="btn-primary" @click="guardar">resolverSolicitudDispensa</button>
        </div>
        <div class="kv full"><p class="kv-label">Alumno</p><p class="kv-val">{{ sel?.alumno?.nombre ?? '—' }}</p></div>
        <div class="kv full"><p class="kv-label">Motivo</p><p class="kv-val">{{ sel?.motivo }}</p></div>
        <div class="frow">
          <label class="form-label">Resolución</label>
          <div class="radio-row">
            <label class="radio-item"><input type="radio" value="APROBADA" v-model="editForm.estado" /><span class="tag-ok">Aprobar</span></label>
            <label class="radio-item"><input type="radio" value="RECHAZADA" v-model="editForm.estado" /><span class="tag-ko">Rechazar</span></label>
          </div>
        </div>
        <div class="frow">
          <label class="form-label">Observaciones para el alumno</label>
          <textarea class="form-input" v-model="editForm.observaciones" rows="4" placeholder="Añade observaciones…" />
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
.bc-item.bc-root { color: var(--text-primary); font-weight: 600; }
.user-chip { display: flex; align-items: center; gap: .6rem; }
.role-pill { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; background: var(--bg-input); color: var(--text-secondary); padding: 3px 8px; border-radius: 99px; }
.uname { font-size: .82rem; font-weight: 600; color: var(--text-primary); }
.section-header { display: flex; align-items: baseline; gap: .75rem; }
.section-title { font-size: 1.2rem; font-weight: 700; letter-spacing: -.02em; }
.count-badge { font-size: .72rem; font-weight: 700; background: var(--bg-input); color: var(--text-secondary); padding: 2px 8px; border-radius: 99px; }

.menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: .85rem; margin-top: .5rem; }
.menu-card { display: flex; align-items: center; gap: 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; cursor: pointer; text-align: left; transition: all .15s; box-shadow: var(--shadow-sm); font-family: inherit; }
.menu-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.menu-card-title { font-size: .9rem; font-weight: 600; margin-bottom: 3px; }
.menu-card-desc { font-size: .78rem; color: var(--text-secondary); }

.disp-list { display: flex; flex-direction: column; gap: .6rem; }
.disp-card { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; padding: 1rem 1.25rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: all .15s; box-shadow: var(--shadow-sm); }
.disp-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.disp-card-main { flex: 1; min-width: 0; }
.disp-alumno { font-size: .9rem; font-weight: 600; margin-bottom: 3px; }
.disp-motivo { font-size: .8rem; color: var(--text-secondary); }
.disp-card-meta { display: flex; flex-direction: column; align-items: flex-end; gap: .4rem; flex-shrink: 0; }
.disp-fecha { font-size: .72rem; color: var(--text-dim); }
.detail-card { padding: 1.75rem 2rem; display: flex; flex-direction: column; gap: 1rem; }
.detail-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
.back-btn { background: none; border: none; color: var(--text-secondary); font-size: .85rem; cursor: pointer; font-family: inherit; padding: 0; }
.back-btn:hover { color: var(--text-primary); }
.detail-kv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.kv { background: var(--bg-main); padding: .7rem .9rem; border-radius: var(--radius-sm); }
.kv.full { grid-column: 1/-1; }
.kv-label { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-dim); margin-bottom: 4px; }
.kv-val { font-size: .9rem; }
.tag-list { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: .35rem; }
.asig-tag { font-size: .75rem; padding: 3px 9px; background: var(--bg-input); border-radius: 99px; color: var(--text-secondary); }
.frow { display: flex; flex-direction: column; gap: .4rem; }
.radio-row { display: flex; gap: 1.5rem; padding: .5rem 0; }
.radio-item { display: flex; align-items: center; gap: .5rem; cursor: pointer; }
.tag-pend { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--bg-input); color: var(--text-secondary); text-transform: uppercase; }
.tag-ok { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--success-bg); color: var(--success); text-transform: uppercase; }
.tag-ko { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--error-bg); color: var(--error); text-transform: uppercase; }
.dim { color: var(--text-secondary); font-size: .85rem; }
.fb-ok { padding: .75rem 1rem; background: var(--success-bg); color: var(--success); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
.fb-ko { padding: .75rem 1rem; background: var(--error-bg); color: var(--error); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
textarea.form-input { resize: vertical; min-height: 90px; }
</style>
