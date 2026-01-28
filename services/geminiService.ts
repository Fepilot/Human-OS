
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosticFormData, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function analyzeDiagnostic(data: DiagnosticFormData): Promise<AnalysisResult> {
  const prompt = `
    Eres el asistente personal del Capitán Fer en el programa "Human-OS". 
    Tu objetivo es analizar el perfil de un nuevo tripulante y darle un feedback muy honesto, cercano, con un toque de humor simple y real.
    Imagina que eres un colega experto que le dice las cosas como son, sin filtros corporativos pero con buena onda.

    DATOS DEL TRIPULANTE:
    - Nombre: ${data.nombre}
    - Rol actual: ${data.rol}
    - Años de experiencia: ${data.años}
    - Lo que le quema (Crashes/Inercias/Sombras): ${data.crashes}, ${data.procesos_colgados}, ${data.malware}
    - Lo que le mola (Logros/Flujo/Talento): ${data.logros}, ${data.disfrute}, ${data.talentos_naturales}
    - Valores: ${data.valores.join(', ')} (Top 3: ${data.valores_top3})
    - Visión futura: ${data.vision_2años}
    - Miedos: ${data.miedo_mayor}
    - Estado emocional: ${data.estado_emocional}

    TU TAREA:
    Genera un JSON con:
    1. 'fitScore': Porcentaje (1-100) de ganas reales de cambio.
    2. 'fitType': Un nombre de perfil divertido y real (ej: "Zombi con ganas de mambo", "Talentazo en pausa dramática", "Cerebro frito buscando aire").
    3. 'summary': Un párrafo honesto, directo y divertido sobre su situación actual. Habla de tú a tú. Si está hasta las narices, reconócelo. Si tiene potencial pero está dormido, dale un toque. Usa alguna metáfora de "misión" pero muy casual.
    4. 'strengths': 3 cosas en las que es un crack absoluto según lo que ha contado.
    5. 'weaknesses': 3 cosas que le están robando la energía (sé honesto, incluso un poco irónico).
    6. 'opportunities': 3 vías de escape o mejora que tengan sentido para él/ella.
    7. 'threats': 3 cosas que harán que se quede atrapado en su silla para siempre si no hace nada.
    8. 'recommendations': 4 pasos de acción "reales y directos" para su re-incubación.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
    return {
      fitScore: 85,
      fitType: "TRIPULANTE CON GANAS",
      summary: "Mira, el sistema se ha quedado un poco pillado con tanta info, pero lo que está claro es que si has llegado hasta aquí es porque tu cuerpo pide un cambio a gritos. ¡Vamos a ello!",
      strengths: ["Ganas de cambio", "Honestidad brutal", "Potencial oculto"],
      weaknesses: ["Dudas lógicas", "El 'mañana lo miro'", "Inercias pesadas"],
      opportunities: ["Sesión con Fer", "Resetear prioridades", "Nuevos horizontes"],
      threats: ["Zona de confort magnética", "Miedo al vacío", "El qué dirán"],
      recommendations: ["Respira", "Bájate el PDF", "Mándaselo al Capitán", "Reserva tu sitio"]
    };
  }
}
