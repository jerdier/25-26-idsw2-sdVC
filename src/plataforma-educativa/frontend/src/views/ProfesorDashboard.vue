<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuth } from '../services/authService';
import academicService from '../services/academicService';
import attendanceService from '../services/attendanceService';
import dispensaService from '../services/dispensaService';

const { state } = useAuth();
const uid = state.user?.id ?? '';

// Navegación principal: 'menu' | 'sesiones' | 'sesion-detalle' | 'asistencia' | 'crear-sesion' | 'alumnos' | 'alumno-detalle' | 'dispensas' | 'dispensa-detalle'
const vista = ref<string>('menu');
const msg = ref(''); const err = ref('');
const ok = (m: string) => { msg.value = m; err.value = ''; };
const ko = (e: any) => { err.value = e.response?.data?.message ?? e.message; msg.value = ''; };

const asignaturas = ref<any[]>([]);
const sesiones = ref<any[]>([]);
const sesionSel = ref<any>(null);
const editSesionForm = reactive({ aula: '', duracion: '' });
const editandoSesion = ref(false);

const listaAlumnos = ref<any[]>([]);
const alumnoSel = ref<any>(null);
const alumnoAsistencias = ref<any[]>([]);

const dispensas = ref<any[]>([]);
const dispensaSel = ref<any>(null);

// Registrar asistencia
const sesAlumnos = ref<any[]>([]);
const asistencia = ref<Record<string, boolean>>({});

const crearForm = reactive({ asignaturaId: '', aula: '', duracion: '60' });

onMounted(async () => {
  try {
    asignaturas.value = await academicService.getTeacherAsignaturas(uid);
  } catch {}
});

const recargarSesiones = async () => {
  sesiones.value = await academicService.getTeacherSessions(uid);
};

// ──────── SESIONES ────────
const irSesiones = async () => {
  msg.value = ''; err.value = '';
  try { await recargarSesiones(); vista.value = 'sesiones'; }
  catch (e: any) { ko(e); }
};

const irDetalleSesion = (s: any) => {
  msg.value = ''; err.value = '';
  sesionSel.value = s;
  editandoSesion.value = false;
  vista.value = 'sesion-detalle';
};

const iniciarEditarSesion = () => {
  editSesionForm.aula = sesionSel.value.aula ?? '';
  editSesionForm.duracion = String(sesionSel.value.duracion ?? 60);
  editandoSesion.value = true;
};

const handleEditarSesion = async () => {
  try {
    const upd = await academicService.editarSesionClase(sesionSel.value.id, { aula: editSesionForm.aula, duracion: Number(editSesionForm.duracion) });
    ok('Sesión actualizada.');
    sesionSel.value = { ...sesionSel.value, ...upd };
    editandoSesion.value = false;
    await recargarSesiones();
  } catch (e: any) { ko(e); }
};

const handleCerrarSesion = async () => {
  if (!confirm('¿Cerrar esta sesión? No podrás volver a registrar asistencia en ella.')) return;
  try {
    await academicService.cerrarSesionClase(sesionSel.value.id);
    ok('Sesión cerrada.');
    sesionSel.value = { ...sesionSel.value, estado: 'CERRADA' };
    await recargarSesiones();
  } catch (e: any) { ko(e); }
};

const handleEliminarSesion = async () => {
  if (!confirm('¿Eliminar esta sesión? Se borrarán todos sus registros de asistencia.')) return;
  try {
    await academicService.eliminarSesionClase(sesionSel.value.id);
    ok('Sesión eliminada.');
    vista.value = 'sesiones';
    sesionSel.value = null;
    await recargarSesiones();
  } catch (e: any) { ko(e); }
};

// CU: crearSesionClase
const irCrearSesion = () => {
  msg.value = ''; err.value = '';
  crearForm.asignaturaId = asignaturas.value[0]?.id ?? '';
  crearForm.aula = ''; crearForm.duracion = '60';
  vista.value = 'crear-sesion';
};

const handleCrearSesion = async () => {
  if (!crearForm.asignaturaId) { ko({ message: 'Selecciona una asignatura.' }); return; }
  try {
    await academicService.crearSesionClase(crearForm.asignaturaId, new Date().toISOString(), crearForm.aula || undefined, Number(crearForm.duracion));
    ok('Sesión creada.');
    await recargarSesiones();
    vista.value = 'sesiones';
  } catch (e: any) { ko(e); }
};

