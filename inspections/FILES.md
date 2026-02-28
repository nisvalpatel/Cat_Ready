# Inspections App — What Every File Does

Simple English guide to every file in the `inspections` folder. The backend logic for Cat Ready lives here: creating inspections, saving audio and images, turning speech and photos into text, and getting PASS/FAIL/UNSURE from the AI.

---

## `__init__.py`

**What it is:** An empty file.

**What it does:** In Python, a folder is only treated as a "package" (something you can `import`) if it contains an `__init__.py`. This file makes the `inspections` folder a package so Django and your code can do `from inspections.models import ...` or `import inspections.services`. You don’t put logic here; it’s just for package identity.

---

## `apps.py`

**What it is:** Tells Django that this folder is a Django app and what to call it.

**What it does:** Defines `InspectionsConfig`, which Django uses when the app is in `INSTALLED_APPS` in `config/settings.py`. It sets the app’s internal name (`"inspections"`) and the human-readable name shown in the admin ("Inspections"). You rarely change this unless you rename the app or add app-level settings.

---

## `models.py`

**What it is:** The definitions of the data your app stores: one inspection, many steps, and many images per step.

**What it does:**

- **`RESULT_CHOICES`**  
  A list of the only three values a step result can have: PASS, FAIL, UNSURE. Used by the `InspectionStep.result` field so the database and forms stay consistent.

- **`Inspection`**  
  One pre-start inspection run. It has:
  - `vehicle_id` — optional identifier for the vehicle (e.g. truck number).
  - `started_at` — set automatically when the record is created.
  - `completed_at` — left empty until you later mark the inspection finished.  
  Inspections are ordered by `started_at` newest first.

- **`InspectionStep`**  
  One checklist item inside an inspection. It has:
  - `inspection` — which inspection this step belongs to (if you delete the inspection, all its steps are deleted).
  - `step_index` — order of the step (0, 1, 2, …). Together with `inspection`, this must be unique (no duplicate step index per inspection).
  - `step_name` — e.g. "Front left tire".
  - `audio` — the uploaded audio file for this step (optional). Stored under `media/steps/audio/YYYY/MM/DD/`.
  - `transcript` — text from speech-to-text (or empty if no audio / STT failed).
  - `result` — PASS, FAIL, or UNSURE from the LLM.
  - `result_reason` — short explanation from the LLM (e.g. "No issues reported.").
  - `log` — a JSON object with `transcript`, `image_descriptions`, and `llm_raw` so you can structure or inspect the full AI workflow later.
  - `created_at` — when the step was created.

- **`StepImage`**  
  One photo attached to a step. It has:
  - `step` — which step this image belongs to (if you delete the step, its images are deleted).
  - `image` — the uploaded image file. Stored under `media/steps/images/YYYY/MM/DD/`.
  - `created_at` — when the image was uploaded.

So: one inspection has many steps; each step can have one audio file and many images, plus the text and AI result we store.

---

## `views.py`

**What it is:** The HTTP endpoints: what happens when the front end (or a client) calls your API.

**What it does:**

- **`InspectionListCreateView`**  
  - **GET** — Returns a list of inspections (id, vehicle_id, started_at, completed_at) for the most recent 50. Used to show "your inspections" or pick one.
  - **POST** — Creates a new inspection. Body can include optional `vehicle_id`. Returns the new inspection’s id and fields. This is how you "start" an inspection.

- **`InspectionDetailView`**  
  - **GET** — Returns one inspection by id, plus a list of all its steps (step_index, step_name, result, result_reason, log, created_at). Used to show progress or the full log of an inspection.

- **`StepCreateView`**  
  - **POST** — The main "submit one step" endpoint. Expects `multipart/form-data` with:
    - `step_index` (required) — which step number (e.g. 0).
    - `step_name` (optional) — e.g. "Front left tire".
    - `audio` (optional) — one audio file (operator’s voice for this step).
    - `images` or `images[]` (optional) — one or more image files (photos for this step).  
  It finds the inspection by id, creates an `InspectionStep` and saves the audio and images to disk, then calls `process_step` with the file paths. That runs STT, vision, and the LLM. The view then saves the returned transcript, result, result_reason, and log onto the step and returns them in the JSON response. So: upload → save → AI pipeline → save results → respond.

