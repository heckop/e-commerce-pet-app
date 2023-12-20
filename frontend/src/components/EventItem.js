import { Link, useRouteLoaderData, useSubmit } from 'react-router-dom';
import { useState } from 'react';
import classes from './EventItem.module.css';
import { getAuthToken } from '../util/auth';
import {json, redirect} from 'react-router-dom';

function EventItem({ event }) {
  const [color, setColor] = useState("#FFFFFF");
  const token = useRouteLoaderData('root');
  const submit = useSubmit();
  const originalDate = new Date(event.date);
  const dateObj = new Date(originalDate);
  const day = dateObj.getUTCDate();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getUTCFullYear();
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getUTCSeconds();
  event.date = `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;              

   async function addFavouritePet() {
    setColor("#FFD700");
    const eventData = {
      type: event.type,
      id: event.petId,
    title: event.title,
    image: event.image,
    date: event.date,
    description: event.description,
  };
  const userId = localStorage.getItem('userId');
  console.log(userId);
  let url = 'http://localhost:8080/events/add-favourite';

  const token = getAuthToken();
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body:JSON.stringify({
      eventData:eventData,
      userId: userId
    }),
  });
  if (response.status === 422) {
    return response;
  }
  console.log(response);

  if (!response.ok) {
    throw json({ message: 'Could not favourite pet.' }, { status: 500 });
  }
  window.alert("pet added to favourites");
  return redirect('/events/'+event.id);
  }

  return (
    <article className={classes.event}>
      <img src={event.image} alt={event.title} />
      <h1 style={{ color: 'skyblue' }}>{event.type}</h1>
      <h1>{event.title}</h1>
      <time>This pet became a part of our journey on {event.date}</time>
      <p style={{ fontWeight: 'bold' }}>{event.description}</p>
      {token && (
        <menu className={classes.actions}>
          <svg id="fav-pet"  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={color} class="bi bi-star" viewBox="0 0 16 16">
          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"
           />
          </svg>
          
          <button onClick={addFavouritePet} >Favourite</button>
        </menu>
      )}
    </article>
  );
}

export default EventItem;
