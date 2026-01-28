
import React, { useState, useCallback } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Rocket, 
  Orbit, 
  Download, 
  RotateCcw, 
  Loader2, 
  Check, 
  AlertTriangle, 
  Lightbulb, 
  ShieldAlert,
  Sparkles,
  Compass,
  Mail,
  User,
  Hash,
  Briefcase,
  Clock
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
      if (y + h > 275) { 
        doc.addPage(); 
        y = 20; 
        return true;
      }
      return false;
    };

    // --- PÁGINA 1: BRIEFING ---
    // Header Oscuro con "Logo"
    doc.setFillColor(5, 7, 10);
    doc.rect(0, 0, 210, 60, 'F');
    
    // Dibujar un cohete simple con triángulos
    doc.setFillColor(255, 255, 255);
    doc.triangle(margin, 20, margin + 5, 10, margin + 10, 20, 'F'); // Cuerpo
    doc.rect(margin + 2.5, 20, 5, 8, 'F'); // Base
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text("Human-OS", margin + 15, 25);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("RE-INCUBACIÓN PROFESIONAL // BY FER BERDUGO", margin + 15, 32);

    // Metadata en el header
    doc.setFontSize(9);
    doc.text(`TRIPULANTE: ${formData.nombre.toUpperCase()}`, margin, 50);
    doc.text(`EMAIL: ${formData.email.toUpperCase()}`, margin + 80, 50);
    doc.text(`ROL: ${formData.rol.toUpperCase()}`, margin, 55);
    doc.text(`AÑOS: ${formData.años}`, margin + 80, 55);

    y = 75;

    // Título de la página
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("MISSION BRIEFING", margin, y);
    y += 10;

    // Match Score Box
    doc.setFillColor(99, 102, 241);
    doc.roundedRect(150, 70, 40, 25, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text("MATCH SCORE", 155, 78);
    doc.setFontSize(16);
    doc.text(`${result.fitScore}%`, 155, 88);

    doc.setTextColor(79, 70, 229);
    doc.setFontSize(12);
    doc.text(`DIAGNÓSTICO: ${result.fitType.toUpperCase()}`, margin, y);
    y += 12;

    // Resumen (Bitácora)
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    const splitSummary = doc.splitTextToSize(`"${result.summary}"`, contentWidth);
    doc.text(splitSummary, margin, y);
    y += splitSummary.length * 6 + 10;

    // Secciones DAFO con Iconos simulados (círculos)
    const addSection = (title: string, items: string[], color: [number, number, number]) => {
      checkPageBreak(35);
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 170, y);
      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(color[0], color[1], color[2]);
      doc.setFontSize(11);
      doc.text(title.toUpperCase(), margin, y);
      y += 8;
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      items.forEach(item => {
        const split = doc.splitTextToSize(`• ${item}`, contentWidth - 5);
        checkPageBreak(split.length * 5 + 2);
        doc.text(split, margin + 2, y);
        y += split.length * 5 + 2;
      });
      y += 5;
    };

    addSection("Fortalezas", result.strengths, [16, 185, 129]);
    addSection("Debilidades", result.weaknesses, [239, 68, 68]);
    addSection("Oportunidades", result.opportunities, [245, 158, 11]);
    addSection("Amenazas", result.threats, [139, 92, 246]);

    // Roadmap
    addSection("Plan de Acción Human-OS", result.recommendations, [99, 102, 241]);

    // Footer Pág 1
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Página 1/2 - Dossier Confidencial", 105, 290, { align: 'center' });

    // --- PÁGINA 2: HISTORIAL Q&A ---
    doc.addPage();
    y = 30;
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("REGISTRO COMPLETO DE NAVEGACIÓN", margin, 25);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text("Todas las respuestas proporcionadas por el tripulante durante el diagnóstico.", margin, 32);

    y = 60;
    const qaItems = [
      { q: "¿En qué rol vuelas ahora?", a: formData.rol },
      { q: "¿Cuánto tiempo llevas en ese cielo?", a: formData.años },
      { q: "¿Qué crashes (crisis) has tenido?", a: formData.crashes },
      { q: "¿Qué procesos tienes colgados (inercias)?", a: formData.procesos_colgados },
      { q: "¿Qué malware (creencias limitantes) detectas?", a: formData.malware },
      { q: "¿De qué hitos te sientes orgulloso?", a: formData.logros },
      { q: "¿Cuándo entras en estado de flujo?", a: formData.disfrute },
      { q: "¿Cuál es tu talento natural?", a: formData.talentos_naturales },
      { q: "¿Tus valores TOP 3?", a: formData.valores_top3 },
      { q: "¿Qué ha sido el trigger del cambio?", a: formData.trigger },
      { q: "¿Tu visión a 2 años?", a: formData.vision_2años },
      { q: "¿Tu mayor miedo?", a: formData.miedo_mayor },
      { q: "¿Claridad de destino?", a: formData.claridad_que },
      { q: "¿Búsqueda principal?", a: formData.busca_principal },
      { q: "¿Estado emocional?", a: formData.estado_emocional }
    ];

    qaItems.forEach((item, idx) => {
      checkPageBreak(25);
      doc.setFillColor(idx % 2 === 0 ? 248 : 255, 250, 252); // Fondo alterno suave
      doc.rect(margin - 5, y - 5, 180, 20, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(99, 102, 241);
      doc.text(item.q.toUpperCase(), margin, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(10);
      const splitAns = doc.splitTextToSize(item.a || "N/A", contentWidth);
      doc.text(splitAns, margin, y);
      y += splitAns.length * 5 + 10;
    });

    // Footer Pág 2
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Página 2/2 - Dossier Generado por Human-OS", 105, 290, { align: 'center' });

    doc.save(`Dossier_HumanOS_${formData.nombre.replace(/\s/g, '_')}.pdf`);
  }, [result, formData]);

  const renderLanding = () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto py-20 animate-in fade-in duration-1000">
      <div className="mb-12 flex flex-col items-center gap-6">
        <div className="relative">
          <Rocket className="w-20 h-20 text-white animate-pulse" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-indigo-500/20 blur-xl rounded-full"></div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-8xl md:text-9xl font-bold font-space text-white tracking-tighter text-glow">
            Human-OS
          </h1>
          <p className="text-sm md:text-lg font-space font-medium tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-indigo-400">
            Re-incubación Profesional
          </p>
        </div>
        
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mt-4"></div>
      </div>
      
      <div className="max-w-md mx-auto mb-16">
        <p className="text-slate-400 text-lg font-light leading-relaxed">
          Un viaje aeroespacial hacia tu esencia profesional. Deja el piloto automático y reincuba tu historia.
        </p>
      </div>

      <button 
        onClick={() => setStep(0)} 
        className="px-16 py-6 btn-navigation rounded-2xl text-xl font-space tracking-tight shadow-2xl hover:scale-105 active:scale-95 transform transition-all group flex items-center gap-4"
      >
        INICIAR MISIÓN <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
      </button>

      <p className="mt-12 text-xs font-space font-light text-slate-500 italic">
        by{' '}
        <a 
          href="https://www.linkedin.com/in/fernando-berdugo/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-400/60 hover:text-indigo-300 transition-colors underline underline-offset-4 decoration-indigo-500/10"
        >
          Fer Berdugo
        </a>
      </p>
    </div>
  );

  const renderDiagnosticStart = () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-20">
      <div className="relative mb-12"><Orbit className="w-24 h-24 text-indigo-400 relative z-10" /></div>
      <h1 className="text-4xl font-space font-bold text-white mb-4">CARGANDO SISTEMA</h1>
      <p className="text-slate-400 mb-10 max-w-md">Preparando la matriz de diagnóstico para tu briefing profesional.</p>
      <div className="w-full max-w-md h-1.5 bg-white/5 rounded-full overflow-hidden mb-12"><div className="h-full bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-500 animate-[progress_3s_ease-in-out]"></div></div>
      <button onClick={nextStep} className="px-12 py-5 btn-navigation rounded-2xl font-space text-lg shadow-xl">COMENZAR REGISTRO</button>
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
        <InputGroup label="Tus 'Crashes' - ¿Cuándo sentiste que no podías más?">
          <textarea className="input-vibrant w-full min-h-[120px]" value={formData.crashes} onChange={e => updateField('crashes', e.target.value)} placeholder="Crisis o burnout..." />
        </InputGroup>
        <InputGroup label="Inercias - ¿Qué tareas haces automáticas pero te drenan?">
          <textarea className="input-vibrant w-full min-h-[120px]" value={formData.procesos_colgados} onChange={e => updateField('procesos_colgados', e.target.value)} placeholder="Tareas sin alma..." />
        </InputGroup>
        <InputGroup label="Sombras - ¿Qué voces limitan tu vuelo?">
          <textarea className="input-vibrant w-full min-h-[120px]" value={formData.malware} onChange={e => updateField('malware', e.target.value)} placeholder="Limitaciones internas..." />
        </InputGroup>
      </div>
    </StepLayout>
  );

  const renderStep3 = () => (
    <StepLayout phase="PROPULSIÓN" title="Capacidades Nativas" description="Tu combustible humano y talentos nativos" prev={prevStep} next={nextStep} current={3}>
      <div className="space-y-8">
        <InputGroup label="Tus Hitos - ¿De qué estás orgulloso/a?">
          <textarea className="input-vibrant w-full min-h-[100px]" value={formData.logros} onChange={e => updateField('logros', e.target.value)} placeholder="Momentos de impacto..." />
        </InputGroup>
        <InputGroup label="Estado de Flujo - ¿Cuándo pierdes la noción del tiempo?">
          <textarea className="input-vibrant w-full min-h-[100px]" value={formData.disfrute} onChange={e => updateField('disfrute', e.target.value)} placeholder="Donde te sientes vivo/a..." />
        </InputGroup>
        <InputGroup label="Tu Don - ¿Qué haces sin esfuerzo aparente?">
          <textarea className="input-vibrant w-full min-h-[100px]" value={formData.talentos_naturales} onChange={e => updateField('talentos_naturales', e.target.value)} placeholder="Habilidad innata..." />
        </InputGroup>
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
        <InputGroup label="El Trigger - ¿Qué te ha hecho decir 'basta' ahora?">
          <textarea className="input-vibrant w-full min-h-[100px]" value={formData.trigger} onChange={e => updateField('trigger', e.target.value)} placeholder="Chispa de cambio..." />
        </InputGroup>
        <InputGroup label="Visión 2.0 - ¿Dónde estarás en 2 años?">
          <textarea className="input-vibrant w-full min-h-[100px]" value={formData.vision_2años} onChange={e => updateField('vision_2años', e.target.value)} placeholder="Tu futuro ideal..." />
        </InputGroup>
        <InputGroup label="El Miedo - ¿Qué es lo que más te asusta del salto?">
          <textarea className="input-vibrant w-full min-h-[100px]" value={formData.miedo_mayor} onChange={e => updateField('miedo_mayor', e.target.value)} placeholder="Tus miedos..." />
        </InputGroup>
      </div>
    </StepLayout>
  );

  const renderStep6 = () => (
    <StepLayout phase="AJUSTES" title="Calibración Final" description="Asegurando el éxito de la sesión" prev={prevStep} next={handleSubmit} nextLabel="GENERAR BRIEFING 🚀" current={6}>
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
      </div>
    </StepLayout>
  );

  const renderResult = () => (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="glass-vibrant p-10 rounded-[3rem] relative overflow-hidden">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="w-20 h-20 text-indigo-400 animate-spin mb-8" />
            <h2 className="text-3xl font-space text-white mb-2 text-glow">PROCESANDO TUS DATOS...</h2>
            <p className="text-slate-400">Escaneando bitácora y preparando tu dossier.</p>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Header del Briefing */}
            <div className="border-b border-white/10 pb-10">
              <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                <div>
                  <h2 className="text-5xl font-bold text-white mb-2 font-space text-glow uppercase tracking-tighter">Mission Briefing</h2>
                  <p className="text-indigo-400 font-space tracking-widest uppercase text-sm font-bold">Diagnóstico: {result?.fitType}</p>
                </div>
                <div className="flex flex-col items-center justify-center p-6 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/30 min-w-[140px]">
                  <span className="text-[10px] text-slate-500 font-space tracking-widest uppercase mb-1">Human-OS Match</span>
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-pink-400">{result?.fitScore}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <MetaItem icon={<User className="w-4 h-4" />} label="Tripulante" value={formData.nombre} />
                 <MetaItem icon={<Hash className="w-4 h-4" />} label="Código Vuelo" value={formData.email} />
                 <MetaItem icon={<Briefcase className="w-4 h-4" />} label="Título" value={formData.rol} />
                 <MetaItem icon={<Clock className="w-4 h-4" />} label="Años Vuelo" value={`${formData.años} años`} />
              </div>
            </div>

            <div className="space-y-12">
              {/* Resumen Honestidad */}
              <section className="relative">
                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-transparent rounded-full opacity-50"></div>
                <h3 className="text-white text-xl font-space font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
                   Bitácora del Sistema
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed italic font-light">
                   "{result?.summary}"
                </p>
              </section>
              
              {/* DAFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResultSection title="Fortalezas" color="emerald" icon={<Sparkles/>} items={result?.strengths} />
                <ResultSection title="Debilidades" color="red" icon={<AlertTriangle/>} items={result?.weaknesses} />
                <ResultSection title="Oportunidades" color="amber" icon={<Lightbulb/>} items={result?.opportunities} />
                <ResultSection title="Amenazas" color="violet" icon={<ShieldAlert/>} items={result?.threats} />
              </div>

              {/* Hoja de Ruta */}
              <section className="bg-indigo-500/5 p-8 rounded-3xl border border-indigo-500/20">
                <h3 className="text-indigo-300 mb-6 font-space uppercase tracking-widest text-sm font-bold flex items-center gap-2">
                  <Compass className="w-5 h-5" /> Hoja de Ruta de Re-incubación
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {result?.recommendations.map((r, i) => (
                    <div key={i} className="flex gap-4 items-start bg-slate-900/40 p-5 rounded-2xl border border-white/5 transition-all hover:border-indigo-500/30">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 text-white text-sm flex items-center justify-center shrink-0 font-bold shadow-lg shadow-indigo-500/20">{i + 1}</div>
                      <p className="text-sm text-slate-200 leading-relaxed">{r}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Mensaje Final */}
              <div className="flex flex-col items-center justify-center gap-4 py-8 px-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-2">
                  <Mail className="w-6 h-6 text-indigo-400" />
                </div>
                <p className="text-slate-300 max-w-lg leading-relaxed">
                  Después de descargar el dossier, envíaselo por correo a tu <span className="text-white font-bold">Capitán Fer</span> a su dirección personal: 
                  <br/>
                  <a href="mailto:ferpilot.ia@gmail.com" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">ferpilot.ia@gmail.com</a>
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-white/10">
              <button onClick={generatePDFReport} className="flex-1 py-6 flex items-center justify-center gap-3 btn-navigation rounded-2xl shadow-2xl text-lg uppercase font-space tracking-widest">
                <Download className="w-6 h-6" /> Descargar Dossier (PDF)
              </button>
              <button onClick={() => setStep(-1)} className="px-10 py-6 flex items-center justify-center gap-3 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all uppercase font-space tracking-widest text-sm">
                <RotateCcw className="w-6 h-6" /> Reiniciar
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
    <div className="relative">{children}</div>
  </div>
);

const ResultSection = ({ title, color, icon, items }: any) => {
  const styles: any = { 
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', 
    red: 'text-red-400 bg-red-500/10 border-red-500/20', 
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20', 
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20' 
  };
  return (
    <div className={`p-6 rounded-2xl border ${styles[color]}`}>
      <h4 className="font-bold mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">{icon} {title}</h4>
      <ul className="space-y-2">
        {items?.map((it: string, i: number) => <li key={i} className="text-sm text-slate-300 flex gap-2"><span>•</span> {it}</li>)}
      </ul>
    </div>
  );
};

const MetaItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex flex-col p-4 rounded-2xl bg-white/5 border border-white/10">
    <div className="flex items-center gap-2 mb-1">
      <div className="text-indigo-400">{icon}</div>
      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</span>
    </div>
    <span className="text-sm text-white font-medium truncate">{value}</span>
  </div>
);

export default App;
