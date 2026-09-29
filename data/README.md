# data

Your own invoices, agreements, clients and issuer profiles live here, as `invoices.json`, `agreements.json` and
`parties.json`, plus a matching `.js` loader for each. Git ignores all of them.

These files are the only lasting copy: the browser holds work only until it has been written here.

A fresh copy of the product has none of these files and opens on the sample data instead. Choosing "Start creating
your own" in the banner switches to your own data; after that, pick this folder once through "Store data in a folder"
at the top of the list, and both apps keep these files in step with the browser.

To see the sample data again, open the page with `?mock` at the end of the address.

Until you save for the first time, the browser console shows a 404 for `data/invoices.js`, `data/agreements.js`
and `data/parties.js`. That is expected: the pages ask for your data files, and you do not have any yet.
