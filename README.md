# ClassicModels Business Intelligence Dashboard

## Overview

This dashboard is a Business Intelligence (BI) tool for the ClassicModels database. It provides a clear, interactive, and visually appealing summary of key business data, helping users and stakeholders quickly understand the company's operations and performance.

The dashboard fetches live data from the MySQL database and updates in real time when you click the **Refresh All Data** button. It is designed for clarity, ease of use, and effective business communication.

---

## Main Features

- **Live Data:** All widgets and charts display the latest data from the database.
- **Customizable View:** You can show/hide widgets using the checkboxes below the stat cards.
- **Dark/Light Mode:** Toggle for better viewing comfort.
- **Modern UI:** Responsive, clean, and easy to present.

---

## Widget & Content Guide

### 1. Stat Cards (Top Row)
- **Customers, Employees, Offices, Orders, Payments, Products**
- **Purpose:** Show the total count or sum for each key business entity.
- **Data Source:** Each card queries the respective table (e.g., `customers`, `employees`, etc.).
- **Use:** Gives a quick, at-a-glance summary of the business scale and activity.

### 2. Customization Panel (Checkboxes)
- **Purpose:** Lets you show or hide any widget on the dashboard for a focused presentation.
- **Use:** Useful for tailoring the dashboard to different audiences or topics.

### 3. Main Widgets

#### Customers Overview
- **Top customer by credit limit:** Shows the customer with the highest credit limit (from `customers`).
- **Top 5 Customers Chart:** Bar chart of the top 5 customers by credit limit.
- **Use:** Identifies the most valuable customers for the business.

#### Employees Overview
- **Most common job title:** Shows the most frequent job title among employees (from `employees`).
- **Top Employee:** Highlights a key employee (e.g., VP Sales).
- **Chart:** Shows the total number of employees.
- **Use:** Understands workforce structure and key personnel.

#### Offices Overview
- **Country with most offices:** Shows which country has the most office locations (from `offices`).
- **Locations:** Lists all office locations (city and country).
- **Chart:** Horizontal bar chart of offices per country.
- **Use:** Visualizes company's geographic presence and expansion.

#### Orders Overview
- **Fun Fact:** Shows a random order number for engagement.
- **Chart:** Line chart of orders over time (by month).
- **Use:** Tracks sales activity and seasonality.

#### Order Details Overview
- **Fun Fact:** Shows a random order number.
- **Total Ordered:** Sums all products ordered.
- **Chart:** Bar chart of top products by quantity ordered.
- **Use:** Identifies best-selling products.

#### Payments Overview
- **Largest payment received:** Shows the biggest payment and the customer who made it (from `payments`).
- **Total Payments:** Shows the sum of all payments (₱).
- **Chart:** Line chart of payments over time (by month).
- **Use:** Tracks cash flow and major transactions.

#### Product Lines Distribution
- **Random line:** Shows a random product line for engagement.
- **Chart:** Doughnut chart of product distribution by line (from `productlines` and `products`).
- **Legend:** Always visible, so users know what each color means.
- **Use:** Visualizes product diversity and focus areas.

#### Products Overview
- **Top Product:** Shows the product with the highest stock (from `products`).
- **Chart:** Bar chart of products by product line.
- **Use:** Identifies inventory leaders and product line strengths.

#### Recent Orders
- **Table:** Shows the 5 most recent orders, including order number, customer, date, and status.
- **Use:** Quickly see the latest business activity and customer engagement.

---

## How Data is Used
- **All data is fetched live from the MySQL database using PHP (dashboard_api.php).**
- **Each widget and chart is mapped to a specific SQL query, ensuring accuracy and up-to-date information.**
- **The dashboard is designed to be self-explanatory, but this guide helps presenters explain each part with confidence.**

---

## How to Use
1. Open the dashboard in your browser.
2. Click **Refresh All Data** to load the latest data from the database.
3. Use the checkboxes to show/hide widgets as needed.
4. Use the dark/light mode toggle for your preferred viewing style.
5. Hover over charts for tooltips, or use the always-visible legends for context.

---

## Code Structure & Explanation

### 1. **dashboard_api.php (Backend API)**
- **Purpose:** Acts as the bridge between the MySQL database and the dashboard frontend.
- **How it works:**
  - Receives requests from the dashboard (via AJAX/fetch in JS).
  - Runs SQL queries to fetch counts, sums, top records, and recent data from each table.
  - Returns all results as a single JSON object, structured for easy use by the frontend.
- **Key Functions:**
  - `getCount($pdo, $table)`: Returns the total number of records in a table.
  - `getTop5Customers($pdo)`: Returns the top 5 customers by credit limit.
  - `getRecentOrders($pdo)`: Returns the 5 most recent orders with customer info.
  - `getLargestPayment($pdo)`: Returns the largest payment and the customer who made it.
  - ...and more for each widget.
- **Why:** This keeps all business logic and data processing in one place, making the dashboard fast and secure.

### 2. **dashboard.js (Frontend Logic)**
- **Purpose:** Handles all dynamic behavior and data visualization in the dashboard.
- **How it works:**
  - On page load or when you click **Refresh All Data**, it fetches the latest data from `dashboard_api.php`.
  - Updates all stat cards, widgets, and charts with the new data.
  - Uses Chart.js to render interactive charts (bar, line, doughnut, etc.).
  - Handles UI features like dark/light mode, widget collapsing, and customization panel.
- **Key Functions:**
  - `fetchDataAndUpdate()`: Fetches data from the API and updates the dashboard.
  - `updateDashboard(data)`: Updates all widgets and charts with new data.
  - `renderChart(...)`: Renders a chart in a widget using Chart.js.
  - Event listeners for refresh, theme toggle, and widget customization.
- **Why:** Separates data logic from presentation, making the dashboard easy to maintain and extend.

### 3. **dashboard.html (Frontend Structure)**
- **Purpose:** Provides the structure and layout for the dashboard.
- **How it works:**
  - Contains all the containers for stat cards, widgets, and controls.
  - Loads the CSS for styling and JS for interactivity.
- **Why:** Clean HTML structure makes it easy to understand and modify the dashboard layout.

### 4. **dashboard.css (Styling)**
- **Purpose:** Makes the dashboard visually appealing and responsive.
- **How it works:**
  - Styles the stat cards, widgets, charts, and all UI elements.
  - Supports both light and dark mode.
- **Why:** Good styling ensures the dashboard is easy to read and present.



