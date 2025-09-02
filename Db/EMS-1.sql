
CREATE DATABASE EmployeeManagementSystem;
GO

USE EmployeeManagementSystem;
GO

-- Roles
CREATE TABLE Roles (
    RoleId INT PRIMARY KEY IDENTITY(1,1),
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);
GO


-- Users

CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    RoleId INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (RoleId) REFERENCES Roles(RoleId) ON DELETE NO ACTION
);
GO

-- ===============================
-- Departments
-- ===============================
CREATE TABLE Departments (
    DepartmentId INT PRIMARY KEY IDENTITY(1,1),
    DepartmentName NVARCHAR(100) NOT NULL UNIQUE
);
GO

-- ===============================
-- Employees
-- ===============================
CREATE TABLE Employees (
    EmployeeId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Gender NVARCHAR(10),
    DateOfBirth DATE,
    HireDate DATE DEFAULT GETDATE(),
    JobTitle NVARCHAR(100),
    DepartmentId INT NULL,
    ManagerId INT NULL,

    CONSTRAINT FK_Employees_User FOREIGN KEY (UserId)
        REFERENCES Users(UserId) ON DELETE CASCADE,

    CONSTRAINT FK_Employees_Department FOREIGN KEY (DepartmentId)
        REFERENCES Departments(DepartmentId) ON DELETE SET NULL,

    CONSTRAINT FK_Employees_Manager FOREIGN KEY (ManagerId)
        REFERENCES Employees(EmployeeId) ON DELETE SET NULL
);
GO

-- ===============================
-- Leaves
-- ===============================
CREATE TABLE Leaves (
    LeaveId INT PRIMARY KEY IDENTITY(1,1),
    EmployeeId INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Reason NVARCHAR(255),
    Status NVARCHAR(20) DEFAULT 'Pending',  -- Pending, Approved, Rejected
    RequestedAt DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Leaves_Employees FOREIGN KEY (EmployeeId)
        REFERENCES Employees(EmployeeId) ON DELETE CASCADE
);
GO

-- ===============================
-- Seed Data
-- ===============================
INSERT INTO Roles (RoleName) VALUES ('HR'), ('Manager'), ('Employee');
GO

INSERT INTO Departments (DepartmentName) VALUES ('IT'), ('HR'), ('Finance');
GO

-- Dummy users
INSERT INTO Users (Email, PasswordHash, RoleId)
VALUES
('hr@company.com', 'hashedpassword1', 1),
('manager@company.com', 'hashedpassword2', 2),
('employee@company.com', 'hashedpassword3', 3);
GO

-- Dummy employees
INSERT INTO Employees (UserId, FirstName, LastName, Gender, DateOfBirth, JobTitle, DepartmentId, ManagerId)
VALUES
(1, 'Dilip', 'Kumar', 'Male', '2003-02-04', 'HR Manager', 2, NULL),
(2, 'Kartisha', 'Reddy', 'Female', '1990-06-25', 'Team Lead', 1, NULL),
(3, 'Adithya', 'Brown', 'Male', '1995-09-10', 'Developer', 1, 2);
GO
