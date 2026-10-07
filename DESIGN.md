# Design

The language behind the invoice tool, written down so the next product uses the same one. The files in `design/` implement it; this page says why.

## The idea

The interface is text. Not text-heavy, text: there are no buttons, cards, badges, or icons in the sense most apps mean. A control is a word. State is shown by making the word lighter or underlining it. Structure is shown by spacing and hairlines, not boxes. The one place with real visual weight is the document itself (the invoice), and everything around it gets out of its way.

This works because the products this is for have one user who already knows what the words mean. It would not work for a public app.

## Type

One setting for the whole UI, on `body`, inherited by everything including native controls:

Instrument Sans (variable), `wdth` 96, weight 450, 14px on 22px, 0.3px tracking, colour #121212.

Nothing in the chrome is bigger, smaller, bolder, or a different colour. Emphasis is the primary or secondary text colour (see below). Headings are the same size as body, in secondary. The only exceptions are inside documents, which set their own ramp in points and are scaled for the screen.

If you find yourself wanting a second size, ask whether spacing would do it. It usually does.

## Colour

Ink #121212 on white. Text comes in three colours, all made from that ink:

- Primary (`--ink-primary`, full ink): what you read and act on. Body text, primary buttons, the chosen tab, a hovered or selected row.
- Secondary (`--ink-secondary`, ink at 45%): labels, hints, list sub-lines, headers, unselected tabs, secondary buttons before hover.
- Disabled (`--ink-disabled`, ink at 35%): disabled buttons and inputs.

