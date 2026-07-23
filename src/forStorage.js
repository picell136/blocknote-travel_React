import localforage from 'localforage';
import { nanoid } from 'nanoid'

export async function getTrips() {
	let trips = await localforage.getItem('trips');
	if (!trips) trips = [];
	return trips;
}

export async function createTrip(trip) {
	let allTrips = await localforage.getItem('trips');
    if (!allTrips) allTrips = [];
    
    // Генерируем ID если его нет
    const newTrip = {
        ...trip,
        id: trip.id || nanoid(5)
    };

    allTrips.push(newTrip);
    await localforage.setItem('trips', allTrips);
    return newTrip;
}

function setTrips(trips) {
	return localforage.setItem('trips', trips);
}

export async function getTrip(id) {
	let trips = await localforage.getItem('trips');
	let trip = trips.find((trip) => trip.id === id);
	return trip ?? null;
}

export async function updateTrip(id, updates) {
	let trips = await localforage.getItem('trips');
	let trip = trips.find((trip) => trip.id === id);
	if (!trip) throw new Error('No trip found for this', id);
	Object.assign(trip, updates);
	await setTrips(trips);
	return trip;
}

//

export async function getNotes(tripId) {
    let allNotes = await localforage.getItem('notes');
    if (!allNotes) allNotes = [];
    return allNotes.filter(note => note.tripId === tripId);
}

export async function getNote(noteId) {
  const allNotes = await localforage.getItem('notes');
  if (!allNotes) return null;
  const note = allNotes.find(note => note.id === noteId);
  return note;
}

export async function createNote(note) {
    let allNotes = await localforage.getItem('notes');
    if (!allNotes) allNotes = [];
    
    // Генерируем ID если его нет
    const newNote = {
        ...note,
        id: note.id || nanoid(8)
    };

    allNotes.push(newNote);
    await localforage.setItem('notes', allNotes);
    return newNote;
}

function setNotes(notes) {
	return localforage.setItem('notes', notes);
}

export async function updateNote(id, updates) {
	let notes = await localforage.getItem('notes');
	let note = notes.find((note) => note.id === id);
	if (!note) throw new Error('No note found for this', id);
	Object.assign(note, updates);
	await setNotes(notes);
	return note;
}

export async function deleteNote(id) {
    const allNotes = await localforage.getItem('notes');
    console.log('All notes:', allNotes);
    
    if (!allNotes) {
        console.log('No notes found in storage');
        return false;
    }
    
    const filteredNotes = allNotes.filter(note => note.id !== id);
    console.log('Filtered notes count:', filteredNotes.length);
    
    await localforage.setItem('notes', filteredNotes);
    
    return true;
}

///

// Сохраняем фото в localforage и возвращаем сгенерированный ключ
export async function savePhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result; 
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function getPhoto(key) {
  return await localforage.getItem(key);
}
