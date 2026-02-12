
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
  Globe
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: <Layout className="w-4 h-4" /> },
  { id: 'insights', label: 'Insights', icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'experimento', label: 'Experimento', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'recursos', label: 'Recursos', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'proximos', label: 'Misiones', icon: <Compass className="w-4 h-4" /> },
  { id: 'reservar', label: 'Reservar', icon: <Calendar className="w-4 h-4" /> },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('resumen');
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [responses, setResponses] = useState({
    s1q1: '', s1q2: '', s1q3: '',
    s2q1: '', s2q2: '', s2q3: '',
    s3q1: '', s3q2: '', s3q3: '',
    reflex1: '', reflex2: '', reflex3: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('fernanda_guide_responses');
    if (saved) setResponses(JSON.parse(saved));
  }, []);

  const handleInputChange = (id: string, value: string) => {
    const newResponses = { ...responses, [id]: value };
    setResponses(newResponses);
    localStorage.setItem('fernanda_guide_responses', JSON.stringify(newResponses));
  };

  const copyPrompt = () => {
    const prompt = `Analiza las siguientes respuestas de mi ejercicio de reflexión profesional:
    
    ESCENARIO 1 (México): ${responses.s1q1} | ${responses.s1q2} | ${responses.s1q3}
    ESCENARIO 2 (Madrid): ${responses.s2q1} | ${responses.s2q2} | ${responses.s2q3}
    ESCENARIO 3 (Híbrido): ${responses.s3q1} | ${responses.s3q2} | ${responses.s3q3}
    REFLEXIÓN: ${responses.reflex1} | ${responses.reflex2}
    
    Identifica mis valores recurrentes, contradicciones y dame 3 pasos concretos.`;
    
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
    doc.text("TRIPULANTE: FERNANDA VILLANUEVA", margin, 35);
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

    addQA("Escenario México", `${responses.s1q1}\n${responses.s1q2}\n${responses.s1q3}`);
    addQA("Escenario Madrid", `${responses.s2q1}\n${responses.s2q2}\n${responses.s2q3}`);
    addQA("Escenario Híbrido", `${responses.s3q1}\n${responses.s3q2}\n${responses.s3q3}`);
    addQA("Reflexión Final", `${responses.reflex1}\n${responses.reflex2}`);

    doc.save("Experimento_Fernanda_HumanOS.pdf");
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
          Guía de Re-incubación // Fernanda Villanueva
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
                  <MetaItem icon={<User />} label="Perfil" value="Diseñadora / Founder" />
                  <MetaItem icon={<Clock />} label="Timeline" value="Concept Studio (21)" />
                  <MetaItem icon={<MapPin />} label="Ruta" value="México -> Madrid" />
                  <MetaItem icon={<Briefcase />} label="Foco" value="Branding + IA" />
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <SectionBlock title="Situación Actual" color="indigo">
                  <ul className="space-y-4 text-slate-300 text-sm">
                    <li className="flex gap-3">🚀 <p>Especialista en branding, fundadora de estudio propio a los 21.</p></li>
                    <li className="flex gap-3">🇪🇸 <p>Traslado a Madrid para Máster en IA + Marketing.</p></li>
                    <li className="flex gap-3">⏰ <p>Vives en dos mundos: Clientes MX / Vida Madrid.</p></li>
                    <li className="flex gap-3">💰 <p>Autofinanciada con ahorros (seguridad hasta julio 2025).</p></li>
                  </ul>
                </SectionBlock>

                <SectionBlock title="Fortalezas Confirmadas" color="emerald">
                  <ul className="space-y-4 text-slate-300 text-sm">
                    <li className="flex gap-3">✨ <p>Extrovertida y helper natural (siempre para los demás).</p></li>
                    <li className="flex gap-3">🧠 <p>Diseño técnico + Comprensión psicológica profunda.</p></li>
                    <li className="flex gap-3">🎨 <p>Entiendes la emoción de la marca, no solo el logo.</p></li>
                    <li className="flex gap-3">🔥 <p>Valentía probada: emprender a los 21 y mudarse a los 24.</p></li>
                  </ul>
                </SectionBlock>

                <SectionBlock title="Puntos de Fricción" color="red">
                  <ul className="space-y-4 text-slate-300 text-sm">
                    <li className="flex gap-3">🛑 <p>Sensación de "empezar de cero" tras el éxito en MX.</p></li>
                    <li className="flex gap-3">🌫️ <p>Miedo disfrazado de "pereza" o zona de confort.</p></li>
                    <li className="flex gap-3">⚠️ <p>Duda sobre tu nivel para el mercado europeo.</p></li>
                    <li className="flex gap-3">🔋 <p>Agotamiento extremo por vivir en dos husos horarios.</p></li>
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
                  title="No has retrocedido, has cambiado de pista" 
                  content="Montar un estudio a los 21 que te paga un máster en Madrid NO es retroceder. Estás comparando tu sprint en México con tus primeros pasos en Madrid. Son carreras diferentes."
                  icon={<Zap className="w-5 h-5 text-indigo-400" />}
                />
                <InsightCard 
                  number="02" 
                  title="Tienes un superpoder que no estás explotando" 
                  content="Combinas diseño técnico + psicología humana + experiencia bicultural + interés por IA. Esto es oro. Muy pocas diseñadoras en Madrid tienen esa mezcla."
                  icon={<BrainCircuit className="w-5 h-5 text-indigo-400" />}
                />
                <InsightCard 
                  number="03" 
                  title="El problema no es el esfuerzo, es la física" 
                  content="Tratas de sostener un negocio mexicano mientras construyes una vida madrileña. Eso no es pereza, es física imposible. Necesitas elegir una dirección estratégica."
                  icon={<ShieldAlert className="w-5 h-5 text-indigo-400" />}
                />
                <InsightCard 
                  number="04" 
                  title="Madrid necesita lo que tú tienes" 
                  content="No eres 'demasiado mexicana para Madrid'. Eres alguien que entiende dos mercados, dos culturas, dos formas de comunicar. Tú eres el puente, no la turista."
                  icon={<Globe className="w-5 h-5 text-indigo-400" />}
                />
              </div>
              <div className="bg-white/5 p-12 rounded-[2.5rem] border border-white/10 italic text-xl text-slate-300 leading-relaxed text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-indigo-500"></div>
                "La pregunta no es: ¿estás haciendo suficiente?<br/><br/>
                La pregunta real es: ¿Estás construyendo la Fernanda que quieres ser, o la Fernanda que crees que deberías ser?"
              </div>
            </div>
          )}

          {/* TAB: EXPERIMENTO */}
          {activeTab === 'experimento' && (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-8">
                <div>
                  <h2 className="text-3xl font-space font-bold text-white uppercase tracking-tight">Feedback Experiment</h2>
                  <p className="text-slate-400">30-45 mins para ganar claridad brutal</p>
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
                  title="Escenario 1: Fernanda Regreso a México" 
                  desc="Imagina que decides regresar y continuar allí tu carrera."
                  questions={[
                    { id: 's1q1', label: '¿Cómo sería tu vida profesional en 5 años?' },
                    { id: 's1q2', label: '¿Qué estarías haciendo? ¿Con quién trabajarías?' },
                    { id: 's1q3', label: '¿Cómo te sentirías con esa decisión?' }
                  ]}
                  values={responses}
                  onChange={handleInputChange}
                />
                <ScenarioBlock 
                  title="Escenario 2: Fernanda Establecida en Madrid" 
                  desc="Te quedas definitivamente y construyes tu carrera aquí."
                  questions={[
                    { id: 's2q1', label: '¿Cómo sería tu vida profesional en 5 años?' },
                    { id: 's2q2', label: '¿Qué estarías haciendo? ¿Con quién trabajarías?' },
                    { id: 's2q3', label: '¿Cómo te sentirías con esa decisión?' }
                  ]}
                  values={responses}
                  onChange={handleInputChange}
                />
                <ScenarioBlock 
                  title="Escenario 3: Fernanda Bicultural" 
                  desc="Combinas ambos mundos de forma híbrida y única."
                  questions={[
                    { id: 's3q1', label: '¿Cómo sería tu vida profesional en 5 años?' },
                    { id: 's3q2', label: '¿Qué estarías haciendo? ¿Con quién trabajarías?' },
                    { id: 's3q3', label: '¿Cómo te sentirías con esa decisión?' }
                  ]}
                  values={responses}
                  onChange={handleInputChange}
                />
                <ScenarioBlock 
                  title="Reflexión Final" 
                  desc="Alineación de valores."
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
              <h2 className="text-3xl font-space font-bold text-white uppercase tracking-tight">Arsenal Tecnológico</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResourceCard 
                  title="Test de Personalidad"
                  links={[
                    { label: '16Personalities (Myers-Briggs)', url: 'https://www.16personalities.com/es' },
                    { label: 'CrystalKnows (DISC para LinkedIn)', url: 'https://www.crystalknows.com/' }
                  ]}
                />
                <ResourceCard 
                  title="IA & Diseño"
                  items={['Gemini 3: Imagen para mockups', 'Midjourney: Exploración visual radical', 'Canva + ChatGPT: Flujos de trabajo']}
                />
                <ResourceCard 
                  title="Optimización Digital"
                  links={[
                    { label: 'Taplio / Shield: LinkedIn Analytics', url: '#' },
                    { label: 'Notion AI: Gestión de Proyectos', url: '#' }
                  ]}
                />
                <ResourceCard 
                  title="ChatGPT Mastery"
                  desc="Configura tus 'Custom Instructions' y crea un 'Project' dedicado a tu búsqueda en Madrid."
                />
              </div>

              {/* CONFIGURACIÓN CHATGPT */}
              <div className="space-y-6 pt-10 border-t border-white/10">
                <h3 className="text-2xl font-space font-bold text-white uppercase tracking-tight">Configuración de ChatGPT</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Custom Instructions (Ejemplo Real)</h4>
                    <div className="p-6 bg-slate-900/80 rounded-2xl border border-white/5 font-mono text-xs text-slate-400 leading-relaxed overflow-x-auto whitespace-pre">
{`SOBRE MÍ:
- Soy diseñadora gráfica especializada en branding
- Fundé mi estudio (Concept Studio) a los 21
- Vivo en Madrid, mis clientes están en México
- Me interesa la psicología detrás de las marcas
- Estoy aprendiendo sobre IA aplicada al diseño
- Valoro: creatividad, autonomía, propósito

CÓMO QUIERO QUE ME RESPONDAS:
- Sé directo y práctico, sin rodeos corporativos
- Usa ejemplos visuales cuando expliques conceptos
- Si te pregunto algo de branding/diseño, asume conocimiento técnico
- NUNCA te inventes datos o estadísticas
- Dame máximo 3 opciones y explica pros/contras
- Escribe en español de España`}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Estrategia de Proyectos</h4>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 h-full">
                      <p className="text-slate-300 text-sm mb-4">Crea un proyecto específico para tu búsqueda de trabajo en Madrid:</p>
                      <ul className="space-y-3 text-xs text-slate-400">
                        <li className="flex gap-2"><span>1.</span> <p>Ve a ChatGPT → Projects → New Project.</p></li>
                        <li className="flex gap-2"><span>2.</span> <p>Nómbralo: "Búsqueda de trabajo Madrid".</p></li>
                        <li className="flex gap-2"><span>3.</span> <p>En Settings, sube tu CV y el análisis de Human-OS.</p></li>
                        <li className="flex gap-2"><span>4.</span> <p>Cada vez que apliques a una oferta, hazlo dentro de este contexto.</p></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROXIMOS */}
          {activeTab === 'proximos' && (
            <div className="space-y-12">
              <h2 className="text-3xl font-space font-bold text-white uppercase tracking-tight">Misiones de Crecimiento</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <MissionCard 
                  title="Misión Mantenimiento"
                  price="60€"
                  period="sesión"
                  desc="Sesión única de 1 hora para continuar con lo que hablamos y aportarte valor en tu proceso de toma de decisiones y búsqueda de oportunidades en Madrid."
                  cta="Activar Misión"
                  onClick={() => setActiveTab('reservar')}
                />
                <MissionCard 
                  title="Misión Re-incubación"
                  price="150€"
                  period="mes"
                  desc="3 sesiones al mes (1h c/u). Acompañamiento continuo en tu transición. Incluye soporte por LinkedIn y revisión de experimentos."
                  cta="Activar Misión"
                  featured
                  onClick={() => setActiveTab('reservar')}
                />
              </div>
              <div className="bg-indigo-500/5 p-10 rounded-[2.5rem] border border-indigo-500/20 text-center">
                <p className="text-slate-300 italic">"No tienes que decidir nada ahora. Haz el experimento esta semana. Piénsalo. Y si en algún momento quieres continuar, me escribes."</p>
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
                <h2 className="text-4xl font-space font-bold text-white mb-4 uppercase tracking-tighter">Próximo Salto</h2>
                <p className="text-slate-400 max-w-lg mb-12 text-lg">Reserva tu sesión de seguimiento para revisar tu experimento y definir tu mapa en Madrid.</p>
                
                <a href="https://calendly.com/ferpilot-ia/meeting-with-fer?utm_source=schedule_from_linkedin&month=2026-02" target="_blank" rel="noreferrer" className="px-16 py-6 btn-navigation rounded-[2rem] text-xl uppercase tracking-widest flex items-center gap-4 transition-transform hover:scale-105">
                  Reservar Sesión con Fer <ExternalLink className="w-6 h-6" />
                </a>
              </div>

              {/* BLOQUE CONTACTO ADICIONAL */}
              <div className="pt-16 border-t border-white/10">
                <h3 className="text-2xl font-space font-bold text-white uppercase tracking-tight mb-8">Cómo seguimos en contacto</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center gap-4 group hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h4 className="text-white font-bold">LinkedIn</h4>
                    <p className="text-xs text-slate-500">Ya te sigo y activé la campanita para ver tus posts y comentarte.</p>
                  </div>

                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center gap-4 group hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6 text-pink-400" />
                    </div>
                    <h4 className="text-white font-bold">Feedback Mutuo</h4>
                    <p className="text-xs text-slate-500">Si aplicas algo de lo que hablamos y te sirve, ¡cuéntamelo!</p>
                  </div>

                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center gap-4 group hover:bg-white/10 transition-all">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-white font-bold">Asesoría Directa</h4>
                    <p className="text-xs text-slate-500">Escríbeme por email si necesitas algo puntual: ferpilot.ia@gmail.com</p>
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
        <p className="mt-1">Dossier de Re-incubación para Fernanda Villanueva</p>
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

const ContactLink = ({ icon, label, url }: any) => (
  <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors font-space text-[10px] font-bold uppercase tracking-widest">
    {icon} {label}
  </a>
);

export default App;
