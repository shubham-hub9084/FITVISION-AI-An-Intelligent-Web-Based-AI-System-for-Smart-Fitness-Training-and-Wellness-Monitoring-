import re

file_path = r'c:\Users\sahus\Desktop\Major Project\FITVISION AI\ai-fitness-trainer\backend\database\tracker.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'from contextlib import contextmanager' not in content:
    content = content.replace('from psycopg2.extras import RealDictCursor', 'from psycopg2.extras import RealDictCursor\nfrom contextlib import contextmanager')

helper = '''
    @contextmanager
    def get_cursor(self, commit=False, dict_cursor=False):
        conn = self._conn()
        try:
            if dict_cursor:
                cur = conn.cursor(cursor_factory=RealDictCursor)
            else:
                cur = conn.cursor()
            yield cur
            if commit:
                conn.commit()
        finally:
            cur.close()
            conn.close()
'''
if 'def get_cursor' not in content:
    content = content.replace('def _conn(self):\n        return get_connection()', 'def _conn(self):\n        return get_connection()\n' + helper)

write_pattern = re.compile(r'conn = self\._conn\(\)\s+cur = conn\.cursor\(\)\s+(.*?)\s+conn\.commit\(\)\s+cur\.close\(\)\s+conn\.close\(\)', re.DOTALL)
def write_repl(m):
    body = m.group(1)
    body_indented = '\n'.join('    ' + line for line in body.split('\n'))
    return f'with self.get_cursor(commit=True) as cur:\n{body_indented}'

read_dict_pattern = re.compile(r'conn = self\._conn\(\)\s+cur = conn\.cursor\(cursor_factory=RealDictCursor\)\s+(.*?)\s+cur\.close\(\);\s*conn\.close\(\)', re.DOTALL)
def read_dict_repl(m):
    body = m.group(1)
    body_indented = '\n'.join('    ' + line for line in body.split('\n'))
    return f'with self.get_cursor(dict_cursor=True) as cur:\n{body_indented}'

read_norm_pattern = re.compile(r'conn = self\._conn\(\)\s+cur = conn\.cursor\(\)\s+(.*?)\s+cur\.close\(\);\s*conn\.close\(\)', re.DOTALL)
def read_norm_repl(m):
    body = m.group(1)
    body_indented = '\n'.join('    ' + line for line in body.split('\n'))
    return f'with self.get_cursor() as cur:\n{body_indented}'

read_norm_pattern2 = re.compile(r'conn = self\._conn\(\)\s+cur = conn\.cursor\(\)\s+(.*?)\s+cur\.close\(\)\s*conn\.close\(\)', re.DOTALL)
def read_norm_repl2(m):
    body = m.group(1)
    body_indented = '\n'.join('    ' + line for line in body.split('\n'))
    return f'with self.get_cursor() as cur:\n{body_indented}'

# Also handle get_streaks which has custom close formatting
read_norm_pattern3 = re.compile(r'cur\.execute\(f"SELECT DISTINCT DATE\(completed_at\) FROM workouts\{clause\} ORDER BY DATE\(completed_at\) DESC", p\)\s+dates = \[r\[0\] for r in cur\.fetchall\(\)\]\s+cur\.close\(\); conn\.close\(\)', re.DOTALL)
def read_norm_repl3(m):
    return 'cur.execute(f"SELECT DISTINCT DATE(completed_at) FROM workouts{clause} ORDER BY DATE(completed_at) DESC", p)\n        dates = [r[0] for r in cur.fetchall()]'

content = read_norm_pattern3.sub(read_norm_repl3, content)

content = write_pattern.sub(write_repl, content)
content = read_dict_pattern.sub(read_dict_repl, content)
content = read_norm_pattern.sub(read_norm_repl, content)
content = read_norm_pattern2.sub(read_norm_repl2, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Refactoring complete.')
