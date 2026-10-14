import React, { useState } from 'react';
import { ScoutProgram } from '../types/scout';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  program: { id: string; title: string } | null;
  itemTypeLabel?: string;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void> | void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  program,
  itemTypeLabel = 'program',
  onClose,
  onConfirm
}) => {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !program) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(program.id);
      onClose();
    } catch (err) {
      console.error('Delete confirm error:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full shadow-2xl p-6 sm:p-7 space-y-5">
        
        {/* Header Icon */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
            Smazat {itemTypeLabel} z databáze?
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Opravdu chcete smazat <strong className="text-stone-900 dark:text-stone-100">„{program.title}“</strong>? Tato akce je nevratná a položka bude trvale odstraněna.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
          >
            Zrušit
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md hover:shadow-rose-900/30 transition disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleting ? 'Mazání...' : 'Ano, trvale smazat'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