// CU: registrarTomaAsistencia
const irAsistencia = async (s: any) => {
  msg.value = ''; err.value = '';
  sesionSel.value = s;
  try {
    sesAlumnos.value = await academicService.getSessionAlumnos(s.id);
    asistencia.value = {};
    sesAlumnos.value.forEach((a: any) => { asistencia.value[a.id] = !a.dispensado; });
    vista.value = 'asistencia';
  } catch (e: any) { ko(e); }
};

const handleRegistrarAsistencia = async () => {
  try {
    for (const a of sesAlumnos.value.filter((x: any) => !x.dispensado)) {
      await attendanceService.registrarTomaAsistencia({ sesionId: sesionSel.value.id, alumnoId: a.id, profesorId: uid, presente: asistencia.value[a.id] ?? false });
    }
    ok('Asistencia registrada correctamente.');
    vista.value = 'sesion-detalle';
  } catch (e: any) { ko(e); }
};

// CU: exportarHistorialAsistencias
const handleExportar = async () => {
  try {
    const blob = await attendanceService.exportarHistorialAsistencias(sesionSel.value.id, 'CSV');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `historial-${sesionSel.value.id}.csv`; a.click();
    ok('Descarga iniciada.');
  } catch (e: any) { ko(e); }
};

// ──────── ALUMNOS ────────
const irAlumnos = async () => {
  msg.value = ''; err.value = '';
  try { listaAlumnos.value = await academicService.getTeacherAlumnos(uid); vista.value = 'alumnos'; }
  catch (e: any) { ko(e); }
};

const irDetalleAlumno = async (a: any) => {
  msg.value = ''; err.value = '';
  alumnoSel.value = a;
  try {
    const [det, asis] = await Promise.all([
      academicService.getAlumno(a.id),
      attendanceService.getAttendanceByAlumno(a.id)
    ]);
    alumnoSel.value = { ...a, ...det };
    alumnoAsistencias.value = asis;
  } catch {}
  vista.value = 'alumno-detalle';
};

// ──────── DISPENSAS ────────
const irDispensas = async () => {
  msg.value = ''; err.value = '';
  try { dispensas.value = await dispensaService.getDispensasByProfesor(uid); vista.value = 'dispensas'; }
  catch (e: any) { ko(e); }
};

const irDetalleDispensa = async (d: any) => {
  msg.value = ''; err.value = '';
  try { dispensaSel.value = await dispensaService.getDispensa(d.id); }
  catch { dispensaSel.value = d; }
  vista.value = 'dispensa-detalle';
};

// ──────── NAVEGACIÓN ────────
const volver = () => {
  msg.value = ''; err.value = '';
  const mapa: Record<string, string> = {
    'sesiones': 'menu', 'crear-sesion': 'menu', 'sesion-detalle': 'sesiones',
    'asistencia': 'sesion-detalle', 'alumnos': 'menu', 'alumno-detalle': 'alumnos',
    'dispensas': 'menu', 'dispensa-detalle': 'dispensas'
  };
  if (editandoSesion.value) { editandoSesion.value = false; return; }
  vista.value = mapa[vista.value] ?? 'menu';
};

const estadoClass = (e: string) => e === 'APROBADA' ? 'tag-ok' : e === 'RECHAZADA' ? 'tag-ko' : 'tag-pend';
const sesionClass = (e: string) => e === 'CERRADA' ? 'tag-ko' : 'tag-activa';
const formatFecha = (f: string) => new Date(f).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const formatHora = (f: string) => new Date(f).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

const presentes = () => sesAlumnos.value.filter((a: any) => !a.dispensado && asistencia.value[a.id]).length;
const dispensados = () => sesAlumnos.value.filter((a: any) => a.dispensado).length;
</script>

