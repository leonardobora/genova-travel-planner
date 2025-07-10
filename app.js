// =============================================================================
// PLANEJADOR DE VIAGEM - GENOVA 2025
// Functional Travel Planner with localStorage persistence
// =============================================================================

// --- DATA STRUCTURE DEFINITIONS ---
// All data is stored in localStorage with these structures:

/*
FLIGHTS DATA STRUCTURE:
{
  id: string (timestamp),
  origem: string,
  destino: string,
  data: string (YYYY-MM-DD),
  preco: number,
  companhia: string,
  created: timestamp
}

BUDGET DATA STRUCTURE:
{
  id: string (timestamp),
  categoria: string,
  valor: number,
  descricao: string,
  created: timestamp
}

ITINERARY DATA STRUCTURE:
{
  id: string (timestamp),
  data: string (YYYY-MM-DD),
  atividade: string,
  local: string,
  horario: string (HH:MM),
  notas: string,
  created: timestamp
}

CHECKLIST DATA STRUCTURE:
{
  id: string (timestamp),
  item: string,
  categoria: string,
  completed: boolean,
  created: timestamp
}

DOCUMENTS DATA STRUCTURE:
{
  id: string (timestamp),
  tipo: string,
  status: string ('pendente', 'em_andamento', 'concluido'),
  observacoes: string,
  created: timestamp
}
*/

// --- STORAGE KEYS ---
const STORAGE_KEYS = {
  FLIGHTS: 'genova_flights',
  BUDGET: 'genova_budget',
  ITINERARY: 'genova_itinerary',
  CHECKLIST: 'genova_checklist',
  DOCUMENTS: 'genova_documents'
};

// --- UTILITY FUNCTIONS ---
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Remove active class from all nav tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show target section
  const targetSection = document.getElementById(sectionName);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Add active class to corresponding nav tab
  const targetTab = document.querySelector(`[data-section="${sectionName}"]`);
  if (targetTab) {
    targetTab.classList.add('active');
  }
  
  // Update dashboard when switching sections
  updateDashboard();
  
  // Render lists for the current section
  switch(sectionName) {
    case 'voos':
      renderFlightsList();
      break;
    case 'orcamento':
      renderBudgetList();
      break;
    case 'roteiro':
      renderItineraryList();
      break;
    case 'checklist':
      renderChecklistList();
      break;
    case 'documentos':
      renderDocumentsList();
      break;
  }
}

// =============================================================================
// CRUD OPERATIONS FOR ALL SECTIONS
// =============================================================================

// --- FLIGHTS CRUD ---
function addFlight(flightData) {
  const flights = getFlights();
  const newFlight = {
    id: generateId(),
    origem: flightData.origem,
    destino: flightData.destino,
    data: flightData.data,
    preco: parseFloat(flightData.preco) || 0,
    companhia: flightData.companhia,
    created: Date.now()
  };
  flights.push(newFlight);
  localStorage.setItem(STORAGE_KEYS.FLIGHTS, JSON.stringify(flights));
  return newFlight;
}

function getFlights() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FLIGHTS)) || [];
  } catch (e) {
    return [];
  }
}

function updateFlight(id, flightData) {
  const flights = getFlights();
  const index = flights.findIndex(f => f.id === id);
  if (index !== -1) {
    flights[index] = { ...flights[index], ...flightData };
    localStorage.setItem(STORAGE_KEYS.FLIGHTS, JSON.stringify(flights));
    return flights[index];
  }
  return null;
}

function deleteFlight(id) {
  const flights = getFlights();
  const filtered = flights.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.FLIGHTS, JSON.stringify(filtered));
  return filtered;
}

function renderFlightsList() {
  const container = document.getElementById('flights-list');
  if (!container) return;
  
  const flights = getFlights();
  if (flights.length === 0) {
    container.innerHTML = '<p class="empty-state">Nenhum voo adicionado ainda.</p>';
    return;
  }
  
  container.innerHTML = flights.map(flight => `
    <div class="list-item" data-id="${flight.id}">
      <div class="item-content">
        <h4>${flight.origem} → ${flight.destino}</h4>
        <p><strong>Data:</strong> ${new Date(flight.data).toLocaleDateString('pt-BR')}</p>
        <p><strong>Companhia:</strong> ${flight.companhia}</p>
        <p><strong>Preço:</strong> R$ ${flight.preco.toFixed(2)}</p>
      </div>
      <div class="item-actions">
        <button class="btn btn--sm btn--secondary" onclick="editFlight('${flight.id}')">Editar</button>
        <button class="btn btn--sm btn--danger" onclick="deleteFlight('${flight.id}'); renderFlightsList(); updateDashboard()">Excluir</button>
      </div>
    </div>
  `).join('');
}

