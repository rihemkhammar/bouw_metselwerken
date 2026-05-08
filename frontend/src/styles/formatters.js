

export const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
};

export const getProgress = (project) => {
  if (project.status === 'COMPLETED') return 100;
  if (project.status === 'PLANNED') return 0;
  
  if (project.updates?.length > 0) {
    const lastUpdate = project.updates[project.updates.length - 1];
    return lastUpdate.progress || 0;
  }
  return project.status === 'IN_PROGRESS' ? 40 : 0;
};

export const getStatusConfig = (status) => {
  const configs = {
    PLANNED: { 
      bg: 'var(--standard-off-white)', 
      text: 'var(--primary)', 
      border: 'var(--primary-light)',
      label: 'Planifié' 
    },
    IN_PROGRESS: { 
      bg: '#FFF8E1', 
      text: 'var(--secondary)', 
      border: 'var(--secondary-light)',
      label: 'En cours' 
    },
    COMPLETED: { 
      bg: '#E8F5E9', 
      text: 'var(--success)', 
      border: '#81C784',
      label: 'Terminé' 
    },
    ON_HOLD: { 
      bg: '#F5F5F5', 
      text: 'var(--gris)', 
      border: 'var(--border)',
      label: 'En pause' 
    },
    CANCELLED: { 
      bg: '#FFEBEE', 
      text: 'var(--error)', 
      border: '#EF9A9A',
      label: 'Annulé' 
    },
  };
  return configs[status] || configs.PLANNED;
};

export const getServiceLabel = (service) => {
  const labels = {
    CONSTRUCTION_GENERALE: 'Construction',
    RENOVATION: 'Rénovation',
    TRAITEMENT_HYDROFUGE: 'Traitement humidité',
  };
  return labels[service] || service.replace(/_/g, ' ');
};