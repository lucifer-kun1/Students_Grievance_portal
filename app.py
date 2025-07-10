
from flask import Flask, render_template, request, redirect, session, url_for, send_from_directory
from datetime import datetime, timedelta
import sqlite3, os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'your_secret_key'
DB_NAME = 'complaints.db'
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as db:
        db.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'student', department TEXT)")
        db.execute("CREATE TABLE IF NOT EXISTS complaints (id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER, title TEXT, description TEXT, department TEXT, file_path TEXT, status TEXT DEFAULT 'Pending', created_at TEXT, escalated INTEGER DEFAULT 0)")

if not os.path.exists(DB_NAME):
    init_db()

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        with get_db() as db:
            try:
                db.execute("INSERT INTO users (name, email, password, department, role) VALUES (?, ?, ?, ?, ?)",
                           (request.form['name'], request.form['email'], request.form['password'], request.form['department'], 'student'))
                db.commit()
                return redirect('/')
            except:
                return "Email already registered."
    return render_template('register.html')

@app.route('/login', methods=['POST'])
def login():
    with get_db() as db:
        user = db.execute("SELECT * FROM users WHERE email=? AND password=?",
                          (request.form['email'], request.form['password'])).fetchone()
        if user:
            session['user_id'] = user['id']
            session['role'] = user['role']
            session['department'] = user['department']
            return redirect('/dashboard')
        return "Invalid credentials"

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect('/')
    with get_db() as db:
        if session['role'] == 'student':
            complaints = db.execute("SELECT * FROM complaints WHERE student_id=?", (session['user_id'],)).fetchall()
        elif session['role'] == 'admin':
            complaints = db.execute("SELECT * FROM complaints WHERE status='Pending' OR status='Escalated' OR escalated=1").fetchall()
    return render_template('dashboard.html', complaints=complaints)

@app.route('/complaint/new', methods=['GET', 'POST'])
def new_complaint():
    if 'user_id' not in session:
        return redirect('/')
    if request.method == 'POST':
        filename = None
        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        with get_db() as db:
            db.execute("INSERT INTO complaints (student_id, title, description, department, file_path, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                       (session['user_id'], request.form['title'], request.form['description'],
                        request.form['department'], filename, datetime.now().strftime('%Y-%m-%d %H:%M:%S')))
            db.commit()
        return redirect('/dashboard')
    return render_template('complaint_form.html')

@app.route('/admin/update/<int:cid>', methods=['POST'])
def update_status(cid):
    if session.get('role') != 'admin':
        return "Unauthorized"
    with get_db() as db:
        db.execute("UPDATE complaints SET status=? WHERE id=?", (request.form['status'], cid))
        db.commit()
    return redirect('/dashboard')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

@app.route('/run_escalation')
def run_escalation():
    with get_db() as db:
        threshold = datetime.now() - timedelta(days=3)
        complaints = db.execute("SELECT * FROM complaints WHERE status='Pending' AND escalated=0").fetchall()
        for c in complaints:
            created_at = datetime.strptime(c['created_at'], '%Y-%m-%d %H:%M:%S')
            if created_at < threshold:
                db.execute("UPDATE complaints SET escalated=1 WHERE id=?", (c['id'],))
        db.commit()
    return "Escalation complete."

if __name__ == '__main__':
    app.run(debug=True)
