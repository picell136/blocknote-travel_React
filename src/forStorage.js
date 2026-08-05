import localforage from 'localforage';
import { nanoid } from 'nanoid';

// =================== TRIPS ===================

export async function getTrips() {
    let trips = await localforage.getItem('trips');
    // localforage возвращает уже объект/массив, JSON.parse НЕ нужен!
    return Array.isArray(trips) ? trips : [];
}

export async function createTrip(trip) {
    let allTrips = await localforage.getItem('trips');
    if (!Array.isArray(allTrips)) allTrips = [];

    const newTrip = {
        ...trip,
        id: trip.id || nanoid(5),
    };

    allTrips.push(newTrip);
    await localforage.setItem('trips', allTrips);
    return newTrip;
}

export async function getTrip(id) {
    let trips = await localforage.getItem('trips');
    if (!Array.isArray(trips)) return null;
    return trips.find((trip) => trip.id === id) ?? null;
}

export async function updateTrip(id, updates) {
    let trips = await localforage.getItem('trips');
    if (!Array.isArray(trips)) trips = [];

    let trip = trips.find((trip) => trip.id === id);
    if (!trip) throw new Error('No trip found for this id: ' + id);

    Object.assign(trip, updates);
    await localforage.setItem('trips', trips);
    return trip;
}

export async function deleteTrip(tripId) {
    // ✅ Работаем с localforage, а НЕ с localStorage
    const trips = await getTrips();
    const updatedTrips = trips.filter((trip) => trip.id !== tripId);
    await localforage.setItem('trips', updatedTrips);

    // Удаляем все заметки этой поездки
    try {
        const allNotes = await localforage.getItem('notes');
        if (Array.isArray(allNotes)) {
            const updatedNotes = allNotes.filter((note) => note.tripId !== tripId);
            await localforage.setItem('notes', updatedNotes);
        }
    } catch (error) {
        console.error('Ошибка при удалении заметок:', error);
    }

    return true;
}

// =================== NOTES ===================

export async function getNotes(tripId) {
    let allNotes = await localforage.getItem('notes');
    if (!Array.isArray(allNotes)) allNotes = [];
    return allNotes.filter((note) => note.tripId === tripId);
}

export async function getNote(noteId) {
    const allNotes = await localforage.getItem('notes');
    if (!Array.isArray(allNotes)) return null;
    return allNotes.find((note) => note.id === noteId) ?? null;
}

export async function createNote(note) {
    let allNotes = await localforage.getItem('notes');
    if (!Array.isArray(allNotes)) allNotes = [];

    const newNote = {
        ...note,
        id: note.id || nanoid(8),
    };

    allNotes.push(newNote);
    await localforage.setItem('notes', allNotes);
    return newNote;
}

export async function updateNote(id, updates) {
    let notes = await localforage.getItem('notes');
    if (!Array.isArray(notes)) notes = [];

    let note = notes.find((note) => note.id === id);
    if (!note) throw new Error('No note found for this id: ' + id);

    Object.assign(note, updates);
    await localforage.setItem('notes', notes);
    return note;
}

export async function deleteNote(id) {
    const allNotes = await localforage.getItem('notes');
    if (!Array.isArray(allNotes)) return false;

    const filteredNotes = allNotes.filter((note) => note.id !== id);
    await localforage.setItem('notes', filteredNotes);
    return true;
}

// =================== PHOTOS ===================

export async function savePhoto(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function getPhoto(key) {
    return await localforage.getItem(key);
}