// --- BUDGET CRUD ---
function addBudgetItem(budgetData) {
  const budget = getBudget();
  const newItem = {
    id: generateId(),
    categoria: budgetData.categoria,
    valor: parseFloat(budgetData.valor) || 0,
    descricao: budgetData.descricao,
    created: Date.now()
  };
  budget.push(newItem);
  localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  return newItem;
}

function getBudget() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGET)) || [];
  } catch (e) {
    return [];
  }
}

function updateBudgetItem(id, budgetData) {
  const budget = getBudget();
  const index = budget.findIndex(b => b.id === id);
  if (index !== -1) {
    budget[index] = { ...budget[index], ...budgetData };
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
    return budget[index];
  }
  return null;
}

function deleteBudgetItem(id) {
  const budget = getBudget();
  const filtered = budget.filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(filtered));
  return filtered;
}

function renderBudgetList() {
  const container = document.getElementById('budget-list');
  if (!container) return;
  
  const budget = getBudget();
  if (budget.length === 0) {
    container.innerHTML = '<p class="empty-state">Nenhum gasto adicionado ainda.</p>';
    return;
  }
  
  container.innerHTML = budget.map(item => `
    <div class="list-item" data-id="${item.id}">
      <div class="item-content">
        <h4>${item.categoria}</h4>
        <p><strong>Valor:</strong> R$ ${item.valor.toFixed(2)}</p>
        <p><strong>Descrição:</strong> ${item.descricao}</p>
      </div>
      <div class="item-actions">
        <button class="btn btn--sm btn--secondary" onclick="editBudgetItem('${item.id}')">Editar</button>
        <button class="btn btn--sm btn--danger" onclick="deleteBudgetItem('${item.id}'); renderBudgetList(); updateDashboard()">Excluir</button>
      </div>
    </div>
  `).join('');
}

// --- ITINERARY CRUD ---
function addItineraryItem(itineraryData) {
  const itinerary = getItinerary();
  const newItem = {
    id: generateId(),
    data: itineraryData.data,
    atividade: itineraryData.atividade,
    local: itineraryData.local,
    horario: itineraryData.horario,
    notas: itineraryData.notas,
    created: Date.now()
  };
  itinerary.push(newItem);
  localStorage.setItem(STORAGE_KEYS.ITINERARY, JSON.stringify(itinerary));
  return newItem;
}

function getItinerary() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ITINERARY)) || [];
  } catch (e) {
    return [];
  }
}

function updateItineraryItem(id, itineraryData) {
  const itinerary = getItinerary();
  const index = itinerary.findIndex(i => i.id === id);
  if (index !== -1) {
    itinerary[index] = { ...itinerary[index], ...itineraryData };
    localStorage.setItem(STORAGE_KEYS.ITINERARY, JSON.stringify(itinerary));
    return itinerary[index];
  }
  return null;
}

function deleteItineraryItem(id) {
  const itinerary = getItinerary();
  const filtered = itinerary.filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEYS.ITINERARY, JSON.stringify(filtered));
  return filtered;
}

function renderItineraryList() {
  const container = document.getElementById('itinerary-list');
  if (!container) return;
  
  const itinerary = getItinerary().sort((a, b) => new Date(a.data) - new Date(b.data));
  if (itinerary.length === 0) {
    container.innerHTML = '<p class="empty-state">Nenhuma atividade adicionada ainda.</p>';
    return;
  }
  
  container.innerHTML = itinerary.map(item => `
    <div class="list-item" data-id="${item.id}">
      <div class="item-content">
        <h4>${item.atividade}</h4>
        <p><strong>Data:</strong> ${new Date(item.data).toLocaleDateString('pt-BR')}</p>
        <p><strong>Local:</strong> ${item.local}</p>
        <p><strong>Horário:</strong> ${item.horario}</p>
        ${item.notas ? `<p><strong>Notas:</strong> ${item.notas}</p>` : ''}
      </div>
      <div class="item-actions">
        <button class="btn btn--sm btn--secondary" onclick="editItineraryItem('${item.id}')">Editar</button>
        <button class="btn btn--sm btn--danger" onclick="deleteItineraryItem('${item.id}'); renderItineraryList(); updateDashboard()">Excluir</button>
      </div>
    </div>
  `).join('');
}

// --- CHECKLIST CRUD ---
function addChecklistItem(checklistData) {
  const checklist = getChecklist();
  const newItem = {
    id: generateId(),
    item: checklistData.item,
    categoria: checklistData.categoria,
    completed: false,
    created: Date.now()
  };
  checklist.push(newItem);
  localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
  return newItem;
}