Hover moves secondary to primary. Selection is primary text. In lists and pickers names are always primary: hover shows a secondary underline, selection a primary one; the chosen date gets the same primary underline; tabs have no underline. Opacity is only used to hide and show things (row actions appear on row hover), never to set a level.
- Lines: #ededed (`--line`), 1px. Stronger #d6d6d9 for separators like the tab slash and hover underlines.
- Danger has a colour token but nothing uses it; destructive actions are confirmed by a second click, not by red.
- The accent (#1855e4) exists for documents. The UI never uses it.

Deriving the three from `--ink` means everything stays one ink, and an inverted surface gets matching colours by redefining `--ink` and `--dim`.

## Buttons

A button is a word. No border, fill, height, or icon. There are two kinds. A primary button (`.btn`) is primary text and underlines on hover (Save, Download, Add new). A secondary button (`.btn.secondary`) is secondary text and goes primary with an underline on hover (row actions, Edit and Delete in pickers, reorder carets); use it for actions that belong to an item rather than to the screen. Disabled is the disabled colour with no underline. The main action on a screen is the last one in its row.

Actions in a row are 1.2em apart (`.actions`). Alternatives, whether a mode switch or a set of presets, are one component (`.tabs`, which wraps when it runs out of room). They are 0.35em apart with a `/` in `--line-strong` between them, so a row of words reads as one control. The chosen one is primary with no underline and does not respond to clicks, the rest secondary; the selected tab does not change weight.

Row actions (Edit, Delete on a list row) are hidden until the row is hovered, then secondary, then primary on their own hover.

## Confirmation

No browser dialogs. A destructive button arms on first click ("Delete" becomes "Confirm delete", primary) and acts on the second. Moving the pointer off the row disarms it. `ui.confirmClick` does this.

Discarding unsaved edits does not confirm at all; it just happens, with a toast saying so.

## Lists

Rows are plain text blocks separated by padding, not lines, indented 8px from their group header, like the empty state under a header. The first line is the name, in primary; hovering fades in a secondary underline, and the selected row's name has a primary underline. The lines under it stay secondary. Group headers ("2026", "Drafts") are secondary text with more space above them; a header that carries a button keeps the button primary.

Rows animate: new ones grow in from zero height (320ms, ease-out, text fading in slightly after); removed ones collapse upward (280ms, ease-in) before the state changes. `ui.rowIn` / `ui.rowOut`.

Empty states are one line in the disabled colour ("No drafts yet", "Nothing saved yet"), or on a document a secondary text link that creates the thing ("Add client"). A list's main action ("New invoice", "New agreement") sits at its top left, above the groups.

## Panels

Dialogs are white with no border, 3px radius, 20px padding, no shadow. Popovers, the date picker, tooltips, and toasts are inverted: white text on #121212, no border. Popovers and the date picker have 16px padding (`--pad-pop`); toasts and tooltips 4px by 10px (`--pad-chip`). They redefine the colour and dimming tokens locally (`.pop`, `.toast`, or `.inverse` on anything new), so everything inside flips on its own. The inverse values keep the same contrast against #121212 that the default ones have against white: lines are darker greys, and secondary and disabled mix less ink, because white dimmed on black stays brighter than black dimmed on white. Secondary is the exception: an exact match (33%) read too faint, so inverted secondary is 40%. Never hardcode an opacity or grey in a component; use a token so the inverted version stays matched. The page behind a dialog is greyed to 50% and blurred 1px. Titles are body text. Close is a word in the corner. Footers hold text actions; "Add new" sits left, Back / Save sit right.

Pickers inside dialogs are lists as above: no dividers, names primary with a secondary underline on hover, current item with a primary underline, Edit and Delete on hover.

Tooltips look like the toast: inverted, no border, 3px radius, body text. They appear the moment the pointer is over the control, with no delay and no fade, below it and right-aligned. Use them only to explain why a control is disabled; never for something the user needs to read to act (`.tip`, `data-tip`).

The date picker is a drawn month grid in the same type: month name with 12px bold Phosphor carets to move, weekday letters in the disabled colour, days in secondary going primary with a secondary underline on hover, today primary, the chosen day primary and underlined, days before an optional minimum (`min`, e.g. the issue date for a due date) in the disabled colour and not clickable. Presets ("7d") are tabs above it, short enough to fit on one line, separated from the month by a `--line` hairline (`.pop-sep`).

## Inputs

Filled, not outlined: a #f8f8f8 background (`--fill`), no border, 3px radius, 30px tall without a label, 6px padding left and right. The fill darkens a step on hover (`--fill-hover`, #f4f4f4) and goes back to the resting fill while typing; no focus ring. Disabled inputs drop to the lightest fill (`--soft`) with the disabled text colour. Labels are secondary text inside the box, top-left, with the value directly below it; a labelled box is 52px tall. A label over something that isn't a box (a list of stages) sits 2px above it. Textareas the same, and they can't be resized shorter than one line of value. Key/value rows get reorder carets and an × on the right, secondary until hovered. Image fields (`ui.imagePicker`, `.imgpick`) are a label, a filled preview box the height of a labelled input, and Upload / Replace / Remove / Reset as small secondary buttons under it.

In documents, values are edited in place: the text itself is contenteditable, a caret appears on click, nothing moves or changes size. Enter commits, Escape reverts, Tab moves to the next field. Hovering or editing a value shows a filled container in the input hover colour (`--fill-hover`), with 2px padding left and right and none above or below; a matching negative margin keeps the text in place. Nothing prints.

## Motion

- Switching to a different document: the current one fades out in place, the next fades in while rising 32px into place (`ui.swapSlide`).
- Refreshing content in place: 150ms opacity fade out, change, fade in (`ui.swapFade`).
- List rows: see Lists.
- Hover states fade over 120ms (`--t-hover`): text colour on buttons, tabs and rows, opacity where something appears, fill on inputs. Underlines are instant.

Nothing else slides, and nothing scales or bounces.

## Layout

Two columns: a 300px list on the left, content on the right. A product whose sidebar holds an editor can be wider; agreements uses 324px. White throughout, no line between them. No visible scrollbars anywhere; areas still scroll. The content column's toolbar (mode tabs left, actions right) is the same width as the document and scrolls with it.

A product whose document is read-only opens it in a view mode. An Edit button sits where the mode tabs would be, and editing swaps the list for the editor in the same column, which is 300px wide in both modes, with "Back to all agreements" at its top. Section titles in the editor are dimmed text with their action on the right, like list headers. The document scales down to fit, up to the 14px screen size.

## Sample data

Both products open on sample data built into their seeds and show a banner flush across the top of the window: one line saying nothing is saved and a primary button that switches to the reader's own data for good, with a hairline the full width under it (`.banner`, 57px tall, hidden in print). The app below it starts under the banner. The sample set is never written to storage or to the data folder, so it cannot mix with real data; `?mock` in the address brings it back. Everything the browser keeps is named after the folder the page was opened from, so two copies of a product never share a data folder or a buffer. See `shared/dataset.js`.

## Small screens

These are desktop tools and they say so. A phone or a portrait tablet gets one screen: the 8px mark and a line explaining that the document is shown at full size next to the list, which a phone cannot do. The app itself is not rendered.

A tool opts in with `class="desktop-only"` on its body and a `.small-screen` block as the first child; the rule hides every other child of the body. The threshold is any screen under 720px, plus any touch screen under 1024px, so a phone in landscape is covered and a large touch laptop is not. The home page is plain text and links, so it has no notice and works anywhere.

## Icons

Six, from Phosphor: regular `x`, `caret-up`, `caret-down`; bold `caret-down` for selects and bold `caret-left` / `caret-right` for the date picker. Two sizes only: 16px (the default) and 12px (`xs`). A 12px icon is always the bold variant; `ui.icon` swaps it in and warns if a bold path is missing. No 14px or other sizes. currentColor, dimmed until hovered. If a control needs an icon to be understood, it should probably be a word instead.

## Files

- `design/tokens.css`: the values above as custom properties, plus the font.
- `design/base.css`: resets, hidden scrollbars, the `body` type setting, control inheritance.
- `design/components.css`: `.btn`, `.tabs`, `.list-h` / `.row`, `.field` / `.in` / `.kvrow` / `.imgpick`, `.ed`, `dialog` / `.pop` / `.pick`, `.cal-*`, `.tip`, `.toast`, `.fade`.
- `design/ui.js`: `el`, `icon`, `toast`, `confirmClick`, `swapFade`, `rowIn` / `rowOut`, `dialog`, `popover`, `datePicker`, `inlineEdit`, date helpers. Plain script, sets `window.ui`.
- `design/store.js`: keeps an app's JSON state in a folder the user picks (File System Access API), alongside localStorage. `store.attach({ file, get, set, adopt })` returns `sync`, `save`, and `bar` for the one-line status link at the top of a list.
- `design/favicon.svg`: the tab icon, a small ink square on white, shared by every product.
- `design/demo.html`: every component on one page. Open it to see the system; edit it when you add something.

A new product includes the three stylesheets and `ui.js`, sets its own layout, and writes its own document styles if it has a document. It should not need to override anything in `components.css`; if it does, the change belongs in the system.

## Do and don't

Do: use words, use the three text colours, use space. Confirm in place. Animate height and opacity only.

Don't: add a second font size, a grey text colour, a bordered button, a shadow, an icon-only button, a red delete, a browser `confirm()`, a spinner.
