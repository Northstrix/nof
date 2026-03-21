// src/hooks/use-toast.ts
'use client';

import * as React from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

/* ----------------------------------------------------------
 * 🔹 Utility — detect if text contains RTL characters
 * ---------------------------------------------------------- */
const isRTLCheck = (text: string): boolean =>
  /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text || '');

/* ----------------------------------------------------------
 * 🔹 Types
 * ---------------------------------------------------------- */
export type ToastActionElement = React.ReactNode;

export interface ToastProps {
  title?: string;
  description?: string;
  duration?: number;
}

type Toast = ToastProps;

/* ----------------------------------------------------------
 * 🔹 Unique ID generator
 * ---------------------------------------------------------- */
function genId() {
  return Date.now().toString();
}

/* ----------------------------------------------------------
 * 🔹 Main Toast function
 * ---------------------------------------------------------- */
function toast({ title = '', description = '', duration = 3000 }: Toast) {
  const id = genId();

  // Detect page direction
  const isPageRTL =
    typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  // Detect text direction
  const titleIsRTL = isRTLCheck(title);
  const descIsRTL = isRTLCheck(description);

  // Create SweetAlert2 toast mixin
  const DynamicSwalToast = Swal.mixin({
    toast: true,
    position: isPageRTL ? 'bottom-start' : 'bottom-end',
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
    customClass: { popup: 'my-toast' },
    didOpen: (toastEl) => {
      toastEl.onmouseenter = Swal.stopTimer;
      toastEl.onmouseleave = Swal.resumeTimer;
    },
  });

  // Display toast
  DynamicSwalToast.fire({
    html: `
      <div class="toast-flex">
        <img src="/logo.png" alt="Logo" class="toast-logo" />
        <div class="toast-text">
          ${
            title
              ? `<div class="toast-title" style="
                  font-weight:bold;
                  direction:${titleIsRTL ? 'rtl' : 'ltr'};
                  text-align:${titleIsRTL ? 'right' : 'left'};">
                  ${title}
                </div>`
              : ''
          }
          ${
            description
              ? `<div class="toast-description" style="
                  direction:${descIsRTL ? 'rtl' : 'ltr'};
                  text-align:${descIsRTL ? 'right' : 'left'};">
                  ${description}
                </div>`
              : ''
          }
        </div>
      </div>
    `,
  });

  return {
    id,
    dismiss: () => Swal.close(),
    update: () => {}, // no-op
  };
}

/* ----------------------------------------------------------
 * 🔹 Hook wrapper (compatible with existing useToast API)
 * ---------------------------------------------------------- */
function useToast() {
  return {
    toasts: [],
    toast,
    dismiss: () => Swal.close(),
  };
}

/* ----------------------------------------------------------
 * 🔹 Export
 * ---------------------------------------------------------- */
export { useToast, toast };

/* ----------------------------------------------------------
 * 🔹 Inject styles dynamically
 * ---------------------------------------------------------- */
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    /* SweetAlert2 container padding (scrollbar safe space) */
    .swal2-container {
      padding: 0 1.5rem 1.25rem 1.5rem !important;
    }

    /* Toast shell */
    .my-toast {
      background: #0a0a0a !important;
      outline: 1px solid var(--border-color) !important;
      box-shadow: none !important;
      padding: 0.75em 1em !important;
      min-width: 220px;
      max-width: min(480px, 92vw);
      border-radius: var(--radius);
    }

    /* Timer progress bar */
    .my-toast .swal2-timer-progress-bar {
      background: hsl(var(--accent)) !important;
    }

    /* Text gradient (if used globally) */
    .my-toast .swal2-title,
    .my-toast .swal2-html-container {
      background: hsl(var(--foreground));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: transparent;
    }

    /* Toast layout */
    .my-toast .toast-flex {
      display: flex;
      align-items: center;
      flex-direction: row;
      gap: 0.75em;
      background: transparent !important;
    }

    .my-toast .toast-logo {
      width: 32px;
      height: 32px;
      object-fit: contain;
      flex-shrink: 0;
      margin-left: 0;
      background: transparent !important;
    }

    .my-toast .toast-title {
      font-size: 1rem;
      font-weight: bold;
      line-height: 1.3;
      margin-bottom: 0.1rem;
    }

    .my-toast .toast-description {
      font-size: 0.85rem;
      line-height: 1.2;
      opacity: 0.9;
      color: hsl(var(--accent)) !important;
      -webkit-text-fill-color: hsl(var(--accent)) !important;
      background: none !important;
    }

    /* RTL compatibility */
    [dir="rtl"] .swal2-container {
      direction: rtl;
    }
  `;
  document.head.appendChild(style);
}
