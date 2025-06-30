const API_URL = 'dashboard_api.php';
let charts = {};
let lastData = null;

function formatCompactNumber(num) {
    if (num >= 1e9) return '₱' + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return '₱' + (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return '₱' + (num / 1e3).toFixed(2) + 'K';
    return '₱' + Number(num).toLocaleString();
}

function fetchDataAndUpdate() {
    fetch(API_URL)
        .then((res) => res.json())
        .then((res) => {
            if (!res.success) throw new Error(res.error);
            lastData = res.data;
            updateDashboard(res.data);
        })
        .catch((err) => {
            console.error('Error fetching dashboard data:', err);
        });
}

function updateDashboard(data) {
    // Stat cards
    document.getElementById('customers-count').textContent =
        data.customers.count;
    document.getElementById('employees-count').textContent =
        data.employees.count;
    document.getElementById('offices-count').textContent = data.offices.count;
    document.getElementById('orders-count').textContent = data.orders.count;
    document.getElementById('payments-total').textContent = formatCompactNumber(
        data.payments.totalAmount
    );
    document.getElementById('products-count').textContent = data.products.count;

    // Customers widget
    document.getElementById(
        'customers-funfact'
    ).innerHTML = `<div class="overview-container"><i class="fas fa-users overview-icon"></i><span class="overview-text">${data.customers.funFact}</span></div>`;
    document.getElementById(
        'customers-top'
    ).innerHTML = `<div class="overview-container"><i class="fas fa-crown overview-icon"></i><span class="overview-text">Top Customer: ${
        data.customers.topCustomer.customerName
    } (₱${Number(
        data.customers.topCustomer.creditLimit
    ).toLocaleString()})</span></div>`;
    // Bar chart for top 5 customers by credit limit
    const topCustomers = data.customers.top5Customers || [
        { customerName: 'Customer A', creditLimit: 1000000 },
        { customerName: 'Customer B', creditLimit: 800000 },
        { customerName: 'Customer C', creditLimit: 600000 },
        { customerName: 'Customer D', creditLimit: 400000 },
        { customerName: 'Customer E', creditLimit: 200000 },
    ];
    renderChart(
        'customers-chart',
        'Top 5 Customers',
        'bar',
        topCustomers.map((c) => c.creditLimit),
        topCustomers.map((c) => c.customerName)
    );

    // Employees widget
    document.getElementById(
        'employees-funfact'
    ).innerHTML = `<div class="overview-container"><i class="fas fa-user-tie overview-icon"></i><span class="overview-text">${data.employees.funFact}</span></div>`;
    document.getElementById(
        'employees-top'
    ).innerHTML = `<div class="overview-container"><i class="fas fa-trophy overview-icon"></i><span class="overview-text">Top Employee: ${data.employees.topEmployee.firstName} ${data.employees.topEmployee.lastName} (${data.employees.topEmployee.jobTitle})</span></div>`;
    renderChart(
        'employees-chart',
        'Employees',
        'bar',
        [data.employees.count],
        ['Total']
    );

    // Offices widget
    document.getElementById(
        'offices-funfact'
    ).innerHTML = `<div class="overview-container"><i class="fas fa-building overview-icon"></i><span class="overview-text">${data.offices.funFact}</span></div>`;
    document.getElementById(
        'offices-locations'
    ).innerHTML = `<div class="overview-container"><i class="fas fa-map-marker-alt overview-icon"></i><span class="overview-text">Locations: ${data.offices.locations
        .map((loc) => `${loc.city} (${loc.country})`)
        .join(', ')}</span></div>`;
    // Horizontal bar chart for offices per country
    const officeCountries = data.offices.locations
        ? data.offices.locations.reduce((acc, loc) => {
              acc[loc.country] = (acc[loc.country] || 0) + 1;
              return acc;
          }, {})
        : { USA: 3, Germany: 2, Japan: 1 };
    renderChart(
        'offices-chart',
        'Offices by Country',
        'bar',
        Object.values(officeCountries),
        Object.keys(officeCountries),
        true
    );

    // Orders widget
    document.getElementById(
        'orders-funfact'
    ).innerHTML = `<div class="overview-container"><i class="fas fa-shopping-cart overview-icon"></i><span class="overview-text">${data.orders.funFact}</span></div>`;
    renderChart(
        'orders-chart',
        'Orders',
        'line',
        [12, 19, 3, 5, 2, 3],
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    );

    // Order Details widget
    document.getElementById(
        'orderdetails-funfact'
    ).innerHTML = `<div class="overview-container"><i class="fas fa-box overview-icon"></i><span class="overview-text">${data.orderdetails.funFact} | Total Ordered: ${data.orderdetails.totalOrdered}</span></div>`;
    renderChart(
        'orderdetails-chart',
        'Order Details',
        'bar',
        [5, 9, 7, 4, 6],
        ['Prod A', 'Prod B', 'Prod C', 'Prod D', 'Prod E']
    );

    // Payments widget
    document.getElementById(
        'payments-funfact'
    ).innerHTML = `<div class="overview-container"><i class="fas fa-money-bill-wave overview-icon"></i><span class="overview-text">${data.payments.funFact}</span></div>`;
    renderChart(
        'payments-chart',
        'Payments',
        'line',
        [1200, 1900, 3000, 500, 2000, 3000],
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    );

    // Product Lines widget
    document.getElementById(
        'productlines-funfact'
    ).innerHTML = `<div class="overview-container"><i class="fas fa-layer-group overview-icon"></i><span class="overview-text">${data.productlines.funFact}</span></div>`;
    renderChart(
        'productlines-chart',
        'Product Lines',
        'doughnut',
        [3, 5, 2],
        ['Classic', 'Vintage', 'Motorcycles']
    );

    // Products widget
    document.getElementById(
        'products-funfact'
    ).innerHTML = `<div class="overview-container"><i class="fas fa-box overview-icon"></i><span class="overview-text">${data.products.funFact}</span></div>`;
    document.getElementById(
        'products-top'
    ).innerHTML = `<div class="overview-container"><i class="fas fa-crown overview-icon"></i><span class="overview-text">Top Product: ${data.products.topProduct.productName} (Stock: ${data.products.topProduct.quantityInStock})</span></div>`;
    renderChart(
        'products-chart',
        'Products',
        'bar',
        [10, 15, 8],
        ['Classic', 'Vintage', 'Motorcycles']
    );

    // Recent Orders Table (placeholder)
    populateRecentOrdersTable();
}

function renderChart(
    canvasId,
    label,
    type,
    data,
    labels,
    horizontalBar = false
) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    if (charts[canvasId]) charts[canvasId].destroy();
    // Detect dark mode
    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#fff' : '#222';
    // Set canvas background
    canvas.style.background = isDark ? '#232b3b' : '#fff';

    let chartType = type;
    let options = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: type === 'pie' || type === 'doughnut' ? 1.5 : undefined,
        plugins: {
            legend: {
                display:
                    type !== 'pie' && type !== 'doughnut' && type !== 'bar',
                labels: { color: textColor },
            },
            tooltip: {
                bodyColor: textColor,
                titleColor: textColor,
                backgroundColor: isDark ? '#232b3b' : '#fff',
                borderColor: isDark ? '#fff' : '#222',
                borderWidth: 1,
            },
        },
        scales:
            type === 'bar' || type === 'line'
                ? {
                      y: {
                          beginAtZero: true,
                          ticks: { color: textColor },
                          grid: { color: isDark ? '#444' : '#e0e0e0' },
                      },
                      x: {
                          ticks: { color: textColor },
                          grid: { color: isDark ? '#444' : '#e0e0e0' },
                      },
                  }
                : {},
    };
    if (horizontalBar) {
        options.indexAxis = 'y';
    }
    if (canvasId === 'productlines-chart') {
        options.plugins.legend.display = true;
        options.plugins.legend.position = 'bottom';
        options.onClick = (e) => {
            const activePoints = charts[canvasId].getElementsAtEventForMode(
                e,
                'nearest',
                { intersect: true },
                true
            );
            if (activePoints.length > 0) {
                const clickedIndex = activePoints[0].index;
                const clickedLabel = charts[canvasId].data.labels[clickedIndex];
                alert(`You clicked on: ${clickedLabel}`);
            }
        };
    }
    charts[canvasId] = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: data,
                    backgroundColor: [
                        '#1abc9c',
                        '#3498db',
                        '#9b59b6',
                        '#f1c40f',
                        '#e67e22',
                        '#e74c3c',
                        '#2d3e50',
                    ],
                    borderColor: '#3498db',
                    fill: type === 'line' || type === 'bar',
                    tension: 0.4,
                },
            ],
        },
        options: options,
    });
}

