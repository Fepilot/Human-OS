
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
  Music,
  Binary,
  Target,
  FileText
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: <Layout className="w-4 h-4" /> },
  { id: 'insights', label: 'Insights', icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'experimento', label: 'Experimento', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'recursos', label: 'Recursos', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'plan', label: 'Plan 3 Meses', icon: <Target className="w-4 h-4" /> },
  { id: 'misiones', label: 'Misiones', icon: <Compass className="w-4 h-4" /> },
  { id: 'reservar', label: 'Reservar', icon: <Calendar className="w-4 h-4" /> },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [responses, setResponses] = useState({
    v1q1: '', v1q2: '', v1q3: '',
    v2q1: '', v2q2: '', v2q3: '',
    v3q1: '', v3q2: '', v3q3: '',
    reflex1: '', reflex2: '', reflex3: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('sergio_guide_responses');
    if (saved) setResponses(JSON.parse(saved));
  }, []);

  const handleInputChange = (id: string, value: string) => {
    const newResponses = { ...responses, [id]: value };
    setResponses(newResponses);
    localStorage.setItem('sergio_guide_responses', JSON.stringify(newResponses));
  };

  const copyPrompt = () => {
    const prompt = `Analiza las siguientes respuestas de mi ejercicio de reflexión profesional:
    
    ESCENARIO 1 (Marketing Analyst): ${responses.v1q1} | ${responses.v1q2} | ${responses.v1q3}
    ESCENARIO 2 (Music Data): ${responses.v2q1} | ${responses.v2q2} | ${responses.v2q3}
    ESCENARIO 3 (Híbrido): ${responses.v3q1} | ${responses.v3q2} | ${responses.v3q3}
    REFLEXIÓN: ${responses.reflex1} | ${responses.reflex2}
    
    Identifica valores recurrentes, contradicciones y dame 3 pasos concretos hacia mi carrera en Data Science.`;
    
    navigator.clipboard.writeText(prompt);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 3000);
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
    doc.text("HUMAN-OS // EXPERIMENTO", margin, 25);
    doc.setFontSize(10);
    doc.text("TRIPULANTE: SERGIO MORO GONZÁLEZ", margin, 35);
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

    addQA("Escenario Marketing", `${responses.v1q1}\n${responses.v1q2}\n${responses.v1q3}`);
    addQA("Escenario Music Data", `${responses.v2q1}\n${responses.v2q2}\n${responses.v2q3}`);
    addQA("Escenario Híbrido", `${responses.v3q1}\n${responses.v3q2}\n${responses.v3q3}`);
    addQA("Reflexión Final", `${responses.reflex1}\n${responses.reflex2}\n${responses.reflex3}`);

    doc.save("Experimento_SergioMoro_HumanOS.pdf");
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
          Guía de Re-incubación // Sergio Moro González
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
                <h2 className="text-3xl font-space font-bold text-white mb-6 uppercase tracking-tight">Bitácora de Navegación</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <MetaItem icon={<User />} label="Perfil" value="Comercio + Marketing" />
                  <MetaItem icon={<Binary />} label="Especialidad" value="Data Analysis" />
                  <MetaItem icon={<MapPin />} label="Origen" value="Asturias, ES" />
                  <MetaItem icon={<Music />} label="Pasión" value="Music Industry" />
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <SectionBlock title="Situación Actual" color="indigo">
                  <ul className="space-y-4 text-slate-300 text-sm">
                    <li className="flex gap-3">🎓 <p>Estudiante de máster reorientando su carrera hacia los datos.</p></li>
                    <li className="flex gap-3">🛠️ <p>CV y LinkedIn actualizados tras módulo especializado.</p></li>
                    <li className="flex gap-3">🔍 <p>En fase de búsqueda de su primer rol profesional en el sector.</p></li>
                    <li className="flex gap-3">📈 <p>Afinidad natural por las matemáticas y la estadística.</p></li>
                  </ul>
                </SectionBlock>

                <SectionBlock title="Fortalezas Confirmadas" color="emerald">
                  <ul className="space-y-4 text-slate-300 text-sm">
                    <li className="flex gap-3">⚖️ <p><strong>Disciplinado:</strong> Capacidad de mantener constancia y estructura.</p></li>
                    <li className="flex gap-3">🤝 <p><strong>Empático:</strong> Conexión genuina con las personas.</p></li>
                    <li className="flex gap-3">💎 <p><strong>Sincero:</strong> Autenticidad total en las interacciones.</p></li>
                    <li className="flex gap-3">🧘 <p><strong>Reflexivo:</strong> Pensamiento crítico y análisis profundo.</p></li>
                  </ul>
                </SectionBlock>

                <SectionBlock title="Puntos de Fricción" color="red">
                  <ul className="space-y-4 text-slate-300 text-sm">
                    <li className="flex gap-3">🛑 <p>Falta de experiencia práctica en el sector (inicio).</p></li>
                    <li className="flex gap-3">🌀 <p>Sobre-reflexión que deriva en parálisis por análisis.</p></li>
                    <li className="flex gap-3">❓ <p>Dudas sobre el nicho: ¿Marketing? ¿Música? ¿Ambos?</p></li>
                    <li className="flex gap-3">🔋 <p>Incertidumbre del salto formación → laboral.</p></li>
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
                  title="Tu mezcla es un Unicornio" 
                  content="Música + Datos + Marketing. La mayoría de los Data Scientists vienen de ingeniería pura. Tú vienes de marketing y te gusta la música. Empresas como Spotify, Apple Music o Universal necesitan gente que entienda el alma del negocio, no solo el código."
                  icon={<Zap className="w-5 h-5 text-indigo-400" />}
                />
                <InsightCard 
                  number="02" 
                  title="Reflexiona con Deadline" 
                  content="Tu pensamiento crítico es una ventaja competitiva brutal, pero hay una línea fina hacia la parálisis. Tu misión es aprender a 'reflexionar con cronómetro'. Si una decisión te toma más de X horas, estás perdiendo ejecución."
                  icon={<BrainCircuit className="w-5 h-5 text-indigo-400" />}
                />
                <InsightCard 
                  number="03" 
                  title="No necesitas el título 'Final' ahora" 
                  content="No tienes que empezar siendo Data Scientist. Roles de Analyst Junior, Marketing Ops o Business Intelligence son puertas de entrada perfectas. Una vez dentro del sistema, el crecimiento es orgánico."
                  icon={<ShieldAlert className="w-5 h-5 text-indigo-400" />}
                />
                <InsightCard 
                  number="04" 
                  title="Marca Personal en Beta" 
                  content="Tu marca no es 'soy experto en datos'. Tu marca es: 'Soy alguien curioso que combina marketing y música, y estoy construyendo mi camino en los datos'. La vulnerabilidad del aprendizaje atrae mentores."
                  icon={<Globe className="w-5 h-5 text-indigo-400" />}
                />
              </div>
              <div className="bg-white/5 p-12 rounded-[2.5rem] border border-white/10 italic text-xl text-slate-300 leading-relaxed text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-500"></div>
                "No necesitas ser perfecto. Necesitas ser consistente."
              </div>
            </div>
          )}

          {/* TAB: EXPERIMENTO */}
          {activeTab === 'experimento' && (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-8">
                <div>
                  <h2 className="text-3xl font-space font-bold text-white uppercase tracking-tight">Experimento de Tri-ubicación</h2>
                  <p className="text-slate-400">30-45 mins para decidir qué Sergio construir</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-xl hover:bg-indigo-500/30 transition-all text-xs font-bold">
                    <Download className="w-4 h-4" /> DESCARGAR PDF
                  </button>
                  <button onClick={copyPrompt} className="flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-300 rounded-xl hover:bg-pink-500/30 transition-all text-xs font-bold">
                    {showCopySuccess ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />} COPIAR PROMPT IA
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-12">
                <ScenarioBlock 
                  title="Versión 1: Sergio Data Analyst en Marketing" 
                  desc="Especialización en análisis de datos aplicado al marketing digital y comportamiento de clientes."
                  questions={[
                    { id: 'v1q1', label: '¿Cómo sería un día típico de trabajo?' },
                    { id: 'v1q2', label: '¿Qué tipo de problemas estarías resolviendo?' },
                    { id: 'v1q3', label: '¿Te ves trabajando así 5 años? ¿Qué te emociona/preocupa?' }
                  ]}
                  values={responses}
                  onChange={handleInputChange}
                />
                <ScenarioBlock 
                  title="Versión 2: Sergio Data Analyst en Industria Musical" 
                  desc="Trabajando en Spotify, sellos discográficos o startups de música analizando tendencias de streaming."
                  questions={[
                    { id: 'v2q1', label: '¿Cómo sería un día típico de trabajo?' },
                    { id: 'v2q2', label: '¿Qué tipo de problemas estarías resolviendo?' },
                    { id: 'v2q3', label: '¿Te ves trabajando así 5 años? ¿Qué te emociona/preocupa?' }
                  ]}
                  values={responses}
                  onChange={handleInputChange}
                />
                <ScenarioBlock 
                  title="Versión 3: Sergio Híbrido (Datos + Marketing + Música)" 
                  desc="Un camino propio donde el marketing es el trabajo base y la música el nicho o proyecto paralelo."
                  questions={[
                    { id: 'v3q1', label: '¿Cómo sería un día típico de trabajo?' },
                    { id: 'v3q2', label: '¿Qué tipo de problemas estarías resolviendo?' },
                    { id: 'v3q3', label: '¿Te ves trabajando así 5 años? ¿Qué te emociona/preocupa?' }
                  ]}
                  values={responses}
                  onChange={handleInputChange}
                />
                <ScenarioBlock 
                  title="Reflexión Final" 
                  desc="Alineación de valores y hallazgos."
                  questions={[
                    { id: 'reflex1', label: '¿Cuál de los tres escenarios te hace sentir más "TÚ"?' },
                    { id: 'reflex2', label: '¿Qué valores aparecen en el escenario ganador?' },
                    { id: 'reflex3', label: '¿Qué te sorprendió o incomodó del ejercicio?' }
                  ]}
                  values={responses}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* TAB: RECURSOS */}
          {activeTab === 'recursos' && (
            <div className="space-y-12">
              <h2 className="text-3xl font-space font-bold text-white uppercase tracking-tight">Recursos Prometidos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResourceCard 
                  title="Lecturas Recomendadas"
                  links={[
                    { label: 'Sapiens (Yuval Noah Harari)', url: 'https://www.amazon.es/Sapiens-Animales-dioses-breve-historia/dp/8483069681' },
                    { label: 'El monje que vendió su Ferrari (Robin Sharma)', url: 'https://www.amazon.es/monje-que-vendio-su-Ferrari/dp/8499088219' }
                  ]}
                />
                <ResourceCard 
                  title="Herramientas a Dominar"
                  items={['Excel/Sheets (Nivel Pro)', 'Python (Pandas, NumPy)', 'SQL (Fundamental)', 'Power BI / Tableau']}
                />
                <ResourceCard 
                  title="IA & Empleo"
                  items={['Carta de presentación honesta', 'Simulación de entrevistas técnicas', 'Análisis de keywords en ofertas']}
                />
                <ResourceCard 
                  title="Estrategia LinkedIn"
                  desc="Configura tu titular y el 'Acerca de' para que cuenten tu transición hacia Music Data Science."
                />
              </div>

              {/* CONFIGURACIÓN LINKEDIN */}
              <div className="space-y-6 pt-10 border-t border-white/10">
                <h3 className="text-2xl font-space font-bold text-white uppercase tracking-tight">Ejemplo de Marca Personal</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Sección "Acerca de"</h4>
                    <div className="p-6 bg-slate-900/80 rounded-2xl border border-white/5 font-mono text-xs text-slate-400 leading-relaxed overflow-y-auto max-h-64 whitespace-pre-wrap">
{`No siempre supe que quería trabajar con datos.

Estudié comercio y marketing porque me gustaba entender cómo las marcas conectan con las personas. Pero había algo más: siempre me han fascinado los números.

Cuando descubrí que podía combinar ambos mundos — marketing + datos — supe que ese era mi camino. Hoy estoy especializándome en análisis de datos, con un enfoque en marketing digital y comportamiento de clientes.

Y tengo un interés particular: Music Data Science.

Si hay algo que me apasiona tanto como los datos, es la música. ¿Predecir qué canción será la próxima viral? ¿Entender por qué ciertos géneros resuenan más? Ese es mi objetivo.

Si trabajas en datos, marketing o industria musical, conectemos. Siempre dispuesto a aprender.`}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Titular Sugerido</h4>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-full flex items-center justify-center italic text-slate-300">
                      "Data Analyst en formación | Marketing + Música + Datos | Futuro Music Data Scientist"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PLAN */}
          {activeTab === 'plan' && (
            <div className="space-y-12">
              <h2 className="text-3xl font-space font-bold text-white uppercase tracking-tight">Plan de Acción (3 Meses)</h2>
              <div className="grid grid-cols-1 gap-8">
                <PlanMonth 
                  month="MES 1" 
                  title="Claridad + Marca Personal"
                  tasks={[
                    'Hacer el ejercicio de las 3 versiones de Sergio.',
                    'Actualizar LinkedIn (Acerca de + Titular).',
                    'Leer "Sapiens" (empezar perspectiva crítica).'
                  ]}
                  secondaryTasks={[
                    'Publicar primer post contando tu historia.',
                    'Conectar con 20 perfiles de data/marketing.',
                    'Completar 1 curso corto de Python o SQL.'
                  ]}
                />
                <PlanMonth 
                  month="MES 2" 
                  title="Práctica + Networking"
                  tasks={[
                    'Crear 1 proyecto pequeño de análisis (ej: Spotify data).',
                    'Publicar el resultado/aprendizaje en LinkedIn.',
                    'Enviar 10 mensajes pidiendo 15 min de feedback.'
                  ]}
                  secondaryTasks={[
                    'Aplicar a 10 ofertas de prácticas o junior.',
                    'Personalizar cada aplicación según el nicho.',
                    'Simular entrevistas con IA.'
                  ]}
                />
                <PlanMonth 
                  month="MES 3" 
                  title="Aceleración + Oportunidades"
                  tasks={[
                    'Objetivo: 5-10 aplicaciones de calidad por semana.',
                    'Publicar 2 posts adicionales sobre tus avances.',
                    'Asistir a 1 evento/meetup presencial de datos.'
                  ]}
                  secondaryTasks={[
                    'Revisar progreso: ¿Qué ha funcionado?',
                    'Ajustar estrategia según feedback de entrevistas.',
                    'Celebrar pequeñas victorias de aprendizaje.'
                  ]}
                />
              </div>
            </div>
          )}

          {/* TAB: MISIONES */}
          {activeTab === 'misiones' && (
            <div className="space-y-12">
              <h2 className="text-3xl font-space font-bold text-white uppercase tracking-tight">Misiones Disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <MissionCard 
                  title="Mentoría Mantenimiento"
                  price="60€"
                  period="sesión"
                  desc="Sesión única de 1 hora para revisar tu experimento, darte feedback sobre tu LinkedIn y ajustar tu plan de 3 meses según tus avances."
                  cta="Elegir Misión"
                  onClick={() => setActiveTab('reservar')}
                />
                <MissionCard 
                  title="Mentoría Mensual"
                  price="150€"
                  period="mes"
                  desc="3 sesiones mensuales (1h c/u). Acompañamiento continuo en tu transición. Incluye revisión de aplicaciones y soporte por LinkedIn."
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
                <h2 className="text-4xl font-space font-bold text-white mb-4 uppercase tracking-tighter">Reservar Seguimiento</h2>
                <p className="text-slate-400 max-w-lg mb-12 text-lg">Reserva tu sesión conmigo para revisar tu experimento y definir los próximos pasos de tu ruta en Data Science.</p>
                
                <a href="https://calendly.com/ferpilot-ia/meeting-with-fer?utm_source=schedule_from_linkedin&month=2026-02" target="_blank" rel="noreferrer" className="px-16 py-6 btn-navigation rounded-[2rem] text-xl uppercase tracking-widest flex items-center gap-4 transition-transform hover:scale-105">
                  Reservar con Fer <ExternalLink className="w-6 h-6" />
                </a>
              </div>

              <div className="pt-16 border-t border-white/10">
                <h3 className="text-2xl font-space font-bold text-white uppercase tracking-tight mb-8">Cómo seguimos en contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center gap-4 group hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h4 className="text-white font-bold">LinkedIn</h4>
                    <p className="text-xs text-slate-500">Ya te sigo. Estaré atento a tus posts para comentar y darte visibilidad.</p>
                  </div>

                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center gap-4 group hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6 text-pink-400" />
                    </div>
                    <h4 className="text-white font-bold">Feedback</h4>
                    <p className="text-xs text-slate-500">Si aplicas algo de lo que hablamos y te sirve, ¡no dudes en contármelo!</p>
                  </div>

                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center gap-4 group hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-white font-bold">Email Directo</h4>
                    <p className="text-xs text-slate-500">Para cualquier duda puntual o formal: ferpilot.ia@gmail.com</p>
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
        <p className="mt-1">Dossier de Re-incubación para Sergio Moro González</p>
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

const ScenarioBlock = ({ title, desc, questions, values, onChange }: any) => (
  <div className="space-y-6">
    <div className="border-l-4 border-indigo-500 pl-6">
      <h4 className="text-2xl font-space font-bold text-white uppercase tracking-tight">{title}</h4>
      <p className="text-sm text-slate-500 font-medium">{desc}</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {questions.map((q: any) => (
        <div key={q.id} className="space-y-3">
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{q.label}</label>
          <textarea 
            value={values[q.id]}
            onChange={(e) => onChange(q.id, e.target.value)}
            className="input-vibrant w-full h-40 resize-none text-xs leading-relaxed"
            placeholder="Introduce tu reflexión aquí..."
          />
        </div>
      ))}
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
