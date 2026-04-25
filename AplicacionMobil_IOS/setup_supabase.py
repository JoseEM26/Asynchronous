import psycopg2

try:
    conn = psycopg2.connect(
        host="aws-1-us-east-2.pooler.supabase.com",
        port=6543,
        database="postgres",
        user="postgres.dfzsxkqkcwaeckzldswd",
        password="GeocheckDam2"
    )
    cur = conn.cursor()
    
    # 1. Crear tabla
    cur.execute("""
        CREATE TABLE IF NOT EXISTS logs_actividad (
            id SERIAL PRIMARY KEY,
            mensaje TEXT NOT NULL,
            usuario VARCHAR(100),
            tipo VARCHAR(50),
            creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    """)
    
    # 2. Habilitar tiempo real (Realtime)
    # Nota: En Supabase esto se hace agregando la tabla a la publicación 'supabase_realtime'
    cur.execute("ALTER PUBLICATION supabase_realtime ADD TABLE logs_actividad;")
    
    conn.commit()
    print("Tabla 'logs_actividad' creada y Realtime habilitado con éxito.")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals():
        cur.close()
        conn.close()
