DROP TABLE IF EXISTS email;
CREATE TABLE IF NOT EXISTS email (
    id TEXT PRIMARY KEY,
    mfrom TEXT,
    mto TEXT,
    subject TEXT,
    body TEXT,
    html TEXT,
    allJson TEXT,
    createdAt INTEGER
);
