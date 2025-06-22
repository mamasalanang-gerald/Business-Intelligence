<?php
header('Content-Type: application/json');
require_once 'db_connect.php';

function getCount($pdo, $table) {
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM `$table`");
    return $stmt->fetch()['count'];
}

function getSum($pdo, $table, $column) {
    $stmt = $pdo->query("SELECT SUM($column) as total FROM `$table`");
    return $stmt->fetch()['total'];
}

function getRandomRow($pdo, $table, $column) {
    $stmt = $pdo->query("SELECT $column FROM `$table` ORDER BY RAND() LIMIT 1");
    return $stmt->fetch()[$column];
}

function getTopCustomer($pdo) {
    $stmt = $pdo->query("SELECT customerName, creditLimit FROM customers ORDER BY creditLimit DESC LIMIT 1");
    return $stmt->fetch();
}

function getTopEmployee($pdo) {
    $stmt = $pdo->query("SELECT firstName, lastName, jobTitle FROM employees ORDER BY jobTitle DESC LIMIT 1");
    return $stmt->fetch();
}

function getOfficeLocations($pdo) {
    $stmt = $pdo->query("SELECT city, country FROM offices");
    return $stmt->fetchAll();
}

function getTopProduct($pdo) {
    $stmt = $pdo->query("SELECT productName, quantityInStock FROM products ORDER BY quantityInStock DESC LIMIT 1");
    return $stmt->fetch();
}

function getCustomersByCountry($pdo) {
    $stmt = $pdo->query("SELECT country, COUNT(*) as count FROM customers GROUP BY country ORDER BY count DESC");
    $labels = [];
    $counts = [];
    foreach ($stmt as $row) {
        $labels[] = $row['country'];
        $counts[] = (int)$row['count'];
    }
    return ['labels' => $labels, 'counts' => $counts];
}

function getEmployeesByTitle($pdo) {
    $stmt = $pdo->query("SELECT jobTitle, COUNT(*) as count FROM employees GROUP BY jobTitle ORDER BY count DESC");
    $labels = [];
    $counts = [];
    foreach ($stmt as $row) {
        $labels[] = $row['jobTitle'];
        $counts[] = (int)$row['count'];
    }
    return ['labels' => $labels, 'counts' => $counts];
}

function getOfficesByCountry($pdo) {
    $stmt = $pdo->query("SELECT country, COUNT(*) as count FROM offices GROUP BY country ORDER BY count DESC");
    $labels = [];
    $counts = [];
    foreach ($stmt as $row) {
        $labels[] = $row['country'];
        $counts[] = (int)$row['count'];
    }
    return ['labels' => $labels, 'counts' => $counts];
}

function getOrdersByMonth($pdo) {
    $stmt = $pdo->query("SELECT DATE_FORMAT(orderDate, '%Y-%m') as month, COUNT(*) as count FROM orders GROUP BY month ORDER BY month ASC");
    $labels = [];
    $counts = [];
    foreach ($stmt as $row) {
        $labels[] = $row['month'];
        $counts[] = (int)$row['count'];
    }
    return ['labels' => $labels, 'counts' => $counts];
}

function getOrderDetailsTopProducts($pdo) {
    $stmt = $pdo->query("SELECT productCode, SUM(quantityOrdered) as total FROM orderdetails GROUP BY productCode ORDER BY total DESC LIMIT 5");
    $labels = [];
    $counts = [];
    foreach ($stmt as $row) {
        $labels[] = $row['productCode'];
        $counts[] = (int)$row['total'];
    }
    return ['labels' => $labels, 'counts' => $counts];
}

function getPaymentsByMonth($pdo) {
    $stmt = $pdo->query("SELECT DATE_FORMAT(paymentDate, '%Y-%m') as month, SUM(amount) as total FROM payments GROUP BY month ORDER BY month ASC");
    $labels = [];
    $counts = [];
    foreach ($stmt as $row) {
        $labels[] = $row['month'];
        $counts[] = (float)$row['total'];
    }
    return ['labels' => $labels, 'counts' => $counts];
}

function getProductLines($pdo) {
    $stmt = $pdo->query("SELECT productLine, COUNT(*) as count FROM products GROUP BY productLine ORDER BY count DESC");
    $labels = [];
    $counts = [];
    foreach ($stmt as $row) {
        $labels[] = $row['productLine'];
        $counts[] = (int)$row['count'];
    }
    return ['labels' => $labels, 'counts' => $counts];
}

function getProductsByLine($pdo) {
    return getProductLines($pdo);
}

try {
    $data = [];
    $shuffle = isset($_GET['shuffle']) ? $_GET['shuffle'] : null;
    // Customers
    $data['customers'] = [
        'count' => getCount($pdo, 'customers'),
        'funFact' => 'Random customer: ' . getRandomRow($pdo, 'customers', 'customerName'),
        'topCustomer' => getTopCustomer($pdo),
        'byCountry' => getCustomersByCountry($pdo)
    ];
    // Employees
    $data['employees'] = [
        'count' => getCount($pdo, 'employees'),
        'funFact' => 'Random employee: ' . getRandomRow($pdo, 'employees', 'firstName'),
        'topEmployee' => getTopEmployee($pdo),
        'byTitle' => getEmployeesByTitle($pdo)
    ];
    // Offices
    $data['offices'] = [
        'count' => getCount($pdo, 'offices'),
        'funFact' => 'Random office: ' . getRandomRow($pdo, 'offices', 'city'),
        'locations' => getOfficeLocations($pdo),
        'byCountry' => getOfficesByCountry($pdo)
    ];
    // Orderdetails
    $data['orderdetails'] = [
        'count' => getCount($pdo, 'orderdetails'),
        'funFact' => 'Random order: ' . getRandomRow($pdo, 'orderdetails', 'orderNumber'),
        'totalOrdered' => getSum($pdo, 'orderdetails', 'quantityOrdered'),
        'topProducts' => getOrderDetailsTopProducts($pdo)
    ];
    // Orders
    $data['orders'] = [
        'count' => getCount($pdo, 'orders'),
        'funFact' => 'Random order: ' . getRandomRow($pdo, 'orders', 'orderNumber'),
        'totalSales' => getCount($pdo, 'orders'),
        'byMonth' => getOrdersByMonth($pdo)
    ];
    // Payments
    $data['payments'] = [
        'count' => getCount($pdo, 'payments'),
        'funFact' => 'Random check: ' . getRandomRow($pdo, 'payments', 'checkNumber'),
        'totalAmount' => getSum($pdo, 'payments', 'amount'),
        'byMonth' => getPaymentsByMonth($pdo)
    ];
    // Productlines
    $data['productlines'] = [
        'count' => getCount($pdo, 'productlines'),
        'funFact' => 'Random line: ' . getRandomRow($pdo, 'productlines', 'productLine'),
        'labels' => getProductLines($pdo)['labels'],
        'counts' => getProductLines($pdo)['counts']
    ];
    // Products
    $data['products'] = [
        'count' => getCount($pdo, 'products'),
        'funFact' => 'Top product: ' . getTopProduct($pdo)['productName'],
        'topProduct' => getTopProduct($pdo),
        'byLine' => getProductsByLine($pdo)
    ];
    if ($shuffle && isset($data[$shuffle])) {
        echo json_encode(['success' => true, 'data' => [$shuffle => $data[$shuffle]]]);
        exit;
    }
    echo json_encode(['success' => true, 'data' => $data]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} 