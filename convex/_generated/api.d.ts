/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as announcements_mutations from "../announcements/mutations.js";
import type * as announcements_queries from "../announcements/queries.js";
import type * as contact_mutations from "../contact/mutations.js";
import type * as contact_queries from "../contact/queries.js";
import type * as events_mutations from "../events/mutations.js";
import type * as events_queries from "../events/queries.js";
import type * as lib_auth from "../lib/auth.js";
import type * as media_mutations from "../media/mutations.js";
import type * as media_queries from "../media/queries.js";
import type * as ministries_mutations from "../ministries/mutations.js";
import type * as ministries_queries from "../ministries/queries.js";
import type * as prayerRequests_mutations from "../prayerRequests/mutations.js";
import type * as prayerRequests_queries from "../prayerRequests/queries.js";
import type * as scripture_queries from "../scripture/queries.js";
import type * as seed_index from "../seed/index.js";
import type * as staff_mutations from "../staff/mutations.js";
import type * as staff_queries from "../staff/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "announcements/mutations": typeof announcements_mutations;
  "announcements/queries": typeof announcements_queries;
  "contact/mutations": typeof contact_mutations;
  "contact/queries": typeof contact_queries;
  "events/mutations": typeof events_mutations;
  "events/queries": typeof events_queries;
  "lib/auth": typeof lib_auth;
  "media/mutations": typeof media_mutations;
  "media/queries": typeof media_queries;
  "ministries/mutations": typeof ministries_mutations;
  "ministries/queries": typeof ministries_queries;
  "prayerRequests/mutations": typeof prayerRequests_mutations;
  "prayerRequests/queries": typeof prayerRequests_queries;
  "scripture/queries": typeof scripture_queries;
  "seed/index": typeof seed_index;
  "staff/mutations": typeof staff_mutations;
  "staff/queries": typeof staff_queries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
