import React from "react";
import { Layers, Clock, PlayCircle, CheckSquare } from "lucide-react";

const FILTERS = [
  { key: "ALL",         label: "Tous",      Icon: Layers      },
  { key: "PLANNED",     label: "Planifiés", Icon: Clock       },
  { key: "IN_PROGRESS", label: "En cours",  Icon: PlayCircle  },
  { key: "COMPLETED",   label: "Terminés",  Icon: CheckSquare },
];

const COLOR = {
  ALL:         { active: "var(--primary)",   bg: "rgba(0,115,207,0.08)",   border: "rgba(0,115,207,0.2)"   },
  PLANNED:     { active: "var(--primary)",   bg: "rgba(0,115,207,0.08)",   border: "rgba(0,115,207,0.2)"   },
  IN_PROGRESS: { active: "#FF8C00",          bg: "rgba(255,140,0,0.08)",   border: "rgba(255,140,0,0.2)"   },
  COMPLETED:   { active: "var(--success)",   bg: "rgba(40,167,69,0.08)",   border: "rgba(40,167,69,0.2)"   },
};

export default function ChefProjectFilters({ filter, onFilterChange, counts }) {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 8,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {FILTERS.map(({ key, label, Icon }) => {
        const isActive = filter === key;
        const c = COLOR[key];
        return (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 999,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: isActive ? `1px solid ${c.border}` : "1px solid var(--border)",
              background: isActive ? c.bg : "var(--white)",
              color: isActive ? c.active : "var(--gris)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "var(--background)";
                e.currentTarget.style.color = "var(--secondary-text)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "var(--white)";
                e.currentTarget.style.color = "var(--gris)";
              }
            }}
          >
            <Icon size={12} />
            {label}
            <span style={{
              padding: "1px 7px", borderRadius: 999, fontSize: 10, fontWeight: 700,
              background: isActive ? c.bg : "rgba(128,128,128,0.08)",
              color: isActive ? c.active : "var(--gris)",
              border: isActive ? `1px solid ${c.border}` : "1px solid transparent",
            }}>
              {counts[key] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}