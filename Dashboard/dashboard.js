const API_URL = 'dashboard_api.php';
let charts = {};
let lastData = null;

function formatCompactNumber(num) {
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return '$' + (num / 1e3).toFixed(2) + 'K';
    return '$' + Number(num).toLocaleString();
}

function fetchDataAndUpdate() {
    fetch(API_URL)
        .then(res => res.json())
        .then(res => {
            if (!res.success) throw new Error(res.error);
            lastData = res.data;
            updateDashboard(res.data);
        })
        .catch(err => {
            console.error('Error fetching dashboard data:', err);
        });
}

function updateDashboard(data) {
    // Stat cards
    document.getElementById('customers-count').textContent = data.customers.count;
    document.getElementById('employees-count').textContent = data.employees.count;
    document.getElementById('offices-count').textContent = data.offices.count;
    document.getElementById('orders-count').textContent = data.orders.count;
    document.getElementById('payments-total').textContent = formatCompactNumber(data.payments.totalAmount);
    document.getElementById('products-count').textContent = data.products.count;

    // Customers widget
    document.getElementById('customers-funfact').textContent = '🎉 ' + data.customers.funFact;
    document.getElementById('customers-top').textContent = `🏆 Top Customer: ${data.customers.topCustomer.customerName} ($${Number(data.customers.topCustomer.creditLimit).toLocaleString()})`;
    renderChart('customers-chart', 'Customers', 'pie', [data.customers.count], ['Total']);

    // Employees widget
    document.getElementById('employees-funfact').textContent = '🧑‍💼 ' + data.employees.funFact;
    document.getElementById('employees-top').textContent = `🏆 Top Employee: ${data.employees.topEmployee.firstName} ${data.employees.topEmployee.lastName} (${data.employees.topEmployee.jobTitle})`;
    renderChart('employees-chart', 'Employees', 'bar', [data.employees.count], ['Total']);

    // Offices widget
    document.getElementById('offices-funfact').textContent = '🏢 ' + data.offices.funFact;
    document.getElementById('offices-locations').textContent = '🌍 Locations: ' + data.offices.locations.map(loc => `${loc.city} (${loc.country})`).join(', ');
    renderChart('offices-chart', 'Offices', 'pie', [data.offices.count], ['Total']);

    // Orders widget
    document.getElementById('orders-funfact').textContent = '🛒 ' + data.orders.funFact;
    renderChart('orders-chart', 'Orders', 'line', [12, 19, 3, 5, 2, 3], ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);

    // Order Details widget
    document.getElementById('orderdetails-funfact').textContent = '📦 ' + data.orderdetails.funFact + ` | Total Ordered: ${data.orderdetails.totalOrdered}`;
    renderChart('orderdetails-chart', 'Order Details', 'bar', [5, 9, 7, 4, 6], ['Prod A', 'Prod B', 'Prod C', 'Prod D', 'Prod E']);

    // Payments widget
    document.getElementById('payments-funfact').textContent = '💸 ' + data.payments.funFact;
    renderChart('payments-chart', 'Payments', 'line', [1200, 1900, 3000, 500, 2000, 3000], ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']);

    // Product Lines widget
    document.getElementById('productlines-funfact').textContent = '🗂️ ' + data.productlines.funFact;
    renderChart('productlines-chart', 'Product Lines', 'doughnut', [3, 5, 2], ['Classic', 'Vintage', 'Motorcycles']);

    // Products widget
    document.getElementById('products-funfact').textContent = '🚗 ' + data.products.funFact;
    document.getElementById('products-top').textContent = `🏆 Top Product: ${data.products.topProduct.productName} (Stock: ${data.products.topProduct.quantityInStock})`;
    renderChart('products-chart', 'Products', 'bar', [10, 15, 8], ['Classic', 'Vintage', 'Motorcycles']);

    // Recent Orders Table (placeholder)
    populateRecentOrdersTable();
}

function renderChart(canvasId, label, type, data, labels) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    if (charts[canvasId]) charts[canvasId].destroy();
    // Detect dark mode
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#fff' : '#222';
    // Set canvas background
    canvas.style.background = isDark ? '#232b3b' : '#fff';
    charts[canvasId] = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: [
                    '#1abc9c', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#2d3e50'
                ],
                borderColor: '#3498db',
                fill: type === 'line' || type === 'bar',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: type !== 'bar',
                    labels: { color: textColor }
                },
                tooltip: {
                    bodyColor: textColor,
                    titleColor: textColor,
                    backgroundColor: isDark ? '#232b3b' : '#fff',
                    borderColor: isDark ? '#fff' : '#222',
                    borderWidth: 1
                }
            },
            scales: (type === 'bar' || type === 'line') ? {
                y: {
                    beginAtZero: true,
                    ticks: { color: textColor },
                    grid: { color: isDark ? '#444' : '#e0e0e0' }
                },
                x: {
                    ticks: { color: textColor },
                    grid: { color: isDark ? '#444' : '#e0e0e0' }
                }
            } : {}
        }
    });
}

