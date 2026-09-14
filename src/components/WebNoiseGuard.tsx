import { useEffect } from 'react';
import { Platform } from 'react-native';

const WALLET_NOISE = /metamask|ethereum provider|walletconnect|failed to connect to metamask/i;

export function WebNoiseGuard() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const root = globalThis as any;
    const win = root.window as any;
    const doc = root.document as any;
    if (!win || !doc) return;

    const swallow = (event: any) => {
      const reason = event?.reason ?? event?.error ?? event?.message;
      const text = typeof reason === 'string' ? reason : reason?.message ?? String(reason ?? '');
      if (!WALLET_NOISE.test(text)) return;
      event.preventDefault?.();
      event.stopImmediatePropagation?.();
      event.stopPropagation?.();
    };

    const removeInjectedWalletToasts = () => {
      const nodes = Array.from(doc.querySelectorAll?.('div,section,aside') ?? []) as any[];
      for (const node of nodes) {
        const text = String(node?.textContent ?? '').trim();
        if (!text || !WALLET_NOISE.test(text) || text.length > 220) continue;
        const style = win.getComputedStyle?.(node);
        if (style?.position === 'fixed' || style?.position === 'absolute') node.remove?.();
      }
    };

    win.addEventListener?.('unhandledrejection', swallow, true);
    win.addEventListener?.('error', swallow, true);
    const Observer = win.MutationObserver;
    const observer = Observer ? new Observer(removeInjectedWalletToasts) : null;
    observer?.observe?.(doc.body, { childList: true, subtree: true });
    removeInjectedWalletToasts();

    return () => {
      win.removeEventListener?.('unhandledrejection', swallow, true);
      win.removeEventListener?.('error', swallow, true);
      observer?.disconnect?.();
    };
  }, []);

  return null;
}
