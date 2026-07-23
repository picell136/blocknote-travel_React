import React, { useRef, useState, useEffect } from 'react'
import { getTrip, getNotes, createNote, savePhoto, deleteNote } from '../../forStorage';
import { Outlet, useLoaderData, useNavigate, Link, useSubmit, useActionData, useParams } from 'react-router-dom';
import { Form } from 'react-router-dom';

import styles from "../../styles/Trip.module.css"; 

export async function loader({ params }) {
    const trip = await getTrip(params.tripId);
    const notes = await getNotes(params.tripId);

    // Сортируем заметки по убыванию даты (новые → старые)
    const sortedNotes = [...notes].sort((a, b) => {
        // Приводим к числам на случай, если приходят строки
        const yearA = Number(a.year) || 0;
        const monthA = Number(a.month) || 0;
        const dayA = Number(a.day) || 0;
        const yearB = Number(b.year) || 0;
        const monthB = Number(b.month) || 0;
        const dayB = Number(b.day) || 0;

        // Сначала сравниваем годы (убывание)
        if (yearA !== yearB) return yearB - yearA;
        // Если годы равны – сравниваем месяцы
        if (monthA !== monthB) return monthB - monthA;
        // И наконец дни
        return dayB - dayA;
    });

    return { trip, notes: sortedNotes };
}

export async function action({ request, params }) {
    const formData = await request.formData();
    const intent = formData.get("intent");
    
    if (intent === "delete") {
        const noteId = formData.get("noteId");
        await deleteNote(noteId, params.tripId);
        
        // Получаем обновленный список заметок
        const updatedNotes = await getNotes(params.tripId);
        const sortedNotes = [...updatedNotes].sort((a, b) => {
            const yearA = Number(a.year) || 0;
            const monthA = Number(a.month) || 0;
            const dayA = Number(a.day) || 0;
            const yearB = Number(b.year) || 0;
            const monthB = Number(b.month) || 0;
            const dayB = Number(b.day) || 0;

            if (yearA !== yearB) return yearB - yearA;
            if (monthA !== monthB) return monthB - monthA;
            return dayB - dayA;
        });
        
        return { notes: sortedNotes, success: true };
    }
    
    // Создание заметки
    const name = formData.get("name");
    const desc = formData.get("desc");
    const day = formData.get("day");
    const month = formData.get("month");
    const year = formData.get("year");
    
    const photosString = formData.get("photos");
    
    let photos = [];
    if (photosString) {
        photos = photosString.split('###_SEPARATOR_###').filter(p => p.trim() !== '');
    }

    await createNote({
        name: name,
        desc: desc,
        day: day,
        month: month,
        year: year,
        tripId: params.tripId,
        photos, 
    });

    // Возвращаем обновленные данные после создания
    const updatedNotes = await getNotes(params.tripId);
    const sortedNotes = [...updatedNotes].sort((a, b) => {
        const yearA = Number(a.year) || 0;
        const monthA = Number(a.month) || 0;
        const dayA = Number(a.day) || 0;
        const yearB = Number(b.year) || 0;
        const monthB = Number(b.month) || 0;
        const dayB = Number(b.day) || 0;

        if (yearA !== yearB) return yearB - yearA;
        if (monthA !== monthB) return monthB - monthA;
        return dayB - dayA;
    });
    
    return { notes: sortedNotes, success: true };
}

