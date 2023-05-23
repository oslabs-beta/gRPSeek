import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import "../../styles.scss";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  return (
      <div className="navbar--container">
        <ButtonGroup
          size="large"
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            className="button button--primary"
            style={{width: '10rem'}}
            onClick={() => {
              navigate("/client");
            }}
          >
            Client
          </Button>
          <Button
            className="button button--primary"
            style={{width: '10rem'}}
            onClick={() => {
              navigate("/server");
            }}
          >
            Server
          </Button>
        </ButtonGroup>
      </div>
  );
};

export default NavBar;
