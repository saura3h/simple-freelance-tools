# Simple Invoices

Invoices and service agreements you run on your own machine. Live demo: https://saurabh.so/simple-invoices

No server, no build step, no account: two HTML files you open in Chrome. Nothing leaves your machine.

It opens on sample data, where every studio, client, bank account and address is made up and nothing you change is saved. The banner at the top switches you to your own data for good; that starts empty and is written to `data/`, which git ignores. To see the sample data again afterwards, add `?mock` to the address.

## Use

1. Open `invoices.html` in Chrome (double-click, or drag it onto Chrome).
2. The left column lists every invoice (drafts on top, then by year). Click one to open it in the preview and the editor on the right. `New` in the Drafts header (or the Export / Domestic toggle above the page, which changes the current invoice) starts a draft from the latest invoice of that kind with the next number; drafts stay in the list until you `Save` or discard them. Unsaved edits on a saved invoice show as a dot on its row and are kept until you save or discard.
3. Most values can be edited on the preview itself: click a number, description, date, invoice number or the total and type in place (Enter or click away to commit, Escape to cancel, Tab to move on). Typing the total works the items out backwards. Fixed / Hourly / Share tabs sit beside the Cost breakdown label, a × appears at the end of a row on hover. Hover a block for its Change link; hover the cost breakdown for the Fixed / Hourly / Share tabs and "+ Add item". Export / Domestic and the due-date presets sit under the dates; currency pills (export only) and the model tabs sit on the Cost breakdown label. There is no separate editor panel any more; the page is the editor.
4. Bill to shows the client as a card; `Change` picks another saved client, adds a new one, or edits/deletes saved ones. Issuer and bank live under the collapsed `From` section with the same Change button.
5. Due date defaults to 30 days after issue and follows the issue date; pick another preset or "Pick a date" in the Due date field. Amounts print with two decimals; the total is rounded to a whole number and a Rounding line shows the difference when there is one.
6. Tax is worked out from the client and shown as a line under the total: outside India means export (no GST), same state as the issuer means CGST 9% + SGST 9%, any other Indian state means IGST 18%. The series (E or D) follows the same rule.
7. Click `Download` above the page, choose "Save as PDF" as the destination. This saves the invoice to history first. The file is named after the invoice number.

`invoices.html?open=D2026-02` opens a specific invoice.

## Where the data lives

Your data lives in `data/` in this folder: `data/invoices.json`, `data/contracts.json` and `data/parties.json` (the
clients and issuer profiles both tools share, readable), plus a matching `.js` file for each, which the pages load with
a plain script tag so the data comes back with no permission and no click, even after Chrome's site data is cleared.
Git ignores all of them.

The browser is not a second copy. Writing to the folder needs Chrome's folder permission (the File System Access API):
pick the `data` folder once via "Store data in a folder" at the top of the list. Anything you save while the folder is
not connected is held in the browser as a buffer and written to the folder the moment it connects, and dropped from the
browser as soon as that write succeeds. So the only thing the browser keeps for long is your unsaved-to-folder work.

Chrome asks for the folder again after a restart, and the prompt offers to allow it on every visit; take that and the
click goes away. The sample data set stores nothing at all.

Everything the browser remembers — the folder, the buffer, the sample-or-own choice — is named after the folder the
page was opened from. Duplicate the project and the copy is a separate workspace: its own `data` folder, its own
buffer, and the sample data on first open. Moving or renaming the folder looks the same way: the copy asks for its
data folder once, and reads `data/` meanwhile.

## Contracts

`contracts.html` makes service agreements with the same list, save and download behaviour as invoices.

1. The left column lists agreements: drafts on top, then saved ones by year of the execution date. Hovering a row shows Edit, which opens that agreement in the editor, and Delete, which asks for a second click. `New agreement` copies the latest saved one and clears the company, scope and fee amounts.
2. An agreement always opens read-only, with the list on the left. `Edit` above the page swaps the list for the editor, and `Back to all agreements` at the top of the editor brings the list back. New and duplicated drafts open straight in the editor. Every clause always prints. The editor holds the execution date, your signing date, the company and consultant, term, scope and fees. The company's signing date prints blank, to be filled in by hand. Focusing a field scrolls the page to where that value prints.
3. Company and Consultant show as small cards. Click a card or `Change` to open a dialog where you pick a saved party, edit it, delete it or add a new one. Saving a party updates this agreement; other agreements keep their own copy.
4. Saved parties are shared with the invoice tool: companies are its clients and consultant profiles are its issuer profiles. Adding or editing one in either tool shows up in the other (reload an already open tab if it hasn't refreshed). Saving an agreement whose company isn't a saved party yet adds it as a client.
5. Fees are Fixed, Hourly or Weekly. Fixed takes a total, optional hours and payment stages. Hourly takes a rate and hours that are exact, a cap, a minimum, a range or ongoing. Weekly takes a rate and weeks, which follow the tenure unless typed, or runs ongoing. Hourly and weekly work is invoiced weekly, every two weeks or monthly. The fees clause rewrites itself for each choice.
6. Late payment interest (1.5% per month), the cure period (30 days) and the arbitration city (Bengaluru) are fixed in the template.
7. Anything blank prints as `[Label]` in blue.
8. Download stays disabled until every value the agreement prints is filled in, the consultant signatory is named, and fixed-fee stages add up to 100%. Hovering the disabled Download button lists what is missing, and printing with Cmd+P shows a note instead of the agreement. Once everything is filled in, Download saves first, then opens the print dialog. The PDF is named like "Service Agreement - Northwind Design Studio and Riya Kapoor". The preview matches the printed pages.

Agreements and parties are stored in localStorage under `scs-contracts-demo`. The agreement wording is the `TEMPLATE` list in the script; the consultant signature and seal is `assets/stamp.svg`.

## Files

- `invoices.html`: the invoice app
- `contracts.html`: the contracts app, with the agreement template at the top of its script
- `assets/logo.png`, `assets/signature.svg`: the default logo and a placeholder signature for invoices. Each issuer profile can upload its own logo and signature (Edit issuer profile), stored in the profile; Reset goes back to these files and Remove prints nothing. The name under the signature is the profile's "Signed by"
- `assets/stamp.svg`: the default signature and seal printed on agreements; each consultant profile can upload its own (Edit consultant profile), and an agreement keeps the copy it was made with
- `shared/parties.js`: the client and issuer lists shared by both apps, with the mock seeds
- `design/`: the shared design system (tokens, base, components, ui.js, the font, and a demo page). See DESIGN.md.
