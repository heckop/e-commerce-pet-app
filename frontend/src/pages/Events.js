import { Suspense } from 'react';
import { useLoaderData, json, defer, Await } from 'react-router-dom';
import Axios from 'axios';
import { useState } from 'react';

import EventsList from '../components/EventsList';
function EventsPage() {
  let { events } = useLoaderData();
  // const [pets, setEvents] = useState([]); // Create a copy of the data
  //  events.then((data)=>{
  //   setEvents(data);
  // });
  const filterbyprice = () => {
    // const sortedEvents = pets.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    // setEvents(sortedEvents);
    // console.log(pets);
  };
  
  return (
    <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
      <button style={{ marginLeft: '1000px' }} onClick={filterbyprice}>Filter by price</button>
      <Await resolve={events}>
        {(loadedEvents) => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
  );
}

export default EventsPage;

async function loadEvents() {
  const clientId = process.env.CLIENT_SECRET_KEY;
  const url = "https://api.unsplash.com/search/photos?query=animal&client_id="+clientId+"&per_page=100";
  var res;
  await Axios.get(url).then(
    (response) => {
      res=response;
      console.log(response.data);
    }
  ).catch((err)=>{
    throw json(
      { message: err.message },
      {
        status: err.status,
      }
    );
  });

  const pricearray = [];
  for (let i = 0; i < 100; i++) {
    const price = ((10 + Math.ceil((Math.random()*100))%100)).toString();
    pricearray.push(price);
  }
  pricearray.sort();
  let i = 0;
  const pets = res.data.results.map((pet)=>{
  const price = pricearray[i];
  i++;
  const originalDate = new Date(pet.created_at);
  const dateObj = new Date(originalDate);
  const day = dateObj.getUTCDate();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getUTCFullYear();
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getUTCSeconds();
  const pet_date = `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
    return {
      type:pet.tags[1].title,
      id: pet.id,
      title: pet.alt_description,
      description: pet.description,
      image: pet.urls.small,
      date: pet_date,
      price: price,
    };
  });
  return pets;
}

export function loader() {
  return defer({
    events :loadEvents(),
  });
}
