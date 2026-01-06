# Embed Interface Extension

This Airtable interface extension displays your records in an inbox layout where you can view the contents of a URL in an iframe. This can be used to embed popular services like Google Docs and Figma (or even Airtable embeds/forms) directly within an interface.

## Setup

To use this extension, you will need a table with:

* **Label** - A human-readable name for each record. By default, this will use the primary field.
* **URL** - A field containing the URLs you want to render.

Additionally, you can use the properties panel in the Interfaces tab to set the filters and sorting logic for which records will show up.

If the URL you are trying to embed requires authentication, your users will have to be logged into those third party services. For example, if you want to embed a Google Doc, your users must already be logged into Google Docs and have access to that document in order to view the document. This extension does not grant access to documents or files that the user would not already be able to access via the URL.

This is meant to be a basic starting point for more complex use cases.