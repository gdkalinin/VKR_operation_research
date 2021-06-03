#!/usr/bin/env bash
psql -U postgres -f ./sql_scripts/create_database.sql
psql -U postgres -f ./sql_scripts/create_structure.sql egrip
psql -U postgres -f ./sql_scripts/create_user.sql egrip

