/**
 * Utility functions for sharing scout programs and clipboard copy with fallback.
 */

export function getProgramShareUrl(programId: string): string {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('p', programId);
    return url.toString();
  } catch (e) {
    return `${window.location.origin}/?p=${encodeURIComponent(programId)}`;
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  // 1. Modern Clipboard API (works in secure contexts when focused)
  if (navigator?.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, falling back to execCommand:', err);
    }
  }

  // 2. Fallback via temporary textarea element
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    // Avoid scrolling to bottom of screen in iOS / Android
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // For iOS Safari
    textArea.setSelectionRange(0, 99999);
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('execCommand copy fallback failed:', err);
    return false;
  }
}

export async function shareProgram(program: { id: string; title: string; summary?: string }): Promise<{
  success: boolean;
  method: 'native' | 'clipboard' | 'failed';
  url: string;
}> {
  const url = getProgramShareUrl(program.id);

  // Try Web Share API (native mobile / browser share sheet)
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Skautský program: ${program.title}`,
        text: program.summary || `Podívej se na skautský program "${program.title}" na Skautské Programovně!`,
        url: url,
      });
      return { success: true, method: 'native', url };
    } catch (err: any) {
      // AbortError means user cancelled the share dialog
      if (err.name === 'AbortError') {
        return { success: true, method: 'native', url };
      }
      console.warn('Native share failed, falling back to clipboard:', err);
    }
  }

  // Fallback to copying directly to clipboard
  const copied = await copyTextToClipboard(url);
  return { success: copied, method: copied ? 'clipboard' : 'failed', url };
}
