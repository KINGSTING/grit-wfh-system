-- 1. Create the Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(50) PRIMARY KEY, -- Unique ID (can be employee ID or Slack/Discord identifier)
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100),
    team VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the Tasks Table with Foreign Key Relationship
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY, -- Auto-incrementing Unique ID for each task log
    employee_id VARCHAR(50) NOT NULL, -- Links this task to the employees table
    title VARCHAR(255) NOT NULL,
    description TEXT,
    documentation_url TEXT, -- The Google Drive file link
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- This enforces data integrity: you cannot log a task for an employee who doesn't exist
    CONSTRAINT fk_employee
        FOREIGN KEY(employee_id) 
        REFERENCES employees(id)
        ON DELETE CASCADE
);