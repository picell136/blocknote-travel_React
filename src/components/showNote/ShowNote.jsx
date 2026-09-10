import React from 'react'
import { getNote } from '../../forStorage';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

import styles from "../../styles/ShowNote.module.css";

export async function loader({ params }) {
  const note = await getNote(params.noteId);
  if (!note) {
    throw new Response('Not Found', { status: 404 });
  }
  return { note };
}

const ShowNote = () => {
    const { note } = useLoaderData();
    const navigate = useNavigate();
    const { tripId } = useParams();

    return (
        <>  
            <div className={styles.info}>
                <h1>{note.name ? note.name : <i>unnamed</i>}</h1>
                <div>
                    <p>Дата: {note.day}/{+note.month + 1}/{note.year}</p>
                    <p>Описание: {note.desc || <i>Нет описания</i>}</p>
                </div>
            </div>

            {note.photos && note.photos.length > 0 && (
                <div>
                    <h4>Фото / изображения:</h4>
                    <div className={styles.photos}>
                        {note.photos.map((photo, index) => (
                        <img 
                            key={index}
                            className={styles.photo}
                            src={photo} 
                            alt={`photo ${index + 1}`}
                        />
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.actions}>
                <button onClick={() => navigate(`/trips/${tripId}/${note.id}/edit`)}> 
                    Редактировать
                </button>                
                <button onClick={() => navigate(`/trips/${tripId}`)}>Назад</button>  
            </div>

        </>
    );
}

export default ShowNote