All three views use Django REST framework’s `APIView`, `Response`, and status codes (e.g. 201 Created, 400 Bad Request, 404 Not Found).

---

## `urls.py`

**What it is:** The list of URL paths that point to your views.

**What it does:** Under the `api/` prefix (set in `config/urls.py`), it defines:

- `inspections/` → list or create inspections (`InspectionListCreateView`).
- `inspections/<int:pk>/` → get one inspection (`InspectionDetailView`).
- `inspections/<int:inspection_id>/steps/` → submit a step for that inspection (`StepCreateView`).

So the full URLs are things like `POST /api/inspections/` and `POST /api/inspections/1/steps/`. The `app_name = "inspections"` lets you refer to these routes by name elsewhere (e.g. in tests or reverse URL lookups).

---

## `services.py`

**What it is:** The orchestration layer: it runs the AI pipeline for one step (speech → text, images → text, then text → PASS/FAIL/UNSURE).

**What it does:**

- **`process_step(audio_path, image_paths, step_name)`**  
  - If `audio_path` is given and the file exists, it calls `stt.transcribe(audio_path)` and gets back a single string (the transcript). Otherwise transcript is empty.
  - For each path in `image_paths`, it calls `vision.describe_image(path)` and collects the description strings into a list. If a description is empty, it stores `"(no description)"`.
  - It then calls `llm.evaluate_step(step_name, transcript, image_descriptions)` and gets back a result (PASS/FAIL/UNSURE) and the raw LLM text.
  - It builds a short `result_reason` from the raw text (the part after PASS/FAIL/UNSURE) using `_short_reason`.
  - It builds a `log` dict with `transcript`, `image_descriptions`, and `llm_raw`.
  - It returns `(result, result_reason, log)` so the view can save them and send them in the response.

- **`_short_reason(raw, result)`**  
  A helper that takes the full LLM response and the parsed result (PASS/FAIL/UNSURE). It strips off the leading result word and returns the rest as the "reason" (e.g. "No issues reported."). If there’s nothing after the word or something’s wrong, it returns the full raw string.

So `services.py` does not talk to the database or HTTP; it only coordinates the three AI modules and shapes the result and log.

---

## `admin.py`

**What it is:** Configures how the inspection data looks and behaves in Django’s admin site (`/admin/`).

**What it does:**

- **`StepImageInline`** — When you look at a step in the admin, you see its images in a small table on the same page (add/remove images without opening a separate screen).
- **`InspectionStepInline`** — When you look at an inspection, you see its steps listed inline, with a link to edit each step.
- **`InspectionAdmin`** — For the Inspection model: list view shows id, vehicle_id, started_at, completed_at; editing an inspection also shows its steps inline.
- **`InspectionStepAdmin`** — For InspectionStep: list view shows id, inspection, step_index, step_name, result, created_at; editing a step also shows its images inline.
- **`StepImageAdmin`** — For StepImage: list view shows id, step, created_at.

So you can browse and edit inspections, steps, and images from the admin without using the API.

---

## `stt.py`

**What it is:** Speech-to-text: turn the operator’s audio into written text using OpenAI’s Whisper API.

**What it does:**

- **`transcribe(audio_path)`**  
  - Takes the path to a saved audio file.
  - If there’s no `OPENAI_API_KEY` in settings, returns an empty string (no API call).
  - Otherwise opens the file and sends it to OpenAI’s transcription API (model from `OPENAI_STT_MODEL`, default `whisper-1`).
  - Returns the transcribed text as a single string, or an empty string if something fails (e.g. network error, bad file). It does not raise; failures are swallowed so the rest of the pipeline can still run (e.g. with empty transcript).

So the only job of this file is: one audio file path in, one text string out.

---

## `vision.py`

**What it is:** Image understanding: turn a photo into a short inspection-relevant description using OpenAI’s vision model.

**What it does:**

- **`describe_image(image_path)`**  
  - Takes the path to a saved image file.
  - If there’s no API key or the file doesn’t exist, returns an empty string.
  - Otherwise reads the file, base64-encodes it, and figures out the MIME type from the extension (.jpg, .png, .gif, .webp).
  - Sends the image plus a fixed prompt to the OpenAI chat API with a vision model (`OPENAI_VISION_MODEL`, default `gpt-4o`). The prompt asks for a brief description for a vehicle pre-start inspection: condition, damage, wear, concerns (one or two sentences).
  - Returns that description string, or an empty string on any error.

