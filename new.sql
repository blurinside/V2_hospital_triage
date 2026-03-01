CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    visit_id INT NOT NULL REFERENCES visits(id) ON DELETE CASCADE,

    classification VARCHAR(20) NOT NULL
        CHECK (classification IN ('Critical','Needs Review')),

    risk_probability FLOAT NOT NULL
        CHECK (risk_probability BETWEEN 0 AND 1),

    override_triggered BOOLEAN NOT NULL DEFAULT FALSE,

    model_version VARCHAR(30) DEFAULT 'vFINAL_binary',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);