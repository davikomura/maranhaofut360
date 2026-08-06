// src/pages/MapPage.tsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

interface ActivePopupState {
  city: string;
  teams: typeof teamDetails;
  container: HTMLDivElement;
}

export default function MapPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const activePopupRef = useRef<maplibregl.Popup | null>(null);

  const [activePopup, setActivePopup] = useState<ActivePopupState | null>(null);

  // Capture current theme in a ref
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

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.once("load", () => {
      map.resize();
    });

    requestAnimationFrame(() => {
      map.resize();
    });

    map.on("error", (e) => {
      console.error("MapLibre error:", e);
    });

    mapRef.current = map;

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

  // Update Map Markers using React Portals safely
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers
    Object.entries(teamsByCity).forEach(([city, teams]) => {
      const coords = CITY_COORDINATES[city];
      if (!coords) return;

      const markerEl = document.createElement("div");
      markerEl.className = "map-team-marker-wrap";
      
      const multipleTeams = teams.length > 1;

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

      // Handle marker click to show React portal popup
      markerEl.addEventListener("click", () => {
        if (activePopupRef.current) {
          activePopupRef.current.remove();
        }

        const popupNode = document.createElement("div");

        const popup = new maplibregl.Popup({
          offset: 15,
          closeButton: false,
          className: "custom-maplibre-popup",
        })
          .setLngLat([coords.longitude, coords.latitude])
          .setDOMContent(popupNode)
          .addTo(map);

        popup.on("close", () => {
          setActivePopup(null);
          activePopupRef.current = null;
        });

        activePopupRef.current = popup;
        setActivePopup({ city, teams, container: popupNode });
      });

      const marker = new maplibregl.Marker({ element: markerEl })
        .setLngLat([coords.longitude, coords.latitude])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [t]);

  return (
    <div className="relative w-full h-[calc(100dvh-70px)] overflow-hidden transition-theme bg-slate-100 dark:bg-zinc-950 animate-fade-in-up">
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

      {/* Idiomatic React Portal for Popup content */}
      {activePopup &&
        createPortal(
          <div className="w-64 max-w-sm rounded-2xl border border-slate-200/60 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/98 text-slate-800 dark:text-zinc-200">
            <h3 className="font-heading font-black text-sm border-b border-slate-200/60 dark:border-zinc-800/80 pb-2 mb-3 flex items-center gap-1.5">
              <MapPin size={14} className="text-red-500" />
              {activePopup.city}
            </h3>
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {activePopup.teams.map((team) => (
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
                      if (activePopupRef.current) {
                        activePopupRef.current.remove();
                      }
                      navigate(`/team/${team.id}`);
                    }}
                    aria-label={`${t("mapPage.view")} ${team.name}`}
                    className="shrink-0 text-[10px] bg-slate-100/80 dark:bg-zinc-800 hover:bg-sky-500 hover:text-white font-bold px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {t("mapPage.view")}
                  </button>
                </div>
              ))}
            </div>
          </div>,
          activePopup.container
        )}
    </div>
  );
}