function getChecklist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECKLIST)) || [];
  } catch (e) {
    return [];
  }
}

function updateChecklistItem(id, checklistData) {
  const checklist = getChecklist();
  const index = checklist.findIndex(c => c.id === id);
  if (index !== -1) {
    checklist[index] = { ...checklist[index], ...checklistData };
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
    return checklist[index];
  }
  return null;
}

function toggleChecklistItem(id) {
  const checklist = getChecklist();
  const index = checklist.findIndex(c => c.id === id);
  if (index !== -1) {
    checklist[index].completed = !checklist[index].completed;
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
    renderChecklistList();
    updateDashboard();
    return checklist[index];
  }
  return null;
}

function deleteChecklistItem(id) {
  const checklist = getChecklist();
  const filtered = checklist.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(filtered));
  return filtered;
}

function renderChecklistList() {
  const container = document.getElementById('checklist-list');
  if (!container) return;
  
  const checklist = getChecklist();
  if (checklist.length === 0) {
    container.innerHTML = '<p class="empty-state">Nenhum item adicionado ainda.</p>';
    return;
  }
  
  // Group by category
  const grouped = checklist.reduce((acc, item) => {
    if (!acc[item.categoria]) acc[item.categoria] = [];
    acc[item.categoria].push(item);
    return acc;
  }, {});
  
  let html = '';
  Object.keys(grouped).forEach(categoria => {
    html += `<div class="checklist-category">
      <h4>${categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h4>
      ${grouped[categoria].map(item => `
        <div class="checklist-item ${item.completed ? 'completed' : ''}" data-id="${item.id}">
          <label class="checkbox-label">
            <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="toggleChecklistItem('${item.id}')">
            <span class="checkmark"></span>
            <span class="item-text">${item.item}</span>
          </label>
          <div class="item-actions">
            <button class="btn btn--sm btn--secondary" onclick="editChecklistItem('${item.id}')">Editar</button>
            <button class="btn btn--sm btn--danger" onclick="deleteChecklistItem('${item.id}'); renderChecklistList(); updateDashboard()">Excluir</button>
          </div>
        </div>
      `).join('')}
    </div>`;
  });
  
  container.innerHTML = html;
}

// --- DOCUMENTS CRUD ---
function addDocument(documentData) {
  const documents = getDocuments();
  const newDoc = {
    id: generateId(),
    tipo: documentData.tipo,
    status: documentData.status || 'pendente',
    observacoes: documentData.observacoes,
    created: Date.now()
  };
  documents.push(newDoc);
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  return newDoc;
}

function getDocuments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) || [];
  } catch (e) {
    return [];
  }
}

function updateDocument(id, documentData) {
  const documents = getDocuments();
  const index = documents.findIndex(d => d.id === id);
  if (index !== -1) {
    documents[index] = { ...documents[index], ...documentData };
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    return documents[index];
  }
  return null;
}

function deleteDocument(id) {
  const documents = getDocuments();
  const filtered = documents.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filtered));
  return filtered;
}

function renderDocumentsList() {
  const container = document.getElementById('documents-list');
  if (!container) return;
  
  const documents = getDocuments();
  if (documents.length === 0) {
    container.innerHTML = '<p class="empty-state">Nenhum documento adicionado ainda.</p>';
    return;
  }
  
  container.innerHTML = documents.map(doc => `
    <div class="list-item" data-id="${doc.id}">
      <div class="item-content">
        <h4>${doc.tipo}</h4>
        <p><strong>Status:</strong> <span class="status-badge status-${doc.status}">${doc.status.replace('_', ' ')}</span></p>
        ${doc.observacoes ? `<p><strong>Observações:</strong> ${doc.observacoes}</p>` : ''}
      </div>
      <div class="item-actions">
        <button class="btn btn--sm btn--secondary" onclick="editDocument('${doc.id}')">Editar</button>
      </div>
    </div>
  `).join('');
}

// =============================================================================
// DASHBOARD UPDATES
// =============================================================================

