# takie-o

Interactive, online SQL tutorial.

## Project structure

The code is separated into two modules:

- [./lib](./lib), where pure logic lives
- [./app](./app), implementing the presentation layer

Separating the two should make it a bit easier to maintain the code. `lib/`
uses different build and testing tools than `app/`. There's no point using a UI
testing framework to test plain functions.

TODO:

- read about pnpm workspaces + parcel
- load the SQLite DB, instead of parsing CSVs