So: one image path in, one short text description out. The orchestrator calls this once per image and collects all descriptions for the LLM.

---

## `llm.py`

**What it is:** The step evaluator: take the step name, transcript, and image descriptions and ask an LLM to decide PASS, FAIL, or UNSURE.

**What it does:**

- **`VALID_RESULTS`**  
  The only three allowed values: `("PASS", "FAIL", "UNSURE")`.

- **`evaluate_step(step_name, transcript, image_descriptions)`**  
  - If there’s no `OPENAI_API_KEY`, returns `("UNSURE", "No API key configured.")` so the API still responds without crashing.
  - Builds one string of "image notes" from the list of descriptions (or "No images provided." if the list is empty).
  - Builds a prompt that includes: step name, what the operator said (transcript or "(no speech)"), and the image notes. It instructs the model to respond with exactly one word — PASS, FAIL, or UNSURE — and optionally one short reason.
  - Calls the OpenAI chat API (model from `OPENAI_LLM_MODEL`, default `gpt-4o-mini`).
  - Takes the model’s reply and runs `_parse_result(raw)` to get the single result word.
  - Returns `(result, raw)` so the orchestrator can store both the normalized result and the full text in the log. On exception, returns `("UNSURE", str(exception))`.

- **`_parse_result(raw)`**  
  Takes the raw LLM response. Converts to uppercase and looks for the first occurrence of PASS, FAIL, or UNSURE (in that order of checking). Returns that word, or UNSURE if none is found. So even if the model says "PASS. All good." you still get "PASS".

So: step context (name + transcript + image notes) in; PASS/FAIL/UNSURE plus raw text out. No database or HTTP here, only the LLM call and parsing.

---

## `migrations/__init__.py`

**What it is:** An empty file.

**What it does:** Makes `migrations` a Python package. Django expects this so it can treat the folder as the place where migration files live. You don’t edit this.

---

## `migrations/0001_initial.py`

**What it is:** The first database migration for the inspections app: it creates the three tables.

**What it does:** When you run `python manage.py migrate`, Django runs this migration (and any later ones). This one:

- Creates the **Inspection** table (id, vehicle_id, started_at, completed_at) with ordering by `started_at` descending.
- Creates the **InspectionStep** table (id, inspection_id, step_index, step_name, audio, transcript, result, result_reason, created_at) with unique_together on (inspection, step_index) and ordering by inspection then step_index.
- Creates the **StepImage** table (id, image, created_at, step_id).

So after this migration, your database can store inspections, steps, and step images. You don’t normally edit migrations by hand; you change `models.py` and run `makemigrations` to generate new ones.

---

## `migrations/0002_add_step_log.py`

**What it is:** A follow-up migration that adds the `log` field to the step table.

**What it does:** Adds a nullable JSON column `log` to **InspectionStep** so each step can store the full log object (transcript, image_descriptions, llm_raw). This was added after the initial design so we could persist the log for later structuring without changing the rest of the schema.

---

## Summary Table

| File | Role in one sentence |
|------|-----------------------|
| `__init__.py` | Makes `inspections` a Python package. |
| `apps.py` | Registers the app with Django (name, label). |
| `models.py` | Defines Inspection, InspectionStep, StepImage and what’s stored in the DB. |
| `views.py` | HTTP endpoints: create/list inspections, get one inspection, submit a step (audio + images). |
| `urls.py` | Maps URL paths under `/api/` to the three views. |
| `services.py` | Runs STT → vision → LLM for one step and returns result + log. |
| `admin.py` | Configures how inspections, steps, and images appear in Django admin. |
| `stt.py` | Transcribes one audio file to text (Whisper). |
| `vision.py` | Describes one image for inspection (vision model). |
| `llm.py` | Asks LLM for PASS/FAIL/UNSURE from step name + transcript + image notes. |
| `migrations/__init__.py` | Makes `migrations` a package. |
| `migrations/0001_initial.py` | Creates Inspection, InspectionStep, StepImage tables. |
| `migrations/0002_add_step_log.py` | Adds `log` JSONField to InspectionStep. |

If you want a walkthrough of a specific file line by line, say which file and we can go through it.
