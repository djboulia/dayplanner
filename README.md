# dayplanner

Generates a PDF page for making daily notes similar to what you would find in a day planner.

There are two main modules:

To generate a notes page with space for todo lists, use app_todo

```
node app_todo mm/dd/yyyy
```

To generate a simple notes page, use app_planner

```
node app_planner mm/dd/yyyy
```

If no parameters are given, todays date is used.

Note that this project depends on PDFKit.