function updateDashboard() {
  // Update total budget
  const budget = getBudget();
  const totalBudget = budget.reduce((sum, item) => sum + item.valor, 0);
  const budgetElement = document.getElementById('total-budget');
  if (budgetElement) {
    budgetElement.textContent = `R$ ${totalBudget.toFixed(2)}`;
  }
  
  // Update checklist progress
  const checklist = getChecklist();
  const completedItems = checklist.filter(item => item.completed).length;
  const totalItems = checklist.length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const progressElement = document.getElementById('checklist-progress');
  if (progressElement) {
    progressElement.textContent = `${progress}%`;
  }
  
  // Update documents status
  const documents = getDocuments();
  const completedDocs = documents.filter(doc => doc.status === 'concluido').length;
  const docsElement = document.getElementById('documents-status');
  if (docsElement) {
    docsElement.textContent = `${completedDocs}/${documents.length}`;
  }
  
  // Update itinerary count
  const itinerary = getItinerary();
  const itineraryElement = document.getElementById('itinerary-count');
  if (itineraryElement) {
    itineraryElement.textContent = itinerary.length;
  }
  
  // Update next tasks
  updateNextTasks();
}

function updateNextTasks() {
  const nextTasksElement = document.getElementById('next-tasks');
  if (!nextTasksElement) return;
  
  const tasks = [];
  
  // Add pending checklist items
  const checklist = getChecklist();
  const pendingChecklist = checklist.filter(item => !item.completed).slice(0, 3);
  pendingChecklist.forEach(item => {
    tasks.push(`✅ ${item.item}`);
  });
  
  // Add upcoming itinerary items
  const itinerary = getItinerary();
  const today = new Date();
  const upcomingActivities = itinerary
    .filter(item => new Date(item.data) >= today)
    .sort((a, b) => new Date(a.data) - new Date(b.data))
    .slice(0, 2);
  
  upcomingActivities.forEach(item => {
    tasks.push(`🗓️ ${item.atividade} (${new Date(item.data).toLocaleDateString('pt-BR')})`);
  });
  
  // Add pending documents
  const documents = getDocuments();
  const pendingDocs = documents.filter(doc => doc.status === 'pendente').slice(0, 2);
  pendingDocs.forEach(doc => {
    tasks.push(`📄 ${doc.tipo}`);
  });
  
  if (tasks.length === 0) {
    nextTasksElement.innerHTML = '<p>Todas as tarefas estão em dia! 🎉</p>';
  } else {
    nextTasksElement.innerHTML = tasks.map(task => `<div class="task-item">${task}</div>`).join('');
  }
}

// =============================================================================
// FORM HANDLERS AND MODAL MANAGEMENT
// =============================================================================

function setupFormHandlers() {
  // Flight form handler
  const flightForm = document.getElementById('flight-form');
  if (flightForm) {
    flightForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const flightData = {
        origem: document.getElementById('flight-origin').value,
        destino: document.getElementById('flight-destination').value,
        data: document.getElementById('flight-date').value,
        preco: document.getElementById('flight-price').value,
        companhia: document.getElementById('flight-airline').value
      };
      
      addFlight(flightData);
      renderFlightsList();
      updateDashboard();
      closeModal('flight-modal');
      showNotification('Voo adicionado com sucesso!', 'success');
      e.target.reset();
    });
  }
  
  // Budget form handler
  const budgetForm = document.getElementById('budget-form');
  if (budgetForm) {
    budgetForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const budgetData = {
        categoria: document.getElementById('budget-category').value,
        valor: document.getElementById('budget-amount').value,
        descricao: document.getElementById('budget-description').value
      };
      
      addBudgetItem(budgetData);
      renderBudgetList();
      updateDashboard();
      closeModal('budget-modal');
      showNotification('Gasto adicionado com sucesso!', 'success');
      e.target.reset();
    });
  }
  
  // Itinerary form handler
  const itineraryForm = document.getElementById('itinerary-form');
  if (itineraryForm) {
    itineraryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const itineraryData = {
        data: document.getElementById('itinerary-date').value,
        atividade: document.getElementById('itinerary-activity').value,
        local: document.getElementById('itinerary-location').value,
        horario: document.getElementById('itinerary-time').value,
        notas: document.getElementById('itinerary-notes').value
      };
      
      addItineraryItem(itineraryData);
      renderItineraryList();
      updateDashboard();
      closeModal('itinerary-modal');
      showNotification('Atividade adicionada com sucesso!', 'success');
      e.target.reset();
    });
  }
  
  // Checklist form handler
  const checklistForm = document.getElementById('checklist-form');
  if (checklistForm) {
    checklistForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const checklistData = {
        item: document.getElementById('checklist-item').value,
        categoria: document.getElementById('checklist-category').value
      };
      
      addChecklistItem(checklistData);
      renderChecklistList();
      updateDashboard();
      closeModal('checklist-modal');
      showNotification('Item adicionado com sucesso!', 'success');
      e.target.reset();
    });
  }
  
  // Document form handler
  const documentForm = document.getElementById('document-form');
  if (documentForm) {
    documentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const documentData = {
        tipo: document.getElementById('document-type').value,
        status: document.getElementById('document-status').value,
        observacoes: document.getElementById('document-notes').value
      };
      
      addDocument(documentData);
      renderDocumentsList();
      updateDashboard();
      closeModal('document-modal');
      showNotification('Documento adicionado com sucesso!', 'success');
      e.target.reset();
    });
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
  // Setup form handlers
  setupFormHandlers();
  
  // Setup modal close handlers
  document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });
  
  // Initial dashboard update
  updateDashboard();
  
  // Initialize countdown (days until December 2025)
  updateCountdown();
});

