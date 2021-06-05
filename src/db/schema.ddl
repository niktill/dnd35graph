-- Schema for D&D v3.5 monsters, spells, and more


drop schema if exists dnd35graph cascade; 
create schema dnd35graph;
set search_path to dnd35graph;

-- An instance of a monster 
create table Monster(
    name text primary key,
    -- unique monster name.
    srd20Href text,
    -- srd20 link for monster
    sizeType text,
    -- size and type of monster.
    hitDice text,
    -- hit dice of monster, representing health.
    initiative text,
    -- initiative modifier of monster.
    speed text,
    -- speed of monster in feet.
    armorClass text,
    baseAttackGrapple text,
    attack text,
    fullAttack text,
    spaceReach text,
    specialAttacks text,
    specialQualities text,
    saves text,
    abilities text,
    skills text,
    feats text,
    environment text,
    organization text,
    challengeRating text,
    treasure text,
    alignment text,
    advancement text,
    levelAdjustment text);