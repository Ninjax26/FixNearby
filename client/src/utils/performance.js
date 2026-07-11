export function measureRenderTime(componentName) {
  const start = performance.now();
  return () => {
    const elapsed = performance.now() - start;
    if (elapsed > 16) {
      console.warn(`[Perf] ${componentName} took ${elapsed.toFixed(1)}ms to render`);
    }
    return elapsed;
  };
}

export function reportWebVitals(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    url: window.location.href,
    timestamp: Date.now(),
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/logs/vitals', body);
  } else {
    fetch('/api/logs/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

export function lazyWithRetry(importFn, retries = 2, delay = 1000) {
  return new Promise((resolve, reject) => {
    const attempt = (remaining) => {
      importFn()
        .then(resolve)
        .catch((err) => {
          if (remaining <= 0) {
            reject(err);
            return;
          }
          setTimeout(() => attempt(remaining - 1), delay);
        });
    };
    attempt(retries);
  });
}

export function prefetchOnIdle(importFn) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => importFn(), { timeout: 3000 });
  } else {
    setTimeout(() => importFn(), 2000);
  }
}
