// src/pages/MapPage.tsx
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";

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

export default function MapPage() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<"ALL" | "A" | "B" | "OTHER">("ALL");
  // Refs for MapLibre
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Page SEO
  useSEO({
    title: t("mapPage.title"),
    description: t("mapPage.description"),
  });

  // Filter teams
  const filteredTeams = teamDetails.filter((team) => {
    const cityName = team.city || "São Luís";
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cityName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDivision =
      divisionFilter === "ALL" ||
      (divisionFilter === "A" && team.stateDivision === "A") ||
      (divisionFilter === "B" && team.stateDivision === "B") ||
      (divisionFilter === "OTHER" && !team.stateDivision);

    return matchesSearch && matchesDivision;
  });

  // Group filtered teams by city
  const teamsByCity = filteredTeams.reduce<Record<string, typeof teamDetails>>((acc, team) => {
    const city = team.city || "São Luís";
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(team);
    return acc;
  }, {});

  const getTeamInitials = (name: string) =>
    name
      .replace(/\([^)]*\)/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Map
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: theme === "dark" ? DARK_STYLE : LIGHT_STYLE,
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

  // Update Map Markers based on filtered data
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
        <div className="w-64 max-w-sm rounded-2xl border border-slate-200/60 bg-[#FAF8F5]/98 p-4 shadow-xl backdrop-blur-md dark:border-zinc-900/60 dark:bg-[#07070A]/98 text-slate-800 dark:text-zinc-200">
          <h3 className="font-heading font-black text-sm border-b border-slate-200/50 dark:border-zinc-900/60 pb-2 mb-2 flex items-center gap-1.5">
            <MapPin size={14} className="text-red-500" />
            {city}
          </h3>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between gap-3 border-b border-slate-200/30 dark:border-zinc-900/40 last:border-0 pb-2 last:pb-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[10px] font-black text-white shadow-sm ring-2 ring-sky-100 dark:ring-zinc-800">
                    {getTeamInitials(team.name)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-heading font-bold text-xs text-slate-900 dark:text-white truncate">
                      {team.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-zinc-550 font-semibold">
                      {team.stateDivision ? t(`mapPage.serie${team.stateDivision}`) : t("mapPage.noDivision")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    popup.remove();
                    navigate(`/team/${team.id}`);
                  }}
                  className="shrink-0 text-[9px] bg-[#FAF8F5] border border-slate-300 dark:border-zinc-800 hover:bg-[#F5F2EC] dark:bg-zinc-950/40 dark:hover:bg-zinc-900 font-bold px-2 py-1 rounded-lg text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
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
  }, [filteredTeams, t, navigate]);

  return (
    <div className="min-h-screen bg-stadium-dots bg-mesh-gradient-rich transition-theme">
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
        /* Custom map container border shadow styling */
        .map-wrapper-shadow {
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
        }
        .dark .map-wrapper-shadow {
          box-shadow: 0 10px 35px -10px rgba(0, 0, 0, 0.4);
        }
        .map-team-marker-wrap {
          align-items: center;
          cursor: pointer;
          display: flex;
          justify-content: center;
          transition: transform 180ms ease, filter 180ms ease;
        }
        .map-team-marker-wrap:hover {
          filter: brightness(1.05);
          transform: scale(1.12);
        }
        .map-team-marker {
          align-items: center;
          border-radius: 9999px;
          box-shadow: 0 10px 18px rgba(37, 99, 235, 0.28);
          display: flex;
          justify-content: center;
        }
        .map-team-marker--count {
          background: #6366f1;
          border: 3px solid rgba(255, 255, 255, 0.95);
          color: white;
          font-size: 18px;
          font-weight: 900;
          height: 46px;
          line-height: 1;
          outline: 2px solid rgba(99, 102, 241, 0.35);
          width: 46px;
        }
        .map-team-marker--single {
          background: #94a3b8;
          border: 2px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.2);
          height: 13px;
          outline: 2px solid rgba(148, 163, 184, 0.25);
          width: 13px;
        }
        .dark .map-team-marker--count {
          border-color: rgba(24, 24, 27, 0.95);
          outline-color: rgba(129, 140, 248, 0.45);
        }
        .dark .map-team-marker--single {
          background: #71717a;
          border-color: rgba(24, 24, 27, 0.95);
        }
      `}</style>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-14 space-y-8">
        {/* Title Decorator Header */}
        <section className="space-y-4">
          <div className="h-[4px] w-20 bg-gradient-to-r from-sky-600 via-blue-500 to-emerald-500 rounded-full" />
          <span className="inline-flex rounded-full bg-sky-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-655 dark:bg-sky-500/15 dark:text-sky-400">
            {t("nav.map")}
          </span>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-slate-900 md:text-5xl dark:text-white leading-[1.1]">
            {t("mapPage.title")}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-zinc-400 md:text-base">
            {t("mapPage.description")}
          </p>
        </section>

        {/* Dashboard Grid */}
        <section className="grid gap-5 lg:grid-cols-[260px_1fr] items-stretch">
          
          {/* Controls & List Sidebar */}
          <div className="flex flex-col gap-4 self-start bg-[#FAF8F5]/30 dark:bg-zinc-950/10 rounded-2xl border border-slate-200/50 dark:border-zinc-900/60 p-4 backdrop-blur-sm shadow-sm">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-zinc-650" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("mapPage.searchPlaceholder")}
                className="w-full rounded-xl border border-slate-350 bg-[#FAF8F5]/80 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-sky-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200 dark:placeholder-zinc-600 dark:focus:border-sky-400 dark:focus:bg-zinc-950"
              />
            </div>

            {/* Division Filters */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-zinc-550">
                <SlidersHorizontal size={12} />
                <span>{t("mapPage.divisionFilter")}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => setDivisionFilter("ALL")}
                  className={`py-2 px-3 rounded-lg border text-left transition-all ${
                    divisionFilter === "ALL"
                      ? "border-sky-500 bg-sky-500/5 text-sky-600 dark:border-sky-400 dark:text-sky-400"
                      : "border-slate-200 bg-[#FAF8F5]/50 hover:bg-[#F5F2EC] dark:border-zinc-900 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/30 text-slate-600 dark:text-zinc-400"
                  }`}
                >
                  {t("mapPage.allDivisions")}
                </button>
                <button
                  onClick={() => setDivisionFilter("A")}
                  className={`py-2 px-3 rounded-lg border text-left transition-all ${
                    divisionFilter === "A"
                      ? "border-red-500 bg-red-500/5 text-red-650 dark:border-red-400 dark:text-red-400"
                      : "border-slate-200 bg-[#FAF8F5]/50 hover:bg-[#F5F2EC] dark:border-zinc-900 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/30 text-slate-600 dark:text-zinc-400"
                  }`}
                >
                  {t("mapPage.serieA")}
                </button>
                <button
                  onClick={() => setDivisionFilter("B")}
                  className={`py-2 px-3 rounded-lg border text-left transition-all ${
                    divisionFilter === "B"
                      ? "border-blue-500 bg-blue-500/5 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                      : "border-slate-200 bg-[#FAF8F5]/50 hover:bg-[#F5F2EC] dark:border-zinc-900 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/30 text-slate-600 dark:text-zinc-400"
                  }`}
                >
                  {t("mapPage.serieB")}
                </button>
                <button
                  onClick={() => setDivisionFilter("OTHER")}
                  className={`py-2 px-3 rounded-lg border text-left transition-all ${
                    divisionFilter === "OTHER"
                      ? "border-amber-500 bg-amber-500/5 text-amber-600 dark:border-amber-400 dark:text-amber-400"
                      : "border-slate-200 bg-[#FAF8F5]/50 hover:bg-[#F5F2EC] dark:border-zinc-900 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/30 text-slate-600 dark:text-zinc-400"
                  }`}
                >
                  {t("mapPage.otherDivisions")}
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Map Container */}
          <div className="relative rounded-2xl border border-slate-200/50 dark:border-zinc-900/60 overflow-hidden bg-slate-100 dark:bg-zinc-950 map-wrapper-shadow h-[520px] lg:h-[680px] flex flex-col">
            <div ref={mapContainerRef} className="w-full h-full" />
            
            <div className="absolute bottom-4 left-4 bg-[#FAF8F5]/90 dark:bg-zinc-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/50 dark:border-zinc-900/60 shadow-lg text-[10px] font-bold text-slate-500 dark:text-zinc-400 space-y-1.5 pointer-events-none z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 border border-white dark:border-zinc-900 inline-block shrink-0" />
                <span>{t("mapPage.multipleClubs")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-zinc-500 border border-white dark:border-zinc-900 inline-block shrink-0" />
                <span>{t("mapPage.singleClub")}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
