import { Migration } from '@mikro-orm/migrations';

export class Migration20221215142300 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "bet" ("id" uuid not null, "version" int not null default 1, "player_ids" text[] not null, "winner_player_id" uuid null, "amount" smallint not null, "match_id" uuid not null, "status_value" smallint not null, constraint "bet_pkey" primary key ("id"));');

    this.addSql('create table "field" ("id" uuid not null, "match_id" uuid not null, "size" smallint not null, "marked_cell_position" smallint not null, "player_ids" text[] not null, "version" int not null default 1, "finished_at" timestamptz(0) null, "created_at" timestamptz(0) null, constraint "field_pkey" primary key ("id"));');

    this.addSql('create table "match" ("id" uuid not null, "version" int not null default 1, "players" jsonb not null, "max_players" smallint not null, "finished_at" timestamptz(0) null, "session_started_at" timestamptz(0) null, "session_minutes_to_play" smallint null, constraint "match_pkey" primary key ("id"));');
  }

}
