import {
  collection, addDoc, getDocs, deleteDoc,
  doc, updateDoc, query, where,
} from "firebase/firestore";

const COL = "appointments";

const getDb = async () => {
  const { db } = await import("../firebase");
  return db;
};

export const addAppointment = async (appointment) => {
  const db = await getDb();
  const docRef = await addDoc(collection(db, COL), {
    ...appointment,
    bookedAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const getAllAppointments = async () => {
  const db = await getDb();
  const snap = await getDocs(collection(db, COL));
  const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
};

export const getUserAppointments = async (userId) => {
  const db = await getDb();
  const q = query(collection(db, COL), where("userId", "==", userId));
  const snap = await getDocs(q);
  const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return data.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
};

export const getDoctorAppointments = async (doctorId) => {
  const db = await getDb();
  const q = query(collection(db, COL), where("doctorId", "==", doctorId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteAppointment = async (id) => {
  const db = await getDb();
  await deleteDoc(doc(db, COL, id));
};

export const updateAppointment = async (id, newData) => {
  const db = await getDb();
  await updateDoc(doc(db, COL, id), newData);
};