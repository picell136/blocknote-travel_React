import React, { useState } from 'react'
import { getNote, updateNote } from '../../forStorage';
import { useLoaderData, useNavigate, useParams, Form, useSubmit, redirect } from 'react-router-dom';

import styles from "../../styles/EditNote.module.css"; 

export async function loader({ params }) {
	const note = await getNote(params.noteId);
	if (!note) {
		throw new Response('Not Found', { status: 404 });
	}
	return { note };
}

export async function action({ request, params }) {
	const formData = await request.formData();
	const name = formData.get('name');
	const desc = formData.get('desc');
	const day = formData.get('day');
	const month = formData.get('month');
	const year = formData.get('year');
	
	await updateNote(params.noteId, {
		name,
		desc,
		day,
		month,
		year,
	});
	
    return redirect(`/trips/${params.tripId}/${params.noteId}`);
}

const EditNote = () => {
    const { note } = useLoaderData();
	const navigate = useNavigate();
	const submit = useSubmit();
	const { tripId } = useParams();

	const [name, setName] = useState(note.name || '');
	const [desc, setDesc] = useState(note.desc || '');
	const [day, setDay] = useState(note.day || '');
	const [month, setMonth] = useState(note.month || '');
	const [year, setYear] = useState(note.year || '');

	const handleSubmit = (e) => {
		e.preventDefault();
		
		const formData = new FormData();
		formData.append('name', name);
		formData.append('desc', desc);
		formData.append('day', day);
		formData.append('month', month);
		formData.append('year', year);
		
		submit(formData, { method: 'post' });
	};

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

	const daysInMonth = (month) => {
        let daysInMonth = new Date(year, +month + 1, 0).getDate(); // кол-во дней в месяце 
        let arr = [];
        for (let i = 1; i <= daysInMonth; i++){
        arr.push(i)
        } 
        return arr   
    }

    return (
        <>
			<Form method="post" onSubmit={handleSubmit}>
				<div>
					<span>Название:</span>
					<input 
						type="text" 
						name="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				
				<div>
					<span className={styles.desc}>Описание:</span>
					<textarea 
						type="text" 
						name="desc"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
					/>
				</div>

				<div>
                    <label>
                        <select 
                            value={day} 
                            name="day" 
                            onChange={e => setDay(e.target.value)}
                        >
                            {daysInMonth(month).map(i => (
                            <option key={i} value={i}>
                                {i}
                            </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <select 
                            value={month}
                            name="month"
                            onChange={e => setMonth(e.target.value)}
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
                            value={year}
                            name="year"
                            onChange={e => setYear(e.target.value)}
                        >
                            {yearOptions.map(year => (
                            <option key={year.value} value={year.value}>
                                {year.text}
                            </option>
                            ))}
                        </select>
                    </label>
                </div>
				
				<div style={{ marginTop: '10px' }}>
					<button 
                        type="submit"
                    >
                        Сохранить
                    </button>
					<button 
						type="button" 
						onClick={() => navigate(`/trips/${tripId}/${note.id}`)}
						style={{ marginLeft: '10px' }}
					>
						Отмена
					</button>
				</div>
			</Form>
        </>
    );
}

export default EditNote