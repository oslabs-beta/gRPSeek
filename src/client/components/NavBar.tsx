import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles.scss';
import logoImg from './assets/logo.png';

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="nav-bar">
      <div className="logo-container">
        <img src={logoImg} className="logo-img"></img>
      </div>
      <div className="navbar-buttons">
        <button
          className="dashboard-button"
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>
        <button className="tree-button" onClick={() => navigate('/treemap')}>
          Tree
        </button>
      </div>
    </div>
  );
};
export default NavBar;
