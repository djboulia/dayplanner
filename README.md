# dayplanner
Generates a PDF page for making daily notes similar to what you would find in a day planner.

There are two main modules:

To generate a notes page with space for todo lists, use app_todo
app_todo mm/dd/yyyy

To generate a simple notes page, use app_planner
app_planner mm/dd/yyyy

Note that this project depends on PDFKit.  See my patch to PDFKit to support some of the formatting needed.
