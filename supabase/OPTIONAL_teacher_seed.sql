-- OPTIONAL: Add your 5 existing teachers.
-- Replace names/details below with real data before running.

insert into public.teachers
(teacher_code, full_name, gender, qualification, languages, specialties, timezone, max_students)
values
('T001','Teacher 1','male',null,array['Urdu','English'],array['Quran Reading','Tajweed'],'Asia/Karachi',20),
('T002','Teacher 2','male',null,array['Urdu'],array['Hifz','Quran Reading'],'Asia/Karachi',20),
('T003','Teacher 3','female',null,array['Urdu','English'],array['Noorani Qaida','Quran Reading'],'Asia/Karachi',20),
('T004','Teacher 4','female',null,array['Urdu'],array['Tajweed','Islamic Studies'],'Asia/Karachi',20),
('T005','Teacher 5','male',null,array['Urdu','Arabic'],array['Tajweed','Hadith','Seerah'],'Asia/Karachi',20)
on conflict (teacher_code) do nothing;