const Trip = () => {
    const { trip, notes: loaderNotes } = useLoaderData();
    const actionData = useActionData();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const submit = useSubmit();

    // const { tripId } = useParams();

    // Используем заметки из actionData если они есть, иначе из loaderData
    const [notes, setNotes] = useState(loaderNotes);
    const [photos, setPhotos] = useState([]); // массив base64-строк
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    // Обновляем заметки когда приходят новые данные из action
    useEffect(() => {
        if (actionData?.notes) {
            setNotes(actionData.notes);
            // Очищаем форму после успешного создания
            if (actionData.success) {
                setName('');
                setDesc('');
                setPhotos([]);
            }
        }
    }, [actionData]);

    

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const base64 = await savePhoto(file);
            setPhotos(prev => [...prev, base64]); // добавляем base64 в массив
            e.target.value = null; // очищаем input
        } catch (error) {
            console.error('Ошибка сохранения фото:', error);
        }
    };

    let date  = new Date();

    const [selectedDay_1, setSelectedDay_1] = useState(date.getDate());
    const [selectedMonth_1, setSelectedMonth_1] = useState(date.getMonth());
    const [selectedYear_1, setSelectedYear_1] = useState(date.getFullYear());

    const [error, setError] = useState(null); 

    // Функция по нахождению кол-ва дней в месяце
    const daysInMonth = (month) => {
        let daysInMonth = new Date(selectedYear_1, +month + 1, 0).getDate(); // кол-во дней в месяце 
        let arr = [];
        for (let i = 1; i <= daysInMonth; i++){
        arr.push(i)
        } 
        return arr   
    }

    const shortDesc = (desc) => {
        if (desc.length <= 7) return desc;
        let truncated = desc.slice(0, 7);
        return truncated + '...';
    }

    const monthOptions = [
        {value: '0', text: 'января'},
        {value: '1', text: 'февраля'},
        {value: '2', text: 'марта'},
        {value: '3', text: 'апреля'},
        {value: '4', text: 'мая'},
        {value: '5', text: 'июня'},
        {value: '6', text: 'июля'},
        {value: '7', text: 'августа'},
        {value: '8', text: 'сентября'},
        {value: '9', text: 'октября'},
        {value: '10', text: 'ноября'},
        {value: '11', text: 'декабря'}
    ];

    const yearOptions = [
        {value: '2010', text: '2010'},
        {value: '2011', text: '2011'},
        {value: '2012', text: '2012'},
        {value: '2013', text: '2013'},
        {value: '2014', text: '2014'},
        {value: '2015', text: '2015'},
        {value: '2016', text: '2016'},
        {value: '2017', text: '2017'},
        {value: '2018', text: '2018'},
        {value: '2019', text: '2019'},
        {value: '2020', text: '2020'},
        {value: '2021', text: '2021'},
        {value: '2022', text: '2022'},
        {value: '2023', text: '2023'},
        {value: '2024', text: '2024'},
        {value: '2025', text: '2025'},
        {value: '2026', text: '2026'},
        {value: '2027', text: '2027'},
        {value: '2028', text: '2028'},
        {value: '2029', text: '2029'},
        {value: '2030', text: '2030'}
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const date = new Date(selectedYear_1, selectedMonth_1, selectedDay_1);
        const date1 = new Date(trip.year_1, trip.month_1, trip.day_1);
        const date2 = new Date(trip.year_2, trip.month_2, trip.day_2);
        
        if (date < date1 || date > date2) {
            setError('Дата должна быть в рамках даты поездки');
            return;
        }
        
        setError(null);
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('desc', desc);
        formData.append('day', selectedDay_1);
        formData.append('month', selectedMonth_1);
        formData.append('year', selectedYear_1);

        const photosString = photos.join('###_SEPARATOR_###');
        formData.append('photos', photosString);
        
        submit(formData, { method: 'post' });
    };

    // Функция для удаления заметки
    const handleDeleteNote = (noteId) => {
        const formData = new FormData();
        formData.append('intent', 'delete');
        formData.append('noteId', noteId);
        
        submit(formData, { method: 'post' });
    };


    return (
        <>
            <div>
                <h2>Поездка</h2>
            </div>
            <div>
                <p><strong>Страна</strong>: {trip.name ? trip.name : <i>unnamed</i>}</p>
            </div>
            <div>
                <p><strong>Даты пребывания</strong>: {trip.year_1}/{+trip.month_1 + 1}/{trip.day_1}-{trip.year_2}/{+trip.month_2 + 1}/{trip.day_2} </p>
            </div>
            
            <p>
                <button onClick={() => navigate('edit')}>
                    Редактировать поездку
                </button>                
            </p>

            <hr></hr>

            <div>
                <h2>Заметки</h2>
            </div>

            {notes && notes.length > 0 ? (
                <ul>
                    {notes.map((note) => (
                        <li key={note.id}>
                            <Link to={`/trips/${trip.id}/${note.id}`}>
                                {note.year}/{+note.month + 1}/{note.day} 
                                {note.name ? ` ${note.name} ` : <i>Unnamed</i>} 
                                {note.desc ? ` ${shortDesc(note.desc)} ` : <i>No description</i>}
                            </Link>

                            {note.photos && note.photos.length > 0 && (
                                <img
                                    src={note.photos[0]} // первое фото
                                    alt="preview"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginLeft: '10px', marginRight: '10px' }}
                                />
                            )}

                            <button onClick={() => handleDeleteNote(note.id)}>
                                Удалить
                            </button>

                            <button 
                                onClick={() => navigate(`${note.id}/edit`)}
                                className={styles.button}
                                >
                                Редактировать заметку
                            </button>

                        </li> 
                    ))}
                </ul>
            ) : (
                <p>
                    <i>здесь нет заметок ...</i>
                </p>
            )}

            <Form method="post" onSubmit={handleSubmit}>
                <div>
                    <span><strong>Заметка:</strong></span>
                    <input 
                        placeholder="Название заметки" 
                        type="text" 
                        name="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <span className={styles.desc}><strong>Описание:</strong></span>
                    <textarea
                        placeholder="Описание"
                        type="text"
                        name="desc"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    >
                    </textarea>
                </div>

                <div>
                    <label>
                        <select 
                            value={selectedDay_1} 
                            name="day" 
                            onChange={e => setSelectedDay_1(e.target.value)}
                        >
                            {daysInMonth(selectedMonth_1).map(i => (
                            <option key={i} value={i}>
                                {i}
                            </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <select 
                            value={selectedMonth_1}
                            name="month"
                            onChange={e => setSelectedMonth_1(e.target.value)}
                        >
                            {monthOptions.map(month => (
                            <option key={month.value} value={month.value}>
                                {month.text}
                            </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <select 
                            value={selectedYear_1}
                            name="year"
                            onChange={e => setSelectedYear_1(e.target.value)}
                        >
                            {yearOptions.map(year => (
                            <option key={year.value} value={year.value}>
                                {year.text}
                            </option>
                            ))}
                        </select>
                    </label>
                </div>
                <input type="hidden" name="photos" value={photos.join('###_SEPARATOR_###')} />

                <p>
                    <button type="button" onClick={() => fileInputRef.current.click()}>
                        Добавить фото
                    </button>                
                </p>

                <button type="submit">Добавить заметку</button> 
            </Form>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            {photos.length > 0 && <span>Загружено фото: {photos.length} шт. </span>}

            <p>
                <button onClick={() => navigate(`/`)}>Назад</button>
            </p>
            
            {error && (
                <div style={{ color: 'red', padding: '10px', marginTop: '10px' }}>
                    ⚠️ {error}
                </div>
            )}
        </>
    );
}

export default Trip