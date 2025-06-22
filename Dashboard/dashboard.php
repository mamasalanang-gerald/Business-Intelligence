<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ClassicModels Dashboard</title>
    <link rel="stylesheet" href="dashboard.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <header>
        <h1>ClassicModels Dashboard</h1>
        <div id="customization-panel">
            <label><input type="checkbox" checked data-widget="customers"> Customers</label>
            <label><input type="checkbox" checked data-widget="orders"> Orders</label>
            <label><input type="checkbox" checked data-widget="orderdetails"> Order Details</label>
            <label><input type="checkbox" checked data-widget="payments"> Payments</label>
            <label><input type="checkbox" checked data-widget="productlines"> Product Lines</label>
            <label><input type="checkbox" checked data-widget="products"> Products</label>
        </div>
    </header>
    <main id="dashboard-main">
        <div class="dashboard-grid">
            <section id="widget-customers" class="dashboard-widget">
                <h2>Customers</h2>
                <div class="widget-content">
                    <div class="stat" id="customers-count"></div>
                    <canvas id="customers-chart"></canvas>
                </div>
            </section>
            <section id="widget-orders" class="dashboard-widget">
                <h2>Orders</h2>
                <div class="widget-content">
                    <div class="stat" id="orders-count"></div>
                    <canvas id="orders-chart"></canvas>
                </div>
            </section>
            <section id="widget-orderdetails" class="dashboard-widget">
                <h2>Order Details</h2>
                <div class="widget-content">
                    <div class="stat" id="orderdetails-count"></div>
                    <canvas id="orderdetails-chart"></canvas>
                </div>
            </section>
            <section id="widget-payments" class="dashboard-widget">
                <h2>Payments</h2>
                <div class="widget-content">
                    <div class="stat" id="payments-count"></div>
                    <div class="stat" id="payments-total"></div>
                    <canvas id="payments-chart"></canvas>
                </div>
            </section>
            <section id="widget-productlines" class="dashboard-widget">
                <h2>Product Lines</h2>
                <div class="widget-content">
                    <div class="stat" id="productlines-count"></div>
                    <canvas id="productlines-chart"></canvas>
                </div>
            </section>
            <section id="widget-products" class="dashboard-widget">
                <h2>Products</h2>
                <div class="widget-content">
                    <div class="stat" id="products-count"></div>
                    <canvas id="products-chart"></canvas>
                </div>
            </section>
        </div>
    </main>
    <script src="dashboard.js"></script>
</body>
</html> 