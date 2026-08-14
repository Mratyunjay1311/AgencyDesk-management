# DESIGN.md — AgencyDesk

## How the schema enforces tenant isolation

Every tenant-owned collection (Client, Project, Task, Comment, File,
TimeEntry, Invite) carries a required, indexed `agencyId` field.
Critically, this field is **denormalized onto child documents** even
when it could be derived by following a reference chain — for
example, `Task.agencyId` is stored directly, even though it could
technically be found via `Task.projectId -> Project.agencyId`. This
means every query for tenant data filters directly on `agencyId`
with zero joins, so a bug in one feature's logic (say, Project
access) can never accidentally leak a Task, Comment, or File from
another agency. Isolation isn't something the application "remembers"
to do on each route — it's baked into how every document is shaped
and queried.

On the API side, `req.auth.agencyId` is set exclusively inside the
`requireSession` middleware, from a JWT the server itself signed
after verifying a real Membership record. It is never read from
`req.body`, `req.query`, or `req.params`. Every controller queries
using `{ ...filter, agencyId: req.auth.agencyId }`, so even a
correctly-authenticated user cannot access another agency's data by
guessing or supplying a different ID anywhere in the request.

## How a client is blocked from internal content

Task, Comment, and File all carry the same `clientVisible: Boolean`
flag, and the rule is applied consistently everywhere: any query run
on behalf of a `client_user` role includes `clientVisible: true`
directly in the MongoDB filter (e.g. `Task.findOne({..., clientVisible:
true})`), not as a post-fetch check in JavaScript. This means a
hidden document never exists in server memory in the first place for
a client request — there's no code path (list view, single-item
fetch, or comment thread) where the check can be forgotten, since
it's structurally part of the query itself rather than a conditional
added after the fact.

## How the identity model supports one person across two agencies

`User` holds only identity (email + password hash) — no role and no
agencyId. The relationship between a person and an agency lives in a
separate `Membership` collection, with a unique compound index on
`{userId, agencyId}`. A single User can have multiple Memberships,
each with its own role (and, for `client_user`, its own `clientId`).
Login is a two-step process: step 1 verifies credentials and returns
the list of that user's active Memberships as a short-lived identity
token; step 2 takes a chosen `membershipId`, re-verifies it belongs
to that user server-side, and issues a full session JWT scoped to
exactly one `{agencyId, role, clientId}` combination. The session
token never contains more than one agency's context, so the same
person can hold an `agency_member` session at one company and a
`client_user` session at another without the two ever mixing.

## Edge case I'm proud of: invite races

Two guarantees make double-invites and double-accepts impossible:

1. A partial unique index on `Invite` — `{agencyId, email}` unique
   only while `status: "pending"` — means "resending" an invite is
   implemented as an atomic `findOneAndUpdate` upsert on that same
   key, which refreshes the token/expiry of the existing pending
   invite instead of creating a second one.
2. Accepting an invite is a single atomic
   `findOneAndUpdate({token, status: "pending"}, {status: "accepted"})`.
   If two accept requests race for the same token, only the first to
   reach MongoDB finds a document with `status: "pending"` and flips
   it; the second finds nothing and is rejected — so no duplicate
   User or Membership can ever be created from a race.
