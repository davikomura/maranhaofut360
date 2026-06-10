// src/pages/MapPage.tsx
import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";

import { teamDetails } from "../lib/footballData";
import { useTheme } from "../hooks/useTheme";
import { useSEO } from "../hooks/useSEO";
import {
  CITY_COORDINATES,
  MARANHAO_CENTER,
  DEFAULT_ZOOM,
} from "../utils/mapCoordinates";

const LIGHT_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    "carto-raster-tiles": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      ],
      tileSize: 256,
      attribution: "© CARTO, © OpenStreetMap contributors"
    }
  },
  layers: [
    {
      id: "carto-raster-layer",
      type: "raster",
      source: "carto-raster-tiles",
      minzoom: 0,
      maxzoom: 18
    }
  ]
};

const DARK_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    "carto-raster-tiles": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
      ],
      tileSize: 256,
      attribution: "© CARTO, © OpenStreetMap contributors"
    }
  },
  layers: [
    {
      id: "carto-raster-layer",
      type: "raster",
      source: "carto-raster-tiles",
      minzoom: 0,
      maxzoom: 18
    }
  ]
};

const teamsByCity = teamDetails.reduce<Record<string, typeof teamDetails>>((acc, team) => {
  const city = team.city || "São Luís";
  if (!acc[city]) {
    acc[city] = [];
  }
  acc[city].push(team);
  return acc;
}, {});

