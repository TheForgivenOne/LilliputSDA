/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as announcementsMutations from "../announcementsMutations.js";
import type * as announcementsQueries from "../announcementsQueries.js";
import type * as contact from "../contact.js";
import type * as email_send from "../email/send.js";
import type * as email_templates from "../email/templates.js";
import type * as email_testEmail from "../email/testEmail.js";
import type * as env from "../env.js";
import type * as eventsMutations from "../eventsMutations.js";
import type * as eventsQueries from "../eventsQueries.js";
import type * as ministries from "../ministries.js";
import type * as prayerRequests from "../prayerRequests.js";
import type * as staff from "../staff.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  announcementsMutations: typeof announcementsMutations;
  announcementsQueries: typeof announcementsQueries;
  contact: typeof contact;
  "email/send": typeof email_send;
  "email/templates": typeof email_templates;
  "email/testEmail": typeof email_testEmail;
  env: typeof env;
  eventsMutations: typeof eventsMutations;
  eventsQueries: typeof eventsQueries;
  ministries: typeof ministries;
  prayerRequests: typeof prayerRequests;
  staff: typeof staff;
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
