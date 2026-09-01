# Corpus Image Upload — Design

Date: 2026-09-01
Status: Approved

## Problem

Superusers need to upload/change a branding image for a corpus, stored in S3
(`s3://cpr-production-document-cache/corpora/<corpus_id>/` in production,
`s3://cpr-staging-document-cache/corpora/<corpus_id>/` in staging), and see
the current image when editing a corpus in the admin UI.

## Key finding: this is already mostly built

Investigation of `navigator-admin-backend` found the backend side of this
feature already exists, tested, and deployed:

- `POST /corpora/{corpus_id}/upload-url` (`app/api/api_v1/routers/corpus.py`,
  `app/service/corpus.py:266-299`) returns a presigned S3 PUT URL plus the
  resulting CDN URL (`CorpusLogoUploadDTO`).
- The S3 key is hardcoded to `corpora/{corpus_id}/logo.png` — fixed, always
  overwrites. This gives us the "most recent upload is correct" behavior for
  free: there is only ever one object at that key.
- The whole `corpora` router is mounted with `Depends(check_user_auth)`, and
  `AUTH_TABLE` requires `AuthAccess.SUPER` for `CORPUS` + `CREATE`/`UPDATE`,
  so `POST /upload-url` is already superuser-gated.
- Infra (`navigator-infra`, `admin_backend/__main__.py`) already grants the
  admin-backend ECS task role `s3:GetObject`/`PutObject`/`DeleteObject`/
  `ListBucket` on `cpr-{stack}-document-cache`, and injects `CACHE_BUCKET`/
  `CDN_URL` env vars per stack.

**Conclusion: no backend or infra changes are required.** This is a
frontend-only feature.

## Explicit decisions (and why)

- **Presigned-URL-to-S3, not body-relay-through-backend.** The existing
  endpoint already does this; reuse over rebuild. Auth is enforced on
  obtaining the presigned URL, which is sufficient — possession of the
  short-lived, single-key-scoped URL is the authorization for the PUT itself.
- **No S3 "folder" creation step on corpus creation.** S3 prefixes come into
  existence automatically on first `PUT`; there is nothing to pre-create.
- **PNG only, reject other types client-side.** The S3 key is fixed to
  `logo.png` and S3 does not transcode bytes, so accepting JPEG without
  client-side re-encoding would produce a file with mismatched
  extension/content. Simplest correct option for a first iteration:
  restrict the file picker to `image/png`, max 2MB, validated client-side
  before any upload attempt.
- **Upload fires immediately on file pick (after a confirm step), not
  deferred to form Save.** Because the S3 key is fixed per corpus, there's
  no orphaned-data risk either way. Gate it with a confirmation dialog
  ("This will replace the existing image immediately and cannot be undone")
  so the immediate, irreversible overwrite isn't a surprise.
- **No separate "view corpus" page** — `Corpus.tsx` already doubles as
  create/edit (`CorpusForm` is always rendered, pre-filled when editing).
  The image preview lives in that same form.
- **Single PR.** The API client function is small (~10 lines) and only
  meaningful paired with the widget that calls it; splitting adds PR
  overhead without reducing review risk.

## Design

### Flow

1. On `CorpusForm.tsx` (edit mode), replace the plain `corpus_image_url` text
   field with an image upload widget.
2. Widget renders the current image (from `corpus_image_url`, loaded via
   `useCorpus`) if set, else a placeholder.
3. User picks a file via a file input restricted to PNG, ≤2MB. Anything else
   is rejected client-side with an inline error, before any network call.
4. A confirm dialog warns that uploading will overwrite the existing image
   immediately and cannot be undone. User can cancel (no-op) or confirm.
5. On confirm:
   - Call new `getUploadUrl(corpusId)` in `src/api/Corpora.ts`, which hits
     `POST /corpora/{id}/upload-url` and returns
     `{ presigned_upload_url, object_cdn_url }`.
   - `PUT` the file bytes directly to `presigned_upload_url` (plain
     `fetch`/axios call outside the app's authenticated `API` instance — no
     auth header, `Content-Type: image/png`).
   - On success: update the form's `corpus_image_url` value to
     `object_cdn_url` and refresh the preview.
   - This S3 write is independent of the corpus form's Save action — once
     the PUT succeeds, S3 already reflects the new image regardless of
     whether the rest of the form is subsequently saved or abandoned.
6. On failure (either the presigned-URL request or the S3 PUT), show an
   inline error and leave `corpus_image_url` untouched.

### Components touched

- `src/api/Corpora.ts` — add
  `getUploadUrl(corpusId: string): Promise<CorpusLogoUploadDTO>`, following
  the existing per-entity API function pattern (`setToken(API)` then
  `API.post(...)`, errors wrapped into `IError`).
- `src/interfaces/Corpus.ts` — add a `CorpusLogoUploadDTO`-equivalent type
  (`presigned_upload_url`, `object_cdn_url`).
- `src/components/forms/CorpusForm.tsx` — replace the
  `corpus_image_url` `TextField` with an upload widget: image preview,
  file input, confirm dialog, upload-in-progress/error state.

### Out of scope for this PR

- JPEG or other format support.
- Any backend or infra change.
- A dedicated read-only "view corpus" page.
- Upload history / multiple images per corpus.

## Testing

- Unit test `getUploadUrl` in `src/api/Corpora.ts` (mock axios, assert
  request shape and error wrapping), following existing tests for
  `createCorpus`/`updateCorpus`.
- Component test for the upload widget in `CorpusForm.tsx`: file type/size
  rejection, confirm-dialog cancel leaves state untouched, successful
  upload updates the preview and form value, failed upload shows an error
  and leaves `corpus_image_url` untouched.
- Manual verification against staging: upload a PNG, confirm it lands at
  `s3://cpr-staging-document-cache/corpora/<corpus_id>/logo.png`, and that
  the CDN URL renders in the form on reload.
