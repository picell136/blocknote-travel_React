import { useState } from 'react'

import { getTrip, updateTrip } from '../../forStorage';
import { Form, useLoaderData, useNavigate, redirect, useParams } from 'react-router-dom';

import styles from "../../styles/EditTrip.module.css"; 

export async function action({ request, params }) {
	const formData = await request.formData();
	const name = formData.get('name');
	const day_1 = formData.get('day_1');
	const month_1 = formData.get('month_1');
	const year_1 = formData.get('year_1');
    const day_2 = formData.get('day_2');
	const month_2 = formData.get('month_2');
	const year_2 = formData.get('year_2');
	
	await updateTrip(params.tripId, {
		name,
		day_1,
		month_1,
		year_1,
        day_2,
		month_2,
		year_2,
	});
	
    return redirect(`/trips/${params.tripId}`);
}

export async function loader({ params }) {
	const trip = await getTrip(params.tripId);
	return { trip };
}

const EditTrip = () => {

    const navigate = useNavigate();
    const { trip } = useLoaderData();
    const { tripId } = useParams();

    let date  = new Date();

    const [selectedDay_1, setSelectedDay_1] = useState(trip.day_1);
    const [selectedMonth_1, setSelectedMonth_1] = useState(trip.month_1);
    const [selectedYear_1, setSelectedYear_1] = useState(trip.year_1);
    const [selectedDay_2, setSelectedDay_2] = useState(trip.day_2);
    const [selectedMonth_2, setSelectedMonth_2] = useState(trip.month_2);
    const [selectedYear_2, setSelectedYear_2] = useState(trip.year_2); 

    // Функция по нахождению кол-ва дней в месяце
    const daysInMonth = (month) => {
        let daysInMonth = new Date(date.getFullYear(), +month + 1, 0).getDate(); // кол-во дней в месяце 
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


	return <>
                <div>
                    <h2>Редактирование поездки</h2>
                </div>
                <Form method="post" id="trip-form">
                    <div>
                        <span>Поездка:</span>
                        <input 
                            placeholder="name" 
                            type="text" 
                            name="name" 
                            defaultValue={trip.name}
                        />
                    </div>

                    <div className={styles.dates}>
                        <div className={styles.title}>Выберите период</div>        
                        <div className={styles.selects}>
                            <div className={styles.selects_text}> От: </div>
                            <label>
                            <select 
                                name="day_1"
                                defaultValue={selectedDay_1} 
                                onChange={e => setSelectedDay_1(e.target.value)}
                            >
                                {daysInMonth(date.getMonth()).map(i => (
                                <option key={i} value={i}>
                                    {i}
                                </option>
                                ))}
                            </select>
                            </label>
                            <label>
                            <select 
                                name="month_1"
                                defaultValue={selectedMonth_1}
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
                                name="year_1"
                                defaultValue={selectedYear_1}
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
                            <div className={styles.selects_text}>До:</div>
                            <label>
                                <select 
                                    name="day_2"
                                    defaultValue={selectedDay_2} 
                                    onChange={e => setSelectedDay_2(e.target.value)}
                                >
                                {daysInMonth(date.getMonth()).map(i => (
                                    <option key={i} value={i}>
                                    {i}
                                    </option>
                                ))}
                                </select>
                            </label>
                            <label>
                                <select 
                                    name="month_2"
                                    defaultValue={selectedMonth_2}
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
                                    name="year_2" 
                                    defaultValue={selectedYear_2} 
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
                    </div>

                    <p>
                        <button type="submit">save</button>
                    </p>
                    <p>
                        <button type="button" onClick={() => navigate(`/trips/${tripId}`)}>Cancel</button>  
                    </p>
                </Form>
            </>
}

export default EditTrip;