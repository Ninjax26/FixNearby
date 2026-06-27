/**
 * usePasswordStrength.js
 *
 * Evaluates a password against the same criteria enforced by the server-side
 * STRONG_PASSWORD_REGEX in validationMiddleware.js.  Keeping the rules
 * synchronised in a dedicated hook (rather than ad-hoc inline checks) ensures
 * that the UI hints always match what the backend will accept.
 *
 * Usage:
 *   import { usePasswordStrength } from '../hooks/usePasswordStrength';
 *
 *   const Register = () => {
 *     const [password, setPassword] = useState('');
 *     const { score, label, color, checks } = usePasswordStrength(password);
 *
 *     return (
 *       <>
 *         <input value={password} onChange={e => setPassword(e.target.value)} />
 *
 *         {/* Strength bar *\/}
 *         <div style={{ width: `${score * 25}%`, background: color }} />
 *         <p style={{ color }}>{label}</p>
 *
 *         {/* Requirement checklist *\/}
 *         <ul>
 *           {Object.entries(checks).map(([key, passed]) => (
 *             <li key={key} style={{ color: passed ? 'green' : 'red' }}>
 *               {passed ? '✓' : '✗'} {key}
 *             </li>
 *           ))}
 *         </ul>
 *       </>
 *     );
 *   };
 */

import { useMemo } from 'react';

/** Individual password-strength checks — keep in sync with server regex. */
const CHECKS = {
  'At least 8 characters': (p) => p.length >= 8,
  'Uppercase letter (A-Z)': (p) => /[A-Z]/.test(p),
  'Lowercase letter (a-z)': (p) => /[a-z]/.test(p),
  'Digit (0-9)': (p) => /\d/.test(p),
  'Special character (!@#$…)': (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(p),
};

const SCORE_LABELS = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const SCORE_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];

/**
 * @param {string} password - The raw password string to evaluate.
 * @returns {{
 *   score: number,        // 0–4 (0 = no checks passed, 4 = all passed)
 *   label: string,        // Human-readable strength label
 *   color: string,        // CSS color hex for strength indicator
 *   checks: Record<string, boolean>  // Per-rule pass/fail map
 * }}
 */
export function usePasswordStrength(password) {
  return useMemo(() => {
    if (!password) {
      return {
        score: 0,
        label: SCORE_LABELS[0],
        color: SCORE_COLORS[0],
        checks: Object.fromEntries(Object.keys(CHECKS).map((k) => [k, false])),
      };
    }

    const checkResults = Object.fromEntries(
      Object.entries(CHECKS).map(([label, test]) => [label, test(password)])
    );

    // Score is the number of passing checks, capped to the label array length.
    const score = Math.min(
      Object.values(checkResults).filter(Boolean).length,
      SCORE_LABELS.length - 1
    );

    return {
      score,
      label: SCORE_LABELS[score],
      color: SCORE_COLORS[score],
      checks: checkResults,
    };
  }, [password]);
}
