import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosticFormData, AnalysisResult } from "../types";

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      console.warn('Gemini API key not configured');
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function analyzeDiagnostic(data: DiagnosticFormData): Promise<AnalysisResult> {
  const ai = getAIClient();
  
  if (!ai) {
    console.warn('AI client not available, returning fallback result');
    return getFallbackResult();
  }

  const prompt = buildPrompt(data);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fitScore: { type: Type.NUMBER },
            fitType: { type: Type.STRING },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
            threats: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["fitScore", "fitType", "summary", "strengths", "weaknesses", "opportunities", "threats", "recommendations"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return getFallbackResult();
  }
}

function buildPrompt(data: DiagnosticFormData): string {
  return `Eres el asistente personal del Capitan Fer en el programa "Human-OS".
Tu objetivo es analizar el perfil de un nuevo tripulante y darle un feedback muy honesto, cercano, con un toque de humor simple y real.
Imagina que eres un colega experto que le dice las cosas como son, sin filtros corporativos pero con buena onda.

DATOS DEL TRIPULANTE:
- Nombre: ${data.nombre}
- Rol actual: ${data.rol}
- Anos de experiencia: ${data.años}
- Lo que le quema (Crashes/Inercias/Sombras): ${data.crashes}, ${data.procesos_colgados}, ${data.malware}
- Lo que le mola (Logros/Flujo/Talento): ${data.logros}, ${data.disfrute}, ${data.talentos_naturales}
- Valores: ${data.valores.join(', ')} (Top 3: ${data.valores_top3})
- Vision futura: ${data.vision_2años}
- Miedos: ${data.miedo_mayor}
- Estado emocional: ${data.estado_emocional}

TU TAREA:
Genera un JSON con:
1. 'fitScore': Porcentaje (1-100) de ganas reales de cambio.
2. 'fitType': Un nombre de perfil divertido y real (ej: "Zombi con ganas de mambo", "Talentazo en pausa dramatica", "Cerebro frito buscando aire").
3. 'summary': Un parrafo honesto, directo y divertido sobre su situacion actual. Habla de tu a tu. Si esta hasta las narices, reconocelo. Si tiene potencial pero esta dormido, dale un toque. Usa alguna metafora de "mision" pero muy casual.
4. 'strengths': 3 cosas en las que es un crack absoluto segun lo que ha contado.
5. 'weaknesses': 3 cosas que le estan robando la energia (se honesto, incluso un poco ironico).
6. 'opportunities': 3 vias de escape o mejora que tengan sentido para el/ella.
7. 'threats': 3 cosas que haran que se quede atrapado en su silla para siempre si no hace nada.
8. 'recommendations': 4 pasos de accion "reales y directos" para su re-incubacion.`;
}

function getFallbackResult(): AnalysisResult {
  return {
    fitScore: 85,
    fitType: "TRIPULANTE CON GANAS",
    summary: "Mira, el sistema se ha quedado un poco pillado con tanta info, pero lo que esta claro es que si has llegado hasta aqui es porque tu cuerpo pide un cambio a gritos. Vamos a ello!",
    strengths: ["Ganas de cambio", "Honestidad brutal", "Potencial oculto"],
    weaknesses: ["Dudas logicas", "El 'manana lo miro'", "Inercias pesadas"],
    opportunities: ["Sesion con Fer", "Resetear prioridades", "Nuevos horizontes"],
    threats: ["Zona de confort magnetica", "Miedo al vacio", "El que diran"],
    recommendations: ["Respira", "Bajate el PDF", "Mandaselo al Capitan", "Reserva tu sitio"]
  };
}