// Collapse/Expand Widgets
const collapseBtns = document.querySelectorAll('.collapse-btn');
collapseBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const widget = btn.closest('.widget');
        widget.classList.toggle('collapsed');
    });
});

// Customization: show/hide widgets
const customizationPanel = document.querySelector('.customization-panel');
customizationPanel.addEventListener('change', (e) => {
    if (e.target.dataset.widget) {
        const widget = document.getElementById('widget-' + e.target.dataset.widget);
        widget.style.display = e.target.checked ? '' : 'none';
    }
});

// Populate Recent Orders Table (placeholder data)
function populateRecentOrdersTable() {
    const tbody = document.querySelector('#recent-orders-table tbody');
    tbody.innerHTML = '';
    const orders = [
        { order: 10100, customer: 'John Doe', date: '2023-06-01', status: 'Shipped' },
        { order: 10101, customer: 'Jane Smith', date: '2023-06-02', status: 'Processing' },
        { order: 10102, customer: 'Acme Corp', date: '2023-06-03', status: 'Cancelled' },
        { order: 10103, customer: 'Foo Bar', date: '2023-06-04', status: 'Shipped' },
        { order: 10104, customer: 'Widget Inc', date: '2023-06-05', status: 'On Hold' }
    ];
    orders.forEach(o => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${o.order}</td><td>${o.customer}</td><td>${o.date}</td><td>${o.status}</td>`;
        tbody.appendChild(tr);
    });
}

// Stat Card to Widget Scroll & Highlight
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach(card => {
    card.addEventListener('click', function() {
        const widgetName = card.getAttribute('data-widget');
        const widget = document.querySelector('.widget[data-widget="' + widgetName + '"]');
        if (widget) {
            widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
            widget.classList.add('active');
            card.classList.add('active');
            setTimeout(() => {
                widget.classList.remove('active');
                card.classList.remove('active');
            }, 1200);
        }
    });
    card.addEventListener('mouseenter', function() {
        const widgetName = card.getAttribute('data-widget');
        const widget = document.querySelector('.widget[data-widget="' + widgetName + '"]');
        if (widget) widget.classList.add('active');
    });
    card.addEventListener('mouseleave', function() {
        const widgetName = card.getAttribute('data-widget');
        const widget = document.querySelector('.widget[data-widget="' + widgetName + '"]');
        if (widget) widget.classList.remove('active');
    });
});

// Global refresh button
document.getElementById('refresh-all').addEventListener('click', function() {
    fetchDataAndUpdate();
});

// Add this function to re-render all charts on theme change
function updateAllChartsTheme() {
    Object.keys(charts).forEach(id => {
        // Get the chart's current data and type
        const chart = charts[id];
        const type = chart.config.type;
        const data = chart.data;
        const options = chart.options;
        // Destroy and re-render with the same data
        chart.destroy();
        renderChart(id, data.datasets[0].label, type, data.datasets[0].data, data.labels);
    });
}

// In the theme toggle script (at the end of the file):
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = function() {
    document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    updateAllChartsTheme();
}; 