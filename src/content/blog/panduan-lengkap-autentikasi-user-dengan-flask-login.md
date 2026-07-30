---
title: Autentikasi User dengan Flask-Login
description: Autentikasi adalah salah satu fitur paling penting dalam hampir
  setiap aplikasi web modern. Tanpa sistem autentikasi yang baik, aplikasi tidak
  bisa membedakan antara user biasa dengan administrator, atau bahkan tidak bisa
  mengingat siapa yang sedang login.
pubDate: 2026-06-06T19:33:00.000Z
image: /image/1_wPtUYc3Ydv9d8qlfMTjwrg.webp
draft: false
categories:
  - Teknologi
tags:
  - flask
  - web-development
  - python
  - login-authentication
series: "Flask Web"
seriesOrder: 3
---
Di artikel ini, kita akan membahas secara mendalam dan praktis cara membangun sistem **autentikasi lengkap** menggunakan Flask, dengan fokus utama pada ekstensi **Flask-Login**. Kita juga akan mengintegrasikan beberapa komponen penting lainnya seperti hashing password, token konfirmasi email, dan proteksi route.

---

## 1. Komponen Utama Autentikasi di Flask

Untuk membangun sistem autentikasi yang solid, kita biasanya membutuhkan:

| Komponen                  | Fungsi                                      | Paket yang Digunakan          |
|---------------------------|---------------------------------------------|-------------------------------|
| Hashing Password          | Menyimpan password secara aman              | Werkzeug (`generate_password_hash`) |
| Session Management        | Mengelola status login user                 | Flask-Login                   |
| Form Handling             | Validasi input login & registrasi           | Flask-WTF                     |
| Token untuk Konfirmasi    | Verifikasi email / reset password           | itsdangerous                  |
| Role & Permission         | Membatasi akses berdasarkan peran user      | Flask-Login + custom logic    |

---

## 2. Persiapan Proyek

Pastikan Anda sudah memiliki struktur proyek Flask yang rapi. Berikut paket yang akan kita gunakan:

```bash
pip install flask flask-sqlalchemy flask-login flask-wtf itsdangerous
```

Struktur folder yang direkomendasikan:

```
myapp/
├── app/
│   ├── __init__.py
│   ├── models.py
│   ├── forms.py
│   ├── views/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── main.py
│   └── templates/
├── config.py
└── run.py
```

---

## 3. Membuat User Model

Model User adalah fondasi dari sistem autentikasi.

### `app/models.py`

```python
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    confirmed = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'
```

**Catatan penting**:
- `UserMixin` dari Flask-Login memberikan method dasar yang dibutuhkan (`is_authenticated`, `is_active`, `is_anonymous`, `get_id`).
- Password **tidak pernah disimpan dalam bentuk plaintext**.

---

## 4. Konfigurasi Flask-Login

### `app/__init__.py`

```python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'auth.login'           # Nama endpoint halaman login
login_manager.login_message_category = 'info'

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    db.init_app(app)
    login_manager.init_app(app)

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    return app
```

### User Loader

Tambahkan di `app/models.py` atau `app/__init__.py`:

```python
from app.models import User

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
```

---

## 5. Membuat Form Autentikasi

### `app/forms.py`

```python
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Length, Email, EqualTo

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Length(1, 64), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Keep me logged in')
    submit = SubmitField('Log In')


class RegistrationForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Length(1, 64), Email()])
    username = StringField('Username', validators=[DataRequired(), Length(1, 64)])
    password = PasswordField('Password', validators=[
        DataRequired(), EqualTo('password2', message='Passwords must match.')
    ])
    password2 = PasswordField('Confirm password', validators=[DataRequired()])
    submit = SubmitField('Register')
```

---

## 6. Membuat Blueprint Autentikasi

### `app/auth/views.py`

```python
from flask import render_template, redirect, request, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from . import auth
from .. import db
from ..models import User
from ..forms import LoginForm, RegistrationForm

@auth.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user is not None and user.verify_password(form.password.data):
            login_user(user, form.remember_me.data)
            next = request.args.get('next')
            if next is None or not next.startswith('/'):
                next = url_for('main.index')
            return redirect(next)
        flash('Invalid username or password.')
    return render_template('auth/login.html', form=form)


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.')
    return redirect(url_for('main.index'))


@auth.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(email=form.email.data,
                    username=form.username.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('You can now login.')
        return redirect(url_for('auth.login'))
    return render_template('auth/register.html', form=form)
```

---

## 7. Melindungi Route dengan `@login_required`

```python
from flask_login import login_required

@main.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')
```

Jika user belum login dan mencoba mengakses halaman ini, Flask-Login akan otomatis mengarahkan ke halaman login (`login_view` yang sudah kita atur).

---

## 8. Konfirmasi Email (Account Confirmation)

Untuk meningkatkan keamanan, biasanya kita meminta user mengkonfirmasi email mereka.

### Membuat Token dengan itsdangerous

```python
from itsdangerous import URLSafeTimedSerializer

def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return serializer.dumps(email, salt=app.config['SECURITY_PASSWORD_SALT'])


def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt=app.config['SECURITY_PASSWORD_SALT'], max_age=expiration)
    except:
        return False
    return email
```

Kemudian buat route untuk konfirmasi dan kirim email berisi link token tersebut.

---

## 9. Best Practices Keamanan

Berikut praktik terbaik yang sangat direkomendasikan:

| Praktik                              | Alasan |
|--------------------------------------|--------|
| Selalu hash password                 | Mencegah password bocor jika database diretas |
| Gunakan `login_required`             | Melindungi halaman sensitif |
| Implementasikan "Remember Me" dengan hati-hati | Gunakan cookie yang aman |
| Batasi percobaan login               | Gunakan Flask-Limiter atau Rate Limiting |
| Gunakan HTTPS di production          | Melindungi data saat transmisi |
| Simpan session di server-side jika memungkinkan | Lebih aman daripada cookie saja |
| Logout user setelah ganti password   | Mencegah session lama tetap aktif |

---

## 10. Struktur File Akhir (Ringkasan)

- `models.py` → User model + password hashing
- `forms.py` → LoginForm dan RegistrationForm
- `auth/views.py` → Blueprint untuk login, logout, register
- `app/__init__.py` → Inisialisasi Flask-Login
- `templates/auth/` → Template login dan register

---

## Kesimpulan

Sistem autentikasi yang baik adalah fondasi keamanan aplikasi web. Dengan menggunakan **Flask-Login** dikombinasikan dengan **Werkzeug** untuk hashing dan **itsdangerous** untuk token, kita bisa membangun sistem autentikasi yang:

- Aman
- Mudah dipelajari
- Scalable
- Sesuai dengan praktik terbaik industri

Autentikasi hanyalah langkah pertama. Di tahap selanjutnya, Anda bisa menambahkan:
- Role-based access control (Admin, User, Moderator)
- OAuth login (Google, GitHub, dll)
- Two-Factor Authentication (2FA)
- Password reset via email
