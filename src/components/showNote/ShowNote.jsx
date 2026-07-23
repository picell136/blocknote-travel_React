import React from 'react'
import { getNote } from '../../forStorage';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

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
            <div>{note.name ? note.name : <i>unnamed</i>}</div>
            <div>
                <p>Name: {note.name ? note.name : <i>unnamed</i>}</p>
                <p>Date: {note.day}/{+note.month + 1}/{note.year}</p>
                <p>Description: {note.desc || <i>no description</i>}</p>
            </div>

            {note.photos && note.photos.length > 0 && (
                <div>
                    <h4>Photo(s):</h4>
                    {note.photos.map((photo, index) => (
                    <img 
                        key={index}
                        src={photo} 
                        alt={`photo ${index + 1}`}
                        style={{ width: '400px', margin: '5px' }}
                    />
                    ))}
                </div>
            )}

            <p>
                {/* <button onClick={() => navigate('edit')}> */}
                <button onClick={() => navigate(`/trips/${tripId}/${note.id}/edit`)}> 
                    edit
                </button>                
            </p>
            
            <p>
              <button onClick={() => navigate(`/trips/${tripId}`)}>back</button>  
            </p>

        </>
    );
}

export default ShowNote