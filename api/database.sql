-- SAV Management System Database Schema
-- Run this SQL on your MySQL server to create the database

CREATE DATABASE IF NOT EXISTS sav_gestion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sav_gestion;

-- Main tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(20) NOT NULL UNIQUE,
    client_name VARCHAR(100) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_email VARCHAR(150) DEFAULT NULL,
    hardware_category ENUM('Laptop', 'Desktop', 'Smartphone', 'Tablet', 'Printer', 'Monitor', 'Other') NOT NULL,
    brand VARCHAR(50) DEFAULT NULL,
    model VARCHAR(100) DEFAULT NULL,
    serial_number VARCHAR(100) DEFAULT NULL,
    problem_description TEXT NOT NULL,
    diagnostic_notes TEXT DEFAULT NULL,
    technician_notes TEXT DEFAULT NULL,
    status ENUM('Received', 'Diagnostic', 'In Progress', 'Completed', 'Delivered') NOT NULL DEFAULT 'Received',
    location VARCHAR(100) DEFAULT 'Reception',
    estimated_cost DECIMAL(10,2) DEFAULT NULL,
    final_cost DECIMAL(10,2) DEFAULT NULL,
    priority ENUM('Low', 'Normal', 'High', 'Urgent') NOT NULL DEFAULT 'Normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_status (status),
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_client_phone (client_phone),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- Archives table (same structure as tickets)
CREATE TABLE IF NOT EXISTS archives (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(20) NOT NULL UNIQUE,
    client_name VARCHAR(100) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_email VARCHAR(150) DEFAULT NULL,
    hardware_category ENUM('Laptop', 'Desktop', 'Smartphone', 'Tablet', 'Printer', 'Monitor', 'Other') NOT NULL,
    brand VARCHAR(50) DEFAULT NULL,
    model VARCHAR(100) DEFAULT NULL,
    serial_number VARCHAR(100) DEFAULT NULL,
    problem_description TEXT NOT NULL,
    diagnostic_notes TEXT DEFAULT NULL,
    technician_notes TEXT DEFAULT NULL,
    status ENUM('Received', 'Diagnostic', 'In Progress', 'Completed', 'Delivered') NOT NULL DEFAULT 'Delivered',
    location VARCHAR(100) DEFAULT NULL,
    estimated_cost DECIMAL(10,2) DEFAULT NULL,
    final_cost DECIMAL(10,2) DEFAULT NULL,
    priority ENUM('Low', 'Normal', 'High', 'Urgent') NOT NULL DEFAULT 'Normal',
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    delivered_at TIMESTAMP NULL DEFAULT NULL,
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_client_phone (client_phone),
    INDEX idx_archived_at (archived_at)
) ENGINE=InnoDB;

-- Status history for audit trail
CREATE TABLE IF NOT EXISTS status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(20) NOT NULL,
    old_status VARCHAR(20) DEFAULT NULL,
    new_status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT DEFAULT NULL,
    INDEX idx_ticket_id (ticket_id)
) ENGINE=InnoDB;
