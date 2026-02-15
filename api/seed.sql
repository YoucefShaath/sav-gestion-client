-- Sample data for SAV Gestion - Testing
USE sav_gestion;

-- ── Active Tickets ──────────────────────────────────────────

INSERT INTO tickets (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, diagnostic_notes, technician_notes, status, location, estimated_cost, final_cost, priority, created_at, updated_at) VALUES

-- Received (new arrivals)
('SAV-260210-0001', 'Mohamed Benali', '0555123456', 'mohamed.b@gmail.com', 'Laptop', 'HP', 'Pavilion 15', 'HP2024X991', 'L''écran ne s''allume plus après une chute. Le voyant d''alimentation clignote.', NULL, NULL, 'Received', 'Reception', NULL, NULL, 'High', '2026-02-10 09:15:00', '2026-02-10 09:15:00'),

('SAV-260211-0001', 'Fatima Zohra Kaci', '0661987654', NULL, 'Smartphone', 'Samsung', 'Galaxy S24', 'SM-S921B-44X', 'Écran fissuré + tactile ne répond plus sur la partie droite.', NULL, NULL, 'Received', 'Reception', NULL, NULL, 'Normal', '2026-02-11 10:30:00', '2026-02-11 10:30:00'),

('SAV-260212-0001', 'Yacine Djerrab', '0770456789', 'yacine.dj@outlook.com', 'Printer', 'Canon', 'PIXMA G3420', NULL, 'L''imprimante fait des traces noires sur toutes les pages. Nettoyage des têtes déjà essayé.', NULL, NULL, 'Received', 'Reception', NULL, NULL, 'Low', '2026-02-12 08:00:00', '2026-02-12 08:00:00'),

-- Diagnostic
('SAV-260208-0001', 'Karim Boudjema', '0550334455', NULL, 'Desktop', 'Dell', 'OptiPlex 7090', 'DL-OP7090-X12', 'PC redémarre tout seul de manière aléatoire. Bip au démarrage parfois.', 'RAM défectueuse détectée (slot B). Test avec nouvelle barrette OK. Carte mère semble fonctionnelle.', NULL, 'Diagnostic', 'Atelier - Poste 2', 3500.00, NULL, 'Normal', '2026-02-08 14:20:00', '2026-02-10 11:00:00'),

('SAV-260209-0001', 'Amina Saidi', '0662778899', 'amina.saidi@gmail.com', 'Laptop', 'Lenovo', 'ThinkPad T14', 'LN-T14-8K2', 'Clavier ne fonctionne plus après renversement de café. Certaines touches collent.', 'Clavier HS, nappe endommagée. Remplacement complet nécessaire.', NULL, 'Diagnostic', 'Atelier - Poste 1', 8000.00, NULL, 'High', '2026-02-09 11:45:00', '2026-02-11 09:30:00'),

-- In Progress
('SAV-260205-0001', 'Rachid Hamidou', '0555667788', NULL, 'Laptop', 'ASUS', 'VivoBook 15', 'AS-VB15-3R9', 'Ventilateur fait un bruit anormal et le PC surchauffe. S''éteint après 20 minutes.', 'Ventilateur bloqué par poussière. Pâte thermique sèche. Remplacement ventilateur + pâte thermique.', 'Ventilateur commandé, arrivée prévue demain.', 'In Progress', 'Atelier - Poste 3', 4500.00, NULL, 'Urgent', '2026-02-05 16:00:00', '2026-02-10 14:00:00'),

('SAV-260206-0001', 'Nadia Belkacem', '0771234567', 'nadia.bk@yahoo.fr', 'Tablet', 'Apple', 'iPad Air M2', 'IPAD-AIR-M2-7X', 'Batterie se décharge en 2h. Achetée il y a 8 mois seulement.', 'Batterie dégradée à 71%. Remplacement sous garantie possible.', 'En attente de la pièce Apple - commande #AP-2026-881', 'In Progress', 'Atelier - Poste 1', 0.00, NULL, 'Normal', '2026-02-06 09:30:00', '2026-02-09 16:00:00'),

('SAV-260207-0001', 'Sofiane Medjdoub', '0660112233', NULL, 'Desktop', 'Custom', 'PC Gamer Custom', NULL, 'Carte graphique artefacts visuels en jeu. Lignes colorées sur l''écran.', 'GPU RTX 3060 défaillant confirmé. Le client souhaite un remplacement par RTX 4060.', 'Installation RTX 4060 en cours. Mise à jour pilotes nécessaire.', 'In Progress', 'Atelier - Poste 2', 45000.00, NULL, 'Normal', '2026-02-07 13:15:00', '2026-02-11 10:00:00'),

