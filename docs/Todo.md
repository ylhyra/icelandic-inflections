**List of pages which contain errors:**

- http://localhost:9123/?id=418150 missing parts




ALTER TABLE inflection CHANGE `word_class` `word_categories` VARCHAR(5);
ALTER TABLE inflection CHANGE `correctness_grade_of_base_word` `correctness_grade_of_word` VARCHAR(1);
ALTER TABLE inflection CHANGE `register_of_base_word` `word_register` VARCHAR(8);
ALTER TABLE inflection CHANGE `descriptive` `should_be_taught` BOOLEAN;
ALTER TABLE inflection CHANGE `correctness_grade_of_word_form` `correctness_grade_of_inflectional_form` VARCHAR(1);
ALTER TABLE inflection CHANGE `register_of_word_form` `register_of_inflectional_form` VARCHAR(5);
ALTER TABLE inflection CHANGE `only_found_in_idioms` `various_feature_markers` VARCHAR(5);
