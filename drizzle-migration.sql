-- Drop existing enum types if they exist
DROP TYPE IF EXISTS event_type;
DROP TYPE IF EXISTS focus_area;

-- Create enum types
CREATE TYPE event_type AS ENUM ('workshop', 'meetup', 'hackathon', 'conference');
CREATE TYPE focus_area AS ENUM ('product', 'design', 'engineering', 'general');

-- Create tables
CREATE TABLE IF NOT EXISTS hubs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL,
  address TEXT,
  latitude TEXT,
  longitude TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TEXT,
  end_time TEXT,
  event_type event_type NOT NULL,
  focus_areas TEXT[],
  capacity INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by_id INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS hub_events (
  id SERIAL PRIMARY KEY,
  hub_id INTEGER NOT NULL REFERENCES hubs(id),
  event_id INTEGER NOT NULL REFERENCES events(id),
  is_primary BOOLEAN DEFAULT FALSE,
  capacity INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uniq_hub_event_idx UNIQUE (hub_id, event_id)
);

CREATE TABLE IF NOT EXISTS hub_event_registrations (
  id SERIAL PRIMARY KEY,
  hub_event_id INTEGER NOT NULL REFERENCES hub_events(id),
  user_id INTEGER REFERENCES users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  interest_areas TEXT[] NOT NULL,
  ai_interests TEXT,
  status TEXT DEFAULT 'registered',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uniq_hubevent_user_idx UNIQUE (hub_event_id, email)
);
