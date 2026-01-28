
import React, { useState, useCallback } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Rocket, 
  Orbit, 
  Download, 
  RotateCcw, 
  Loader2, 
  CheckCircle2, 
  Cpu, 
  FlaskConical, 
  Check, 
  AlertTriangle, 
  Lightbulb, 
  ShieldAlert,
  Sparkles,
  Compass
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { DiagnosticFormData, AnalysisResult } from './types';
import { analyzeDiagnostic } from './services/geminiService';

const INITIAL_DATA: DiagnosticFormData = {
  nombre: '',
  email: '',
  rol: '',
  años: '',
  crashes: '',
  procesos_colgados: '',
  malware: '',
  logros: '',
  disfrute: '',
  talentos_naturales: '',
  pasion_gratis: '',
  valores: [],
  valores_top3: '',
  trigger: '',
  dia_critico: '',
  deseo_sin_dinero: '',
  vision_2años: '',
  miedo_mayor: '',
  claridad_que: '',
  busca_principal: '',
  estado_emocional: '',
  experiencia_previa: '',
  expectativa_sesion: '',
};

const VALUES_OPTIONS = [
  { id: 'creatividad', label: 'Creatividad', icon: '🎨' },
  { id: 'autonomia', label: 'Autonomía', icon: '🦅' },
  { id: 'impacto', label: 'Impacto social', icon: '🌍' },
  { id: 'crecimiento', label: 'Crecimiento continuo', icon: '📈' },
  { id: 'balance', label: 'Balance vida-trabajo', icon: '⚖️' },
  { id: 'estabilidad', label: 'Estabilidad económica', icon: '🛡️' },
  { id: 'reconocimiento', label: 'Reconocimiento', icon: '🏆' },
  { id: 'colaboracion', label: 'Colaboración', icon: '👥' },
  { id: 'proposito', label: 'Propósito', icon: '🎯' },
  { id: 'diversidad', label: 'Diversidad de tareas', icon: '🌈' },
  { id: 'excelencia', label: 'Excelencia', icon: '⭐' },
  { id: 'conexion', label: 'Conexión humana', icon: '❤️' },
  { id: 'reto', label: 'Reto constante', icon: '🚀' },
  { id: 'liderazgo', label: 'Liderazgo', icon: '👑' },
  { id: 'flexibilidad', label: 'Flexibilidad', icon: '🌊' },
];

const CLARITY_OPTIONS = [
  { id: 'si_claro', label: 'Sí, tengo bastante claro hacia dónde quiero ir' },
  { id: 'vago', label: 'Tengo ideas vagas pero nada concreto' },
  { id: 'no_idea', label: 'No tengo ni idea, todo me parece igual de aburrido' },
];

const SEEKING_OPTIONS = [
  { id: 'nuevo_trabajo', label: 'Un nuevo trabajo YA (necesito moverme rápido)' },
  { id: 'repensar_carrera', label: 'Repensar mi carrera completa (no sé si seguir en esto)' },
  { id: 'idea_proyecto', label: 'Explorar una idea de proyecto paralelo/emprendimiento' },
  { id: 'entenderme', label: 'Entenderme mejor a mí mismo y qué me mueve' },
];

const EMOTIONAL_OPTIONS = [
  { id: 'agotado_crisis', label: 'Agotado/en crisis - Me cuesta levantarme' },
  { id: 'frustrado_funcional', label: 'Frustrado pero funcional - Por fuera bien, por dentro apagándome' },
  { id: 'inquieto_curioso', label: 'Inquieto y curioso - Quiero más pero no sé qué' },
  { id: 'energizado_bloqueado', label: 'Con energía pero bloqueado - Sé que puedo más' },
];