-- Completed (ready for pickup)
('SAV-260201-0001', 'Hassina Merabet', '0553445566', 'hassina.m@gmail.com', 'Monitor', 'LG', 'UltraWide 34WP65C', 'LG-34WP-K89', 'Pixels morts au centre de l''écran. Tache sombre visible sur fond blanc.', 'Dalle LCD défectueuse. Remplacement effectué.', 'Dalle remplacée, calibration couleurs effectuée. 48h de test sans problème.', 'Completed', 'Étagère A - Prêt', 12000.00, 11500.00, 'Normal', '2026-02-01 10:00:00', '2026-02-08 15:30:00'),

('SAV-260203-0001', 'Omar Ait Kaci', '0770889900', NULL, 'Smartphone', 'Xiaomi', 'Redmi Note 13 Pro', 'XM-RN13P-44Z', 'Connecteur de charge ne fonctionne plus. Charge uniquement sans fil.', 'Port USB-C oxydé. Nettoyage + remplacement du connecteur.', 'Connecteur remplacé. Test charge rapide 33W OK.', 'Completed', 'Étagère B - Prêt', 2500.00, 2000.00, 'Normal', '2026-02-03 14:30:00', '2026-02-07 11:00:00'),

-- Delivered
('SAV-260125-0001', 'Djamila Ferhat', '0661223344', 'djamila.f@hotmail.com', 'Laptop', 'Acer', 'Aspire 5', 'AC-A5-2K1', 'Windows ne démarre plus. Écran bleu au boot.', 'SSD corrompu. Données partiellement récupérées. Nouveau SSD installé + Windows réinstallé.', 'Client prévenu. Données récupérées sur clé USB.', 'Delivered', 'Livré', 6000.00, 5500.00, 'High', '2026-01-25 11:00:00', '2026-02-02 09:00:00'),

('SAV-260128-0001', 'Bilal Mansouri', '0555998877', NULL, 'Printer', 'Epson', 'EcoTank L3250', 'EP-L3250-9M2', 'Bourrage papier constant + message erreur E-01.', 'Rouleau d''entraînement usé. Capteur papier encrassé.', 'Rouleau remplacé + nettoyage capteur. 50 pages test OK.', 'Delivered', 'Livré', 3000.00, 2800.00, 'Low', '2026-01-28 15:45:00', '2026-02-04 14:00:00');

-- Update delivered_at for delivered tickets
UPDATE tickets SET delivered_at = '2026-02-03 10:30:00' WHERE ticket_id = 'SAV-260125-0001';
UPDATE tickets SET delivered_at = '2026-02-05 16:00:00' WHERE ticket_id = 'SAV-260128-0001';

-- ── Status History (audit trail) ────────────────────────────

INSERT INTO status_history (ticket_id, old_status, new_status, changed_at, notes) VALUES

-- SAV-260210-0001 (Received)
('SAV-260210-0001', NULL, 'Received', '2026-02-10 09:15:00', 'Ticket créé'),

-- SAV-260211-0001 (Received)
('SAV-260211-0001', NULL, 'Received', '2026-02-11 10:30:00', 'Ticket créé'),

-- SAV-260212-0001 (Received)
('SAV-260212-0001', NULL, 'Received', '2026-02-12 08:00:00', 'Ticket créé'),

-- SAV-260208-0001 (Diagnostic)
('SAV-260208-0001', NULL, 'Received', '2026-02-08 14:20:00', 'Ticket créé'),
('SAV-260208-0001', 'Received', 'Diagnostic', '2026-02-10 11:00:00', 'Début diagnostic - RAM suspecte'),

-- SAV-260209-0001 (Diagnostic)
('SAV-260209-0001', NULL, 'Received', '2026-02-09 11:45:00', 'Ticket créé'),
('SAV-260209-0001', 'Received', 'Diagnostic', '2026-02-11 09:30:00', 'Ouverture du PC pour inspection clavier'),

-- SAV-260205-0001 (In Progress)
('SAV-260205-0001', NULL, 'Received', '2026-02-05 16:00:00', 'Ticket créé'),
('SAV-260205-0001', 'Received', 'Diagnostic', '2026-02-06 10:00:00', 'Vérification système de refroidissement'),
('SAV-260205-0001', 'Diagnostic', 'In Progress', '2026-02-07 14:00:00', 'Pièce commandée - ventilateur de remplacement'),

-- SAV-260206-0001 (In Progress)
('SAV-260206-0001', NULL, 'Received', '2026-02-06 09:30:00', 'Ticket créé'),
('SAV-260206-0001', 'Received', 'Diagnostic', '2026-02-07 11:00:00', 'Test batterie en cours'),
('SAV-260206-0001', 'Diagnostic', 'In Progress', '2026-02-09 16:00:00', 'Commande pièce Apple envoyée'),

-- SAV-260207-0001 (In Progress)
('SAV-260207-0001', NULL, 'Received', '2026-02-07 13:15:00', 'Ticket créé'),
('SAV-260207-0001', 'Received', 'Diagnostic', '2026-02-08 09:00:00', 'Test GPU sous charge'),
('SAV-260207-0001', 'Diagnostic', 'In Progress', '2026-02-10 10:00:00', 'Client a validé le devis RTX 4060'),

