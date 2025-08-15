-- most active player 
-- Table: SnapCount
-- Columns: player_id, week, snaps

SELECT player_id
FROM SnapCount
GROUP BY player_id
ORDER BY SUM(snaps) DESC
LIMIT 1

-- player names with no injuries
-- Tables:
-- Players(player_id, name)
-- Injuries(player_id, injury_date)

SELECT p.name
FROM Players p
LEFT JOIN Injuries i ON p.player_id = i.player_id
WHERE i.injury_date IS NULL; 


-- total snaps per position 
-- PlayerStats(player_id, position, snaps)

SELECT position, SUM(snaps) as pos_tot_snaps
FROM PlayerStats
GROUP BY position 
ORDER BY pos_tot_snaps DESC; 


-- players who played every week 
-- Table: SnapLog(player_id, week, snaps)

SELECT player_id
FROM SnapLog
GROUP BY player_id
HAVING COUNT(DISTINCT week) = (SELECT COUNT(DISTINCT week) FROM SnapLog);