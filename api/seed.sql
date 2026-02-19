-- Fresh sample seed for SAV Gestion
USE sav_gestion;

-- Remove existing data (safe for dev only)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE status_history;
TRUNCATE TABLE archives;
TRUNCATE TABLE tickets;
SET FOREIGN_KEY_CHECKS = 1;

-- New tickets
INSERT INTO tickets (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, diagnostic_notes, technician_notes, status, location, estimated_cost, final_cost, priority, created_at, updated_at, delivered_at) VALUES
('SAV-300101-0001','Inès Lemdani','0555123001','ines.lemdani@example.com','Laptop','HP','EliteBook 840','HP-EB840-01','Clavier et pavé tactile non fonctionnels après liquide.','Diagnostic: nappe corrodée.','Remplacement nappe effectué.','Received','Reception',NULL,NULL,'High','2026-02-18 09:00:00','2026-02-18 09:00:00',NULL),
('SAV-300101-0002','Samir Haddad','0660113002',NULL,'Printer','Epson','WorkForce Pro','EP-WP-22','Bourrage papier fréquent et message erreur E03.','','','Diagnostic','Atelier - Poste 1',2500.00,NULL,'Normal','2026-02-17 10:30:00','2026-02-18 10:00:00',NULL),
('SAV-300101-0003','Yasmine Benaissa','0771233003','yasmine.b@example.com','Laptop','Lenovo','ThinkPad E14','LN-E14-33','Écran fissuré et charnière lâche.','','En attente validation client.','In Progress','Atelier - Poste 2',8000.00,NULL,'High','2026-02-16 11:00:00','2026-02-17 09:15:00',NULL),
('SAV-300101-0004','Rachid Ouali','0550783004',NULL,'Desktop','Custom','Gaming-01',NULL,'PC ne démarre plus - alimentation suspecte.','','Alim remplacée, tests OK.','Completed','Étagère A - Prêt',12000.00,11000.00,'Normal','2026-02-10 14:00:00','2026-02-12 08:00:00','2026-02-15 10:00:00'),
('SAV-300101-0005','Nora Kacem','0664453005',NULL,'Monitor','Samsung','LD-24','SM-LD24-9','Pixels morts visibles sur fond clair.','','','Delivered','Livré',3000.00,2800.00,'Low','2026-01-28 09:15:00','2026-02-05 12:00:00','2026-02-06 16:00:00');

-- One archived ticket
INSERT INTO archives (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, diagnostic_notes, technician_notes, status, location, estimated_cost, final_cost, priority, created_at, updated_at, delivered_at, archived_at) VALUES
('SAV-290101-0001','Mourad Tlemcani','0773556677','mourad.t@outlook.com','Laptop','Acer','Aspire 5','AC-A5-2K1','Charnière cassée.','Charnière remplacée.','Test OK.','Delivered','Livré',5000.00,4500.00,'Normal','2026-01-10 09:00:00','2026-01-18 14:00:00','2026-01-20 10:00:00','2026-02-01 09:00:00');

-- Status history
INSERT INTO status_history (ticket_id, old_status, new_status, changed_at, notes) VALUES
('SAV-300101-0001',NULL,'Received','2026-02-18 09:00:00','Ticket créé'),
('SAV-300101-0003',NULL,'Received','2026-02-16 11:00:00','Ticket créé'),
('SAV-300101-0003','Received','In Progress','2026-02-17 09:00:00','Ouverture et diagnostic'),
('SAV-300101-0004',NULL,'Received','2026-02-10 14:00:00','Ticket créé'),
('SAV-300101-0004','Received','Completed','2026-02-12 08:00:00','Réparation terminée'),
('SAV-300101-0005',NULL,'Received','2026-01-28 09:15:00','Ticket créé'),
('SAV-300101-0005','Completed','Delivered','2026-02-06 16:00:00','Client a récupéré le matériel');

-- Sample demandes (Entreprise form submissions)
INSERT INTO demandes (type, company_name, contact_phone, contact_email, description, urgency, created_at) VALUES
('achat', 'Sarl TekPlus', '0555123456', 'contact@tekplus.dz', 'Demande d\'achat: 5 postes Dell Inspiron + 2 imprimantes', 'moyenne', '2026-02-10 09:30:00'),
('prestation', 'Axiom Services', '0660778899', 'ops@axiom.dz', 'Prestation: audit réseau et déploiement VLAN', 'urgente', '2026-02-12 14:15:00');

-- ── Archived Tickets (old ones) ─────────────────────────────

INSERT INTO archives (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, diagnostic_notes, technician_notes, status, location, estimated_cost, final_cost, priority, created_at, updated_at, delivered_at, archived_at) VALUES

('SAV-260110-0001', 'Ali Benzema', '0550112233', 'ali.benz@gmail.com', 'Laptop', 'Dell', 'Inspiron 15', 'DL-I15-7X3', 'Charnière cassée côté droit. Le capot ne tient plus.', 'Charnière + support interne cassés. Remplacement des deux côtés recommandé.', 'Charnières remplacées. Mouvement fluide vérifié.', 'Delivered', 'Livré', 5000.00, 4500.00, 'Normal', '2026-01-10 09:00:00', '2026-01-18 14:00:00', '2026-01-20 10:00:00', '2026-01-25 09:00:00'),

('SAV-260112-0001', 'Samira Ouali', '0662445566', NULL, 'Smartphone', 'iPhone', '15 Pro', 'APPLE-15P-K91', 'Face ID ne fonctionne plus après remplacement écran chez un autre réparateur.', 'Module Face ID déconnecté. Nappe mal branchée lors de la réparation précédente.', 'Nappe reconnectée correctement. Face ID fonctionnel.', 'Delivered', 'Livré', 1500.00, 1500.00, 'High', '2026-01-12 11:30:00', '2026-01-14 16:00:00', '2026-01-15 09:30:00', '2026-01-20 09:00:00'),

('SAV-260115-0001', 'Mourad Tlemcani', '0773556677', 'mourad.t@outlook.com', 'Desktop', 'HP', 'ProDesk 400 G7', 'HP-PD400-M22', 'PC ne démarre plus du tout. Aucun voyant.', 'Alimentation HS (0V sur toutes les lignes). Remplacement par alim 500W.', 'Alimentation remplacée. PC démarre et fonctionne normalement.', 'Delivered', 'Livré', 7000.00, 6500.00, 'Urgent', '2026-01-15 08:00:00', '2026-01-17 12:00:00', '2026-01-18 11:00:00', '2026-01-22 09:00:00');
