import os
import re

files_to_update = [
    "src/app/dashboard/page.tsx",
    "src/app/admin/page.tsx",
    "src/components/ProfileSetupModal.tsx",
    "src/components/TeacherSetupModal.tsx"
]

for filepath in files_to_update:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r') as f:
        content = f.read()
    
    # ensure inputs, textareas, selects have dark background and text
    # Look for: rounded-xl px-4 py-3
    # If they don't have bg-white dark:bg-slate-800, add it
    
    content = re.sub(r'(rounded-xl px-4 py-3)(?!.*?bg-white dark:bg-slate-800)', r'\1 bg-white dark:bg-slate-800 dark:text-white', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
