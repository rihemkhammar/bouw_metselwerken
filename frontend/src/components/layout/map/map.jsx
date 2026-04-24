import React, { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import styles from "./map.module.css";
import points from "./data/bubble_map.json";

const countries = feature(world, world.objects.countries);

// Ratio initial 900/450 = 2:1
const ASPECT_RATIO = 2;

export default function GeoMap() {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 450 });

  // 1. Observer la taille réelle du conteneur
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          setDimensions({ width, height: width / ASPECT_RATIO });
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 2. Recalculer la projection dynamiquement
  const projection = useMemo(() => {
    return d3
      .geoMercator()
      .scale(dimensions.width * (140 / 900)) // Échelle proportionnelle
      .translate([dimensions.width / 2, dimensions.height / 1.4]);
  }, [dimensions]);

  const path = useMemo(() => d3.geoPath().projection(projection), [projection]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles["map-container"]} ref={containerRef}>
          <svg
            className={styles.map}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* background */}
            <rect className={styles["map-background"]} width="100%" height="100%" />

            {/* countries */}
            {countries.features.map((c, i) => (
              <path key={i} d={path(c)} className={styles.country} />
            ))}

            {/* bubbles */}
            {points.map((p, i) => {
              const projected = projection(p.coords);
              if (!projected) return null; // Évite les erreurs si coords hors projection
              const [x, y] = projected;

              return (
                <g key={i}>
                  <title>{p.name} - {p.description}</title>
                  <circle cx={x} cy={y} r={p.value / 5} className={styles.glow} />
                  <circle cx={x} cy={y} r={p.value / 10} className={styles.circle} />
                  <circle cx={x} cy={y} r={3} className={styles.dot} />
                </g>
              );
            })}
          </svg>
        </div>

        <div className={styles["description-container"]}>
          <p>cette societe .....</p>
        </div>
      </div>
    </div>
  );
}