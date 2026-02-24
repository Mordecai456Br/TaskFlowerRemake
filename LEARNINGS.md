[DATABASE DRIZZLE] Quando trocar o diretório do DB lembrar de alterar no
"out" de drizzle.config.ts o novo path.

[SCRIPTS JSON] Se quiser rodar dois ao mesmo tempo, coloque o primeiro + && + outro script.
exemplo:
    "db:generate": "npx drizzle-kit generate",
    "db:migrate": "npx drizzle-kit migrate",
    "db:generatemigrate": "npx drizzle-kit generate && npx drizzle-kit migrate"

[RELATIONS] Quando se referencia um serial na tabela, deve ser por integer, para
ele nao incrementar.
exemplo:
id: serial('id').primaryKey()
projectId: integer('project_id')