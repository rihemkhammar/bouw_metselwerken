import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/admin/AdminLayout";
import { FaWrench, FaPlus, FaUserMinus, FaUserPlus, FaChevronDown, FaChevronUp, FaHardHat, FaLayerGroup } from "react-icons/fa";
import { getServicesList, getChefs, assignChefToService, removeChefFromService } from "../../services/api";

const SERVICES = [
  { value: "MACONNERIE",              label: "Maçonnerie",              icon: "🧱" },
  { value: "RENOVATION",              label: "Rénovation",              icon: "🔨" },
  { value: "RESTAURATION",            label: "Restauration",            icon: "🏛️" },
  { value: "CONSTRUCTION_GENERALE",   label: "Construction Générale",   icon: "🏗️" },
  { value: "REJOINTOIEMENT_RUSTIQUE", label: "Rejointoiement Rustique", icon: "⚒️" },
  { value: "TRAITEMENT_HYDROFUGE",    label: "Traitement Hydrofuge",    icon: "💧" },
  { value: "DEMOUSSAGE",              label: "Démoussage",              icon: "🌿" },
];

export default function ServicesPage() {
  const [services, setServices]           = useState([]);
  const [allChefs, setAllChefs]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [expandedService, setExpanded]    = useState(null);
  const [assignModal, setAssignModal]     = useState(null); // service value string
  const [selectedChef, setSelectedChef]  = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast]                 = useState(null);

  /* ── helpers ──────────────────────────────────────────── */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      const [svcData, chefsData] = await Promise.all([
        getServicesList(),
        getChefs(),
      ]);
      setServices(Array.isArray(svcData) ? svcData : []);
      setAllChefs(Array.isArray(chefsData) ? chefsData : []);
    } catch {
      showToast("Erreur lors du chargement des données", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const getAvailableChefs = (serviceName) => {
    const svc = services.find((s) => s.service === serviceName);
    const assignedIds = svc?.chefs?.map((c) => c.id) ?? [];
    return allChefs.filter((c) => !assignedIds.includes(c.id));
  };

  const handleAssign = async () => {
    if (!selectedChef) return;
    setActionLoading(true);
    try {
      await assignChefToService(assignModal, selectedChef);
      showToast("Chef assigné avec succès");
      setAssignModal(null);
      setSelectedChef("");
      await loadData();
    } catch (err) {
      showToast(err.message || "Erreur lors de l'assignation", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async (service, chefId, chefName) => {
    if (!confirm(`Retirer ${chefName} du service ${SERVICES.find(s => s.value === service)?.label} ?`)) return;
    setActionLoading(true);
    try {
      await removeChefFromService(service, chefId);
      showToast("Chef retiré avec succès");
      await loadData();
    } catch (err) {
      showToast(err.message || "Erreur lors du retrait", "error");
    } finally {
      setActionLoading(false);
    }
  };

  /* ── derived stats ────────────────────────────────────── */
  const totalProjects    = services.reduce((a, s) => a + s.projectsCount, 0);
  const totalAssignments = services.reduce((a, s) => a + s.chefs.length, 0);
  const withoutChef      = services.filter((s) => s.chefs.length === 0).length;
  const maxProjects      = Math.max(1, ...services.map((s) => s.projectsCount));

  /* ── loading state ────────────────────────────────────── */
  if (loading) {
    return (
      <AdminLayout pageTitle="Services">
        <div className="flex items-center justify-center h-64 gap-3 text-[var(--gris)]">
          <svg className="animate-spin h-6 w-6 text-[var(--primary)]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <span className="font-medium">Chargement des services…</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Services">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaLayerGroup className="text-[var(--primary)]" size={22} />
              </div>
              <h1 className="text-2xl font-bold text-[var(--text)]">Gestion des services</h1>
            </div>
            <p className="text-[var(--gris)] ml-11 text-sm">
              Visualisez chaque service, ses chefs assignés et ses projets associés.
            </p>
          </div>
        </div>

        {/* ── KPI strip ───────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Services",      value: SERVICES.length, color: "text-[var(--primary)]",   bg: "bg-blue-50"   },
            { label: "Projets total", value: totalProjects,    color: "text-[var(--secondary)]", bg: "bg-orange-50" },
            { label: "Assignations",  value: totalAssignments, color: "text-[var(--success)]",   bg: "bg-green-50"  },
            { label: "Sans chef",     value: withoutChef,      color: "text-[var(--error)]",     bg: "bg-red-50"    },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl border border-[var(--border)] p-5`}>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-[var(--gris)] font-medium uppercase tracking-wide mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Cards grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {SERVICES.map((svcMeta) => {
            const svcData    = services.find((s) => s.service === svcMeta.value);
            const chefs      = svcData?.chefs ?? [];
            const count      = svcData?.projectsCount ?? 0;
            const isExpanded = expandedService === svcMeta.value;
            const barWidth   = Math.round((count / maxProjects) * 100);

            return (
              <div
                key={svcMeta.value}
                className={`bg-white rounded-2xl border ${
                  chefs.length === 0
                    ? "border-yellow-300"
                    : "border-[var(--border)]"
                } shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
              >
                {/* top accent line */}
                <div className={`h-1 ${chefs.length === 0 ? "bg-yellow-400" : "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"}`} />

                {/* card body */}
                <div className="p-5">
                  {/* icon + name + badges */}
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-3xl leading-none mt-0.5">{svcMeta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--text)] text-sm leading-tight mb-2">
                        {svcMeta.label}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-[var(--primary)]">
                          {count} projet{count !== 1 ? "s" : ""}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          chefs.length > 0
                            ? "bg-green-100 text-[var(--success)]"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {chefs.length} chef{chefs.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* progress bar */}
                  <div className="h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] transition-all duration-700"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  {/* actions row */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setAssignModal(svcMeta.value); setSelectedChef(""); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--primary-light)] transition-colors"
                    >
                      <FaUserPlus size={11} />
                      Assigner
                    </button>

                    {chefs.length > 0 && (
                      <button
                        onClick={() => setExpanded(isExpanded ? null : svcMeta.value)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-[var(--secondary-text)] text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors ml-auto"
                      >
                        {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                        {isExpanded ? "Masquer" : "Voir chefs"}
                      </button>
                    )}
                  </div>

                  {/* empty hint */}
                  {chefs.length === 0 && (
                    <p className="mt-3 text-xs text-yellow-700 italic">
                      Aucun chef assigné à ce service.
                    </p>
                  )}
                </div>

                {/* expanded chef list */}
                {isExpanded && chefs.length > 0 && (
                  <div className="border-t border-[var(--border)] bg-[var(--background)] px-5 py-3 space-y-2">
                    {chefs.map((chef) => (
                      <div
                        key={chef.id}
                        className="flex items-center gap-3 bg-white rounded-xl border border-[var(--border)] px-3 py-2"
                      >
                        {/* avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {chef.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[var(--text)] truncate">{chef.name}</p>
                          <p className="text-xs text-[var(--gris)] truncate">{chef.email}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(svcMeta.value, chef.id, chef.name)}
                          disabled={actionLoading}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-[var(--error)] hover:bg-red-100 transition-colors disabled:opacity-50 flex-shrink-0"
                          title="Retirer ce chef"
                        >
                          <FaUserMinus size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════ ASSIGN MODAL ══════════════ */}
      {assignModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setAssignModal(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-[var(--background)]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {SERVICES.find((s) => s.value === assignModal)?.icon}
                </span>
                <div>
                  <p className="text-xs text-[var(--gris)] font-medium uppercase tracking-wide">
                    Assignation chef
                  </p>
                  <h2 className="text-base font-bold text-[var(--text)]">
                    {SERVICES.find((s) => s.value === assignModal)?.label}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setAssignModal(null)}
                className="text-[var(--gris)] hover:text-[var(--text)] transition-colors p-1.5 rounded-lg hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6">
              {getAvailableChefs(assignModal).length === 0 ? (
                <div className="text-center py-6">
                  <FaHardHat className="mx-auto text-[var(--gris)] mb-3" size={32} />
                  <p className="text-sm text-[var(--gris)]">
                    Tous les chefs sont déjà assignés à ce service.
                  </p>
                </div>
              ) : (
                <>
                  <label className="block text-xs font-semibold text-[var(--gris)] uppercase tracking-wide mb-2">
                    Sélectionner un chef de projet
                  </label>

                  {/* Chef cards selector */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {getAvailableChefs(assignModal).map((chef) => (
                      <label
                        key={chef.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedChef === chef.id
                            ? "border-[var(--primary)] bg-blue-50"
                            : "border-[var(--border)] hover:border-gray-300 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="chef"
                          value={chef.id}
                          checked={selectedChef === chef.id}
                          onChange={() => setSelectedChef(chef.id)}
                          className="hidden"
                        />
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                          selectedChef === chef.id
                            ? "bg-[var(--primary)]"
                            : "bg-gradient-to-br from-gray-400 to-gray-500"
                        }`}>
                          {chef.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text)]">{chef.name}</p>
                          <p className="text-xs text-[var(--gris)] truncate">{chef.email}</p>
                        </div>
                        {selectedChef === chef.id && (
                          <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                            </svg>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 bg-[var(--background)] border-t flex justify-end gap-3">
              <button
                onClick={() => setAssignModal(null)}
                disabled={actionLoading}
                className="px-5 py-2.5 text-sm font-medium text-[var(--secondary-text)] bg-white border border-[var(--border)] rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                Annuler
              </button>
              {getAvailableChefs(assignModal).length > 0 && (
                <button
                  onClick={handleAssign}
                  disabled={!selectedChef || actionLoading}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[var(--primary)] rounded-lg hover:bg-[var(--primary-light)] transition-all shadow-sm disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Assignation…
                    </>
                  ) : (
                    <>
                      <FaUserPlus size={13} />
                      Confirmer
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ TOAST ══════════════ */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold border animate-[slideUp_0.3s_ease] ${
          toast.type === "success"
            ? "bg-green-50 text-[var(--success)] border-green-200"
            : "bg-red-50 text-[var(--error)] border-red-200"
        }`}>
          {toast.type === "success" ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </AdminLayout>
  );
}