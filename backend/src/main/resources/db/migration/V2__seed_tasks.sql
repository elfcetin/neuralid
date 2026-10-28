-- Her görev tipinden örnek görevler (geliştirme ve test için)
INSERT INTO task (task_id, task_type, difficulty, content, correct_answer) VALUES
                                                                               ('11111111-1111-1111-1111-111111111101', 'LOGIC',  1, 'Diziyi tamamlayın: 2, 4, 6, 8, ?',            '10'),
                                                                               ('11111111-1111-1111-1111-111111111102', 'LOGIC',  2, 'Diziyi tamamlayın: 1, 1, 2, 3, 5, 8, ?',      '13'),
                                                                               ('22222222-2222-2222-2222-222222222201', 'MATH',   1, '27 + 48 = ?',                                  '75'),
                                                                               ('22222222-2222-2222-2222-222222222202', 'MATH',   3, '(15 x 4) - (36 / 3) = ?',                     '48'),
                                                                               ('33333333-3333-3333-3333-333333333301', 'PUZZLE', 1, '{"type":"grid","size":2,"cells":[1,2,3,null]}', '4'),
                                                                               ('33333333-3333-3333-3333-333333333302', 'PUZZLE', 2, '{"type":"match","pairs":[["A","1"],["B","2"],["C","?"]]}', '3');