import pymysql

# Connect to the database
connection = pymysql.connect(
    host='shuttle.proxy.rlwy.net',
    user='root',
    password='zYNTuBTpbBXIxahNutOzJTzvMdHBFTYx',
    port=49382
)

try:
    with connection.cursor() as cursor:
        cursor.execute("SHOW DATABASES;")
        databases = cursor.fetchall()
        print("Databases in Railway:")
        for db in databases:
            print("-", db[0])
            
finally:
    connection.close()
