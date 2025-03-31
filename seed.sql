-- Create a test hub
INSERT INTO hubs (name, description, city, state, country)
VALUES ('SF Hub', 'San Francisco BuildClub Hub', 'San Francisco', 'CA', 'USA')
ON CONFLICT DO NOTHING;

-- Create a test event
INSERT INTO events (title, description, start_date, event_type, focus_areas, is_published)
VALUES ('AI Hackathon', 'Join us for a weekend of building AI applications', '2025-04-15', 'hackathon', ARRAY['product', 'engineering'], TRUE)
ON CONFLICT DO NOTHING;

-- Create the hub-event link
INSERT INTO hub_events (hub_id, event_id, is_primary)
SELECT 
  (SELECT id FROM hubs WHERE name = 'SF Hub'), 
  (SELECT id FROM events WHERE title = 'AI Hackathon'), 
  TRUE
ON CONFLICT DO NOTHING;
