---
title: "Mail Server Debian 10: Panduan Lengkap Postfix, Dovecot, dan Webmail Roundcube"
description: Bangun mail server lengkap di Debian 10 — dari instalasi Postfix
  sebagai MTA (SMTP), Dovecot sebagai IMAP/POP3, hingga Roundcube sebagai
  webmail client. Disertai konfigurasi SSL, virtual domains, spam filtering,
  dan troubleshooting.
pubDate: 2026-06-25T11:00:00.000Z
image: /image/debian10-server-cover.svg
draft: false
categories:
  - Teknologi
tags:
  - Debian
  - MailServer
  - Postfix
  - Dovecot
  - Roundcube
  - Webmail
  - Linux
  - SysAdmin
---

Email adalah layanan paling tua di internet — dan tetap menjadi tulang punggung komunikasi bisnis. Dengan **Postfix**, **Dovecot**, dan **Roundcube**, kamu bisa membangun mail server profesional di Debian 10.

## Arsitektur Mail Server

```
Pengirim → [SMTP: Postfix] → Internet → [SMTP: Postfix] → [Dovecot] → Penerima
                                           ↓
                                    [Roundcube Webmail]
```

| Komponen | Protokol | Port | Peran |
|----------|----------|------|-------|
| **Postfix** | SMTP | 25, 587 | Mengirim & menerima email antar server |
| **Dovecot** | IMAP/POP3 | 143, 993 | Menyimpan email & akses user |
| **Roundcube** | HTTP/HTTPS | 80, 443 | Web interface untuk user |
| **MariaDB** | - | 3306 | Database user, alias, domain |

## Instalasi Postfix (SMTP)

```bash
apt update

# Install Postfix + MariaDB
apt install postfix postfix-mysql mariadb-server -y

# Pilih: "Internet Site"
# System mail name: ngopidulur.local
```

### Konfigurasi Database untuk Virtual Users

```sql
CREATE DATABASE postfix;
CREATE USER 'postfix'@'localhost' IDENTIFIED BY 'password_kuat';
GRANT ALL ON postfix.* TO 'postfix'@'localhost';
FLUSH PRIVILEGES;

USE postfix;

-- Tabel virtual domains
CREATE TABLE virtual_domains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Tabel virtual users
CREATE TABLE virtual_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain_id INT,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(150) NOT NULL,
    FOREIGN KEY (domain_id) REFERENCES virtual_domains(id)
);

-- Tabel virtual aliases
CREATE TABLE virtual_aliases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain_id INT,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    FOREIGN KEY (domain_id) REFERENCES virtual_domains(id)
);

-- Insert domain
INSERT INTO virtual_domains (name) VALUES ('ngopidulur.local');

-- Insert user
INSERT INTO virtual_users (domain_id, email, password)
VALUES (1, 'admin@ngopidulur.local', 
    ENCRYPT('password123', CONCAT('$6$', SUBSTRING(SHA(RAND()), -16))));
```

### Konfigurasi Postfix untuk Virtual Users

`/etc/postfix/main.cf` (tambahkan):

```
# Virtual mailbox settings
virtual_mailbox_domains = mysql:/etc/postfix/mysql-virtual-domains.cf
virtual_mailbox_maps = mysql:/etc/postfix/mysql-virtual-users.cf
virtual_alias_maps = mysql:/etc/postfix/mysql-virtual-aliases.cf

virtual_mailbox_base = /var/mail/vhosts
virtual_uid_maps = static:5000
virtual_gid_maps = static:5000

# Security
smtpd_tls_security_level = may
smtpd_tls_cert_file = /etc/ssl/certs/mailserver.crt
smtpd_tls_key_file = /etc/ssl/private/mailserver.key

# Authentication
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes
```

Buat file konfigurasi MySQL:

`/etc/postfix/mysql-virtual-domains.cf`:

```
user = postfix
password = password_kuat
hosts = 127.0.0.1
dbname = postfix
query = SELECT 1 FROM virtual_domains WHERE name='%s'
```

`/etc/postfix/mysql-virtual-users.cf`:

```
user = postfix
password = password_kuat
hosts = 127.0.0.1
dbname = postfix
query = SELECT 1 FROM virtual_users WHERE email='%s'
```

## Instalasi Dovecot (IMAP/POP3)

```bash
apt install dovecot-core dovecot-imapd dovecot-pop3d \
  dovecot-mysql dovecot-lmtpd -y
```

### Konfigurasi Dovecot

