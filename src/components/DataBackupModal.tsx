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
        text: '¡Archivo descargado en tu teléfono con éxito!'
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch {
      setFeedbackMessage({
        type: 'error',
        text: 'No se pudo generar la descarga del archivo.'
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
            text: '¡Tus datos guardados se recuperaron con éxito!'
          });
          setTimeout(() => {
            setFeedbackMessage(null);
            onClose();
          }, 1500);
        } else {
          setFeedbackMessage({
            type: 'error',
            text: 'El archivo seleccionado no tiene el formato correcto.'
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
      text: '¡Dato de ejemplo cargado! Ya podés ver el almuerzo y la lista.'
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
        text: 'Todos los datos fueron restablecidos a cero.'
      });
      setTimeout(() => {
        setFeedbackMessage(null);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-stone-400 dark:border-stone-700 animate-fade-in">
        {/* Cabecera */}
        <div className="p-4 border-b-2 border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 flex items-center justify-center border border-emerald-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-950 dark:text-white leading-tight">
                Gestión de Datos y Respaldo
              </h3>
              <p className="text-base font-semibold text-stone-700 dark:text-stone-300">
                Almacenamiento en este dispositivo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="min-h-[48px] min-w-[48px] flex items-center justify-center text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded-xl"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 overflow-y-auto space-y-4 text-base">
          {/* Mensajes de feedback visibles */}
          {feedbackMessage && (
            <div
              className={`p-3.5 rounded-2xl border-2 flex items-center gap-2.5 ${
                feedbackMessage.type === 'success'
                  ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-600 text-emerald-950 dark:text-emerald-100'
                  : 'bg-rose-100 dark:bg-rose-950 border-rose-600 text-rose-950 dark:text-rose-100'
              }`}
            >
              {feedbackMessage.type === 'success' ? (
                <CheckCircle className="w-6 h-6 shrink-0 text-emerald-700 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 shrink-0 text-rose-700 dark:text-rose-400" />
              )}
              <span className="font-bold">{feedbackMessage.text}</span>
            </div>
          )}

          {/* Explicación en lenguaje directo sin tecnicismos */}
          <div className="bg-stone-50 dark:bg-stone-800 rounded-2xl p-4 border-2 border-stone-300 dark:border-stone-700 space-y-2">
            <div className="flex items-center gap-2 font-black text-stone-950 dark:text-white">
              <Info className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>¿Cómo se guardan tus datos?</span>
            </div>
            <ul className="space-y-2 text-stone-800 dark:text-stone-200 font-medium">
              <li>
                <strong>1. En tu celular:</strong> La información queda guardada en la memoria de este navegador. Al cerrar la pestaña no se borra.
              </li>
              <li>
                <strong>2. Si cambiás de teléfono:</strong> Podés descargar el archivo con el botón de abajo y restaurarlo en tu nuevo celular.
              </li>
            </ul>
          </div>

          {/* Acciones de Respaldo */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleDownloadFile}
              className="w-full min-h-[52px] p-3.5 bg-stone-950 hover:bg-stone-800 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-base shadow-sm transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Descargar archivo de respaldo</span>
            </button>

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
                className="w-full min-h-[52px] p-3.5 bg-white dark:bg-stone-800 border-2 border-stone-400 dark:border-stone-600 hover:bg-stone-100 text-stone-950 dark:text-white rounded-2xl flex items-center justify-center gap-2 font-black text-base transition-colors"
              >
                <Upload className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <span>Restaurar desde un archivo</span>
              </button>
            </div>
          </div>

          {/* Cargar ejemplo */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/70 border-2 border-emerald-600 rounded-2xl flex items-center justify-between gap-2">
            <div>
              <div className="font-black text-emerald-950 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <span>Ejemplo de prueba</span>
              </div>
              <p className="text-base font-semibold text-emerald-900 dark:text-emerald-200">
                Arroz, huevos, cebolla y receta chaufa.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLoadExample}
              className="min-h-[48px] px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-base font-black rounded-xl shrink-0 transition-colors"
            >
              Cargar
            </button>
          </div>

          {/* Ver datos en texto */}
          <div>
            <button
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-stone-800 dark:text-stone-200 hover:underline flex items-center gap-1.5 font-bold py-1 text-base"
            >
              <FileCode className="w-5 h-5" />
              <span>{showRawJson ? 'Ocultar código guardado' : 'Ver código guardado'}</span>
            </button>

            {showRawJson && (
              <div className="mt-2 bg-stone-950 text-stone-100 rounded-2xl p-3 max-h-44 overflow-y-auto font-mono text-base leading-relaxed">
                <pre>{currentJson}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Pie */}
        <div className="p-3 border-t-2 border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleClear}
            className="min-h-[48px] text-rose-700 dark:text-rose-400 hover:underline flex items-center gap-1 text-base font-bold px-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Borrar todo</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-5 py-2.5 bg-stone-200 dark:bg-stone-800 text-stone-950 dark:text-white text-base font-black rounded-xl hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
