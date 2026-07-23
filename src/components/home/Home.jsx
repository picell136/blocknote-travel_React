import React, { useState } from 'react'
import { getTrips, createTrip } from '../../forStorage';
import { Form, Outlet, Link, useLoaderData, useSubmit } from 'react-router-dom';

import styles from "../../styles/Home.module.css"; 

export async function loader() {
    const trips = await getTrips();
    return { trips };
}

export async function action({ request }) {
	const formData = await request.formData();
	const name = formData.get("name");
    const day_1 = formData.get("day_1");
    const month_1 = formData.get("month_1");
    const year_1 = formData.get("year_1");
    const day_2 = formData.get("day_2");
    const month_2 = formData.get("month_2");
    const year_2 = formData.get("year_2");
        
    await createTrip({
        name: name,
        day_1: day_1,
        month_1: month_1,
        year_1: year_1,
        day_2: day_2,
        month_2: month_2,
        year_2: year_2,
    });
    
    // Возвращаем null, чтобы использовать текущий loader
    return null;
}

const Home = () => {
    const { trips } = useLoaderData();
    const submit = useSubmit();

    let date  = new Date();

    const [name, setName] = useState('');
    const [selectedDay_1, setSelectedDay_1] = useState(date.getDate());
    const [selectedMonth_1, setSelectedMonth_1] = useState(date.getMonth());
    const [selectedYear_1, setSelectedYear_1] = useState(date.getFullYear());
    const [selectedDay_2, setSelectedDay_2] = useState(date.getDate());
    const [selectedMonth_2, setSelectedMonth_2] = useState(date.getMonth());
    const [selectedYear_2, setSelectedYear_2] = useState(date.getFullYear()); 

    const [error, setError] = useState(null); 

    // Функция по нахождению кол-ва дней в месяце
    const daysInMonth_1 = () => {
        let daysInMonth = new Date(selectedYear_1, +selectedMonth_1 + 1, 0).getDate(); // кол-во дней в месяце 
        let arr = [];
        for (let i = 1; i <= daysInMonth; i++){
            arr.push(i)
        } 
        return arr   
    }

    const daysInMonth_2 = () => {
        let daysInMonth = new Date(selectedYear_2, +selectedMonth_2 + 1, 0).getDate(); // кол-во дней в месяце 
        let arr = [];
        for (let i = 1; i <= daysInMonth; i++){
            arr.push(i)
        } 
        return arr   
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
        
        const date1 = new Date(selectedYear_1, selectedMonth_1, selectedDay_1);
        const date2 = new Date(selectedYear_2, selectedMonth_2, selectedDay_2);
        
        if (date1 > date2) {
            setError('Дата начала не может быть позже даты окончания');
            return;
        }
        
        setError(null);
        
        // Создаем FormData с данными из состояния
        const formData = new FormData();
        formData.append('name', name);
        formData.append('day_1', selectedDay_1);
        formData.append('month_1', selectedMonth_1);
        formData.append('year_1', selectedYear_1);
        formData.append('day_2', selectedDay_2);
        formData.append('month_2', selectedMonth_2);
        formData.append('year_2', selectedYear_2);
        
        submit(formData, { method: 'post' });
    };

    return <div>
        <div>
            <h1>Путевые записки</h1>
        </div>
        <div id="menu">
            <Form method="post" onSubmit={handleSubmit}>
                <div>
                    <span>Название страны:</span>
                    <input 
                        placeholder="name" 
                        type="text" 
                        name="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <div className={styles.title}>Выберите период пребывания</div>        
                    <div>
                        <div className={styles.selects_text}> От: </div>
                        <label>
                            <select 
                                value={selectedDay_1} 
                                name="day_1" 
                                onChange={e => setSelectedDay_1(e.target.value)}
                            >
                                {daysInMonth_1(date.getMonth()).map(i => (
                                <option key={i} value={i}>
                                    {i}
                                </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <select 
                                value={selectedMonth_1}
                                name="month_1"
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
                                name="year_1"
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

                    <div className={styles.selects}>
                        <div className={styles.selects_text}> До: </div>
                        <label>
                            <select 
                                value={selectedDay_2} 
                                name="day_2" 
                                onChange={e => setSelectedDay_2(e.target.value)}
                            >
                                {daysInMonth_2(date.getMonth()).map(i => (
                                <option key={i} value={i}>
                                    {i}
                                </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            <select 
                                value={selectedMonth_2}
                                name="month_2"
                                onChange={e => setSelectedMonth_2(e.target.value)}
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
                                value={selectedYear_2}
                                name="year_2"
                                onChange={e => setSelectedYear_2(e.target.value)}
                            >
                                {yearOptions.map(year => (
                                <option key={year.value} value={year.value}>
                                    {year.text}
                                </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {error && (
                        <div style={{ color: 'red', padding: '10px', marginTop: '10px' }}>
                            ⚠️ {error}
                        </div>
                    )}

                </div>

                <button type="submit">add trip</button>
            </Form>

            <h2>Список поездок</h2>

            {trips && trips.length ? (
                <ul>
                    {trips.map((trip) => (
                        <li key={trip.id}>
                            <Link to={`trips/${trip.id}`}>
                                {trip.name ? ` ${trip.name} ` : <i> Unnamed </i>}
                                {trip.year_1}/{+trip.month_1 + 1}/{trip.day_1}
                                -
                                {trip.year_2}/{+trip.month_2 + 1}/{trip.day_2} 
                            </Link>
                        </li> 
                    ))}
                </ul>
            ) : (
                <p>
                    <i>no trips here ...</i>
                </p>
            )}
        </div>
        
    </div>
}

export default Home