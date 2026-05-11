import sqlite3
import os

# 1. Define o caminho subindo um nível para encontrar a pasta 'database' na raiz
# '..' sobe de 'database' para 'backend', o segundo '..' sobe de 'backend' para a raiz
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
db_path = os.path.join(base_dir, 'database', 'Chamados.db')

def configurar_e_testar():
    print(f"Alvo: {db_path}")
    
    # Garante que a pasta database existe
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    try:
        # 2. Conecta ao banco (cria o arquivo .db se não existir)
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # 3. Cria a tabela tbl_categorias com a estrutura esperada pelo sistema
        print("Verificando estrutura da tabela...")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tbl_categorias (
                id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL UNIQUE
            )
        ''')
        
        # 4. (Opcional) Insere uma categoria de teste para validação
        cursor.execute("INSERT OR IGNORE INTO tbl_categorias (nome) VALUES ('Suporte Técnico')")
        cursor.execute("INSERT OR IGNORE INTO tbl_categorias (nome) VALUES ('Financeiro')")
        
        conn.commit()
        
        # 5. Consulta para validar
        cursor.execute("SELECT id_categoria, nome FROM tbl_categorias")
        rows = cursor.fetchall()
        
        print("\n[SUCESSO] Tabela pronta. Registros atuais:")
        for row in rows:
            print(f" - ID: {row[0]} | Categoria: {row[1]}")
            
    except Exception as e:
        print(f"\n[ERRO] Falha ao configurar banco: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    configurar_e_testar()