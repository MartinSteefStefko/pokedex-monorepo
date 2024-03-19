import { Migration } from '@mikro-orm/migrations';

export class Migration20240318175453 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "pokemon" ("id" serial primary key, "name" varchar(255) not null, "types" text[] null, "weight_minimum" varchar(255) null, "weight_maximum" varchar(255) null, "height_minimum" varchar(255) null, "height_maximum" varchar(255) null, "flee_rate" varchar(255) null, "classification" varchar(255) null, "resistant" text[] null, "weaknesses" text[] null, "max_cp" int null, "max_hp" int null, "evolution_requirement_amount" int null, "evolution_requirement_name" varchar(255) null);');

    this.addSql('create table "evolution" ("id" serial primary key, "name" varchar(255) not null, "pokemon_id" int not null);');

    this.addSql('create table "attack" ("id" serial primary key, "attack_type" varchar(255) null, "name" varchar(255) not null, "type" varchar(255) null, "damage" int null, "pokemon_id" int not null);');

    this.addSql('alter table "evolution" add constraint "evolution_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade;');

    this.addSql('alter table "attack" add constraint "attack_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create schema if not exists "auth";');

    this.addSql('create schema if not exists "storage";');

    this.addSql('create schema if not exists "vault";');

    this.addSql('create table "auth"."audit_log_entries" ("instance_id" uuid null, "id" uuid not null, "payload" json null, "created_at" timestamptz(6) null, "ip_address" varchar(64) not null default \'\', constraint "audit_log_entries_pkey" primary key ("id"));');
    this.addSql('comment on table "auth"."audit_log_entries" is \'Auth: Audit trail for user actions.\';');
    this.addSql('create index "audit_logs_instance_id_idx" on "auth"."audit_log_entries" ("instance_id");');

    this.addSql('create table "storage"."buckets" ("id" text not null, "name" text not null, "owner" uuid null, "created_at" timestamptz(6) null default now(), "updated_at" timestamptz(6) null default now(), "public" bool null default false, "avif_autodetection" bool null default false, "file_size_limit" int8 null, "allowed_mime_types" text[] null, "owner_id" text null, constraint "buckets_pkey" primary key ("id"));');
    this.addSql('comment on column "storage"."buckets"."owner" is \'Field is deprecated, use owner_id instead\';');
    this.addSql('alter table "storage"."buckets" add constraint "bname" unique ("name");');

    this.addSql('create table "auth"."flow_state" ("id" uuid not null, "user_id" uuid null, "auth_code" text not null, "code_challenge_method" code_challenge_method not null, "code_challenge" text not null, "provider_type" text not null, "provider_access_token" text null, "provider_refresh_token" text null, "created_at" timestamptz(6) null, "updated_at" timestamptz(6) null, "authentication_method" text not null, constraint "flow_state_pkey" primary key ("id"));');
    this.addSql('comment on table "auth"."flow_state" is \'stores metadata for pkce logins\';');
    this.addSql('create index "flow_state_created_at_idx" on "auth"."flow_state" ("created_at");');
    this.addSql('create index "idx_auth_code" on "auth"."flow_state" ("auth_code");');
    this.addSql('create index "idx_user_id_auth_method" on "auth"."flow_state" ("user_id", "authentication_method");');

    this.addSql('create table "auth"."identities" ("provider_id" text not null, "user_id" uuid not null, "identity_data" jsonb not null, "provider" text not null, "last_sign_in_at" timestamptz(6) null, "created_at" timestamptz(6) null, "updated_at" timestamptz(6) null, "email" text generated always as lower((identity_data ->> \'email\'::text)) stored null, "id" uuid not null default gen_random_uuid(), constraint "identities_pkey" primary key ("id"));');
    this.addSql('comment on table "auth"."identities" is \'Auth: Stores identities associated to a user.\';');
    this.addSql('comment on column "auth"."identities"."email" is \'Auth: Email is a generated column that references the optional email property in the identity_data\';');
    this.addSql('create index "identities_email_idx" on "auth"."identities" ("email");');
    this.addSql('alter table "auth"."identities" add constraint "identities_provider_id_provider_unique" unique ("provider_id", "provider");');
    this.addSql('create index "identities_user_id_idx" on "auth"."identities" ("user_id");');

    this.addSql('create table "auth"."instances" ("id" uuid not null, "uuid" uuid null, "raw_base_config" text null, "created_at" timestamptz(6) null, "updated_at" timestamptz(6) null, constraint "instances_pkey" primary key ("id"));');
    this.addSql('comment on table "auth"."instances" is \'Auth: Manages users across multiple sites.\';');

    this.addSql('create table "auth"."mfa_amr_claims" ("session_id" uuid not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "authentication_method" text not null, "id" uuid not null, constraint "amr_id_pk" primary key ("id"));');
    this.addSql('comment on table "auth"."mfa_amr_claims" is \'auth: stores authenticator method reference claims for multi factor authentication\';');
    this.addSql('alter table "auth"."mfa_amr_claims" add constraint "mfa_amr_claims_session_id_authentication_method_pkey" unique ("session_id", "authentication_method");');

    this.addSql('create table "auth"."mfa_challenges" ("id" uuid not null, "factor_id" uuid not null, "created_at" timestamptz(6) not null, "verified_at" timestamptz(6) null, "ip_address" inet not null, constraint "mfa_challenges_pkey" primary key ("id"));');
    this.addSql('comment on table "auth"."mfa_challenges" is \'auth: stores metadata about challenge requests made\';');
    this.addSql('create index "mfa_challenge_created_at_idx" on "auth"."mfa_challenges" ("created_at");');

    this.addSql('create table "auth"."mfa_factors" ("id" uuid not null, "user_id" uuid not null, "friendly_name" text null, "factor_type" factor_type not null, "status" factor_status not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "secret" text null, constraint "mfa_factors_pkey" primary key ("id"));');
    this.addSql('comment on table "auth"."mfa_factors" is \'auth: stores metadata about factors\';');
    this.addSql('create index "factor_id_created_at_idx" on "auth"."mfa_factors" ("user_id", "created_at");');
    this.addSql('alter table "auth"."mfa_factors" add constraint "mfa_factors_user_friendly_name_unique" unique ("friendly_name", "user_id");');
    this.addSql('create index "mfa_factors_user_id_idx" on "auth"."mfa_factors" ("user_id");');

    this.addSql('create table "storage"."migrations" ("id" int4 not null, "name" varchar(100) not null, "hash" varchar(40) not null, "executed_at" timestamp(6) null default CURRENT_TIMESTAMP, constraint "migrations_pkey" primary key ("id"));');
    this.addSql('alter table "storage"."migrations" add constraint "migrations_name_key" unique ("name");');

    this.addSql('create table "storage"."objects" ("id" uuid not null default gen_random_uuid(), "bucket_id" text null, "name" text null, "owner" uuid null, "created_at" timestamptz(6) null default now(), "updated_at" timestamptz(6) null default now(), "last_accessed_at" timestamptz(6) null default now(), "metadata" jsonb null, "path_tokens" text[] generated always as string_to_array(name, \'/\'::text) stored null, "version" text null, "owner_id" text null, constraint "objects_pkey" primary key ("id"));');
    this.addSql('comment on column "storage"."objects"."owner" is \'Field is deprecated, use owner_id instead\';');
    this.addSql('alter table "storage"."objects" add constraint "bucketid_objname" unique ("bucket_id", "name");');
    this.addSql('create index "name_prefix_search" on "storage"."objects" ("name");');

    this.addSql('create table "auth"."refresh_tokens" ("instance_id" uuid null, "id" bigserial primary key, "token" varchar(255) null, "user_id" varchar(255) null, "revoked" bool null, "created_at" timestamptz(6) null, "updated_at" timestamptz(6) null, "parent" varchar(255) null, "session_id" uuid null);');
    this.addSql('comment on table "auth"."refresh_tokens" is \'Auth: Store of tokens used to refresh JWT tokens once they expire.\';');
    this.addSql('create index "refresh_tokens_instance_id_idx" on "auth"."refresh_tokens" ("instance_id");');
    this.addSql('create index "refresh_tokens_instance_id_user_id_idx" on "auth"."refresh_tokens" ("instance_id", "user_id");');
    this.addSql('create index "refresh_tokens_parent_idx" on "auth"."refresh_tokens" ("parent");');
    this.addSql('create index "refresh_tokens_session_id_revoked_idx" on "auth"."refresh_tokens" ("session_id", "revoked");');
    this.addSql('alter table "auth"."refresh_tokens" add constraint "refresh_tokens_token_unique" unique ("token");');
    this.addSql('create index "refresh_tokens_updated_at_idx" on "auth"."refresh_tokens" ("updated_at");');

    this.addSql('create table "auth"."saml_providers" ("id" uuid not null, "sso_provider_id" uuid not null, "entity_id" text not null, "metadata_xml" text not null, "metadata_url" text null, "attribute_mapping" jsonb null, "created_at" timestamptz(6) null, "updated_at" timestamptz(6) null, constraint "saml_providers_pkey" primary key ("id"), constraint entity_id not empty check (char_length(entity_id) > 0), constraint metadata_url not empty check ((metadata_url = NULL::text) OR (char_length(metadata_url) > 0)), constraint metadata_xml not empty check (char_length(metadata_xml) > 0));');
    this.addSql('comment on table "auth"."saml_providers" is \'Auth: Manages SAML Identity Provider connections.\';');
    this.addSql('alter table "auth"."saml_providers" add constraint "saml_providers_entity_id_key" unique ("entity_id");');
    this.addSql('create index "saml_providers_sso_provider_id_idx" on "auth"."saml_providers" ("sso_provider_id");');

    this.addSql('create table "auth"."saml_relay_states" ("id" uuid not null, "sso_provider_id" uuid not null, "request_id" text not null, "for_email" text null, "redirect_to" text null, "created_at" timestamptz(6) null, "updated_at" timestamptz(6) null, "flow_state_id" uuid null, constraint "saml_relay_states_pkey" primary key ("id"), constraint request_id not empty check (char_length(request_id) > 0));');
    this.addSql('comment on table "auth"."saml_relay_states" is \'Auth: Contains SAML Relay State information for each Service Provider initiated login.\';');
    this.addSql('create index "saml_relay_states_created_at_idx" on "auth"."saml_relay_states" ("created_at");');
    this.addSql('create index "saml_relay_states_for_email_idx" on "auth"."saml_relay_states" ("for_email");');
    this.addSql('create index "saml_relay_states_sso_provider_id_idx" on "auth"."saml_relay_states" ("sso_provider_id");');

    this.addSql('create table "auth"."schema_migrations" ("version" varchar(255) not null, constraint "schema_migrations_pkey" primary key ("version"));');
    this.addSql('comment on table "auth"."schema_migrations" is \'Auth: Manages updates to the auth system.\';');

    this.addSql('create table "vault"."secrets" ("id" uuid not null default gen_random_uuid(), "name" text null, "description" text not null default \'\', "secret" text not null, "key_id" uuid null default (pgsodium.create_key()).id, "nonce" bytea null default pgsodium.crypto_aead_det_noncegen(), "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, constraint "secrets_pkey" primary key ("id"));');
    this.addSql('comment on table "vault"."secrets" is \'Table with encrypted `secret` column for storing sensitive information on disk.\';');
    this.addSql('alter table "vault"."secrets" add constraint "secrets_name_idx" unique ("name");');

    this.addSql('create table "auth"."sessions" ("id" uuid not null, "user_id" uuid not null, "created_at" timestamptz(6) null, "updated_at" timestamptz(6) null, "factor_id" uuid null, "aal" aal_level null, "not_after" timestamptz(6) null, "refreshed_at" timestamp(6) null, "user_agent" text null, "ip" inet null, "tag" text null, constraint "sessions_pkey" primary key ("id"));');
    this.addSql('comment on table "auth"."sessions" is \'Auth: Stores session data associated to a user.\';');
    this.addSql('comment on column "auth"."sessions"."not_after" is \'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.\';');
    this.addSql('create index "sessions_not_after_idx" on "auth"."sessions" ("not_after");');
    this.addSql('create index "sessions_user_id_idx" on "auth"."sessions" ("user_id");');
    this.addSql('create index "user_id_created_at_idx" on "auth"."sessions" ("user_id", "created_at");');

    this.addSql('create table "auth"."sso_domains" ("id" uuid not null, "sso_provider_id" uuid not null, "domain" text not null, "created_at" timestamptz(6) null, "updated_at" timestamptz(6) null, constraint "sso_domains_pkey" primary key ("id"), constraint domain not empty check (char_length(domain) > 0));');
    this.addSql('comment on table "auth"."sso_domains" is \'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.\';');
    this.addSql('alter table "auth"."sso_domains" add constraint "sso_domains_domain_idx" unique ("lower(domain)");');
    this.addSql('create index "sso_domains_sso_provider_id_idx" on "auth"."sso_domains" ("sso_provider_id");');

    this.addSql('create table "auth"."sso_providers" ("id" uuid not null, "resource_id" text null, "created_at" timestamptz(6) null, "updated_at" timestamptz(6) null, constraint "sso_providers_pkey" primary key ("id"), constraint resource_id not empty check ((resource_id = NULL::text) OR (char_length(resource_id) > 0)));');
    this.addSql('comment on table "auth"."sso_providers" is \'Auth: Manages SSO identity provider information; see saml_providers for SAML.\';');
    this.addSql('comment on column "auth"."sso_providers"."resource_id" is \'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.\';');
    this.addSql('alter table "auth"."sso_providers" add constraint "sso_providers_resource_id_idx" unique ("lower(resource_id)");');

    this.addSql('create table "auth"."users" ("instance_id" uuid null, "id" uuid not null, "aud" varchar(255) null, "role" varchar(255) null, "email" varchar(255) null, "encrypted_password" varchar(255) null, "email_confirmed_at" timestamptz(6) null, "invited_at" timestamptz(6) null, "confirmation_token" varchar(255) null, "confirmation_sent_at" timestamptz(6) null, "recovery_token" varchar(255) null, "recovery_sent_at" timestamptz(6) null, "email_change_token_new" varchar(255) null, "email_change" varchar(255) null, "email_change_sent_at" timestamptz(6) null, "last_sign_in_at" timestamptz(6) null, "raw_app_meta_data" jsonb null, "raw_user_meta_data" jsonb null, "is_super_admin" bool null, "created_at" timestamptz(6) null, "updated_at" timestamptz(6) null, "phone" text null, "phone_confirmed_at" timestamptz(6) null, "phone_change" text null default \'\', "phone_change_token" varchar(255) null default \'\', "phone_change_sent_at" timestamptz(6) null, "confirmed_at" timestamptz(6) generated always as LEAST(email_confirmed_at, phone_confirmed_at) stored null, "email_change_token_current" varchar(255) null default \'\', "email_change_confirm_status" int2 null default 0, "banned_until" timestamptz(6) null, "reauthentication_token" varchar(255) null default \'\', "reauthentication_sent_at" timestamptz(6) null, "is_sso_user" bool not null default false, "deleted_at" timestamptz(6) null, "is_anonymous" bool not null default false, constraint "users_pkey" primary key ("id"), constraint users_email_change_confirm_status_check check ((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)));');
    this.addSql('comment on table "auth"."users" is \'Auth: Stores user login data within a secure schema.\';');
    this.addSql('comment on column "auth"."users"."is_sso_user" is \'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.\';');
    this.addSql('alter table "auth"."users" add constraint "confirmation_token_idx" unique ("confirmation_token");');
    this.addSql('alter table "auth"."users" add constraint "email_change_token_current_idx" unique ("email_change_token_current");');
    this.addSql('alter table "auth"."users" add constraint "email_change_token_new_idx" unique ("email_change_token_new");');
    this.addSql('alter table "auth"."users" add constraint "reauthentication_token_idx" unique ("reauthentication_token");');
    this.addSql('alter table "auth"."users" add constraint "recovery_token_idx" unique ("recovery_token");');
    this.addSql('alter table "auth"."users" add constraint "users_email_partial_key" unique ("email");');
    this.addSql('CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));');
    this.addSql('create index "users_instance_id_idx" on "auth"."users" ("instance_id");');
    this.addSql('create index "users_is_anonymous_idx" on "auth"."users" ("is_anonymous");');
    this.addSql('alter table "auth"."users" add constraint "users_phone_key" unique ("phone");');

    this.addSql('alter table "auth"."identities" add constraint "identities_user_id_fkey" foreign key ("user_id") references "auth"."users" ("id") on update no action on delete cascade;');

    this.addSql('alter table "auth"."mfa_amr_claims" add constraint "mfa_amr_claims_session_id_fkey" foreign key ("session_id") references "auth"."sessions" ("id") on update no action on delete cascade;');

    this.addSql('alter table "auth"."mfa_challenges" add constraint "mfa_challenges_auth_factor_id_fkey" foreign key ("factor_id") references "auth"."mfa_factors" ("id") on update no action on delete cascade;');

    this.addSql('alter table "auth"."mfa_factors" add constraint "mfa_factors_user_id_fkey" foreign key ("user_id") references "auth"."users" ("id") on update no action on delete cascade;');

    this.addSql('alter table "storage"."objects" add constraint "objects_bucketId_fkey" foreign key ("bucket_id") references "storage"."buckets" ("id") on update no action on delete no action;');

    this.addSql('alter table "auth"."refresh_tokens" add constraint "refresh_tokens_session_id_fkey" foreign key ("session_id") references "auth"."sessions" ("id") on update no action on delete cascade;');

    this.addSql('alter table "auth"."saml_providers" add constraint "saml_providers_sso_provider_id_fkey" foreign key ("sso_provider_id") references "auth"."sso_providers" ("id") on update no action on delete cascade;');

    this.addSql('alter table "auth"."saml_relay_states" add constraint "saml_relay_states_flow_state_id_fkey" foreign key ("flow_state_id") references "auth"."flow_state" ("id") on update no action on delete cascade;');
    this.addSql('alter table "auth"."saml_relay_states" add constraint "saml_relay_states_sso_provider_id_fkey" foreign key ("sso_provider_id") references "auth"."sso_providers" ("id") on update no action on delete cascade;');

    this.addSql('alter table "vault"."secrets" add constraint "secrets_key_id_fkey" foreign key ("key_id") references "pgsodium"."key" ("id") on update no action on delete no action;');

    this.addSql('alter table "auth"."sessions" add constraint "sessions_user_id_fkey" foreign key ("user_id") references "auth"."users" ("id") on update no action on delete cascade;');

    this.addSql('alter table "auth"."sso_domains" add constraint "sso_domains_sso_provider_id_fkey" foreign key ("sso_provider_id") references "auth"."sso_providers" ("id") on update no action on delete cascade;');
  }

}
