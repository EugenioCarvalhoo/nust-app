# Etapa 1: Build da aplicação
FROM node:20 as builder

# Configurar o diretório de trabalho
WORKDIR /app

# Copiar os arquivos do projeto
COPY package*.json ./
COPY . .

# Instalar dependências e gerar a aplicação
RUN npm install
RUN npm run generate

# Etapa 2: Servir os arquivos com Nginx
FROM nginx:stable-alpine

# Copiar os arquivos estáticos gerados para o diretório padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar uma configuração customizada para o Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Comando de inicialização do Nginx
CMD ["nginx", "-g", "daemon off;"]
