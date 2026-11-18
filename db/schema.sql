CREATE DATABASE IF NOT EXISTS belajar_next;
USE belajar_next;

CREATE TABLE peserta (
  bib INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  klub VARCHAR(100) NOT NULL DEFAULT '',
  kategori VARCHAR(30) NOT NULL DEFAULT 'Pemula'
) AUTO_INCREMENT = 101;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin'
);

INSERT INTO peserta (nama, klub, kategori) VALUES
  ('Budi', 'Klub A', 'Pemula'),
  ('Sari', 'Klub B', 'Junior');