-- SAV-260201-0001 (Completed)
('SAV-260201-0001', NULL, 'Received', '2026-02-01 10:00:00', 'Ticket créé'),
('SAV-260201-0001', 'Received', 'Diagnostic', '2026-02-02 09:00:00', 'Inspection dalle LCD'),
('SAV-260201-0001', 'Diagnostic', 'In Progress', '2026-02-03 14:00:00', 'Dalle commandée chez fournisseur'),
('SAV-260201-0001', 'In Progress', 'Completed', '2026-02-08 15:30:00', 'Réparation terminée - prêt pour retrait'),

-- SAV-260203-0001 (Completed)
('SAV-260203-0001', NULL, 'Received', '2026-02-03 14:30:00', 'Ticket créé'),
('SAV-260203-0001', 'Received', 'Diagnostic', '2026-02-04 10:00:00', 'Inspection port USB-C'),
('SAV-260203-0001', 'Diagnostic', 'In Progress', '2026-02-05 11:00:00', 'Nettoyage + soudure connecteur'),
('SAV-260203-0001', 'In Progress', 'Completed', '2026-02-07 11:00:00', 'Réparation terminée - test charge OK'),

-- SAV-260125-0001 (Delivered)
('SAV-260125-0001', NULL, 'Received', '2026-01-25 11:00:00', 'Ticket créé'),
('SAV-260125-0001', 'Received', 'Diagnostic', '2026-01-26 09:00:00', 'Test SSD et récupération données'),
('SAV-260125-0001', 'Diagnostic', 'In Progress', '2026-01-28 14:00:00', 'Nouveau SSD installé, réinstallation Windows'),
('SAV-260125-0001', 'In Progress', 'Completed', '2026-02-02 09:00:00', 'Tout est prêt - données récupérées sur USB'),
('SAV-260125-0001', 'Completed', 'Delivered', '2026-02-03 10:30:00', 'Client a récupéré le PC'),

-- SAV-260128-0001 (Delivered)
('SAV-260128-0001', NULL, 'Received', '2026-01-28 15:45:00', 'Ticket créé'),
('SAV-260128-0001', 'Received', 'Diagnostic', '2026-01-29 10:00:00', 'Démontage et inspection mécanique'),
('SAV-260128-0001', 'Diagnostic', 'In Progress', '2026-01-30 11:00:00', 'Rouleau commandé'),
('SAV-260128-0001', 'In Progress', 'Completed', '2026-02-04 14:00:00', 'Réparation terminée - tests impression OK'),
('SAV-260128-0001', 'Completed', 'Delivered', '2026-02-05 16:00:00', 'Imprimante récupérée par le client');

-- ── Archived Tickets (old ones) ─────────────────────────────

INSERT INTO archives (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, diagnostic_notes, technician_notes, status, location, estimated_cost, final_cost, priority, created_at, updated_at, delivered_at, archived_at) VALUES

('SAV-260110-0001', 'Ali Benzema', '0550112233', 'ali.benz@gmail.com', 'Laptop', 'Dell', 'Inspiron 15', 'DL-I15-7X3', 'Charnière cassée côté droit. Le capot ne tient plus.', 'Charnière + support interne cassés. Remplacement des deux côtés recommandé.', 'Charnières remplacées. Mouvement fluide vérifié.', 'Delivered', 'Livré', 5000.00, 4500.00, 'Normal', '2026-01-10 09:00:00', '2026-01-18 14:00:00', '2026-01-20 10:00:00', '2026-01-25 09:00:00'),

('SAV-260112-0001', 'Samira Ouali', '0662445566', NULL, 'Smartphone', 'iPhone', '15 Pro', 'APPLE-15P-K91', 'Face ID ne fonctionne plus après remplacement écran chez un autre réparateur.', 'Module Face ID déconnecté. Nappe mal branchée lors de la réparation précédente.', 'Nappe reconnectée correctement. Face ID fonctionnel.', 'Delivered', 'Livré', 1500.00, 1500.00, 'High', '2026-01-12 11:30:00', '2026-01-14 16:00:00', '2026-01-15 09:30:00', '2026-01-20 09:00:00'),

('SAV-260115-0001', 'Mourad Tlemcani', '0773556677', 'mourad.t@outlook.com', 'Desktop', 'HP', 'ProDesk 400 G7', 'HP-PD400-M22', 'PC ne démarre plus du tout. Aucun voyant.', 'Alimentation HS (0V sur toutes les lignes). Remplacement par alim 500W.', 'Alimentation remplacée. PC démarre et fonctionne normalement.', 'Delivered', 'Livré', 7000.00, 6500.00, 'Urgent', '2026-01-15 08:00:00', '2026-01-17 12:00:00', '2026-01-18 11:00:00', '2026-01-22 09:00:00');
