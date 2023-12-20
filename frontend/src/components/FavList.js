// import { useLoaderData } from 'react-router-dom';
import { Link } from 'react-router-dom';

import classes from './FavList.module.css';

function FavList({events}) {
  // const events = useLoaderData();
  const url = "http://localhost:3000/";
  return (
    <div className={classes.events}>
      <h1>All Favourite Pets</h1>
      <ul className={classes.list}>
        {events.map((event) => (
          <li key={event.id} className={classes.item}>
            <Link to={`${url}favourites`}>
              <img src={event.image} alt={event.title} />
              <div className={classes.content}>
                <h1 style={{ color: 'skyblue' }}>{event.type}</h1>
                <h2>{event.title}</h2>
                <time>This pet became our family on {event.date}</time>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavList;
