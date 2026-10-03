/**
 * SOC Investigation Platform - Frontend Prototype Logic
 * Connects to index.html and style.css
 */

// 1. MOCK DATA ARCHITECTURE (To be replaced by real API later)
const mockData = {
    kpis: {
        activeAlerts: 24,
        criticalAlerts: 4,
        investigations: 8,
        pendingReview: 6,
        agentsActive: "4/5"
    },
    alerts: [
        { id: "ALT-2026-001", severity: "Critical", type: "Suspicious PowerShell Activity", source: "EDR", asset: "FIN-WS-042", status: "Investigating", score: 92, time: "2 min ago" },
        { id: "ALT-2026-002", severity: "High", type: "Multiple Failed Logins", source: "Identity", asset: "DC-01", status: "Pending Review", score: 85, time: "15 min ago" },
        { id: "ALT-2026-003", severity: "Medium", type: "Unusual Outbound Traffic", source: "Firewall", asset: "MKT-WS-11", status: "New", score: 65, time: "1 hr ago" },
        { id: "ALT-2026-004", severity: "Low", type: "Outdated Definition", source: "AV", asset: "HR-WS-05", status: "Resolved", score: 20, time: "3 hrs ago" }
    ],
    agents: [
        { name: "Threat Intelligence Agent", status: "Complete", finding: "Destination IP enrichment completed. Malicious reputation found.", confidence: "91%" },
        { name: "Endpoint Agent", status: "Complete", finding: "Suspicious PowerShell execution detected (encoded payload).", confidence: "94%" },
        { name: "Identity Agent", status: "Complete", finding: "User authentication activity correlated to impossible travel.", confidence: "78%" },
        { name: "Network Context Agent", status: "Complete", finding: "Outbound connection correlated to known C2 server.", confidence: "86%" },
        { name: "Correlation / Risk Agent", status: "Complete", finding: "Evidence indicates elevated risk across 4 vectors.", confidence: "89%" }
    ],
    activity: [
        "Threat Intelligence Agent completed enrichment (10:42)",
        "Risk Engine updated score from 78 → 92 (10:41)",
        "Endpoint Agent retrieved process telemetry (10:39)"
    ]
};

// 2. STATE MANAGEMENT
const app = {
    state: {
        currentPage: 'view-dashboard',
        selectedAlertId: null
    },

    // Initialization
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderDashboard();
    },

    cacheDOM() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.pageViews = document.querySelectorAll('.page-view');
        this.dashboardTableBody = document.querySelector('#dashboard-alerts-table tbody');
        this.alertsPageTableBody = document.querySelector('#alerts-page-table tbody');
    },

    bindEvents() {
        // Sidebar Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetView = e.currentTarget.getAttribute('data-target');
                this.navigate(targetView);
            });
        });
    },

    // 3. NAVIGATION LOGIC
    navigate(targetId) {
        // Update active nav class
        this.navItems.forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-target="${targetId}"]`)?.classList.add('active');

        // Update view visibility
        this.pageViews.forEach(view => view.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
        
        this.state.currentPage = targetId;

        // Route specific renders
        if(targetId === 'view-dashboard') this.renderDashboard();
        if(targetId === 'view-alerts') this.renderAlertsPage();
    },

    // 4. DATA RENDERING FUNCTIONS
    renderDashboard() {
        // Render KPIs
        const kpiContainer = document.getElementById('dashboard-kpis');
        if(kpiContainer) {
            kpiContainer.innerHTML = `
                <div class="kpi-card"><div class="kpi-title">Active Alerts</div><div class="kpi-value">${mockData.kpis.activeAlerts}</div></div>
                <div class="kpi-card"><div class="kpi-title">Critical Alerts</div><div class="kpi-value text-critical">${mockData.kpis.criticalAlerts}</div></div>
                <div class="kpi-card"><div class="kpi-title">Investigations</div><div class="kpi-value">${mockData.kpis.investigations}</div></div>
                <div class="kpi-card"><div class="kpi-title">Pending Review</div><div class="kpi-value text-medium">${mockData.kpis.pendingReview}</div></div>
            `;
        }

        // Render Activity
        const activityContainer = document.getElementById('dashboard-activity');
        if(activityContainer) {
            activityContainer.innerHTML = mockData.activity.map(act => `<p style="margin-bottom:8px; font-size:13px; color:var(--text-secondary);"><span class="material-symbols-outlined" style="font-size:14px; vertical-align:middle; margin-right:6px;">history</span>${act}</p>`).join('');
        }

        this.renderTable(this.dashboardTableBody, mockData.alerts);
    },

    renderAlertsPage() {
        this.renderTable(this.alertsPageTableBody, mockData.alerts, true);
    },

    renderTable(tbody, alerts, includeTime = false) {
        if (!tbody) return;
        tbody.innerHTML = '';
        
        alerts.forEach(alert => {
            const row = document.createElement('tr');
            const badgeClass = `badge-${alert.severity.toLowerCase()}`;
            
            let timeCell = includeTime ? `<td>${alert.time}</td>` : '';

            row.innerHTML = `
                <td style="font-weight:600; color:var(--accent-primary);">${alert.id}</td>
                <td><span class="badge ${badgeClass}">${alert.severity}</span></td>
                <td>${alert.type}</td>
                <td>${alert.source}</td>
                <td>${alert.asset}</td>
                ${timeCell}
                <td>${alert.status}</td>
                <td><strong>${alert.score}</strong></td>
            `;
            
            // Interaction: Clicking a row opens the investigation
            row.addEventListener('click', () => {
                this.openInvestigation(alert);
            });
            
            tbody.appendChild(row);
        });
    },

    openInvestigation(alertData) {
        this.state.selectedAlertId = alertData.id;
        
        // Populate Investigation Header
        document.getElementById('inv-alert-id').textContent = alertData.id;
        document.getElementById('inv-severity').className = `badge badge-${alertData.severity.toLowerCase()}`;
        document.getElementById('inv-severity').textContent = alertData.severity.toUpperCase();
        
        // Populate Agent Cards
        const agentsContainer = document.getElementById('inv-agents');
        agentsContainer.innerHTML = mockData.agents.map(agent => `
            <div class="agent-card">
                <div class="agent-card-header">
                    <span class="agent-name">${agent.name}</span>
                    <span class="badge" style="background:var(--success); color:#fff;">${agent.status}</span>
                </div>
                <p class="agent-finding">${agent.finding}</p>
                <div style="margin-top:8px; font-size:11px; color:var(--text-muted);">Confidence: ${agent.confidence}</div>
            </div>
        `).join('');

        // Populate Timeline mock
        const timelineContainer = document.getElementById('inv-timeline');
        timelineContainer.innerHTML = mockData.activity.map(act => `
            <div style="padding-left:12px; border-left:2px solid var(--border-color); margin-bottom:12px; font-size:12px;">
                ${act}
            </div>
        `).join('');

        this.navigate('view-investigation');
    },

    // Human In The Loop Governance Actions
    handleHitlDecision(actionType) {
        const message = `Governance Audit Log:\nAnalyst selected: ${actionType}\n\nNote: In a production environment, this action is signed and appended to the SOC audit trail.`;
        alert(message);
    }
};

// Start application when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
