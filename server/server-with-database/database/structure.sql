/*
  Inflection
*/
DROP TABLE IF EXISTS inflection;
CREATE TABLE inflection (
  BIN_id INT(8),
  base_word VARCHAR(120),
  base_word_lowercase VARCHAR(120) COLLATE utf8mb4_bin,
  inflectional_form VARCHAR(120) COLLATE utf8mb4_bin,
  inflectional_form_lowercase VARCHAR(120) COLLATE utf8mb4_bin,
  word_categories VARCHAR(5),
  correctness_grade_of_word VARCHAR(1),
  BIN_domain VARCHAR(8),
  word_register VARCHAR(8),
  grammar_group VARCHAR(20),
  cross_reference VARCHAR(16),
  should_be_taught BOOLEAN,
  grammatical_tag VARCHAR(40),
  correctness_grade_of_inflectional_form VARCHAR(1),
  register_of_inflectional_form VARCHAR(5),
  various_feature_markers VARCHAR(5),
  alternative_entry VARCHAR(60) 
  ROW_FORMAT=COMPRESSED
);
CREATE INDEX _BIN_id ON inflection (BIN_id);
CREATE INDEX _base_word_lowercase ON inflection (base_word_lowercase);
CREATE INDEX _inflectional_form_lowercase ON inflection (inflectional_form_lowercase);
CREATE INDEX _should_be_taught ON inflection (should_be_taught);



DROP TABLE IF EXISTS autocomplete;
CREATE TABLE autocomplete (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  input VARCHAR(255) COLLATE utf8_bin,
  output VARCHAR(255),
  score INT UNSIGNED -- Between 1 and 100
  ROW_FORMAT=COMPRESSED
);
CREATE INDEX _input ON autocomplete (input);
CREATE INDEX _output ON autocomplete (output);
CREATE INDEX _score ON autocomplete (score);






DROP TABLE IF EXISTS vocabulary_input;
CREATE TABLE vocabulary_input (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  base VARCHAR(120),
  word VARCHAR(120) COLLATE utf8_bin,
  grammatical_category VARCHAR(2),
  level INT,
  translation VARCHAR(120),
  word_package VARCHAR(120),
  #beyging_id VARCHAR(20),
  beyging_hash VARCHAR(20)
);
CREATE INDEX _id ON vocabulary_input (id);
CREATE INDEX _grammatical_category ON vocabulary_input (grammatical_category);


DROP TABLE IF EXISTS vocabulary_fields;
CREATE TABLE vocabulary_fields (
  id INT(6) UNSIGNED,
  name VARCHAR(120),
  value VARCHAR(120)
);
CREATE INDEX _id ON vocabulary_fields (id);
