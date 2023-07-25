import React from 'react';
import { useNavigate } from 'react-router';
import '../styles.scss';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home home--container">
        <h1 className="home home__title">gRPSeek</h1>
        <h3 className="home home__slogan">
          A POWERFUL VISUALIZATION TOOL FOR gRPC
        </h3>
        <Button
          variant="contained"
          onClick={() => navigate('/main')}
          style={{ backgroundColor: 'teal', color: 'white' }}
        >
          Start Seeking
        </Button>
        <Link to="additem">Add Item Page</Link>
      </div>
    </div>
  );
};

export default Home;