`/etc/dovecot/dovecot.conf`:

```
protocols = imap pop3 lmtp
listen = *
mail_location = maildir:/var/mail/vhosts/%d/%n
```

`/etc/dovecot/conf.d/10-auth.conf`:

```
disable_plaintext_auth = no
auth_mechanisms = plain login
!include auth-sql.conf.ext
```

`/etc/dovecot/conf.d/auth-sql.conf.ext`:

```
passdb {
    driver = sql
    args = /etc/dovecot/dovecot-sql.conf.ext
}

userdb {
    driver = static
    args = uid=5000 gid=5000 home=/var/mail/vhosts/%d/%n
}
```

`/etc/dovecot/dovecot-sql.conf.ext`:

```
driver = mysql
connect = host=127.0.0.1 dbname=postfix user=postfix password=password_kuat
default_pass_scheme = SHA512-CRYPT

password_query = SELECT email as user, password \
    FROM virtual_users WHERE email='%u'
```

Setup mail directories:

```bash
mkdir -p /var/mail/vhosts/ngopidulur.local
chown -R 5000:5000 /var/mail/vhosts
```

Restart services:

```bash
systemctl restart postfix dovecot
```

## Instalasi Roundcube Webmail

```bash
# Install dependencies
apt install apache2 php php-mysql php-intl php-mbstring \
  php-json php-xml php-curl php-zip -y

# Download Roundcube
wget https://github.com/roundcube/roundcubemail/releases/download/1.4.13/roundcubemail-1.4.13-complete.tar.gz
tar -xzf roundcubemail-1.4.13-complete.tar.gz
mv roundcubemail-1.4.13 /var/www/roundcube
chown -R www-data:www-data /var/www/roundcube
```

### Database Roundcube

```sql
CREATE DATABASE roundcube;
CREATE USER 'roundcube'@'localhost' IDENTIFIED BY 'password_rc';
GRANT ALL ON roundcube.* TO 'roundcube'@'localhost';
FLUSH PRIVILEGES;
```

Import schema:

```bash
mysql -u roundcube -p roundcube < /var/www/roundcube/SQL/mysql.initial.sql
```

### Web Server Config

```apache
<VirtualHost *:80>
    ServerName webmail.ngopidulur.local
    DocumentRoot /var/www/roundcube

    <Directory /var/www/roundcube>
        Options -Indexes
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Buka `http://webmail.ngopidulur.local/installer` → ikuti wizard → setelah selesai, **hapus folder installer**:

```bash
rm -rf /var/www/roundcube/installer
```

## Tes Mail Server

```bash
# Test SMTP (kirim email)
echo "Test email body" | mail -s "Test Subject" admin@ngopidulur.local

# Test lewat telnet
telnet localhost 25
EHLO test.com
MAIL FROM: sender@ngopidulur.local
RCPT TO: admin@ngopidulur.local
DATA
Subject: Test Email
Hello World
.
QUIT

# Cek log
tail -f /var/log/mail.log
```

## Keamanan Mail Server

```bash
# Firewall
ufw allow 25/tcp     # SMTP
ufw allow 587/tcp    # SMTP submission
ufw allow 993/tcp    # IMAPS
ufw allow 995/tcp    # POP3S

# Anti-spam (SpamAssassin)
apt install spamassassin spamc -y
systemctl enable spamassassin

# SPF, DKIM, DMARC
# Konfigurasi di DNS untuk mencegah spoofing
```

## Troubleshooting

| Masalah | Perintah | Solusi |
|---------|----------|--------|
| Email tidak terkirim | `mailq` (lihat queue) | Cek postfix config, network |
| Email tidak diterima | `tail -f /var/log/mail.log` | Cek MX record, firewall |
| Login Roundcube gagal | Cek `/var/log/roundcube/errors.log` | Cek password, auth config |
| Dovecot tidak start | `dovecot -n` (test config) | Cek syntax, permission |

## Kesimpulan

Mail server lengkap di Debian 10 terdiri dari tiga komponen: **Postfix** untuk SMTP, **Dovecot** untuk IMAP, dan **Roundcube** untuk webmail. Dengan virtual users di MariaDB, kamu bisa mengelola banyak domain dan user dengan mudah.

Di artikel selanjutnya: **File Sharing & Monitoring Server** — Samba, NFS, FTP, dan Netdata.

---

*Referensi: Pramudika, A. Debian 10 Server Administration. Postfix/Dovecot Documentation.*
