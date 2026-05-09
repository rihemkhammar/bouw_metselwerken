import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import { MapPin, Globe, Award, Users } from "lucide-react"; 

import styles from "./map.module.css";
import points from "./data/bubble_map.json";

const countries = feature(world, world.objects.countries);
const ASPECT_RATIO = 2;

export default function GeoMap({ onBubbleClick, onCountryHover }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const zoomRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: 900, height: 450 });
  const [tooltip, setTooltip] = useState(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  /* Resize Observer */
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width > 0) {
        setDimensions({
          width,
          height: width / ASPECT_RATIO,
        });
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  /* Projection */
  const projection = useMemo(
    () =>
      d3
        .geoMercator()
        .scale(dimensions.width * (140 / 900))
        .translate([dimensions.width / 2, dimensions.height / 1.4]),
    [dimensions]
  );

  const path = useMemo(() => d3.geoPath().projection(projection), [projection]);

  /* Zoom */
  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on("zoom", (e) => {
        d3.select(gRef.current).attr("transform", e.transform);
      });

    d3.select(svgRef.current).call(zoom);
    zoomRef.current = zoom;

    const handleDblClick = (e) => {
      e.preventDefault();
      d3.select(svgRef.current)
        .transition()
        .duration(400)
        .call(zoom.transform, d3.zoomIdentity);
    };

    svgRef.current.addEventListener("dblclick", handleDblClick);

    return () =>
      svgRef.current?.removeEventListener("dblclick", handleDblClick);
  }, []);

  const zoom = (scale) => {
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoomRef.current.scaleBy, scale);
  };

  const handleZoomIn = () => zoom(1.3);
  const handleZoomOut = () => zoom(0.7);
  const handleZoomReset = () => {
    d3.select(svgRef.current)
      .transition()
      .duration(400)
      .call(zoomRef.current.transform, d3.zoomIdentity);
  };

  const showTooltip = (e, content) => {
    setTooltip({
      x: e.clientX,
      y: e.clientY,
      content,
    });
  };

  const hideTooltip = () => setTooltip(null);

  const handleCountryEnter = useCallback(
    (country, e) => {
      const name = country.properties?.name || "Pays inconnu";
      setHoveredCountry(name);
      onCountryHover?.(country.properties);
      showTooltip(e, name);
    },
    [onCountryHover]
  );

  return (
    <div className={styles.container}  id="MAP">
      <div className={styles.wrapper}>
        {/* Carte */}
        <div className={styles.mapContainer} ref={containerRef}>
          <div className={styles.zoomControls}>
            <button 
              onClick={handleZoomIn} 
              className={styles.zoomBtn}
              aria-label="Zoomer"
            >
              +
            </button>
            <button 
              onClick={handleZoomOut} 
              className={styles.zoomBtn}
              aria-label="Dézoomer"
            >
              −
            </button>
            <button 
              onClick={handleZoomReset} 
              className={styles.zoomBtn}
              aria-label="Réinitialiser"
            >
              ⟲
            </button>
          </div>

          <svg
            ref={svgRef}
            className={styles.map}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
          >
            <rect className={styles.mapBackground} width="100%" height="100%" />
            <g ref={gRef}>
              {countries.features.map((c, i) => (
                <path
                  key={i}
                  d={path(c)}
                  className={styles.country}
                  onMouseEnter={(e) => handleCountryEnter(c, e)}
                  onMouseLeave={hideTooltip}
                />
              ))}
              {points.map((p, i) => {
                const projected = projection(p.coords);
                if (!projected) return null;
                const [x, y] = projected;
                const r = p.value / 10;
                return (
                  <g
                    key={i}
                    className={styles.bubble}
                    onClick={() => onBubbleClick?.(p)}
                    onMouseEnter={(e) =>
                      showTooltip(
                        e,
                        `<strong>${p.name}</strong><br/>${p.description}`
                      )
                    }
                    onMouseLeave={hideTooltip}
                  >
                    <circle cx={x} cy={y} r={r * 2} className={styles.glow} />
                    <circle cx={x} cy={y} r={r} className={styles.circle} />
                    <circle cx={x} cy={y} r={4} className={styles.dot} />
                  </g>
                );
              })}
            </g>
          </svg>

          {tooltip && (
            <div
              className={styles.tooltip}
              style={{ left: tooltip.x, top: tooltip.y - 10 }}
              dangerouslySetInnerHTML={{ __html: tooltip.content }}
            />
          )}
        </div>

        {/* Description */}
        <div className={styles["description-container"]}>
          <div className={styles["description-header"]}>
            <h2>A&M Gharred </h2>
            <span className={styles.subtitle}>Solutions Technologiques Sur Mesure</span>
          </div>

          <p>
            Notre entreprise est une entreprise spécialisée dans les travaux de construction et de rénovation, récemment créée et dirigée par Gharred Hamza, qui bénéficie de 15 ans d’expérience dans le domaine du bâtiment.
          </p>

          <p>
            Forte de l’expertise de son gérant, elle propose une large gamme de services, allant de la maçonnerie générale à la rénovation complète, en passant par la restauration et les travaux de finition.
          </p>

          <p>
            Par ailleurs, nous avons également contribué à des projets à l'international, 
           Notre objectif est d’offrir des prestations de qualité, adaptées aux besoins de chaque client, tout en respectant les délais et les normes en vigueur.
          </p>

          <p>
            Nous accompagnons nos clients à chaque étape de leur projet, en garantissant un travail sérieux, professionnel et soigné.
          </p>

          {/* Stats optionnelles */}
          <div className={styles["description-stats"]}>
            <div className={styles["stat-item"]}>
              <span className={styles["stat-number"]}>50+</span>
              <span className={styles["stat-label"]}>Projets</span>
            </div>
            <div className={styles["stat-item"]}>
              <span className={styles["stat-number"]}>15</span>
              <span className={styles["stat-label"]}>Pays</span>
            </div>
            <div className={styles["stat-item"]}>
              <span className={styles["stat-number"]}>98%</span>
              <span className={styles["stat-label"]}>Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}