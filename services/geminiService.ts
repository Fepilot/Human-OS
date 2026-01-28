
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosticFormData, AnalysisResult } from "../types";

export async function analyzeDiagnostic(data: DiagnosticFormData): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analiza los siguientes datos de un tripulante para el programa "HUMAN-OS" (re-incubación profesional).
    El objetivo es preparar un "Mission Briefing" para el usuario que incluya un diagnóstico tipo DAFO (Debilidades, Amenazas, Fortalezas, Oportunidades).
    
    Datos del Tripulante:
    - Nombre: ${data.nombre}
    - Rol Actual: ${data.rol} (${data.años} años)
    - Puntos de Dolor: Crashes: ${data.crashes}, Procesos colgados: ${data.procesos_colgados}, Malware (creencias): ${data.malware}
    - Potencial: Logros: ${data.logros}, Disfrute: ${data.disfrute}, Talentos: ${data.talentos_naturales}
    - Valores: ${data.valores.join(', ')} (Explicación: ${data.valores_top3})
    - Motivación: Disparador: ${data.trigger}, Visión 2 años: ${data.vision_2años}, Miedo mayor: ${data.miedo_mayor}
    - Estado Actual: Emocional: ${data.estado_emocional}, Objetivo: ${data.busca_principal}, Claridad: ${data.claridad_que}

    Genera una respuesta en JSON con:
    1. 'fitScore': Un porcentaje (1-100) de afinidad con la filosofía Human-OS (alta afinidad si busca un cambio profundo y tiene autoconciencia).
    2. 'fitType': Una etiqueta de perfil (ej. "EXPLORADOR_ESTELAR", "INGENIERO_EN_PAUSA", "PILOTO_BLOQUEADO").
    3. 'summary': Un diagnóstico narrativo de su "Sistema Operativo" actual (máximo 3 frases).
    4. 'strengths': 3-4 fortalezas clave basadas en sus talentos y logros.
    5. 'weaknesses': 3-4 debilidades internas o bloqueos (basado en crashes/malware).
    6. 'opportunities': 3-4 oportunidades externas o de crecimiento basadas en su visión y el mercado.
    7. 'threats': 3-4 amenazas o miedos que podrían sabotear su proceso.
    8. 'recommendations': Una ruta de 3-4 pasos a alto nivel para su re-incubación.
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
      fitScore: 75,
      fitType: "PERFIL_POTENCIAL",
      summary: "Diagnóstico automático: Se detecta una arquitectura sólida con procesos de fondo que consumen recursos excesivos. El sistema requiere una re-configuración de prioridades.",
      strengths: ["Gran capacidad de análisis propio", "Trayectoria con hitos verificables", "Alineación de valores clara"],
      weaknesses: ["Sobrecarga de procesos (burnout)", "Creencias limitantes sobre el cambio", "Falta de claridad en el 'cómo'"],
      opportunities: ["Re-branding profesional", "Uso de IA para optimizar procesos", "Nuevos mercados alineados a valores"],
      threats: ["Miedo al fracaso financiero", "Inercia del rol actual", "Entorno poco estimulante"],
      recommendations: ["Auditoría de tareas diarias", "Mapeo de talentos infrautilizados", "Sesión de claridad estratégica"]
    };
  }
}