// Collapse/Expand Widgets
const collapseBtns = document.querySelectorAll('.collapse-btn');
collapseBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
        const widget = btn.closest('.widget');
        widget.classList.toggle('collapsed');
    });
});

// Customization: show/hide widgets
const customizationPanel = document.querySelector('.customization-panel');
customizationPanel.addEventListener('change', (e) => {
    if (e.target.dataset.widget) {
        const widget = document.getElementById(
            'widget-' + e.target.dataset.widget
        );
        widget.style.display = e.target.checked ? '' : 'none';
    }
});

// Populate Recent Orders Table (placeholder data)
function populateRecentOrdersTable() {
    const tbody = document.querySelector('#recent-orders-table tbody');
    tbody.innerHTML = '';
    const orders = [
        {
            order: 10100,
            customer: 'John Doe',
            date: '2023-06-01',
            status: 'Shipped',
        },
        {
            order: 10101,
            customer: 'Jane Smith',
            date: '2023-06-02',
            status: 'Processing',
        },
        {
            order: 10102,
            customer: 'Acme Corp',
            date: '2023-06-03',
            status: 'Cancelled',
        },
        {
            order: 10103,
            customer: 'Foo Bar',
            date: '2023-06-04',
            status: 'Shipped',
        },
        {
            order: 10104,
            customer: 'Widget Inc',
            date: '2023-06-05',
            status: 'On Hold',
        },
    ];
    orders.forEach((o) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${o.order}</td><td>${o.customer}</td><td>${o.date}</td><td>${o.status}</td>`;
        tbody.appendChild(tr);
    });
}

// Stat Card to Widget Scroll & Highlight
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach((card) => {
    card.addEventListener('click', function () {
        const widgetName = card.getAttribute('data-widget');
        const widget = document.querySelector(
            '.widget[data-widget="' + widgetName + '"]'
        );
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
    card.addEventListener('mouseenter', function () {
        const widgetName = card.getAttribute('data-widget');
        const widget = document.querySelector(
            '.widget[data-widget="' + widgetName + '"]'
        );
        if (widget) widget.classList.add('active');
    });
    card.addEventListener('mouseleave', function () {
        const widgetName = card.getAttribute('data-widget');
        const widget = document.querySelector(
            '.widget[data-widget="' + widgetName + '"]'
        );
        if (widget) widget.classList.remove('active');
    });
});

// Global refresh button
document.getElementById('refresh-all').addEventListener('click', function () {
    fetchDataAndUpdate();
});

// Add this function to re-render all charts on theme change
function updateAllChartsTheme() {
    Object.keys(charts).forEach((id) => {
        // Get the chart's current data and type
        const chart = charts[id];
        const type = chart.config.type;
        const data = chart.data;
        const options = chart.options;
        // Destroy and re-render with the same data
        chart.destroy();
        renderChart(
            id,
            data.datasets[0].label,
            type,
            data.datasets[0].data,
            data.labels
        );
    });
}

// In the theme toggle script (at the end of the file):
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = function () {
    document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = document.body.classList.contains('dark-mode')
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    updateAllChartsTheme();
};