<template>
  <div class="page">
    <!-- TOPBAR -->
    <div class="topbar">
      <div class="breadcrumb">
        <span class="bc-root" @click="vista = 'menu'">SISTEMA_DISPONIBLE</span>
        <template v-if="vista === 'sesiones' || vista === 'crear-sesion'">
          <span class="bc-sep">›</span><span class="bc-item">{{ vista === 'crear-sesion' ? 'crearSesionClase' : 'abrirAsistencias' }}</span>
        </template>
        <template v-if="vista === 'sesion-detalle' || vista === 'asistencia'">
          <span class="bc-sep">›</span>
          <span class="bc-root" @click="vista = 'sesiones'">abrirAsistencias</span>
          <span class="bc-sep">›</span>
          <span :class="vista === 'asistencia' ? 'bc-root' : 'bc-item'" @click="vista === 'asistencia' ? (vista = 'sesion-detalle') : null">
            {{ sesionSel?.asignatura?.nombre }}
          </span>
          <template v-if="vista === 'asistencia'"><span class="bc-sep">›</span><span class="bc-item">registrarTomaAsistencia</span></template>
        </template>
        <template v-if="vista === 'alumnos' || vista === 'alumno-detalle'">
          <span class="bc-sep">›</span>
          <span :class="vista === 'alumno-detalle' ? 'bc-root' : 'bc-item'" @click="vista === 'alumno-detalle' ? (vista = 'alumnos') : null">abrirAlumnos</span>
          <template v-if="vista === 'alumno-detalle'"><span class="bc-sep">›</span><span class="bc-item">{{ alumnoSel?.nombre }}</span></template>
        </template>
        <template v-if="vista === 'dispensas' || vista === 'dispensa-detalle'">
          <span class="bc-sep">›</span>
          <span :class="vista === 'dispensa-detalle' ? 'bc-root' : 'bc-item'" @click="vista === 'dispensa-detalle' ? (vista = 'dispensas') : null">abrirDispensas</span>
          <template v-if="vista === 'dispensa-detalle'"><span class="bc-sep">›</span><span class="bc-item">consultarSolicitudDispensa</span></template>
        </template>
      </div>
      <div class="user-chip">
        <span class="role-pill">Profesor</span>
        <span class="uname">{{ state.user?.nombre }}</span>
      </div>
    </div>

    <div v-if="msg" class="fb-ok">{{ msg }}</div>
    <div v-if="err" class="fb-ko">{{ err }}</div>

    <!-- MENÚ PRINCIPAL -->
    <template v-if="vista === 'menu'">
      <h2 class="section-title">SISTEMA_DISPONIBLE</h2>
      <div class="menu-grid">
        <button class="menu-card" @click="irAlumnos">
          <div><p class="menu-card-title">abrirAlumnos</p><p class="menu-card-desc">Consulta el perfil y asistencia de tus alumnos</p></div>
        </button>
        <button class="menu-card" @click="irSesiones">
          <div><p class="menu-card-title">abrirAsistencias</p><p class="menu-card-desc">Gestiona tus sesiones y registra asistencia</p></div>
        </button>
        <button class="menu-card" @click="irDispensas">
          <div><p class="menu-card-title">abrirDispensas</p><p class="menu-card-desc">Consulta las solicitudes de dispensa activas</p></div>
        </button>
      </div>
    </template>

    <!-- LISTA DE SESIONES (Abrir sesiones) -->
    <template v-else-if="vista === 'sesiones'">
      <div class="section-header">
        <h2 class="section-title">ASISTENCIAS_ABIERTO</h2>
        <button class="btn-primary btn-sm" @click="irCrearSesion">crearSesionClase</button>
      </div>
      <div v-if="sesiones.length" class="sesion-list">
        <div v-for="s in sesiones" :key="s.id" class="sesion-card" @click="irDetalleSesion(s)">
          <div class="sesion-card-main">
            <p class="sesion-asig">{{ s.asignatura?.nombre }}</p>
            <p class="sesion-fecha">{{ formatFecha(s.fecha) }} · {{ formatHora(s.fecha) }}</p>
            <p v-if="s.aula" class="sesion-meta">Aula {{ s.aula }} · {{ s.duracion }} min</p>
          </div>
          <span :class="sesionClass(s.estado)">{{ s.estado }}</span>
        </div>
      </div>
      <div v-else class="empty-state"><p>Aún no tienes sesiones creadas.</p></div>
    </template>

    <!-- DETALLE SESIÓN -->
    <template v-else-if="vista === 'sesion-detalle'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← abrirAsistencias</button>
          <div class="row-h" v-if="!editandoSesion">
            <button class="btn-del-sm" @click="handleEliminarSesion">Eliminar</button>
            <button v-if="sesionSel.estado !== 'CERRADA'" class="btn-outline btn-sm" @click="handleCerrarSesion">Cerrar sesión</button>
            <button class="btn-outline btn-sm" @click="handleExportar">exportarHistorialAsistencias</button>
            <button v-if="sesionSel.estado !== 'CERRADA'" class="btn-primary btn-sm" @click="irAsistencia(sesionSel)">registrarTomaAsistencia</button>
          </div>
        </div>

        <template v-if="!editandoSesion">
          <div class="sesion-title-row">
            <h3 class="sesion-title-big">{{ sesionSel.asignatura?.nombre }}</h3>
            <span :class="sesionClass(sesionSel.estado)">{{ sesionSel.estado }}</span>
          </div>
          <div class="detail-kv-grid">
            <div class="kv"><p class="kv-label">Fecha</p><p class="kv-val">{{ formatFecha(sesionSel.fecha) }}</p></div>
            <div class="kv"><p class="kv-label">Hora</p><p class="kv-val">{{ formatHora(sesionSel.fecha) }}</p></div>
            <div class="kv"><p class="kv-label">Aula</p><p class="kv-val">{{ sesionSel.aula ?? '—' }}</p></div>
            <div class="kv"><p class="kv-label">Duración</p><p class="kv-val">{{ sesionSel.duracion ?? 60 }} min</p></div>
          </div>
          <button class="edit-inline-btn" @click="iniciarEditarSesion">✏️ Editar datos de la sesión</button>
        </template>

        <template v-else>
          <p class="edit-mode-label">Editando sesión</p>
          <div class="frow"><label class="form-label">Aula</label><input class="form-input" v-model="editSesionForm.aula" placeholder="Ej. A101" /></div>
          <div class="frow"><label class="form-label">Duración (minutos)</label><input class="form-input" type="number" v-model="editSesionForm.duracion" /></div>
          <div class="row-h">
            <button class="btn-primary" @click="handleEditarSesion">Guardar cambios</button>
            <button class="btn-outline" @click="editandoSesion = false">Cancelar</button>
          </div>
        </template>
      </div>
    </template>

    <!-- REGISTRAR ASISTENCIA -->
    <template v-else-if="vista === 'asistencia'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← Volver</button>
          <div class="row-h">
            <span class="asis-counter">{{ presentes() }}/{{ sesAlumnos.length - dispensados() }} presentes</span>
            <button class="btn-primary" @click="handleRegistrarAsistencia">Guardar asistencia</button>
          </div>
        </div>
        <h3 class="sesion-title-big">{{ sesionSel?.asignatura?.nombre }}</h3>
        <p class="dim">{{ formatFecha(sesionSel?.fecha) }}</p>
        <div v-if="sesAlumnos.length" class="asis-list">
          <div v-for="a in sesAlumnos" :key="a.id" class="asis-row" :class="{ dispensado: a.dispensado }">
            <div class="asis-alumno">
              <p class="asis-nombre">{{ a.nombre }}</p>
              <p class="asis-reg">{{ a.numeroRegistro }}</p>
            </div>
            <div class="asis-right">
              <span v-if="a.dispensado" class="tag-disp">DISPENSADO</span>
              <label v-else class="toggle-wrap">
                <input type="checkbox" class="toggle-cb" v-model="asistencia[a.id]" />
                <span class="toggle-track"><span class="toggle-thumb"></span></span>
                <span class="toggle-label">{{ asistencia[a.id] ? 'Presente' : 'Ausente' }}</span>
              </label>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">No hay alumnos matriculados en esta sesión.</p>
        <p v-if="dispensados() > 0" class="help-text">Los alumnos dispensados no necesitan registro de asistencia.</p>
      </div>
    </template>

    <!-- CREAR SESIÓN -->
    <template v-else-if="vista === 'crear-sesion'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← Cancelar</button>
          <button class="btn-primary" @click="handleCrearSesion" :disabled="!crearForm.asignaturaId">Crear sesión</button>
        </div>
        <div class="frow">
          <label class="form-label">Asignatura</label>
          <select class="form-input" v-model="crearForm.asignaturaId">
            <option value="">— selecciona —</option>
            <option v-for="a in asignaturas" :key="a.id" :value="a.id">{{ a.nombre }} ({{ a.grado?.nombre }})</option>
          </select>
        </div>
        <div class="frow"><label class="form-label">Aula <span class="dim">(opcional)</span></label><input class="form-input" v-model="crearForm.aula" placeholder="Ej. A101" /></div>
        <div class="frow"><label class="form-label">Duración (minutos)</label><input class="form-input" type="number" v-model="crearForm.duracion" /></div>
        <p class="help-text">La sesión se creará con la fecha y hora actuales.</p>
      </div>
    </template>

    <!-- LISTA DE ALUMNOS (Abrir alumnos) -->
    <template v-else-if="vista === 'alumnos'">
      <div class="section-header">
        <h2 class="section-title">ALUMNOS_ABIERTO</h2>
        <span class="count-badge">{{ listaAlumnos.length }}</span>
      </div>
      <div v-if="listaAlumnos.length" class="user-list">
        <div v-for="a in listaAlumnos" :key="a.id" class="user-card" @click="irDetalleAlumno(a)">
          <div class="user-avatar">{{ a.nombre.charAt(0).toUpperCase() }}</div>
          <div class="user-info">
            <p class="user-name">{{ a.nombre }}</p>
            <p class="user-email">{{ a.numeroRegistro }} · <span class="asig-inline">{{ a.asignatura?.nombre }}</span></p>
          </div>
        </div>
      </div>
      <div v-else class="empty-state"><p>No tienes alumnos matriculados en tus asignaturas.</p></div>
    </template>

    <!-- DETALLE ALUMNO (Consultar alumno) -->
    <template v-else-if="vista === 'alumno-detalle'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← abrirAlumnos</button>
        </div>
        <div class="avatar-row">
          <div class="user-avatar" style="width:48px;height:48px;font-size:1.2rem">{{ alumnoSel?.nombre?.charAt(0).toUpperCase() }}</div>
          <div><p class="user-name-lg">{{ alumnoSel?.nombre }}</p><p class="dim">{{ alumnoSel?.numeroRegistro }}</p></div>
        </div>
        <div class="detail-kv-grid">
          <div class="kv"><p class="kv-label">Email</p><p class="kv-val">{{ alumnoSel?.email }}</p></div>
          <div class="kv" v-if="alumnoSel?.dni"><p class="kv-label">DNI</p><p class="kv-val">{{ alumnoSel.dni }}</p></div>
        </div>
        <div v-if="alumnoAsistencias.length">
          <p class="sub-section-label">Historial de asistencia</p>
          <div class="asis-hist">
            <div v-for="r in alumnoAsistencias" :key="r.id" class="asis-hist-row">
              <div>
                <p class="asis-hist-asig">{{ r.sesion?.asignatura?.nombre ?? '—' }}</p>
                <p class="dim">{{ r.sesion?.fecha ? formatFecha(r.sesion.fecha) : '—' }}</p>
              </div>
              <span :class="r.presente ? 'tag-ok' : 'tag-ko'">{{ r.presente ? 'Presente' : 'Ausente' }}</span>
            </div>
          </div>
        </div>
        <p v-else class="dim">Sin registros de asistencia aún.</p>
      </div>
    </template>

    <!-- LISTA DE DISPENSAS (Abrir dispensas) -->
    <template v-else-if="vista === 'dispensas'">
      <div class="section-header">
        <h2 class="section-title">DISPENSAS_ABIERTO</h2>
        <span class="count-badge">{{ dispensas.length }}</span>
      </div>
      <div v-if="dispensas.length" class="disp-list">
        <div v-for="d in dispensas" :key="d.id" class="disp-card" @click="irDetalleDispensa(d)">
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
      <div v-else class="empty-state"><p>No hay solicitudes de dispensa para tus asignaturas.</p></div>
    </template>

    <!-- DETALLE DISPENSA (Consultar solicitud de dispensa) -->
    <template v-else-if="vista === 'dispensa-detalle'">
      <div class="detail-card card-base">
        <div class="detail-header">
          <button class="back-btn" @click="volver">← abrirDispensas</button>
        </div>
        <div class="detail-kv-grid">
          <div class="kv"><p class="kv-label">Alumno</p><p class="kv-val">{{ dispensaSel?.alumno?.nombre ?? '—' }}</p></div>
          <div class="kv"><p class="kv-label">Estado</p><span :class="estadoClass(dispensaSel?.estado)">{{ dispensaSel?.estado }}</span></div>
          <div class="kv"><p class="kv-label">Fecha solicitud</p><p class="kv-val">{{ dispensaSel ? new Date(dispensaSel.fechaSolicitud).toLocaleDateString() : '' }}</p></div>
          <div class="kv" v-if="dispensaSel?.alumno?.numeroRegistro"><p class="kv-label">Nº Registro</p><p class="kv-val">{{ dispensaSel.alumno.numeroRegistro }}</p></div>
        </div>
        <div class="kv full"><p class="kv-label">Motivo</p><p class="kv-val">{{ dispensaSel?.motivo }}</p></div>
        <div v-if="dispensaSel?.observaciones" class="kv full"><p class="kv-label">Observaciones del director</p><p class="kv-val">{{ dispensaSel.observaciones }}</p></div>
        <div v-if="dispensaSel?.asignaturas?.length" class="kv full">
          <p class="kv-label">Asignaturas afectadas</p>
          <div class="tag-list"><span v-for="a in dispensaSel.asignaturas" :key="a.id" class="asig-tag">{{ a.nombre }}</span></div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page { max-width: 860px; margin: 0 auto; padding: 1.5rem 2rem 3rem; display: flex; flex-direction: column; gap: 1.25rem; }
