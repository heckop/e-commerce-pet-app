import PageContent from '../components/PageContent';
import petimg from './pic.jpg';

function HomePage() {
  return (
    <PageContent title="Welcome!">
      <p>Browse all our amazing pets!</p>
      <img src={petimg} alt="Home pet" height={1000} width={1200}></img>
    </PageContent>
  );
}

export default HomePage;
