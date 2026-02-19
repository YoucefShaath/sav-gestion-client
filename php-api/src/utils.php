<?php
// Utilities & constants ported from src/lib/utils.js (minimal subset needed)

const TRANSITIONS = [
    'Received' => ['Diagnostic'],
    'Diagnostic' => ['In Progress','Received','Completed'],
    'In Progress' => ['Completed','Diagnostic'],
    'Completed' => ['Delivered','In Progress'],
    'Delivered' => [],
];

$STATUS_LABELS = [
    'Received' => 'Reçu',
    'Diagnostic' => 'Diagnostic',
    'In Progress' => 'En cours',
    'Completed' => 'Terminé',
    'Delivered' => 'Livré',
];

function formatDate($dateStr) {
    if (!$dateStr) return '—';
    $d = new DateTime($dateStr);
    return $d->format('d/m/Y H:i');
}

function validatePhone($phone) {
    $clean = preg_replace('/[\s\-\.]/', '', $phone);
    return preg_match('/^(\+?\d{10,15})$/', $clean);
}
