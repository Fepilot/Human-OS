
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
import { DiagnosticFormData, AnalysisResult } from './types.ts';
import { analyzeDiagnostic } from './services/geminiService.tsx'; 

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
    try {
      const analysis = await analyzeDiagnostic(formData);
      setResult(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePDFReport = useCallback(() => {
    if (!result) return;
    const doc = new jsPDF();
    const margin = 20;
    const contentWidth = 170;
    let y = 30;

    const checkPageBreak = (h: number) => { 
      if (y + h > 270) { doc.addPage(); y = 20; return true; }
      return false;
    };

    const addTitle = (text: string) => {
      checkPageBreak(15);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(20);
      doc.setTextColor(15, 23, 42); doc.text(text, margin, y);
      y += 12;
    };

    const addSectionHeader = (text: string, color: [number, number, number] = [79, 70, 229]) => {
      checkPageBreak(20);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
      doc.setTextColor(color[0], color[1], color[2]); doc.text(text.toUpperCase(), margin, y);
      y += 5; doc.setDrawColor(color[0], color[1], color[2]); doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 50, y); y += 10;
    };

    const addBodyText = (text: string, fontSize = 10, isItalic = false) => {
      doc.setFont('helvetica', isItalic ? 'italic' : 'normal'); doc.setFontSize(fontSize);
      doc.setTextColor(51, 65, 85);
      const val = text || 'N/A';
      const splitText = doc.splitTextToSize(val, contentWidth);
      checkPageBreak(splitText.length * 6 + 5);
      doc.text(splitText, margin, y);
      y += splitText.length * 6 + 4;
    };

    const addBulletList = (items: string[]) => {
      if (!items || items.length === 0) { addBodyText("N/A"); return; }
      items.forEach(item => {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(71, 85, 105);
        const splitItem = doc.splitTextToSize(`- ${item}`, contentWidth - 10);
        checkPageBreak(splitItem.length * 5 + 2);
        doc.text(splitItem, margin + 5, y);
        y += splitItem.length * 5 + 2;
      });
      y += 5;
    };

    addTitle(`MISSION BRIEFING: ${formData.nombre}`);
    addBodyText(`Match Score: ${result.fitScore}%`, 12);
    addSectionHeader("Diagnóstico General");
    addBodyText(result.summary, 10);
    addSectionHeader("Fortalezas", [16, 185, 129]); addBulletList(result.strengths);
    addSectionHeader("Debilidades", [239, 68, 68]); addBulletList(result.weaknesses);
    addSectionHeader("Oportunidades", [245, 158, 11]); addBulletList(result.opportunities);
    addSectionHeader("Amenazas", [139, 92, 246]); addBulletList(result.threats);
    addSectionHeader("Recomendaciones", [79, 70, 229]); addBulletList(result.recommendations);

    doc.addPage(); y = 20;
    addTitle("Registro de Respuestas");
    const sections = [
      { label: 'Rol', value: formData.rol },
      { label: 'Años', value: formData.años },
      { label: 'Crashes', value: formData.crashes },
      { label: 'Hitos', value: formData.logros },
      { label: 'Valores', value: formData.valores.join(', ') },
      { label: 'Visión', value: formData.vision_2años },
    ];
    sections.forEach(sec => {
      checkPageBreak(18);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text(sec.label.toUpperCase(), margin, y);
      y += 6; addBodyText(sec.value || 'N/A', 10); y += 4;
    });

    doc.save(`Briefing_HumanOS_${formData.nombre}.pdf`);
  }, [result, formData]);

  const renderLanding = () => (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto py-20 animate-in fade-in duration-1000">
      <div className="relative mb-12">
        <div className="absolute inset-[-60px] bg-purple-500/20 blur-[120px] rounded-full"></div>
        <Rocket className="w-24 h-24 text-white relative z-10" />
      </div>
      <h1 className="text-6xl md:text-8xl font-bold font-space text-white mb-2 text-glow">Human-OS</h1>
      <p className="text-2xl font-space font-light text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 uppercase tracking-widest mb-12">Re-incubación Profesional</p>
      <div className="glass-vibrant p-10 rounded-[3rem] mb-12 text-left max-w-4xl">
        <p className="text-xl text-white mb-6">Bienvenido/a a tu <span className="text-indigo-400">mentoría de re-incubación.</span></p>
        <p className="text-slate-300 leading-relaxed text-lg mb-8">Este diagnóstico es el primer paso para resetear tu trayectoria profesional usando metodologías de incubación de productos tecnológicos.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4 text-slate-400 text-sm"><FlaskConical className="w-8 h-8 text-pink-400 shrink-0" /> Mentoría basada en 15 años de experiencia en tech.</div>
          <div className="flex gap-4 text-slate-400 text-sm"><Cpu className="w-8 h-8 text-indigo-400 shrink-0" /> Enfoque en optimizar tu "Sistema Operativo" humano.</div>
        </div>
      </div>
      <button onClick={() => setStep(0)} className="px-12 py-6 btn-navigation rounded-2xl text-xl font-space shadow-2xl">INICIAR REGISTRO DE MISIÓN <ArrowRight className="inline ml-3" /></button>
    </div>
  );

  const renderStep1 = () => (
    <StepLayout phase="ID" title="Tu Identidad" description="Datos básicos del tripulante" next={nextStep} current={1}>
      <div className="space-y-6">
        <InputGroup label="Nombre *"><input className="input-vibrant w-full" value={formData.nombre} onChange={e => updateField('nombre', e.target.value)} placeholder="Tu nombre..." /></InputGroup>
        <InputGroup label="Email *"><input className="input-vibrant w-full" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="Tu email..." /></InputGroup>
        <InputGroup label="Rol actual *"><input className="input-vibrant w-full" value={formData.rol} onChange={e => updateField('rol', e.target.value)} placeholder="¿Qué haces hoy?" /></InputGroup>
      </div>
    </StepLayout>
  );

  const renderStep2 = () => (
    <StepLayout phase="DOLOR" title="Bloqueos" description="¿Qué drena tu energía?" prev={prevStep} next={nextStep} current={2}>
      <div className="space-y-8">
        <InputGroup label="Crashes (Momentos críticos)"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.crashes} onChange={e => updateField('crashes', e.target.value)} /></InputGroup>
        <InputGroup label="Sombras (Creencias)"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.malware} onChange={e => updateField('malware', e.target.value)} /></InputGroup>
      </div>
    </StepLayout>
  );

  const renderStep3 = () => (
    <StepLayout phase="FUEGO" title="Talentos" description="Tu combustible interno" prev={prevStep} next={nextStep} current={3}>
      <div className="space-y-8">
        <InputGroup label="Tus Hitos (Orgullo)"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.logros} onChange={e => updateField('logros', e.target.value)} /></InputGroup>
        <InputGroup label="Tu Don (Facilidad)"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.talentos_naturales} onChange={e => updateField('talentos_naturales', e.target.value)} /></InputGroup>
      </div>
    </StepLayout>
  );

  const renderStep4 = () => (
    <StepLayout phase="CORE" title="Valores" description="Tu centro de gravedad" prev={prevStep} next={nextStep} current={4}>
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {VALUES_OPTIONS.map(val => (
            <button key={val.id} type="button" onClick={() => handleValueToggle(val.id)} className={`p-3 text-sm rounded-xl border transition-all ${formData.valores.includes(val.id) ? 'border-orange-400 bg-orange-400/10' : 'border-white/10 bg-slate-900/40'}`}>
              {val.icon} {val.label}
            </button>
          ))}
        </div>
        <InputGroup label="Explica tus 3 más importantes *"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.valores_top3} onChange={e => updateField('valores_top3', e.target.value)} /></InputGroup>
      </div>
    </StepLayout>
  );

  const renderStep5 = () => (
    <StepLayout phase="VISIÓN" title="Horizonte" description="¿Hacia dónde vamos?" prev={prevStep} next={nextStep} current={5}>
      <div className="space-y-8">
        <InputGroup label="¿Qué te hizo decir BASTA?"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.trigger} onChange={e => updateField('trigger', e.target.value)} /></InputGroup>
        <InputGroup label="Tu visión en 2 años"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.vision_2años} onChange={e => updateField('vision_2años', e.target.value)} /></InputGroup>
      </div>
    </StepLayout>
  );

  const renderStep6 = () => (
    <StepLayout phase="FINAL" title="Calibración" description="Últimos ajustes" prev={prevStep} next={handleSubmit} nextLabel="GENERAR BRIEFING 🚀" current={6}>
      <div className="space-y-8">
        <InputGroup label="¿Qué buscas principalmente?">
          <div className="space-y-2">
            {SEEKING_OPTIONS.map(opt => (
              <div key={opt.id} onClick={() => updateField('busca_principal', opt.id)} className={`custom-radio ${formData.busca_principal === opt.id ? 'selected' : ''}`}>
                <div className="radio-circle"><div className="radio-dot"></div></div>
                <span className="text-sm text-white">{opt.label}</span>
              </div>
            ))}
          </div>
        </InputGroup>
        <InputGroup label="Expectativa de la sesión"><textarea className="input-vibrant w-full min-h-[100px]" value={formData.expectativa_sesion} onChange={e => updateField('expectativa_sesion', e.target.value)} /></InputGroup>
      </div>
    </StepLayout>
  );

  const renderResult = () => (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="glass-vibrant p-10 rounded-[3rem] animate-in fade-in zoom-in duration-700">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-20 h-20 text-indigo-400 animate-spin mb-8" />
            <h2 className="text-3xl font-space text-white">ANALIZANDO TU SISTEMA...</h2>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="flex justify-between items-center border-b border-white/10 pb-8">
              <h2 className="text-4xl font-bold font-space text-white">Mission Briefing</h2>
              <div className="bg-indigo-500/20 p-4 rounded-2xl text-center">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest">Match Score</div>
                <div className="text-4xl font-bold text-indigo-400">{result?.fitScore}%</div>
              </div>
            </div>
            <section className="bg-white/5 p-6 rounded-2xl italic text-slate-200">"{result?.summary}"</section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultBox title="Fortalezas" color="text-emerald-400" icon={<Sparkles className="w-4 h-4"/>} items={result?.strengths} />
              <ResultBox title="Debilidades" color="text-red-400" icon={<AlertTriangle className="w-4 h-4"/>} items={result?.weaknesses} />
              <ResultBox title="Oportunidades" color="text-amber-400" icon={<Lightbulb className="w-4 h-4"/>} items={result?.opportunities} />
              <ResultBox title="Amenazas" color="text-violet-400" icon={<ShieldAlert className="w-4 h-4"/>} items={result?.threats} />
            </div>
            <div className="flex gap-4 pt-8">
              <button onClick={generatePDFReport} className="flex-1 py-6 flex items-center justify-center gap-3 btn-navigation rounded-2xl text-lg font-bold">
                <Download /> DESCARGAR PDF
              </button>
              <button onClick={() => setStep(-1)} className="px-8 py-6 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
                REINICIAR
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
      {step === 0 && <div className="flex items-center justify-center min-h-screen"><button onClick={nextStep} className="btn-navigation px-12 py-6 rounded-2xl">CONTINUAR</button></div>}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
      {step === 6 && renderStep6()}
      {step === 8 && renderResult()}
    </div>
  );
};

