import { Suspense } from 'react';
import { useLoaderData, json, defer, Await } from 'react-router-dom';
import Axios from 'axios';

import FavList from '../components/FavList';

function FavPage() {
  const loaderData = useLoaderData();
  if (!loaderData || !loaderData.events) {
    return (
        <p style={{ textAlign: 'center' }}>No Favourite Pets</p>
    );
} else {
  const { events } = loaderData;
  return (
  <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
      <Await resolve={events}>
        {(loadedEvents) => <FavList events={loadedEvents} />}
      </Await>
    </Suspense>
  );
}
}

export default FavPage;

async function loadEvents() {
  const userId = localStorage.getItem('userId');
  const url = "http://localhost:8080/favourites?userId="+userId;
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
  const pets = res.data.events.map((pet)=>{
    return {
        type:pet.type,
      id: pet.id,
      title: pet.title,
      description: pet.description,
      image: pet.image,
      date: pet.date,
    };
  });
  return pets;
}

export function loader() {
  return defer({
    events: loadEvents(),
  });
}