.topbar { display: flex; justify-content: space-between; align-items: center; }
.breadcrumb { display: flex; align-items: center; gap: .4rem; font-size: .85rem; flex-wrap: wrap; }
.bc-root { color: var(--text-primary); font-weight: 600; cursor: pointer; }
.bc-root:hover { text-decoration: underline; }
.bc-sep { color: var(--text-dim); }
.bc-item { color: var(--text-secondary); }
.user-chip { display: flex; align-items: center; gap: .6rem; flex-shrink: 0; }
.role-pill { font-size: .65rem; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; background: var(--bg-input); color: var(--text-secondary); padding: 3px 8px; border-radius: 99px; }
.uname { font-size: .82rem; font-weight: 600; }
.section-title { font-size: 1.15rem; font-weight: 700; letter-spacing: -.01em; }
.section-header { display: flex; align-items: center; gap: .75rem; justify-content: space-between; }
.count-badge { font-size: .72rem; font-weight: 700; background: var(--bg-input); color: var(--text-secondary); padding: 2px 8px; border-radius: 99px; }
.menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: .85rem; }
.menu-card { display: flex; align-items: center; gap: 1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; cursor: pointer; text-align: left; transition: all .15s; box-shadow: var(--shadow-sm); font-family: inherit; }
.menu-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.menu-card-icon { font-size: 1.5rem; flex-shrink: 0; }
.menu-card-title { font-size: .9rem; font-weight: 600; margin-bottom: 3px; }
.menu-card-desc { font-size: .78rem; color: var(--text-secondary); }
.sesion-list { display: flex; flex-direction: column; gap: .6rem; }
.sesion-card { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; padding: 1rem 1.25rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: all .15s; box-shadow: var(--shadow-sm); }
.sesion-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.sesion-asig { font-size: .9rem; font-weight: 600; margin-bottom: 3px; }
.sesion-fecha { font-size: .8rem; color: var(--text-secondary); }
.sesion-meta { font-size: .75rem; color: var(--text-dim); margin-top: 3px; }
.sesion-title-row { display: flex; align-items: center; gap: .75rem; }
.sesion-title-big { font-size: 1.1rem; font-weight: 700; }
.edit-inline-btn { background: none; border: 1px dashed var(--border); color: var(--text-secondary); padding: .5rem 1rem; border-radius: var(--radius-sm); cursor: pointer; font-size: .82rem; font-family: inherit; align-self: flex-start; }
.edit-inline-btn:hover { border-color: var(--border-hover); color: var(--text-primary); }
.edit-mode-label { font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-dim); }
.asis-counter { font-size: .82rem; font-weight: 600; color: var(--text-secondary); }
.asis-list { display: flex; flex-direction: column; gap: .4rem; }
.asis-row { display: flex; justify-content: space-between; align-items: center; padding: .75rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-sm); }
.asis-row.dispensado { opacity: .55; border-style: dashed; }
.asis-alumno { flex: 1; min-width: 0; }
.asis-nombre { font-size: .88rem; font-weight: 500; }
.asis-reg { font-size: .72rem; color: var(--text-dim); }
.asis-right { flex-shrink: 0; }
.tag-disp { font-size: .65rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--bg-input); color: var(--text-dim); text-transform: uppercase; letter-spacing: .05em; }
.toggle-wrap { display: flex; align-items: center; gap: .5rem; cursor: pointer; user-select: none; }
.toggle-cb { display: none; }
.toggle-track { position: relative; width: 38px; height: 22px; border-radius: 99px; background: var(--border); transition: background .2s; flex-shrink: 0; }
.toggle-cb:checked ~ * .toggle-track { background: var(--success); }
.toggle-wrap input:checked + .toggle-track { background: var(--success); }
.toggle-thumb { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 99px; background: #fff; transition: left .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2); }
.toggle-wrap input:checked + .toggle-track .toggle-thumb { left: 19px; }
.toggle-label { font-size: .8rem; color: var(--text-secondary); min-width: 50px; }
.asis-hist { display: flex; flex-direction: column; gap: .4rem; }
.asis-hist-row { display: flex; justify-content: space-between; align-items: center; padding: .6rem .9rem; background: var(--bg-main); border-radius: var(--radius-sm); }
.asis-hist-asig { font-size: .85rem; font-weight: 500; }
.sub-section-label { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-dim); margin-top: .25rem; }
.user-list { display: flex; flex-direction: column; gap: .5rem; }
.user-card { display: flex; align-items: center; gap: .9rem; padding: .9rem 1.1rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); cursor: pointer; transition: all .15s; box-shadow: var(--shadow-sm); }
.user-card:hover { border-color: var(--border-hover); box-shadow: var(--shadow-md); transform: translateY(-1px); }
.user-avatar { width: 36px; height: 36px; border-radius: 99px; background: var(--bg-input); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: .9rem; color: var(--text-secondary); flex-shrink: 0; }
.user-info { flex: 1; min-width: 0; }
.user-name { font-size: .88rem; font-weight: 600; }
.user-email { font-size: .75rem; color: var(--text-secondary); }
.asig-inline { color: var(--text-dim); }
.avatar-row { display: flex; align-items: center; gap: 1rem; }
.user-name-lg { font-size: 1.1rem; font-weight: 700; }
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
.row-h { display: flex; gap: .6rem; align-items: center; }
.btn-sm { font-size: .78rem; padding: .35rem .75rem; }
.btn-del-sm { background: none; border: 1px solid var(--error); color: var(--error); padding: .35rem .75rem; border-radius: var(--radius-sm); cursor: pointer; font-size: .78rem; font-weight: 600; font-family: inherit; }
.btn-del-sm:hover { background: var(--error); color: #fff; }
.tag-pend { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--bg-input); color: var(--text-secondary); text-transform: uppercase; }
.tag-ok { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--success-bg); color: var(--success); text-transform: uppercase; }
.tag-ko { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--error-bg); color: var(--error); text-transform: uppercase; }
.tag-activa { font-size: .68rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: var(--success-bg); color: var(--success); text-transform: uppercase; }
.help-text { font-size: .78rem; color: var(--text-dim); font-style: italic; }
.dim { color: var(--text-secondary); font-size: .82rem; }
.empty-state { text-align: center; padding: 3rem 2rem; color: var(--text-secondary); font-size: .9rem; }
.fb-ok { padding: .75rem 1rem; background: var(--success-bg); color: var(--success); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
.fb-ko { padding: .75rem 1rem; background: var(--error-bg); color: var(--error); border-radius: var(--radius-sm); font-size: .85rem; font-weight: 600; }
button:disabled { opacity: .45; cursor: not-allowed; }
</style>
