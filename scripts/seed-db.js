/* eslint-disable no-console */
// Run with: npm run db:seed

const mysql = require("mysql2/promise");

async function run() {
  const host = process.env.DB_HOST || "localhost";
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASS || "";
  const database = process.env.DB_NAME || "sav_gestion";
  const port = parseInt(process.env.DB_PORT || "3306", 10);

  const conn = await mysql.createConnection({
    host,
    user,
    password,
    database,
    port,
    multipleStatements: true,
  });
  try {
    console.log("Clearing tables: status_history, archives, tickets, demandes");
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");

    // Ensure 'demandes' table exists (backwards-compatible with older DBs)
    await conn.query(`CREATE TABLE IF NOT EXISTS demandes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type ENUM('achat','prestation') NOT NULL,
      company_name VARCHAR(200) NOT NULL,
      contact_phone VARCHAR(50) NOT NULL,
      contact_email VARCHAR(200) DEFAULT NULL,
      description TEXT NOT NULL,
      urgency VARCHAR(20) DEFAULT 'normal',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_type (type),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB;`);

    await conn.query("TRUNCATE TABLE status_history");
    await conn.query("TRUNCATE TABLE archives");
    await conn.query("TRUNCATE TABLE tickets");
    await conn.query("TRUNCATE TABLE demandes");
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log(
      "Inserting new seed records (tickets, archives, status_history, demandes)",
    );

    // Tickets
    const tickets = [
      [
        "SAV-300101-0001",
        "Inès Lemdani",
        "0555123001",
        "ines.lemdani@example.com",
        "Laptop",
        "HP",
        "EliteBook 840",
        "HP-EB840-01",
        "Clavier et pavé tactile non fonctionnels après liquide.",
        "Diagnostic: nappe corrodée.",
        "Remplacement nappe effectué.",
        "Received",
        "Reception",
        null,
        null,
        "High",
        "2026-02-18 09:00:00",
        "2026-02-18 09:00:00",
        null,
      ],
      [
        "SAV-300101-0002",
        "Samir Haddad",
        "0660113002",
        null,
        "Printer",
        "Epson",
        "WorkForce Pro",
        "EP-WP-22",
        "Bourrage papier fréquent et erreur E03.",
        "",
        "",
        "Diagnostic",
        "Atelier - Poste 1",
        2500.0,
        null,
        "Normal",
        "2026-02-17 10:30:00",
        "2026-02-18 10:00:00",
        null,
      ],
      [
        "SAV-300101-0003",
        "Yasmine Benaissa",
        "0771233003",
        "yasmine.b@example.com",
        "Laptop",
        "Lenovo",
        "ThinkPad E14",
        "LN-E14-33",
        "Écran fissuré et charnière lâche.",
        "Charnière HS - devis envoyé.",
        "En attente validation client.",
        "In Progress",
        "Atelier - Poste 2",
        8000.0,
        null,
        "High",
        "2026-02-16 11:00:00",
        "2026-02-17 09:15:00",
        null,
      ],
      [
        "SAV-300101-0004",
        "Rachid Ouali",
        "0550783004",
        null,
        "Desktop",
        "Custom",
        "Gaming-01",
        null,
        "PC ne démarre plus - alimentation suspecte.",
        "Alimentation testée KO.",
        "Alim remplacée, tests OK.",
        "Completed",
        "Étagère A - Prêt",
        12000.0,
        11000.0,
        "Normal",
        "2026-02-10 14:00:00",
        "2026-02-12 08:00:00",
        "2026-02-15 10:00:00",
      ],
      [
        "SAV-300101-0005",
        "Nora Kacem",
        "0664453005",
        null,
        "Monitor",
        "Samsung",
        "LD-24",
        "SM-LD24-9",
        "Pixels morts visibles sur fond clair.",
        "",
        "",
        "Delivered",
        "Livré",
        3000.0,
        2800.0,
        "Low",
        "2026-01-28 09:15:00",
        "2026-02-05 12:00:00",
        "2026-02-06 16:00:00",
      ],
    ];

    for (const t of tickets) {
      await conn.query(
        `INSERT INTO tickets (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, diagnostic_notes, technician_notes, status, location, estimated_cost, final_cost, priority, created_at, updated_at, delivered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        t,
      );
    }

    // Archives (one sample)
    await conn.query(
      `INSERT INTO archives (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, diagnostic_notes, technician_notes, status, location, estimated_cost, final_cost, priority, created_at, updated_at, delivered_at, archived_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "SAV-290101-0001",
        "Mourad Tlemcani",
        "0773556677",
        "mourad.t@outlook.com",
        "Laptop",
        "Acer",
        "Aspire 5",
        "AC-A5-2K1",
        "Charnière cassée.",
        "Charnière remplacée.",
        "Test OK.",
        "Delivered",
        "Livré",
        5000.0,
        4500.0,
        "Normal",
        "2026-01-10 09:00:00",
        "2026-01-18 14:00:00",
        "2026-01-20 10:00:00",
        "2026-02-01 09:00:00",
      ],
    );

    // Status history
    const history = [
      [
        "SAV-300101-0001",
        null,
        "Received",
        "2026-02-18 09:00:00",
        "Ticket créé",
      ],
      [
        "SAV-300101-0003",
        null,
        "Received",
        "2026-02-16 11:00:00",
        "Ticket créé",
      ],
      [
        "SAV-300101-0003",
        "Received",
        "In Progress",
        "2026-02-17 09:00:00",
        "Ouverture et diagnostic",
      ],
      [
        "SAV-300101-0004",
        null,
        "Received",
        "2026-02-10 14:00:00",
        "Ticket créé",
      ],
      [
        "SAV-300101-0004",
        "Received",
        "Completed",
        "2026-02-12 08:00:00",
        "Réparation terminée",
      ],
      [
        "SAV-300101-0005",
        null,
        "Received",
        "2026-01-28 09:15:00",
        "Ticket créé",
      ],
      [
        "SAV-300101-0005",
        "Completed",
        "Delivered",
        "2026-02-06 16:00:00",
        "Client a récupéré le matériel",
      ],
    ];

    for (const h of history) {
      await conn.query(
        `INSERT INTO status_history (ticket_id, old_status, new_status, changed_at, notes) VALUES (?, ?, ?, ?, ?)`,
        h,
      );
    }

    // Sample demandes
    const demandes = [
      [
        "achat",
        "Sarl TekPlus",
        "0555123456",
        "contact@tekplus.dz",
        "Demande d'achat: 5 postes Dell Inspiron + 2 imprimantes",
        "moyenne",
        "2026-02-10 09:30:00",
      ],
      [
        "prestation",
        "Axiom Services",
        "0660778899",
        "ops@axiom.dz",
        "Prestation: audit réseau et déploiement VLAN",
        "urgente",
        "2026-02-12 14:15:00",
      ],
    ];

    for (const d of demandes) {
      await conn.query(
        `INSERT INTO demandes (type, company_name, contact_phone, contact_email, description, urgency, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        d,
      );
    }

    console.log("Seeding complete");
  } catch (err) {
    console.error("Seeding failed", err);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

run();