const ResultBox = ({ title, color, icon, items }: any) => (
  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
    <h4 className={`font-bold mb-4 flex items-center gap-2 uppercase text-xs tracking-widest ${color}`}>{icon} {title}</h4>
    <ul className="space-y-2">
      {items?.map((it: string, i: number) => <li key={i} className="text-sm text-slate-400 flex gap-2"><span>•</span> {it}</li>)}
    </ul>
  </div>
);

const StepLayout = ({ phase, title, description, children, prev, next, nextLabel, current }: any) => (
  <div className="max-w-3xl mx-auto py-12 px-6 animate-in slide-in-from-bottom-8 duration-500">
    <div className="flex flex-col items-center mb-8">
      <SpaceshipProgress step={current} />
      <div className="flex justify-between items-center w-full mb-2">
        <span className="phase-text">{phase}</span>
        <div className="step-counter">{current}/6</div>
      </div>
      <h1 className="text-4xl font-bold font-space text-white mb-2">{title}</h1>
      <p className="text-slate-400 text-center">{description}</p>
    </div>
    <div className="glass-vibrant p-10 rounded-[2.5rem]">
      {children}
      <div className="mt-12 flex items-center justify-end gap-6 border-t border-white/5 pt-8">
        {prev && <button onClick={prev} className="text-slate-400 uppercase text-xs font-bold hover:text-white">Atrás</button>}
        <button onClick={next} className="px-10 py-4 btn-navigation rounded-xl font-bold uppercase tracking-widest">{nextLabel || 'Siguiente'}</button>
      </div>
    </div>
  </div>
);

const InputGroup = ({ label, children }: any) => (
  <div className="space-y-3">
    <label className="block text-xs font-space font-bold text-sky-400 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

export default App;
