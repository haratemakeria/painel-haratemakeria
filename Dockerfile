# Usa imagem oficial do PHP com Apache
FROM php:8.1-apache

# Habilita reescrita de URL
RUN a2enmod rewrite

# Copia os arquivos da aplicação para o diretório padrão do Apache
COPY . /var/www/html/

# Dá permissões
RUN chown -R www-data:www-data /var/www/html