const SpaceshipProgress = ({ step }: { step: number }) => {
  const fillPercentage = step > 0 ? (step / 6) * 100 : 0;
  return (
    <div className="flex flex-col items-center mb-8 pointer-events-none">
      <div className="relative w-16 h-16">
        <Rocket className={`w-12 h-12 transition-all duration-700 ${step > 0 ? 'text-indigo-400' : 'text-slate-600 opacity-20'}`} />
        <div 
          className="absolute bottom-0 left-0 w-full overflow-hidden transition-all duration-1000" 
          style={{ height: `${fillPercentage}%` }}
        >
          <Rocket className="w-12 h-12 text-pink-500" />
        </div>
      </div>
      <div className="w-48 h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-1000"
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [step, setStep] = useState<number>(-1); 
  const [formData, setFormData] = useState<DiagnosticFormData>(INITIAL_DATA);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const updateField = (field: keyof DiagnosticFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleValueToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      valores: prev.valores.includes(id) 
        ? prev.valores.filter(v => v !== id) 
        : [...prev.valores, id]
    }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 8));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setStep(8);
    const analysis = await analyzeDiagnostic(formData);
    setResult(analysis);
    setIsAnalyzing(false);
  };

  const generatePDFReport = useCallback(() => {
    if (!result) return;
    const doc = new jsPDF();
    const margin = 20;
    const contentWidth = 170;
    let y = 30;

    const checkPageBreak = (h: number) => { 
      if (y + h > 270) { 
        doc.addPage(); 
        y = 20; 
        return true;
      }
      return false;
    };

    const addTitle = (text: string) => {
      checkPageBreak(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42); // Navy dark
      doc.text(text, margin, y);
      y += 12;
    };

    const addSectionHeader = (text: string, color: [number, number, number] = [79, 70, 229]) => {
      checkPageBreak(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(text.toUpperCase(), margin, y);
      y += 5;
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 50, y);
      y += 10;
    };

    const addBodyText = (text: string, fontSize = 10, isItalic = false) => {
      doc.setFont('helvetica', isItalic ? 'italic' : 'normal');
      doc.setFontSize(fontSize);
      doc.setTextColor(51, 65, 85);
      const val = text || 'N/A';
      const splitText = doc.splitTextToSize(val, contentWidth);
      checkPageBreak(splitText.length * 6 + 5);
      doc.text(splitText, margin, y);
      y += splitText.length * 6 + 4;
    };

    const addBulletList = (items: string[]) => {
      if (!items || items.length === 0) {
        addBodyText("No hay datos para esta sección.");
        return;
      }
      items.forEach(item => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        const splitItem = doc.splitTextToSize(`- ${item}`, contentWidth - 10);
        checkPageBreak(splitItem.length * 5 + 2);
        doc.text(splitItem, margin + 5, y);
        y += splitItem.length * 5 + 2;
      });
      y += 5;
    };

    // --- PÁGINA 1: BRIEFING ---
    addTitle(`MISSION BRIEFING: ${formData.nombre}`);
    addBodyText(`Match con Filosofía Human-OS: ${result.fitScore}%`, 12);
    addBodyText(`Perfil Asignado: ${result.fitType}`, 11, true);
    
    addSectionHeader("Diagnóstico General");
    addBodyText(result.summary, 10);

    addSectionHeader("Fortalezas", [16, 185, 129]); // Verde
    addBulletList(result.strengths);

    addSectionHeader("Debilidades", [239, 68, 68]); // Rojo
    addBulletList(result.weaknesses);

    addSectionHeader("Oportunidades", [245, 158, 11]); // Ambar
    addBulletList(result.opportunities);

    addSectionHeader("Amenazas", [139, 92, 246]); // Violeta
    addBulletList(result.threats);

    addSectionHeader("Ruta de Re-incubación", [79, 70, 229]); // Indigo
    addBulletList(result.recommendations);

    // --- PÁGINA 2: RESPUESTAS ---
    doc.addPage();
    y = 20;
    addTitle("Registro Completo de Respuestas");
    
    const sections = [
      { label: 'Rol actual', value: formData.rol },
      { label: 'Años de experiencia', value: formData.años },
      { label: 'Crisis/Crashes', value: formData.crashes },
      { label: 'Procesos colgados', value: formData.procesos_colgados },
      { label: 'Sombras/Creencias', value: formData.malware },
      { label: 'Hitos principales', value: formData.logros },
      { label: 'Disfrute/Flujo', value: formData.disfrute },
      { label: 'Talento natural', value: formData.talentos_naturales },
      { label: 'Valores', value: formData.valores.join(', ') },
      { label: 'Valores TOP 3', value: formData.valores_top3 },
      { label: 'Disparador de cambio', value: formData.trigger },
      { label: 'Visión a 2 años', value: formData.vision_2años },
      { label: 'Miedo mayor', value: formData.miedo_mayor },
      { label: 'Claridad', value: formData.claridad_que },
      { label: 'Búsqueda', value: formData.busca_principal },
      { label: 'Estado emocional', value: formData.estado_emocional },
      { label: 'Experiencia previa', value: formData.experiencia_previa },
      { label: 'Expectativa sesión', value: formData.expectativa_sesion },
    ];

    sections.forEach(sec => {
      checkPageBreak(18);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(sec.label.toUpperCase(), margin, y);
      y += 6;
      addBodyText(sec.value || 'N/A', 10);
      y += 4;
    });

    doc.save(`Briefing_HumanOS_${formData.nombre.replace(/\s/g, '_')}.pdf`);
  }, [result, formData]);

  const renderLanding = () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto py-20 animate-in fade-in zoom-in duration-1000">
      <div className="relative mb-12">
        <div className="absolute inset-[-60px] bg-purple-500/20 blur-[120px] rounded-full animate-pulse"></div>
        <Rocket className="w-24 h-24 text-white relative z-10" />
      </div>
      <div className="mb-4">
        <h1 className="text-6xl md:text-8xl font-bold font-space text-white tracking-tighter mb-2 text-glow">Human-OS</h1>
        <p className="text-2xl md:text-3xl font-space font-light text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 tracking-widest uppercase">Re-incubación Profesional</p>
      </div>
      <div className="glass-vibrant p-8 md:p-12 rounded-[3rem] mb-12 text-left max-w-4xl border-white/20">
        <p className="text-xl md:text-2xl text-white font-medium mb-6">Gracias por formar parte de este proceso y bienvenido/a a tu <span className="text-indigo-400">mentoría gratuita de 30 minutos.</span></p>
        <p className="text-slate-300 leading-relaxed mb-8 text-lg">Esto no es coaching tradicional, no es terapia ni un curso de IA. Es una <span className="text-white font-semibold">mentoría de re-incubación profesional</span> diseñada para quienes sienten que el piloto automático ya no es suficiente.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex gap-4"><FlaskConical className="w-12 h-12 text-pink-400 shrink-0" /><p className="text-slate-400 text-sm">Vengo de departamentos de incubación de grandes tecnológicas donde convertimos ideas en productos viables.</p></div>
          <div className="flex gap-4"><Cpu className="w-12 h-12 text-indigo-400 shrink-0" /><p className="text-slate-400 text-sm"><span className="text-white font-bold">HUMAN-OS</span> aplica esos mismos principios a tu carrera: Tu trayectoria como un experimento. Humano + Tecnología.</p></div>
        </div>
      </div>
      <button onClick={() => setStep(0)} className="px-12 py-6 btn-navigation rounded-2xl text-xl font-space tracking-tight shadow-2xl">REGISTRO DE TRIPULANTE A HUMAN-OS <ArrowRight className="inline-block ml-3" /></button>
    </div>
  );

  const renderDiagnosticStart = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-20">
      <div className="relative mb-12"><Orbit className="w-24 h-24 text-indigo-400 relative z-10" /></div>
      <h1 className="text-4xl font-space font-bold text-white mb-4">INICIANDO DIAGNÓSTICO</h1>
      <p className="text-slate-400 mb-10 max-w-md">Analizando la matriz de datos para preparar la sesión con Fer.</p>
      <div className="w-full max-w-md h-1.5 bg-white/5 rounded-full overflow-hidden mb-12"><div className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-500 animate-[progress_3s_ease-in-out]"></div></div>
      <button onClick={nextStep} className="px-12 py-5 btn-navigation rounded-2xl font-space text-lg shadow-xl">COMENZAR REGISTRO DE MISIÓN</button>
    </div>
  );

  const renderStep1 = () => (
    <StepLayout phase="IDENTIFICACIÓN" title="Datos del Tripulante" description="Información básica para tu reporte de re-incubación" next={nextStep} current={1}>
      <div className="space-y-6">
        <InputGroup label="Nombre completo *"><input className="input-vibrant w-full" type="text" value={formData.nombre} onChange={e => updateField('nombre', e.target.value)} placeholder="Tu nombre..." /></InputGroup>
        <InputGroup label="Email *"><input className="input-vibrant w-full" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="Tu email..." /></InputGroup>
        <InputGroup label="Rol/Posición actual *"><input className="input-vibrant w-full" type="text" value={formData.rol} onChange={e => updateField('rol', e.target.value)} placeholder="¿A qué te dedicas?" /></InputGroup>
        <InputGroup label="Años en el rol actual"><input className="input-vibrant w-full" type="text" value={formData.años} onChange={e => updateField('años', e.target.value)} placeholder="¿Cuánto tiempo?" /></InputGroup>
      </div>
    </StepLayout>
  );

  const renderStep2 = () => (
    <StepLayout phase="TURBULENCIAS" title="Análisis de Bloqueos" description="Identificando lo que drena tu energía" prev={prevStep} next={nextStep} current={2}>
      <div className="space-y-8">
        <InputGroup label="Tus 'Crashes': ¿Cuándo sentiste que no podías más?"><textarea className="input-vibrant w-full min-h-[120px]" value={formData.crashes} onChange={e => updateField('crashes', e.target.value)} placeholder="Crisis o burnout..." /></InputGroup>
        <InputGroup label="Inercias: ¿Qué tareas haces de forma automática pero te drenan?"><textarea className="input-vibrant w-full min-h-[120px]" value={formData.procesos_colgados} onChange={e => updateField('procesos_colgados', e.target.value)} placeholder="Tareas que haces sin alma..." /></InputGroup>
        <InputGroup label="Sombras: ¿Qué voces o creencias limitan tu vuelo?"><textarea className="input-vibrant w-full min-h-[120px]" value={formData.malware} onChange={e => updateField('malware', e.target.value)} placeholder="Limitaciones internas..." /></InputGroup>
      </div>
    </StepLayout>
  );

  const renderStep3 = () => (
    <StepLayout phase="PROPULSIÓN" title="Capacidades Nativas" description="Tu combustible humano y talentos nativos" prev={prevStep} next={nextStep} current={3}>
      <div className="space-y-8">
        <InputGroup label="Tus Hitos: ¿De qué estás realmente orgulloso/a?"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.logros} onChange={e => updateField('logros', e.target.value)} placeholder="Momentos de impacto..." /></InputGroup>
        <InputGroup label="Estado de Flujo: ¿Cuándo pierdes la noción del tiempo?"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.disfrute} onChange={e => updateField('disfrute', e.target.value)} placeholder="En qué tareas te sientes vivo/a..." /></InputGroup>
        <InputGroup label="Tu Don: ¿Qué haces sin esfuerzo aparente?"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.talentos_naturales} onChange={e => updateField('talentos_naturales', e.target.value)} placeholder="Habilidad innata..." /></InputGroup>
      </div>
    </StepLayout>
  );

  const renderStep4 = () => (
    <StepLayout phase="NÚCLEO" title="Brújula de Valores" description="Tus valores son el centro de gravedad" prev={prevStep} next={nextStep} current={4}>
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VALUES_OPTIONS.map(val => (
            <button key={val.id} type="button" onClick={() => handleValueToggle(val.id)} className={`flex items-center gap-4 p-4 text-left rounded-xl transition-all border ${formData.valores.includes(val.id) ? 'border-orange-400 bg-orange-400/10' : 'border-white/10 bg-slate-900/40 hover:border-white/20'}`}>
              <div className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${formData.valores.includes(val.id) ? 'bg-white border-white' : 'border-slate-500'}`}>{formData.valores.includes(val.id) && <Check className="w-4 h-4 text-indigo-900" />}</div>
              <span className="text-xl">{val.icon}</span>
              <span className="font-medium text-white text-sm">{val.label}</span>
            </button>
          ))}
        </div>
        <InputGroup label="Si tuvieras que elegir SOLO 3 de los anteriores, ¿cuáles y por qué? *">
          <textarea className="input-vibrant w-full min-h-[120px]" value={formData.valores_top3} onChange={e => updateField('valores_top3', e.target.value)} placeholder="Escribe los 3 valores más importantes..." />
        </InputGroup>
      </div>
    </StepLayout>
  );

  const renderStep5 = () => (
    <StepLayout phase="EL HORIZONTE" title="Destino Profesional" description="Visualizando tu nueva historia re-incubada" prev={prevStep} next={nextStep} current={5}>
      <div className="space-y-8">
        <InputGroup label="El Trigger: ¿Qué te ha hecho decir 'basta' ahora?"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.trigger} onChange={e => updateField('trigger', e.target.value)} placeholder="Chispa de cambio..." /></InputGroup>
        <InputGroup label="Visión 2.0: ¿Dónde estarás en 2 años?"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.vision_2años} onChange={e => updateField('vision_2años', e.target.value)} placeholder="Tu futuro ideal..." /></InputGroup>
        <InputGroup label="El Miedo: ¿Qué es lo que más te asusta de este salto?"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.miedo_mayor} onChange={e => updateField('miedo_mayor', e.target.value)} placeholder="Tus miedos..." /></InputGroup>
      </div>
    </StepLayout>
  );

  const renderStep6 = () => (
    <StepLayout phase="AJUSTES" title="Calibración Final" description="Para asegurarme de que puedo ayudarte de la mejor manera" prev={prevStep} next={handleSubmit} nextLabel="LANZAR MISIÓN 🚀" current={6}>
      <div className="space-y-10">
        <InputGroup label="¿Tienes claridad sobre QUÉ quieres hacer? *">
          <div className="space-y-3">
            {CLARITY_OPTIONS.map(opt => (
              <div key={opt.id} onClick={() => updateField('claridad_que', opt.id)} className={`custom-radio ${formData.claridad_que === opt.id ? 'selected' : ''}`}>
                <div className="radio-circle"><div className="radio-dot"></div></div>
                <span className="text-sm text-white font-medium">{opt.label}</span>
              </div>
            ))}
          </div>
        </InputGroup>

        <InputGroup label="¿Estás buscando principalmente...? *">
          <div className="space-y-3">
            {SEEKING_OPTIONS.map(opt => (
              <div key={opt.id} onClick={() => updateField('busca_principal', opt.id)} className={`custom-radio ${formData.busca_principal === opt.id ? 'selected' : ''}`}>
                <div className="radio-circle"><div className="radio-dot"></div></div>
                <span className="text-sm text-white font-medium">{opt.label}</span>
              </div>
            ))}
          </div>
        </InputGroup>

        <InputGroup label="¿Cómo describirías tu estado emocional actual? *">
          <div className="space-y-3">
            {EMOTIONAL_OPTIONS.map(opt => (
              <div key={opt.id} onClick={() => updateField('estado_emocional', opt.id)} className={`custom-radio ${formData.estado_emocional === opt.id ? 'selected' : ''}`}>
                <div className="radio-circle"><div className="radio-dot"></div></div>
                <span className="text-sm text-white font-medium">{opt.label}</span>
              </div>
            ))}
          </div>
        </InputGroup>

        <InputGroup label="¿Has trabajado antes con un coach, terapeuta o mentor? *">
          <textarea className="input-vibrant w-full min-h-[100px]" value={formData.experiencia_previa} onChange={e => updateField('experiencia_previa', e.target.value)} placeholder="Experiencia previa..." />
        </InputGroup>

        <InputGroup label="¿Qué esperas que pase después de nuestra sesión? *">
          <textarea className="input-vibrant w-full min-h-[100px]" value={formData.expectativa_sesion} onChange={e => updateField('expectativa_sesion', e.target.value)} placeholder="Tu objetivo prioritario..." />
        </InputGroup>
      </div>
    </StepLayout>
  );

  const renderResult = () => (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="glass-vibrant p-10 rounded-[3rem] relative overflow-hidden">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="w-20 h-20 text-indigo-400 animate-spin mb-8" />
            <h2 className="text-3xl font-space text-white mb-2 text-glow">PROCESANDO DATOS...</h2>
            <p className="text-slate-400">Cruzando tus respuestas con la matriz Human-OS.</p>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/10 pb-10">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2 font-space text-glow">Mission Briefing</h2>
                <p className="text-indigo-300">Tripulante: <span className="font-semibold text-white">{formData.nombre}</span></p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/30 min-w-[140px]">
                <span className="text-[10px] text-slate-500 font-space tracking-widest uppercase mb-1">Human-OS Match</span>
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-pink-400">{result?.fitScore}%</span>
              </div>
            </div>

            <div className="space-y-10">
              {/* SWOT Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
                    <Sparkles className="w-4 h-4" /> Fortalezas
                  </h4>
                  <ul className="space-y-2">
                    {result?.strengths.map((s, i) => (<li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-emerald-500">•</span> {s}</li>))}
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
                    <AlertTriangle className="w-4 h-4" /> Debilidades
                  </h4>
                  <ul className="space-y-2">
                    {result?.weaknesses.map((w, i) => (<li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-red-500">•</span> {w}</li>))}
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
                    <Lightbulb className="w-4 h-4" /> Oportunidades
                  </h4>
                  <ul className="space-y-2">
                    {result?.opportunities.map((o, i) => (<li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-amber-500">•</span> {o}</li>))}
                  </ul>
                </div>
                <div className="p-6 rounded-2xl bg-violet-500/10 border border-violet-500/20">
                  <h4 className="text-violet-400 font-bold mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
                    <ShieldAlert className="w-4 h-4" /> Amenazas
                  </h4>
                  <ul className="space-y-2">
                    {result?.threats.map((t, i) => (<li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-violet-500">•</span> {t}</li>))}
                  </ul>
                </div>
              </div>

              {/* Roadmap */}
              <section className="bg-indigo-500/5 p-8 rounded-3xl border border-indigo-500/20">
                <h3 className="text-indigo-300 mb-6 font-space uppercase tracking-widest text-sm font-bold flex items-center gap-2">
                  <Compass className="w-5 h-5" /> Tu Hoja de Ruta Sugerida
                </h3>
                <div className="space-y-4">
                  {result?.recommendations.map((r, i) => (
                    <div key={i} className="flex gap-4 items-start bg-slate-900/40 p-4 rounded-xl border border-white/5">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center shrink-0 font-bold">{i + 1}</div>
                      <p className="text-sm text-slate-200">{r}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-white/10">
              <button onClick={generatePDFReport} className="flex-1 py-6 flex items-center justify-center gap-3 btn-navigation rounded-2xl shadow-2xl text-lg">
                <Download className="w-6 h-6" /> DESCARGAR DOSSIER COMPLETO (PDF)
              </button>
              <button onClick={() => setStep(-1)} className="px-10 py-6 flex items-center justify-center gap-3 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
                <RotateCcw className="w-6 h-6" /> REINICIAR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-slate-100">
      {step === -1 && renderLanding()}
      {step === 0 && renderDiagnosticStart()}
      {step >= 1 && step <= 6 && (
        <>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}
        </>
      )}
      {step === 8 && renderResult()}
    </div>
  );
};

interface StepLayoutProps {
  phase: string;
  title: string;
  description: string;
  children: React.ReactNode;
  prev?: () => void;
  next?: (e: React.FormEvent) => void;
  nextLabel?: string;
  current: number;
}

const StepLayout: React.FC<StepLayoutProps> = ({ phase, title, description, children, prev, next, nextLabel, current }) => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-12 duration-700">
      <div className="flex flex-col items-center mb-8">
        <SpaceshipProgress step={current} />
        <div className="flex justify-between items-center w-full mb-4">
          <span className="phase-text">FASE 0{current} // {phase}</span>
          <div className="step-counter">{current} de 6</div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-space text-white text-center mb-2 tracking-tight text-glow">{title}</h1>
        <p className="text-slate-400 font-light text-center text-lg">{description}</p>
      </div>

      <div className="glass-vibrant p-10 rounded-[2.5rem] border-sky-400/30 shadow-2xl">
        <form onSubmit={e => { e.preventDefault(); next && next(e); }}>
          {children}
          <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-end gap-6">
            {prev && (
              <button type="button" onClick={prev} className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white transition-all font-space text-sm tracking-widest uppercase">
                <ArrowLeft className="w-4 h-4" /> VOLVER
              </button>
            )}
            <button type="submit" className="px-10 py-4 btn-navigation rounded-2xl group text-lg flex items-center gap-3 shadow-xl uppercase font-space tracking-widest">
              {nextLabel || 'SIGUIENTE'} <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-4">
    <label className="block text-sm font-space font-bold text-sky-400 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

export default App;