export default function MapPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Capture current theme in a ref to avoid putting it in the map initialization useEffect dependency array
  const themeRef = useRef(theme);
  themeRef.current = theme;

  // Page SEO
  useSEO({
    title: t("mapPage.title"),
    description: t("mapPage.description"),
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Map
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: themeRef.current === "dark" ? DARK_STYLE : LIGHT_STYLE,
      center: MARANHAO_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 5.5,
      maxZoom: 15,
      dragRotate: false,
      pitchWithRotate: false,
    });

    // Add navigation controls (zoom only)
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.once("load", () => {
      map.resize();
    });

    requestAnimationFrame(() => {
      map.resize();
    });

    // Add error handler
    map.on("error", (e) => {
      console.error("MapLibre error:", e);
    });

    mapRef.current = map;

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Sync Map Theme Style
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(theme === "dark" ? DARK_STYLE : LIGHT_STYLE);
  }, [theme]);

  // Update Map Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers for each city that has active teams
    Object.entries(teamsByCity).forEach(([city, teams]) => {
      const coords = CITY_COORDINATES[city];
      if (!coords) return; // Skip if no coordinates mapped

      // Create Custom HTML Marker element
      const markerEl = document.createElement("div");
      markerEl.className = "map-team-marker-wrap";
      
      const multipleTeams = teams.length > 1;

      // Inner HTML styling
      if (multipleTeams) {
        markerEl.innerHTML = `
          <div class="map-team-marker map-team-marker--count" aria-label="${city}: ${t("mapPage.cityTeamsCount", { count: teams.length })}">
            ${teams.length}
          </div>
        `;
      } else {
        markerEl.innerHTML = `
          <div class="map-team-marker map-team-marker--single" aria-label="${city}: ${t("mapPage.cityTeamsCount", { count: 1 })}"></div>
        `;
      }

      // Create Popup Node container
      const popupNode = document.createElement("div");
      const root = createRoot(popupNode);

      root.render(
        <div className="w-64 max-w-sm rounded-2xl border border-slate-200/60 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/98 text-slate-800 dark:text-zinc-200">
          <h3 className="font-heading font-black text-sm border-b border-slate-200/60 dark:border-zinc-800/80 pb-2 mb-3 flex items-center gap-1.5">
            <MapPin size={14} className="text-red-500" />
            {city}
          </h3>
          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800/50 last:border-0 pb-3 last:pb-0"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center p-0.5 rounded-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm">
                    <img 
                      src={team.image} 
                      alt={team.name} 
                      className="w-full h-full object-contain drop-shadow-sm" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading font-bold text-xs text-slate-900 dark:text-white truncate">
                      {team.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold mt-0.5">
                      {team.stateDivision ? t(`mapPage.serie${team.stateDivision}`) : t("mapPage.noDivision")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    popup.remove();
                    navigate(`/team/${team.id}`);
                  }}
                  className="shrink-0 text-[10px] bg-slate-100/80 dark:bg-zinc-800 hover:bg-sky-500 hover:text-white font-bold px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  {t("mapPage.view")}
                </button>
              </div>
            ))}
          </div>
        </div>
      );

      const popup = new maplibregl.Popup({
        offset: 15,
        closeButton: false,
        className: "custom-maplibre-popup",
      }).setDOMContent(popupNode);

      popup.on("close", () => {
        setTimeout(() => {
          root.unmount();
        }, 150);
      });

      // Create Marker
      const marker = new maplibregl.Marker({ element: markerEl })
        .setLngLat([coords.longitude, coords.latitude])
        .setPopup(popup)
        .addTo(map);

      // Add to ref
      markersRef.current.push(marker);
    });
  }, [t, navigate]);

  return (
    <div className="relative w-full h-[calc(100dvh-70px)] overflow-hidden transition-theme bg-slate-100 dark:bg-zinc-950">
      <style>{`
        .custom-maplibre-popup .maplibregl-popup-content {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          border: none !important;
        }
        .custom-maplibre-popup .maplibregl-popup-tip {
          border-top-color: transparent !important;
          border-bottom-color: transparent !important;
          border-left-color: transparent !important;
          border-right-color: transparent !important;
          display: none !important;
        }
        .map-team-marker-wrap {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: center;
          transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), filter 200ms ease;
        }
        .map-team-marker-wrap:hover {
          filter: brightness(1.1);
          transform: scale(1.15) translateY(-2px);
          z-index: 50;
        }
        .map-team-marker {
          align-items: center;
          border-radius: 9999px;
          display: flex;
          justify-content: center;
        }
        @keyframes mapPulseCount {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.5), 0 8px 16px rgba(37, 99, 235, 0.25);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(37, 99, 235, 0), 0 8px 16px rgba(37, 99, 235, 0.25);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0), 0 8px 16px rgba(37, 99, 235, 0.25);
          }
        }
        @keyframes mapPulseSingle {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5), 0 6px 12px rgba(239, 68, 68, 0.2);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(239, 68, 68, 0), 0 6px 12px rgba(239, 68, 68, 0.2);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0), 0 6px 12px rgba(239, 68, 68, 0.2);
          }
        }
        .map-team-marker--count {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: 3px solid #ffffff;
          box-shadow: 0 8px 16px rgba(37, 99, 235, 0.35);
          color: white;
          font-size: 16px;
          font-weight: 900;
          height: 44px;
          line-height: 1;
          outline: 3px solid rgba(59, 130, 246, 0.2);
          width: 44px;
          animation: mapPulseCount 2s infinite ease-in-out;
        }
        .map-team-marker--single {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: 2px solid #ffffff;
          box-shadow: 0 6px 12px rgba(239, 68, 68, 0.3);
          height: 16px;
          outline: 3px solid rgba(239, 68, 68, 0.15);
          width: 16px;
          animation: mapPulseSingle 2.5s infinite ease-in-out;
        }
        .dark .map-team-marker--count {
          border-color: #18181b;
          outline-color: rgba(59, 130, 246, 0.3);
        }
        .dark .map-team-marker--single {
          border-color: #18181b;
          outline-color: rgba(239, 68, 68, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 4px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(82, 82, 91, 0.5);
        }
      `}</style>

      {/* Map Element Filling the Screen */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Floating Title Card */}
      <div className="absolute top-6 left-6 z-10 max-w-[320px] pointer-events-none hidden md:block">
        <div className="bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl p-6 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 shadow-xl pointer-events-auto">
          <div className="h-1.5 w-14 bg-gradient-to-r from-sky-600 via-blue-500 to-emerald-500 rounded-full mb-4" />
          <h1 className="text-2xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-2.5">
            {t("mapPage.title")}
          </h1>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-400">
            {t("mapPage.description")}
          </p>
        </div>
      </div>

      {/* Mobile Title Simple Floating Banner */}
      <div className="absolute top-4 left-4 right-4 z-10 md:hidden pointer-events-none">
        <div className="bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl px-5 py-4 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80 shadow-xl pointer-events-auto flex items-center justify-between">
          <h1 className="text-base font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t("mapPage.title")}
          </h1>
          <div className="h-1.5 w-8 bg-gradient-to-r from-sky-600 to-blue-500 rounded-full" />
        </div>
      </div>

      {/* Floating Legend */}
      <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl px-4 py-3.5 rounded-2xl border border-slate-200/60 dark:border-zinc-800/80 shadow-xl text-[11px] font-bold text-slate-600 dark:text-zinc-300 space-y-3 pointer-events-none z-10 min-w-[160px]">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm ring-2 ring-white dark:ring-zinc-900 shrink-0" />
          <span>{t("mapPage.multipleClubs")}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-red-400 to-red-600 ring-2 ring-white dark:ring-zinc-900 shadow-sm shrink-0 ml-[3px]" />
          <span className="ml-[3px]">{t("mapPage.singleClub")}</span>
        </div>
      </div>
    </div>
  );
}
