import { useEffect, useRef, useState } from "react";

const getWorkerCoords = (worker) => {
  if (worker.mockOffset) {
    return [worker.mockOffset.lat, worker.mockOffset.lon];
  }
  if (worker.location && worker.location.coordinates && worker.location.coordinates.length === 2) {
    // GeoJSON format is [longitude, latitude]
    return [worker.location.coordinates[1], worker.location.coordinates[0]];
  }
  return null;
};

const MapView = ({ workers, selectedWorkerId, onMarkerClick }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Dynamic Leaflet Loader
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    cssLink.id = "leaflet-css";
    document.head.appendChild(cssLink);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.id = "leaflet-js";
    script.onload = () => setLeafletLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Clean up scripts on unmount to avoid duplicates
      const css = document.getElementById("leaflet-css");
      const js = document.getElementById("leaflet-js");
      if (css) document.head.removeChild(css);
      if (js) document.body.removeChild(js);
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center default Hyderbad (from mockWorkers)
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: false
      }).setView([17.4065, 78.4772], 12);

      // Voyager elegant light gray basemap
      window.L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Zoom controller to bottom right
      window.L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = window.L.featureGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Update Markers & Clustering
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current || !markersGroupRef.current) return;

    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    // 1. Filter out workers without valid coordinates
    const workersWithCoords = workers
      .map(w => ({ worker: w, coords: getWorkerCoords(w) }))
      .filter(w => w.coords !== null);

    if (workersWithCoords.length === 0) return;

    // 2. Simple Proximity-Based Clustering (0.015 degrees distance)
    const CLUSTER_DISTANCE = 0.015;
    const clusters = [];

    workersWithCoords.forEach(({ worker, coords }) => {
      let addedToCluster = false;
      
      for (let cluster of clusters) {
        const center = cluster.center;
        const latDiff = Math.abs(center[0] - coords[0]);
        const lonDiff = Math.abs(center[1] - coords[1]);
        
        if (latDiff < CLUSTER_DISTANCE && lonDiff < CLUSTER_DISTANCE) {
          cluster.workers.push(worker);
          addedToCluster = true;
          break;
        }
      }

      if (!addedToCluster) {
        clusters.push({
          center: coords,
          workers: [worker]
        });
      }
    });

    // 3. Render markers and clusters
    clusters.forEach(cluster => {
      if (cluster.workers.length === 1) {
        // Single Worker marker
        const w = cluster.workers[0];
        const isSelected = String(w.id) === String(selectedWorkerId);
        
        const price = w.price ? (w.price.toString().startsWith('$') ? w.price : `$${w.price}`) : '$40';
        
        const icon = window.L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div class="relative flex flex-col items-center group transition-all duration-200 cursor-pointer ${
              isSelected ? 'scale-125 z-[999]' : 'z-10'
            }">
              <div class="px-2.5 py-1 bg-slate-900 border ${
                isSelected ? 'border-blue-500 bg-blue-600' : 'border-slate-800'
              } text-white rounded-xl shadow-md flex items-center gap-1 font-bold text-[10px] whitespace-nowrap">
                ${w.verified ? '<span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>' : ''}
                <span>${price}</span>
              </div>
              <div class="w-2 h-2 bg-slate-900 ${isSelected ? 'bg-blue-600' : ''} rotate-45 -mt-1 shadow-sm"></div>
            </div>
          `,
          iconSize: [60, 30],
          iconAnchor: [30, 30]
        });

        const marker = window.L.marker(cluster.center, { icon });
        marker.on('click', () => onMarkerClick(w.id));
        marker.addTo(markersGroup);
      } else {
        // Cluster marker
        const count = cluster.workers.length;
        const containsSelected = cluster.workers.some(w => String(w.id) === String(selectedWorkerId));

        const icon = window.L.divIcon({
          className: 'custom-cluster-marker',
          html: `
            <div class="w-9 h-9 rounded-full ${
              containsSelected ? 'bg-blue-600 border-blue-400' : 'bg-slate-900 border-slate-700'
            } text-white font-extrabold flex items-center justify-center border-2 shadow-lg text-xs cursor-pointer hover:scale-105 transition-all">
              ${count}
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const marker = window.L.marker(cluster.center, { icon });
        marker.on('click', () => {
          map.setView(cluster.center, map.getZoom() + 1.5);
        });
        marker.addTo(markersGroup);
      }
    });

    // 4. Adjust bounds to fit all markers
    try {
      const bounds = markersGroup.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    } catch (e) {
      console.error(e);
    }
  }, [leafletLoaded, workers, selectedWorkerId]);

  return (
    <div className="w-full h-full min-h-[350px] relative bg-slate-100 rounded-3xl overflow-hidden shadow-inner border border-slate-200/50">
      {!leafletLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-50 z-20">
          <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading Map...</span>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};

export default MapView;
