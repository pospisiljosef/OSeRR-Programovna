import React, { useState } from 'react';
import { ScoutProgram } from '../types/scout';
import { getProgramShareUrl, copyTextToClipboard } from '../utils/shareUtils';
import { ScoutLilieLogo } from './Header';
import { X, Check, Copy, Share2, Mail, MessageCircle, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: ScoutProgram | null;
  onToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  program,
  onToast
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !program) return null;

  const shareUrl = getProgramShareUrl(program.id);

  const handleCopy = async () => {
    const success = await copyTextToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      onToast('Odkaz na aktivitu byl úspěšně zkopírován do schránky!');
      setTimeout(() => setCopied(false), 2500);
    } else {
      onToast('Odkaz můžete zkopírovat označením v poli níže.');
    }
  };

  const emailSubject = encodeURIComponent(`Skautský program: ${program.title}`);
  const emailBody = encodeURIComponent(
    `Ahoj!\n\nPosílám skautský program "${program.title}":\n${program.summary}\n\nOtevři si podrobný program zde:\n${shareUrl}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Ahoj, podívej se na skautský program "${program.title}": ${shareUrl}`)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-7 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Sdílet program
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Pošlete odkaz dalším skautským vedoucím a rádcům
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Program Preview */}
        <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-800">
          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
            {program.title}
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5">
            {program.summary}
          </p>
          {(program.authorName || program.authorUnit) && (
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
              Od: {program.authorName} {program.authorUnit ? `(${program.authorUnit})` : ''}
            </div>
          )}
        </div>

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
            Přímý odkaz na program
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 select-all"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Zkopírováno</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Kopírovat</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick share channels */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <span className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Rychlé sdílení
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 text-xs font-semibold transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-semibold transition"
            >
              <Mail className="w-4 h-4 text-stone-600 dark:text-stone-300" />
              <span>E-mailem</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
