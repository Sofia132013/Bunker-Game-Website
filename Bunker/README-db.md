# Database Documentation

## Overview

This project uses **PostgreSQL** as the database

The schema is defined in:
`prisma/schema.prisma`


## Getting Started

You can run the project using Docker or locally.

## Docker Setup

The project can be run using Docker for a consistent and isolated environment.

### 1. Build and start containers

```
    docker compose up --build --force-recreate --renew-anon-volumes 
    docker-compose exec app npx prisma migrate dev
    docker-compose exec app npx prisma generate
    docker-compose exec app node seed.js
```

## Local Setup

### 1. Install dependencies

```
npm install
```
### Configuration & Validation
- joi
- class-validator
- class-transformer

### Database
- prisma
- @prisma/client
- pg

### Realtime
- socket.io-client

### Utilities
- dotenv
- compression
- helmet
- rxjs

### Dev Dependencies
- jest
- supertest
- eslint
- prettier

### 2. Configure environment variables

Create a .env file in the root directory:

```
DATABASE_URL="postgresql://postgres:postgres@db:5432/postgres" 
```
- USER = postgres, 
- PASSWORD = postgres, 
- HOST = db, 
- PORT = 5432, 
- DATABASE = postgres

### 3. Run database migrations

```
npx prisma migrate dev --name init_schema`
```

### 4. Generate Prisma client

```
npm run generate
```

### 5. Run seed (optional)

The project includes a seed script to populate the database with initial data

```
npx prisma db seed
```
## Database Schema

### Player

Represents a player participating in a room.

Fields:
- secret_key (String, Primary Key) — unique identifier of the player
- name (String, Unique) — player name
- status (PlayerStatus, Default: MIK) — current player status
- room_id (String, Foreign Key) — ID of the room the player belongs to

Relations:
- room → Room (Many-to-One)
- decks → Deck[] (One-to-Many)

### Room

Represents a game room where players join.

Fields:
- id (String, Primary Key, UUID) — unique room identifier
- apocalypse (String, Foreign Key) — apocalypse type
- host_id (String) — ID of the host player
- max_players (Int, Default: 10) — maximum number of players
- room_name (String) — name of the room

Relations:
- apocalypseRel → Apocalypse (Many-to-One)
- players → Player[] (One-to-Many)

### Apocalypse

Represents a game scenario.

Fields:
- name (String, Primary Key) — unique apocalypse name

Relations:
- rooms → Room[] (One-to-Many)

### Deck

Represents the relationship between a player and their cards.

Fields:
- secret_key (String, Foreign Key) — player ID
- card_id (String, Foreign Key) — card ID
- status (DeckStatus) — card status in deck

Primary Key:
- Composite: (secret_key, card_id)

Relations:
- player → Player (Many-to-One)
- card → Card (Many-to-One)

### Card

Represents a game card.

Fields:
- card_id (String, Primary Key) — unique card identifier
- category (String, Foreign Key) — category name
- description (String, Optional) — card description

Relations:
- categoryRel → Category (Many-to-One)
- decks → Deck[] (One-to-Many)

### Category

Represents a card category.

Fields:
- name (String, Primary Key) — category name

Relations:
- cards → Card[] (One-to-Many)

### PlayerStatus
- MIK
- READY
- IN_GAME

### DeckStatus
- ACTIVE
- NOT_ACTIVE

### Relationships

- A Room has many Players
- A Player belongs to one Room

- A Room belongs to one Apocalypse
- An Apocalypse has many Rooms

- A Player has many Deck entries
- A Deck belongs to one Player

- A Card has many Deck entries
- A Deck belongs to one Card

- A Card belongs to one Category
- A Category has many Cards

