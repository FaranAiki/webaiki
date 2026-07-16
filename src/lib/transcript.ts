export interface Course {
  kode: string;
  mataKuliah: string;
  sifat: string;
  sks: number;
  nilai: string;
  semesterPengambilan: string;
}

export interface SemesterData {
  title: string;
  ip: number;
  sksLulus: number;
  courses: Course[];
}

// TODO: internationalize properly
export const academicTranscript: SemesterData[] = [
  {
    title: "Tahap Persiapan Bersama",
    ip: 3.89,
    sksLulus: 18,
    courses: [
      { kode: "MA1101", mataKuliah: "Matematika I", sifat: "W", sks: 4, nilai: "A", semesterPengambilan: "2025-1" },
      { kode: "FI1101", mataKuliah: "Fisika Dasar I", sifat: "W", sks: 3, nilai: "A", semesterPengambilan: "2025-1" },
      { kode: "KI1101", mataKuliah: "Kimia Dasar I", sifat: "W", sks: 3, nilai: "A", semesterPengambilan: "2025-1" },
      { kode: "WI1101", mataKuliah: "Pancasila", sifat: "W", sks: 2, nilai: "A", semesterPengambilan: "2025-2" },
      { kode: "WI1102", mataKuliah: "Berpikir Komputasional", sifat: "W", sks: 2, nilai: "A", semesterPengambilan: "2025-1" },
      { kode: "WI1103", mataKuliah: "Pengantar Prinsip Keberlanjutan", sifat: "W", sks: 2, nilai: "B", semesterPengambilan: "2025-1" },
      { kode: "WI1111", mataKuliah: "Laboratorium Fisika Dasar", sifat: "W", sks: 1, nilai: "A", semesterPengambilan: "2025-1" },
      { kode: "WI1116", mataKuliah: "Laboratorium Interaksi Komputer", sifat: "W", sks: 1, nilai: "A", semesterPengambilan: "2025-1" }
    ]
  },
  {
    title: "Tahap Sarjana",
    ip: 4.00,
    sksLulus: 18,
    courses: [
      { kode: "II1200", mataKuliah: "Pengantar Sistem dan Teknologi Informasi", sifat: "W", sks: 3, nilai: "A", semesterPengambilan: "2025-2" },
      { kode: "IF1210", mataKuliah: "Algoritma dan Pemrograman 1", sifat: "W", sks: 3, nilai: "A", semesterPengambilan: "2025-2" },
      { kode: "WI2001", mataKuliah: "Pengenalan Rekayasa dan Desain", sifat: "W", sks: 3, nilai: "A", semesterPengambilan: "2025-2" },
      { kode: "WI2005", mataKuliah: "Bahasa Indonesia", sifat: "W", sks: 2, nilai: "A", semesterPengambilan: "2025-1" },
      { kode: "WI2011", mataKuliah: "Agama Islam", sifat: "W", sks: 2, nilai: "A", semesterPengambilan: "2025-2" },
      { kode: "WI2006", mataKuliah: "Kewarganegaraan", sifat: "W", sks: 2, nilai: "A", semesterPengambilan: "2025-2" },
      { kode: "WI2002", mataKuliah: "Literasi Data dan Inteligensi Artifisial", sifat: "W", sks: 2, nilai: "A", semesterPengambilan: "2025-2" },
      { kode: "WI2003", mataKuliah: "Olah Raga", sifat: "W", sks: 1, nilai: "P", semesterPengambilan: "2025-2" }
    ]
  }
];

export const pointConversion = {
  "A": 4.0,
  "AB": 3.5,
  "B": 3.0,
  "BC": 2.5,
  "C": 2.0,
  "D": 1.0,
  "E": 0.0,
  "P": "Pass",
  "F": "Fail"
};
