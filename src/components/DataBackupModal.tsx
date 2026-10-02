/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  Database,
  Trash2,
  X,
  FileCode,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportJson: () => string;
  onImportJson: (jsonStr: string) => { success: boolean; error?: string };
  onLoadExampleData: () => void;
  onClearAllData: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  onExportJson,
  onImportJson,
  onLoadExampleData,
  onClearAllData
}) => {
  const [showRawJson, setShowRawJson] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentJson = onExportJson();

  // Descargar archivo .json
  const handleDownloadFile = () => {
    try {
      const blob = new Blob([currentJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `plato_economico_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setFeedbackMessage({
        type: 'success',
        text: '¡Archivo JSON descargado exitosamente en tu dispositivo!'
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch {
      setFeedbackMessage({
        type: 'error',
        text: 'No se pudo descargar el archivo automáticamente.'
      });
    }
  };

  // Subir archivo .json
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = onImportJson(content);
        if (result.success) {
          setFeedbackMessage({
            type: 'success',
            text: '¡Datos restaurados con éxito desde el archivo JSON!'
          });
          setTimeout(() => {
            setFeedbackMessage(null);
            onClose();
          }, 1500);
        } else {
          setFeedbackMessage({
            type: 'error',
            text: result.error || 'Archivo inválido.'
          });
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLoadExample = () => {
    onLoadExampleData();
    setFeedbackMessage({
      type: 'success',
      text: '¡Dato de ejemplo cargado! (Estudiante con Arroz, Huevos y Salteado Chaufa).'
    });
    setTimeout(() => {
      setFeedbackMessage(null);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    if (window.confirm('¿Seguro que querés borrar todos los datos guardados en este dispositivo?')) {
      onClearAllData();
      setFeedbackMessage({
        type: 'success',
        text: 'Datos restablecidos a valores iniciales.'
      });
      setTimeout(() => {
        setFeedbackMessage(null);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 animate-fade-in">
        {/* Cabecera */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Gestión de Datos y Respaldo
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Almacenamiento local (localStorage) y archivo JSON
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Alertas de feedback */}
          {feedbackMessage && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2 ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}
            >
              {feedbackMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              )}
              <span className="font-medium">{feedbackMessage.text}</span>
            </div>
          )}

          {/* Explicación transparente sobre cómo se guardan los datos */}
          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-3.5 border border-stone-200 dark:border-stone-700/60 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
              <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>¿Cómo funciona el guardado en esta app?</span>
            </div>
            <ul className="space-y-1.5 text-stone-600 dark:text-stone-300">
              <li>
                <strong>1. Dónde se guarda:</strong> En el <code className="px-1 py-0.5 bg-stone-200 dark:bg-stone-700 rounded font-mono text-[10px]">localStorage</code> del navegador de este celular/computadora. No viaja a ningún servidor externo.
              </li>
              <li>
                <strong>2. Si cerrás la app:</strong> Los datos <strong>no se pierden</strong>. Permanecen disponibles para la próxima vez que abras la web.
              </li>
              <li>
                <strong>3. Si borrás el caché/datos del navegador o cambiás de celular:</strong> Se limpian los datos locales. Para evitar perderlos, podés <strong>descargar tu archivo de respaldo</strong> aquí abajo.
              </li>
            </ul>
          </div>

          {/* Acciones de Respaldo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Botón Descargar JSON */}
            <button
              type="button"
              onClick={handleDownloadFile}
              className="p-3 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 font-medium shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar respaldo (.json)</span>
            </button>

            {/* Botón Importar JSON */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-3 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 rounded-xl flex items-center justify-center gap-2 font-medium shadow-xs transition-colors"
              >
                <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Restaurar desde archivo</span>
              </button>
            </div>
          </div>

          {/* Dato de prueba precargado */}
          <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Dato de ejemplo para probar</span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">
                Carga un perfil típico de estudiante (arroz, huevos, chaufa y lista de faltantes).
              </p>
            </div>
            <button
              type="button"
              onClick={handleLoadExample}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-lg shrink-0 transition-colors"
            >
              Cargar ejemplo
            </button>
          </div>

          {/* Ver datos crudos JSON */}
          <div>
            <button
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1.5 font-medium py-1"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{showRawJson ? 'Ocultar código JSON guardado' : 'Ver código JSON guardado actualmente'}</span>
            </button>

            {showRawJson && (
              <div className="mt-2 bg-stone-900 text-stone-100 rounded-xl p-3 max-h-48 overflow-y-auto font-mono text-[10px] leading-relaxed">
                <pre>{currentJson}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Pie con botón de reset total */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 text-[11px] font-medium py-1 px-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Borrar todos los datos locales</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-medium rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
