**List of pages which contain errors:**

- http://localhost:9123/?id=418150 missing parts



ALTER TABLE inflection RENAME COLUMN  word_class TO word_categories;
ALTER TABLE inflection RENAME COLUMN  correctness_grade_of_base_word TO correctness_grade_of_word;
ALTER TABLE inflection RENAME COLUMN  register_of_base_word TO word_register;
ALTER TABLE inflection RENAME COLUMN  descriptive TO should_be_taught;
ALTER TABLE inflection RENAME COLUMN  correctness_grade_of_word_form TO correctness_grade_of_inflectional_form;
ALTER TABLE inflection RENAME COLUMN  register_of_word_form TO register_of_inflectional_form;
ALTER TABLE inflection RENAME COLUMN  only_found_in_idioms TO various_feature_markers;
