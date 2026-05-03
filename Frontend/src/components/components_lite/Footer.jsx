import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      {/* Footer for the current page */}
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#343131ff",
        }}
      >
        <p>©All rights reserved.</p>
        
        <p>
          <Link to={"/privacy-policy"}>Privacy Policy </Link> |
          <Link to={"/terms-of-service"}> Terms of Service</Link>
        </p>
      </div>
    </div>
  );
};

export default Footer;
