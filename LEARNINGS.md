[DATABASE DRIZZLE] Quando trocar o diretório do DB lembrar de alterar no
"out" de drizzle.config.ts o novo path.

[SCRIPTS JSON] Se quiser rodar dois scripts em sequência, coloque o primeiro + && + outro script.
exemplo:
    "db:generate": "npx drizzle-kit generate",
    "db:migrate": "npx drizzle-kit migrate",
    "db:generatemigrate": "npx drizzle-kit generate && npx drizzle-kit migrate"

[RELATIONS] Quando se referencia um serial na tabela, deve ser por integer, para
ele nao incrementar.
exemplo:
id: serial('id').primaryKey()
projectId: integer('project_id')

[MIGRATIONS] Quando for mudar o tipo das tabelas (enum -> tabela relacional), deve
criar uma nova coluna, depois transferir os dados de uma para outra, ai sim, em seguida,
remover. 
Exemplo: Enum com categorias e agora quero categorias_id. Preciso criar e popular a tabela
categorias, buscar e referenciar para trocar os antigos valores. Quando inserido novos
valores, remover.