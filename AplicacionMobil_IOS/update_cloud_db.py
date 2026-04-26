import pymysql

# Connect to the cloud database
connection = pymysql.connect(
    host='shuttle.proxy.rlwy.net',
    user='root',
    password='tKBxyDwjCKqJvgkNkrrSNnwjBQGxBkTl',
    port=40766
)

def run_sql_file(filename):
    print(f"Running {filename}...")
    with open(filename, 'r') as f:
        sql = f.read()
    
    # Split by semicolon but ignore semicolons inside comments or strings (basic split)
    # Since these are my scripts, they are well formatted.
    commands = sql.split(';')
    
    with connection.cursor() as cursor:
        for command in commands:
            cmd = command.strip()
            if cmd and not cmd.startswith('--'):
                try:
                    cursor.execute(cmd)
                except Exception as e:
                    print(f"Error in command: {cmd[:50]}...")
                    print(f"Error detail: {e}")

try:
    run_sql_file('/Users/xcode/Documents/sadasdassdasdasdasdasdasd/Asynchronous/AplicacionMobil_IOS/db_schema.sql')
    connection.commit()
    print("Schema executed successfully.")
    
    run_sql_file('/Users/xcode/Documents/sadasdassdasdasdasdasdasd/Asynchronous/AplicacionMobil_IOS/seed_data.sql')
    connection.commit()
    print("Seed data executed successfully.")
    
finally:
    connection.close()
