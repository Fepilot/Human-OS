
import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Orbit, 
  Download, 
  Clipboard, 
  Check, 
  Sparkles, 
  Compass, 
  BookOpen, 
  Layout, 
  Lightbulb, 
  Calendar,
  ExternalLink,
  MessageSquare,
  User,
  MapPin,
  Clock,
  Briefcase,
  Mail,
  Zap,
  ShieldAlert,
  BrainCircuit,
  Globe,
  Target,
  FileText,
  AlertTriangle,
  Grid,
  Copy
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: <Layout className="w-4 h-4" /> },
  { id: 'insights', label: 'Insights', icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'matriz', label: 'La Matriz', icon: <Grid className="w-4 h-4" /> },
  { id: 'recursos', label: 'Recursos', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'plan', label: 'Plan 3 Meses', icon: <Target className="w-4 h-4" /> },
  { id: 'misiones', label: 'Misiones', icon: <Compass className="w-4 h-4" /> },
  { id: 'reservar', label: 'Reservar', icon: <Calendar className="w-4 h-4" /> },
];

const AI_PROMPTS = [
  {
    label: "Simulación L'Oreal / Publicis",
    prompt: "Actúa como un reclutador senior de L'Oreal o Publicis. Entrevístame para un rol de Junior Brand Manager o Account Executive. Mi perfil destaca por resiliencia extrema (gestioné TFG, prácticas y retail simultáneamente) y comunicación persuasiva natural. Hazme preguntas difíciles sobre cómo mi paso por el retail me da una ventaja real para entender al consumidor masivo. Dame feedback honesto después de cada una de mis respuestas."
  },
  {
    label: "Análisis de Keywords ATS",
    prompt: "Analiza la siguiente oferta de trabajo [PEGAR AQUÍ LA OFERTA]. Extrae las 10 habilidades técnicas y blandas más críticas. Compáralas con mi perfil de Marketing + Experiencia en Retail. Genera una lista de palabras clave (keywords) que debo insertar en mi CV y LinkedIn para que el algoritmo de una gran multinacional me posicione como candidata TOP."
  },
  {
    label: "Carta de Presentación 'Human-OS'",
    prompt: "Escribe una carta de presentación disruptiva para [EMPRESA]. Usa un tono profesional pero muy humano. Menciona que tengo un 'motor de Ferrari' y que he demostrado mi capacidad de entrega bajo presión extrema este último año. Destaca que mi experiencia doblando camisetas en Zara me enseñó más sobre psicología del consumidor que tres años de carrera, y por qué eso me hace la candidata ideal para su equipo de marketing."
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [responses, setResponses] = useState({
    cuad1: '', cuad2: '', cuad3: '', cuad4: '',
    compromiso1: '', compromiso2: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('giovanna_guide_responses');
    if (saved) setResponses(JSON.parse(saved));
  }, []);

  const handleInputChange = (id: string, value: string) => {
    const newResponses = { ...responses, [id]: value };
    setResponses(newResponses);
    localStorage.setItem('giovanna_guide_responses', JSON.stringify(newResponses));
  };

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } else {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 3000);
    }
  };

  const copyPrompt = () => {
    const prompt = `Analiza mi Matriz de la Excelencia para mi carrera en Marketing:
    
    ZONA EXCELENCIA: ${responses.cuad1}
    AUTOMATIZAR: ${responses.cuad2}
    ELIMINAR: ${responses.cuad3}
    SUFICIENTE: ${responses.cuad4}
    COMPROMISO: Mover mi perfeccionismo de "${responses.compromiso1}" hacia "${responses.compromiso2}"
    
    Dime si estoy priorizando bien para llegar a marcas como L'Oreal o Publicis y dame 3 consejos estratégicos.`;
    copyToClipboard(prompt);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 30;

    doc.setFillColor(5, 7, 10);
    doc.rect(0, 0, 210, 50, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("HUMAN-OS // LA MATRIZ", margin, 25);
    doc.setFontSize(10);
    doc.text("TRIPULANTE: GIOVANNA FERREIRA MOTA", margin, 35);
    doc.text("FECHA: FEBRERO 2025", margin, 40);

    y = 65;
    doc.setTextColor(15, 23, 42);
    
    const addQA = (q: string, a: string) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(q.toUpperCase(), margin, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const split = doc.splitTextToSize(a || "Sin respuesta", 170);
      doc.text(split, margin, y);
      y += (split.length * 5) + 8;
    };

    addQA("Zona de Excelencia (Foco Total)", responses.cuad1);
    addQA("Automatizar (Bien, no perfecto)", responses.cuad2);
    addQA("Eliminar (Drenaje de energía)", responses.cuad3);
    addQA("Suficiente (Good enough)", responses.cuad4);
    addQA("Compromiso de Cambio", `Mover perfeccionismo de: ${responses.compromiso1} → Hacia: ${responses.compromiso2}`);

    doc.save("Matriz_Excelencia_Giovanna.pdf");
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-10">
      <div className="max-w-5xl mx-auto mb-12 text-center">
        <div className="flex justify-center mb-6">
          <Orbit className="w-16 h-16 text-indigo-400 animate-pulse" />
        </div>
        <h1 className="text-6xl md:text-8xl font-space font-bold text-white tracking-tighter text-glow mb-2">
          Human-OS
        </h1>
        <p className="font-space text-indigo-400 tracking-[0.3em] uppercase text-sm font-bold">
          Guía de Re-incubación // Giovanna Ferreira Mota
        </p>
      </div>

      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-space text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeTab === tab.id 
                ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="glass-vibrant p-8 md:p-12 rounded-[3rem] animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* TAB: RESUMEN */}
          {activeTab === 'resumen' && (
            <div className="space-y-12">
              <header className="border-b border-white/10 pb-8">
                <div className="flex justify-between items-start mb-6">
                   <h2 className="text-3xl font-space font-bold text-white uppercase tracking-tight">Bitácora de Navegación</h2>
                   <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-2 animate-pulse">
                     <AlertTriangle className="w-4 h-4 text-red-400" />
                     <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Alerta Burnout</span>
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <MetaItem icon={<User />} label="Perfil" value="Ferrari en Retail" />
                  <MetaItem icon={<Briefcase />} label="Objetivo" value="L'Oreal / Publicis" />
                  <MetaItem icon={<Clock />} label="Timeline" value="Fin de Carrera + TFG" />
                  <MetaItem icon={<Sparkles />} label="Superpoder" value="Argumentación" />
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <SectionBlock title="Situación Actual" color="indigo">
                  <p className="text-indigo-300 font-bold text-sm mb-4">"Motor de Ferrari para ir a por el pan."</p>
                  <ul className="space-y-4 text-slate-300 text-sm">
                    <li className="flex gap-3">🎓 <p>Terminando Marketing + TFG bajo máxima presión.</p></li>
                    <li className="flex gap-3">🎪 <p>Malabarista: Carrera + Prácticas + Trabajo Retail.</p></li>
                    <li className="flex gap-3">🔋 <p>"Frustrada funcional": Cumples, pero pides pista.</p></li>
                  </ul>
                </SectionBlock>

                <SectionBlock title="Fortalezas (Las Reales)" color="emerald">
                  <ul className="space-y-4 text-slate-300 text-sm">
                    <li className="flex gap-3">🛡️ <p><strong>Resiliencia:</strong> Gestión de 4 frentes simultáneos.</p></li>
                    <li className="flex gap-3">🎭 <p><strong>Persuasión:</strong> Habilidad "dramática" para convencer.</p></li>
                    <li className="flex gap-3">💎 <p><strong>Perfeccionista:</strong> Compromiso total con el 100%.</p></li>
                    <li className="flex gap-3">❤️ <p><strong>Empatía:</strong> Conexión real con necesidades humanas.</p></li>
                  </ul>
                </SectionBlock>

                <SectionBlock title="Puntos de Fricción" color="red">
                  <ul className="space-y-4 text-slate-300 text-sm">
                    <li className="flex gap-3">🛑 <p>Comparación tóxica con el highlight reel de LinkedIn.</p></li>
                    <li className="flex gap-3">🧥 <p>Drenaje energético doblando camisetas en Zara.</p></li>
                    <li className="flex gap-3">🌀 <p>Perfeccionismo mal enfocado en tareas sin impacto.</p></li>
                    <li className="flex gap-3">⌛ <p>Miedo a ir "tarde" a los 24 años.</p></li>
                  </ul>
                </SectionBlock>
              </div>
            </div>
          )}

          {/* TAB: INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="space-y-10">
              <h2 className="text-3xl font-space font-bold text-white mb-10 uppercase tracking-tight text-glow">Visión del Sistema</h2>
              <div className="grid grid-cols-1 gap-6">
                <InsightCard 
                  number="01" 
                  title="Enfoca tu Perfeccionismo" 
                  content="Tu problema no es ser perfeccionista, sino DÓNDE lo pones. Doblar camisetas perfectamente no te da la carrera que quieres. Tu carta para L'Oreal sí. Elige tus batallas con pinzas quirúrgicas."
                  icon={<Zap className="w-5 h-5 text-indigo-400" />}
                />
                <InsightCard 
                  number="02" 
                  title="Lo 'Dramático' es Negociación" 
                  content="Lo que antes llamaban defecto, las empresas lo llaman 'Comunicación Persuasiva'. Los equipos de ventas y cuentas matan por gente que defienda ideas con esa pasión natural. Es tu activo nº1."
                  icon={<BrainCircuit className="w-5 h-5 text-indigo-400" />}
                />
                <InsightCard 
                  number="03" 
                  title="El Retail tiene Fecha de Caducidad" 
                  content="Cada fin de semana en retail es tiempo que no dedicas a aplicaciones o descanso. No renuncies mañana, pero pon una condición de salida: 'Cuando tenga 10 aplicaciones y 5 entrevistas, me voy'."
                  icon={<ShieldAlert className="w-5 h-5 text-indigo-400" />}
                />
                <InsightCard 
                  number="04" 
                  title="LinkedIn es Ficción Selectiva" 
                  content="Apaga el radar de comparación. Ves los éxitos de otros pero no sus 50 rechazos previos. Tu marca personal debe ser honesta, no una copia de lo que crees que 'debería ser'."
                  icon={<Globe className="w-5 h-5 text-indigo-400" />}
                />
              </div>
              <div className="bg-white/5 p-12 rounded-[2.5rem] border border-white/10 italic text-xl text-slate-300 leading-relaxed text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-500"></div>
                "El burnout no viene de hacer mucho. Viene de hacer mucho por otros y nada por ti."
              </div>
            </div>
          )}

          {/* TAB: LA MATRIZ */}
          {activeTab === 'matriz' && (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-8">
                <div>
                  <h2 className="text-3xl font-space font-bold text-white uppercase tracking-tight">Matriz de la Excelencia</h2>
                  <p className="text-slate-400">Decide dónde poner tu energía estratégica</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-xl hover:bg-indigo-500/30 transition-all text-xs font-bold">
                    <Download className="w-4 h-4" /> DESCARGAR MATRIZ
                  </button>
                  <button onClick={copyPrompt} className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-300 rounded-xl hover:bg-pink-500/30 transition-all text-xs font-bold">
                    {showCopySuccess ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />} COPIAR PROMPT IA
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <MatrixQuadrant 
                   title="Zona de Excelencia"
                   subtitle="Alto Impacto + Alto Esfuerzo"
                   desc="Aquí SÍ pon tu perfeccionismo al máximo."
                   color="emerald"
                   id="cuad1"
                   value={responses.cuad1}
                   onChange={handleInputChange}
                   examples={['Cartas para L\'Oreal', 'Portfolio (TFG)', 'Prep. Entrevistas']}
                />
                <MatrixQuadrant 
                   title="Automatizar"
                   subtitle="Alto Impacto + Bajo Esfuerzo"
                   desc="Hazlo rápido y bien. No perfecto."
                   color="amber"
                   id="cuad2"
                   value={responses.cuad2}
                   onChange={handleInputChange}
                   examples={['LinkedIn Updates', 'Alertas de empleo', 'Templates de email']}
                />
                <MatrixQuadrant 
                   title="Eliminar"
                   subtitle="Bajo Impacto + Alto Esfuerzo"
                   desc="DEJA de poner energía aquí. YA."
                   color="red"
                   id="cuad3"
                   value={responses.cuad3}
                   onChange={handleInputChange}
                   examples={['Turnos extra retail', 'Doblado perfecto Zara', 'Comparación LinkedIn']}
                />
                <MatrixQuadrant 
                   title="Suficiente"
                   subtitle="Bajo Impacto + Bajo Esfuerzo"
                   desc="'Good enough' es suficiente."
                   color="indigo"
                   id="cuad4"
                   value={responses.cuad4}
                   onChange={handleInputChange}
                   examples={['Limpieza de casa', 'Trabajos clase (Aprobar)', 'Emails no urgentes']}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                <div className="space-y-4">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Voy a mover mi perfeccionismo DE:</label>
                  <input 
                    type="text"
                    value={responses.compromiso1}
                    onChange={(e) => handleInputChange('compromiso1', e.target.value)}
                    className="input-vibrant w-full"
                    placeholder="Ej: Doblar camisetas perfectamente"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">HACIA:</label>
                  <input 
                    type="text"
                    value={responses.compromiso2}
                    onChange={(e) => handleInputChange('compromiso2', e.target.value)}
                    className="input-vibrant w-full"
                    placeholder="Ej: Escribir 3 cartas de presentación impecables"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: RECURSOS */}
          {activeTab === 'recursos' && (
            <div className="space-y-12">
              <h2 className="text-3xl font-space font-bold text-white uppercase tracking-tight">Recursos Estratégicos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResourceCard 
                  title="Lectura Crítica"
                  links={[
                    { label: 'El Arte de Decir No (Hedwig Montgomery)', url: 'https://www.amazon.es/-/en/El-arte-decir-NUEVA-CONSCIENCIA/dp/8491113312/ref=sr_1_1?adgrpid=1302921714773303&dib=eyJ2IjoiMSJ9.srk9bCfIIvui7uL3DkVYzTfxdHTnm31pt98WmLEHhrciKaMiYb2yc2mxFCYHx4lHAfo0KGA83hQCNh5lVBmMZGo2eVwMmOtG4qhv-UyMIvF2864ae7dZ6lCfBrwYagkPyEsrvapGdv7c_vc4L-BuFQ.39JOBAIeBVrbrG21x5-5Xiti8vxxdXmLxOsR64K2Rms&dib_tag=se&hvadid=81432696434942&hvbmt=be&hvdev=c&hvlocphy=164430&hvnetw=o&hvqmt=e&hvtargid=kwd-81432846048880%3Aloc-170&hydadcr=27112_1849987&keywords=el+arte+de+decir+que+no&mcid=484418dfe7cc3ab59d2197376f0f65ae&msclkid=6cbf08ecd41310ecd5db616136004f85&qid=1770906135&sr=8-1' }
                  ]}
                  desc="Fundamental para proteger tu energía vital y enfocar tu perfeccionismo."
                />
                
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col h-full">
                  <h4 className="text-white font-space font-bold mb-4 uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3 text-indigo-400" /> Prompts para IA
                  </h4>
                  <p className="text-slate-400 text-xs mb-4 leading-relaxed">Copia y pega estos comandos optimizados en ChatGPT o Claude.</p>
                  <ul className="space-y-3">
                    {AI_PROMPTS.map((item, i) => (
                      <li key={i} className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-indigo-500/20 transition-all">
                        <span className="text-slate-300 text-[11px] font-medium truncate">{item.label}</span>
                        <button 
                          onClick={() => copyToClipboard(item.prompt, i)}
                          className="p-2 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-lg text-indigo-400 transition-all flex items-center gap-2"
                        >
                          {copiedIndex === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span className="text-[9px] font-bold uppercase tracking-tighter">Copiar</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <ResourceCard 
                  title="Marca LinkedIn"
                  items={['Banner (Ya está perfecto)', 'Sección Acerca de (Honesta)', 'Posts de aprendizaje real']}
                />
                <ResourceCard 
                  title="Búsqueda de Empleo"
                  desc="Usa los prompts de arriba para analizar descripciones de puestos en tiempo real."
                />
              </div>

              <div className="space-y-6 pt-10 border-t border-white/10">
                <h3 className="text-2xl font-space font-bold text-white uppercase tracking-tight">Estrategia de LinkedIn</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Propuesta de "Acerca de"</h4>
                    <div className="p-6 bg-slate-900/80 rounded-2xl border border-white/5 font-mono text-xs text-slate-400 leading-relaxed overflow-y-auto max-h-64 whitespace-pre-wrap">
{`No sé si alguna vez has intentado hacer malabarismos con 4 pelotas a la vez. Yo sí.

Durante el último año he estado terminando Marketing, el TFG sobre IA, prácticas y trabajando fines de semana en retail. He aprendido que la resiliencia no es aguantar todo, sino saber dónde poner la energía.

Tengo 24 años, sé usar las palabras para persuadir y sé trabajar bajo presión real. Busco equipos de creatividad estratégica donde escuchar al cliente sea el punto de partida.

No soy la candidata perfecta, pero voy a dar el 100% en lo que importa.`}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Idea de Post Viral</h4>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-full flex flex-col justify-center italic text-slate-300 text-sm">
                      <p>"He trabajado en retail 2 años. ¿Qué aprendí para marketing?"</p>
                      <ul className="mt-4 space-y-2 text-xs text-slate-400">
                        <li>1. El cliente no siempre dice lo que quiere.</li>
                        <li>2. La persuasión no es manipular, es conectar.</li>
                        <li>3. La presión enseña a priorizar.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PLAN */}
          {activeTab === 'plan' && (
            <div className="space-y-12">
              <h2 className="text-3xl font-space font-bold text-white uppercase tracking-tight">Plan de Despegue (3 Meses)</h2>
              <div className="grid grid-cols-1 gap-8">
                <PlanMonth 
                  month="MES 1" 
                  title="Filtro y Enfoque"
                  tasks={[
                    'Completar la Matriz de la Excelencia.',
                    'Actualizar LinkedIn con el nuevo "Acerca de".',
                    'Definir fecha de caducidad del trabajo retail.'
                  ]}
                  secondaryTasks={[
                    'Decir NO a turnos extra que te quiten TFG.',
                    'Contactar con 5 recruiters de agencias.',
                    'Revisar el TFG como pieza de portfolio.'
                  ]}
                />
                <PlanMonth 
                  month="MES 2" 
                  title="Ejecución de Alto Impacto"
                  tasks={[
                    'Enviar 5 aplicaciones ultra-personalizadas.',
                    'Publicar 2 posts en LinkedIn sobre tu TFG/IA.',
                    'Simular entrevistas con IA cada semana.'
                  ]}
                  secondaryTasks={[
                    'Ignorar el feed de LinkedIn de tus compañeros.',
                    'Networking con 10 profesionales de marcas TOP.',
                    'Finalizar el TFG (Good enough es OK).'
                  ]}
                />
                <PlanMonth 
                  month="MES 3" 
                  title="Salto al Sistema"
                  tasks={[
                    'Objetivo: 2 entrevistas reales por semana.',
                    'Ejecutar salida del retail si hay oferta.',
                    'Ajustar narrativa según feedback de entrevistas.'
                  ]}
                  secondaryTasks={[
                    'Celebrar el fin de carrera.',
                    'Seguir aportando valor en LinkedIn.',
                    'Mantener el foco en la Zona de Excelencia.'
                  ]}
                />
              </div>
            </div>
          )}

          {/* TAB: MISIONES */}
          {activeTab === 'misiones' && (
            <div className="space-y-12">
              <h2 className="text-3xl font-space font-bold text-white uppercase tracking-tight">Misiones de Mentoría</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <MissionCard 
                  title="Misión Mantenimiento"
                  price="60€"
                  period="sesión"
                  desc="Sesión de 1h para revisar tu Matriz, ajustar tu LinkedIn y prepararte para una entrevista específica."
                  cta="Elegir Misión"
                  onClick={() => setActiveTab('reservar')}
                />
                <MissionCard 
                  title="Misión Re-incubación"
                  price="150€"
                  period="mes"
                  desc="Acompañamiento total (3 sesiones/mes). Revisión de aplicaciones, soporte directo y foco en evitar el burnout."
                  cta="Elegir Misión"
                  featured
                  onClick={() => setActiveTab('reservar')}
                />
              </div>
            </div>
          )}

          {/* TAB: RESERVAR */}
          {activeTab === 'reservar' && (
            <div className="space-y-16">
              <div className="flex flex-col items-center py-10 text-center">
                <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8">
                  <Calendar className="w-12 h-12 text-indigo-400" />
                </div>
                <h2 className="text-4xl font-space font-bold text-white mb-4 uppercase tracking-tighter">Próxima Sesión</h2>
                <p className="text-slate-400 max-w-lg mb-12 text-lg">Reserva tu sesión de seguimiento para revisar tu Matriz y preparar tu estrategia de marcas TOP.</p>
                
                <a href="https://calendly.com/ferpilot-ia/meeting-with-fer?utm_source=schedule_from_linkedin&month=2026-02" target="_blank" rel="noreferrer" className="px-16 py-6 btn-navigation rounded-[2rem] text-xl uppercase tracking-widest flex items-center gap-4 transition-transform hover:scale-105">
                  Reservar con Fer <ExternalLink className="w-6 h-6" />
                </a>
              </div>

              <div className="pt-16 border-t border-white/10">
                <h3 className="text-2xl font-space font-bold text-white uppercase tracking-tight mb-8">Canales Abiertos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center gap-4 group hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h4 className="text-white font-bold">LinkedIn</h4>
                    <p className="text-xs text-slate-500">Ya te sigo. Estaré atento a tus posts para apoyarte.</p>
                  </div>

                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center gap-4 group hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6 text-pink-400" />
                    </div>
                    <h4 className="text-white font-bold">Feedback</h4>
                    <p className="text-xs text-slate-500">Si aplicas la Matriz y funciona, ¡cuéntame los resultados!</p>
                  </div>

                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center gap-4 group hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-white font-bold">Email Directo</h4>
                    <p className="text-xs text-slate-500">Para cualquier duda puntual: ferpilot.ia@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <footer className="mt-20 text-center text-slate-600 font-space text-[10px] tracking-widest uppercase">
        <div className="flex justify-center gap-6 mb-4">
          <ContactLink icon={<MessageSquare className="w-4 h-4"/>} label="LinkedIn" url="https://linkedin.com/in/ferberdugo" />
          <ContactLink icon={<Mail className="w-4 h-4"/>} label="Email" url="mailto:ferpilot.ia@gmail.com" />
        </div>
        <p>© 2025 Human-OS // Fer Berdugo</p>
        <p className="mt-1">Dossier de Re-incubación para Giovanna Ferreira Mota</p>
      </footer>
    </div>
  );
};

// UI COMPONENTS

const MetaItem = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
    <div className="text-indigo-400">{icon}</div>
    <div>
      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{label}</p>
      <p className="text-xs text-white font-medium truncate max-w-[120px]">{value}</p>
    </div>
  </div>
);

const SectionBlock = ({ title, color, children }: any) => (
  <div className="h-full flex flex-col">
    <h3 className={`text-${color}-400 font-space font-bold uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2`}>
      <div className={`w-1.5 h-1.5 rounded-full bg-${color}-400`} /> {title}
    </h3>
    <div className="space-y-4 flex-grow">{children}</div>
  </div>
);

const InsightCard = ({ number, title, content, icon }: any) => (
  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 flex gap-6 hover:bg-white/10 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      {icon}
    </div>
    <span className="text-4xl font-space font-bold text-indigo-500/20 group-hover:text-indigo-500 transition-colors shrink-0">{number}</span>
    <div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{content}</p>
    </div>
  </div>
);

const MatrixQuadrant = ({ title, subtitle, desc, color, id, value, onChange, examples }: any) => (
  <div className={`p-8 bg-white/5 rounded-[2.5rem] border border-${color}-500/20 hover:border-${color}-500/40 transition-all flex flex-col h-full`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h4 className={`text-xl font-space font-bold text-white uppercase`}>{title}</h4>
        <p className={`text-[10px] text-${color}-400 font-bold uppercase tracking-widest`}>{subtitle}</p>
      </div>
    </div>
    <p className="text-xs text-slate-500 mb-6">{desc}</p>
    <textarea 
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
      className="input-vibrant w-full h-32 resize-none text-xs leading-relaxed mb-4"
      placeholder="Introduce actividades aquí..."
    />
    <div className="mt-auto">
      <h5 className="text-[10px] text-slate-600 uppercase font-bold tracking-widest mb-2">Ejemplos:</h5>
      <div className="flex flex-wrap gap-2">
        {examples.map((ex: string, i: number) => (
          <span key={i} className="px-2 py-1 bg-white/5 rounded-md text-[9px] text-slate-400 border border-white/5">{ex}</span>
        ))}
      </div>
    </div>
  </div>
);

const ResourceCard = ({ title, links, items, desc }: any) => (
  <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-indigo-500/30 transition-all flex flex-col h-full">
    <h4 className="text-white font-space font-bold mb-4 uppercase text-[10px] tracking-widest flex items-center gap-2">
      <Zap className="w-3 h-3 text-indigo-400" /> {title}
    </h4>
    {desc && <p className="text-slate-400 text-xs mb-4 leading-relaxed">{desc}</p>}
    <ul className="space-y-3 mt-auto">
      {links?.map((l: any, i: number) => (
        <li key={i}>
          <a href={l.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-2">
            <ExternalLink className="w-3 h-3" /> {l.label}
          </a>
        </li>
      ))}
      {items?.map((item: string, i: number) => (
        <li key={i} className="text-slate-300 text-xs flex gap-2"><span>•</span> {item}</li>
      ))}
    </ul>
  </div>
);

const MissionCard = ({ title, price, period, desc, cta, featured, onClick }: any) => (
  <div className={`p-10 rounded-[2.5rem] border ${featured ? 'bg-indigo-500/10 border-indigo-500/40 shadow-2xl shadow-indigo-500/10' : 'bg-white/5 border-white/10'} space-y-6 flex flex-col`}>
    <div className="flex justify-between items-start">
      <h4 className="text-xl font-space font-bold text-white uppercase tracking-tight">{title}</h4>
      <div className="text-right">
        <p className="text-3xl font-bold text-white">{price}</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest">/ {period}</p>
      </div>
    </div>
    <p className="text-slate-300 text-sm leading-relaxed flex-grow">{desc}</p>
    <button onClick={onClick} className={`w-full py-4 rounded-2xl font-space font-bold uppercase tracking-widest text-[10px] transition-all ${featured ? 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/20' : 'bg-white/10 text-white hover:bg-white/20'}`}>
      {cta}
    </button>
  </div>
);

const PlanMonth = ({ month, title, tasks, secondaryTasks }: any) => (
  <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/4">
        <span className="text-sm font-space font-bold text-indigo-400 tracking-widest uppercase">{month}</span>
        <h4 className="text-2xl font-space font-bold text-white uppercase leading-tight mt-2">{title}</h4>
      </div>
      <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h5 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Misiones Críticas</h5>
          <ul className="space-y-3">
            {tasks.map((task: string, i: number) => (
              <li key={i} className="flex gap-3 text-xs text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> {task}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Aceleración</h5>
          <ul className="space-y-3">
            {secondaryTasks.map((task: string, i: number) => (
              <li key={i} className="flex gap-3 text-xs text-slate-400 italic">
                <Rocket className="w-4 h-4 text-indigo-500 shrink-0" /> {task}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ContactLink = ({ icon, label, url }: any) => (
  <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors font-space text-[10px] font-bold uppercase tracking-widest">
    {icon} {label}
  </a>
);

export default App;
