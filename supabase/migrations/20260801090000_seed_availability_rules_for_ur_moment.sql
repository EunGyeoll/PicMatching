insert into availability_rules (photographer_id, day_of_week, start_time, end_time)
select 'aed73d7a-e2ce-402e-8cdb-431f7a0e2a48', dow, '12:00', '20:00'
from unnest(array[0,2,3,4,5,6]) as dow;
