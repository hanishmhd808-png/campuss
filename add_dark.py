import os
import re

files_to_update = [
    "src/app/dashboard/page.tsx",
    "src/app/admin/page.tsx",
    "src/components/NotificationPopup.tsx",
    "src/components/ProfileSetupModal.tsx",
    "src/components/TeacherSetupModal.tsx"
]

replacements = [
    (r'bg-white', r'bg-white dark:bg-slate-900'),
    (r'text-slate-900', r'text-slate-900 dark:text-white'),
    (r'text-slate-800', r'text-slate-800 dark:text-slate-100'),
    (r'text-slate-700', r'text-slate-700 dark:text-slate-200'),
    (r'text-slate-600', r'text-slate-600 dark:text-slate-300'),
    (r'text-slate-500', r'text-slate-500 dark:text-slate-400'),
    (r'text-slate-400', r'text-slate-400 dark:text-slate-500'),
    (r'border-slate-200', r'border-slate-200 dark:border-slate-800'),
    (r'border-slate-100', r'border-slate-100 dark:border-slate-800'),
    (r'bg-slate-50\b', r'bg-slate-50 dark:bg-slate-950'),
    (r'bg-slate-100\b', r'bg-slate-100 dark:bg-slate-800'),
    (r'bg-slate-200\b', r'bg-slate-200 dark:bg-slate-700'),
    (r'bg-indigo-50\b', r'bg-indigo-50 dark:bg-indigo-900/30'),
    (r'bg-purple-100\b', r'bg-purple-100 dark:bg-purple-900/30'),
    (r'bg-blue-100\b', r'bg-blue-100 dark:bg-blue-900/30'),
    (r'text-purple-700', r'text-purple-700 dark:text-purple-300'),
    (r'text-blue-700', r'text-blue-700 dark:text-blue-300'),
    (r'bg-green-50\b', r'bg-green-50 dark:bg-green-900/30'),
    (r'text-green-700', r'text-green-700 dark:text-green-300'),
    (r'hover:bg-slate-50\b', r'hover:bg-slate-50 dark:hover:bg-slate-800'),
    (r'hover:bg-slate-100\b', r'hover:bg-slate-100 dark:hover:bg-slate-800'),
    (r'hover:bg-slate-200\b', r'hover:bg-slate-200 dark:hover:bg-slate-700'),
    (r'bg-slate-900/50', r'bg-slate-900/50 dark:bg-slate-950/80'),
    (r'border border-slate-200 rounded-xl px-4 py-3', r'border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'),
    (r'border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500', r'border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500')
]

for filepath in files_to_update:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements:
        content = re.sub(old, new, content)
        
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Updated {filepath}")