function updateCountdown() {
  const tripDate = new Date('2025-12-01');
  const today = new Date();
  const diffTime = tripDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const countdownElement = document.getElementById('countdown-days');
  if (countdownElement) {
    countdownElement.textContent = diffDays > 0 ? diffDays : 0;
  }
}

// =============================================================================
// EXPORT/IMPORT FUNCTIONALITY
// =============================================================================

function exportData() {
  const data = {
    flights: getFlights(),
    budget: getBudget(),
    itinerary: getItinerary(),
    checklist: getChecklist(),
    documents: getDocuments(),
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `genova-trip-planner-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showNotification('Dados exportados com sucesso!', 'success');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      
      // Validate data structure
      if (!data.version || !data.flights || !data.budget || !data.itinerary || !data.checklist || !data.documents) {
        throw new Error('Formato de arquivo inválido');
      }
      
      // Import data
      localStorage.setItem(STORAGE_KEYS.FLIGHTS, JSON.stringify(data.flights));
      localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(data.budget));
      localStorage.setItem(STORAGE_KEYS.ITINERARY, JSON.stringify(data.itinerary));
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(data.checklist));
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(data.documents));
      
      // Refresh all sections
      renderFlightsList();
      renderBudgetList();
      renderItineraryList();
      renderChecklistList();
      renderDocumentsList();
      updateDashboard();
      
      showNotification('Dados importados com sucesso!', 'success');
    } catch (error) {
      showNotification('Erro ao importar dados: ' + error.message, 'error');
    }
  };
  reader.readAsText(file);
  
  // Reset file input
  event.target.value = '';
}

function printItinerary() {
  const itinerary = getItinerary().sort((a, b) => new Date(a.data) - new Date(b.data));
  
  if (itinerary.length === 0) {
    showNotification('Nenhuma atividade para imprimir', 'warning');
    return;
  }
  
  const printWindow = window.open('', '_blank');
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Roteiro - Genova 2025</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        .activity { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .date { font-weight: bold; color: #e74c3c; }
        .location { color: #27ae60; }
        .time { color: #8e44ad; }
        .notes { font-style: italic; color: #7f8c8d; margin-top: 10px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <h1>🇮🇹 Roteiro - Genova 2025</h1>
      ${itinerary.map(item => `
        <div class="activity">
          <div class="date">📅 ${new Date(item.data).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <h3>${item.atividade}</h3>
          ${item.local ? `<div class="location">📍 ${item.local}</div>` : ''}
          ${item.horario ? `<div class="time">🕐 ${item.horario}</div>` : ''}
          ${item.notas ? `<div class="notes">📝 ${item.notas}</div>` : ''}
        </div>
      `).join('')}
      <div style="margin-top: 30px; text-align: center; color: #7f8c8d;">
        <small>Gerado em ${new Date().toLocaleDateString('pt-BR')} pelo Planejador de Viagem - Genova</small>
      </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

// --- Navigation Fix Patch (added robust event delegation & scroll) ---
(function() {
  // Wait until DOMContentLoaded already fired (script is loaded at bottom), still safe
  const navContainer = document.querySelector('.nav-tabs');
  if (navContainer) {
    navContainer.addEventListener('click', function(e) {
      const btn = e.target.closest('.nav-tab');
      if (!btn) return;
      const sectionName = btn.dataset.section;
      if (sectionName) {
        showSection(sectionName);
      }
    });
  }

  // Ensure nav-tab elements are not of type submit (prevents unexpected form submission)
  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (!tab.getAttribute('type')) {
      tab.setAttribute('type', 'button');
    }
  });

  // Enhance showSection to auto-scroll to top
  const originalShowSection = window.showSection;
  window.showSection = function(sectionName) {
    originalShowSection(sectionName);
    // After section is shown, smooth scroll to it for visibility
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
      const headerOffset = document.querySelector('.app-nav').offsetHeight + 16; // nav height + margin
      const sectionTop = targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: sectionTop, behavior: 'smooth' });
    }
  };
})();