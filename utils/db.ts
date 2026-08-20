import initSqlJs, { Database } from 'sql.js';

export class LMSDatabase {
  private db!: Database;

  async initSchema(): Promise<void> {
    const SQL = await initSqlJs();
    this.db = new SQL.Database();

    // 1. Buat Tabel LMS
    this.db.run(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      );

      CREATE TABLE courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        passing_grade INTEGER NOT NULL
      );

      CREATE TABLE quiz_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        course_id INTEGER,
        score INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id)
      );

      CREATE TABLE certificates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        course_id INTEGER,
        certificate_code TEXT UNIQUE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id)
      );
    `);
  }

  async seedBaseData(): Promise<void> {
    this.db.run(`INSERT INTO courses (id, title, passing_grade) VALUES (1, 'QA Automation Masterclass', 80)`);
    this.db.run(`INSERT INTO users (id, name, email) VALUES (1, 'Anthony QA', 'anthony@codemi.test')`);
  }

  // Simulasi Backend Logic saat User Submit Quiz
  async submitQuiz(userId: number, courseId: number, score: number): Promise<void> {
    // Ambil passing grade course
    const result = this.db.exec(`SELECT passing_grade FROM courses WHERE id = ${courseId}`);
    const passingGrade = result[0]?.values[0]?.[0] as number;

    // 1. Simpan attempt nilai kuis
    this.db.run(`INSERT INTO quiz_attempts (user_id, course_id, score) VALUES (${userId}, ${courseId}, ${score})`);

    // 2. Logic Backend: Jika nilai >= passing grade, generate sertifikat
    if (passingGrade !== undefined && score >= passingGrade) {
      const certCode = `CERT-LMS-${userId}-${Date.now()}`;
      this.db.run(`INSERT INTO certificates (user_id, course_id, certificate_code) VALUES (${userId}, ${courseId}, '${certCode}')`);
    }
  }

  // Query Verifikasi QA (Mengecek ada sertifikat terbit atau tidak)
  async getCertificatesByUser(userId: number): Promise<any[]> {
    const result = this.db.exec(`SELECT * FROM certificates WHERE user_id = ${userId}`);
    if (result.length === 0) return [];
    
    const columns = result[0].columns;
    return result[0].values.map((row) => {
      const obj: any = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });
  }

  // Query Integritas Data QA (Mencari sertifikat ilegal/anomali yang skornya di bawah standar)
  async findIllegalCertificates(): Promise<any[]> {
    const query = `
      SELECT cert.certificate_code, qa.score, c.passing_grade
      FROM certificates cert
      JOIN quiz_attempts qa ON cert.user_id = qa.user_id AND cert.course_id = qa.course_id
      JOIN courses c ON cert.course_id = c.id
      WHERE qa.score < c.passing_grade
    `;
    const result = this.db.exec(query);
    if (result.length === 0) return [];

    const columns = result[0].columns;
    return result[0].values.map((row) => {
      const obj: any = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });
  }

  close(): void {
    if (this.db) {
      this.db.close();
    }
  }
}
