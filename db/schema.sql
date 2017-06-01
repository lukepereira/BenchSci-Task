DROP SCHEMA IF EXISTS BenchSci CASCADE;

CREATE SCHEMA BenchSci;

SET search_path TO BenchSci;

DROP TABLE IF EXISTS genes;
CREATE TABLE genes
(
  id serial PRIMARY KEY NOT NULL,
  title text,
  author text,
  publisher text,
  pub_date date,
  figure_number text,
  technique_group text,
  gene text
);

\copy genes(title,author,publisher,pub_date,figure_number,technique_group,gene) FROM 'test_data.csv' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS users;
CREATE TABLE users
(
  username text PRIMARY KEY NOT NULL,
  password text NOT NULL
);

DROP TABLE IF EXISTS userpubs;
CREATE TABLE userpubs
(
  pub_id int REFERENCES genes(id),
  username text REFERENCES users(username)
);
